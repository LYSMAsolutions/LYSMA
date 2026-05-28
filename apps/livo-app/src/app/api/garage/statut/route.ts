import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireSecureSession } from '@/lib/security/secure-session'
import { z } from 'zod'

const schema = z.object({
  garageId: z.string().min(1),
  statut: z.enum(['OUVERT', 'FERME', 'PAUSE']),
})

export async function POST(req: NextRequest) {
  const { session, response } = await requireSecureSession()
  if (response) return response

  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { garageId, statut } = parsed.data

  const garage = await prisma.garage.findFirst({
    where: {
      id: garageId,
      ownerId: session.user.id,
      actif: true,
    },
  })

  if (!garage) {
    return NextResponse.json(
      { error: 'Garage introuvable ou non autorisé' },
      { status: 403 }
    )
  }

  const updatedGarage = await prisma.garage.update({
    where: {
      id: garage.id,
    },
    data: {
      statutJour: statut,
    },
  })

  return NextResponse.json({
    success: true,
    garage: updatedGarage,
  })
}
