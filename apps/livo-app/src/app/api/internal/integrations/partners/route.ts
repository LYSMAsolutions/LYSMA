import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { isInternalApiAuthorized } from '@/lib/security/internal-api'
import crypto from 'node:crypto'

function generatePartnerKey() {
  return 'pk_live_' + crypto.randomBytes(24).toString('hex')
}

export async function GET(req: NextRequest) {
  if (!isInternalApiAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const partners = await prisma.externalIntegrationPartner.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { garageIntegrations: true } },
    },
  })

  return NextResponse.json({
    partners: partners.map((p) => ({
      id: p.id,
      name: p.name,
      key: p.key,
      active: p.active,
      createdAt: p.createdAt.toISOString(),
      integrationsCount: p._count.garageIntegrations,
    })),
  })
}

const createSchema = z.object({
  name: z.string().trim().min(1).max(160),
})

export async function POST(req: NextRequest) {
  if (!isInternalApiAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const parsed = createSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const partner = await prisma.externalIntegrationPartner.create({
    data: {
      name: parsed.data.name,
      key: generatePartnerKey(),
      active: true,
    },
  })

  return NextResponse.json({
    success: true,
    partner: {
      id: partner.id,
      name: partner.name,
      key: partner.key,
      active: partner.active,
      createdAt: partner.createdAt.toISOString(),
    },
  }, { status: 201 })
}
