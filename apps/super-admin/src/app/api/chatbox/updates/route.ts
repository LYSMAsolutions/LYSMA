import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

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

const sourceSchema = z.string().min(1).max(80).regex(/^[a-z0-9][a-z0-9:_./-]*$/i)
const visitorIdSchema = z.string().min(1).max(160).regex(/^[a-z0-9:_-]+$/i)
const idSchema = z.string().min(1).max(160).regex(/^[a-z0-9_-]+$/i)

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

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
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

  if (!isAllowedSource(parsed.data.source)) {
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
  if (!isAuthorized(req)) {
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

  if (!isAllowedSource(parsed.data.source)) {
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
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
