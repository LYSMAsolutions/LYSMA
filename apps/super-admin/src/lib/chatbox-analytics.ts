import { Prisma } from '@/generated/prisma'

export type ChatboxAnalyticsLog = {
  userPrompt: string
  metadata: Prisma.JsonValue | null
}

export type ChatboxInsightItem = {
  label: string
  count: number
}

export type ChatboxInsights = {
  topQuestions: ChatboxInsightItem[]
  requestedFeatures: ChatboxInsightItem[]
  chatPages: ChatboxInsightItem[]
  keywords: ChatboxInsightItem[]
}

const STOP_WORDS = new Set([
  'avec',
  'avez',
  'avoir',
  'dans',
  'des',
  'donc',
  'dont',
  'elle',
  'est',
  'etes',
  'etre',
  'fait',
  'faire',
  'faut',
  'j ai',
  'les',
  'leur',
  'mais',
  'mes',
  'mon',
  'nous',
  'par',
  'pas',
  'peut',
  'plus',
  'pour',
  'que',
  'quel',
  'quelle',
  'quelles',
  'qui',
  'quoi',
  'sans',
  'sur',
  'ton',
  'tous',
  'tout',
  'une',
  'vous',
  'votre',
])

const FEATURE_RULES = [
  {
    label: 'Planning / rendez-vous',
    keywords: ['planning', 'rdv', 'rendez-vous', 'agenda', 'calendrier', 'horaire', 'disponibilite'],
  },
  {
    label: 'Devis / tarifs',
    keywords: ['devis', 'tarif', 'prix', 'chiffrage', 'estimation', 'cout'],
  },
  {
    label: 'Factures / paiement',
    keywords: ['facture', 'facturation', 'paiement', 'payer', 'reglement', 'impaye'],
  },
  {
    label: 'Suivi interventions',
    keywords: ['intervention', 'chantier', 'depannage', 'mission', 'travaux', 'technicien', 'terrain'],
  },
  {
    label: 'Demandes clients',
    keywords: ['client', 'demande', 'contact', 'prospect', 'lead', 'appel', 'message'],
  },
  {
    label: 'Photos / fichiers',
    keywords: ['photo', 'image', 'fichier', 'document', 'piece jointe', 'upload'],
  },
  {
    label: 'Notifications / rappels',
    keywords: ['notification', 'rappel', 'relance', 'sms', 'email', 'alerte'],
  },
  {
    label: 'Espace client',
    keywords: ['espace client', 'compte client', 'portail', 'connexion', 'login'],
  },
  {
    label: 'Stock / materiel',
    keywords: ['stock', 'materiel', 'piece', 'produit', 'inventaire'],
  },
  {
    label: 'Statistiques / tableau de bord',
    keywords: ['statistique', 'stats', 'tableau de bord', 'dashboard', 'rapport', 'suivi activite'],
  },
  {
    label: 'Site web / SEO',
    keywords: ['site', 'seo', 'referencement', 'google', 'page', 'vitrine'],
  },
]

export function normalizeAnalyticsText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function buildQuestionSignature(prompt: string) {
  return normalizeAnalyticsText(prompt).slice(0, 180) || 'question vide'
}

export function extractChatboxKeywords(prompt: string, limit = 10) {
  const seen = new Set<string>()
  const words = normalizeAnalyticsText(prompt)
    .split(' ')
    .filter((word) => word.length >= 3 && !/^\d+$/.test(word) && !STOP_WORDS.has(word))

  return words.filter((word) => {
    if (seen.has(word)) return false
    seen.add(word)
    return true
  }).slice(0, limit)
}

export function detectRequestedFeatures(prompt: string) {
  const normalized = normalizeAnalyticsText(prompt)
  return FEATURE_RULES
    .filter((rule) => rule.keywords.some((keyword) => normalized.includes(normalizeAnalyticsText(keyword))))
    .map((rule) => rule.label)
}

export function enrichChatboxMetadata(prompt: string, value: unknown) {
  const base = metadataRecord(value) ?? (value === undefined ? {} : { value: value ?? null })
  const existingAnalytics = metadataRecord(base.analytics) ?? {}
  const pagePath = getChatboxPagePathFromRecord(base)
  const analytics: Record<string, unknown> = {
    ...existingAnalytics,
    questionSignature: buildQuestionSignature(prompt),
    keywords: extractChatboxKeywords(prompt),
    requestedFeatures: detectRequestedFeatures(prompt),
  }

  if (pagePath) {
    analytics.pagePath = pagePath
  }

  return {
    ...base,
    analytics,
  }
}

export function buildChatboxInsights(logs: ChatboxAnalyticsLog[]): ChatboxInsights {
  const questions = new Map<string, ChatboxInsightItem>()
  const features = new Map<string, ChatboxInsightItem>()
  const pages = new Map<string, ChatboxInsightItem>()
  const keywords = new Map<string, ChatboxInsightItem>()

  for (const log of logs) {
    increment(questions, getQuestionSignature(log), trimLabel(log.userPrompt, 140))

    for (const feature of getRequestedFeatures(log)) {
      increment(features, feature)
    }

    increment(pages, getChatboxPagePath(log.metadata) ?? 'Page inconnue')

    for (const keyword of getKeywords(log)) {
      increment(keywords, keyword)
    }
  }

  return {
    topQuestions: topItems(questions, 8),
    requestedFeatures: topItems(features, 8),
    chatPages: topItems(pages, 8),
    keywords: topItems(keywords, 16),
  }
}

export function getChatboxPagePath(metadata: Prisma.JsonValue | null) {
  return getChatboxPagePathFromRecord(metadataRecord(metadata))
}

export function getChatboxAnalyticsTags(metadata: Prisma.JsonValue | null) {
  const analytics = metadataRecord(metadataRecord(metadata)?.analytics)
  const keywords = stringArray(analytics?.keywords).slice(0, 4)
  const features = stringArray(analytics?.requestedFeatures).slice(0, 2)
  const pagePath = getChatboxPagePath(metadata)

  return [
    { label: 'page', value: pagePath },
    { label: 'mots-cles', value: keywords.length > 0 ? keywords.join(', ') : null },
    { label: 'fonction', value: features.length > 0 ? features.join(', ') : null },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value))
}

function getQuestionSignature(log: ChatboxAnalyticsLog) {
  const analytics = metadataRecord(metadataRecord(log.metadata)?.analytics)
  return metadataString(analytics?.questionSignature) ?? buildQuestionSignature(log.userPrompt)
}

function getRequestedFeatures(log: ChatboxAnalyticsLog) {
  const analytics = metadataRecord(metadataRecord(log.metadata)?.analytics)
  const stored = stringArray(analytics?.requestedFeatures)
  return stored.length > 0 ? stored : detectRequestedFeatures(log.userPrompt)
}

function getKeywords(log: ChatboxAnalyticsLog) {
  const analytics = metadataRecord(metadataRecord(log.metadata)?.analytics)
  const stored = stringArray(analytics?.keywords)
  return stored.length > 0 ? stored : extractChatboxKeywords(log.userPrompt)
}

function getChatboxPagePathFromRecord(metadata?: Record<string, unknown> | null) {
  const analytics = metadataRecord(metadata?.analytics)
  const analyticsPagePath = metadataString(analytics?.pagePath)
  if (analyticsPagePath) return analyticsPagePath

  const page = metadataRecord(metadata?.page)
  return metadataString(page?.path) ?? metadataString(page?.pathname) ?? metadataString(page?.url)
}

function metadataRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

function metadataString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function stringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : []
}

function trimLabel(value: string, maxLength: number) {
  const clean = value.replace(/\s+/g, ' ').trim()
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 3)}...` : clean
}

function increment(map: Map<string, ChatboxInsightItem>, key: string, label = key) {
  const current = map.get(key)
  if (current) {
    current.count += 1
    return
  }

  map.set(key, { label, count: 1 })
}

function topItems(map: Map<string, ChatboxInsightItem>, limit: number) {
  return Array.from(map.values())
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit)
}
