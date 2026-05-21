import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getShowcaseOverviewSites } from '@/lib/site-vitrine-manifest'
import { getWorkspaceRoot } from '@/lib/workspace'
import { RootWorkspaceClient } from './RootWorkspaceClient'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function RootPage() {
  const session = await auth()
  if (!session) redirect('/connexion')

  const sites = await getShowcaseOverviewSites()

  return (
    <main className={styles.page}>
      <div className={styles.termHeader}>
        <span className={styles.termPrompt}>root@lysma</span>
        <span className={styles.termCmd}> $ workspace --control</span>
      </div>

      <section className={styles.statsGrid}>
        <StatCard label="workspace" value={getWorkspaceRoot()} tone="cyan" compact />
        <StatCard label="apps_site_vitrine" value={sites.length} tone="green" />
        <StatCard label="mode" value="lecture" tone="yellow" />
        <StatCard label="scope" value="apps" tone="purple" />
      </section>

      <section className={styles.commandGrid}>
        <Command title="apps" value="inventaire des dossiers et fichiers" />
        <Command title="sites" value="controle des sites vitrines detectes" />
        <Command title="clients" value="acces, abonnements, messages, exports" />
        <Command title="livo" value="garages, trial, donnees atelier via API interne" />
      </section>

      <RootWorkspaceClient />
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
  tone: 'cyan' | 'green' | 'yellow' | 'purple'
  compact?: boolean
}) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={`${styles.statValue} ${compact ? styles.compactValue : ''}`} data-tone={tone}>
        {value}
      </span>
    </div>
  )
}

function Command({ title, value }: { title: string; value: string }) {
  return (
    <div className={styles.command}>
      <span className={styles.commandTitle}>$ {title}</span>
      <span className={styles.commandValue}>{value}</span>
    </div>
  )
}
