import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireSecureSession } from '@/lib/security/secure-session'
import { getPrimaryGarageForUser } from '@/lib/garage'

const schema = z.object({
  nomLogiciel: z.string().trim().min(1, 'Nom du logiciel requis').max(120),
  nomEditeur: z.string().trim().max(160).optional().nullable(),
  contactEditeur: z.string().trim().email('Email de contact éditeur invalide').max(200),
  identifiantGarage: z.string().trim().min(1, 'Identifiant garage requis').max(120),
  message: z.string().trim().max(2000).optional().nullable(),
})

export async function POST(req: NextRequest) {
  const { session, response } = await requireSecureSession()
  if (response) return response

  const garage = await getPrimaryGarageForUser(session.user.id)
  if (!garage) return NextResponse.json({ error: 'Garage introuvable.' }, { status: 404 })

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { nomLogiciel, nomEditeur, contactEditeur, identifiantGarage, message } = parsed.data

  const existing = await prisma.demandeIntegration.findUnique({
    where: { garageId_nomLogiciel: { garageId: garage.id, nomLogiciel } },
  })

  if (existing) {
    if (existing.statut === 'REFUSEE') {
      return NextResponse.json({ error: 'Cette demande a déjà été refusée. Contactez le support pour plus d\'informations.' }, { status: 409 })
    }
    return NextResponse.json({
      error: 'Une demande pour ce logiciel est déjà en cours.',
      statut: existing.statut,
    }, { status: 409 })
  }

  const demande = await prisma.demandeIntegration.create({
    data: {
      garageId: garage.id,
      nomLogiciel,
      nomEditeur: nomEditeur || null,
      contactEditeur,
      identifiantGarage,
      message: message || null,
    },
  })

  return NextResponse.json({ success: true, demande }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const { session, response } = await requireSecureSession()
  if (response) return response

  const garage = await getPrimaryGarageForUser(session.user.id)
  if (!garage) return NextResponse.json({ error: 'Garage introuvable.' }, { status: 404 })

  const demandes = await prisma.demandeIntegration.findMany({
    where: { garageId: garage.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ demandes })
}
