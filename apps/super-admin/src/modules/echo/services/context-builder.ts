import { prisma } from '@/lib/prisma'
import { getLysmaTools } from '@/lib/tools'

const DAY_MS = 24 * 60 * 60 * 1000

export type EchoContextEvidenceSource =
  | 'echo_memory'
  | 'echo_hypothesis'
  | 'echo_decision'
  | 'echo_conversation'
  | 'client'
  | 'access'
  | 'audit_log'
  | 'error_report'
  | 'message'
  | 'invoice'
  | 'project'

export type EchoContext = {
  generatedAt: string
  windows: {
    last24Hours: string
    last7Days: string
    previous7Days: string
    last30Days: string
  }
  echo: {
    usage: {
      conversations24h: number
      messagesLast7Days: number
      messagesPrevious7Days: number
      activeDaysLast7Days: number
    }
    memories: Array<{
      id: string
      summary: string
      type: string
      category: string
      status: string
      sensitivity: string
      confidence: number
      observationCount: number
      updatedAt: string
    }>
    hypotheses: Array<{
      id: string
      summary: string
      status: string
      confidence: number
      observationCount: number
      createdAt: string
      updatedAt: string
    }>
    decisions: Array<{
      id: string
      summary: string
      status: string
      source: 'decision' | 'memory'
      createdAt: string
    }>
  }
  business: {
    clients: Array<{
      id: string
      name: string
      company: string | null
      tool: string
      status: string
      subscriptionActive: boolean
      trialEndAt: string | null
      createdAt: string
      updatedAt: string
      accesses: Array<{
        id: string
        active: boolean
        firstLoginRequired: boolean
        createdAt: string
      }>
    }>
    clientRegistrations: {
      last7Days: number
      previous7Days: number
    }
    auditLogs: Array<{
      id: string
      tool: string
      targetType: string
      action: string
      status: string
      summary: string | null
      createdAt: string
    }>
    openErrors: Array<{
      id: string
      tool: string
      level: string
      message: string
      status: string
      createdAt: string
    }>
    unreadMessages: Array<{
      id: string
      sender: string
      tool: string
      status: string
      createdAt: string
    }>
    unpaidInvoices: Array<{
      id: string
      number: string
      clientName: string
      status: string
      dueAt: string | null
      createdAt: string
    }>
    projects: Array<{
      id: string
      name: string
      kind: 'tool' | 'showcase'
      status: string
      updatedAt: string | null
    }>
  }
}

function getJsonObject(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function getObservationCount(metadata: unknown) {
  const value = getJsonObject(metadata).observationCount
  return typeof value === 'number' && Number.isFinite(value) ? value : 1
}

function startOfUtcDay(value: Date) {
  return Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate())
}

export async function buildEchoContext(now = new Date()): Promise<EchoContext> {
  const last24Hours = new Date(now.getTime() - DAY_MS)
  const last7Days = new Date(now.getTime() - 7 * DAY_MS)
  const previous7Days = new Date(now.getTime() - 14 * DAY_MS)
  const last30Days = new Date(now.getTime() - 30 * DAY_MS)

  const [
    userMessages,
    memories,
    hypotheses,
    decisions,
    clients,
    auditLogs,
    openErrors,
    unreadMessages,
    unpaidInvoices,
    showcaseProjects,
    tools,
  ] = await Promise.all([
    prisma.echoChatMessage.findMany({
      where: { role: 'user', createdAt: { gte: previous7Days } },
      orderBy: { createdAt: 'desc' },
      select: { id: true, createdAt: true },
    }),
    prisma.echoMemoryEntry.findMany({
      where: {
        OR: [
          { updatedAt: { gte: last30Days } },
          { status: { in: ['en_validation', 'autonome', 'probabiliste', 'valide'] } },
        ],
      },
      orderBy: { updatedAt: 'desc' },
      take: 100,
      select: {
        id: true,
        humanSummary: true,
        type: true,
        category: true,
        status: true,
        sensitivity: true,
        confidence: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.echoHypothesis.findMany({
      where: {
        OR: [{ updatedAt: { gte: last30Days } }, { status: 'en_attente' }],
      },
      orderBy: { updatedAt: 'desc' },
      take: 100,
      select: {
        id: true,
        hypothesis: true,
        status: true,
        confidence: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.echoDecision.findMany({
      where: { OR: [{ createdAt: { gte: last30Days } }, { status: 'actif' }] },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { id: true, decision: true, status: true, createdAt: true },
    }),
    prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      take: 250,
      select: {
        id: true,
        nom: true,
        societe: true,
        outil: true,
        statut: true,
        abonnementActif: true,
        trialFinAt: true,
        createdAt: true,
        updatedAt: true,
        acces: {
          select: {
            id: true,
            actif: true,
            premiereConnexion: true,
            createdAt: true,
          },
        },
      },
    }),
    prisma.auditLog.findMany({
      where: { createdAt: { gte: last7Days } },
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: {
        id: true,
        outil: true,
        cibleType: true,
        action: true,
        statut: true,
        resume: true,
        createdAt: true,
      },
    }),
    prisma.errorReport.findMany({
      where: { statut: { not: 'RESOLU' } },
      orderBy: { createdAt: 'asc' },
      take: 100,
      select: {
        id: true,
        outil: true,
        niveau: true,
        message: true,
        statut: true,
        createdAt: true,
      },
    }),
    prisma.message.findMany({
      where: { statut: 'NOUVEAU' },
      orderBy: { createdAt: 'asc' },
      take: 100,
      select: { id: true, nom: true, outil: true, statut: true, createdAt: true },
    }),
    prisma.financeInvoice.findMany({
      where: { status: { in: ['EMISE', 'EN_RETARD'] } },
      orderBy: { dueDate: 'asc' },
      take: 100,
      select: {
        id: true,
        invoiceNumber: true,
        clientName: true,
        status: true,
        dueDate: true,
        createdAt: true,
      },
    }),
    prisma.showcaseSiteFinance.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 100,
      select: { id: true, siteName: true, maintenanceStatus: true, updatedAt: true },
    }),
    getLysmaTools(),
  ])

  const memoryDecisions = memories
    .filter(
      (memory) =>
        memory.type === 'decision' &&
        ['autonome', 'probabiliste', 'valide', 'actif'].includes(memory.status),
    )
    .map((memory) => ({
      id: memory.id,
      summary: memory.humanSummary,
      status: memory.status,
      source: 'memory' as const,
      createdAt: memory.createdAt.toISOString(),
    }))
  const normalizedDecisions = decisions.map((decision) => ({
    id: decision.id,
    summary: decision.decision,
    status: decision.status,
    source: 'decision' as const,
    createdAt: decision.createdAt.toISOString(),
  }))
  const uniqueDecisions = new Map<string, (typeof normalizedDecisions)[number] | (typeof memoryDecisions)[number]>()

  for (const decision of [...normalizedDecisions, ...memoryDecisions]) {
    const key = decision.summary.trim().toLocaleLowerCase('fr-FR')
    if (!uniqueDecisions.has(key)) uniqueDecisions.set(key, decision)
  }

  const messagesLast7Days = userMessages.filter(
    (message) => message.createdAt >= last7Days,
  )
  const activeDaysLast7Days = new Set(
    messagesLast7Days.map((message) => startOfUtcDay(message.createdAt)),
  ).size
  const clientsLast7Days = clients.filter((client) => client.createdAt >= last7Days).length
  const clientsPrevious7Days = clients.filter(
    (client) => client.createdAt >= previous7Days && client.createdAt < last7Days,
  ).length

  return {
    generatedAt: now.toISOString(),
    windows: {
      last24Hours: last24Hours.toISOString(),
      last7Days: last7Days.toISOString(),
      previous7Days: previous7Days.toISOString(),
      last30Days: last30Days.toISOString(),
    },
    echo: {
      usage: {
        conversations24h: userMessages.filter(
          (message) => message.createdAt >= last24Hours,
        ).length,
        messagesLast7Days: messagesLast7Days.length,
        messagesPrevious7Days: userMessages.length - messagesLast7Days.length,
        activeDaysLast7Days,
      },
      memories: memories.map((memory) => ({
        id: memory.id,
        summary: memory.humanSummary,
        type: memory.type,
        category: memory.category,
        status: memory.status,
        sensitivity: memory.sensitivity,
        confidence: Number(memory.confidence),
        observationCount: getObservationCount(memory.metadata),
        updatedAt: memory.updatedAt.toISOString(),
      })),
      hypotheses: hypotheses.map((hypothesis) => ({
        id: hypothesis.id,
        summary: hypothesis.hypothesis,
        status: hypothesis.status,
        confidence: Number(hypothesis.confidence),
        observationCount: getObservationCount(hypothesis.metadata),
        createdAt: hypothesis.createdAt.toISOString(),
        updatedAt: hypothesis.updatedAt.toISOString(),
      })),
      decisions: Array.from(uniqueDecisions.values()),
    },
    business: {
      clients: clients.map((client) => ({
        id: client.id,
        name: client.nom,
        company: client.societe,
        tool: client.outil,
        status: client.statut,
        subscriptionActive: client.abonnementActif,
        trialEndAt: client.trialFinAt?.toISOString() ?? null,
        createdAt: client.createdAt.toISOString(),
        updatedAt: client.updatedAt.toISOString(),
        accesses: client.acces.map((access) => ({
          id: access.id,
          active: access.actif,
          firstLoginRequired: access.premiereConnexion,
          createdAt: access.createdAt.toISOString(),
        })),
      })),
      clientRegistrations: {
        last7Days: clientsLast7Days,
        previous7Days: clientsPrevious7Days,
      },
      auditLogs: auditLogs.map((log) => ({
        id: log.id,
        tool: log.outil,
        targetType: log.cibleType,
        action: log.action,
        status: log.statut,
        summary: log.resume,
        createdAt: log.createdAt.toISOString(),
      })),
      openErrors: openErrors.map((error) => ({
        id: error.id,
        tool: error.outil,
        level: error.niveau,
        message: error.message,
        status: error.statut,
        createdAt: error.createdAt.toISOString(),
      })),
      unreadMessages: unreadMessages.map((message) => ({
        id: message.id,
        sender: message.nom,
        tool: message.outil,
        status: message.statut,
        createdAt: message.createdAt.toISOString(),
      })),
      unpaidInvoices: unpaidInvoices.map((invoice) => ({
        id: invoice.id,
        number: invoice.invoiceNumber,
        clientName: invoice.clientName,
        status: invoice.status,
        dueAt: invoice.dueDate?.toISOString() ?? null,
        createdAt: invoice.createdAt.toISOString(),
      })),
      projects: [
        ...tools.map((tool) => ({
          id: tool.id,
          name: tool.name,
          kind: 'tool' as const,
          status: tool.status,
          updatedAt: null,
        })),
        ...showcaseProjects.map((project) => ({
          id: project.id,
          name: project.siteName,
          kind: 'showcase' as const,
          status: project.maintenanceStatus,
          updatedAt: project.updatedAt.toISOString(),
        })),
      ],
    },
  }
}
