import assert from 'node:assert/strict'
import test from 'node:test'
import {
  decideExternalQrAction,
  externalWorkOrderUniqueWhere,
  normalizeExternalWorkOrderNumber,
  shouldUpdateExternalRevision,
} from './external-work-order-key'

test('les variations de casse, espaces et tirets partagent la même clé OR', () => {
  const values = ['OR-2026-00125', 'or 2026 00125', ' OR--2026-00125 ']
  const normalized = values.map(normalizeExternalWorkOrderNumber)
  assert.deepEqual(new Set(normalized).size, 1)
  assert.deepEqual(
    externalWorkOrderUniqueWhere('garage-1', values[0]),
    externalWorkOrderUniqueWhere('garage-1', values[2])
  )
})

test('un premier embedded complet crée puis les scans suivants réutilisent', () => {
  assert.equal(decideExternalQrAction({
    exists: false,
    variant: 'embedded',
    embeddedDetailsComplete: true,
    incomingRevision: 1,
  }), 'CREATE')
  assert.equal(decideExternalQrAction({
    exists: true,
    variant: 'embedded',
    embeddedDetailsComplete: true,
    currentRevision: 1,
    incomingRevision: 1,
  }), 'REUSE')
})

test('deux scans simultanés ciblent la même contrainte fonctionnelle', () => {
  const first = externalWorkOrderUniqueWhere('garage-1', 'OR-42')
  const second = externalWorkOrderUniqueWhere('garage-1', ' or 42 ')
  assert.deepEqual(first, second)
})

test('un QR incomplet ne crée pas et une référence inconnue exige un import', () => {
  assert.equal(decideExternalQrAction({
    exists: false,
    variant: 'embedded',
    embeddedDetailsComplete: false,
  }), 'INCOMPLETE')
  assert.equal(decideExternalQrAction({
    exists: false,
    variant: 'reference',
    embeddedDetailsComplete: false,
  }), 'NOT_RECEIVED')
})

test('API et QR retrouvent le même OR par garage et numéro', () => {
  const apiKey = externalWorkOrderUniqueWhere('garage-1', 'OR-ABC-9')
  const qrKey = externalWorkOrderUniqueWhere('garage-1', 'or abc 9')
  assert.deepEqual(apiKey, qrKey)
})

test('seule une révision strictement plus récente met à jour', () => {
  assert.equal(shouldUpdateExternalRevision(4, 5), true)
  assert.equal(shouldUpdateExternalRevision(5, 5), false)
  assert.equal(shouldUpdateExternalRevision(6, 5), false)
  assert.equal(decideExternalQrAction({
    exists: true,
    variant: 'embedded',
    embeddedDetailsComplete: true,
    currentRevision: 4,
    incomingRevision: 5,
  }), 'UPDATE')
})
