import type { SecurityAuditEvent } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

type AuditInput = {
  event: SecurityAuditEvent
  userId?: string | null
  ip?: string | null
  userAgent?: string | null
  metadata?: Record<string, unknown>
}

export async function writeSecurityAuditLog(input: AuditInput) {
  try {
    await prisma.securityAuditLog.create({
      data: {
        event: input.event,
        userId: input.userId ?? null,
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
        metadata: input.metadata as Prisma.InputJsonValue | undefined,
      },
    })
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[security:audit]', error)
    }
  }
}

export function requestIp(headers: Headers) {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    null
  )
}

export function requestUserAgent(headers: Headers) {
  return headers.get('user-agent') || null
}
