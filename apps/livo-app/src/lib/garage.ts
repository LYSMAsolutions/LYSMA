import { prisma } from '@/lib/prisma'

export async function getPrimaryGarageForUser(userId: string) {
  return prisma.garage.findFirst({
    where: {
      ownerId: userId,
      actif: true,
      owner: {
        actif: true,
        OR: [
          { emailVerified: { not: null } },
          { emailVerifiedAt: { not: null } },
        ],
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
}
