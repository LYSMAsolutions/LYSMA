import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const patchSchema = z.object({
  abonnementActif: z.boolean().optional(),
  actif: z.boolean().optional(),
  trialEndsAt: z.string().datetime().optional(),
})

function isAuthorized(req: NextRequest) {
  const apiKey = req.headers.get('x-internal-api-key')
  return Boolean(process.env.INTERNAL_API_KEY) && apiKey === process.env.INTERNAL_API_KEY
}

function daysLeft(date: Date | null) {
  if (!date) return null
  return Math.ceil((date.getTime() - Date.now()) / 86400000)
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id } = await params

  const garage = await prisma.garage.findUnique({
    where: {
      id,
    },
    include: {
      owner: true,
      compagnons: {
        orderBy: [{ prenom: 'asc' }, { nom: 'asc' }],
      },
      fiches: {
        take: 20,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          vehicule: true,
        },
      },
      taux: {
        orderBy: {
          type: 'asc',
        },
      },
      _count: {
        select: {
          compagnons: true,
          vehicules: true,
        },
      },
    },
  })

  if (!garage) {
    return NextResponse.json({ error: 'Garage introuvable' }, { status: 404 })
  }

  const fichesStats = await prisma.ficheTravaux.aggregate({
    where: {
      garageId: garage.id,
    },
    _count: {
      id: true,
    },
  })

  const clotureesStats = await prisma.ficheTravaux.aggregate({
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

  const dernierPointage = await prisma.pointageJour.findFirst({
    where: {
      compagnon: {
        garageId: garage.id,
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  const joursRestants = daysLeft(garage.trialEndsAt)

  return NextResponse.json({
    garage: {
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
      compagnons: garage.compagnons,
      ficheTravaux: garage.fiches,
      taux: garage.taux,
      stats: {
        compagnons: garage._count.compagnons,
        vehicules: garage._count.vehicules,
        fichesTotal: fichesStats._count.id,
        fichesCloturees: clotureesStats._count.id,
        caTotal: Number(clotureesStats._sum.montantHT ?? 0),
        dernierPointage: dernierPointage?.updatedAt.toISOString() ?? null,
      },
    },
  })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const parsed = patchSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const garage = await prisma.garage.findUnique({
    where: {
      id,
    },
  })

  if (!garage) {
    return NextResponse.json({ error: 'Garage introuvable' }, { status: 404 })
  }

  const updated = await prisma.garage.update({
    where: {
      id,
    },
    data: {
      abonnementActif: parsed.data.abonnementActif,
      actif: parsed.data.actif,
      trialEndsAt: parsed.data.trialEndsAt ? new Date(parsed.data.trialEndsAt) : undefined,
    },
  })

  return NextResponse.json({
    success: true,
    garage: updated,
  })
}