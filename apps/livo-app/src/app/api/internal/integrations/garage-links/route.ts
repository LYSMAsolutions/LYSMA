import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { isInternalApiAuthorized } from '@/lib/security/internal-api'
import { encryptSecret } from '@/lib/security/crypto'
import crypto from 'node:crypto'

function generateApiSecret() {
  return 'sk_live_' + crypto.randomBytes(32).toString('hex')
}

function generateQrSecret() {
  return crypto.randomBytes(32).toString('hex')
}

function generateQrKeyId() {
  return crypto.randomBytes(8).toString('hex')
}

export async function GET(req: NextRequest) {
  if (!isInternalApiAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const integrations = await prisma.externalGarageIntegration.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      partner: { select: { id: true, name: true, key: true } },
      garage: { select: { id: true, nom: true, ville: true } },
      _count: { select: { workOrders: true } },
    },
  })

  return NextResponse.json({
    integrations: integrations.map((i) => ({
      id: i.id,
      externalGarageId: i.externalGarageId,
      active: i.active,
      qrKeyId: i.qrKeyId,
      createdAt: i.createdAt.toISOString(),
      partner: i.partner,
      garage: i.garage,
      ordersCount: i._count.workOrders,
    })),
  })
}

const createSchema = z.object({
  partnerId: z.string().min(1),
  garageId: z.string().min(1),
  externalGarageId: z.string().trim().min(1).max(120),
})

export async function POST(req: NextRequest) {
  if (!isInternalApiAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const parsed = createSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { partnerId, garageId, externalGarageId } = parsed.data

  const [partner, garage] = await Promise.all([
    prisma.externalIntegrationPartner.findUnique({ where: { id: partnerId } }),
    prisma.garage.findUnique({ where: { id: garageId }, select: { id: true, nom: true } }),
  ])

  if (!partner || !partner.active) {
    return NextResponse.json({ error: 'Partenaire introuvable ou inactif.' }, { status: 404 })
  }
  if (!garage) {
    return NextResponse.json({ error: 'Garage introuvable.' }, { status: 404 })
  }

  const apiSecret = generateApiSecret()
  const qrSecret = generateQrSecret()
  const qrKeyId = generateQrKeyId()

  const integration = await prisma.externalGarageIntegration.create({
    data: {
      partnerId,
      garageId,
      externalGarageId,
      apiSecretEncrypted: encryptSecret(apiSecret),
      qrSecretEncrypted: encryptSecret(qrSecret),
      qrKeyId,
      active: true,
    },
  })

  return NextResponse.json({
    success: true,
    integration: {
      id: integration.id,
      externalGarageId: integration.externalGarageId,
      qrKeyId: integration.qrKeyId,
      createdAt: integration.createdAt.toISOString(),
    },
    credentials: {
      partnerKey: partner.key,
      apiSecret,
      externalGarageId: integration.externalGarageId,
    },
    note: 'Conservez ces identifiants — le apiSecret ne pourra plus être affiché en clair.',
  }, { status: 201 })
}
