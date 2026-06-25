import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { writeAuditLog } from '@/lib/audit'
import { buildQuestionSignature, enrichChatboxMetadata } from '@/lib/chatbox-analytics'
import { sendChatboxBadAlertEmail } from '@/lib/chatbox-bad-alert-email'
import {
  chatboxCorsHeaders,
  getChatboxAllowedOrigin,
  getChatboxAllowedOrigins,
  isAllowedChatboxSource,
  isAuthorizedChatboxRequest,
} from '@/lib/chatbox-access'

const MAX_BODY_SIZE = 32_000
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60_000
const DEFAULT_RATE_LIMIT_MAX = 40
const PROBLEM_TYPES = [
  'DUPLICATE',
  'USER_REPORTED',
  'MISUNDERSTANDING',
  'LOST_CONTEXT',
  'USER_NEGATIVE_FEEDBACK',
  'FALLBACK',
  'OTHER',
] as const
const REVIEW_STATUSES = ['UNTREATED', 'TREATED'] as const
const NEGATIVE_FEEDBACK_RULES = [
  { type: 'MISUNDERSTANDING', phrases: ['tu nas pas repondu', 'tu n as pas repondu', 'ce nest pas ma question', 'ce n est pas ma question', 'tu reponds a cote', 'tu nas pas compris', 'tu n as pas compris'] },
  { type: 'LOST_CONTEXT', phrases: ['relis ma question', 'ce nest pas ce que jai demande', 'ce n est pas ce que j ai demande', 'pourquoi tu me parles de ca'] },
  { type: 'USER_NEGATIVE_FEEDBACK', phrases: ['cest faux', 'c est faux', 'nimporte quoi', 'n importe quoi'] },
] as const

const globalForChatbox = globalThis as unknown as {
  chatboxLogRateLimit?: Map<string, { count: number; resetAt: number }>
}

const cleanText = (value: string) =>
  value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const schema = z.object({
  source: z.string().min(1).max(80).transform(cleanText).pipe(z.string().regex(/^[a-z0-9][a-z0-9:_./-]*$/i)),
  conversationId: z.string().max(160).transform(cleanText).optional().nullable(),
  visitorId: z.string().max(160).transform(cleanText).pipe(z.string().regex(/^[a-z0-9:_-]+$/i)).optional().nullable(),
  sessionId: z.string().max(160).transform(cleanText).pipe(z.string().regex(/^[a-z0-9:_-]+$/i)).optional().nullable(),
  questionSignature: z.string().max(220).transform(cleanText).optional().nullable(),
  userName: z.string().max(120).transform(cleanText).optional().nullable(),
  userEmail: z.string().max(180).transform(cleanText).pipe(z.string().email()).optional().nullable(),
  userPrompt: z.string().min(1).max(8000).transform(cleanText),
  assistantResponse: z.string().max(16000).transform(cleanText).optional().nullable(),
  quality: z.enum(['UNKNOWN', 'GOOD', 'BAD']).default('UNKNOWN'),
  qualityNotes: z.string().max(2000).transform(cleanText).optional().nullable(),
  problemType: z.enum(PROBLEM_TYPES).default('OTHER'),
  reviewStatus: z.enum(REVIEW_STATUSES).optional(),
  metadata: z.unknown().optional(),
})

export async function OPTIONS(req: NextRequest) {
  const allowed = getChatboxAllowedOrigin(req)
  if (getChatboxAllowedOrigins().length > 0 && !allowed) {
    return json(req, { error: 'Origine non autorisee' }, { status: 403 })
  }

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req),
  })
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedChatboxRequest(req)) {
    return json(req, { error: 'Non autorise' }, { status: 401 })
  }

  const contentLength = Number(req.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_SIZE) {
    return json(req, { error: 'Payload trop volumineux' }, { status: 413 })
  }

  const contentType = req.headers.get('content-type') ?? ''
  if (contentType && !contentType.toLowerCase().includes('application/json')) {
    return json(req, { error: 'Content-Type JSON requis' }, { status: 415 })
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return json(req, { error: parsed.error.flatten() }, { status: 400 })
  }

  if (!isAllowedChatboxSource(parsed.data.source)) {
    return json(req, { error: 'Source chatbox non autorisee' }, { status: 403 })
  }

  const limited = checkRateLimit(req, parsed.data.source)
  if (limited) {
    return json(req, { error: 'Trop de requetes', retryAfter: limited.retryAfter }, {
      status: 429,
      headers: { 'Retry-After': String(limited.retryAfter) },
    })
  }

  const duplicate = await findDuplicateAnswer(parsed.data.source, parsed.data.conversationId, parsed.data.assistantResponse)
  const detectedProblemType = detectProblemType(parsed.data.userPrompt)
  const problemType = duplicate ? 'DUPLICATE' : detectedProblemType ?? parsed.data.problemType
  const hasQualityProblem = problemType !== 'OTHER'
  const quality = duplicate || hasQualityProblem ? 'BAD' : parsed.data.quality
  const reviewStatus = parsed.data.reviewStatus ?? (quality === 'BAD' ? 'UNTREATED' : 'TREATED')
  const questionSignature = parsed.data.questionSignature || buildQuestionSignature(parsed.data.userPrompt)
  const duplicateNote = duplicate
    ? `Reponse identique deja donnee dans cette conversation (${duplicate.id}).`
    : null
  const problemNote = getProblemNote(problemType)

  const log = await prisma.chatLog.create({
    data: {
      source: parsed.data.source,
      conversationId: parsed.data.conversationId,
      visitorId: parsed.data.visitorId,
      sessionId: parsed.data.sessionId,
      questionSignature,
      userName: parsed.data.userName,
      userEmail: parsed.data.userEmail,
      userPrompt: parsed.data.userPrompt,
      assistantResponse: parsed.data.assistantResponse,
      quality,
      qualityNotes: [parsed.data.qualityNotes, duplicateNote, problemNote].filter(Boolean).join('\n') || undefined,
      problemType,
      reviewStatus,
      metadata: buildMetadata(parsed.data.metadata, {
        userPrompt: parsed.data.userPrompt,
        duplicateOf: duplicate?.id,
        problemType,
        visitorId: parsed.data.visitorId,
        sessionId: parsed.data.sessionId,
        questionSignature,
      }),
    },
  })

  await writeAuditLog({
    outil: parsed.data.source,
    cibleType: 'chat_log',
    cibleId: log.id,
    action: 'chatbox_log_created',
    resume: parsed.data.userPrompt.slice(0, 180),
    apres: log,
  })

  if (log.quality === 'BAD') {
    await sendChatboxBadAlertEmail(log).catch((error) => {
      console.error('Chatbox BAD alert email error:', error)
    })
  }

  return json(req, {
    success: true,
    log,
    flags: {
      duplicateAnswer: Boolean(duplicate),
      duplicateOf: duplicate?.id,
      problemType,
    },
  }, { status: 201 })
}

function corsHeaders(req: NextRequest) {
  return chatboxCorsHeaders(req, 'POST, OPTIONS')
}

function json(req: NextRequest, body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      ...corsHeaders(req),
      ...init?.headers,
    },
  })
}

function checkRateLimit(req: NextRequest, source: string) {
  const limitMap = globalForChatbox.chatboxLogRateLimit ?? new Map<string, { count: number; resetAt: number }>()
  globalForChatbox.chatboxLogRateLimit = limitMap

  const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const ip = forwardedFor || req.headers.get('x-real-ip') || 'unknown'
  const key = `${ip}:${source}`
  const now = Date.now()
  const windowMs = Number(process.env.CHATBOX_RATE_LIMIT_WINDOW_MS ?? DEFAULT_RATE_LIMIT_WINDOW_MS)
  const max = Number(process.env.CHATBOX_RATE_LIMIT_MAX ?? DEFAULT_RATE_LIMIT_MAX)
  const current = limitMap.get(key)

  if (!current || current.resetAt <= now) {
    limitMap.set(key, { count: 1, resetAt: now + windowMs })
    return null
  }

  current.count += 1
  if (current.count > max) {
    return { retryAfter: Math.ceil((current.resetAt - now) / 1000) }
  }

  return null
}

function normalizeAnswer(value?: string | null) {
  return cleanText(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function normalizeSignal(value: string) {
  return normalizeAnswer(value)
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function detectProblemType(userPrompt: string) {
  const normalized = normalizeSignal(userPrompt)
  const matched = NEGATIVE_FEEDBACK_RULES.find((rule) =>
    rule.phrases.some((phrase) => normalized.includes(phrase)),
  )

  return matched?.type
}

function getProblemNote(problemType: (typeof PROBLEM_TYPES)[number]) {
  if (problemType === 'OTHER' || problemType === 'DUPLICATE') return null
  if (problemType === 'USER_REPORTED') return 'Reponse signalee par l utilisateur.'
  if (problemType === 'MISUNDERSTANDING') return 'Signal d incomprehension detecte dans la conversation.'
  if (problemType === 'LOST_CONTEXT') return 'Signal de perte de contexte detecte dans la conversation.'
  if (problemType === 'USER_NEGATIVE_FEEDBACK') return 'Retour utilisateur negatif detecte dans la conversation.'
  if (problemType === 'FALLBACK') return 'Fallback chatbox a revoir.'
  return null
}

async function findDuplicateAnswer(source: string, conversationId?: string | null, answer?: string | null) {
  const normalized = normalizeAnswer(answer)
  if (!conversationId || !normalized) return null

  const recent = await prisma.chatLog.findMany({
    where: {
      source,
      conversationId,
      assistantResponse: { not: null },
    },
    select: {
      id: true,
      assistantResponse: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 30,
  })

  return recent.find((log) => normalizeAnswer(log.assistantResponse) === normalized) ?? null
}

function buildMetadata(
  value: unknown,
  options: {
    userPrompt: string
    duplicateOf?: string
    problemType: (typeof PROBLEM_TYPES)[number]
    visitorId?: string | null
    sessionId?: string | null
    questionSignature: string
  },
) {
  const jsonValue = value === undefined ? undefined : JSON.parse(JSON.stringify(value))
  const enrichedValue = enrichChatboxMetadata(options.userPrompt, jsonValue)
  const base: Record<string, unknown> = enrichedValue && typeof enrichedValue === 'object' && !Array.isArray(enrichedValue)
    ? enrichedValue as Record<string, unknown>
    : { value: enrichedValue ?? null }
  const existingFlags = base.flags
  const flags = existingFlags && typeof existingFlags === 'object' && !Array.isArray(existingFlags)
    ? existingFlags as Record<string, unknown>
    : {}
  const analytics = base.analytics && typeof base.analytics === 'object' && !Array.isArray(base.analytics)
    ? base.analytics as Record<string, unknown>
    : {}

  return {
    ...base,
    analytics: {
      ...analytics,
      questionSignature: options.questionSignature,
    },
    flags: {
      ...flags,
      ...(options.duplicateOf ? { duplicateAnswer: true, duplicateOf: options.duplicateOf } : {}),
      problemType: options.problemType,
      hasVisitorId: Boolean(options.visitorId),
      hasSessionId: Boolean(options.sessionId),
    },
  } as Prisma.InputJsonValue
}
