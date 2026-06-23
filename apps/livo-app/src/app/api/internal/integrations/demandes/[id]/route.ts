import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { isInternalApiAuthorized } from '@/lib/security/internal-api'

const schema = z.object({
  statut: z.enum(['APPROUVEE', 'REFUSEE']),
  noteAdmin: z.string().trim().max(2000).optional().nullable(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isInternalApiAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id } = await params

  const demande = await prisma.demandeIntegration.findUnique({
    where: { id },
    include: { garage: true },
  })

  if (!demande) {
    return NextResponse.json({ error: 'Demande introuvable.' }, { status: 404 })
  }

  if (demande.statut !== 'EN_ATTENTE') {
    return NextResponse.json({ error: 'Cette demande a déjà été traitée.' }, { status: 409 })
  }

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const updated = await prisma.demandeIntegration.update({
    where: { id },
    data: {
      statut: parsed.data.statut,
      noteAdmin: parsed.data.noteAdmin || null,
    },
  })

  return NextResponse.json({ success: true, demande: updated })
}
