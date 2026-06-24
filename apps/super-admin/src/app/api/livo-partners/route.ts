import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getLivoPartners } from '@/lib/livo-api'

const LIVO_API_URL = process.env.LIVO_API_URL ?? 'https://livo-app.com'
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? ''

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const partners = await getLivoPartners()
  return NextResponse.json({ partners })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body?.name) return NextResponse.json({ error: 'name requis' }, { status: 400 })

  try {
    const res = await fetch(`${LIVO_API_URL}/api/internal/integrations/partners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-api-key': INTERNAL_API_KEY,
      },
      body: JSON.stringify({ name: body.name }),
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json(data, { status: res.status })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
