import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { z } from 'zod'

const schema = z.object({
  compagnonId: z.string().min(1),
  pin: z.string().regex(/^\d{4}$/),
})

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const garageId = cookieStore.get('atelier-garage-id')?.value

  if (!garageId) {
    return NextResponse.json({ error: 'Session atelier expirée' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }

  const { compagnonId, pin } = parsed.data

  const garage = await prisma.garage.findFirst({
    where: {
      id: garageId,
      actif: true,
    },
  })

  if (!garage) {
    return NextResponse.json({ error: 'Garage introuvable' }, { status: 404 })
  }

  const compagnon = await prisma.compagnon.findFirst({
    where: {
      id: compagnonId,
      garageId,
      actif: true,
    },
    include: {
      user: true,
    },
  })

  if (!compagnon) {
    return NextResponse.json({ error: 'Compagnon introuvable' }, { status: 404 })
  }

  if (!compagnon.pin) {
    return NextResponse.json({ error: 'PIN non configuré' }, { status: 401 })
  }

  const valid = await bcrypt.compare(pin, compagnon.pin)

  if (!valid) {
    return NextResponse.json({ error: 'PIN incorrect' }, { status: 401 })
  }

  cookieStore.set('atelier-compagnon-id', compagnon.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 12,
    path: '/',
  })

  return NextResponse.json({
    success: true,
    compagnon: {
      id: compagnon.id,
      prenom: compagnon.user?.prenom ?? compagnon.prenom,
      nom: compagnon.user?.nom ?? compagnon.nom,
      poste: compagnon.poste,
    },
  })
}