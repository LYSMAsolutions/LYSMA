import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const expenseSchema = z.object({
  name: z.string().min(1),
  provider: z.string().min(1),
  category: z.enum(['HEBERGEMENT', 'DOMAINE', 'IA', 'COMPTABILITE', 'PAIEMENT', 'LOGICIEL', 'API', 'MATERIEL', 'AUTRE']),
  relatedTool: z.enum(['GLOBAL', 'LIVO', 'PMA', 'TRANSPORT', 'AUTRE']),
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

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorise' }, { status: 401 })

  const expenses = await prisma.lysmaExpense.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ expenses })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorise' }, { status: 401 })

  const body = await req.json()
  const data = expenseSchema.parse(body)

  const expense = await prisma.lysmaExpense.create({
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
      cibleId: expense.id,
      action: 'finance.expense.create',
      acteurEmail: session.user?.email ?? null,
      resume: `${expense.provider} / ${expense.name}`,
      apres: expense as any,
    },
  })

  return NextResponse.json({ expense })
}
