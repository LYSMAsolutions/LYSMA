import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPrimaryGarageForUser } from '@/lib/garage'
import { prisma } from '@/lib/prisma'
import { buildChatboxLogMetadata } from '@/lib/chatbox-log-metadata'
import { forwardChatLog } from '@/lib/super-admin-chat-log'

const cleanText = (value: unknown, maxLength: number) =>
  typeof value === 'string'
    ? value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, maxLength)
    : ''

async function getConnectedIdentity() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return {
        userName: null,
        userEmail: null,
        metadata: { authenticated: false },
      }
    }

    const [user, garage] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          nom: true,
          prenom: true,
          role: true,
        },
      }),
      getPrimaryGarageForUser(session.user.id),
    ])

    const userName = [user?.prenom, user?.nom].filter(Boolean).join(' ').trim()

    return {
      userName: userName || session.user.name || null,
      userEmail: user?.email ?? session.user.email ?? null,
      metadata: {
        authenticated: true,
        userId: session.user.id,
        userRole: user?.role ?? session.user.role ?? null,
        garageId: garage?.id ?? null,
        garageName: garage?.nom ?? null,
      },
    }
  } catch {
    return {
      userName: null,
      userEmail: null,
      metadata: { authenticated: false, identityLookupFailed: true },
    }
  }
}

export async function POST(request: NextRequest) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON invalide.' }, { status: 400 })
  }

  const payload = body as {
    conversationId?: unknown
    userPrompt?: unknown
    assistantResponse?: unknown
    metadata?: unknown
  }
  const conversationId = cleanText(payload.conversationId, 160)
  const userPrompt = cleanText(payload.userPrompt, 320)
  const assistantResponse = cleanText(payload.assistantResponse, 2000)

  if (!userPrompt) {
    return NextResponse.json({ error: 'userPrompt est obligatoire.' }, { status: 400 })
  }

  const identity = await getConnectedIdentity()

  await forwardChatLog({
    source: 'app:livo-app',
    conversationId: conversationId || null,
    userName: identity.userName,
    userEmail: identity.userEmail,
    userPrompt,
    assistantResponse,
    metadata: buildChatboxLogMetadata(payload.metadata, {
      app: 'livo-app',
      route: '/api/chatbox/log',
      userAgent: request.headers.get('user-agent'),
      ...identity.metadata,
    }),
  })

  return NextResponse.json({ success: true })
}
