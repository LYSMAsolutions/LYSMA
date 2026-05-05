import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getLivoGarages } from '@/lib/livo-api'
import Link from 'next/link'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

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
      <div className={styles.toolbar}>
        <div className={styles.title}>
          <span className={styles.prompt}>$</span>
          <span className={styles.cmd}>livo-app --garages --status</span>
          <span className={styles.count}>{garages.length} garages</span>
        </div>
        {garages.length === 0 && (
          <span className={styles.warning}>⚠ API LIVO non joignable — vérifier LIVO_API_URL et INTERNAL_API_KEY</span>
        )}
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>total_garages</span>
          <span className={styles.statVal} style={{color:'var(--cyan)'}}>{stats.total}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>abonnements_actifs</span>
          <span className={styles.statVal} style={{color:'var(--green)'}}>{stats.actifs}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>en_trial</span>
          <span className={styles.statVal} style={{color:'var(--yellow)'}}>{stats.enTrial}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>trials_expirés</span>
          <span className={styles.statVal} style={{color: stats.expires > 0 ? 'var(--red)' : 'var(--text-muted)'}}>{stats.expires}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>ca_total_genere</span>
          <span className={styles.statVal} style={{color:'var(--purple)'}}>
            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(stats.caTotal)}
          </span>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>garage</th>
            <th>owner</th>
            <th>ville</th>
            <th>statut</th>
            <th>trial</th>
            <th>compagnons</th>
            <th>véhicules</th>
            <th>ca_généré</th>
            <th>créé</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {garages.map(g => {
            const color = g.abonnementActif ? 'var(--green)' : g.trialExpire ? 'var(--red)' : 'var(--yellow)'
            const label = g.abonnementActif ? 'actif' : g.trialExpire ? 'expiré' : 'trial'
            return (
              <tr key={g.id} className={g.trialExpire && !g.abonnementActif ? styles.rowExpire : ''}>
                <td>
                  <Link href={`/livo/${g.id}`} className={styles.link}>{g.nom}</Link>
                </td>
                <td className={styles.muted}>{g.owner.prenom} {g.owner.nom}</td>
                <td className={styles.muted}>{g.ville ?? '—'}</td>
                <td><span style={{color, fontSize:11}}>● {label}</span></td>
                <td>
                  {g.joursRestants !== null ? (
                    <span style={{color: g.trialExpire ? 'var(--red)' : g.joursRestants <= 7 ? 'var(--yellow)' : 'var(--text-muted)', fontSize:11}}>
                      {g.trialExpire ? `expiré ${Math.abs(g.joursRestants)}j` : `${g.joursRestants}j restants`}
                    </span>
                  ) : <span className={styles.muted}>—</span>}
                </td>
                <td className={styles.center}>{g.stats.compagnons}</td>
                <td className={styles.center}>{g.stats.vehicules}</td>
                <td className={styles.mono} style={{color:'var(--purple)'}}>
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(g.stats.caTotal)}
                </td>
                <td className={styles.muted}>{new Date(g.createdAt).toLocaleDateString('fr-FR')}</td>
                <td>
                  <Link href={`/livo/${g.id}`} className={styles.actionBtn}>détail</Link>
                </td>
              </tr>
            )
          })}
          {garages.length === 0 && (
            <tr><td colSpan={10} className={styles.empty}>// aucun garage — API LIVO non connectée</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
