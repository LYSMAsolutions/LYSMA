import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { traiteLivoDemande } from '@/lib/livo-api'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const body = await req.json().catch(() => null)

  if (!body?.statut || !['APPROUVEE', 'REFUSEE'].includes(body.statut)) {
    return NextResponse.json({ error: 'statut invalide' }, { status: 400 })
  }

  try {
    const result = await traiteLivoDemande(id, body.statut, body.noteAdmin)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
