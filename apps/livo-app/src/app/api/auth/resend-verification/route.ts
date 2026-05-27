import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendEmailVerification } from '@/lib/security/email-verification'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { requestIp } from '@/lib/security/audit'

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
})

export async function POST(req: NextRequest) {
  const ip = requestIp(req.headers)
  const rate = await checkRateLimit({
    key: `resend-email:${ip ?? 'unknown'}`,
    limit: 5,
    windowSeconds: 60 * 15,
    blockSeconds: 60 * 30,
  })
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Trop de demandes.' }, { status: 429 })
  }

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ ok: true })
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, emailVerified: true, emailVerifiedAt: true },
  })

  if (user && !user.emailVerified && !user.emailVerifiedAt) {
    try {
      await sendEmailVerification(user.id)
    } catch (error) {
      console.error('[email-verification] resend failed', error)
      return NextResponse.json(
        { error: 'L’email de vérification n’a pas pu être envoyé pour le moment.' },
        { status: 502 },
      )
    }
  }

  return NextResponse.json({ ok: true })
}
