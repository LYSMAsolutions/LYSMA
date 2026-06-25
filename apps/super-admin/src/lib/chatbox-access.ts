import type { NextRequest } from 'next/server'

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
  'site-vitrine:*',
  'app:livo-app',
]

function parseList(value: string | undefined) {
  return (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function unique(values: string[]) {
  return Array.from(new Set(values))
}

export function getChatboxAllowedOrigins() {
  return unique([...DEFAULT_ALLOWED_ORIGINS, ...parseList(process.env.CHATBOX_ALLOWED_ORIGINS)])
}

export function getChatboxAllowedOrigin(req: NextRequest) {
  const origin = req.headers.get('origin')
  const allowed = getChatboxAllowedOrigins()
  if (!origin || allowed.length === 0) return null
  return allowed.some((rule) => matchesAllowedRule(origin, rule)) ? origin : null
}

export function chatboxCorsHeaders(req: NextRequest, methods: string) {
  const origin = getChatboxAllowedOrigin(req)
  return {
    ...(origin ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {}),
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type, x-lysma-inbound-secret',
    'Access-Control-Max-Age': '600',
  }
}

export function isAuthorizedChatboxRequest(req: NextRequest) {
  const secret = process.env.SUPER_ADMIN_INBOUND_SECRET
  const hasValidSecret = Boolean(secret && req.headers.get('x-lysma-inbound-secret') === secret)
  if (hasValidSecret) return true

  const hasValidOrigin = Boolean(getChatboxAllowedOrigin(req))
  if (hasValidOrigin) return true

  return process.env.NODE_ENV !== 'production' && !secret
}

export function isAllowedChatboxSource(source: string) {
  const allowedSources = unique([...DEFAULT_ALLOWED_SOURCES, ...parseList(process.env.CHATBOX_ALLOWED_SOURCES)])
  return allowedSources.some((rule) => matchesAllowedRule(source, rule))
}

function matchesAllowedRule(value: string, allowedRule: string) {
  const candidate = value.toLowerCase()
  const rule = allowedRule.trim().toLowerCase()
  if (!rule) return false
  if (rule === '*') return true
  if (!rule.includes('*')) return candidate === rule

  const fixedLength = rule.replace(/\*/g, '').length
  if (candidate.length <= fixedLength) return false

  const parts = rule.split('*')
  const first = parts[0] ?? ''
  const last = parts[parts.length - 1] ?? ''

  if (first && !candidate.startsWith(first)) return false
  if (last && !candidate.endsWith(last)) return false

  let cursor = first.length
  for (let index = 1; index < parts.length - 1; index += 1) {
    const part = parts[index]
    if (!part) continue

    const next = candidate.indexOf(part, cursor)
    if (next === -1) return false
    cursor = next + part.length
  }

  return true
}
