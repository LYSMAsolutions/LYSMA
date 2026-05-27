import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DoubleAuthentificationClient } from './DoubleAuthentificationClient'

export default async function DoubleAuthentificationPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/connexion')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      emailVerified: true,
      emailVerifiedAt: true,
      twoFactorEnabled: true,
    },
  })

  if (!user) {
    redirect('/connexion')
  }

  if (!user.emailVerified && !user.emailVerifiedAt) {
    redirect(`/verification-email/envoye?email=${encodeURIComponent(user.email)}`)
  }

  if (user.twoFactorEnabled) {
    redirect('/dashboard')
  }

  return <DoubleAuthentificationClient email={user.email} />
}
