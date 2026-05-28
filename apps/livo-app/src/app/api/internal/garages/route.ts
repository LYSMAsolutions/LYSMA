import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isInternalApiAuthorized } from '@/lib/security/internal-api'

function daysLeft(date: Date | null) {
  if (!date) return null
  return Math.ceil((date.getTime() - Date.now()) / 86400000)
}

export async function GET(req: NextRequest) {
  if (!isInternalApiAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const garages = await prisma.garage.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      owner: true,
      _count: {
        select: {
          compagnons: true,
          vehicules: true,
        },
      },
    },
  })

  const result = await Promise.all(
    garages.map(async (garage) => {
      const ca = await prisma.ficheTravaux.aggregate({
        where: {
          garageId: garage.id,
          statut: 'CLOTUREE',
        },
        _count: {
          id: true,
        },
        _sum: {
          montantHT: true,
        },
      })

      const joursRestants = daysLeft(garage.trialEndsAt)

      return {
        id: garage.id,
        nom: garage.nom,
        adresse: garage.adresse,
        ville: garage.ville,
        codePostal: garage.codePostal,
        telephone: garage.telephone,
        email: garage.email,
        siret: garage.siret,
        actif: garage.actif,
        abonnementActif: garage.abonnementActif,
        trialEndsAt: garage.trialEndsAt?.toISOString() ?? null,
        joursRestants,
        trialExpire: joursRestants !== null && joursRestants < 0,
        createdAt: garage.createdAt.toISOString(),
        owner: {
          id: garage.owner.id,
          nom: garage.owner.nom,
          prenom: garage.owner.prenom,
          email: garage.owner.email,
          createdAt: garage.owner.createdAt.toISOString(),
        },
        stats: {
          compagnons: garage._count.compagnons,
          vehicules: garage._count.vehicules,
          fichesCA: ca._count.id,
          caTotal: Number(ca._sum.montantHT ?? 0),
        },
      }
    })
  )

  return NextResponse.json({ garages: result })
}
