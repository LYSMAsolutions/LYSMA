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

  const partner = await prisma.externalIntegrationPartner.findUnique({
    where: { id },
    include: {
      integrations: {
        include: { garage: { select: { id: true, nom: true, ville: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!partner) {
    return NextResponse.json({ error: 'Partenaire introuvable.' }, { status: 404 })
  }

  return NextResponse.json({
    partner: {
      id: partner.id,
      name: partner.name,
      key: partner.key,
      active: partner.active,
      createdAt: partner.createdAt.toISOString(),
      integrations: partner.integrations.map((i) => ({
        id: i.id,
        externalGarageId: i.externalGarageId,
        active: i.active,
        qrKeyId: i.qrKeyId,
        createdAt: i.createdAt.toISOString(),
        garage: i.garage,
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

  const partner = await prisma.externalIntegrationPartner.findUnique({ where: { id } })
  if (!partner) {
    return NextResponse.json({ error: 'Partenaire introuvable.' }, { status: 404 })
  }

  await prisma.externalIntegrationPartner.update({
    where: { id },
    data: { active: false },
  })

  return NextResponse.json({ success: true })
}
