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
  return parseList(process.env.CHATBOX_BAD_ALERT_EMAIL_TO)
}

function getFromAddress() {
  return process.env.CHATBOX_BAD_ALERT_EMAIL_FROM || process.env.RESEND_FROM_EMAIL || ''
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

  const recipients = getRecipients()
  const from = getFromAddress()
  if (!process.env.RESEND_API_KEY || recipients.length === 0 || !from) return

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
