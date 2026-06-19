import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { parseFicheQrPayload } from '@/lib/work-order-qr'

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const garageId = cookieStore.get('atelier-garage-id')?.value
  const compagnonId = cookieStore.get('atelier-compagnon-id')?.value

  if (!garageId) return NextResponse.json({ error: 'Session atelier expirée.' }, { status: 401 })
  if (!compagnonId) return NextResponse.json({ error: 'Compagnon non identifié.' }, { status: 401 })

  const compagnon = await prisma.compagnon.findFirst({
    where: { id: compagnonId, garageId, actif: true },
    select: { id: true },
  })
  if (!compagnon) return NextResponse.json({ error: 'Compagnon introuvable.' }, { status: 404 })

  const url = new URL(req.url)
  const query = url.searchParams.get('q')?.trim()
  const qrPayload = url.searchParams.get('qr')?.trim()

  if (!qrPayload && (!query || query.length < 2)) {
    return NextResponse.json({ fiche: null })
  }

  let qrFormat: 'CURRENT' | 'LEGACY' | null = null
  let whereIdentity: { scanToken: string } | { numero: string } | null = null

  if (qrPayload) {
    const qr = parseFicheQrPayload(qrPayload)
    if (!qr.success) return NextResponse.json({ error: qr.error }, { status: 400 })
    qrFormat = qr.format
    whereIdentity = qr.format === 'CURRENT'
      ? { scanToken: qr.token }
      : { numero: qr.externalNumber }
  }

  const fiche = await prisma.ficheTravaux.findFirst({
    where: {
      garageId,
      ...(whereIdentity
        ? whereIdentity
        : {
            OR: [
              { numero: { contains: query, mode: 'insensitive' } },
              { vehicule: { immatriculation: { contains: query, mode: 'insensitive' } } },
            ],
          }),
      statut: { in: ['EN_ATTENTE', 'EN_COURS', 'EN_PAUSE', 'TERMINEE'] },
    },
    include: {
      vehicule: true,
      pointagesFiche: {
        where: { statut: { in: ['EN_COURS', 'EN_PAUSE'] } },
        include: { compagnon: { include: { user: true } } },
      },
    },
  })

  if (!fiche) {
    return NextResponse.json({
      fiche: null,
      ...(qrPayload ? { error: 'Fiche introuvable.' } : {}),
    }, { status: qrPayload ? 404 : 200 })
  }

  return NextResponse.json({
    message: 'Fiche trouvée.',
    qrFormat,
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
