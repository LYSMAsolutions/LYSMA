import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  nom: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email(),
  societe: z.string().trim().optional(),
  telephone: z.string().trim().optional(),
  outil: z.string().trim().min(1).default('livo-app'),
  messageId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { nom, email, societe, telephone, outil, messageId } = parsed.data

  const existingClient = await prisma.client.findUnique({
    where: {
      email,
    },
  })

  if (existingClient) {
    return NextResponse.json(
      { error: 'Un client existe déjà avec cet email' },
      { status: 409 }
    )
  }

  const trialDebutAt = new Date()
  const trialFinAt = new Date()
  trialFinAt.setDate(trialFinAt.getDate() + 30)

  const client = await prisma.$transaction(async (tx) => {
    const created = await tx.client.create({
      data: {
        nom,
        email,
        societe: societe || null,
        telephone: telephone || null,
        outil,
        statut: 'TRIAL',
        trialDebutAt,
        trialFinAt,
      },
    })

    if (messageId) {
      const message = await tx.message.findUnique({
        where: {
          id: messageId,
        },
      })

      if (message) {
        await tx.message.update({
          where: {
            id: messageId,
          },
          data: {
            clientId: created.id,
            statut: 'TRAITE',
          },
        })
      }
    }

    return created
  })

  return NextResponse.json({ success: true, client })
}