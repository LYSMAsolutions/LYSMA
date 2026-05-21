import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ expired: false })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      garages: {
        where: { actif: true },
        orderBy: { createdAt: 'asc' },
        take: 1,
      },
    },
  })

  const garage = user?.garages[0]
  if (!garage) return NextResponse.json({ expired: false })

  // Abonnement actif → jamais expiré
  if (garage.abonnementActif) return NextResponse.json({ expired: false })

  // Trial pas encore défini → pas expiré
  if (!garage.trialEndsAt) return NextResponse.json({ expired: false })

  const expired = new Date() > new Date(garage.trialEndsAt)
  return NextResponse.json({ expired, trialEndsAt: garage.trialEndsAt })
}
 
