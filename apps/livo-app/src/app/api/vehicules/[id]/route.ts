import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { requireSecureSession } from '@/lib/security/secure-session'

const schema = z.object({
  immatriculation: z.string().trim().optional(),
  clientNom: z.string().trim().min(1),
  clientPrenom: z.string().trim().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, response } = await requireSecureSession()
  if (response) return response

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { id } = await params
  const vehicule = await prisma.vehicule.findFirst({
    where: {
      id,
      garage: {
        ownerId: session.user.id,
        actif: true,
      },
    },
  })

  if (!vehicule) {
    return NextResponse.json({ error: 'Vehicule introuvable ou non autorise' }, { status: 404 })
  }

  const updated = await prisma.vehicule.update({
    where: { id: vehicule.id },
    data: {
      immatriculation: parsed.data.immatriculation || null,
      clientNom: parsed.data.clientNom,
      clientPrenom: parsed.data.clientPrenom || null,
    },
  })

  return NextResponse.json({ success: true, vehicule: updated })
}
