import type { EchoAiProviderId } from '@/modules/echo/ai/types'

export type EchoAiErrorCode =
  | 'configuration'
  | 'authentication'
  | 'timeout'
  | 'rate_limit'
  | 'unavailable'
  | 'invalid_response'

type EchoAiErrorOptions = {
  provider?: EchoAiProviderId
  cause?: unknown
  status?: number
}

export class EchoAiError extends Error {
  readonly code: EchoAiErrorCode
  readonly provider?: EchoAiProviderId
  readonly status?: number

  constructor(code: EchoAiErrorCode, message: string, options: EchoAiErrorOptions = {}) {
    super(message, { cause: options.cause })
    this.name = 'EchoAiError'
    this.code = code
    this.provider = options.provider
    this.status = options.status
  }
}

export function isEchoAiError(error: unknown): error is EchoAiError {
  return error instanceof EchoAiError
}

export function getEchoAiPublicMessage(error: EchoAiError) {
  const messages: Record<EchoAiErrorCode, string> = {
    configuration: "ECHO n'est pas configuré pour cet environnement.",
    authentication: "Le fournisseur IA d'ECHO refuse l'authentification.",
    timeout: "Le fournisseur IA d'ECHO met trop de temps à répondre.",
    rate_limit: "Le fournisseur IA d'ECHO est temporairement limité.",
    unavailable: "Le fournisseur IA d'ECHO est temporairement indisponible.",
    invalid_response: "Le fournisseur IA d'ECHO a retourné une réponse invalide.",
  }

  return messages[error.code]
}

export function getEchoAiHttpStatus(error: EchoAiError) {
  if (error.code === 'invalid_response') return 502
  return 503
}
