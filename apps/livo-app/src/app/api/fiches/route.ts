import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireSecureSession } from '@/lib/security/secure-session'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

const schema = z.object({
  garageId: z.string().min(1),
  vehiculeId: z.string().optional(),
  vehicule: z.object({
    immatriculation: z.string().optional(),
    marque: z.string().min(1),
    modele: z.string().min(1),
    annee: z.number().optional(),
    vin: z.string().optional(),
    clientNom: z.string().min(1),
    clientPrenom: z.string().optional(),
    clientTel: z.string().optional(),
    clientEmail: z.string().email().optional().or(z.literal('')),
  }).optional(),
  travaux: z.string().min(1),
  notes: z.string().optional(),
})

async function getOwnedGarage(garageId: string, userId: string) {
  return prisma.garage.findFirst({
    where: { id: garageId, ownerId: userId, actif: true },
  })
}

async function generateFicheNumero(garageId: string) {
  const annee = new Date().getFullYear()
  const derniereFiche = await prisma.ficheTravaux.findFirst({
    where: { garageId, numero: { startsWith: `FT-${annee}-` } },
    orderBy: { numero: 'desc' },
  })
  const dernierNumero = derniereFiche?.numero.split('-').pop()
  const nextNum = dernierNumero ? Number.parseInt(dernierNumero, 10) + 1 : 1
  return `FT-${annee}-${String(nextNum).padStart(3, '0')}`
}

export async function POST(req: NextRequest) {
  const { session, response } = await requireSecureSession()
  if (response) return response

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { garageId, vehiculeId, vehicule, travaux, notes } = parsed.data
  const garage = await getOwnedGarage(garageId, session.user.id)
  if (!garage) return NextResponse.json({ error: 'Garage introuvable ou non autorise' }, { status: 403 })

  let finalVehiculeId = vehiculeId
  if (finalVehiculeId) {
    const existingVehicule = await prisma.vehicule.findFirst({
      where: { id: finalVehiculeId, garageId },
    })
    if (!existingVehicule) {
      return NextResponse.json({ error: 'Vehicule introuvable ou non autorise' }, { status: 404 })
    }
  }

  if (!finalVehiculeId && vehicule) {
    const newVehicule = await prisma.vehicule.create({
      data: { garageId, ...vehicule },
    })
    finalVehiculeId = newVehicule.id
  }

  if (!finalVehiculeId) return NextResponse.json({ error: 'Vehicule requis' }, { status: 400 })

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const numero = await generateFicheNumero(garageId)
      const fiche = await prisma.ficheTravaux.create({
        data: {
          garageId,
          vehiculeId: finalVehiculeId,
          numero,
          travaux,
          notes,
          statut: 'EN_ATTENTE',
        },
        include: { vehicule: true },
      })
      return NextResponse.json({ success: true, fiche })
    } catch (error) {
      const numeroCollision =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'

      if (!numeroCollision || attempt === 2) {
        return NextResponse.json({ error: 'Impossible de créer la fiche travaux' }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ error: 'Impossible de créer la fiche travaux' }, { status: 500 })
}

export async function GET(req: NextRequest) {
  const { session, response } = await requireSecureSession()
  if (response) return response

  const { searchParams } = new URL(req.url)
  const garageId = searchParams.get('garageId')
  const q = searchParams.get('q') ?? ''
  if (!garageId) return NextResponse.json({ error: 'garageId requis' }, { status: 400 })

  const garage = await getOwnedGarage(garageId, session.user.id)
  if (!garage) return NextResponse.json({ error: 'Garage introuvable ou non autorise' }, { status: 403 })

  const vehicules = await prisma.vehicule.findMany({
    where: {
      garageId,
      OR: [
        { immatriculation: { contains: q, mode: 'insensitive' } },
        { marque: { contains: q, mode: 'insensitive' } },
        { modele: { contains: q, mode: 'insensitive' } },
        { clientNom: { contains: q, mode: 'insensitive' } },
      ],
    },
    orderBy: { updatedAt: 'desc' },
    take: 8,
  })

  return NextResponse.json({ vehicules })
}
