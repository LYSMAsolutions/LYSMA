import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isInternalApiAuthorized } from '@/lib/security/internal-api'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isInternalApiAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id } = await params

  const integration = await prisma.externalGarageIntegration.findUnique({
    where: { id },
    include: {
      partner: { select: { id: true, name: true, key: true } },
      garage: { select: { id: true, nom: true, ville: true } },
      workOrders: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true,
          externalNumber: true,
          status: true,
          clientName: true,
          vehicleLabel: true,
          createdAt: true,
        },
      },
    },
  })

  if (!integration) {
    return NextResponse.json({ error: 'Intégration introuvable.' }, { status: 404 })
  }

  return NextResponse.json({
    integration: {
      id: integration.id,
      externalGarageId: integration.externalGarageId,
      active: integration.active,
      qrKeyId: integration.qrKeyId,
      createdAt: integration.createdAt.toISOString(),
      partner: integration.partner,
      garage: integration.garage,
      recentOrders: integration.workOrders.map((o) => ({
        ...o,
        createdAt: o.createdAt.toISOString(),
      })),
    },
  })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isInternalApiAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id } = await params

  const integration = await prisma.externalGarageIntegration.findUnique({ where: { id } })
  if (!integration) {
    return NextResponse.json({ error: 'Intégration introuvable.' }, { status: 404 })
  }

  await prisma.externalGarageIntegration.update({
    where: { id },
    data: { active: false },
  })

  return NextResponse.json({ success: true })
}
