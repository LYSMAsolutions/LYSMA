import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireSecureSession } from '@/lib/security/secure-session'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const schema = z.object({
  garageId: z.string().min(1),
  prenom: z.string().min(1),
  nom: z.string().min(1),
  poste: z.string().optional(),
  heuresContrat: z.number().min(1).max(48).default(35),
  matricule: z.string().optional(),
  dateEntree: z.string().optional(),
  telephone: z.string().optional(),
  pin: z.string().regex(/^\d{4}$/).optional(),
})

export async function POST(req: NextRequest) {
  const { session, response } = await requireSecureSession()
  if (response) return response

  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const {
    garageId,
    prenom,
    nom,
    poste,
    heuresContrat,
    matricule,
    dateEntree,
    pin,
  } = parsed.data

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

  const pinHash = pin ? await bcrypt.hash(pin, 10) : null

  const compagnon = await prisma.compagnon.create({
    data: {
      garageId,
      prenom,
      nom,
      poste: poste ?? 'Mécanicien',
      heuresContrat,
      matricule,
      dateEntree: dateEntree ? new Date(dateEntree) : new Date(),
      actif: true,
      pin: pinHash,
    },
  })

  return NextResponse.json({ success: true, compagnon })
}

export async function GET(req: NextRequest) {
  const { session, response } = await requireSecureSession()
  if (response) return response

  const { searchParams } = new URL(req.url)
  const garageId = searchParams.get('garageId')

  if (!garageId) {
    return NextResponse.json({ error: 'garageId requis' }, { status: 400 })
  }

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

  const compagnons = await prisma.compagnon.findMany({
    where: {
      garageId,
      actif: true,
    },
    include: {
      user: true,
    },
    orderBy: [
      { prenom: 'asc' },
      { nom: 'asc' },
    ],
  })

  return NextResponse.json({ compagnons })
}
