import bibliotheque from '../../docs/livo-bibliotheque-metier/interventions.json'

export const INTERVENTION_FREQUENCES = [
  'Très fréquent',
  'Fréquent',
  'Occasionnel',
  'Rare',
] as const

export type InterventionFrequence = (typeof INTERVENTION_FREQUENCES)[number]

export type InterventionMetier = {
  id: string
  categorie: string
  intervention: string
  synonymes: string[]
  pieces_suggerees: string[]
  controles_suggeres: string[]
  operations_fin: string[]
  frequence: InterventionFrequence
}


type BibliothequeMetier = {
  meta: {
    version: string
    created: string
    description: string
    source: string
    total: number
  }
  interventions: InterventionMetier[]
}

const data = bibliotheque as BibliothequeMetier

export const bibliothequeMetierMeta = data.meta
export const interventionsMetier = data.interventions

const FREQUENCY_SCORE: Record<InterventionFrequence, number> = {
  'Très fréquent': 4,
  Fréquent: 3,
  Occasionnel: 2,
  Rare: 1,
}

const interventionsById = new Map(interventionsMetier.map((intervention) => [
  intervention.id,
  intervention,
]))

export function normalizeBibliothequeQuery(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function getInterventionMetierById(id: string) {
  return interventionsById.get(id)
}

export function getInterventionsMetierByIds(ids: string[]) {
  const seen = new Set<string>()

  return ids.flatMap((id) => {
    if (seen.has(id)) return []
    seen.add(id)

    const intervention = getInterventionMetierById(id)
    return intervention ? [intervention] : []
  })
}

export function getCategoriesInterventionsMetier() {
  const counts = new Map<string, number>()

  for (const intervention of interventionsMetier) {
    counts.set(intervention.categorie, (counts.get(intervention.categorie) ?? 0) + 1)
  }

  return Array.from(counts, ([categorie, total]) => ({ categorie, total }))
}

function scoreIntervention(intervention: InterventionMetier, query: string) {
  if (!query) return FREQUENCY_SCORE[intervention.frequence]

  const normalizedName = normalizeBibliothequeQuery(intervention.intervention)
  const normalizedCategory = normalizeBibliothequeQuery(intervention.categorie)
  const normalizedSynonyms = intervention.synonymes.map(normalizeBibliothequeQuery)
  const haystack = [
    normalizedName,
    normalizedCategory,
    ...normalizedSynonyms,
  ].join(' ')
  const tokens = query.split(/\s+/).filter(Boolean)

  if (normalizedName === query) return 120
  if (normalizedName.startsWith(query)) return 100
  if (normalizedSynonyms.some((synonym) => synonym === query)) return 95
  if (normalizedSynonyms.some((synonym) => synonym.startsWith(query))) return 85
  if (normalizedName.includes(query)) return 75
  if (normalizedSynonyms.some((synonym) => synonym.includes(query))) return 70
  if (tokens.length > 1 && tokens.every((token) => haystack.includes(token))) return 60
  if (normalizedCategory.includes(query)) return 35

  return 0
}

export function searchInterventionsMetier({
  query = '',
  categorie,
  limit = 12,
}: {
  query?: string
  categorie?: string
  limit?: number
}) {
  const normalizedQuery = normalizeBibliothequeQuery(query)
  const normalizedCategory = categorie ? normalizeBibliothequeQuery(categorie) : ''
  const safeLimit = Math.max(1, Math.min(limit, 50))

  return interventionsMetier
    .map((intervention, index) => ({
      intervention,
      index,
      score: scoreIntervention(intervention, normalizedQuery),
    }))
    .filter(({ intervention, score }) => {
      if (normalizedCategory && normalizeBibliothequeQuery(intervention.categorie) !== normalizedCategory) {
        return false
      }

      return !normalizedQuery || score > 0
    })
    .sort((a, b) => (
      b.score - a.score ||
      FREQUENCY_SCORE[b.intervention.frequence] - FREQUENCY_SCORE[a.intervention.frequence] ||
      a.index - b.index
    ))
    .slice(0, safeLimit)
    .map(({ intervention }) => intervention)
}
