import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { writeAuditLog } from '@/lib/audit'

const schema = z.object({
  notes: z.string().optional(),
  abonnement: z.enum(['starter', 'pro', 'entreprise']).optional(),
  statut: z.enum(['TRIAL', 'ACTIF', 'SUSPENDU', 'RESILIE']).optional(),
  abonnementActif: z.boolean().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const existingClient = await prisma.client.findUnique({
    where: {
      id,
    },
  })

  if (!existingClient) {
    return NextResponse.json({ error: 'Client introuvable' }, { status: 404 })
  }

  const data = {
    ...parsed.data,
    statut: parsed.data.abonnementActif === true ? 'ACTIF' : parsed.data.statut,
  }

  const client = await prisma.client.update({
    where: {
      id,
    },
    data,
  })

  await writeAuditLog({
    outil: client.outil,
    cibleType: 'client',
    cibleId: client.id,
    action: 'client_update',
    acteurId: session.user.id,
    acteurEmail: session.user.email,
    resume: `Mise a jour client ${client.nom}`,
    avant: existingClient,
    apres: client,
  })

  return NextResponse.json({ success: true, client })
}
