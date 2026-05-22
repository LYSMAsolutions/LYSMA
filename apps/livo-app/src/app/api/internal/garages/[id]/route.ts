import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const patchSchema = z.object({
  garage: z.object({
    nom: z.string().trim().min(1).optional(),
    adresse: z.string().trim().nullable().optional(),
    ville: z.string().trim().nullable().optional(),
    codePostal: z.string().trim().nullable().optional(),
    telephone: z.string().trim().nullable().optional(),
    email: z.string().trim().email().nullable().optional(),
    siret: z.string().trim().nullable().optional(),
    passwordAtelier: z.string().trim().nullable().optional(),
  }).optional(),
  owner: z.object({
    nom: z.string().trim().min(1).optional(),
    prenom: z.string().trim().min(1).optional(),
    telephone: z.string().trim().nullable().optional(),
    actif: z.boolean().optional(),
  }).optional(),
  abonnementActif: z.boolean().optional(),
  actif: z.boolean().optional(),
  trialEndsAt: z.string().datetime().optional(),
  compagnon: z.object({
    id: z.string(),
    nom: z.string().trim().optional(),
    prenom: z.string().trim().optional(),
    poste: z.string().trim().nullable().optional(),
    matricule: z.string().trim().nullable().optional(),
    pin: z.string().trim().nullable().optional(),
    actif: z.boolean().optional(),
  }).optional(),
  vehicule: z.object({
    id: z.string(),
    immatriculation: z.string().trim().nullable().optional(),
    clientNom: z.string().trim().optional(),
    clientPrenom: z.string().trim().nullable().optional(),
    clientTel: z.string().trim().nullable().optional(),
    clientEmail: z.string().trim().email().nullable().optional(),
    notes: z.string().trim().nullable().optional(),
  }).optional(),
  fiche: z.object({
    id: z.string(),
    statut: z.enum(['EN_ATTENTE', 'EN_COURS', 'EN_PAUSE', 'TERMINEE', 'CLOTUREE', 'ANNULEE']).optional(),
    travaux: z.string().trim().optional(),
    notes: z.string().trim().nullable().optional(),
  }).optional(),
  taux: z.object({
    id: z.string(),
    libelle: z.string().trim().optional(),
    montant: z.coerce.number().nonnegative().optional(),
    actif: z.boolean().optional(),
    pin: z.string().trim().nullable().optional(),
  }).optional(),
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
      vehicules: {
        take: 50,
        orderBy: {
          updatedAt: 'desc',
        },
      },
      joursOuverts: {
        orderBy: {
          jourSemaine: 'asc',
        },
      },
      _count: {
        select: {
          compagnons: true,
          vehicules: true,
          fiches: true,
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
        telephone: garage.owner.telephone,
        actif: garage.owner.actif,
        email: garage.owner.email,
        createdAt: garage.owner.createdAt.toISOString(),
      },
      compagnons: garage.compagnons,
      ficheTravaux: garage.fiches,
      taux: garage.taux,
      vehicules: garage.vehicules,
      joursOuverts: garage.joursOuverts,
      stats: {
        compagnons: garage._count.compagnons,
        vehicules: garage._count.vehicules,
        fichesTotal: garage._count.fiches || fichesStats._count.id,
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
    include: {
      owner: true,
    },
  })

  if (!garage) {
    return NextResponse.json({ error: 'Garage introuvable' }, { status: 404 })
  }

  await prisma.$transaction(async (tx) => {
    await tx.garage.update({
      where: { id },
      data: {
        ...parsed.data.garage,
        abonnementActif: parsed.data.abonnementActif,
        actif: parsed.data.actif,
        trialEndsAt: parsed.data.trialEndsAt ? new Date(parsed.data.trialEndsAt) : undefined,
      },
    })

    if (parsed.data.owner) {
      await tx.user.update({
        where: { id: garage.ownerId },
        data: parsed.data.owner,
      })
    }

    if (parsed.data.compagnon) {
      const { id: compagnonId, ...data } = parsed.data.compagnon
      await tx.compagnon.updateMany({
        where: { id: compagnonId, garageId: id },
        data,
      })
    }

    if (parsed.data.vehicule) {
      const { id: vehiculeId, ...data } = parsed.data.vehicule
      await tx.vehicule.updateMany({
        where: { id: vehiculeId, garageId: id },
        data,
      })
    }

    if (parsed.data.fiche) {
      const { id: ficheId, ...data } = parsed.data.fiche
      await tx.ficheTravaux.updateMany({
        where: { id: ficheId, garageId: id },
        data,
      })
    }

    if (parsed.data.taux) {
      const { id: tauxId, montant, ...data } = parsed.data.taux
      await tx.tauxGarage.updateMany({
        where: { id: tauxId, garageId: id },
        data: {
          ...data,
          montant,
        },
      })
    }
  })

  const updated = await prisma.garage.findUnique({
    where: { id },
    include: {
      owner: true,
      compagnons: true,
      vehicules: true,
      fiches: { take: 20, orderBy: { createdAt: 'desc' }, include: { vehicule: true } },
      taux: true,
    },
  })

  return NextResponse.json({
    success: true,
    garage: updated,
  })
}
