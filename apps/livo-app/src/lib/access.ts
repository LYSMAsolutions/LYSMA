import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export type AdminAccess = {
  mode: 'admin'
  userId: string
}

export type AtelierAccess = {
  mode: 'atelier'
  garageId: string
  compagnonId: string
}

export type PointageAccess = AdminAccess | AtelierAccess

export async function getPointageAccess(): Promise<PointageAccess | null> {
  const session = await auth()

  if (session?.user?.id) {
    return { mode: 'admin', userId: session.user.id }
  }

  const cookieStore = await cookies()
  const garageId = cookieStore.get('atelier-garage-id')?.value
  const compagnonId = cookieStore.get('atelier-compagnon-id')?.value

  if (!garageId || !compagnonId) return null

  const compagnon = await prisma.compagnon.findFirst({
    where: {
      id: compagnonId,
      garageId,
      actif: true,
      garage: { actif: true },
    },
    select: { id: true },
  })

  return compagnon ? { mode: 'atelier', garageId, compagnonId } : null
}
