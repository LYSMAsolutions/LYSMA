import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireSecureSession } from '@/lib/security/secure-session'

const patchSchema = z.object({
  action: z.enum(['CLOTURER', 'ANNULER']),
  motif: z.string().trim().min(8).max(1000),
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
  const updated = await prisma.externalWorkOrder.update({
    where: { id },
    data: {
      status,
      closedAt: new Date(),
    },
  })

  await prisma.externalWorkOrderSyncLog.create({
    data: {
      garageId: order.garageId,
      externalWorkOrderId: id,
      action: parsed.data.action,
      status: 'SUCCESS',
      message: parsed.data.motif,
      payload: {
        oldStatus: order.status,
        newStatus: status,
      },
    },
  })

  return NextResponse.json({ success: true, order: updated })
}
