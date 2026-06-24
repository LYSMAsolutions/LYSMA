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
export const interventionsMetier: InterventionMetier[] = data.interventions.map((i) => ({
  ...i,
  pieces_suggerees: i.pieces_suggerees ?? [],
  controles_suggeres: i.controles_suggeres ?? [],
  operations_fin: i.operations_fin ?? [],
  synonymes: i.synonymes ?? [],
}))

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

const INTERVENTIONS_LIEES: Record<string, string[]> = {
  // Entretien
  'ENT-001': ['ENT-002', 'ENT-003', 'ENT-004', 'PNE-005', 'ELE-005', 'ELE-004'],
  'ENT-002': ['ENT-001', 'ENT-006', 'INJ-001'],
  'ENT-003': ['ENT-001', 'CLI-004', 'DIV-014'],
  'ENT-004': ['ENT-001', 'INJ-001', 'INJ-003'],
  'ENT-005': ['ENT-001', 'ENT-002', 'ENT-003', 'ENT-004', 'ENT-008', 'PNE-005', 'ELE-005', 'ELE-004'],
  'ENT-006': ['ENT-001', 'ENT-002', 'DIA-002'],
  'ENT-007': ['ENT-001', 'ENT-002', 'DIA-002'],
  'ENT-008': ['DIS-001', 'DIS-002', 'DIV-002'],
  'ENT-009': ['DIV-002', 'DIV-005', 'DIS-002', 'DIV-017', 'DIV-001'],
  'ENT-010': ['FRE-001', 'FRE-002', 'FRE-007', 'DIV-008'],
  // Freinage
  'FRE-001': ['FRE-002', 'FRE-003', 'ENT-010', 'DIR-001'],
  'FRE-002': ['FRE-001', 'FRE-004', 'ENT-010', 'FRE-008'],
  'FRE-003': ['FRE-004', 'ENT-010', 'DIR-001'],
  'FRE-004': ['FRE-003', 'ENT-010', 'FRE-008'],
  'FRE-005': ['ENT-010', 'FRE-008'],
  'FRE-006': ['ENT-010', 'FRE-007', 'DIV-008'],
  'FRE-007': ['ENT-010', 'DIV-008', 'DIA-013'],
  'FRE-008': ['FRE-002', 'FRE-004'],
  // Pneumatiques
  'PNE-001': ['PNE-002', 'DIR-001', 'PNE-003', 'SUS-007', 'DIV-018'],
  'PNE-002': ['PNE-001', 'DIR-001', 'PNE-003'],
  'PNE-003': ['PNE-002', 'DIR-001'],
  'PNE-004': ['PNE-006', 'PNE-005'],
  'PNE-005': ['ELE-004', 'ENT-001', 'DIV-018'],
  'PNE-006': ['PNE-004', 'PNE-002', 'DIV-018'],
  // Distribution
  'DIS-001': ['DIS-002', 'DIV-002', 'ENT-008'],
  'DIS-002': ['DIS-001', 'ENT-008', 'ENT-009'],
  'DIS-003': ['ENT-008', 'DIV-002'],
  // Embrayage
  'EMB-001': ['EMB-002', 'DIV-006'],
  'EMB-002': ['EMB-001'],
  'EMB-003': ['EMB-001'],
  // Suspension
  'SUS-001': ['SUS-002', 'DIR-001', 'SUS-004', 'SUS-005'],
  'SUS-002': ['SUS-001', 'SUS-004'],
  'SUS-003': ['SUS-001', 'DIR-001'],
  'SUS-004': ['SUS-001', 'SUS-005', 'SUS-006'],
  'SUS-005': ['DIR-001', 'SUS-004', 'DIR-002'],
  'SUS-006': ['SUS-001', 'SUS-004'],
  'SUS-007': ['SUS-008', 'DIR-001', 'PNE-002'],
  'SUS-008': ['SUS-007', 'PNE-002'],
  // Direction
  'DIR-001': ['PNE-001', 'PNE-002', 'SUS-005', 'DIR-002'],
  'DIR-002': ['DIR-001', 'SUS-005'],
  'DIR-003': ['DIR-004'],
  'DIR-004': ['DIR-003'],
  // Climatisation
  'CLI-001': ['CLI-002', 'CLI-005', 'ENT-003', 'CLI-004'],
  'CLI-002': ['CLI-001', 'CLI-003'],
  'CLI-003': ['CLI-001', 'CLI-002', 'CLI-005'],
  'CLI-004': ['ENT-003', 'CLI-001'],
  'CLI-005': ['CLI-001', 'CLI-003'],
  // Diagnostic
  'DIA-001': ['DIA-002', 'DIA-003', 'DIA-004', 'DIA-005'],
  'DIA-002': ['DIA-001', 'INJ-006', 'INJ-004', 'ENT-006'],
  'DIA-003': ['ELE-001', 'ELE-002', 'ELE-003'],
  'DIA-004': ['SUS-001', 'SUS-005', 'FRE-003', 'DIR-003'],
  'DIA-005': ['DIA-001', 'INJ-001', 'INJ-006', 'INJ-004'],
  // Électrique
  'ELE-001': ['ELE-002', 'ELE-003', 'DIA-003'],
  'ELE-002': ['ELE-001', 'ENT-008'],
  'ELE-003': ['ELE-001', 'DIA-003'],
  'ELE-004': ['CT-001', 'DIV-015', 'ELE-005'],
  'ELE-005': ['ENT-001', 'ELE-004'],
  'ELE-006': ['ELE-007'],
  'ELE-007': ['DIA-001', 'ELE-006'],
  // Injection / dépollution
  'INJ-001': ['ENT-001', 'ENT-004', 'INJ-006'],
  'INJ-002': ['INJ-001', 'INJ-003', 'DIA-002'],
  'INJ-003': ['ENT-004', 'INJ-002'],
  'INJ-004': ['INJ-005', 'DIA-002', 'INJ-006'],
  'INJ-005': ['INJ-004', 'ECH-002', 'INJ-006'],
  'INJ-006': ['INJ-001', 'INJ-004', 'DIA-002'],
  // Échappement
  'ECH-001': ['ECH-002', 'ECH-004'],
  'ECH-002': ['ECH-003', 'INJ-005', 'ECH-001'],
  'ECH-003': ['ECH-002', 'DIA-002', 'INJ-006'],
  'ECH-004': ['ECH-001', 'ECH-002'],
  // Carrosserie
  'CAR-001': ['CAR-002', 'VIT-001'],
  'CAR-002': ['CAR-001'],
  'CAR-003': ['CAR-001', 'CAR-002', 'CAR-004'],
  'CAR-004': ['CAR-001', 'CAR-003'],
  // Vitrage
  'VIT-001': ['VIT-002', 'ELE-005'],
  'VIT-002': ['VIT-001'],
  'VIT-003': ['ELE-006'],
  // VO / CT
  'VO-001': ['VO-002', 'VO-003', 'CT-001'],
  'VO-002': ['VO-001', 'VO-003'],
  'VO-003': ['VO-001', 'CT-001', 'ENT-001'],
  'CT-001': ['FRE-001', 'FRE-002', 'ELE-004', 'PNE-001', 'DIR-001', 'SUS-001', 'PNE-005'],
  'CT-002': ['CT-001', 'DIA-001'],
  // Divers
  'DIV-001': ['ENT-009', 'DIV-002', 'DIV-017'],
  'DIV-002': ['DIS-002', 'DIV-001', 'ENT-009', 'ENT-008'],
  'DIV-003': ['ENT-009', 'DIA-001', 'DIV-002'],
  'DIV-004': ['INJ-001', 'DIV-016', 'DIA-005'],
  'DIV-005': ['ENT-009', 'DIV-001', 'DIV-017'],
  'DIV-006': ['EMB-001', 'EMB-002'],
  'DIV-007': ['DIA-001'],
  'DIV-008': ['ENT-010', 'FRE-007', 'FRE-006'],
  'DIV-009': ['DIR-001', 'DIV-010', 'DIR-002'],
  'DIV-010': ['DIR-001', 'DIV-009', 'DIR-002'],
  'DIV-011': ['ENT-001'],
  'DIV-012': ['INJ-001', 'INJ-006', 'DIA-005'],
  'DIV-013': ['DIA-001', 'FRE-007'],
  'DIV-014': ['ENT-003', 'CLI-004', 'CLI-001'],
  'DIV-015': ['ELE-004', 'CT-001'],
  'DIV-016': ['DIV-004', 'DIA-005'],
  'DIV-017': ['ENT-009', 'DIV-001', 'DIV-005'],
  'DIV-018': ['PNE-001', 'PNE-005', 'PNE-006'],
}

export function getInterventionsLiees(id: string): InterventionMetier[] {
  const ids = INTERVENTIONS_LIEES[id] ?? []
  return ids.flatMap((lieeId) => {
    const intervention = interventionsById.get(lieeId)
    return intervention ? [intervention] : []
  })
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
