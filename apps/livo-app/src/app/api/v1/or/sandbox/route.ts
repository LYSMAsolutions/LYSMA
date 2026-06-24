import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { decryptSecret } from '@/lib/security/crypto'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { requestIp } from '@/lib/security/audit'
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
    key: `v1-or-sandbox:${ip ?? 'unknown'}`,
    limit: 30,
    windowSeconds: 60,
    blockSeconds: 60 * 2,
  })
  if (!limiter.allowed) {
    return NextResponse.json({ success: false, error: 'Trop de requêtes.' }, { status: 429 })
  }

  const partnerKey = req.headers.get('x-livo-partner-key')?.trim()
  const externalGarageId = req.headers.get('x-livo-garage-id')?.trim()
  const apiSecret = req.headers.get('x-livo-api-secret')?.trim()

  if (!partnerKey || !externalGarageId || !apiSecret) {
    return NextResponse.json({
      success: false,
      sandbox: true,
      error: 'Authentification incomplète. Headers requis : x-livo-partner-key, x-livo-garage-id, x-livo-api-secret.',
    }, { status: 401 })
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
    return NextResponse.json({
      success: false,
      sandbox: true,
      error: 'Intégration inconnue ou inactive. Vérifiez vos credentials.',
    }, { status: 401 })
  }

  let storedSecret: string
  try {
    storedSecret = decryptSecret(integration.apiSecretEncrypted)
  } catch {
    return NextResponse.json({ success: false, sandbox: true, error: 'Intégration mal configurée.' }, { status: 500 })
  }

  if (!constantTimeEqual(storedSecret, apiSecret)) {
    return NextResponse.json({
      success: false,
      sandbox: true,
      error: 'API Secret invalide.',
    }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({
      success: false,
      sandbox: true,
      error: 'Données invalides.',
      details: parsed.error.flatten(),
    }, { status: 400 })
  }

  // Tout est valide — on ne crée rien en base, on retourne une réponse simulée
  const fakeQrPayload = `LIVO:v1:sandbox:${Buffer.from(JSON.stringify({
    partner: partnerKey,
    garage: externalGarageId,
    number: parsed.data.number,
    issuedAt: Math.floor(Date.now() / 1000),
    mode: 'sandbox',
  })).toString('base64url')}`

  return NextResponse.json({
    success: true,
    sandbox: true,
    message: 'Test réussi. Vos credentials sont valides et votre requête est correctement formatée. Ce QR payload est fictif — utilisez l\'endpoint de production pour les vrais ORs.',
    or: {
      number: parsed.data.number,
      status: 'SANDBOX',
    },
    qr_payload: fakeQrPayload,
    received: {
      client: parsed.data.client ?? null,
      vehicule: parsed.data.vehicule ?? null,
      travaux: parsed.data.travaux ?? null,
    },
  })
}
