import { EchoAiError, isEchoAiError } from '@/modules/echo/ai/errors'
import type {
  EchoAiGenerationRequest,
  EchoAiGenerationResult,
  EchoAiProvider,
  EchoAiProviderStatus,
  EchoAiStructuredGenerationRequest,
} from '@/modules/echo/ai/types'

type OllamaProviderOptions = {
  baseUrl: string
}

type OllamaChatResponse = {
  message?: { content?: string }
  response?: string
  error?: string
}

function errorCodeForStatus(status: number) {
  if (status === 401 || status === 403) return 'authentication' as const
  if (status === 429) return 'rate_limit' as const
  return 'unavailable' as const
}

function normalizeTransportError(error: unknown): EchoAiError {
  if (isEchoAiError(error)) return error

  const name = error instanceof Error ? error.name.toLowerCase() : ''
  const message = error instanceof Error ? error.message.toLowerCase() : ''
  if (
    name.includes('abort') ||
    name.includes('timeout') ||
    message.includes('aborted') ||
    message.includes('timeout')
  ) {
    return new EchoAiError('timeout', 'Le provider Ollama a dépassé le délai autorisé.', {
      provider: 'ollama',
      cause: error,
    })
  }

  return new EchoAiError('unavailable', 'Le provider Ollama est inaccessible.', {
    provider: 'ollama',
    cause: error,
  })
}

function getVisibleContent(value: string) {
  const closingTag = '</think>'
  const closingIndex = value.toLowerCase().lastIndexOf(closingTag)
  const visibleValue =
    closingIndex >= 0 ? value.slice(closingIndex + closingTag.length) : value

  return visibleValue.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
}

export class OllamaProvider implements EchoAiProvider {
  readonly id = 'ollama' as const
  private readonly baseUrl: string

  constructor(options: OllamaProviderOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '')
  }

  generateText(input: EchoAiGenerationRequest) {
    return this.generate(input)
  }

  generateJson(input: EchoAiStructuredGenerationRequest) {
    return this.generate(input, input.schema)
  }

  async getStatus(model: string): Promise<EchoAiProviderStatus> {
    const startedAt = Date.now()

    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(4000),
      })

      if (!response.ok) {
        throw new EchoAiError(
          errorCodeForStatus(response.status),
          'Le provider Ollama a refusé la vérification de statut.',
          { provider: this.id, status: response.status },
        )
      }

      const data = (await response.json().catch((error) => {
        throw new EchoAiError('invalid_response', 'Statut Ollama invalide.', {
          provider: this.id,
          cause: error,
        })
      })) as { models?: Array<{ name?: string; model?: string }> }
      const models = (data.models ?? [])
        .map((item) => item.name || item.model)
        .filter((item): item is string => Boolean(item))
      const modelAvailable = models.some(
        (availableModel) =>
          availableModel === model || availableModel.startsWith(`${model}:`),
      )

      return {
        provider: this.id,
        model,
        durationMs: Date.now() - startedAt,
        content: modelAvailable ? 'available' : 'missing_model',
        available: true,
        modelAvailable,
      }
    } catch (error) {
      throw normalizeTransportError(error)
    }
  }

  private async generate(
    input: EchoAiGenerationRequest,
    schema?: Record<string, unknown>,
  ): Promise<EchoAiGenerationResult> {
    const startedAt = Date.now()

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(input.timeoutMs),
        cache: 'no-store',
        body: JSON.stringify({
          model: input.model,
          messages: input.messages,
          think: false,
          stream: false,
          ...(schema ? { format: schema } : {}),
          options: {
            ...(input.options?.maxTokens
              ? { num_predict: input.options.maxTokens }
              : {}),
            ...(input.options?.temperature !== undefined
              ? { temperature: input.options.temperature }
              : {}),
          },
        }),
      })

      const rawBody = await response.text()
      if (!response.ok) {
        throw new EchoAiError(
          errorCodeForStatus(response.status),
          'Le provider Ollama a refusé la génération.',
          { provider: this.id, status: response.status },
        )
      }

      let data: OllamaChatResponse
      try {
        data = JSON.parse(rawBody) as OllamaChatResponse
      } catch (error) {
        throw new EchoAiError('invalid_response', 'Réponse Ollama non JSON.', {
          provider: this.id,
          cause: error,
        })
      }

      const content = getVisibleContent(data.message?.content || data.response || '')
      if (!content) {
        throw new EchoAiError('invalid_response', 'Réponse Ollama vide.', {
          provider: this.id,
        })
      }

      return {
        provider: this.id,
        model: input.model,
        durationMs: Date.now() - startedAt,
        content,
      }
    } catch (error) {
      throw normalizeTransportError(error)
    }
  }
}
