import { NextRequest, NextResponse } from 'next/server'
import { sendChatboxDailyDigestEmail } from '@/lib/chatbox-bad-alert-email'

export async function GET(req: NextRequest) {
  return handleDigest(req)
}

export async function POST(req: NextRequest) {
  return handleDigest(req)
}

async function handleDigest(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  if ((process.env.CHATBOX_ALERT_MODE || 'instant').toLowerCase() !== 'daily_digest') {
    return NextResponse.json({
      sent: false,
      reason: 'CHATBOX_ALERT_MODE is not daily_digest',
    })
  }

  const result = await sendChatboxDailyDigestEmail()
  return NextResponse.json(result)
}

function isAuthorized(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  const bearer = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (cronSecret && bearer === cronSecret) return true

  const inboundSecret = process.env.SUPER_ADMIN_INBOUND_SECRET
  return Boolean(inboundSecret && req.headers.get('x-lysma-inbound-secret') === inboundSecret)
}
