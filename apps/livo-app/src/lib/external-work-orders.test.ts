import assert from 'node:assert/strict'
import test from 'node:test'
import {
  externalWorkOrderImportSchema,
  mapExternalWorkOrderLineType,
} from './external-work-orders'

const payload = {
  schemaVersion: '1.0',
  eventId: 'evt-1',
  eventType: 'work_order.upserted',
  occurredAt: '2026-06-19T09:45:00Z',
  garageExternalId: 'GARAGE-042',
  workOrder: {
    externalId: 'wo-857493',
    number: 'OR-2026-001245',
    revision: 37,
    status: 'IN_PROGRESS',
    totals: {
      plannedHours: '4.00',
      soldHours: '3.50',
      billedHours: '3.25',
      billedAmountHT: '420.00',
      laborAmountHT: '280.00',
      billingHourlyRateHT: '80.00',
      currency: 'EUR',
    },
    lines: [{
      externalLineId: 'line-1',
      position: 1,
      type: 'LABOR',
      label: 'Révision du véhicule',
      billedHours: '2.50',
      billedAmountHT: '200.00',
    }],
  },
}

test('le contrat OR versionné distingue les temps et les lignes', () => {
  const result = externalWorkOrderImportSchema.parse(payload)
  assert.equal(result.workOrder.totals.plannedHours, 4)
  assert.equal(result.workOrder.totals.soldHours, 3.5)
  assert.equal(result.workOrder.totals.billedHours, 3.25)
  assert.equal(result.workOrder.lines[0].billedAmountHT, 200)
  assert.equal(mapExternalWorkOrderLineType('LABOR'), 'MAIN_OEUVRE')
})

test('un payload non versionné est refusé', () => {
  assert.equal(externalWorkOrderImportSchema.safeParse({ ...payload, schemaVersion: '2.0' }).success, false)
})
