import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeAuditLog } from '@/lib/audit'

const schema = z.object({
  statut: z.enum(['NOUVEAU', 'EN_COURS', 'RESOLU', 'IGNORE']).optional(),
  notes: z.string().max(4000).optional(),
  resolution: z.string().max(4000).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { id } = await params
  const before = await prisma.errorReport.findUnique({ where: { id } })
  if (!before) {
    return NextResponse.json({ error: 'Erreur introuvable' }, { status: 404 })
  }

  const report = await prisma.errorReport.update({
    where: { id },
    data: {
      statut: parsed.data.statut,
      notes: parsed.data.notes,
      resolution: parsed.data.resolution,
      resolvedAt: parsed.data.statut === 'RESOLU' ? new Date() : undefined,
      resolvedBy: parsed.data.statut === 'RESOLU' ? session.user.id : undefined,
    },
  })

  await writeAuditLog({
    outil: report.outil,
    cibleType: 'error',
    cibleId: report.id,
    action: 'error_update',
    acteurId: session.user.id,
    acteurEmail: session.user.email,
    resume: `Erreur ${report.statut}`,
    avant: before,
    apres: report,
  })

  return NextResponse.json({ success: true, report })
}
