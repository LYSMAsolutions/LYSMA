import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createTrustedDevice } from '@/lib/security/trusted-device'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      actif: true,
      emailVerified: true,
      emailVerifiedAt: true,
      twoFactorEnabled: true,
    },
  })

  if (!user?.actif || (!user.emailVerified && !user.emailVerifiedAt)) {
    return NextResponse.json({ error: 'Compte non autorisé.' }, { status: 403 })
  }

  if (!user.twoFactorEnabled) {
    return NextResponse.json({ error: 'Double authentification non activée.' }, { status: 403 })
  }

  const trustedDevice = await createTrustedDevice(req, session.user.id)
  return NextResponse.json({
    success: true,
    expiresAt: trustedDevice.expiresAt.toISOString(),
  })
}
