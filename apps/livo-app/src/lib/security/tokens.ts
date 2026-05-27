import crypto from 'node:crypto'
import type { SecurityTokenType } from '@prisma/client'
import { prisma } from '@/lib/prisma'

const TOKEN_BYTES = 32

export function createOpaqueToken() {
  return crypto.randomBytes(TOKEN_BYTES).toString('base64url')
}

export function hashSecurityToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export async function createSecurityToken(input: {
  userId: string
  type: SecurityTokenType
  expiresInMinutes: number
}) {
  const token = createOpaqueToken()
  const tokenHash = hashSecurityToken(token)
  const expiresAt = new Date(Date.now() + input.expiresInMinutes * 60_000)

  await prisma.$transaction([
    prisma.securityToken.updateMany({
      where: {
        userId: input.userId,
        type: input.type,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    }),
    prisma.securityToken.create({
      data: {
        userId: input.userId,
        type: input.type,
        tokenHash,
        expiresAt,
      },
    }),
  ])

  return { token, tokenHash, expiresAt }
}

export async function consumeSecurityToken(input: {
  token: string
  type: SecurityTokenType
}) {
  const tokenHash = hashSecurityToken(input.token)
  const record = await prisma.securityToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  })

  if (!record || record.type !== input.type || record.usedAt || record.expiresAt < new Date()) {
    return null
  }

  await prisma.securityToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  })

  return record
}
