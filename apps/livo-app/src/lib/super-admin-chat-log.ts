type ChatLogInput = {
  source: string
  conversationId?: string | null
  userName?: string | null
  userEmail?: string | null
  userPrompt: string
  assistantResponse?: string | null
  metadata?: Record<string, unknown>
}

export async function forwardChatLog(input: ChatLogInput) {
  const endpoint = process.env.SUPER_ADMIN_CHATBOX_LOG_URL
  if (!endpoint) return

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (process.env.SUPER_ADMIN_INBOUND_SECRET) {
    headers['x-lysma-inbound-secret'] = process.env.SUPER_ADMIN_INBOUND_SECRET
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        source: input.source,
        conversationId: input.conversationId,
        userName: input.userName,
        userEmail: input.userEmail,
        userPrompt: input.userPrompt,
        assistantResponse: input.assistantResponse,
        metadata: input.metadata,
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      const details = await response.text().catch(() => '')
      console.error('Super-admin chat log rejected:', response.status, details.slice(0, 500))
    }
  } catch (error) {
    console.error('Super-admin chat log error:', error)
  }
}
