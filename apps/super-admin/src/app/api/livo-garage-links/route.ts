import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const LIVO_API_URL = process.env.LIVO_API_URL ?? 'https://livo-app.com'
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? ''

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body?.partnerId || !body?.garageId || !body?.externalGarageId) {
    return NextResponse.json({ error: 'partnerId, garageId, externalGarageId requis' }, { status: 400 })
  }

  try {
    const res = await fetch(`${LIVO_API_URL}/api/internal/integrations/garage-links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-api-key': INTERNAL_API_KEY,
      },
      body: JSON.stringify({
        partnerId: body.partnerId,
        garageId: body.garageId,
        externalGarageId: body.externalGarageId,
      }),
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json(data, { status: res.status })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
