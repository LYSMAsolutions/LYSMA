import type { ChatReviewLog } from '@/lib/chatbox-review'
import { buildCodexContext, getDuplicateOf } from '@/lib/chatbox-review'
import { prisma } from '@/lib/prisma'

type EmailPayload = {
  from: string
  to: string[]
  subject: string
  text: string
}

function parseList(value: string | undefined) {
  return (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function getRecipients() {
  return parseList(process.env.CHATBOX_BAD_ALERT_EMAIL_TO || process.env.CHATBOX_BAD_ALERT_TO)
}

function getFromAddress() {
  return process.env.CHATBOX_BAD_ALERT_EMAIL_FROM || process.env.CHATBOX_BAD_ALERT_FROM || process.env.RESEND_FROM_EMAIL || ''
}

function getAlertMode() {
  const mode = process.env.CHATBOX_ALERT_MODE?.trim().toLowerCase()
  return mode === 'daily_digest' ? 'daily_digest' : 'instant'
}

async function sendEmail(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || payload.to.length === 0 || !payload.from) return

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const details = await response.text().catch(() => '')
    throw new Error(`Resend chatbox alert failed (${response.status}): ${details}`)
  }
}

function groupCount<T extends string>(values: T[]) {
  const counts = new Map<T, number>()
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1))
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([label, count]) => `- ${label}: ${count}`)
    .join('\n')
}

async function getConversationLogs(log: ChatReviewLog) {
  if (!log.conversationId) return [log]

  return prisma.chatLog.findMany({
    where: {
      source: log.source,
      conversationId: log.conversationId,
    },
    orderBy: { createdAt: 'asc' },
    take: 80,
  })
}

export async function sendChatboxBadAlertEmail(log: ChatReviewLog) {
  if (log.qualityNotes?.includes('Amelioration validee')) return
  if (getAlertMode() === 'daily_digest') {
    console.info('Chatbox BAD alert queued for daily digest mode', {
      logId: log.id,
      source: log.source,
      digestHour: process.env.CHATBOX_DIGEST_HOUR || '8',
    })
    return
  }

  const recipients = getRecipients()
  const from = getFromAddress()
  if (!process.env.RESEND_API_KEY || recipients.length === 0 || !from) {
    console.warn('Chatbox BAD alert email skipped: missing email configuration', {
      hasApiKey: Boolean(process.env.RESEND_API_KEY),
      hasRecipients: recipients.length > 0,
      hasFrom: Boolean(from),
    })
    return
  }

  const conversationLogs = await getConversationLogs(log)
  const duplicateOf = getDuplicateOf(log.metadata)
  const text = buildCodexContext(log, conversationLogs, duplicateOf)
  const subject = `[Chatbox BAD] ${log.source} - ${log.userPrompt.slice(0, 80)}`

  await sendEmail({
    from,
    to: recipients,
    subject,
    text,
  })
}

export async function sendChatboxDailyDigestEmail() {
  const recipients = getRecipients()
  const from = getFromAddress()
  if (!process.env.RESEND_API_KEY || recipients.length === 0 || !from) {
    console.warn('Chatbox daily digest skipped: missing email configuration', {
      hasApiKey: Boolean(process.env.RESEND_API_KEY),
      hasRecipients: recipients.length > 0,
      hasFrom: Boolean(from),
    })
    return { sent: false, count: 0 }
  }

  const logs = await prisma.chatLog.findMany({
    where: {
      quality: 'BAD',
      reviewStatus: 'UNTREATED',
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  if (logs.length === 0) {
    return { sent: false, count: 0 }
  }

  const baseUrl = (process.env.AUTH_URL || 'https://lysma-super-admin.vercel.app').replace(/\/$/, '')
  const text = [
    `Resume quotidien chatbox - ${logs.length} BAD non traites`,
    '',
    'Par site :',
    groupCount(logs.map((log) => log.source)),
    '',
    'Par type :',
    groupCount(logs.map((log) => log.problemType)),
    '',
    'Priorites :',
    groupCount(logs.map((log) => `${log.problemType}:${log.source}`)).split('\n').slice(0, 12).join('\n'),
    '',
    'Extraits :',
    ...logs.slice(0, 20).map((log) => [
      `- ${log.id} | ${log.source} | ${log.problemType} | ${log.reviewStatus}`,
      `  ${baseUrl}/chatbox?source=${encodeURIComponent(log.source)}&q=${encodeURIComponent(log.id)}`,
      `  Question: ${log.userPrompt.slice(0, 220)}`,
      `  Reponse: ${(log.assistantResponse || 'Aucune reponse enregistree.').slice(0, 220)}`,
    ].join('\n')),
  ].join('\n')

  await sendEmail({
    from,
    to: recipients,
    subject: `[Chatbox digest] ${logs.length} BAD non traites`,
    text,
  })

  return { sent: true, count: logs.length }
}
