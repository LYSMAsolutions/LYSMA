import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildExternalRequestSignature,
  hashExternalRequest,
} from './external-integration'

test('la signature partenaire couvre le timestamp, le nonce et le corps exact', () => {
  const input = {
    timestamp: '1781862300',
    nonce: 'nonce-1',
    rawBody: '{"eventId":"evt-1"}',
    secret: 'secret-garage',
  }
  const signature = buildExternalRequestSignature(input)

  assert.equal(signature, buildExternalRequestSignature(input))
  assert.notEqual(signature, buildExternalRequestSignature({ ...input, nonce: 'nonce-2' }))
  assert.notEqual(signature, buildExternalRequestSignature({ ...input, rawBody: '{}'}))
  assert.equal(hashExternalRequest(input.rawBody).length, 64)
})
