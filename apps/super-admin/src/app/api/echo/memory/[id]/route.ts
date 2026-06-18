import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  action: z.enum(['validate', 'reject']),
})

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Action invalide.' }, { status: 400 })
  }

  const { id } = await context.params
  const current = await prisma.echoMemoryEntry.findUnique({ where: { id } })
  if (!current) {
    return NextResponse.json({ error: 'Mémoire introuvable.' }, { status: 404 })
  }

  const validated = parsed.data.action === 'validate'
  const memory = await prisma.echoMemoryEntry.update({
    where: { id },
    data: {
      status: validated ? 'valide' : 'rejete',
      validated,
      metadata: {
        ...((current.metadata as Record<string, unknown> | null) ?? {}),
        reviewedBy: session.user?.email ?? 'super-admin',
        reviewedAt: new Date().toISOString(),
      },
    },
  })

  await prisma.auditLog.create({
    data: {
      outil: 'echo',
      cibleType: 'memory',
      cibleId: memory.id,
      action: validated ? 'echo.memory.validate' : 'echo.memory.reject',
      acteurId: session.user?.id ?? null,
      acteurEmail: session.user?.email ?? null,
      resume: memory.humanSummary.slice(0, 180),
      avant: current,
      apres: memory,
    },
  })

  return NextResponse.json({
    memory: {
      id: memory.id,
      status: memory.status,
      validated: memory.validated,
    },
  })
}
