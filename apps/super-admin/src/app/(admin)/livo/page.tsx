import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getLivoGarages } from '@/lib/livo-api'
import Link from 'next/link'
import { Badge, StatCard, PageHeader } from '@/components/ui'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

const fmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

export default async function LivoPage() {
  const session = await auth()
  if (!session) redirect('/connexion')

  const garages = await getLivoGarages()

  const stats = {
    total: garages.length,
    actifs: garages.filter(g => g.abonnementActif).length,
    enTrial: garages.filter(g => !g.abonnementActif && !g.trialExpire).length,
    expires: garages.filter(g => g.trialExpire && !g.abonnementActif).length,
    caTotal: garages.reduce((s, g) => s + g.stats.caTotal, 0),
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Garages LIVO"
        description={`${garages.length} garage${garages.length > 1 ? 's' : ''} connecté${garages.length > 1 ? 's' : ''}`}
      >
        <Link href="/livo/integrations" className={styles.btnSecondary}>Intégrations QR</Link>
        <Link href="/livo/api-or" className={styles.btnSecondary}>API OR Mail</Link>
      </PageHeader>

      <div className={styles.statsGrid}>
        <StatCard label="Total garages" value={stats.total} color="cyan" />
        <StatCard label="Abonnements actifs" value={stats.actifs} color="green" />
        <StatCard label="En trial" value={stats.enTrial} color="yellow" />
        <StatCard label="Trials expirés" value={stats.expires} color={stats.expires > 0 ? 'red' : 'muted'} />
        <StatCard label="CA total généré" value={fmt.format(stats.caTotal)} color="purple" />
      </div>

      {garages.length === 0 && (
        <div className={styles.empty}>
          API LIVO non joignable — vérifier LIVO_API_URL et INTERNAL_API_KEY
        </div>
      )}

      {garages.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Garage</th>
                <th>Ville</th>
                <th>Abonnement</th>
                <th>Trial</th>
                <th>Compagnons</th>
                <th>CA</th>
                <th>Créé</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {garages.map(g => (
                <tr key={g.id} className={g.trialExpire && !g.abonnementActif ? styles.rowExpire : ''}>
                  <td>
                    <Link href={`/livo/${g.id}`} className={styles.link}>{g.nom}</Link>
                    <span className={styles.muted}>{g.owner.prenom} {g.owner.nom}</span>
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
                        {g.trialExpire
                          ? `expiré ${Math.abs(g.joursRestants)}j`
                          : `${g.joursRestants}j`}
                      </Badge>
                    ) : (
                      <span className={styles.muted}>—</span>
                    )}
                  </td>
                  <td className={styles.center}>{g.stats.compagnons}</td>
                  <td>{fmt.format(g.stats.caTotal)}</td>
                  <td className={styles.muted}>{new Date(g.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <Link href={`/livo/${g.id}`} className={styles.actionBtn}>Détail</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
