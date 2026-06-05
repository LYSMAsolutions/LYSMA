import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { writeAuditLog } from '@/lib/audit'
import { enrichChatboxMetadata } from '@/lib/chatbox-analytics'
import { sendChatboxBadAlertEmail } from '@/lib/chatbox-bad-alert-email'

const MAX_BODY_SIZE = 32_000
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60_000
const DEFAULT_RATE_LIMIT_MAX = 40
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3021',
  'http://localhost:3022',
  'https://lysma-hub.vercel.app',
  'https://lysmasolutions.fr',
  'https://www.lysmasolutions.fr',
  'https://carrosserie-mounier.vercel.app',
  'https://carrosserie-mounier-ruddy.vercel.app',
  'https://carrosserie-mounier.fr',
  'https://www.carrosserie-mounier.fr',
  'https://livo-app.com',
  'https://www.livo-app.com',
]
const DEFAULT_ALLOWED_SOURCES = [
  'site-vitrine:lysma-hub',
  'site-vitrine:carrosserie-mounier',
  'app:livo-app',
]

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
  userName: z.string().max(120).transform(cleanText).optional().nullable(),
  userEmail: z.string().max(180).transform(cleanText).pipe(z.string().email()).optional().nullable(),
  userPrompt: z.string().min(1).max(8000).transform(cleanText),
  assistantResponse: z.string().max(16000).transform(cleanText).optional().nullable(),
  quality: z.enum(['UNKNOWN', 'GOOD', 'BAD']).default('UNKNOWN'),
  qualityNotes: z.string().max(2000).transform(cleanText).optional().nullable(),
  metadata: z.unknown().optional(),
})

export async function OPTIONS(req: NextRequest) {
  const allowed = getAllowedOrigin(req)
  if (getAllowedOrigins().length > 0 && !allowed) {
    return json(req, { error: 'Origine non autorisee' }, { status: 403 })
  }

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req),
  })
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
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

  if (!isAllowedSource(parsed.data.source)) {
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
  const duplicateNote = duplicate
    ? `Reponse identique deja donnee dans cette conversation (${duplicate.id}).`
    : null

  const log = await prisma.chatLog.create({
    data: {
      source: parsed.data.source,
      conversationId: parsed.data.conversationId,
      userName: parsed.data.userName,
      userEmail: parsed.data.userEmail,
      userPrompt: parsed.data.userPrompt,
      assistantResponse: parsed.data.assistantResponse,
      quality: duplicate ? 'BAD' : parsed.data.quality,
      qualityNotes: [parsed.data.qualityNotes, duplicateNote].filter(Boolean).join('\n') || undefined,
      metadata: buildMetadata(parsed.data.metadata, parsed.data.userPrompt, duplicate?.id),
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
    },
  }, { status: 201 })
}

function parseList(value: string | undefined) {
  return (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function unique(values: string[]) {
  return Array.from(new Set(values))
}

function getAllowedOrigins() {
  return unique([...DEFAULT_ALLOWED_ORIGINS, ...parseList(process.env.CHATBOX_ALLOWED_ORIGINS)])
}

function getAllowedOrigin(req: NextRequest) {
  const origin = req.headers.get('origin')
  const allowed = getAllowedOrigins()
  if (!origin || allowed.length === 0) return null
  return allowed.includes('*') || allowed.includes(origin) ? origin : null
}

function corsHeaders(req: NextRequest) {
  const origin = getAllowedOrigin(req)
  return {
    ...(origin ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {}),
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-lysma-inbound-secret',
    'Access-Control-Max-Age': '600',
  }
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

function isAuthorized(req: NextRequest) {
  const secret = process.env.SUPER_ADMIN_INBOUND_SECRET
  const hasValidSecret = Boolean(secret && req.headers.get('x-lysma-inbound-secret') === secret)
  if (hasValidSecret) return true

  const hasValidOrigin = Boolean(getAllowedOrigin(req))
  if (hasValidOrigin) return true

  return process.env.NODE_ENV !== 'production' && !secret
}

function isAllowedSource(source: string) {
  const allowedSources = unique([...DEFAULT_ALLOWED_SOURCES, ...parseList(process.env.CHATBOX_ALLOWED_SOURCES)])
  return allowedSources.includes(source)
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

function buildMetadata(value: unknown, userPrompt: string, duplicateOf?: string) {
  const jsonValue = value === undefined ? undefined : JSON.parse(JSON.stringify(value))
  const enrichedValue = enrichChatboxMetadata(userPrompt, jsonValue)

  if (!duplicateOf) {
    return enrichedValue as Prisma.InputJsonValue
  }

  const base: Record<string, unknown> = enrichedValue && typeof enrichedValue === 'object' && !Array.isArray(enrichedValue)
    ? enrichedValue as Record<string, unknown>
    : { value: enrichedValue ?? null }
  const existingFlags = base.flags
  const flags = existingFlags && typeof existingFlags === 'object' && !Array.isArray(existingFlags)
    ? existingFlags as Record<string, unknown>
    : {}

  return {
    ...base,
    flags: {
      ...flags,
      duplicateAnswer: true,
      duplicateOf,
    },
  } as Prisma.InputJsonValue
}
