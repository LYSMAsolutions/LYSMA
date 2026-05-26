import { auth } from '@/lib/auth'
import { getFinanceSettings } from '@/lib/finance'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  urssafRate: z.coerce.number().min(0).max(100),
  vatRate: z.coerce.number().min(0).max(100),
  vatStatus: z.enum(['FRANCHISE', 'ASSUJETTI']),
  declarationFrequency: z.enum(['MENSUELLE', 'TRIMESTRIELLE']),
})

export async function PUT(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorise' }, { status: 401 })

  const body = await req.json()
  const data = schema.parse(body)
  const current = await getFinanceSettings()
  const settings = await prisma.financeSettings.update({
    where: { id: current.id },
    data,
  })

  await prisma.auditLog.create({
    data: {
      outil: 'super-admin',
      cibleType: 'finance_settings',
      cibleId: settings.id,
      action: 'finance.settings.update',
      acteurEmail: session.user?.email ?? null,
      resume: 'Parametres URSSAF / TVA mis a jour',
      apres: settings as any,
    },
  })

  return NextResponse.json({ settings })
}
