import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { ECHO_SYSTEM_PROMPT } from '@/lib/echo-prompt'
import { echoAi } from '@/modules/echo/ai/provider-registry'
import type { EchoAiRole } from '@/modules/echo/ai/types'

export type EchoRole = EchoAiRole

export type EchoChatInput = {
  role: EchoRole
  content: string
}

export function getEchoConfig() {
  return echoAi.getRuntime('chat')
}

export async function getEchoMemoryContext() {
  const [memories, decisions] = await Promise.all([
    prisma.echoMemoryEntry.findMany({
      where: {
        status: { in: ['autonome', 'probabiliste', 'valide', 'corrige', 'actif'] },
      },
      orderBy: { updatedAt: 'desc' },
      take: 40,
      select: {
        humanSummary: true,
        status: true,
        confidence: true,
        category: true,
      },
    }),
    prisma.echoDecision.findMany({
      where: { status: 'actif' },
      orderBy: [{ decidedAt: 'desc' }, { createdAt: 'desc' }],
      take: 20,
      select: {
        decision: true,
        reason: true,
        decidedAt: true,
      },
    }),
  ])

  const sections: string[] = []

  if (memories.length > 0) {
    sections.push(
      [
        'Memoire ECHO disponible :',
        ...memories.map((item) => {
          const confidence = Number(item.confidence).toFixed(2)
          return `- [${item.status} / ${item.category} / confiance ${confidence}] ${item.humanSummary}`
        }),
      ].join('\n'),
    )
  }

  if (decisions.length > 0) {
    sections.push(
      [
        'Decisions actives validees par Mathieu :',
        ...decisions.map((item) => {
          const date = item.decidedAt?.toISOString().slice(0, 10)
          return `- ${date ? `[${date}] ` : ''}${item.decision}${item.reason ? ` (${item.reason})` : ''}`
        }),
      ].join('\n'),
    )
  }

  return sections.join('\n\n')
}

export async function askEcho(messages: EchoChatInput[], requestId: string) {
  const memoryContext = await getEchoMemoryContext()
  const systemContent = memoryContext
    ? `${ECHO_SYSTEM_PROMPT}\n\nContexte personnel issu de la memoire centrale :\n${memoryContext}`
    : ECHO_SYSTEM_PROMPT

  return echoAi.generateText('chat', {
    messages: [{ role: 'system', content: systemContent }, ...messages],
    options: {
      maxTokens: 600,
      temperature: 0.4,
    },
  })
}

export async function saveEchoMessage(input: {
  role: Exclude<EchoRole, 'system'>
  content: string
  requestId: string
  model: string
  metadata?: Prisma.InputJsonObject
}) {
  return prisma.echoChatMessage.create({
    data: {
      role: input.role,
      content: input.content,
      requestId: input.requestId,
      model: input.model,
      metadata: input.metadata ?? {},
    },
    select: {
      id: true,
      role: true,
      content: true,
      createdAt: true,
    },
  })
}
