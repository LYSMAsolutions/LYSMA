import { prisma } from '@/lib/prisma'

export async function getPrimaryGarageForUser(userId: string) {
  return prisma.garage.findFirst({
    where: {
      ownerId: userId,
      actif: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
}
