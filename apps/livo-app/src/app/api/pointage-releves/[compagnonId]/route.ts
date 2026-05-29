import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireSecureSession } from '@/lib/security/secure-session'

const querySchema = z.object({
  mois: z.coerce.number().int().min(1).max(12),
  annee: z.coerce.number().int().min(2000).max(2100),
})

const postSchema = z.object({
  mois: z.number().int().min(1).max(12),
  annee: z.number().int().min(2000).max(2100),
  action: z.enum(['VALIDER', 'CONTESTER', 'A_VERIFIER']),
  motif: z.string().trim().min(8, 'Un motif clair est obligatoire.').max(1000),
})

function reviewStatus(action: z.infer<typeof postSchema>['action']) {
  if (action === 'VALIDER') return 'VALIDE'
  if (action === 'CONTESTER') return 'CONTESTE'
  return 'A_VERIFIER'
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ compagnonId: string }> }
) {
  const { session, response } = await requireSecureSession()
  if (response) return response

  const { compagnonId } = await params
  const parsed = querySchema.safeParse(Object.fromEntries(new URL(req.url).searchParams))
  if (!parsed.success) return NextResponse.json({ error: 'Période invalide.' }, { status: 400 })

  const compagnon = await prisma.compagnon.findFirst({
    where: {
      id: compagnonId,
      garage: { ownerId: session.user.id },
    },
    select: {
      id: true,
      garageId: true,
    },
  })

  if (!compagnon) {
    return NextResponse.json({ error: 'Compagnon introuvable ou non autorisé.' }, { status: 404 })
  }

  const review = await prisma.pointageMonthlyReview.findUnique({
    where: {
      compagnonId_mois_annee: {
        compagnonId,
        mois: parsed.data.mois,
        annee: parsed.data.annee,
      },
    },
    include: {
      validatedBy: {
        select: {
          prenom: true,
          nom: true,
          email: true,
        },
      },
    },
  })

  const logs = await prisma.pointageAuditLog.findMany({
    where: {
      compagnonId,
      garageId: compagnon.garageId,
      createdAt: {
        gte: new Date(parsed.data.annee, parsed.data.mois - 1, 1),
        lt: new Date(parsed.data.annee, parsed.data.mois, 1),
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      user: {
        select: {
          prenom: true,
          nom: true,
          email: true,
        },
      },
    },
  })

  return NextResponse.json({
    review,
    logs,
  })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ compagnonId: string }> }
) {
  const { session, response } = await requireSecureSession()
  if (response) return response

  const { compagnonId } = await params
  const parsed = postSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const compagnon = await prisma.compagnon.findFirst({
    where: {
      id: compagnonId,
      garage: { ownerId: session.user.id },
    },
    select: {
      id: true,
      garageId: true,
    },
  })

  if (!compagnon) {
    return NextResponse.json({ error: 'Compagnon introuvable ou non autorisé.' }, { status: 404 })
  }

  const status = reviewStatus(parsed.data.action)
  const now = new Date()
  const previous = await prisma.pointageMonthlyReview.findUnique({
    where: {
      compagnonId_mois_annee: {
        compagnonId,
        mois: parsed.data.mois,
        annee: parsed.data.annee,
      },
    },
  })

  const review = await prisma.$transaction(async (tx) => {
    const updated = await tx.pointageMonthlyReview.upsert({
      where: {
        compagnonId_mois_annee: {
          compagnonId,
          mois: parsed.data.mois,
          annee: parsed.data.annee,
        },
      },
      create: {
        compagnonId,
        garageId: compagnon.garageId,
        mois: parsed.data.mois,
        annee: parsed.data.annee,
        status,
        notes: parsed.data.motif,
        validatedAt: status === 'VALIDE' ? now : null,
        contestedAt: status === 'CONTESTE' ? now : null,
        validatedById: status === 'VALIDE' ? session.user.id : null,
      },
      update: {
        status,
        notes: parsed.data.motif,
        validatedAt: status === 'VALIDE' ? now : null,
        contestedAt: status === 'CONTESTE' ? now : null,
        validatedById: status === 'VALIDE' ? session.user.id : null,
      },
    })

    await tx.pointageAuditLog.create({
      data: {
        garageId: compagnon.garageId,
        compagnonId,
        userId: session.user.id,
        action: status === 'VALIDE' ? 'VALIDATION' : status === 'CONTESTE' ? 'CONTESTATION' : 'CORRECTION',
        targetType: 'POINTAGE_MONTHLY_REVIEW',
        targetId: updated.id,
        field: 'status',
        ...(previous ? { oldValue: { status: previous.status } } : {}),
        newValue: { status },
        motif: parsed.data.motif,
        ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
        userAgent: req.headers.get('user-agent'),
      },
    })

    return updated
  })

  return NextResponse.json({ success: true, review })
}
