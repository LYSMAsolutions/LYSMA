import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const garageIdFromCookie = cookieStore.get('atelier-garage-id')?.value
  const garageIdFromQuery = new URL(req.url).searchParams.get('garageId')

  const garageId = garageIdFromCookie ?? garageIdFromQuery

  if (!garageId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const garage = await prisma.garage.findFirst({
    where: {
      id: garageId,
      actif: true,
    },
  })

  if (!garage) {
    return NextResponse.json({ error: 'Garage introuvable' }, { status: 404 })
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

  return NextResponse.json({
    compagnons: compagnons.map((compagnon) => ({
      id: compagnon.id,
      prenom: compagnon.user?.prenom ?? compagnon.prenom,
      nom: compagnon.user?.nom ?? compagnon.nom,
      poste: compagnon.poste,
      hasPin: Boolean(compagnon.pin),
    })),
  })
}