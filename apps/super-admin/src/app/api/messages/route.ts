import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { writeAuditLog } from '@/lib/audit'

const messageSchema = z.object({
  nom: z.string().min(1).max(120),
  email: z.string().email(),
  societe: z.string().max(160).optional().nullable(),
  telephone: z.string().max(40).optional().nullable(),
  outil: z.string().min(1).max(80).default('livo-app'),
  message: z.string().min(3).max(4000),
})

export async function POST(req: NextRequest) {
  const secret = process.env.SUPER_ADMIN_INBOUND_SECRET

  if (secret) {
    const providedSecret = req.headers.get('x-lysma-inbound-secret')
    if (providedSecret !== secret) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
    }
  }

  const body = await req.json().catch(() => null)
  const parsed = messageSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const message = await prisma.message.create({
    data: {
      ...parsed.data,
      statut: 'NOUVEAU',
    },
  })

  await writeAuditLog({
    outil: parsed.data.outil,
    cibleType: 'message',
    cibleId: message.id,
    action: 'message_inbound',
    resume: `${message.nom} - ${message.email}`,
    apres: message,
  })

  return NextResponse.json({ success: true, message }, { status: 201 })
}
