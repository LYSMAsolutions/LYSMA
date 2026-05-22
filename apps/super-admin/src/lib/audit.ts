import { prisma } from '@/lib/prisma'

type AuditInput = {
  outil: string
  cibleType: string
  cibleId?: string
  action: string
  statut?: 'SUCCESS' | 'ERROR'
  acteurId?: string
  acteurEmail?: string | null
  resume?: string
  avant?: unknown
  apres?: unknown
  erreur?: string
}

export async function writeAuditLog(input: AuditInput) {
  try {
    await prisma.auditLog.create({
      data: {
        outil: input.outil,
        cibleType: input.cibleType,
        cibleId: input.cibleId,
        action: input.action,
        statut: input.statut ?? 'SUCCESS',
        acteurId: input.acteurId,
        acteurEmail: input.acteurEmail ?? undefined,
        resume: input.resume,
        avant: input.avant === undefined ? undefined : JSON.parse(JSON.stringify(input.avant)),
        apres: input.apres === undefined ? undefined : JSON.parse(JSON.stringify(input.apres)),
        erreur: input.erreur,
      },
    })
  } catch (error) {
    console.error('Audit log error:', error)
  }
}

export async function getAuditLogs(filters: {
  outil?: string
  cibleType?: string
  cibleId?: string
  take?: number
}) {
  return prisma.auditLog.findMany({
    where: {
      outil: filters.outil,
      cibleType: filters.cibleType,
      cibleId: filters.cibleId,
    },
    orderBy: { createdAt: 'desc' },
    take: filters.take ?? 30,
  })
}
