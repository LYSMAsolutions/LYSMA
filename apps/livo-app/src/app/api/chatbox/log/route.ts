import { NextRequest, NextResponse } from 'next/server'
import { forwardChatLog } from '@/lib/super-admin-chat-log'

const cleanText = (value: unknown, maxLength: number) =>
  typeof value === 'string'
    ? value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, maxLength)
    : ''

export async function POST(request: NextRequest) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON invalide.' }, { status: 400 })
  }

  const payload = body as {
    conversationId?: unknown
    userPrompt?: unknown
    assistantResponse?: unknown
  }
  const conversationId = cleanText(payload.conversationId, 160)
  const userPrompt = cleanText(payload.userPrompt, 320)
  const assistantResponse = cleanText(payload.assistantResponse, 2000)

  if (!userPrompt) {
    return NextResponse.json({ error: 'userPrompt est obligatoire.' }, { status: 400 })
  }

  await forwardChatLog({
    source: 'app:livo-app',
    conversationId: conversationId || null,
    userPrompt,
    assistantResponse,
    metadata: {
      app: 'livo-app',
      route: '/api/chatbox/log',
      userAgent: request.headers.get('user-agent'),
    },
  })

  return NextResponse.json({ success: true })
}
