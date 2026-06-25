import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import {
  chatboxCorsHeaders,
  getChatboxAllowedOrigin,
  getChatboxAllowedOrigins,
  isAllowedChatboxSource,
  isAuthorizedChatboxRequest,
} from '@/lib/chatbox-access'

const sourceSchema = z.string().min(1).max(80).regex(/^[a-z0-9][a-z0-9:_./-]*$/i)
const visitorIdSchema = z.string().min(1).max(160).regex(/^[a-z0-9:_-]+$/i)
const idSchema = z.string().min(1).max(160).regex(/^[a-z0-9_-]+$/i)

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

export async function GET(req: NextRequest) {
  if (!isAuthorizedChatboxRequest(req)) {
    return json(req, { error: 'Non autorise' }, { status: 401 })
  }

  const search = req.nextUrl.searchParams
  const parsed = z.object({
    source: sourceSchema,
    visitorId: visitorIdSchema,
  }).safeParse({
    source: search.get('source'),
    visitorId: search.get('visitorId'),
  })

  if (!parsed.success) {
    return json(req, { updates: [] })
  }

  if (!isAllowedChatboxSource(parsed.data.source)) {
    return json(req, { error: 'Source chatbox non autorisee' }, { status: 403 })
  }

  const updates = await prisma.chatboxUpdateNotification.findMany({
    where: {
      source: parsed.data.source,
      visitorId: parsed.data.visitorId,
      seen: false,
    },
    select: {
      id: true,
      source: true,
      conversationId: true,
      questionSignature: true,
      userPrompt: true,
      improvedResponse: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return json(req, { updates })
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedChatboxRequest(req)) {
    return json(req, { error: 'Non autorise' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = z.object({
    source: sourceSchema,
    visitorId: visitorIdSchema,
    updateId: idSchema,
  }).safeParse(body)

  if (!parsed.success) {
    return json(req, { error: parsed.error.flatten() }, { status: 400 })
  }

  if (!isAllowedChatboxSource(parsed.data.source)) {
    return json(req, { error: 'Source chatbox non autorisee' }, { status: 403 })
  }

  await prisma.chatboxUpdateNotification.updateMany({
    where: {
      id: parsed.data.updateId,
      source: parsed.data.source,
      visitorId: parsed.data.visitorId,
      seen: false,
    },
    data: {
      seen: true,
      seenAt: new Date(),
    },
  })

  return json(req, { success: true })
}

function corsHeaders(req: NextRequest) {
  return chatboxCorsHeaders(req, 'GET, POST, OPTIONS')
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
