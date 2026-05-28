import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type SecureSessionOptions = {
  requireTwoFactor?: boolean
}

export async function requireSecureSession(options: SecureSessionOptions = {}) {
  const { requireTwoFactor = true } = options
  const session = await auth()

  if (!session?.user?.id) {
    return {
      session: null,
      user: null,
      response: NextResponse.json({ error: 'Non autorisé.' }, { status: 401 }),
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      actif: true,
      emailVerified: true,
      emailVerifiedAt: true,
      twoFactorEnabled: true,
    },
  })

  if (!user?.actif || (!user.emailVerified && !user.emailVerifiedAt)) {
    return {
      session: null,
      user: null,
      response: NextResponse.json({ error: 'Compte non autorisé.' }, { status: 403 }),
    }
  }

  if (requireTwoFactor && !user.twoFactorEnabled) {
    return {
      session: null,
      user: null,
      response: NextResponse.json({ error: 'Double authentification obligatoire.' }, { status: 403 }),
    }
  }

  return { session, user, response: null }
}
