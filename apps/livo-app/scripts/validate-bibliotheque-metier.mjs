import fs from 'node:fs'

const filePath = 'docs/livo-bibliotheque-metier/interventions.json'
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))

const REQUIRED_FIELDS = [
  'id',
  'categorie',
  'intervention',
  'synonymes',
  'pieces_suggerees',
  'controles_suggeres',
  'operations_fin',
  'frequence',
]

const FORBIDDEN_VISIBLE_TEXT = [
  'dépose',
  'repose',
  'serrage',
  'démontage',
  'bouchon de vidange',
  'étrier',
  'calage moteur',
]

function normalize(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function findDuplicates(values) {
  const counts = new Map()

  for (const value of values) {
    const key = normalize(value)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .map(([value]) => value)
}

function visibleTexts(intervention) {
  return [
    intervention.intervention,
    ...(intervention.pieces_suggerees ?? []),
    ...(intervention.controles_suggeres ?? []),
    ...(intervention.operations_fin ?? []),
  ]
}

const interventions = data.interventions ?? []
const errors = []

if (data.meta?.total !== 100) {
  errors.push(`meta.total attendu: 100, reçu: ${data.meta?.total}`)
}

if (interventions.length !== 100) {
  errors.push(`Nombre d'interventions attendu: 100, reçu: ${interventions.length}`)
}

const duplicateIds = findDuplicates(interventions.map((intervention) => intervention.id))
if (duplicateIds.length > 0) {
  errors.push(`IDs en doublon: ${duplicateIds.join(', ')}`)
}

const duplicateLabels = findDuplicates(interventions.map((intervention) => intervention.intervention))
if (duplicateLabels.length > 0) {
  errors.push(`Libellés en doublon: ${duplicateLabels.join(', ')}`)
}

for (const intervention of interventions) {
  for (const field of REQUIRED_FIELDS) {
    if (intervention[field] === undefined || intervention[field] === null) {
      errors.push(`${intervention.id ?? 'ID manquant'}: champ obligatoire manquant "${field}"`)
    }
  }

  for (const field of ['synonymes', 'pieces_suggerees', 'controles_suggeres', 'operations_fin']) {
    if (!Array.isArray(intervention[field])) {
      errors.push(`${intervention.id}: "${field}" doit être un tableau`)
    }
  }

  for (const text of visibleTexts(intervention)) {
    const normalized = normalize(text)
    const forbidden = FORBIDDEN_VISIBLE_TEXT.find((word) => normalized.includes(normalize(word)))
    if (forbidden) {
      errors.push(`${intervention.id}: texte interdit "${forbidden}" dans "${text}"`)
    }
  }
}

if (errors.length > 0) {
  console.error(`Validation bibliothèque métier échouée (${errors.length} erreur(s)):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log('Validation bibliothèque métier OK')
console.log(JSON.stringify({
  total: interventions.length,
  version: data.meta?.version,
  categories: interventions.reduce((acc, intervention) => {
    acc[intervention.categorie] = (acc[intervention.categorie] ?? 0) + 1
    return acc
  }, {}),
}, null, 2))
