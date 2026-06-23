import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getLivoGarages } from '@/lib/livo-api'
import { getPublishingStatus } from '@/lib/publishing'
import { getShowcaseOverviewSites } from '@/lib/site-vitrine-manifest'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Badge, StatCard, PageHeader } from '@/components/ui'
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
  const githubDetail = publishing.githubReady
    ? publishing.publishBranch && publishing.publishBranch !== publishing.branch
      ? `${publishing.repository} / ${publishing.branch} → ${publishing.publishBranch}`
      : `${publishing.repository} / ${publishing.branch}`
    : 'GITHUB_TOKEN + repository manquants'

  const trialUrgents = clients.filter((client) => {
    if (client.statut !== 'TRIAL' || !client.trialFinAt) return false
    const days = Math.ceil((new Date(client.trialFinAt).getTime() - Date.now()) / 86400000)
    return days <= 7
  }).length

  return (
    <div className={styles.page}>
      <PageHeader
        title="Centre de contrôle LYSMA"
        description="Vue globale : clients, outils, sites vitrines, messages, erreurs et actions récentes."
      >
        <Link href="/clients" className={styles.btnPrimary}>Clients</Link>
        <Link href="/erreurs" className={styles.btnSecondary}>Erreurs</Link>
        <Link href="/sites" className={styles.btnSecondary}>Sites</Link>
      </PageHeader>

      <section className={styles.statsGrid} aria-label="Indicateurs de supervision">
        <StatCard label="Clients total" value={totalClients} color="cyan" />
        <StatCard label="Abonnements actifs" value={clientsActifs} color="green" />
        <StatCard label="En trial" value={clientsTrial} color={trialUrgents > 0 ? 'yellow' : 'muted'} />
        <StatCard label="Messages non lus" value={messagesNonLus} color={messagesNonLus > 0 ? 'red' : 'muted'} />
        <StatCard label="Erreurs ouvertes" value={erreursOuvertes} color={erreursOuvertes > 0 ? 'red' : 'green'} />
        <StatCard label="Sites vitrine" value={showcaseSites.length} color="purple" />
      </section>

      <section className={styles.commandGrid}>
        <Link href="/sites" className={styles.commandCard}>
          <span className={styles.commandLabel}>GitHub</span>
          <strong className={`${styles.commandValue} ${publishing.githubReady ? styles.colorGreen : styles.colorYellow}`}>
            {publishing.githubReady ? 'Configuré' : 'À connecter'}
          </strong>
          <span className={styles.commandDetail}>{githubDetail}</span>
        </Link>
        <Link href="/outils" className={styles.commandCard}>
          <span className={styles.commandLabel}>Vercel</span>
          <strong className={`${styles.commandValue} ${publishing.vercelReady ? styles.colorGreen : styles.colorYellow}`}>
            {publishing.vercelReady ? 'Hooks prêts' : 'Hooks absents'}
          </strong>
          <span className={styles.commandDetail}>Publication sites vitrines et redéploiements manuels</span>
        </Link>
        <Link href="/corbeille" className={styles.commandCard}>
          <span className={styles.commandLabel}>Restaurations</span>
          <strong className={`${styles.commandValue} ${styles.colorCyan}`}>Corbeille</strong>
          <span className={styles.commandDetail}>Actions auditées, suppressions et retours arrière</span>
        </Link>
        <Link href="/journal" className={styles.commandCard}>
          <span className={styles.commandLabel}>Journal</span>
          <strong className={`${styles.commandValue} ${styles.colorPurple}`}>{auditLogs.length} actions</strong>
          <span className={styles.commandDetail}>Dernières opérations tracées dans super-admin</span>
        </Link>
      </section>

      <section className={styles.grid}>
        <Panel title="Clients récents" href="/clients" linkLabel="Voir tout">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Outil</th>
                <th>Statut</th>
                <th>Créé</th>
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
                  <td><ClientBadge statut={client.statut} /></td>
                  <td className={styles.muted}>{formatDate(client.createdAt)}</td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr><td colSpan={4} className={styles.empty}>Aucun client</td></tr>
              )}
            </tbody>
          </table>
        </Panel>

        <Panel title="Messages entrants" href="/messagerie" linkLabel="Ouvrir">
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
            {messages.length === 0 && <div className={styles.empty}>Aucun nouveau message</div>}
          </div>
        </Panel>
      </section>

      <section className={styles.grid}>
        <Panel title="Garages LIVO" href="/livo" linkLabel="Ouvrir LIVO">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Garage</th>
                <th>Client</th>
                <th>Statut</th>
                <th>CA</th>
              </tr>
            </thead>
            <tbody>
              {livoGarages.slice(0, 6).map((garage) => (
                <tr key={garage.id}>
                  <td><Link href={`/livo/${garage.id}`} className={styles.link}>{garage.nom}</Link></td>
                  <td className={styles.muted}>{garage.owner.prenom} {garage.owner.nom}</td>
                  <td>
                    <Badge variant={garage.abonnementActif ? 'success' : garage.trialExpire ? 'error' : 'warning'}>
                      {garage.abonnementActif ? 'Actif' : garage.trialExpire ? 'Expiré' : 'Trial'}
                    </Badge>
                  </td>
                  <td className={styles.muted}>{formatEuro(garage.stats.caTotal)}</td>
                </tr>
              ))}
              {livoGarages.length === 0 && (
                <tr><td colSpan={4} className={styles.empty}>Aucun garage LIVO connecté</td></tr>
              )}
            </tbody>
          </table>
        </Panel>

        <Panel title="Sites vitrine" href="/sites" linkLabel="Studio">
          <div className={styles.siteList}>
            {showcaseSites.slice(0, 6).map((site) => (
              <Link key={site.id} href={`/sites/${site.id}/studio`} className={styles.siteItem}>
                <span>
                  <span className={styles.siteName}>{site.name}</span>
                  <span className={styles.sitePath}>{site.relativePath}</span>
                </span>
                <span className={styles.siteKind}>{site.kind}</span>
              </Link>
            ))}
            {showcaseSites.length === 0 && <div className={styles.empty}>Aucun site vitrine détecté</div>}
          </div>
        </Panel>
      </section>

      <Panel title="Journal récent" href="/journal" linkLabel="Historique complet">
        <div className={styles.auditList}>
          {auditLogs.map((log) => (
            <Link key={log.id} href="/journal" className={styles.auditItem}>
              <span className={styles.auditAction}>{log.action}</span>
              <span className={styles.muted}>{log.outil} / {log.cibleType}</span>
              <Badge variant={log.statut === 'SUCCESS' ? 'success' : 'error'}>
                {log.statut.toLowerCase()}
              </Badge>
              <span className={styles.muted}>{formatDateTime(log.createdAt)}</span>
            </Link>
          ))}
          {auditLogs.length === 0 && <div className={styles.empty}>Aucune action tracée</div>}
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

function ClientBadge({ statut }: { statut: string }) {
  const variantMap: Record<string, 'success' | 'warning' | 'error' | 'muted'> = {
    ACTIF: 'success',
    TRIAL: 'warning',
    SUSPENDU: 'error',
    RESILIE: 'muted',
  }
  const labelMap: Record<string, string> = {
    ACTIF: 'Actif',
    TRIAL: 'Trial',
    SUSPENDU: 'Suspendu',
    RESILIE: 'Résilié',
  }
  return (
    <Badge variant={variantMap[statut] ?? 'muted'}>
      {labelMap[statut] ?? statut.toLowerCase()}
    </Badge>
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
