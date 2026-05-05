import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  statut: z.enum(['NOUVEAU', 'LU', 'TRAITE']).optional(),
  reponse: z.string().optional(),
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

  const existingMessage = await prisma.message.findUnique({
    where: {
      id,
    },
  })

  if (!existingMessage) {
    return NextResponse.json({ error: 'Message introuvable' }, { status: 404 })
  }

  const message = await prisma.message.update({
    where: {
      id,
    },
    data: parsed.data,
  })

  return NextResponse.json({ success: true, message })
}