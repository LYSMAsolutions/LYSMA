import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAuthorized(req: NextRequest) {
  const apiKey = req.headers.get('x-internal-api-key')
  return Boolean(process.env.INTERNAL_API_KEY) && apiKey === process.env.INTERNAL_API_KEY
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const absences = await prisma.absence.findMany({
    where: {
      deletedAt: {
        not: null,
      },
    },
    orderBy: {
      deletedAt: 'desc',
    },
    take: 100,
    include: {
      compagnon: {
        include: {
          garage: true,
        },
      },
    },
  })

  return NextResponse.json({
    items: absences.map((absence) => ({
      id: absence.id,
      type: 'absence',
      outil: 'livo-app',
      label: `${absence.type} - ${absence.compagnon.prenom} ${absence.compagnon.nom}`,
      garageId: absence.compagnon.garageId,
      garageNom: absence.compagnon.garage.nom,
      deletedAt: absence.deletedAt?.toISOString() ?? null,
      deletedBy: absence.deletedBy,
      data: absence,
    })),
  })
}
