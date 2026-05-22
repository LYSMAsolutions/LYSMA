import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getLysmaTools } from '@/lib/tools'
import { getShowcaseOverviewSites } from '@/lib/site-vitrine-manifest'
import { getPublishingStatus } from '@/lib/publishing'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function OutilsPage() {
  const session = await auth()
  if (!session) redirect('/connexion')

  const [tools, clients, accesses, showcaseSites] = await Promise.all([
    getLysmaTools(),
    prisma.client.groupBy({
      by: ['outil'],
      _count: { outil: true },
    }),
    prisma.acces.findMany({
      include: { client: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    getShowcaseOverviewSites(),
  ])

  const clientsByTool = new Map(clients.map((item) => [item.outil, item._count.outil]))
  const publishing = getPublishingStatus()
  const sitesWithDeployHook = showcaseSites.filter((site) => getPublishingStatus(site.id).vercelReady).length
  const health = [
    {
      label: 'github_publication',
      status: publishing.githubReady ? 'ready' : 'missing',
      detail: publishing.githubReady ? `${publishing.repository} / ${publishing.branch}` : 'GITHUB_TOKEN + repository manquants',
    },
    {
      label: 'vercel_sites',
      status: sitesWithDeployHook === showcaseSites.length && showcaseSites.length > 0 ? 'ready' : sitesWithDeployHook > 0 ? 'partial' : 'missing',
      detail: `${sitesWithDeployHook}/${showcaseSites.length} deploy hook configure`,
    },
    {
      label: 'livo_bridge',
      status: process.env.LIVO_API_URL && process.env.INTERNAL_API_KEY ? 'ready' : 'missing',
      detail: process.env.LIVO_API_URL ? process.env.LIVO_API_URL : 'LIVO_API_URL absent',
    },
    {
      label: 'pma_bridge',
      status: process.env.PMA_PORTAL_URL && process.env.INTERNAL_API_KEY ? 'ready' : 'missing',
      detail: process.env.PMA_PORTAL_URL ? process.env.PMA_PORTAL_URL : 'PMA_PORTAL_URL absent',
    },
    {
      label: 'super_admin_db',
      status: process.env.DATABASE_URL ? 'ready' : 'missing',
      detail: process.env.DATABASE_URL ? 'DATABASE_URL configure' : 'DATABASE_URL absent',
    },
  ]

  return (
    <main className={styles.page}>
      <div className={styles.termHeader}>
        <span className={styles.termPrompt}>admin@lysma</span>
        <span className={styles.termCmd}> $ outils --inventory --access</span>
      </div>

      <section className={styles.grid}>
        {tools.map((tool) => (
          <article key={tool.id} className={styles.card} data-status={tool.status}>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.kind}>{tool.kind}</span>
                <h2>{tool.name}</h2>
              </div>
              <span className={styles.status}>{tool.status}</span>
            </div>

            <dl className={styles.meta}>
              <div>
                <dt>chemin</dt>
                <dd>{tool.relativePath}</dd>
              </div>
              <div>
                <dt>commande</dt>
                <dd><code>{tool.command}</code></dd>
              </div>
              <div>
                <dt>clients</dt>
                <dd>{clientsByTool.get(tool.id) ?? 0}</dd>
              </div>
              {tool.envFile && (
                <div>
                  <dt>env</dt>
                  <dd>{tool.envFile}</dd>
                </div>
              )}
            </dl>

            {tool.notes.length > 0 && (
              <div className={styles.notes}>
                {tool.notes.map((note) => <span key={note}>{note}</span>)}
              </div>
            )}

            <div className={styles.actions}>
              {tool.id === 'livo-app' && <Link href="/livo">ouvrir</Link>}
              {tool.id === 'sites-vitrine' && <Link href="/sites">ouvrir</Link>}
              {tool.id === 'portail-pma' && <Link href="/pma">ouvrir pma</Link>}
              {tool.id === 'portail-pma' && <Link href="/clients?outil=portail-pma">clients</Link>}
              <Link href="/acces">acces</Link>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span>// sante_publication</span>
          <span>github / vercel / api internes</span>
        </div>

        <div className={styles.healthGrid}>
          {health.map((item) => (
            <article key={item.label} className={styles.healthCard} data-status={item.status}>
              <span>{item.label}</span>
              <strong>{item.status}</strong>
              <small>{item.detail}</small>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span>// derniers_acces</span>
          <Link href="/acces">voir tout</Link>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>email</th>
              <th>client</th>
              <th>outil</th>
              <th>cree</th>
            </tr>
          </thead>
          <tbody>
            {accesses.map((access) => (
              <tr key={access.id}>
                <td>{access.email}</td>
                <td><Link href={`/clients/${access.clientId}`}>{access.client.nom}</Link></td>
                <td>{access.client.outil}</td>
                <td>{new Date(access.createdAt).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
            {accesses.length === 0 && (
              <tr><td colSpan={4} className={styles.empty}>// aucun acces</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  )
}
