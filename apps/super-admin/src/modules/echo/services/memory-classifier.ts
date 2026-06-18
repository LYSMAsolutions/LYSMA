import { z } from 'zod'
import { EchoAiError } from '@/modules/echo/ai/errors'
import { echoAi } from '@/modules/echo/ai/provider-registry'
import type { EchoAiGenerationResult } from '@/modules/echo/ai/types'
import { MEMORY_CLASSIFIER_PROMPT } from '@/modules/echo/prompts/memory-classifier-prompt'

export type MemoryClassification = {
  shouldStore: boolean
  memoryType: 'fact' | 'preference' | 'decision' | 'hypothesis' | 'none'
  confidence: number
  summary: string
  sensitivity: 'low' | 'medium' | 'high' | 'critical'
}

const classificationSchema = z
  .object({
    shouldStore: z.boolean(),
    memoryType: z.enum(['fact', 'preference', 'decision', 'hypothesis', 'none']),
    confidence: z.number().min(0).max(1),
    summary: z.string().trim().max(500),
    sensitivity: z.enum(['low', 'medium', 'high', 'critical']),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.shouldStore && value.memoryType === 'none') {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Une memoire stockable doit avoir un type.',
      })
    }

    if (value.shouldStore && value.summary.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Une memoire stockable doit avoir un resume.',
      })
    }
  })

const classificationJsonSchema = {
  type: 'object',
  properties: {
    shouldStore: { type: 'boolean' },
    memoryType: {
      type: 'string',
      enum: ['fact', 'preference', 'decision', 'hypothesis', 'none'],
    },
    confidence: { type: 'number', minimum: 0, maximum: 1 },
    summary: { type: 'string' },
    sensitivity: {
      type: 'string',
      enum: ['low', 'medium', 'high', 'critical'],
    },
  },
  required: [
    'shouldStore',
    'memoryType',
    'confidence',
    'summary',
    'sensitivity',
  ],
} satisfies Record<string, unknown>

export type MemoryClassificationRun = {
  classification: MemoryClassification
  generation: EchoAiGenerationResult
}

const explicitDecisionPattern =
  /\b(?:je\s+(?:d[eé]cide|valide|choisis)|on\s+part\s+sur|c['’]\s*est\s+act[eé])\b/i
const uncertainDecisionPattern =
  /\b(?:peut[- ]?[eê]tre|pourrait|j['’]\s*envisage|je\s+pense|j['’]\s*h[eé]site|probablement|[eé]ventuellement|pas\s+encore|si\s+je)\b/i
const explicitPreferencePattern =
  /\b(?:je\s+(?:pr[eé]f[eè]re|veux|souhaite|aime)|mon\s+choix\s+est)\b/i

function stripJsonFence(value: string) {
  return value
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()
}

function applySafetyRules(
  message: string,
  classification: MemoryClassification,
): MemoryClassification {
  if (
    !classification.shouldStore ||
    classification.memoryType === 'none' ||
    classification.confidence < 0.5
  ) {
    return {
      shouldStore: false,
      memoryType: 'none',
      confidence: classification.confidence,
      summary: '',
      sensitivity: classification.sensitivity,
    }
  }

  if (
    classification.memoryType === 'decision' &&
    !containsExplicitDecision(message)
  ) {
    return {
      ...classification,
      memoryType: explicitPreferencePattern.test(message) ? 'preference' : 'hypothesis',
    }
  }

  return classification
}

export function containsExplicitDecision(message: string) {
  return explicitDecisionPattern.test(message) && !uncertainDecisionPattern.test(message)
}

export async function classifyMemoryWithTrace(
  message: string,
): Promise<MemoryClassificationRun> {
  const generation = await echoAi.generateJson('memory', {
    messages: [
      { role: 'system', content: MEMORY_CLASSIFIER_PROMPT },
      { role: 'user', content: message },
    ],
    schema: classificationJsonSchema,
    options: {
      maxTokens: 180,
      temperature: 0,
    },
  })

  try {
    const content = stripJsonFence(generation.content)
    const parsedJson = JSON.parse(content) as unknown
    const classification = classificationSchema.parse(parsedJson) as MemoryClassification

    return {
      classification: applySafetyRules(message, classification),
      generation,
    }
  } catch (error) {
    throw new EchoAiError(
      'invalid_response',
      'La classification mémoire retournée par le provider IA est invalide.',
      { provider: generation.provider, cause: error },
    )
  }
}

export async function classifyMemory(message: string): Promise<MemoryClassification> {
  const run = await classifyMemoryWithTrace(message)
  return run.classification
}
