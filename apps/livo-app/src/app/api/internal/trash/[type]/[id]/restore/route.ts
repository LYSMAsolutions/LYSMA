import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isInternalApiAuthorized } from '@/lib/security/internal-api'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  if (!isInternalApiAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { type, id } = await params
  const restoredBy = req.headers.get('x-super-admin-user-id') ?? 'super-admin'

  if (type !== 'absence') {
    return NextResponse.json({ error: 'Type non supporte' }, { status: 400 })
  }

  const absence = await prisma.absence.findUnique({ where: { id } })
  if (!absence || !absence.deletedAt) {
    return NextResponse.json({ error: 'Element introuvable dans la corbeille' }, { status: 404 })
  }

  const restored = await prisma.absence.update({
    where: { id },
    data: {
      deletedAt: null,
      restoredAt: new Date(),
      restoredBy,
    },
  })

  return NextResponse.json({ success: true, item: restored })
}
