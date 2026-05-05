import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const garageId = cookieStore.get('atelier-garage-id')?.value
  const compagnonId = cookieStore.get('atelier-compagnon-id')?.value

  if (!garageId) {
    return NextResponse.json({ error: 'Session atelier expirée' }, { status: 401 })
  }

  if (!compagnonId) {
    return NextResponse.json({ error: 'Compagnon non identifié' }, { status: 401 })
  }

  const compagnon = await prisma.compagnon.findFirst({
    where: {
      id: compagnonId,
      garageId,
      actif: true,
    },
  })

  if (!compagnon) {
    return NextResponse.json({ error: 'Compagnon introuvable' }, { status: 404 })
  }

  const q = new URL(req.url).searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ fiche: null })
  }

  const fiche = await prisma.ficheTravaux.findFirst({
    where: {
      garageId,
      OR: [
        {
          numero: {
            contains: q,
            mode: 'insensitive',
          },
        },
        {
          vehicule: {
            immatriculation: {
              contains: q,
              mode: 'insensitive',
            },
          },
        },
      ],
      statut: {
        in: ['EN_ATTENTE', 'EN_COURS', 'EN_PAUSE', 'TERMINEE'],
      },
    },
    include: {
      vehicule: true,
      pointagesFiche: {
        where: {
          statut: {
            in: ['EN_COURS', 'EN_PAUSE'],
          },
        },
        include: {
          compagnon: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  })

  if (!fiche) {
    return NextResponse.json({ fiche: null })
  }

  return NextResponse.json({
    fiche: {
      id: fiche.id,
      numero: fiche.numero,
      statut: fiche.statut,
      travaux: fiche.travaux,
      vehicule: `${fiche.vehicule.marque} ${fiche.vehicule.modele}`,
      immat: fiche.vehicule.immatriculation,
      clientNom: fiche.vehicule.clientNom,
      pointagesActifs: fiche.pointagesFiche.map((pointage) => ({
        compagnonId: pointage.compagnonId,
        compagnonNom: `${pointage.compagnon.user?.prenom ?? pointage.compagnon.prenom} ${pointage.compagnon.user?.nom ?? pointage.compagnon.nom}`,
        debutAt: pointage.debutAt.toISOString(),
      })),
    },
  })
}