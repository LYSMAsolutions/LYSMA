import { SecurityAuditEvent, SecurityTokenType } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { sendTransactionalEmail } from '@/lib/email'
import { createSecurityToken, consumeSecurityToken } from './tokens'
import { writeSecurityAuditLog } from './audit'

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || process.env.NEXTAUTH_URL || 'http://localhost:3003'
}

export async function sendEmailVerification(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return

  const { token } = await createSecurityToken({
    userId,
    type: SecurityTokenType.EMAIL_VERIFICATION,
    expiresInMinutes: 60 * 24,
  })

  const url = `${appUrl()}/verification-email?token=${encodeURIComponent(token)}`
  await sendTransactionalEmail({
    to: user.email,
    subject: 'Validez votre adresse email LIVO',
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h1>Validez votre adresse email</h1>
        <p>Bonjour ${user.prenom},</p>
        <p>Pour sécuriser votre compte LIVO, confirmez votre adresse email avant d’accéder à l’outil.</p>
        <p><a href="${url}" style="display:inline-block;padding:12px 18px;background:#1a6fff;color:#fff;border-radius:10px;text-decoration:none;font-weight:700">Valider mon email</a></p>
        <p>Ce lien expire dans 24 heures. Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.</p>
      </div>
    `,
  })

  await writeSecurityAuditLog({
    event: SecurityAuditEvent.EMAIL_VERIFICATION_SENT,
    userId,
  })
}

export async function verifyEmailToken(token: string) {
  const record = await consumeSecurityToken({
    token,
    type: SecurityTokenType.EMAIL_VERIFICATION,
  })

  if (!record) return { ok: false as const }

  const verifiedAt = new Date()
  await prisma.user.update({
    where: { id: record.userId },
    data: {
      emailVerified: verifiedAt,
      emailVerifiedAt: verifiedAt,
      failedLoginCount: 0,
      lockedUntil: null,
    },
  })

  await writeSecurityAuditLog({
    event: SecurityAuditEvent.EMAIL_VERIFIED,
    userId: record.userId,
  })

  return { ok: true as const, email: record.user.email }
}
