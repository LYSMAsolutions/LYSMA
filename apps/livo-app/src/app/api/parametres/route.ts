import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const garageSchema = z.object({
  nom: z.string().min(1),
  adresse: z.string().optional(),
  codePostal: z.string().optional(),
  ville: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  siret: z.string().optional(),
})

const tauxSchema = z.object({
  taux: z.array(
    z.object({
      id: z.string().optional(),
      type: z.enum(['T1', 'T2', 'T3', 'T4', 'CARROSSERIE', 'PEINTURE', 'AUTRE']),
      libelle: z.string().min(1),
      montant: z.number().min(0),
      actif: z.boolean(),
    })
  ),
})

const putSchema = z.object({
  garageId: z.string().min(1),
  type: z.enum(['password-atelier', 'pin-compagnon']),
  data: z.record(z.any()),
})

async function assertOwnedGarage(garageId: string, userId: string) {
  return prisma.garage.findFirst({
    where: {
      id: garageId,
      ownerId: userId,
    },
  })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await req.json()
  const { garageId, type } = body

  if (!garageId) {
    return NextResponse.json({ error: 'garageId requis' }, { status: 400 })
  }

  const garage = await assertOwnedGarage(garageId, session.user.id)

  if (!garage) {
    return NextResponse.json({ error: 'Garage introuvable ou non autorisé' }, { status: 403 })
  }

  if (type === 'garage') {
    const parsed = garageSchema.safeParse(body.data)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const updatedGarage = await prisma.garage.update({
      where: {
        id: garageId,
      },
      data: parsed.data,
    })

    return NextResponse.json({ success: true, garage: updatedGarage })
  }

  if (type === 'taux') {
    const parsed = tauxSchema.safeParse(body.data)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const results = await Promise.all(
      parsed.data.taux.map((t) =>
        prisma.tauxGarage.upsert({
          where: {
            garageId_type: {
              garageId,
              type: t.type,
            },
          },
          create: {
            garageId,
            type: t.type,
            libelle: t.libelle,
            montant: t.montant,
            actif: t.actif,
          },
          update: {
            libelle: t.libelle,
            montant: t.montant,
            actif: t.actif,
          },
        })
      )
    )

    return NextResponse.json({ success: true, taux: results })
  }

  return NextResponse.json({ error: 'type inconnu' }, { status: 400 })
}

export async function PUT(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = putSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { garageId, type, data } = parsed.data

  const garage = await assertOwnedGarage(garageId, session.user.id)

  if (!garage) {
    return NextResponse.json({ error: 'Garage introuvable ou non autorisé' }, { status: 403 })
  }

  if (type === 'password-atelier') {
    const password = String(data.password ?? '')

    if (password.length < 8) {
      return NextResponse.json({ error: 'Mot de passe atelier trop court, minimum 8 caractères' }, { status: 400 })
    }

    const bcrypt = await import('bcryptjs')
    const hash = await bcrypt.default.hash(password, 12)

    await prisma.garage.update({
      where: {
        id: garageId,
      },
      data: {
        passwordAtelier: hash,
      },
    })

    return NextResponse.json({ success: true })
  }

  if (type === 'pin-compagnon') {
    const compagnonId = String(data.compagnonId ?? '')
    const pin = String(data.pin ?? '')

    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json({ error: 'Le PIN doit contenir exactement 4 chiffres' }, { status: 400 })
    }

    const compagnon = await prisma.compagnon.findFirst({
      where: {
        id: compagnonId,
        garageId,
      },
    })

    if (!compagnon) {
      return NextResponse.json({ error: 'Compagnon introuvable ou non autorisé' }, { status: 404 })
    }

    const bcrypt = await import('bcryptjs')
    const hash = await bcrypt.default.hash(pin, 10)

    await prisma.compagnon.update({
      where: {
        id: compagnon.id,
      },
      data: {
        pin: hash,
      },
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'type inconnu' }, { status: 400 })
}