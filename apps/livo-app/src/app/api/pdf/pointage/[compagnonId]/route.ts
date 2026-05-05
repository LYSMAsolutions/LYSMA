import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { renderToStream } from '@react-pdf/renderer'
import { PointagePDF } from '@/lib/pdf/PointagePDF'
import React from 'react'
import path from 'path'
import fs from 'fs'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ compagnonId: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { compagnonId } = await params
  const { searchParams } = new URL(req.url)

  const mois = Number.parseInt(
    searchParams.get('mois') ?? String(new Date().getMonth() + 1),
    10
  )

  const annee = Number.parseInt(
    searchParams.get('annee') ?? String(new Date().getFullYear()),
    10
  )

  if (
    Number.isNaN(mois) ||
    Number.isNaN(annee) ||
    mois < 1 ||
    mois > 12 ||
    annee < 2000 ||
    annee > 2100
  ) {
    return NextResponse.json({ error: 'Période invalide' }, { status: 400 })
  }

  const debut = new Date(annee, mois - 1, 1)
  const fin = new Date(annee, mois, 0, 23, 59, 59, 999)

  const compagnon = await prisma.compagnon.findFirst({
    where: {
      id: compagnonId,
      garage: {
        ownerId: session.user.id,
      },
    },
    include: {
      user: true,
      garage: true,
      pointagesJour: {
        where: {
          date: {
            gte: debut,
            lte: fin,
          },
        },
        orderBy: {
          date: 'asc',
        },
      },
    },
  })

  if (!compagnon) {
    return NextResponse.json(
      { error: 'Compagnon introuvable ou non autorisé' },
      { status: 404 }
    )
  }

  const logoPath = path.join(process.cwd(), 'public/logo/livo-app-pdf.png')

  const logoSrc = fs.existsSync(logoPath)
    ? `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`
    : undefined

  const stream = await renderToStream(
    React.createElement(PointagePDF as any, {
      compagnon: {
        prenom: compagnon.user?.prenom ?? compagnon.prenom,
        nom: compagnon.user?.nom ?? compagnon.nom,
        poste: compagnon.poste,
        matricule: compagnon.matricule,
        heuresContrat: Number(compagnon.heuresContrat),
      },
      garage: {
        nom: compagnon.garage.nom,
        adresse: compagnon.garage.adresse,
        codePostal: compagnon.garage.codePostal,
        ville: compagnon.garage.ville,
        telephone: compagnon.garage.telephone,
        email: compagnon.garage.email,
        siret: compagnon.garage.siret,
      },
      pointages: compagnon.pointagesJour,
      mois,
      annee,
      logoSrc,
    }) as any
  )

  const chunks: Buffer[] = []

  for await (const chunk of stream as any) {
    chunks.push(Buffer.from(chunk))
  }

  const buffer = Buffer.concat(chunks)

  const nomFichier = `Pointage_${compagnon.user?.nom ?? compagnon.nom}_${String(mois).padStart(2, '0')}_${annee}.pdf`

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${nomFichier}"`,
    },
  })
}