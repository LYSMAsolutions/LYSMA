import assert from 'node:assert/strict'
import test from 'node:test'
import QRCode from 'qrcode'
import {
  buildFicheQrPayload,
  buildSignedExternalWorkOrderQrPayload,
  createFicheScanToken,
  parseFicheQrPayload,
  validateEmbeddedExternalQrDetails,
  verifyExternalWorkOrderQrPayload,
} from './work-order-qr'

test('une fiche LIVO reçoit un QR opaque exploitable et compatible avec le PDF', async () => {
  const token = createFicheScanToken()
  const payload = buildFicheQrPayload(token)
  const parsed = parseFicheQrPayload(payload)
  const dataUrl = await QRCode.toDataURL(payload)

  assert.equal(parsed.success, true)
  assert.match(payload, /^LIVO:FICHE:1:/)
  assert.doesNotMatch(payload, /FT-2026/)
  assert.match(dataUrl, /^data:image\/png;base64,/)
})

test('les anciens QR fiche basés sur le numéro restent reconnus', () => {
  assert.deepEqual(parseFicheQrPayload('FT-2026-001'), {
    success: true,
    format: 'LEGACY',
    externalNumber: 'FT-2026-001',
  })
})

test('un QR OR signé est validé sans données client ni montant', () => {
  const secret = 'secret-pilote-assez-long'
  const identity = {
    v: 1 as const,
    type: 'external_or' as const,
    partner: 'alpha2a-pilot',
    garage: 'GARAGE-042',
    order: 'wo-857493',
    number: 'OR-2026-001245',
    revision: 37,
    issuedAt: 1_781_867_600,
    keyId: 'qr-2026-06',
  }
  const payload = buildSignedExternalWorkOrderQrPayload(identity, secret)
  const result = verifyExternalWorkOrderQrPayload(payload, secret, {
    now: new Date(identity.issuedAt * 1000 + 60_000),
  })

  assert.equal(result.success, true)
  assert.doesNotMatch(payload, /Client|420\.00|VF1/)
})

test('un QR OR modifié ou expiré est refusé', () => {
  const secret = 'secret-pilote-assez-long'
  const issuedAt = 1_700_000_000
  const payload = buildSignedExternalWorkOrderQrPayload({
    v: 1,
    type: 'external_or',
    partner: 'partenaire',
    garage: 'garage-externe',
    order: 'wo-1',
    number: 'OR-1',
    revision: 1,
    issuedAt,
    keyId: 'qr-1',
  }, secret)

  assert.equal(verifyExternalWorkOrderQrPayload(`${payload}x`, secret).success, false)
  assert.deepEqual(
    verifyExternalWorkOrderQrPayload(payload, secret, {
      now: new Date((issuedAt + 101) * 1000),
      maxAgeSeconds: 100,
    }),
    { success: false, error: 'QR expiré.' }
  )
})

test('un QR embedded complet permet la création au premier scan', () => {
  const secret = 'secret-pilote-assez-long'
  const payload = buildSignedExternalWorkOrderQrPayload({
    v: 1,
    type: 'external_or',
    variant: 'embedded',
    partner: 'partenaire',
    garage: 'garage-externe',
    order: 'wo-2',
    number: 'OR-2',
    revision: 1,
    issuedAt: 1_781_867_600,
    keyId: 'qr-1',
    details: {
      clientName: 'Client atelier',
      immatriculation: 'AA-123-BB',
      operation: 'Révision annuelle',
      soldHours: 2,
    },
  }, secret)
  const verified = verifyExternalWorkOrderQrPayload(payload, secret, {
    now: new Date(1_781_867_600 * 1000 + 60_000),
  })

  assert.equal(verified.success, true)
  if (!verified.success) return
  assert.equal(verified.identity.variant, 'embedded')
  assert.equal(validateEmbeddedExternalQrDetails(verified.identity).complete, true)
  assert.doesNotMatch(payload, /telephone|email/i)
})

test('un QR embedded signé mais incomplet est identifié sans être considéré invalide', () => {
  const secret = 'secret-pilote-assez-long'
  const payload = buildSignedExternalWorkOrderQrPayload({
    v: 1,
    type: 'external_or',
    variant: 'embedded',
    partner: 'partenaire',
    garage: 'garage-externe',
    order: 'wo-3',
    number: 'OR-3',
    revision: 1,
    issuedAt: 1_781_867_600,
    keyId: 'qr-1',
    details: { clientName: 'Client atelier' },
  }, secret)
  const verified = verifyExternalWorkOrderQrPayload(payload, secret, {
    now: new Date(1_781_867_600 * 1000 + 60_000),
  })

  assert.equal(verified.success, true)
  if (!verified.success) return
  assert.deepEqual(validateEmbeddedExternalQrDetails(verified.identity), {
    complete: false,
    missing: ['véhicule', 'travaux'],
  })
})
