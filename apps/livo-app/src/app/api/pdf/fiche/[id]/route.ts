import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { renderToStream } from '@react-pdf/renderer'
import { FichePDF } from '@/lib/pdf/FichePDF'
import { barcodeSVGToDataURL } from '@/lib/barcode'
import React from 'react'
import path from 'path'
import fs from 'fs'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id } = await params

  const fiche = await prisma.ficheTravaux.findFirst({
    where: {
      id,
      garage: {
        ownerId: session.user.id,
      },
    },
    include: {
      vehicule: true,
      garage: true,
      pointagesFiche: {
        include: {
          compagnon: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          debutAt: 'asc',
        },
      },
    },
  })

  if (!fiche) {
    return NextResponse.json(
      { error: 'Fiche introuvable ou non autorisée' },
      { status: 404 }
    )
  }

  const logoPath = path.join(process.cwd(), 'public/logo/livo-app-pdf.png')

  const logoSrc = fs.existsSync(logoPath)
    ? `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`
    : undefined

  const barcodeSrc = barcodeSVGToDataURL(fiche.numero, 40)

  const stream = await renderToStream(
    React.createElement(FichePDF as any, {
      fiche: {
        ...fiche,
        tempsFacture: fiche.tempsFacture ? Number(fiche.tempsFacture) : null,
        tempsReel: fiche.tempsReel ? Number(fiche.tempsReel) : null,
        montantHT: fiche.montantHT ? Number(fiche.montantHT) : null,
        pointagesFiche: fiche.pointagesFiche.map((pf) => ({
          compagnon: {
            prenom: pf.compagnon.user?.prenom ?? pf.compagnon.prenom,
            nom: pf.compagnon.user?.nom ?? pf.compagnon.nom,
            poste: pf.compagnon.poste,
          },
          dureeMinutes: pf.dureeMinutes,
          debutAt: pf.debutAt,
          finAt: pf.finAt,
        })),
      },
      garage: {
        nom: fiche.garage.nom,
        adresse: fiche.garage.adresse,
        codePostal: fiche.garage.codePostal,
        ville: fiche.garage.ville,
        telephone: fiche.garage.telephone,
        email: fiche.garage.email,
        siret: fiche.garage.siret,
      },
      logoSrc,
      barcodeSrc,
    }) as any
  )

  const chunks: Buffer[] = []

  for await (const chunk of stream as any) {
    chunks.push(Buffer.from(chunk))
  }

  const buffer = Buffer.concat(chunks)

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fiche.numero}.pdf"`,
    },
  })
}