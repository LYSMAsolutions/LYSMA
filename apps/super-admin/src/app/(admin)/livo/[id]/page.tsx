import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { getLivoGarage } from '@/lib/livo-api'
import { getAuditLogs } from '@/lib/audit'
import { LivoGarageClient } from './LivoGarageClient'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function LivoGaragePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/connexion')
  }

  const { id } = await params
  const garage = await getLivoGarage(id)

  if (!garage) {
    notFound()
  }

  const auditLogs = await getAuditLogs({
    outil: 'livo-app',
    cibleType: 'garage',
    cibleId: id,
    take: 20,
  })

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <a href="/livo" className={styles.breadLink}>livo-app</a>
        <span className={styles.sep}> / </span>
        <span>{garage.nom}</span>
      </div>

      <LivoGarageClient
        garage={garage}
        auditLogs={auditLogs.map((log) => ({
          id: log.id,
          action: log.action,
          statut: log.statut,
          acteurEmail: log.acteurEmail,
          resume: log.resume,
          erreur: log.erreur,
          createdAt: log.createdAt.toISOString(),
        }))}
        livoUrl={process.env.LIVO_API_URL ?? 'https://livo-app.com'}
      />
    </div>
  )
}
