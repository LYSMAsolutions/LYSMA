import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getLivoGarageLinkCredentials } from '@/lib/livo-api'

const LIVO_API_URL = process.env.LIVO_API_URL ?? 'https://livo-app.com'
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? ''

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const result = await getLivoGarageLinkCredentials(id)
  if (!result) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  return NextResponse.json(result)
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params

  try {
    const res = await fetch(
      `${LIVO_API_URL}/api/internal/integrations/garage-links/${id}/credentials`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-api-key': INTERNAL_API_KEY,
        },
      }
    )
    const data = await res.json()
    if (!res.ok) return NextResponse.json(data, { status: res.status })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
