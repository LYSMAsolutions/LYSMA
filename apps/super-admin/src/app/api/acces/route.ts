import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { randomInt } from 'crypto'
import { writeAuditLog } from '@/lib/audit'

const schema = z.object({
  clientId: z.string().min(1),
  email: z.string().trim().toLowerCase().email(),
})

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$'
  let password = ''

  for (let i = 0; i < 14; i++) {
    password += chars[randomInt(0, chars.length)]
  }

  return password
}

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

  const { clientId, email } = parsed.data

  const client = await prisma.client.findUnique({
    where: {
      id: clientId,
    },
  })

  if (!client) {
    return NextResponse.json({ error: 'Client introuvable' }, { status: 404 })
  }

  const existingAccess = await prisma.acces.findFirst({
    where: {
      clientId,
      email,
      actif: true,
    },
  })

  if (existingAccess) {
    return NextResponse.json(
      { error: 'Un accès actif existe déjà pour cet email' },
      { status: 409 }
    )
  }

  const motDePasseTemp = generatePassword()

  const access = await prisma.acces.create({
    data: {
      clientId,
      email,
      motDePasseTemp,
      actif: true,
      premiereConnexion: true,
    },
  })

  await writeAuditLog({
    outil: client.outil,
    cibleType: 'acces',
    cibleId: access.id,
    action: 'access_create',
    acteurId: session.user.id,
    acteurEmail: session.user.email,
    resume: `Creation acces ${email} pour ${client.nom}`,
    apres: { ...access, motDePasseTemp: '***' },
  })

  return NextResponse.json({
    success: true,
    access,
    motDePasseTemp,
  })
}
