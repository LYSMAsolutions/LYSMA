import crypto from 'node:crypto'
import { z } from 'zod'

const FICHE_PREFIX = 'LIVO:FICHE:1:'
const EXTERNAL_PREFIX = 'LIVO:OR:1:'
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{32,128}$/

const embeddedLineSchema = z.object({
  id: z.string().trim().min(1).max(120).optional(),
  label: z.string().trim().min(1).max(240),
  type: z.enum(['LABOR', 'PART', 'PACKAGE', 'SUBCONTRACT', 'OTHER']).default('OTHER'),
  plannedHours: z.coerce.number().min(0).max(999).optional().nullable(),
  soldHours: z.coerce.number().min(0).max(999).optional().nullable(),
  billedHours: z.coerce.number().min(0).max(999).optional().nullable(),
  billedAmountHT: z.coerce.number().min(0).max(999999).optional().nullable(),
})

export const externalQrDetailsSchema = z.object({
  clientName: z.string().trim().max(160).optional().nullable(),
  vehicleLabel: z.string().trim().max(160).optional().nullable(),
  immatriculation: z.string().trim().max(40).optional().nullable(),
  operation: z.string().trim().max(1500).optional().nullable(),
  lines: z.array(embeddedLineSchema).max(20).optional().default([]),
  plannedHours: z.coerce.number().min(0).max(999).optional().nullable(),
  soldHours: z.coerce.number().min(0).max(999).optional().nullable(),
  billedHours: z.coerce.number().min(0).max(999).optional().nullable(),
  billedAmountHT: z.coerce.number().min(0).max(999999).optional().nullable(),
  laborAmountHT: z.coerce.number().min(0).max(999999).optional().nullable(),
  billingHourlyRateHT: z.coerce.number().min(0).max(9999).optional().nullable(),
}).optional()

const externalQrSchema = z.object({
  v: z.literal(1),
  type: z.literal('external_or'),
  variant: z.enum(['reference', 'embedded']).default('reference'),
  partner: z.string().trim().min(1).max(80),
  garage: z.string().trim().min(1).max(120),
  order: z.string().trim().min(1).max(120),
  number: z.string().trim().min(1).max(80),
  revision: z.number().int().min(0),
  issuedAt: z.number().int().positive(),
  keyId: z.string().trim().min(1).max(80),
  details: externalQrDetailsSchema,
})

export type ExternalQrIdentity = z.output<typeof externalQrSchema>
export type ExternalQrIdentityInput = z.input<typeof externalQrSchema>
export type ExternalQrDetails = NonNullable<ExternalQrIdentity['details']>

export function createFicheScanToken() {
  return crypto.randomBytes(32).toString('base64url')
}

export function buildFicheQrPayload(scanToken: string) {
  if (!TOKEN_PATTERN.test(scanToken)) throw new Error('Jeton fiche invalide.')
  return `${FICHE_PREFIX}${scanToken}`
}

export function parseFicheQrPayload(rawPayload: string) {
  const raw = rawPayload.trim()

  if (raw.startsWith(FICHE_PREFIX)) {
    const token = raw.slice(FICHE_PREFIX.length)
    if (!TOKEN_PATTERN.test(token)) {
      return { success: false as const, error: 'QR invalide.' }
    }
    return { success: true as const, format: 'CURRENT' as const, token }
  }

  if (/^FT-\d{4}-[A-Z0-9-]+$/i.test(raw)) {
    return {
      success: true as const,
      format: 'LEGACY' as const,
      externalNumber: raw.toUpperCase(),
    }
  }

  return { success: false as const, error: 'QR invalide.' }
}

function signExternalPayload(encodedPayload: string, secret: string) {
  return crypto
    .createHmac('sha256', secret)
    .update(`${EXTERNAL_PREFIX}${encodedPayload}`)
    .digest('base64url')
}

export function buildSignedExternalWorkOrderQrPayload(identity: ExternalQrIdentityInput, secret: string) {
  const parsed = externalQrSchema.parse(identity)
  const encodedPayload = Buffer.from(JSON.stringify(parsed), 'utf8').toString('base64url')
  const signature = signExternalPayload(encodedPayload, secret)
  return `${EXTERNAL_PREFIX}${encodedPayload}.${signature}`
}

export function readExternalWorkOrderQrIdentity(rawPayload: string) {
  const raw = rawPayload.trim()
  if (!raw.startsWith(EXTERNAL_PREFIX)) {
    return { success: false as const, error: 'QR historique ou non reconnu.' }
  }

  const signedValue = raw.slice(EXTERNAL_PREFIX.length)
  const separator = signedValue.lastIndexOf('.')
  if (separator < 1) return { success: false as const, error: 'QR invalide.' }

  const encodedPayload = signedValue.slice(0, separator)
  const signature = signedValue.slice(separator + 1)

  try {
    const decoded = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'))
    const identity = externalQrSchema.parse(decoded)
    return { success: true as const, identity, encodedPayload, signature }
  } catch {
    return { success: false as const, error: 'QR invalide.' }
  }
}

export function verifyExternalWorkOrderQrPayload(
  rawPayload: string,
  secret: string,
  options: { now?: Date; maxAgeSeconds?: number } = {}
) {
  const parsed = readExternalWorkOrderQrIdentity(rawPayload)
  if (!parsed.success) return parsed

  const expected = Buffer.from(signExternalPayload(parsed.encodedPayload, secret))
  const provided = Buffer.from(parsed.signature)
  if (expected.length !== provided.length || !crypto.timingSafeEqual(expected, provided)) {
    return { success: false as const, error: 'QR invalide.' }
  }

  const nowSeconds = Math.floor((options.now ?? new Date()).getTime() / 1000)
  const maxAgeSeconds = options.maxAgeSeconds ?? 90 * 24 * 60 * 60
  if (parsed.identity.issuedAt > nowSeconds + 300) {
    return { success: false as const, error: 'QR invalide.' }
  }
  if (nowSeconds - parsed.identity.issuedAt > maxAgeSeconds) {
    return { success: false as const, error: 'QR expiré.' }
  }

  return { success: true as const, identity: parsed.identity }
}

export function isCurrentExternalQrPayload(rawPayload: string) {
  return rawPayload.trim().startsWith(EXTERNAL_PREFIX)
}

export function validateEmbeddedExternalQrDetails(identity: ExternalQrIdentity) {
  if (identity.variant !== 'embedded') {
    return { complete: false as const, missing: ['mode embedded'] }
  }

  const details = identity.details
  const missing: string[] = []
  if (!details?.clientName?.trim()) missing.push('client')
  if (!details?.vehicleLabel?.trim() && !details?.immatriculation?.trim()) missing.push('véhicule')
  if (!details?.operation?.trim() && !details?.lines?.some((line) => line.label.trim())) missing.push('travaux')

  return missing.length
    ? { complete: false as const, missing }
    : { complete: true as const, details: details as ExternalQrDetails }
}
