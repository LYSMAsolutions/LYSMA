import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createErrorReport } from '@/lib/error-reports'
import { writeAuditLog } from '@/lib/audit'

const schema = z.object({
  outil: z.string().min(1).max(80),
  niveau: z.string().max(30).optional(),
  message: z.string().min(1).max(4000),
  stack: z.string().max(16000).optional().nullable(),
  url: z.string().max(1000).optional().nullable(),
  userAgent: z.string().max(1000).optional().nullable(),
  contexte: z.unknown().optional(),
})

export async function POST(req: NextRequest) {
  const secret = process.env.SUPER_ADMIN_INBOUND_SECRET
  if (secret && req.headers.get('x-lysma-inbound-secret') !== secret) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const report = await createErrorReport(parsed.data)
  await writeAuditLog({
    outil: parsed.data.outil,
    cibleType: 'error',
    cibleId: report.id,
    action: 'error_reported',
    resume: parsed.data.message.slice(0, 180),
    apres: report,
  })

  return NextResponse.json({ success: true, report }, { status: 201 })
}
