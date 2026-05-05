import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  compagnonId: z.string().min(1),
  action: z.enum([
    'ARRIVEE',
    'PAUSE_CAFE_DEBUT',
    'PAUSE_CAFE_FIN',
    'PAUSE_DEJ_DEBUT',
    'PAUSE_DEJ_FIN',
    'DEPART',
  ]),
})

type StatutJour =
  | 'ABSENT'
  | 'ARRIVE'
  | 'EN_TRAVAIL'
  | 'PAUSE_CAFE'
  | 'PAUSE_DEJEUNER'
  | 'PARTI'

function minutesBetween(start: Date, end: Date) {
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000))
}

function calculateWorkedMinutes(pointage: {
  heureArrivee: Date | null
  pauseCafeDebut: Date | null
  pauseCafeFin: Date | null
  pauseDejDebut: Date | null
  pauseDejFin: Date | null
}, end: Date) {
  if (!pointage.heureArrivee) return 0

  let total = minutesBetween(pointage.heureArrivee, end)

  if (pointage.pauseCafeDebut) {
    total -= minutesBetween(pointage.pauseCafeDebut, pointage.pauseCafeFin ?? end)
  }

  if (pointage.pauseDejDebut) {
    total -= minutesBetween(pointage.pauseDejDebut, pointage.pauseDejFin ?? end)
  }

  return Math.max(0, total)
}

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

  await prisma.ficheTravaux.update({
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

  const { compagnonId, action } = parsed.data
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

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

  let pointage = await prisma.pointageJour.findUnique({
    where: {
      compagnonId_date: {
        compagnonId,
        date: today,
      },
    },
  })

  if (!pointage) {
    pointage = await prisma.pointageJour.create({
      data: {
        compagnonId,
        date: today,
        statutActuel: 'ABSENT',
      },
    })
  }

  const update: {
    statutActuel: StatutJour
    heureArrivee?: Date
    pauseCafeDebut?: Date
    pauseCafeFin?: Date
    pauseDejDebut?: Date
    pauseDejFin?: Date
    heureDepart?: Date
    dureeMinutes?: number
  } = {
    statutActuel: pointage.statutActuel,
  }

  if (action === 'ARRIVEE') {
    if (pointage.statutActuel !== 'ABSENT' && pointage.statutActuel !== 'PARTI') {
      return NextResponse.json(
        { error: 'Le compagnon est déjà arrivé' },
        { status: 400 }
      )
    }

    update.statutActuel = 'EN_TRAVAIL'
    update.heureArrivee = now
  }

  if (action === 'PAUSE_CAFE_DEBUT') {
    if (pointage.statutActuel !== 'EN_TRAVAIL') {
      return NextResponse.json(
        { error: 'Impossible de démarrer une pause café maintenant' },
        { status: 400 }
      )
    }

    update.statutActuel = 'PAUSE_CAFE'
    update.pauseCafeDebut = now

    await prisma.pointageFiche.updateMany({
      where: {
        compagnonId,
        statut: 'EN_COURS',
      },
      data: {
        statut: 'EN_PAUSE',
      },
    })
  }

  if (action === 'PAUSE_CAFE_FIN') {
    if (pointage.statutActuel !== 'PAUSE_CAFE') {
      return NextResponse.json(
        { error: 'Aucune pause café en cours' },
        { status: 400 }
      )
    }

    update.statutActuel = 'EN_TRAVAIL'
    update.pauseCafeFin = now

    await prisma.pointageFiche.updateMany({
      where: {
        compagnonId,
        statut: 'EN_PAUSE',
      },
      data: {
        statut: 'EN_COURS',
      },
    })
  }

  if (action === 'PAUSE_DEJ_DEBUT') {
    if (pointage.statutActuel !== 'EN_TRAVAIL') {
      return NextResponse.json(
        { error: 'Impossible de démarrer une pause déjeuner maintenant' },
        { status: 400 }
      )
    }

    update.statutActuel = 'PAUSE_DEJEUNER'
    update.pauseDejDebut = now

    await prisma.pointageFiche.updateMany({
      where: {
        compagnonId,
        statut: 'EN_COURS',
      },
      data: {
        statut: 'EN_PAUSE',
      },
    })
  }

  if (action === 'PAUSE_DEJ_FIN') {
    if (pointage.statutActuel !== 'PAUSE_DEJEUNER') {
      return NextResponse.json(
        { error: 'Aucune pause déjeuner en cours' },
        { status: 400 }
      )
    }

    update.statutActuel = 'EN_TRAVAIL'
    update.pauseDejFin = now

    await prisma.pointageFiche.updateMany({
      where: {
        compagnonId,
        statut: 'EN_PAUSE',
      },
      data: {
        statut: 'EN_COURS',
      },
    })
  }

  if (action === 'DEPART') {
    if (
      pointage.statutActuel === 'ABSENT' ||
      pointage.statutActuel === 'PARTI' ||
      !pointage.heureArrivee
    ) {
      return NextResponse.json(
        { error: 'Impossible de pointer le départ maintenant' },
        { status: 400 }
      )
    }

    update.statutActuel = 'PARTI'
    update.heureDepart = now
    update.dureeMinutes = calculateWorkedMinutes(pointage, now)

    const fichesActives = await prisma.pointageFiche.findMany({
      where: {
        compagnonId,
        statut: {
          in: ['EN_COURS', 'EN_PAUSE'],
        },
      },
    })

    for (const pointageFiche of fichesActives) {
      const dureeMinutes = minutesBetween(pointageFiche.debutAt, now)

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

      await recalculateFicheTempsReel(pointageFiche.ficheId)

      const activeCount = await prisma.pointageFiche.count({
        where: {
          ficheId: pointageFiche.ficheId,
          statut: {
            in: ['EN_COURS', 'EN_PAUSE'],
          },
        },
      })

      await prisma.ficheTravaux.update({
        where: {
          id: pointageFiche.ficheId,
        },
        data: {
          statut: activeCount > 0 ? 'EN_COURS' : 'TERMINEE',
          dateFermeture: activeCount > 0 ? null : now,
        },
      })
    }
  }

  const updated = await prisma.pointageJour.update({
    where: {
      id: pointage.id,
    },
    data: update,
  })

  return NextResponse.json({ success: true, pointage: updated })
}