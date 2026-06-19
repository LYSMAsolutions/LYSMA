export type WorkshopMetricInput = {
  plannedHours?: number | null
  soldHours?: number | null
  billedHours?: number | null
  actualMinutes?: number | null
  billedAmountHT?: number | null
  laborAmountHT?: number | null
  billingHourlyRateHT?: number | null
  internalLaborCostRateHT?: number | null
}

export function calculateWorkshopMetrics(input: WorkshopMetricInput) {
  const actualMinutes = Math.max(0, input.actualMinutes ?? 0)
  const actualHours = actualMinutes / 60
  const comparisonHours = input.billedHours ?? input.soldHours ?? null
  const timeDeltaHours = comparisonHours === null ? null : comparisonHours - actualHours
  const efficiencyPercent = actualHours > 0 && input.soldHours !== null && input.soldHours !== undefined
    ? (input.soldHours / actualHours) * 100
    : null
  const billingAchievementPercent = input.soldHours && input.billedHours !== null && input.billedHours !== undefined
    ? (input.billedHours / input.soldHours) * 100
    : null
  const estimatedLaborCostHT = input.internalLaborCostRateHT !== null && input.internalLaborCostRateHT !== undefined
    ? actualHours * input.internalLaborCostRateHT
    : null
  const laborMarginHT = estimatedLaborCostHT !== null && input.laborAmountHT !== null && input.laborAmountHT !== undefined
    ? input.laborAmountHT - estimatedLaborCostHT
    : null
  const laborMarginPercent = laborMarginHT !== null && input.laborAmountHT
    ? (laborMarginHT / input.laborAmountHT) * 100
    : null

  return {
    plannedHours: input.plannedHours ?? null,
    soldHours: input.soldHours ?? null,
    billedHours: input.billedHours ?? null,
    actualMinutes,
    actualHours,
    billedAmountHT: input.billedAmountHT ?? null,
    laborAmountHT: input.laborAmountHT ?? null,
    billingHourlyRateHT: input.billingHourlyRateHT ?? null,
    internalLaborCostRateHT: input.internalLaborCostRateHT ?? null,
    timeDeltaHours,
    efficiencyPercent,
    billingAchievementPercent,
    estimatedLaborCostHT,
    laborMarginHT,
    laborMarginPercent,
  }
}
