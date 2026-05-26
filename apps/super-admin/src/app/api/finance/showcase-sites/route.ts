import { auth } from '@/lib/auth'
import { normalizeShowcaseSiteInput, showcaseSiteSchema } from '@/lib/finance-showcase-schema'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorise' }, { status: 401 })

  const body = await req.json()
  const data = showcaseSiteSchema.parse(body)
  const site = await prisma.showcaseSiteFinance.create({
    data: normalizeShowcaseSiteInput(data),
  })

  await prisma.auditLog.create({
    data: {
      outil: 'super-admin',
      cibleType: 'showcase_site_finance',
      cibleId: site.id,
      action: 'finance.showcase.create',
      acteurEmail: 'lysmasolutions@gmail.com',
      resume: `${site.siteName} / ${site.clientCompany ?? site.clientName}`,
      apres: site as any,
    },
  })

  return NextResponse.json({ site })
}
