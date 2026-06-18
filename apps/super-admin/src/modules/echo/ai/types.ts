export type EchoAiProviderId = 'ollama'

export type EchoAiTask = 'chat' | 'memory'

export type EchoAiRole = 'system' | 'user' | 'assistant'

export type EchoAiMessage = {
  role: EchoAiRole
  content: string
}

export type EchoAiGenerationOptions = {
  maxTokens?: number
  temperature?: number
}

export type EchoAiGenerationRequest = {
  messages: EchoAiMessage[]
  model: string
  timeoutMs: number
  options?: EchoAiGenerationOptions
}

export type EchoAiStructuredGenerationRequest = EchoAiGenerationRequest & {
  schema: Record<string, unknown>
}

export type EchoAiGenerationResult = {
  provider: EchoAiProviderId
  model: string
  durationMs: number
  content: string
}

export type EchoAiProviderStatus = {
  provider: EchoAiProviderId
  model: string
  durationMs: number
  content: string
  available: boolean
  modelAvailable: boolean
}

export type EchoAiRuntime = {
  provider: EchoAiProviderId
  model: string
  timeoutMs: number
}

export interface EchoAiProvider {
  readonly id: EchoAiProviderId

  generateText(input: EchoAiGenerationRequest): Promise<EchoAiGenerationResult>

  generateJson(
    input: EchoAiStructuredGenerationRequest,
  ): Promise<EchoAiGenerationResult>

  getStatus(model: string): Promise<EchoAiProviderStatus>
}
