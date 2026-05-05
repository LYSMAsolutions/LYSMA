import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  compagnonId: z.string().min(1),
  ficheId: z.string().min(1),
  action: z.enum(['POINTER', 'DEPOINTER']),
})

async function recalculateFicheTempsReel(ficheId: string) {
  const pointages = await prisma.pointageFiche.findMany({
    where: {
      ficheId,
      statut: 'TERMINE',
    },
  })

  const totalMinutes = pointages.reduce(
    (sum, pointage) => sum + (pointage.dureeMinutes ?? 0),
    0
  )

  return prisma.ficheTravaux.update({
    where: {
      id: ficheId,
    },
    data: {
      tempsReel: totalMinutes / 60,
    },
  })
}

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { compagnonId, ficheId, action } = parsed.data
  const now = new Date()

  const compagnon = await prisma.compagnon.findFirst({
    where: {
      id: compagnonId,
      actif: true,
      garage: {
        ownerId: session.user.id,
      },
    },
  })

  if (!compagnon) {
    return NextResponse.json(
      { error: 'Compagnon introuvable ou non autorisé' },
      { status: 404 }
    )
  }

  const fiche = await prisma.ficheTravaux.findFirst({
    where: {
      id: ficheId,
      garageId: compagnon.garageId,
      garage: {
        ownerId: session.user.id,
      },
      statut: {
        in: ['EN_ATTENTE', 'EN_COURS', 'EN_PAUSE', 'TERMINEE'],
      },
    },
  })

  if (!fiche) {
    return NextResponse.json(
      { error: 'Fiche introuvable ou non autorisée' },
      { status: 404 }
    )
  }

  if (action === 'POINTER') {
    const existing = await prisma.pointageFiche.findFirst({
      where: {
        compagnonId,
        ficheId,
        statut: {
          in: ['EN_COURS', 'EN_PAUSE'],
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Déjà pointé sur cette fiche' },
        { status: 400 }
      )
    }

    const pointageFiche = await prisma.pointageFiche.create({
      data: {
        compagnonId,
        ficheId,
        debutAt: now,
        statut: 'EN_COURS',
      },
    })

    await prisma.ficheTravaux.update({
      where: {
        id: ficheId,
      },
      data: {
        statut: 'EN_COURS',
        dateFermeture: null,
      },
    })

    return NextResponse.json({ success: true, pointageFiche })
  }

  if (action === 'DEPOINTER') {
    const pointageFiche = await prisma.pointageFiche.findFirst({
      where: {
        compagnonId,
        ficheId,
        statut: {
          in: ['EN_COURS', 'EN_PAUSE'],
        },
      },
    })

    if (!pointageFiche) {
      return NextResponse.json(
        { error: 'Pas de pointage actif sur cette fiche' },
        { status: 400 }
      )
    }

    const dureeMinutes = Math.max(
      0,
      Math.round((now.getTime() - pointageFiche.debutAt.getTime()) / 60000)
    )

    await prisma.pointageFiche.update({
      where: {
        id: pointageFiche.id,
      },
      data: {
        statut: 'TERMINE',
        finAt: now,
        dureeMinutes,
      },
    })

    await recalculateFicheTempsReel(ficheId)

    const activeCount = await prisma.pointageFiche.count({
      where: {
        ficheId,
        statut: {
          in: ['EN_COURS', 'EN_PAUSE'],
        },
      },
    })

    await prisma.ficheTravaux.update({
      where: {
        id: ficheId,
      },
      data: {
        statut: activeCount > 0 ? 'EN_COURS' : 'TERMINEE',
        dateFermeture: activeCount > 0 ? null : now,
      },
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })
}