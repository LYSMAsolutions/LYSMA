import { prisma } from '@/lib/prisma'

export async function createErrorReport(input: {
  outil: string
  niveau?: string
  message: string
  stack?: string | null
  url?: string | null
  userAgent?: string | null
  contexte?: unknown
}) {
  return prisma.errorReport.create({
    data: {
      outil: input.outil,
      niveau: input.niveau ?? 'ERROR',
      message: input.message,
      stack: input.stack ?? undefined,
      url: input.url ?? undefined,
      userAgent: input.userAgent ?? undefined,
      contexte: input.contexte === undefined ? undefined : JSON.parse(JSON.stringify(input.contexte)),
    },
  })
}
