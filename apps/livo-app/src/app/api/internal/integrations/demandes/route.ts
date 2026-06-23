import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isInternalApiAuthorized } from '@/lib/security/internal-api'

export async function GET(req: NextRequest) {
  if (!isInternalApiAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const statut = new URL(req.url).searchParams.get('statut')

  const demandes = await prisma.demandeIntegration.findMany({
    where: statut ? { statut: statut as 'EN_ATTENTE' | 'APPROUVEE' | 'REFUSEE' } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      garage: {
        select: {
          id: true,
          nom: true,
          ville: true,
          telephone: true,
          email: true,
          owner: { select: { nom: true, prenom: true, email: true } },
        },
      },
    },
  })

  return NextResponse.json({
    demandes: demandes.map((d) => ({
      id: d.id,
      nomLogiciel: d.nomLogiciel,
      nomEditeur: d.nomEditeur,
      contactEditeur: d.contactEditeur,
      identifiantGarage: d.identifiantGarage,
      message: d.message,
      statut: d.statut,
      noteAdmin: d.noteAdmin,
      createdAt: d.createdAt.toISOString(),
      garage: d.garage,
    })),
  })
}
