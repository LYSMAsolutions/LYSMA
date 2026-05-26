import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const expenseSchema = z.object({
  name: z.string().min(1),
  provider: z.string().min(1),
  category: z.enum(['HEBERGEMENT', 'DOMAINE', 'IA', 'COMPTABILITE', 'PAIEMENT', 'LOGICIEL', 'API', 'MATERIEL', 'AUTRE']),
  relatedTool: z.enum(['GLOBAL', 'LIVO', 'PMA', 'TRANSPORT', 'SITE_VITRINE', 'AUTRE']),
  amountHT: z.coerce.number().min(0),
  vatAmount: z.coerce.number().min(0),
  amountTTC: z.coerce.number().min(0),
  frequency: z.enum(['MENSUEL', 'ANNUEL', 'PONCTUEL']),
  startDate: z.coerce.date(),
  renewalDate: z.union([z.coerce.date(), z.literal(''), z.null()]).optional(),
  paymentMethod: z.string().optional(),
  status: z.enum(['ACTIF', 'ARRETE', 'A_VERIFIER']),
  notes: z.string().optional(),
})

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: Request, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorise' }, { status: 401 })

  const { id } = await params
  const before = await prisma.lysmaExpense.findUnique({ where: { id } })
  if (!before) return NextResponse.json({ error: 'Charge introuvable' }, { status: 404 })

  const body = await req.json()
  const data = expenseSchema.parse(body)
  const expense = await prisma.lysmaExpense.update({
    where: { id },
    data: {
      ...data,
      renewalDate: data.renewalDate instanceof Date ? data.renewalDate : null,
      paymentMethod: data.paymentMethod || null,
      notes: data.notes || null,
    },
  })

  await prisma.auditLog.create({
    data: {
      outil: 'super-admin',
      cibleType: 'finance_expense',
      cibleId: id,
      action: 'finance.expense.update',
      acteurEmail: session.user?.email ?? null,
      resume: `${expense.provider} / ${expense.name}`,
      avant: before as any,
      apres: expense as any,
    },
  })

  return NextResponse.json({ expense })
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorise' }, { status: 401 })

  const { id } = await params
  const before = await prisma.lysmaExpense.findUnique({ where: { id } })
  if (!before) return NextResponse.json({ error: 'Charge introuvable' }, { status: 404 })

  await prisma.lysmaExpense.delete({ where: { id } })
  await prisma.auditLog.create({
    data: {
      outil: 'super-admin',
      cibleType: 'finance_expense',
      cibleId: id,
      action: 'finance.expense.delete',
      acteurEmail: session.user?.email ?? null,
      resume: `${before.provider} / ${before.name}`,
      avant: before as any,
    },
  })

  return NextResponse.json({ ok: true })
}
