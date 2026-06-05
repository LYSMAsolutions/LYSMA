import { Prisma } from '@/generated/prisma'

export type ChatReviewLog = {
  id: string
  source: string
  conversationId: string | null
  userPrompt: string
  assistantResponse: string | null
  qualityNotes: string | null
  metadata: Prisma.JsonValue | null
  createdAt: Date
}

export function conversationKey(source: string, conversationId: string) {
  return `${source}\u0000${conversationId}`
}

export function getDuplicateOf(metadata: Prisma.JsonValue | null) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null
  const flags = metadata.flags
  if (!flags || typeof flags !== 'object' || Array.isArray(flags)) return null
  return typeof flags.duplicateOf === 'string' ? flags.duplicateOf : null
}

export function formatChatLogDate(value: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)
}

export function buildCodexContext(
  log: ChatReviewLog,
  conversationLogs: ChatReviewLog[],
  duplicateOf = getDuplicateOf(log.metadata),
) {
  const logs = conversationLogs.length > 0 ? conversationLogs : [log]
  const originalIndex = duplicateOf ? logs.findIndex((item) => item.id === duplicateOf) : -1
  const currentIndex = logs.findIndex((item) => item.id === log.id)
  const thread = logs.map((item, index) => {
    const labels = [
      item.id === duplicateOf ? 'reponse originale' : '',
      item.id === log.id ? 'doublon detecte / BAD' : '',
    ].filter(Boolean)
    const suffix = labels.length > 0 ? ` (${labels.join(', ')})` : ''

    return [
      `#${index + 1}${suffix}`,
      formatChatLogDate(item.createdAt),
      'question',
      item.userPrompt,
      '',
      'reponse',
      item.assistantResponse || 'Aucune reponse enregistree.',
    ].join('\n')
  }).join('\n\n')

  return [
    `Site : ${log.source}`,
    `Conversation : ${log.conversationId ?? 'inconnue'}`,
    `Log BAD : ${log.id}`,
    duplicateOf ? `Doublon de : ${duplicateOf}` : 'Doublon de : non detecte',
    originalIndex >= 0 ? `Reponse originale : #${originalIndex + 1}` : null,
    currentIndex >= 0 ? `Message a corriger : #${currentIndex + 1}` : null,
    log.qualityNotes ? `Note super-admin : ${log.qualityNotes}` : null,
    '',
    'Contexte de conversation :',
    thread,
    '',
    'Ce que je veux :',
    "Ameliorer la reponse pour eviter ce doublon et rendre l'experience utilisateur plus utile, precise et rassurante. Fais les modifications necessaires, puis git add, commit et push.",
  ].filter((line) => line !== null).join('\n')
}
