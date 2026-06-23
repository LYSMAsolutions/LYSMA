import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isInternalApiAuthorized } from '@/lib/security/internal-api'
import { decryptSecret, encryptSecret } from '@/lib/security/crypto'
import crypto from 'node:crypto'

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
    include: { partner: true },
  })

  if (!integration) {
    return NextResponse.json({ error: 'Intégration introuvable.' }, { status: 404 })
  }

  if (!integration.active) {
    return NextResponse.json({ error: 'Intégration désactivée.' }, { status: 403 })
  }

  const apiSecret = decryptSecret(integration.apiSecretEncrypted)

  return NextResponse.json({
    credentials: {
      partnerKey: integration.partner.key,
      apiSecret,
      externalGarageId: integration.externalGarageId,
    },
    endpoint: 'POST /api/v1/or/qr',
    headers: {
      'x-livo-partner-key': integration.partner.key,
      'x-livo-garage-id': integration.externalGarageId,
      'x-livo-api-secret': apiSecret,
      'Content-Type': 'application/json',
    },
  })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isInternalApiAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id } = await params

  const integration = await prisma.externalGarageIntegration.findUnique({
    where: { id },
    include: { partner: true },
  })

  if (!integration) {
    return NextResponse.json({ error: 'Intégration introuvable.' }, { status: 404 })
  }

  const newApiSecret = 'sk_live_' + crypto.randomBytes(32).toString('hex')

  await prisma.externalGarageIntegration.update({
    where: { id },
    data: { apiSecretEncrypted: encryptSecret(newApiSecret) },
  })

  return NextResponse.json({
    success: true,
    credentials: {
      partnerKey: integration.partner.key,
      apiSecret: newApiSecret,
      externalGarageId: integration.externalGarageId,
    },
    note: 'Le secret précédent est révoqué immédiatement.',
  })
}
