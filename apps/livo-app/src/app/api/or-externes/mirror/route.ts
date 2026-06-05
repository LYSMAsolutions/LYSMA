import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import type { ExternalPointageStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getPointageAccess } from '@/lib/access'
import {
  externalWorkOrderPayloadSchema,
  parseExternalWorkOrderQrPayload,
} from '@/lib/external-work-orders'

const schema = z.object({
  compagnonId: z.string().min(1),
  externalNumber: z.string().trim().max(80).optional().nullable(),
  sourceSoftware: z.string().trim().max(120).optional().nullable(),
  qrPayload: z.string().trim().max(2000).optional().nullable(),
}).refine((value) => Boolean(value.externalNumber?.trim() || value.qrPayload?.trim()), {
  message: 'Un numero OR ou un QR code est requis.',
})

const ACTIVE_POINTAGE_STATUSES: ExternalPointageStatus[] = ['EN_COURS', 'EN_PAUSE']

const activePointageInclude = (compagnonId: string) => ({
  pointages: {
    where: {
      compagnonId,
      statut: { in: ACTIVE_POINTAGE_STATUSES },
    },
    take: 1,
    orderBy: { debutAt: 'desc' as const },
  },
})

type ExternalWorkOrderPayload = z.infer<typeof externalWorkOrderPayloadSchema>

function buildExistingUpdate(payload: ExternalWorkOrderPayload, promoteToQr: boolean) {
  return {
    ...(promoteToQr ? { source: 'QR_CODE' as const } : {}),
    sourceSoftware: payload.sourceSoftware || undefined,
    clientName: payload.clientName || undefined,
    vehicleLabel: payload.vehicleLabel || undefined,
    immatriculation: payload.immatriculation || undefined,
    vin: payload.vin || undefined,
    operation: payload.operation || undefined,
    soldHours: payload.soldHours ?? undefined,
    soldAmountHT: payload.soldAmountHT ?? undefined,
  }
}

export async function POST(req: NextRequest) {
  const access = await getPointageAccess()
  if (!access) return NextResponse.json({ error: 'Non autorise.' }, { status: 401 })

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const qrResult = parsed.data.qrPayload
    ? parseExternalWorkOrderQrPayload(parsed.data.qrPayload)
    : null

  if (qrResult && !qrResult.success) {
    return NextResponse.json({ error: qrResult.error }, { status: 400 })
  }

  const payloadResult = externalWorkOrderPayloadSchema.safeParse({
    ...(qrResult?.success ? qrResult.data : {}),
    externalNumber: parsed.data.externalNumber?.trim() || (qrResult?.success ? qrResult.data.externalNumber : undefined),
    sourceSoftware: parsed.data.sourceSoftware || (qrResult?.success ? qrResult.data.sourceSoftware : undefined),
  })

  if (!payloadResult.success) {
    return NextResponse.json({ error: 'Numero OR externe introuvable.' }, { status: 400 })
  }

  const payload = payloadResult.data
  const hasQrPayload = Boolean(parsed.data.qrPayload)

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
    return NextResponse.json({ error: 'Compagnon introuvable ou non autorise.' }, { status: 404 })
  }

  const order = await prisma.$transaction(async (tx) => {
    const include = activePointageInclude(compagnon.id)
    const existing = await tx.externalWorkOrder.findFirst({
      where: {
        garageId: compagnon.garageId,
        externalNumber: payload.externalNumber,
      },
      include,
    })

    if (existing) {
      return tx.externalWorkOrder.update({
        where: { id: existing.id },
        data: {
          ...buildExistingUpdate(payload, hasQrPayload && existing.source === 'MANUEL'),
          importMetadata: {
            recognizedFrom: hasQrPayload ? 'atelier_qr' : 'atelier_manual_entry',
            recognizedAt: new Date().toISOString(),
            qrPayload: parsed.data.qrPayload || null,
          },
        },
        include,
      })
    }

    const created = await tx.externalWorkOrder.create({
      data: {
        garageId: compagnon.garageId,
        source: hasQrPayload ? 'QR_CODE' : 'MANUEL',
        externalNumber: payload.externalNumber,
        sourceSoftware: payload.sourceSoftware || null,
        clientName: payload.clientName || null,
        vehicleLabel: payload.vehicleLabel || null,
        immatriculation: payload.immatriculation || null,
        vin: payload.vin || null,
        operation:
          payload.operation ||
          'Fiche miroir creee depuis l espace atelier pour rattacher les pointages LIVO.',
        soldHours: payload.soldHours ?? null,
        soldAmountHT: payload.soldAmountHT ?? null,
        importMetadata: {
          createdFrom: hasQrPayload ? 'atelier_qr' : 'atelier_manual_entry',
          qrPayload: parsed.data.qrPayload || null,
        },
      },
      include,
    })

    await tx.externalWorkOrderSyncLog.create({
      data: {
        garageId: compagnon.garageId,
        externalWorkOrderId: created.id,
        action: hasQrPayload ? 'CREATE_FROM_QR' : 'CREATE_FROM_ATELIER_NUMBER',
        status: 'SUCCESS',
        message: 'Fiche miroir OR externe creee pour le pointage atelier.',
        payload: {
          externalNumber: payload.externalNumber,
          sourceSoftware: payload.sourceSoftware || null,
          hasQrPayload,
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
