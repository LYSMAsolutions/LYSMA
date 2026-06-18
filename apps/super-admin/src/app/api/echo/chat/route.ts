import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { askEcho, getEchoConfig, saveEchoMessage, type EchoChatInput } from '@/lib/echo'
import {
  getEchoAiHttpStatus,
  getEchoAiPublicMessage,
  isEchoAiError,
} from '@/modules/echo/ai/errors'
import {
  processEchoMemory,
  type StoredMemoryUpdate,
} from '@/modules/echo/services/memory-engine'

export const runtime = 'nodejs'

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(4000),
})

const schema = z.object({
  message: z.string().trim().min(1).max(4000),
  history: z.array(messageSchema).max(20).default([]),
})

function createRequestId() {
  return `echo-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Message invalide.' }, { status: 400 })
  }

  const requestId = createRequestId()
  const config = getEchoConfig()
  const history = parsed.data.history.slice(-20) as EchoChatInput[]

  try {
    const userMessage = await saveEchoMessage({
      role: 'user',
      content: parsed.data.message,
      requestId,
      model: config.model,
      metadata: {
        source: 'super-admin',
        adminEmail: session.user?.email ?? null,
        provider: config.provider,
      },
    })

    let memoryUpdate: StoredMemoryUpdate | null = null
    try {
      memoryUpdate = await processEchoMemory({
        message: parsed.data.message,
        sourceMessageId: userMessage.id,
        requestId,
      })
    } catch (memoryError) {
      console.error(
        `[ECHO][memory][${requestId}]`,
        isEchoAiError(memoryError)
          ? {
              code: memoryError.code,
              provider: memoryError.provider,
              status: memoryError.status,
            }
          : memoryError,
      )
    }

    const generation = await askEcho(
      [...history, { role: 'user', content: parsed.data.message }],
      requestId,
    )

    const assistantMessage = await saveEchoMessage({
      role: 'assistant',
      content: generation.content,
      requestId,
      model: generation.model,
      metadata: {
        source: 'super-admin',
        sourceUserMessageId: userMessage.id,
        provider: generation.provider,
        durationMs: generation.durationMs,
      },
    })

    return NextResponse.json({
      reply: generation.content,
      userMessageId: userMessage.id,
      assistantMessageId: assistantMessage.id,
      createdAt: assistantMessage.createdAt.toISOString(),
      memoryUpdate,
    })
  } catch (error) {
    console.error(
      `[ECHO][${requestId}]`,
      isEchoAiError(error)
        ? { code: error.code, provider: error.provider, status: error.status }
        : error,
    )

    if (isEchoAiError(error)) {
      return NextResponse.json(
        { error: getEchoAiPublicMessage(error), code: error.code },
        { status: getEchoAiHttpStatus(error) },
      )
    }

    return NextResponse.json(
      { error: 'ECHO a rencontré une erreur pendant la réponse.' },
      { status: 500 },
    )
  }
}
