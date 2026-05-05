import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getShowcaseSite, readShowcaseContent, writeShowcaseContent } from '@/lib/site-vitrine'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const { id } = await params
  const site = await getShowcaseSite(id)
  if (!site) return NextResponse.json({ error: 'Site introuvable' }, { status: 404 })

  const content = await readShowcaseContent(id)
  return NextResponse.json({ site, content })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const { id } = await params
  const site = await getShowcaseSite(id)
  if (!site) return NextResponse.json({ error: 'Site introuvable' }, { status: 404 })

  const content = await req.json()
  await writeShowcaseContent(id, content)

  return NextResponse.json({ success: true, content })
}
