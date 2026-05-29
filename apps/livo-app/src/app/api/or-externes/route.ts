import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireSecureSession } from '@/lib/security/secure-session'
import { getPrimaryGarageForUser } from '@/lib/garage'

const createSchema = z.object({
  externalNumber: z.string().trim().min(1).max(80),
  sourceSoftware: z.string().trim().max(120).optional().nullable(),
  clientName: z.string().trim().max(160).optional().nullable(),
  vehicleLabel: z.string().trim().max(160).optional().nullable(),
  immatriculation: z.string().trim().max(40).optional().nullable(),
  vin: z.string().trim().max(80).optional().nullable(),
  operation: z.string().trim().max(3000).optional().nullable(),
  soldHours: z.coerce.number().min(0).max(999).optional().nullable(),
  soldAmountHT: z.coerce.number().min(0).max(999999).optional().nullable(),
  assignedCompagnonId: z.string().optional().nullable(),
})

function toDecimalOrNull(value: number | null | undefined) {
  return typeof value === 'number' ? value : null
}

export async function GET(req: NextRequest) {
  const { session, response } = await requireSecureSession()
  if (response) return response

  const garage = await getPrimaryGarageForUser(session.user.id)
  if (!garage) return NextResponse.json({ error: 'Garage introuvable.' }, { status: 404 })

  const status = new URL(req.url).searchParams.get('status')
  const orders = await prisma.externalWorkOrder.findMany({
    where: {
      garageId: garage.id,
      ...(status ? { status: status as any } : {}),
    },
    include: {
      assignedCompagnon: {
        include: { user: true },
      },
      pointages: {
        include: {
          compagnon: { include: { user: true } },
        },
        orderBy: { debutAt: 'desc' },
      },
    },
    orderBy: { openedAt: 'desc' },
    take: 200,
  })

  return NextResponse.json({ orders })
}

export async function POST(req: NextRequest) {
  const { session, response } = await requireSecureSession()
  if (response) return response

  const garage = await getPrimaryGarageForUser(session.user.id)
  if (!garage) return NextResponse.json({ error: 'Garage introuvable.' }, { status: 404 })

  const parsed = createSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  if (parsed.data.assignedCompagnonId) {
    const compagnon = await prisma.compagnon.findFirst({
      where: {
        id: parsed.data.assignedCompagnonId,
        garageId: garage.id,
        actif: true,
      },
      select: { id: true },
    })
    if (!compagnon) return NextResponse.json({ error: 'Compagnon affecté introuvable.' }, { status: 400 })
  }

  const existing = await prisma.externalWorkOrder.findFirst({
    where: {
      garageId: garage.id,
      externalNumber: parsed.data.externalNumber,
    },
  })

  if (existing) {
    return NextResponse.json(
      { error: 'Une fiche miroir existe déjà pour ce numéro OR.' },
      { status: 409 }
    )
  }

  const order = await prisma.externalWorkOrder.create({
    data: {
      garageId: garage.id,
      source: 'MANUEL',
      externalNumber: parsed.data.externalNumber,
      sourceSoftware: parsed.data.sourceSoftware || null,
      clientName: parsed.data.clientName || null,
      vehicleLabel: parsed.data.vehicleLabel || null,
      immatriculation: parsed.data.immatriculation || null,
      vin: parsed.data.vin || null,
      operation:
        parsed.data.operation ||
        'Fiche miroir créée pour rattacher les pointages LIVO à un OR externe.',
      soldHours: toDecimalOrNull(parsed.data.soldHours),
      soldAmountHT: toDecimalOrNull(parsed.data.soldAmountHT),
      assignedCompagnonId: parsed.data.assignedCompagnonId || null,
      importMetadata: {
        createdBy: 'admin',
        createdFrom: 'mirror_manual_form',
      },
    },
  })

  await prisma.externalWorkOrderSyncLog.create({
    data: {
      garageId: garage.id,
      externalWorkOrderId: order.id,
      action: 'CREATE_MIRROR_MANUAL',
      status: 'SUCCESS',
      message: 'Fiche miroir OR externe créée manuellement dans LIVO.',
      payload: parsed.data,
    },
  })

  return NextResponse.json({ success: true, order }, { status: 201 })
}
