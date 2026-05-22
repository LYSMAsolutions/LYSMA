import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getLivoGarages } from '@/lib/livo-api'
import { getPublishingStatus } from '@/lib/publishing'
import { getShowcaseOverviewSites } from '@/lib/site-vitrine-manifest'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'

export const revalidate = 0

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/connexion')

  const [
    clients,
    messages,
    livoGarages,
    showcaseSites,
    totalClients,
    clientsActifs,
    clientsTrial,
    messagesNonLus,
    erreursOuvertes,
    auditLogs,
  ] = await Promise.all([
    prisma.client.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.message.findMany({ where: { statut: 'NOUVEAU' }, orderBy: { createdAt: 'desc' }, take: 6 }),
    getLivoGarages(),
    getShowcaseOverviewSites(),
    prisma.client.count(),
    prisma.client.count({ where: { statut: 'ACTIF' } }),
    prisma.client.count({ where: { statut: 'TRIAL' } }),
    prisma.message.count({ where: { statut: 'NOUVEAU' } }),
    prisma.errorReport.count({ where: { statut: { not: 'RESOLU' } } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 7 }),
  ])

  const publishing = getPublishingStatus()
  const trialUrgents = clients.filter((client) => {
    if (client.statut !== 'TRIAL' || !client.trialFinAt) return false
    const days = Math.ceil((new Date(client.trialFinAt).getTime() - Date.now()) / 86400000)
    return days <= 7
  }).length

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <div className={styles.termHeader}>
            <span className={styles.termPrompt}>admin@lysma</span>
            <span className={styles.termCmd}> $ dashboard --pilotage-total</span>
          </div>
          <h1>Centre de controle LYSMA</h1>
          <p>
            Vue globale pour surveiller les clients, les outils, les sites vitrines, les messages,
            les erreurs et les actions recentes.
          </p>
        </div>
        <div className={styles.quickActions}>
          <Link href="/clients" className={styles.primaryAction}>Clients</Link>
          <Link href="/erreurs" className={styles.secondaryAction}>Erreurs</Link>
          <Link href="/sites" className={styles.secondaryAction}>Sites</Link>
        </div>
      </section>

      <section className={styles.statsGrid} aria-label="Indicateurs de supervision">
        <StatCard label="clients_total" value={totalClients} color="cyan" />
        <StatCard label="abonnements_actifs" value={clientsActifs} color="green" />
        <StatCard label="en_trial" value={clientsTrial} color={trialUrgents > 0 ? 'yellow' : 'muted'} />
        <StatCard label="messages_non_lus" value={messagesNonLus} color={messagesNonLus > 0 ? 'red' : 'muted'} />
        <StatCard label="erreurs_ouvertes" value={erreursOuvertes} color={erreursOuvertes > 0 ? 'red' : 'green'} />
        <StatCard label="sites_vitrine" value={showcaseSites.length} color="purple" />
      </section>

      <section className={styles.commandGrid}>
        <CommandCard
          title="GitHub"
          value={publishing.githubReady ? 'configure' : 'a connecter'}
          detail={`${publishing.repository} / ${publishing.branch}`}
          href="/sites"
          tone={publishing.githubReady ? 'green' : 'yellow'}
        />
        <CommandCard
          title="Vercel"
          value={publishing.vercelReady ? 'hooks prets' : 'hooks absents'}
          detail="Publication sites vitrines et redeploiements manuels"
          href="/outils"
          tone={publishing.vercelReady ? 'green' : 'yellow'}
        />
        <CommandCard
          title="Restaurations"
          value="corbeille"
          detail="Actions auditees, suppressions et retours arriere"
          href="/corbeille"
          tone="cyan"
        />
        <CommandCard
          title="Journal"
          value={`${auditLogs.length} actions`}
          detail="Dernieres operations tracees dans super-admin"
          href="/journal"
          tone="purple"
        />
      </section>

      <section className={styles.grid}>
        <Panel title="// clients_recents" href="/clients" linkLabel="voir tout">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>nom</th>
                <th>outil</th>
                <th>statut</th>
                <th>cree</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <Link href={`/clients/${client.id}`} className={styles.link}>{client.nom}</Link>
                    <span className={styles.muted}>{client.email}</span>
                  </td>
                  <td><span className={styles.tag}>{client.outil}</span></td>
                  <td><StatusDot statut={client.statut} /></td>
                  <td className={styles.muted}>{formatDate(client.createdAt)}</td>
                </tr>
              ))}
              {clients.length === 0 && <EmptyRow colSpan={4} label="// aucun client" />}
            </tbody>
          </table>
        </Panel>

        <Panel title="// messages_entrants" href="/messagerie" linkLabel="ouvrir">
          <div className={styles.messageList}>
            {messages.map((message) => (
              <Link key={message.id} href="/messagerie" className={styles.messageItem}>
                <div className={styles.messageMeta}>
                  <span className={styles.messageNom}>{message.nom}</span>
                  <span className={styles.messageTool}>{message.outil}</span>
                  <span className={styles.messageDate}>{formatDate(message.createdAt)}</span>
                </div>
                <p className={styles.messagePreview}>{message.message}</p>
              </Link>
            ))}
            {messages.length === 0 && <div className={styles.empty}>// aucun nouveau message</div>}
          </div>
        </Panel>
      </section>

      <section className={styles.grid}>
        <Panel title="// livo_garages" href="/livo" linkLabel="ouvrir livo">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>garage</th>
                <th>client</th>
                <th>statut</th>
                <th>ca</th>
              </tr>
            </thead>
            <tbody>
              {livoGarages.slice(0, 6).map((garage) => (
                <tr key={garage.id}>
                  <td><Link href={`/livo/${garage.id}`} className={styles.link}>{garage.nom}</Link></td>
                  <td className={styles.muted}>{garage.owner.prenom} {garage.owner.nom}</td>
                  <td>
                    <span className={garage.abonnementActif ? styles.green : garage.trialExpire ? styles.red : styles.yellow}>
                      {garage.abonnementActif ? 'actif' : garage.trialExpire ? 'expire' : 'trial'}
                    </span>
                  </td>
                  <td className={styles.muted}>{formatEuro(garage.stats.caTotal)}</td>
                </tr>
              ))}
              {livoGarages.length === 0 && <EmptyRow colSpan={4} label="// aucun garage livo connecte" />}
            </tbody>
          </table>
        </Panel>

        <Panel title="// sites_vitrine" href="/sites" linkLabel="studio">
          <div className={styles.siteList}>
            {showcaseSites.slice(0, 6).map((site) => (
              <Link key={site.id} href={`/sites/${site.id}/studio`} className={styles.siteItem}>
                <span>
                  <strong>{site.name}</strong>
                  <small>{site.relativePath}</small>
                </span>
                <em>{site.kind}</em>
              </Link>
            ))}
            {showcaseSites.length === 0 && <div className={styles.empty}>// aucun site vitrine detecte</div>}
          </div>
        </Panel>
      </section>

      <Panel title="// journal_recent" href="/journal" linkLabel="historique complet">
        <div className={styles.auditList}>
          {auditLogs.map((log) => (
            <Link key={log.id} href="/journal" className={styles.auditItem}>
              <span className={styles.auditAction}>{log.action}</span>
              <span className={styles.muted}>{log.outil} / {log.cibleType}</span>
              <span className={log.statut === 'SUCCESS' ? styles.green : styles.red}>{log.statut.toLowerCase()}</span>
              <span className={styles.muted}>{formatDateTime(log.createdAt)}</span>
            </Link>
          ))}
          {auditLogs.length === 0 && <div className={styles.empty}>// aucune action tracee</div>}
        </div>
      </Panel>
    </div>
  )
}

function Panel({
  title,
  href,
  linkLabel,
  children,
}: {
  title: string
  href: string
  linkLabel: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>{title}</span>
        <Link href={href} className={styles.panelLink}>{linkLabel}</Link>
      </div>
      {children}
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={`${styles.statValue} ${styles[color] ?? ''}`}>{value}</span>
    </div>
  )
}

function CommandCard({
  title,
  value,
  detail,
  href,
  tone,
}: {
  title: string
  value: string
  detail: string
  href: string
  tone: string
}) {
  return (
    <Link href={href} className={styles.commandCard}>
      <span className={styles.commandTitle}>{title}</span>
      <strong className={styles[tone] ?? ''}>{value}</strong>
      <small>{detail}</small>
    </Link>
  )
}

function StatusDot({ statut }: { statut: string }) {
  const map: Record<string, { color: string; label: string }> = {
    ACTIF: { color: 'var(--green)', label: 'actif' },
    TRIAL: { color: 'var(--yellow)', label: 'trial' },
    SUSPENDU: { color: 'var(--red)', label: 'suspendu' },
    RESILIE: { color: 'var(--text-muted)', label: 'resilie' },
  }
  const current = map[statut] ?? { color: 'var(--text-muted)', label: statut.toLowerCase() }
  return (
    <span className={styles.statusDot} style={{ color: current.color }}>
      {current.label}
    </span>
  )
}

function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className={styles.empty}>{label}</td>
    </tr>
  )
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('fr-FR').format(value)
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)
}

function formatEuro(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}
