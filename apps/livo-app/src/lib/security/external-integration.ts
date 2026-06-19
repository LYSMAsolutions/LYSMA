import crypto from 'node:crypto'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decryptSecret } from '@/lib/security/crypto'

const MAX_CLOCK_SKEW_SECONDS = 5 * 60

function constantTimeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

export function hashExternalRequest(rawBody: string) {
  return crypto.createHash('sha256').update(rawBody).digest('hex')
}

export function buildExternalRequestSignature(input: {
  timestamp: string
  nonce: string
  rawBody: string
  secret: string
}) {
  return crypto
    .createHmac('sha256', input.secret)
    .update(`${input.timestamp}\n${input.nonce}\n${input.rawBody}`)
    .digest('hex')
}

export async function authenticateExternalIntegrationRequest(req: NextRequest, rawBody: string) {
  const partnerKey = req.headers.get('x-livo-partner-key')?.trim()
  const externalGarageId = req.headers.get('x-livo-garage-id')?.trim()
  const timestamp = req.headers.get('x-livo-timestamp')?.trim()
  const nonce = req.headers.get('x-livo-nonce')?.trim()
  const signatureHeader = req.headers.get('x-livo-signature')?.trim()
  const idempotencyKey = req.headers.get('idempotency-key')?.trim()

  if (!partnerKey || !externalGarageId || !timestamp || !nonce || !signatureHeader || !idempotencyKey) {
    return { success: false as const, status: 401, error: 'Authentification partenaire incomplète.' }
  }

  if (nonce.length > 120 || idempotencyKey.length > 160) {
    return { success: false as const, status: 400, error: 'Identifiant de requête invalide.' }
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
    return { success: false as const, status: 401, error: 'Connexion partenaire inconnue.' }
  }

  const timestampNumber = Number(timestamp)
  const nowSeconds = Math.floor(Date.now() / 1000)
  if (!Number.isInteger(timestampNumber) || Math.abs(nowSeconds - timestampNumber) > MAX_CLOCK_SKEW_SECONDS) {
    return { success: false as const, status: 401, error: 'Requête partenaire expirée.', integration }
  }

  let secret: string
  try {
    secret = decryptSecret(integration.apiSecretEncrypted)
  } catch {
    return { success: false as const, status: 500, error: 'Connexion partenaire mal configurée.', integration }
  }

  const providedSignature = signatureHeader.startsWith('v1=')
    ? signatureHeader.slice(3)
    : signatureHeader
  const expectedSignature = buildExternalRequestSignature({ timestamp, nonce, rawBody, secret })

  if (!constantTimeEqual(expectedSignature, providedSignature)) {
    return { success: false as const, status: 401, error: 'Signature partenaire invalide.', integration }
  }

  return {
    success: true as const,
    integration,
    nonce,
    idempotencyKey,
    requestHash: hashExternalRequest(rawBody),
  }
}
