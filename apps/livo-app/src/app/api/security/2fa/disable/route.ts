import { NextRequest, NextResponse } from 'next/server'
import { SecurityAuditEvent } from '@prisma/client'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { requestIp, requestUserAgent, writeSecurityAuditLog } from '@/lib/security/audit'
import { decryptSecret } from '@/lib/security/crypto'
import { verifyTotpCode } from '@/lib/security/totp'
import { revokeCurrentTrustedDevice } from '@/lib/security/trusted-device'
import { z } from 'zod'

const schema = z.object({
  code: z.string().regex(/^\d{6}$/),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })
  }

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Code Google Authenticator requis.' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorSecretEncrypted: true },
  })

  if (!user?.twoFactorSecretEncrypted || !verifyTotpCode(decryptSecret(user.twoFactorSecretEncrypted), parsed.data.code)) {
    await writeSecurityAuditLog({
      event: SecurityAuditEvent.TWO_FACTOR_FAILED,
      userId: session.user.id,
      ip: requestIp(req.headers),
      userAgent: requestUserAgent(req.headers),
      metadata: { reason: 'disable_invalid_code' },
    })
    return NextResponse.json({ error: 'Code Google Authenticator incorrect.' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorEnabled: false,
      twoFactorSecretEncrypted: null,
      twoFactorConfirmedAt: null,
      recoveryCodesHash: null,
      sessionVersion: { increment: 1 },
    },
  })

  await revokeCurrentTrustedDevice()

  await writeSecurityAuditLog({
    event: SecurityAuditEvent.TWO_FACTOR_DISABLED,
    userId: session.user.id,
    ip: requestIp(req.headers),
    userAgent: requestUserAgent(req.headers),
  })

  return NextResponse.json({ ok: true })
}
