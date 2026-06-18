export const LIVO_PRICING = {
  trialDays: 30,
  primaryPlan: {
    name: 'LIVO Atelier',
    priceMonthly: 89,
    currency: 'EUR',
    included: '1 garage · compagnons illimités',
    description: 'Pointage atelier, fiches, OR, véhicules, relevés et rentabilité.',
  },
  enterpriseLabel: 'Sur devis',
} as const

export function monthlyPriceLabel() {
  return `${LIVO_PRICING.primaryPlan.priceMonthly} € / mois`
}
