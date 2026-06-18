import { EchoAiError } from '@/modules/echo/ai/errors'
import { OllamaProvider } from '@/modules/echo/ai/providers/ollama-provider'
import type {
  EchoAiGenerationOptions,
  EchoAiGenerationResult,
  EchoAiMessage,
  EchoAiProvider,
  EchoAiProviderId,
  EchoAiProviderStatus,
  EchoAiRuntime,
  EchoAiTask,
} from '@/modules/echo/ai/types'

const DEFAULT_PROVIDER = 'ollama'
const DEFAULT_MODEL = 'qwen3:4b'
const DEFAULT_TIMEOUT_MS = 60000
const DEFAULT_OLLAMA_BASE_URL = 'http://127.0.0.1:11434'

type ClientGenerationInput = {
  messages: EchoAiMessage[]
  options?: EchoAiGenerationOptions
}

type ClientStructuredGenerationInput = ClientGenerationInput & {
  schema: Record<string, unknown>
}

function getProviderId(): EchoAiProviderId {
  const value = (process.env.ECHO_AI_PROVIDER || DEFAULT_PROVIDER).trim().toLowerCase()
  if (value !== 'ollama') {
    throw new EchoAiError(
      'configuration',
      `Provider ECHO non supporté: ${value || '(vide)'}.`,
    )
  }

  return value
}

function getTimeoutMs() {
  const value = Number(process.env.ECHO_AI_TIMEOUT_MS)
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_TIMEOUT_MS
}

function getModel(task: EchoAiTask) {
  if (task === 'memory') {
    return process.env.ECHO_MEMORY_MODEL || process.env.ECHO_CHAT_MODEL || DEFAULT_MODEL
  }

  return process.env.ECHO_CHAT_MODEL || DEFAULT_MODEL
}

function getOllamaBaseUrl() {
  const rawValue = process.env.OLLAMA_BASE_URL || DEFAULT_OLLAMA_BASE_URL

  let parsed: URL
  try {
    parsed = new URL(rawValue)
  } catch (error) {
    throw new EchoAiError('configuration', "L'URL du provider Ollama est invalide.", {
      provider: 'ollama',
      cause: error,
    })
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new EchoAiError('configuration', "L'URL du provider Ollama est invalide.", {
      provider: 'ollama',
    })
  }

  const hostname = parsed.hostname.toLowerCase()
  const loopback =
    hostname === 'localhost' ||
    hostname === '::1' ||
    hostname === '[::1]' ||
    hostname.startsWith('127.')

  if (process.env.NODE_ENV === 'production' && loopback) {
    throw new EchoAiError(
      'configuration',
      'Ollama local ne peut pas être utilisé depuis le déploiement de production.',
      { provider: 'ollama' },
    )
  }

  return parsed.toString().replace(/\/$/, '')
}

function createProvider(providerId: EchoAiProviderId): EchoAiProvider {
  if (providerId === 'ollama') {
    return new OllamaProvider({ baseUrl: getOllamaBaseUrl() })
  }

  throw new EchoAiError('configuration', 'Provider ECHO non supporté.')
}

function getRuntime(task: EchoAiTask): EchoAiRuntime {
  return {
    provider: getProviderId(),
    model: getModel(task),
    timeoutMs: getTimeoutMs(),
  }
}

class EchoAiClient {
  getRuntime(task: EchoAiTask): EchoAiRuntime {
    return getRuntime(task)
  }

  async generateText(
    task: EchoAiTask,
    input: ClientGenerationInput,
  ): Promise<EchoAiGenerationResult> {
    const runtime = getRuntime(task)
    const provider = createProvider(runtime.provider)

    return provider.generateText({
      ...input,
      model: runtime.model,
      timeoutMs: runtime.timeoutMs,
    })
  }

  async generateJson(
    task: EchoAiTask,
    input: ClientStructuredGenerationInput,
  ): Promise<EchoAiGenerationResult> {
    const runtime = getRuntime(task)
    const provider = createProvider(runtime.provider)

    return provider.generateJson({
      ...input,
      model: runtime.model,
      timeoutMs: runtime.timeoutMs,
    })
  }

  async getStatus(task: EchoAiTask): Promise<EchoAiProviderStatus> {
    const runtime = getRuntime(task)
    const provider = createProvider(runtime.provider)
    return provider.getStatus(runtime.model)
  }
}

export const echoAi = new EchoAiClient()
