import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getPointageAccess } from '@/lib/access'

const schema = z.object({
  compagnonId: z.string().min(1),
  action: z.enum(['POINTER', 'DEPOINTER']),
})

function minutesBetween(start: Date, end: Date) {
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000))
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await getPointageAccess()
  if (!access) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const { id } = await params
  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { compagnonId, action } = parsed.data
  const compagnon = await prisma.compagnon.findFirst({
    where:
      access.mode === 'admin'
        ? { id: compagnonId, actif: true, garage: { ownerId: access.userId } }
        : { id: compagnonId, garageId: access.garageId, actif: true },
  })

  if (!compagnon || (access.mode === 'atelier' && access.compagnonId !== compagnon.id)) {
    return NextResponse.json({ error: 'Compagnon introuvable ou non autorisé.' }, { status: 404 })
  }

  const order = await prisma.externalWorkOrder.findFirst({
    where: {
      id,
      garageId: compagnon.garageId,
      status: { in: ['OUVERT', 'EN_COURS', 'EN_PAUSE', 'TERMINE'] },
    },
  })

  if (!order) return NextResponse.json({ error: 'OR externe introuvable ou non autorisé.' }, { status: 404 })

  const now = new Date()

  if (action === 'POINTER') {
    const pointage = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM compagnons WHERE id = ${compagnonId} FOR UPDATE`
      await tx.$queryRaw`SELECT id FROM external_work_orders WHERE id = ${id} FOR UPDATE`

      const existing = await tx.externalWorkOrderPointage.findFirst({
        where: {
          compagnonId,
          externalWorkOrderId: id,
          statut: { in: ['EN_COURS', 'EN_PAUSE'] },
        },
      })

      if (existing) return null

      const created = await tx.externalWorkOrderPointage.create({
        data: {
          compagnonId,
          externalWorkOrderId: id,
          debutAt: now,
          statut: 'EN_COURS',
        },
      })

      await tx.externalWorkOrder.update({
        where: { id },
        data: { status: 'EN_COURS' },
      })

      await tx.pointageAuditLog.create({
        data: {
          action: 'CREATION',
          targetType: 'OR_EXTERNE',
          targetId: id,
          compagnonId,
          garageId: compagnon.garageId,
          userId: access.mode === 'admin' ? access.userId : null,
          field: 'pointage',
          newValue: {
            action,
            externalWorkOrderId: id,
            externalNumber: order.externalNumber,
            debutAt: created.debutAt.toISOString(),
            statut: created.statut,
          },
          motif: 'Début de pointage sur OR externe.',
          ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
          userAgent: req.headers.get('user-agent'),
        },
      })

      return created
    })

    if (!pointage) {
      return NextResponse.json({ error: 'Déjà pointé sur cet OR externe.' }, { status: 400 })
    }

    return NextResponse.json({ success: true, pointage })
  }

  const pointage = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM compagnons WHERE id = ${compagnonId} FOR UPDATE`
    await tx.$queryRaw`SELECT id FROM external_work_orders WHERE id = ${id} FOR UPDATE`

    const active = await tx.externalWorkOrderPointage.findFirst({
      where: {
        compagnonId,
        externalWorkOrderId: id,
        statut: { in: ['EN_COURS', 'EN_PAUSE'] },
      },
    })

    if (!active) return null

    const updated = await tx.externalWorkOrderPointage.update({
      where: { id: active.id },
      data: {
        statut: 'TERMINE',
        finAt: now,
        dureeMinutes: minutesBetween(active.debutAt, now),
      },
    })

    const activeCount = await tx.externalWorkOrderPointage.count({
      where: {
        externalWorkOrderId: id,
        statut: { in: ['EN_COURS', 'EN_PAUSE'] },
      },
    })

    await tx.externalWorkOrder.update({
      where: { id },
      data: { status: activeCount > 0 ? 'EN_COURS' : 'TERMINE' },
    })

    await tx.pointageAuditLog.create({
      data: {
        action: 'CREATION',
        targetType: 'OR_EXTERNE',
        targetId: id,
        compagnonId,
        garageId: compagnon.garageId,
        userId: access.mode === 'admin' ? access.userId : null,
        field: 'pointage',
        oldValue: {
          statut: active.statut,
          debutAt: active.debutAt.toISOString(),
        },
        newValue: {
          action,
          externalWorkOrderId: id,
          externalNumber: order.externalNumber,
          finAt: updated.finAt?.toISOString() ?? null,
          dureeMinutes: updated.dureeMinutes,
          statut: updated.statut,
        },
        motif: 'Fin de pointage sur OR externe.',
        ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
        userAgent: req.headers.get('user-agent'),
      },
    })

    return updated
  })

  if (!pointage) {
    return NextResponse.json({ error: 'Aucun pointage actif sur cet OR externe.' }, { status: 400 })
  }

  return NextResponse.json({ success: true, pointage })
}
