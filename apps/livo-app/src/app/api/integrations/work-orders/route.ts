import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { isInternalApiAuthorized } from '@/lib/security/internal-api'
import {
  buildExternalWorkOrderQrPayload,
  compactExternalWorkOrderData,
  externalWorkOrderPayloadSchema,
} from '@/lib/external-work-orders'

const upsertSchema = externalWorkOrderPayloadSchema.extend({
  garageId: z.string().min(1),
})

function toImportMetadata(sourceSoftware: string | null | undefined) {
  return {
    importedBy: 'external_billing_software',
    importedAt: new Date().toISOString(),
    sourceSoftware: sourceSoftware || null,
  }
}

export async function POST(req: NextRequest) {
  if (!isInternalApiAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorise.' }, { status: 401 })
  }

  const parsed = upsertSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { garageId, ...payload } = parsed.data

  const garage = await prisma.garage.findUnique({
    where: { id: garageId },
    select: { id: true },
  })

  if (!garage) {
    return NextResponse.json({ error: 'Garage introuvable.' }, { status: 404 })
  }

  const data = compactExternalWorkOrderData(payload)

  const order = await prisma.$transaction(async (tx) => {
    const existing = await tx.externalWorkOrder.findFirst({
      where: {
        garageId,
        externalNumber: payload.externalNumber,
      },
    })

    if (existing) {
      const updated = await tx.externalWorkOrder.update({
        where: { id: existing.id },
        data: {
          ...data,
          source: 'API_EXTERNE',
          operation: payload.operation || existing.operation || 'OR importe depuis le logiciel atelier.',
          importMetadata: toImportMetadata(payload.sourceSoftware),
        },
      })

      await tx.externalWorkOrderSyncLog.create({
        data: {
          garageId,
          externalWorkOrderId: updated.id,
          action: 'UPSERT_FROM_EXTERNAL_API',
          status: 'SUCCESS',
          message: 'OR externe mis a jour depuis le logiciel atelier.',
          payload,
        },
      })

      return updated
    }

    const created = await tx.externalWorkOrder.create({
      data: {
        garageId,
        source: 'API_EXTERNE',
        externalNumber: payload.externalNumber,
        ...data,
        operation: payload.operation || 'OR importe depuis le logiciel atelier.',
        importMetadata: toImportMetadata(payload.sourceSoftware),
      },
    })

    await tx.externalWorkOrderSyncLog.create({
      data: {
        garageId,
        externalWorkOrderId: created.id,
        action: 'CREATE_FROM_EXTERNAL_API',
        status: 'SUCCESS',
        message: 'OR externe cree depuis le logiciel atelier.',
        payload,
      },
    })

    return created
  })

  return NextResponse.json(
    {
      success: true,
      order: {
        id: order.id,
        externalNumber: order.externalNumber,
        status: order.status,
      },
      qrPayload: buildExternalWorkOrderQrPayload(payload),
    },
    { status: 201 }
  )
}
