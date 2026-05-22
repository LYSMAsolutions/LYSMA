import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { writeAuditLog } from '@/lib/audit'
import { getShowcaseSite } from '@/lib/site-vitrine'
import { triggerShowcaseDeploy } from '@/lib/publishing'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const { id } = await params
  const site = await getShowcaseSite(id)
  if (!site) {
    return NextResponse.json({ error: 'Site introuvable' }, { status: 404 })
  }

  const result = await triggerShowcaseDeploy(id)
  await writeAuditLog({
    outil: 'sites-vitrine',
    cibleType: 'site',
    cibleId: id,
    action: 'deploy',
    statut: result.triggered ? 'SUCCESS' : 'ERROR',
    acteurId: session.user.id,
    acteurEmail: session.user.email,
    resume: `Deploiement manuel ${site.name}`,
    apres: result,
    erreur: result.error,
  })

  if (!result.triggered) {
    return NextResponse.json({
      error: result.error ?? 'Deploy hook Vercel absent ou impossible',
      deploy: result,
    }, { status: result.configured ? 502 : 400 })
  }

  return NextResponse.json({ success: true, deploy: result })
}
