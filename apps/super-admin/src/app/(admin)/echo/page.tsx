import { prisma } from '@/lib/prisma'
import { getEchoConfig } from '@/lib/echo'
import { EchoClient } from './EchoClient'
import { PageHeader } from '@/components/ui'

export const dynamic = 'force-dynamic'

function getHypothesisSensitivity(metadata: unknown) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return 'medium'

  const value = (metadata as Record<string, unknown>).classification
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'medium'

  const sensitivity = (value as Record<string, unknown>).sensitivity
  return sensitivity === 'low' ||
    sensitivity === 'medium' ||
    sensitivity === 'high' ||
    sensitivity === 'critical'
    ? sensitivity
    : 'medium'
}

export default async function EchoPage() {
  const [
    messagesDesc,
    memories,
    hypotheses,
    pendingHypotheses,
    activeDecisions,
    totalMessages,
  ] =
    await Promise.all([
      prisma.echoChatMessage.findMany({
        where: { role: { in: ['user', 'assistant'] } },
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
        },
      }),
      prisma.echoMemoryEntry.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 30,
        select: {
          id: true,
          humanSummary: true,
          category: true,
          type: true,
          sensitivity: true,
          confidence: true,
          status: true,
          validated: true,
          updatedAt: true,
        },
      }),
      prisma.echoHypothesis.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 20,
        select: {
          id: true,
          hypothesis: true,
          confidence: true,
          status: true,
          metadata: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.echoHypothesis.count({ where: { status: 'en_attente' } }),
      prisma.echoDecision.count({ where: { status: 'actif' } }),
      prisma.echoChatMessage.count(),
    ])

  const config = getEchoConfig()
  const messages = messagesDesc.reverse().map((message) => ({
    id: message.id,
    role: message.role === 'user' ? ('user' as const) : ('assistant' as const),
    content: message.content,
    createdAt: message.createdAt.toISOString(),
  }))

  return (
    <main>
      <PageHeader
        title="ECHO"
        description="Assistant IA personnel — mémoire, hypothèses, décisions."
      />

      <EchoClient
        initialMessages={messages}
        initialMemories={memories.map((memory) => ({
          ...memory,
          confidence: Number(memory.confidence),
          updatedAt: memory.updatedAt.toISOString(),
        }))}
        initialHypotheses={hypotheses.map((hypothesis) => ({
          id: hypothesis.id,
          summary: hypothesis.hypothesis,
          sensitivity: getHypothesisSensitivity(hypothesis.metadata),
          confidence: Number(hypothesis.confidence),
          status: hypothesis.status,
          createdAt: hypothesis.createdAt.toISOString(),
          updatedAt: hypothesis.updatedAt.toISOString(),
        }))}
        stats={{
          totalMessages,
          pendingMemories: memories.filter((memory) => memory.status === 'en_validation').length,
          pendingHypotheses,
          activeDecisions,
        }}
        configuredModel={config.model}
      />
    </main>
  )
}

