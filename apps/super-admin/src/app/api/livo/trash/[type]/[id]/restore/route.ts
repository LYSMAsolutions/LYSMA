import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { writeAuditLog } from '@/lib/audit'
import { restoreLivoTrashItem } from '@/lib/livo-api'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const { type, id } = await params

  try {
    const result = await restoreLivoTrashItem(type, id, session.user.id)
    await writeAuditLog({
      outil: 'livo-app',
      cibleType: type,
      cibleId: id,
      action: 'restore',
      acteurId: session.user.id,
      acteurEmail: session.user.email,
      resume: `Restauration ${type} depuis la corbeille Super Admin`,
      apres: result.item,
    })

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    await writeAuditLog({
      outil: 'livo-app',
      cibleType: type,
      cibleId: id,
      action: 'restore',
      statut: 'ERROR',
      acteurId: session.user.id,
      acteurEmail: session.user.email,
      resume: `Echec restauration ${type}`,
      erreur: error instanceof Error ? error.message : 'Erreur inconnue',
    })

    return NextResponse.json({ error: 'Restauration impossible' }, { status: 500 })
  }
}
