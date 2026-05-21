import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPrimaryGarageForUser } from '@/lib/garage'
import { z } from 'zod'

const supportSchema = z.object({
  message: z.string().min(3).max(4000),
})

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = supportSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const [user, garage] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    getPrimaryGarageForUser(session.user.id),
  ])

  if (!user || !garage) {
    return NextResponse.json({ error: 'Compte introuvable' }, { status: 404 })
  }

  const inboxUrl = process.env.SUPER_ADMIN_MESSAGES_URL ?? 'https://lysma-super-admin.vercel.app/api/messages'
  const secret = process.env.SUPER_ADMIN_INBOUND_SECRET

  const res = await fetch(inboxUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(secret ? { 'x-lysma-inbound-secret': secret } : {}),
    },
    body: JSON.stringify({
      nom: `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() || user.email,
      email: user.email,
      societe: garage.nom,
      telephone: garage.telephone ?? user.telephone ?? null,
      outil: 'livo-app',
      message: parsed.data.message,
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Message non envoye au super-admin' }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
