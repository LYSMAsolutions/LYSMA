import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getLivoDemandes } from '@/lib/livo-api'
import Link from 'next/link'
import { StatCard, PageHeader } from '@/components/ui'
import { DemandesClient } from './DemandesClient'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function LivoIntegrationsPage() {
  const session = await auth()
  if (!session) redirect('/connexion')

  const toutes = await getLivoDemandes()

  const enAttente = toutes.filter(d => d.statut === 'EN_ATTENTE')
  const approuvees = toutes.filter(d => d.statut === 'APPROUVEE')
  const refusees = toutes.filter(d => d.statut === 'REFUSEE')

  return (
    <div className={styles.page}>
      <PageHeader
        title="Intégrations QR LIVO"
        description="Demandes d'intégration logiciel soumises par les garages."
      >
        <Link href="/livo" className={styles.btnSecondary}>← Retour LIVO</Link>
      </PageHeader>

      <div className={styles.statsGrid}>
        <StatCard label="En attente" value={enAttente.length} color={enAttente.length > 0 ? 'yellow' : 'muted'} />
        <StatCard label="Approuvées" value={approuvees.length} color="green" />
        <StatCard label="Refusées" value={refusees.length} color="red" />
        <StatCard label="Total" value={toutes.length} color="cyan" />
      </div>

      {toutes.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyTitle}>Aucune demande d&apos;intégration</span>
          <span className={styles.emptyDesc}>
            Les demandes soumises par les garages apparaîtront ici.
          </span>
        </div>
      ) : (
        <DemandesClient demandes={toutes} />
      )}
    </div>
  )
}
