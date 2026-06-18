import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import type { EchoAiGenerationResult } from '@/modules/echo/ai/types'
import {
  classifyMemoryWithTrace,
  containsExplicitDecision,
  type MemoryClassification,
} from '@/modules/echo/services/memory-classifier'

export type StoredMemoryUpdate = {
  id: string
  kind: 'memory' | 'hypothesis'
  summary: string
  memoryType: Exclude<MemoryClassification['memoryType'], 'none'>
  sensitivity: MemoryClassification['sensitivity']
  confidence: number
  status: string
  validated: boolean
  createdAt: string
  updatedAt: string
  created: boolean
}

type ProcessMemoryInput = {
  message: string
  sourceMessageId: string
  requestId: string
}

const memoryTypeToDatabase = {
  fact: 'fait',
  preference: 'preference',
  decision: 'decision',
} as const

const sensitivityToDatabase = {
  low: 'faible',
  medium: 'moyenne',
  high: 'elevee',
  critical: 'critique',
} as const

function getJsonObject(value: Prisma.JsonValue): Prisma.JsonObject {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Prisma.JsonObject
  }

  return {}
}

function getObservationCount(metadata: Prisma.JsonObject) {
  const value = metadata.observationCount
  return typeof value === 'number' && Number.isFinite(value) ? value : 1
}

function getMemoryStatus(classification: MemoryClassification) {
  if (classification.sensitivity === 'high' || classification.sensitivity === 'critical') {
    return { status: 'en_validation', validated: false }
  }

  if (classification.sensitivity === 'low' && classification.confidence >= 0.75) {
    return { status: 'autonome', validated: true }
  }

  return { status: 'probabiliste', validated: false }
}

function buildMetadata(
  classification: MemoryClassification,
  requestId: string,
  observationCount: number,
  generation: EchoAiGenerationResult,
): Prisma.InputJsonObject {
  return {
    memoryEngineVersion: '2.4',
    classifier: `${generation.provider}-json`,
    provider: generation.provider,
    model: generation.model,
    durationMs: generation.durationMs,
    classifiedAt: new Date().toISOString(),
    requestId,
    observationCount,
    classification: {
      shouldStore: classification.shouldStore,
      memoryType: classification.memoryType,
      confidence: classification.confidence,
      sensitivity: classification.sensitivity,
    },
  }
}

async function storeHypothesis(
  classification: MemoryClassification & { memoryType: 'hypothesis' },
  input: ProcessMemoryInput,
  generation: EchoAiGenerationResult,
): Promise<StoredMemoryUpdate> {
  const existing = await prisma.echoHypothesis.findFirst({
    where: {
      hypothesis: { equals: classification.summary, mode: 'insensitive' },
      status: { not: 'rejetee' },
    },
    orderBy: { updatedAt: 'desc' },
  })

  if (existing) {
    const previousMetadata = getJsonObject(existing.metadata)
    const observationCount = getObservationCount(previousMetadata) + 1
    const updated = await prisma.echoHypothesis.update({
      where: { id: existing.id },
      data: {
        sourceMessageId: input.sourceMessageId,
        confidence: Math.max(Number(existing.confidence), classification.confidence),
        observedElements: input.message,
        metadata: {
          ...previousMetadata,
          ...buildMetadata(
            classification,
            input.requestId,
            observationCount,
            generation,
          ),
        },
      },
    })

    return {
      id: updated.id,
      kind: 'hypothesis',
      summary: updated.hypothesis,
      memoryType: 'hypothesis',
      sensitivity: classification.sensitivity,
      confidence: Number(updated.confidence),
      status: updated.status,
      validated: false,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      created: false,
    }
  }

  const created = await prisma.echoHypothesis.create({
    data: {
      sourceMessageId: input.sourceMessageId,
      hypothesis: classification.summary,
      confidence: classification.confidence,
      observedElements: input.message,
      status: 'en_attente',
      metadata: buildMetadata(classification, input.requestId, 1, generation),
    },
  })

  return {
    id: created.id,
    kind: 'hypothesis',
    summary: created.hypothesis,
    memoryType: 'hypothesis',
    sensitivity: classification.sensitivity,
    confidence: Number(created.confidence),
    status: created.status,
    validated: false,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
    created: true,
  }
}

async function storeMemoryEntry(
  classification: MemoryClassification & {
    memoryType: 'fact' | 'preference' | 'decision'
  },
  input: ProcessMemoryInput,
  generation: EchoAiGenerationResult,
): Promise<StoredMemoryUpdate> {
  if (
    classification.memoryType === 'decision' &&
    !containsExplicitDecision(input.message)
  ) {
    return storeHypothesis(
      { ...classification, memoryType: 'hypothesis' },
      input,
      generation,
    )
  }

  const existing = await prisma.echoMemoryEntry.findFirst({
    where: {
      type: memoryTypeToDatabase[classification.memoryType],
      humanSummary: { equals: classification.summary, mode: 'insensitive' },
      status: { notIn: ['rejete', 'obsolete'] },
    },
    orderBy: { updatedAt: 'desc' },
  })
  const targetState = getMemoryStatus(classification)

  if (existing) {
    const previousMetadata = getJsonObject(existing.metadata)
    const observationCount = getObservationCount(previousMetadata) + 1
    const repeatedAutonomous =
      existing.status === 'probabiliste' &&
      existing.sensitivity === 'faible' &&
      classification.sensitivity === 'low' &&
      observationCount >= 2
    const status = repeatedAutonomous ? 'autonome' : existing.status
    const validated = repeatedAutonomous ? true : existing.validated
    const updated = await prisma.echoMemoryEntry.update({
      where: { id: existing.id },
      data: {
        sourceMessageId: input.sourceMessageId,
        sourceContent: input.message,
        confidence: Math.max(Number(existing.confidence), classification.confidence),
        status,
        validated,
        metadata: {
          ...previousMetadata,
          ...buildMetadata(
            classification,
            input.requestId,
            observationCount,
            generation,
          ),
        },
      },
    })

    return {
      id: updated.id,
      kind: 'memory',
      summary: updated.humanSummary,
      memoryType: classification.memoryType,
      sensitivity: classification.sensitivity,
      confidence: Number(updated.confidence),
      status: updated.status,
      validated: updated.validated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      created: false,
    }
  }

  const created = await prisma.echoMemoryEntry.create({
    data: {
      sourceMessageId: input.sourceMessageId,
      source: 'chat',
      category: 'conversation',
      type: memoryTypeToDatabase[classification.memoryType],
      sensitivity: sensitivityToDatabase[classification.sensitivity],
      confidence: classification.confidence,
      humanSummary: classification.summary,
      sourceContent: input.message,
      status: targetState.status,
      validated: targetState.validated,
      metadata: buildMetadata(classification, input.requestId, 1, generation),
    },
  })

  return {
    id: created.id,
    kind: 'memory',
    summary: created.humanSummary,
    memoryType: classification.memoryType,
    sensitivity: classification.sensitivity,
    confidence: Number(created.confidence),
    status: created.status,
    validated: created.validated,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
    created: true,
  }
}

export async function processEchoMemory(
  input: ProcessMemoryInput,
): Promise<StoredMemoryUpdate | null> {
  const { classification, generation } = await classifyMemoryWithTrace(input.message)

  if (!classification.shouldStore || classification.memoryType === 'none') {
    return null
  }

  if (classification.memoryType === 'hypothesis') {
    return storeHypothesis(
      { ...classification, memoryType: classification.memoryType },
      input,
      generation,
    )
  }

  return storeMemoryEntry(
    { ...classification, memoryType: classification.memoryType },
    input,
    generation,
  )
}
