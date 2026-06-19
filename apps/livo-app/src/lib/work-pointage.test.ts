import assert from 'node:assert/strict'
import test from 'node:test'
import { hasConflictingWorkshopPointage } from './work-pointage'

test('un pointage fiche ou OR actif bloque un second travail', () => {
  assert.equal(hasConflictingWorkshopPointage({ id: 'fiche' }, null), true)
  assert.equal(hasConflictingWorkshopPointage(null, { id: 'or' }), true)
  assert.equal(hasConflictingWorkshopPointage(null, null), false)
})

test('plusieurs pointages successifs restent possibles après chaque fin de pointage', () => {
  assert.equal(hasConflictingWorkshopPointage(null, null), false)
  assert.equal(hasConflictingWorkshopPointage({ id: 'session-1' }, null), true)
  assert.equal(hasConflictingWorkshopPointage(null, null), false)
  assert.equal(hasConflictingWorkshopPointage(null, { id: 'session-2' }), true)
  assert.equal(hasConflictingWorkshopPointage(null, null), false)
})
