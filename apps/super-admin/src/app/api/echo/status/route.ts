import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isEchoAiError } from '@/modules/echo/ai/errors'
import { echoAi } from '@/modules/echo/ai/provider-registry'

export const runtime = 'nodejs'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  try {
    const status = await echoAi.getStatus('chat')

    return NextResponse.json({
      online: status.available,
      provider: status.provider,
      model: status.model,
      modelAvailable: status.modelAvailable,
      durationMs: status.durationMs,
    })
  } catch (error) {
    let runtime: { provider: string; model: string }
    try {
      runtime = echoAi.getRuntime('chat')
    } catch {
      runtime = {
        provider: process.env.ECHO_AI_PROVIDER || 'unknown',
        model: process.env.ECHO_CHAT_MODEL || 'unknown',
      }
    }

    return NextResponse.json({
      online: false,
      provider: runtime.provider,
      model: runtime.model,
      modelAvailable: false,
      errorCode: isEchoAiError(error) ? error.code : 'unavailable',
    })
  }
}
