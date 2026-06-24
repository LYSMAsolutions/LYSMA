import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getLivoGarages } from '@/lib/livo-api'
import { getClientSites } from '@/lib/site-vitrine-manifest'
import { Badge, StatCard, PageHeader } from '@/components/ui'
import styles from './page.module.css'

export const revalidate = 0

export default async function ClientsPage() {
  const session = await auth()
  if (!session) redirect('/connexion')

  const [livoGarages, sites] = await Promise.all([
    getLivoGarages(),
    getClientSites(),
  ])

  const livoActifs = livoGarages.filter((g) => g.abonnementActif).length
  const livoTrial = livoGarages.filter((g) => !g.abonnementActif && !g.trialExpire).length
  const livoExpires = livoGarages.filter((g) => g.trialExpire && !g.abonnementActif).length

  const totalClients = livoGarages.length + sites.length

  return (
    <div className={styles.page}>
      <PageHeader
        title="Clients LYSMA"
        description="Vue unifiée de tous les clients — garages LIVO et sites vitrine."
      />

      <section className={styles.statsGrid}>
        <StatCard label="Total clients" value={totalClients} color="cyan" />
        <StatCard label="LIVO actifs" value={livoActifs} color="green" />
        <StatCard label="LIVO en trial" value={livoTrial} color="yellow" />
        <StatCard label="LIVO expirés" value={livoExpires} color={livoExpires > 0 ? 'red' : 'muted'} />
        <StatCard label="Sites vitrine" value={sites.length} color="purple" />
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>Garages LIVO</span>
          <Link href="/livo" className={styles.panelLink}>Gérer LIVO →</Link>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Garage</th>
              <th>Propriétaire</th>
              <th>Ville</th>
              <th>Abonnement</th>
              <th>Trial</th>
              <th>CA généré</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {livoGarages.map((g) => (
              <tr key={g.id} className={g.trialExpire && !g.abonnementActif ? styles.rowExpire : ''}>
                <td>
                  <Link href={`/livo/${g.id}`} className={styles.clientName}>{g.nom}</Link>
                </td>
                <td>
                  <span>{g.owner.prenom} {g.owner.nom}</span>
                  <span className={styles.muted}>{g.owner.email}</span>
                </td>
                <td className={styles.muted}>{g.ville ?? '—'}</td>
                <td>
                  <Badge variant={g.abonnementActif ? 'success' : g.trialExpire ? 'error' : 'warning'}>
                    {g.abonnementActif ? 'Actif' : g.trialExpire ? 'Expiré' : 'Trial'}
                  </Badge>
                </td>
                <td>
                  {g.joursRestants !== null ? (
                    <Badge variant={g.trialExpire ? 'error' : g.joursRestants <= 7 ? 'warning' : 'muted'}>
                      {g.trialExpire ? `expiré ${Math.abs(g.joursRestants)}j` : `${g.joursRestants}j`}
                    </Badge>
                  ) : <span className={styles.muted}>—</span>}
                </td>
                <td className={styles.muted}>{formatEuro(g.stats.caTotal)}</td>
                <td>
                  <Link href={`/livo/${g.id}`} className={styles.actionBtn}>Détail</Link>
                </td>
              </tr>
            ))}
            {livoGarages.length === 0 && (
              <tr><td colSpan={7} className={styles.empty}>Aucun garage LIVO</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>Sites vitrine</span>
          <Link href="/sites" className={styles.panelLink}>Studio →</Link>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client</th>
              <th>Type</th>
              <th>Dépôt</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sites.map((s) => (
              <tr key={s.id}>
                <td>
                  <span className={styles.clientName}>{s.name}</span>
                </td>
                <td>
                  <Badge variant={s.kind === 'next' ? 'blue' : 'muted'}>{s.kind}</Badge>
                </td>
                <td className={styles.muted}>{s.repository ?? s.relativePath}</td>
                <td>
                  <Link href={`/sites/${s.id}/studio`} className={styles.actionBtn}>Studio</Link>
                </td>
              </tr>
            ))}
            {sites.length === 0 && (
              <tr><td colSpan={4} className={styles.empty}>Aucun site vitrine</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}

function formatEuro(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}
