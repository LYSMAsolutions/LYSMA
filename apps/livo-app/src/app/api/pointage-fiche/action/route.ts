import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPointageAccess } from '@/lib/access'
import { z } from 'zod'

const schema = z.object({
  compagnonId: z.string().min(1),
  ficheId: z.string().min(1),
  action: z.enum(['POINTER', 'DEPOINTER']),
})

async function recalculateFicheTempsReel(ficheId: string) {
  const pointages = await prisma.pointageFiche.findMany({
    where: { ficheId, statut: 'TERMINE' },
  })
  const totalMinutes = pointages.reduce((sum, pointage) => sum + (pointage.dureeMinutes ?? 0), 0)
  return prisma.ficheTravaux.update({
    where: { id: ficheId },
    data: { tempsReel: totalMinutes / 60 },
  })
}

export async function POST(req: NextRequest) {
  const access = await getPointageAccess()
  if (!access) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { compagnonId, ficheId, action } = parsed.data
  const now = new Date()

  const compagnon = await prisma.compagnon.findFirst({
    where:
      access.mode === 'admin'
        ? { id: compagnonId, actif: true, garage: { ownerId: access.userId } }
        : { id: compagnonId, garageId: access.garageId, actif: true },
  })

  if (!compagnon || (access.mode === 'atelier' && access.compagnonId !== compagnon.id)) {
    return NextResponse.json({ error: 'Compagnon introuvable ou non autorisé' }, { status: 404 })
  }

  const fiche = await prisma.ficheTravaux.findFirst({
    where: {
      id: ficheId,
      garageId: compagnon.garageId,
      ...(access.mode === 'admin' ? { garage: { ownerId: access.userId } } : {}),
      statut: { in: ['EN_ATTENTE', 'EN_COURS', 'EN_PAUSE', 'TERMINEE'] },
    },
  })

  if (!fiche) return NextResponse.json({ error: 'Fiche introuvable ou non autorisée' }, { status: 404 })

  if (action === 'POINTER') {
    const pointageFiche = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM compagnons WHERE id = ${compagnonId} FOR UPDATE`
      const existing = await tx.pointageFiche.findFirst({
        where: { compagnonId, ficheId, statut: { in: ['EN_COURS', 'EN_PAUSE'] } },
      })
      if (existing) return null

      const created = await tx.pointageFiche.create({
        data: { compagnonId, ficheId, debutAt: now, statut: 'EN_COURS' },
      })
      await tx.ficheTravaux.update({
        where: { id: ficheId },
        data: { statut: 'EN_COURS', dateFermeture: null },
      })
      return created
    })

    if (!pointageFiche) {
      return NextResponse.json({ error: 'Déjà pointé sur cette fiche' }, { status: 400 })
    }

    return NextResponse.json({ success: true, pointageFiche })
  }

  const pointageFiche = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM compagnons WHERE id = ${compagnonId} FOR UPDATE`
    await tx.$queryRaw`SELECT id FROM fiches_travaux WHERE id = ${ficheId} FOR UPDATE`

    const activePointage = await tx.pointageFiche.findFirst({
      where: { compagnonId, ficheId, statut: { in: ['EN_COURS', 'EN_PAUSE'] } },
    })

    if (!activePointage) {
      return null
    }

    const dureeMinutes = Math.max(
      0,
      Math.round((now.getTime() - activePointage.debutAt.getTime()) / 60000)
    )

    await tx.pointageFiche.update({
      where: { id: activePointage.id },
      data: { statut: 'TERMINE', finAt: now, dureeMinutes },
    })

    const activeCount = await tx.pointageFiche.count({
      where: { ficheId, statut: { in: ['EN_COURS', 'EN_PAUSE'] } },
    })

    await tx.ficheTravaux.update({
      where: { id: ficheId },
      data: {
        statut: activeCount > 0 ? 'EN_COURS' : 'TERMINEE',
        dateFermeture: activeCount > 0 ? null : now,
      },
    })

    return activePointage
  })

  if (!pointageFiche) {
    return NextResponse.json({ error: 'Pas de pointage actif sur cette fiche' }, { status: 400 })
  }

  await recalculateFicheTempsReel(ficheId)

  return NextResponse.json({ success: true })
}
