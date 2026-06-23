import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { decryptSecret } from '@/lib/security/crypto'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { requestIp } from '@/lib/security/audit'
import { buildSignedExternalWorkOrderQrPayload } from '@/lib/work-order-qr'
import {
  externalWorkOrderUniqueWhere,
  normalizeExternalWorkOrderNumber,
} from '@/lib/external-work-order-key'
import crypto from 'node:crypto'

const schema = z.object({
  number: z.string().trim().min(1).max(80),
  client: z.object({
    nom: z.string().trim().max(160).optional().nullable(),
    tel: z.string().trim().max(40).optional().nullable(),
  }).optional().nullable(),
  vehicule: z.object({
    immat: z.string().trim().max(40).optional().nullable(),
    marque: z.string().trim().max(80).optional().nullable(),
    modele: z.string().trim().max(120).optional().nullable(),
    annee: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
    vin: z.string().trim().max(80).optional().nullable(),
  }).optional().nullable(),
  travaux: z.string().trim().max(3000).optional().nullable(),
})

function constantTimeEqual(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb)
}

export async function POST(req: NextRequest) {
  const ip = requestIp(req.headers)

  const limiter = await checkRateLimit({
    key: `v1-or-qr:${ip ?? 'unknown'}`,
    limit: 60,
    windowSeconds: 60,
    blockSeconds: 60 * 5,
  })
  if (!limiter.allowed) {
    return NextResponse.json({ success: false, error: 'Trop de requêtes.' }, { status: 429 })
  }

  const partnerKey = req.headers.get('x-livo-partner-key')?.trim()
  const externalGarageId = req.headers.get('x-livo-garage-id')?.trim()
  const apiSecret = req.headers.get('x-livo-api-secret')?.trim()

  if (!partnerKey || !externalGarageId || !apiSecret) {
    return NextResponse.json({ success: false, error: 'Authentification incomplète. Headers requis : x-livo-partner-key, x-livo-garage-id, x-livo-api-secret.' }, { status: 401 })
  }

  const integration = await prisma.externalGarageIntegration.findFirst({
    where: {
      externalGarageId,
      active: true,
      partner: { key: partnerKey, active: true },
    },
    include: { partner: true },
  })

  if (!integration) {
    return NextResponse.json({ success: false, error: 'Intégration inconnue ou inactive.' }, { status: 401 })
  }

  let storedSecret: string
  let qrSecret: string
  try {
    storedSecret = decryptSecret(integration.apiSecretEncrypted)
    qrSecret = decryptSecret(integration.qrSecretEncrypted)
  } catch {
    return NextResponse.json({ success: false, error: 'Intégration mal configurée.' }, { status: 500 })
  }

  if (!constantTimeEqual(storedSecret, apiSecret)) {
    return NextResponse.json({ success: false, error: 'Secret invalide.' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Données invalides.', details: parsed.error.flatten() }, { status: 400 })
  }

  const { number, client, vehicule, travaux } = parsed.data

  const vehiculeLabel = [vehicule?.marque, vehicule?.modele].filter(Boolean).join(' ') || null
  const operation = travaux || null

  const existing = await prisma.externalWorkOrder.findUnique({
    where: externalWorkOrderUniqueWhere(integration.garageId, number),
  })

  const order = existing
    ? await prisma.externalWorkOrder.update({
        where: { id: existing.id },
        data: {
          clientName: client?.nom || null,
          vehicleLabel,
          immatriculation: vehicule?.immat || null,
          vin: vehicule?.vin || null,
          operation,
          sourceSoftware: integration.partner.name,
          integrationId: integration.id,
          externalRevision: (existing.externalRevision ?? 0) + 1,
          lastImportedAt: new Date(),
        },
      })
    : await prisma.externalWorkOrder.create({
        data: {
          garageId: integration.garageId,
          integrationId: integration.id,
          source: 'API_EXTERNE',
          externalNumber: number,
          externalNumberNormalized: normalizeExternalWorkOrderNumber(number),
          externalId: number,
          externalRevision: 0,
          sourceSoftware: integration.partner.name,
          clientName: client?.nom || null,
          vehicleLabel,
          immatriculation: vehicule?.immat || null,
          vin: vehicule?.vin || null,
          operation,
          lastImportedAt: new Date(),
          importMetadata: { source: 'api_v1', partnerKey },
        },
      })

  const qrPayload = buildSignedExternalWorkOrderQrPayload({
    v: 1,
    type: 'external_or',
    variant: 'reference',
    partner: integration.partner.key,
    garage: integration.externalGarageId,
    order: order.externalId ?? order.id,
    number: order.externalNumber,
    revision: order.externalRevision ?? 0,
    issuedAt: Math.floor(Date.now() / 1000),
    keyId: integration.qrKeyId,
  }, qrSecret)

  return NextResponse.json({
    success: true,
    or: {
      number: order.externalNumber,
      status: order.status,
    },
    qr_payload: qrPayload,
  }, { status: existing ? 200 : 201 })
}
