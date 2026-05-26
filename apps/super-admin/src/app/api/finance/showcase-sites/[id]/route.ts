import { auth } from '@/lib/auth'
import { normalizeShowcaseSiteInput, showcaseSiteSchema } from '@/lib/finance-showcase-schema'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: Request, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorise' }, { status: 401 })

  const { id } = await params
  const before = await prisma.showcaseSiteFinance.findUnique({ where: { id } })
  if (!before) return NextResponse.json({ error: 'Site vitrine introuvable' }, { status: 404 })

  const data = showcaseSiteSchema.parse(await req.json())
  const site = await prisma.showcaseSiteFinance.update({
    where: { id },
    data: normalizeShowcaseSiteInput(data),
  })

  await prisma.auditLog.create({
    data: {
      outil: 'super-admin',
      cibleType: 'showcase_site_finance',
      cibleId: id,
      action: 'finance.showcase.update',
      acteurEmail: 'lysmasolutions@gmail.com',
      resume: `${site.siteName} / ${site.clientCompany ?? site.clientName}`,
      avant: before as any,
      apres: site as any,
    },
  })

  return NextResponse.json({ site })
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorise' }, { status: 401 })

  const { id } = await params
  const before = await prisma.showcaseSiteFinance.findUnique({ where: { id } })
  if (!before) return NextResponse.json({ error: 'Site vitrine introuvable' }, { status: 404 })

  await prisma.showcaseSiteFinance.delete({ where: { id } })
  await prisma.auditLog.create({
    data: {
      outil: 'super-admin',
      cibleType: 'showcase_site_finance',
      cibleId: id,
      action: 'finance.showcase.delete',
      acteurEmail: 'lysmasolutions@gmail.com',
      resume: `${before.siteName} / ${before.clientCompany ?? before.clientName}`,
      avant: before as any,
    },
  })

  return NextResponse.json({ ok: true })
}
