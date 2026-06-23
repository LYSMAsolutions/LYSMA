import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getLivoDemandes } from '@/lib/livo-api'
import Link from 'next/link'
import { DemandesClient } from './DemandesClient'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function LivoIntegrationsPage() {
  const session = await auth()
  if (!session) redirect('/connexion')

  const [enAttente, autres] = await Promise.all([
    getLivoDemandes('EN_ATTENTE'),
    getLivoDemandes('APPROUVEE'),
  ])

  const toutes = await getLivoDemandes()

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.title}>
          <span className={styles.prompt}>$</span>
          <span className={styles.cmd}>livo-app --integrations --demandes</span>
          <span className={styles.count}>{enAttente.length} en attente</span>
        </div>
        <Link href="/livo" className={styles.backLink}>← livo</Link>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>en_attente</span>
          <span className={styles.statVal} style={{ color: 'var(--yellow)' }}>{enAttente.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>approuvees</span>
          <span className={styles.statVal} style={{ color: 'var(--green)' }}>{toutes.filter(d => d.statut === 'APPROUVEE').length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>refusees</span>
          <span className={styles.statVal} style={{ color: 'var(--red)' }}>{toutes.filter(d => d.statut === 'REFUSEE').length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>total</span>
          <span className={styles.statVal}>{toutes.length}</span>
        </div>
      </div>

      {toutes.length === 0 ? (
        <div className={styles.empty}>
          Aucune demande d&apos;intégration pour l&apos;instant.
        </div>
      ) : (
        <DemandesClient demandes={toutes} />
      )}
    </div>
  )
}
