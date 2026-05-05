import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  tempsFacture: z.number().min(0),
  tauxApplique: z.enum(['T1', 'T2', 'T3', 'T4', 'CARROSSERIE', 'PEINTURE', 'AUTRE']),
  montantHT: z.number().min(0).optional(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { tempsFacture, tauxApplique, montantHT } = parsed.data

  const fiche = await prisma.ficheTravaux.findFirst({
    where: {
      id,
      garage: {
        ownerId: session.user.id,
      },
    },
    include: {
      garage: {
        include: {
          taux: true,
        },
      },
    },
  })

  if (!fiche) {
    return NextResponse.json({ error: 'Fiche introuvable ou non autorisée' }, { status: 404 })
  }

  const tauxGarage = fiche.garage.taux.find((t) => t.type === tauxApplique && t.actif)
  const tauxMontant = tauxGarage ? Number(tauxGarage.montant) : 65
  const montantCalcule = montantHT ?? tempsFacture * tauxMontant

  const updated = await prisma.ficheTravaux.update({
    where: {
      id: fiche.id,
    },
    data: {
      statut: 'CLOTUREE',
      tempsFacture,
      tauxApplique,
      montantHT: montantCalcule,
      dateFermeture: new Date(),
    },
  })

  return NextResponse.json({ success: true, fiche: updated })
}