import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { cookies } from 'next/headers'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }

  const { email, password } = parsed.data

  const owner = await prisma.user.findUnique({
    where: {
      email,
      actif: true,
    },
    include: {
      garages: {
        where: {
          actif: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: 1,
      },
    },
  })

  if (!owner || (!owner.emailVerified && !owner.emailVerifiedAt) || !owner.garages[0]) {
    return NextResponse.json(
      { error: 'Email ou mot de passe incorrect' },
      { status: 401 }
    )
  }

  const garage = owner.garages[0]

  if (!garage.passwordAtelier) {
    return NextResponse.json(
      { error: 'Accès atelier non configuré' },
      { status: 401 }
    )
  }

  const valid = await bcrypt.compare(password, garage.passwordAtelier)

  if (!valid) {
    return NextResponse.json(
      { error: 'Email ou mot de passe incorrect' },
      { status: 401 }
    )
  }

  const cookieStore = await cookies()

  cookieStore.set('atelier-garage-id', garage.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 12,
    path: '/',
  })

  cookieStore.delete('atelier-compagnon-id')

  return NextResponse.json({
    success: true,
    garageId: garage.id,
    garageNom: garage.nom,
  })
}
