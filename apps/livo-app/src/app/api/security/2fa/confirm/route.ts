import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { SecurityAuditEvent } from '@prisma/client'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decryptSecret } from '@/lib/security/crypto'
import { verifyTotpCode } from '@/lib/security/totp'
import { requestIp, requestUserAgent, writeSecurityAuditLog } from '@/lib/security/audit'

const schema = z.object({
  code: z.string().regex(/^\d{6}$/),
})

function recoveryCodes() {
  return Array.from({ length: 10 }, () => crypto.randomBytes(5).toString('base64url').toUpperCase())
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })
  }

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: 'Code invalide.' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.twoFactorSecretEncrypted) {
    return NextResponse.json({ error: 'Configuration 2FA absente.' }, { status: 400 })
  }

  if (!verifyTotpCode(decryptSecret(user.twoFactorSecretEncrypted), parsed.data.code)) {
    await writeSecurityAuditLog({
      event: SecurityAuditEvent.TWO_FACTOR_FAILED,
      userId: user.id,
      ip: requestIp(req.headers),
      userAgent: requestUserAgent(req.headers),
    })
    return NextResponse.json({ error: 'Code 2FA incorrect.' }, { status: 400 })
  }

  const codes = recoveryCodes()
  const recoveryCodesHash = await bcrypt.hash(JSON.stringify(codes), 12)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      twoFactorEnabled: true,
      twoFactorConfirmedAt: new Date(),
      recoveryCodesHash,
      sessionVersion: { increment: 1 },
    },
  })

  await writeSecurityAuditLog({
    event: SecurityAuditEvent.TWO_FACTOR_ENABLED,
    userId: user.id,
    ip: requestIp(req.headers),
    userAgent: requestUserAgent(req.headers),
  })

  return NextResponse.json({ recoveryCodes: codes })
}
