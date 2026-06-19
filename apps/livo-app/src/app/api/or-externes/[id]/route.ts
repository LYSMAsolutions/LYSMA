import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireSecureSession } from '@/lib/security/secure-session'

const patchSchema = z.object({
  action: z.enum(['CLOTURER', 'ANNULER']),
  motif: z.string().trim().max(1000).optional().nullable(),
  tauxType: z.enum(['T1', 'T2', 'T3', 'T4', 'CARROSSERIE', 'PEINTURE', 'AUTRE']).optional().nullable(),
  soldHours: z.coerce.number().min(0).max(999).optional().nullable(),
  soldAmountHT: z.coerce.number().min(0).max(999999).optional().nullable(),
  billedHours: z.coerce.number().min(0).max(999).optional().nullable(),
  billedAmountHT: z.coerce.number().min(0).max(999999).optional().nullable(),
  laborAmountHT: z.coerce.number().min(0).max(999999).optional().nullable(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, response } = await requireSecureSession()
  if (response) return response

  const { id } = await params
  const parsed = patchSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const order = await prisma.externalWorkOrder.findFirst({
    where: {
      id,
      garage: { ownerId: session.user.id },
    },
  })

  if (!order) return NextResponse.json({ error: 'OR externe introuvable ou non autorisé.' }, { status: 404 })

  const activePointages = await prisma.externalWorkOrderPointage.count({
    where: {
      externalWorkOrderId: id,
      statut: { in: ['EN_COURS', 'EN_PAUSE'] },
    },
  })

  if (activePointages > 0) {
    return NextResponse.json({ error: 'Impossible de clôturer un OR externe avec un pointage actif.' }, { status: 400 })
  }

  const status = parsed.data.action === 'CLOTURER' ? 'CLOTURE' : 'ANNULE'
  let closureData = {}

  if (parsed.data.action === 'CLOTURER') {
    if (!parsed.data.tauxType) {
      return NextResponse.json({ error: 'Selectionnez un taux horaire pour cloturer cet OR.' }, { status: 400 })
    }

    const tauxGarage = await prisma.tauxGarage.findFirst({
      where: {
        garageId: order.garageId,
        type: parsed.data.tauxType,
        actif: true,
      },
    })

    if (!tauxGarage) {
      return NextResponse.json({ error: 'Taux horaire introuvable ou inactif.' }, { status: 400 })
    }

    const realMinutes = await prisma.externalWorkOrderPointage.aggregate({
      where: {
        externalWorkOrderId: id,
        statut: 'TERMINE',
      },
      _sum: {
        dureeMinutes: true,
      },
    })

    const actualMinutes = realMinutes._sum.dureeMinutes ?? 0
    const fallbackHours = actualMinutes / 60
    const billedHours = parsed.data.billedHours
      ?? parsed.data.soldHours
      ?? (order.billedHours ? Number(order.billedHours) : null)
      ?? (order.soldHours ? Number(order.soldHours) : null)
      ?? fallbackHours
    const billedAmountHT = parsed.data.billedAmountHT
      ?? parsed.data.soldAmountHT
      ?? (order.billedAmountHT ? Number(order.billedAmountHT) : null)
      ?? (order.soldAmountHT ? Number(order.soldAmountHT) : null)
      ?? billedHours * Number(tauxGarage.montant)
    const laborAmountHT = parsed.data.laborAmountHT
      ?? (order.laborAmountHT ? Number(order.laborAmountHT) : null)
      ?? billedHours * Number(tauxGarage.montant)

    closureData = {
      soldHours: order.soldHours ?? billedHours,
      billedHours,
      soldAmountHT: billedAmountHT,
      billedAmountHT,
      laborAmountHT,
      tauxApplique: tauxGarage.type,
      tauxLibelle: tauxGarage.libelle,
      tauxHoraire: tauxGarage.montant,
      billingHourlyRateHT: tauxGarage.montant,
      actualMinutes,
      closureComment: parsed.data.motif || null,
    }
  }

  const updated = await prisma.externalWorkOrder.update({
    where: { id },
    data: {
      status,
      closedAt: new Date(),
      ...closureData,
    },
  })

  await prisma.externalWorkOrderSyncLog.create({
    data: {
      garageId: order.garageId,
      externalWorkOrderId: id,
      action: parsed.data.action,
      status: 'SUCCESS',
      message: parsed.data.motif || (parsed.data.action === 'CLOTURER' ? 'OR externe cloture par l admin.' : 'OR externe annule par l admin.'),
      payload: {
        oldStatus: order.status,
        newStatus: status,
        tauxType: parsed.data.tauxType || null,
        soldHours: parsed.data.soldHours ?? null,
        soldAmountHT: parsed.data.soldAmountHT ?? null,
        billedHours: parsed.data.billedHours ?? null,
        billedAmountHT: parsed.data.billedAmountHT ?? null,
        laborAmountHT: parsed.data.laborAmountHT ?? null,
      },
    },
  })

  return NextResponse.json({ success: true, order: updated })
}
