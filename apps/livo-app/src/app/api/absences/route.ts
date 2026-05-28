import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireSecureSession } from '@/lib/security/secure-session'
import { z } from 'zod'

const createSchema = z.object({
  compagnonId: z.string().min(1),
  type: z.enum(['CONGE_PAYE', 'RTT', 'ARRET_MALADIE', 'FORMATION', 'CONGE_SANS_SOLDE', 'AUTRE']),
  dateDebut: z.string().min(1),
  dateFin: z.string().min(1),
  notes: z.string().optional(),
})

const patchSchema = z.object({
  id: z.string().min(1),
  approuve: z.boolean(),
})

const deleteSchema = z.object({
  id: z.string().min(1),
})

function countBusinessDays(debut: Date, fin: Date) {
  let nbJours = 0
  const current = new Date(debut)

  while (current <= fin) {
    const day = current.getDay()

    if (day !== 0 && day !== 6) {
      nbJours++
    }

    current.setDate(current.getDate() + 1)
  }

  return nbJours
}

export async function POST(req: NextRequest) {
  const { session, response } = await requireSecureSession()
  if (response) return response

  const body = await req.json()
  const parsed = createSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { compagnonId, type, dateDebut, dateFin, notes } = parsed.data

  const compagnon = await prisma.compagnon.findFirst({
    where: {
      id: compagnonId,
      garage: {
        ownerId: session.user.id,
      },
    },
  })

  if (!compagnon) {
    return NextResponse.json({ error: 'Compagnon introuvable ou non autorisé' }, { status: 404 })
  }

  const debut = new Date(dateDebut)
  const fin = new Date(dateFin)

  if (Number.isNaN(debut.getTime()) || Number.isNaN(fin.getTime())) {
    return NextResponse.json({ error: 'Dates invalides' }, { status: 400 })
  }

  if (fin < debut) {
    return NextResponse.json({ error: 'La date de fin doit être après la date de début' }, { status: 400 })
  }

  const nbJours = countBusinessDays(debut, fin)

  const absence = await prisma.absence.create({
    data: {
      compagnonId,
      type,
      dateDebut: debut,
      dateFin: fin,
      nbJours,
      notes,
      approuve: false,
    },
    include: {
      compagnon: {
        include: {
          user: true,
        },
      },
    },
  })

  return NextResponse.json({ success: true, absence })
}

export async function PATCH(req: NextRequest) {
  const { session, response } = await requireSecureSession()
  if (response) return response

  const body = await req.json()
  const parsed = patchSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { id, approuve } = parsed.data

  const absence = await prisma.absence.findFirst({
    where: {
      id,
      deletedAt: null,
      compagnon: {
        garage: {
          ownerId: session.user.id,
        },
      },
    },
  })

  if (!absence) {
    return NextResponse.json({ error: 'Absence introuvable ou non autorisée' }, { status: 404 })
  }

  const updated = await prisma.absence.update({
    where: {
      id: absence.id,
    },
    data: {
      approuve,
    },
  })

  return NextResponse.json({ success: true, absence: updated })
}

export async function DELETE(req: NextRequest) {
  const { session, response } = await requireSecureSession()
  if (response) return response

  const body = await req.json()
  const parsed = deleteSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { id } = parsed.data

  const absence = await prisma.absence.findFirst({
    where: {
      id,
      deletedAt: null,
      compagnon: {
        garage: {
          ownerId: session.user.id,
        },
      },
    },
  })

  if (!absence) {
    return NextResponse.json({ error: 'Absence introuvable ou non autorisée' }, { status: 404 })
  }

  await prisma.absence.update({
    where: {
      id: absence.id,
    },
    data: {
      deletedAt: new Date(),
      deletedBy: session.user.id,
    },
  })

  return NextResponse.json({ success: true })
}
