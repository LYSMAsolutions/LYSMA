import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { updateLivoGarage } from '@/lib/livo-api'
import { z } from 'zod'

const schema = z.object({
  abonnementActif: z.boolean().optional(),
  actif: z.boolean().optional(),
  trialEndsAt: z.string().datetime().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const result = await updateLivoGarage(id, parsed.data)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch {
    return NextResponse.json(
      { error: 'Erreur API LIVO' },
      { status: 500 }
    )
  }
}