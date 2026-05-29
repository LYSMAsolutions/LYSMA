import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPointageAccess } from '@/lib/access'
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
  confirmerFinJournee: z.boolean().optional(),
})

type StatutJour = 'ABSENT' | 'ARRIVE' | 'EN_TRAVAIL' | 'PAUSE_CAFE' | 'PAUSE_DEJEUNER' | 'PARTI'

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
  if (pointage.pauseCafeDebut) total -= minutesBetween(pointage.pauseCafeDebut, pointage.pauseCafeFin ?? end)
  if (pointage.pauseDejDebut) total -= minutesBetween(pointage.pauseDejDebut, pointage.pauseDejFin ?? end)
  return Math.max(0, total)
}

async function recalculateFicheTempsReel(ficheId: string) {
  const pointages = await prisma.pointageFiche.findMany({
    where: { ficheId, statut: 'TERMINE' },
  })

  const totalMinutes = pointages.reduce((sum, pointage) => sum + (pointage.dureeMinutes ?? 0), 0)

  await prisma.ficheTravaux.update({
    where: { id: ficheId },
    data: { tempsReel: totalMinutes / 60 },
  })
}

export async function POST(req: NextRequest) {
  const access = await getPointageAccess()
  if (!access) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { compagnonId, action, confirmerFinJournee } = parsed.data
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const compagnon = await prisma.compagnon.findFirst({
    where:
      access.mode === 'admin'
        ? { id: compagnonId, actif: true, garage: { ownerId: access.userId } }
        : { id: compagnonId, garageId: access.garageId, actif: true },
  })

  if (!compagnon || (access.mode === 'atelier' && access.compagnonId !== compagnon.id)) {
    return NextResponse.json({ error: 'Compagnon introuvable ou non autorisé' }, { status: 404 })
  }

  const pointage = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM compagnons WHERE id = ${compagnonId} FOR UPDATE`
    return tx.pointageJour.upsert({
      where: { compagnonId_date: { compagnonId, date: today } },
      create: { compagnonId, date: today, statutActuel: 'ABSENT' },
      update: {},
    })
  })

  const update: {
    statutActuel: StatutJour
    heureArrivee?: Date
    pauseCafeDebut?: Date
    pauseCafeFin?: Date
    pauseDejDebut?: Date
    pauseDejFin?: Date
    heureDepart?: Date
    dureeMinutes?: number
  } = { statutActuel: pointage.statutActuel }

  if (action === 'ARRIVEE') {
    if (pointage.heureDepart || pointage.statutActuel === 'PARTI') {
      return NextResponse.json({
        error: 'Votre journée a déjà été clôturée. Vous ne pouvez plus repointer en arrivée atelier aujourd’hui.',
      }, { status: 400 })
    }

    if (pointage.statutActuel !== 'ABSENT') {
      return NextResponse.json({ error: 'Le compagnon est déjà arrivé' }, { status: 400 })
    }
    update.statutActuel = 'EN_TRAVAIL'
    update.heureArrivee = now
  }

  if (action === 'PAUSE_CAFE_DEBUT') {
    if (pointage.statutActuel !== 'EN_TRAVAIL') {
      return NextResponse.json({ error: 'Impossible de démarrer une pause café maintenant' }, { status: 400 })
    }
    update.statutActuel = 'PAUSE_CAFE'
    update.pauseCafeDebut = now
    await prisma.pointageFiche.updateMany({ where: { compagnonId, statut: 'EN_COURS' }, data: { statut: 'EN_PAUSE' } })
  }

  if (action === 'PAUSE_CAFE_FIN') {
    if (pointage.statutActuel !== 'PAUSE_CAFE') {
      return NextResponse.json({ error: 'Aucune pause café en cours' }, { status: 400 })
    }
    update.statutActuel = 'EN_TRAVAIL'
    update.pauseCafeFin = now
    await prisma.pointageFiche.updateMany({ where: { compagnonId, statut: 'EN_PAUSE' }, data: { statut: 'EN_COURS' } })
  }

  if (action === 'PAUSE_DEJ_DEBUT') {
    if (pointage.statutActuel !== 'EN_TRAVAIL') {
      return NextResponse.json({ error: 'Impossible de démarrer une pause déjeuner maintenant' }, { status: 400 })
    }
    update.statutActuel = 'PAUSE_DEJEUNER'
    update.pauseDejDebut = now
    await prisma.pointageFiche.updateMany({ where: { compagnonId, statut: 'EN_COURS' }, data: { statut: 'EN_PAUSE' } })
  }

  if (action === 'PAUSE_DEJ_FIN') {
    if (pointage.statutActuel !== 'PAUSE_DEJEUNER') {
      return NextResponse.json({ error: 'Aucune pause déjeuner en cours' }, { status: 400 })
    }
    update.statutActuel = 'EN_TRAVAIL'
    update.pauseDejFin = now
    await prisma.pointageFiche.updateMany({ where: { compagnonId, statut: 'EN_PAUSE' }, data: { statut: 'EN_COURS' } })
  }

  if (action === 'DEPART') {
    if (!confirmerFinJournee) {
      return NextResponse.json({
        error: 'Confirmation obligatoire avant de clôturer la journée de pointage.',
      }, { status: 400 })
    }

    if (pointage.statutActuel === 'ABSENT' || pointage.statutActuel === 'PARTI' || !pointage.heureArrivee) {
      return NextResponse.json({ error: 'Impossible de pointer le départ maintenant' }, { status: 400 })
    }

    update.statutActuel = 'PARTI'
    update.heureDepart = now
    update.dureeMinutes = calculateWorkedMinutes(pointage, now)

    const fichesActives = await prisma.pointageFiche.findMany({
      where: { compagnonId, statut: { in: ['EN_COURS', 'EN_PAUSE'] } },
    })

    for (const pointageFiche of fichesActives) {
      const dureeMinutes = minutesBetween(pointageFiche.debutAt, now)
      await prisma.pointageFiche.update({
        where: { id: pointageFiche.id },
        data: { statut: 'TERMINE', finAt: now, dureeMinutes },
      })
      await recalculateFicheTempsReel(pointageFiche.ficheId)
      const activeCount = await prisma.pointageFiche.count({
        where: { ficheId: pointageFiche.ficheId, statut: { in: ['EN_COURS', 'EN_PAUSE'] } },
      })
      await prisma.ficheTravaux.update({
        where: { id: pointageFiche.ficheId },
        data: { statut: activeCount > 0 ? 'EN_COURS' : 'TERMINEE', dateFermeture: activeCount > 0 ? null : now },
      })
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    const saved = await tx.pointageJour.update({
      where: { id: pointage.id },
      data: update,
    })

    await tx.pointageAuditLog.create({
      data: {
        action: 'CREATION',
        targetType: 'POINTAGE_JOUR',
        targetId: saved.id,
        pointageJourId: saved.id,
        compagnonId,
        garageId: compagnon.garageId,
        userId: access.mode === 'admin' ? access.userId : null,
        field: 'action',
        oldValue: {
          statutActuel: pointage.statutActuel,
          heureArrivee: pointage.heureArrivee?.toISOString() ?? null,
          heureDepart: pointage.heureDepart?.toISOString() ?? null,
        },
        newValue: {
          action,
          statutActuel: saved.statutActuel,
          heureArrivee: saved.heureArrivee?.toISOString() ?? null,
          heureDepart: saved.heureDepart?.toISOString() ?? null,
          dureeMinutes: saved.dureeMinutes,
        },
        motif:
          access.mode === 'atelier'
            ? 'Action de pointage enregistrée depuis l’espace atelier.'
            : 'Action de pointage enregistrée depuis l’espace administrateur.',
        ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
        userAgent: req.headers.get('user-agent'),
      },
    })

    return saved
  })

  return NextResponse.json({ success: true, pointage: updated })
}
