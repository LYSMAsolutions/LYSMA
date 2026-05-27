import { NextRequest, NextResponse } from 'next/server'
import { SecurityAuditEvent } from '@prisma/client'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { requestIp, requestUserAgent, writeSecurityAuditLog } from '@/lib/security/audit'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })
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

  await writeSecurityAuditLog({
    event: SecurityAuditEvent.TWO_FACTOR_DISABLED,
    userId: session.user.id,
    ip: requestIp(req.headers),
    userAgent: requestUserAgent(req.headers),
  })

  return NextResponse.json({ ok: true })
}
