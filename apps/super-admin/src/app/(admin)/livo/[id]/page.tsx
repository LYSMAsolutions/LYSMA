import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { getLivoGarage } from '@/lib/livo-api'
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

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <a href="/livo" className={styles.breadLink}>livo-app</a>
        <span className={styles.sep}> / </span>
        <span>{garage.nom}</span>
      </div>

      <LivoGarageClient garage={garage} />
    </div>
  )
}