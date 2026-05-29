import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getPointageAccess } from '@/lib/access'

const schema = z.object({
  compagnonId: z.string().min(1),
  externalNumber: z.string().trim().min(1).max(80),
  sourceSoftware: z.string().trim().max(120).optional().nullable(),
  qrPayload: z.string().trim().max(2000).optional().nullable(),
})

export async function POST(req: NextRequest) {
  const access = await getPointageAccess()
  if (!access) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const compagnon = await prisma.compagnon.findFirst({
    where:
      access.mode === 'admin'
        ? { id: parsed.data.compagnonId, actif: true, garage: { ownerId: access.userId } }
        : { id: parsed.data.compagnonId, garageId: access.garageId, actif: true },
    select: {
      id: true,
      garageId: true,
    },
  })

  if (!compagnon || (access.mode === 'atelier' && access.compagnonId !== compagnon.id)) {
    return NextResponse.json({ error: 'Compagnon introuvable ou non autorisé.' }, { status: 404 })
  }

  const externalNumber = parsed.data.externalNumber.trim()
  const source = parsed.data.qrPayload ? 'QR_CODE' : 'MANUEL'

  const order = await prisma.$transaction(async (tx) => {
    const existing = await tx.externalWorkOrder.findFirst({
      where: {
        garageId: compagnon.garageId,
        externalNumber,
      },
      include: {
        pointages: {
          where: {
            compagnonId: compagnon.id,
            statut: { in: ['EN_COURS', 'EN_PAUSE'] },
          },
          take: 1,
          orderBy: { debutAt: 'desc' },
        },
      },
    })

    if (existing) return existing

    const created = await tx.externalWorkOrder.create({
      data: {
        garageId: compagnon.garageId,
        source,
        externalNumber,
        sourceSoftware: parsed.data.sourceSoftware || null,
        clientName: null,
        vehicleLabel: null,
        operation: 'Fiche miroir créée depuis l’espace atelier pour rattacher les pointages LIVO.',
        importMetadata: {
          createdFrom: parsed.data.qrPayload ? 'atelier_qr' : 'atelier_manual_entry',
          qrPayload: parsed.data.qrPayload || null,
        },
      },
      include: {
        pointages: {
          where: {
            compagnonId: compagnon.id,
            statut: { in: ['EN_COURS', 'EN_PAUSE'] },
          },
          take: 1,
          orderBy: { debutAt: 'desc' },
        },
      },
    })

    await tx.externalWorkOrderSyncLog.create({
      data: {
        garageId: compagnon.garageId,
        externalWorkOrderId: created.id,
        action: parsed.data.qrPayload ? 'CREATE_FROM_QR' : 'CREATE_FROM_ATELIER_NUMBER',
        status: 'SUCCESS',
        message: 'Fiche miroir OR externe créée pour le pointage atelier.',
        payload: {
          externalNumber,
          sourceSoftware: parsed.data.sourceSoftware || null,
          hasQrPayload: Boolean(parsed.data.qrPayload),
        },
      },
    })

    return created
  })

  const realMinutes = await prisma.externalWorkOrderPointage.aggregate({
    where: {
      externalWorkOrderId: order.id,
      statut: 'TERMINE',
    },
    _sum: {
      dureeMinutes: true,
    },
  })

  return NextResponse.json({
    order: {
      id: order.id,
      externalNumber: order.externalNumber,
      source: order.source,
      sourceSoftware: order.sourceSoftware,
      clientName: order.clientName,
      vehicleLabel: order.vehicleLabel,
      immatriculation: order.immatriculation,
      operation: order.operation,
      status: order.status,
      soldHours: order.soldHours ? Number(order.soldHours) : null,
      soldAmountHT: order.soldAmountHT ? Number(order.soldAmountHT) : null,
      realMinutes: realMinutes._sum.dureeMinutes ?? 0,
      activePointage: order.pointages[0]
        ? {
            id: order.pointages[0].id,
            debutAt: order.pointages[0].debutAt,
          }
        : null,
    },
  })
}
