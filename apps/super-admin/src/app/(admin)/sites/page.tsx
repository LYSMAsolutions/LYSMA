import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getShowcaseRoot, getShowcaseSites } from '@/lib/site-vitrine'
import styles from './page.module.css'

export default async function SitesPage() {
  const session = await auth()
  if (!session) redirect('/connexion')

  const sites = await getShowcaseSites()
  const nextCount = sites.filter((site) => site.kind === 'next').length
  const staticCount = sites.filter((site) => site.kind === 'static').length

  return (
    <main className={styles.page}>
      <div className={styles.termHeader}>
        <span className={styles.termPrompt}>admin@lysma</span>
        <span className={styles.termCmd}> $ sites-vitrines --inventory</span>
      </div>

      <section className={styles.statsGrid}>
        <StatCard label="sites_detectes" value={sites.length} tone="cyan" />
        <StatCard label="apps_next" value={nextCount} tone="green" />
        <StatCard label="sites_statiques" value={staticCount} tone="yellow" />
        <StatCard label="racine" value={getShowcaseRoot()} tone="muted" compact />
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>// sites_vitrine</span>
          <span className={styles.panelMeta}>{sites.length} entree{sites.length > 1 ? 's' : ''}</span>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>site</th>
              <th>type</th>
              <th>chemin</th>
              <th>demarrage</th>
              <th>fichiers</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => (
              <tr key={site.id}>
                <td>
                  <Link href={`/sites/${site.id}`} className={styles.link}>
                    {site.name}
                  </Link>
                </td>
                <td><span className={styles.tag}>{site.kind}</span></td>
                <td className={styles.muted}>{site.relativePath}</td>
                <td><code className={styles.code}>{site.entry}</code></td>
                <td className={styles.number}>{site.files}</td>
                <td className={styles.actionCell}>
                  <Link href={`/sites/${site.id}/studio`} className={styles.action}>studio</Link>
                  <Link href={`/sites/${site.id}`} className={styles.actionSecondary}>details</Link>
                </td>
              </tr>
            ))}
            {sites.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  // aucun dossier dans apps/site-vitrine
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  )
}

function StatCard({
  label,
  value,
  tone,
  compact = false,
}: {
  label: string
  value: number | string
  tone: 'cyan' | 'green' | 'yellow' | 'muted'
  compact?: boolean
}) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={`${styles.statValue} ${compact ? styles.statValueSmall : ''}`} data-tone={tone}>
        {value}
      </span>
    </div>
  )
}
