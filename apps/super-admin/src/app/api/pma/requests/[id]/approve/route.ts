import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPmaBaseUrl } from '@/lib/pma-api'

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const { id } = await context.params

  const res = await fetch(`${getPmaBaseUrl()}/api/lysma-customers/from-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId: id }),
    cache: 'no-store',
  })

  const data = await res.json().catch(() => null)

  if (!res.ok || !data?.success) {
    return NextResponse.json(
      { error: data?.message || 'Impossible de valider la demande PMA.' },
      { status: res.status || 500 }
    )
  }

  return NextResponse.json({
    success: true,
    customer: data.customer,
    temporaryPassword: data.temporaryPassword,
  })
}
