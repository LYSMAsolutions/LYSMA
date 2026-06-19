import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateWorkshopMetrics } from './workshop-metrics'

test('les indicateurs distinguent prévu, vendu, facturé et réel', () => {
  const metrics = calculateWorkshopMetrics({
    plannedHours: 4,
    soldHours: 3.5,
    billedHours: 3.25,
    actualMinutes: 180,
    billedAmountHT: 420,
    laborAmountHT: 280,
    billingHourlyRateHT: 80,
    internalLaborCostRateHT: 35,
  })

  assert.equal(metrics.actualHours, 3)
  assert.equal(metrics.timeDeltaHours, 0.25)
  assert.equal(Math.round(metrics.efficiencyPercent ?? 0), 117)
  assert.equal(metrics.estimatedLaborCostHT, 105)
  assert.equal(metrics.laborMarginHT, 175)
})

test('aucune marge estimée n’est annoncée sans coût horaire interne', () => {
  const metrics = calculateWorkshopMetrics({
    soldHours: 2,
    actualMinutes: 90,
    laborAmountHT: 160,
    billingHourlyRateHT: 80,
  })
  assert.equal(metrics.laborMarginHT, null)
})
