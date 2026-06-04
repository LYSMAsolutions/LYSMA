import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { discoverShowcaseSite, getShowcaseSite } from '@/lib/site-vitrine'

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
  if (!site) {
    return NextResponse.json({ error: 'Site introuvable' }, { status: 404 })
  }

  try {
    const discovery = await discoverShowcaseSite(id)
    return NextResponse.json({
      site: {
        id: site.id,
        name: site.name,
      },
      discovery,
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Analyse impossible',
    }, { status: 500 })
  }
}
