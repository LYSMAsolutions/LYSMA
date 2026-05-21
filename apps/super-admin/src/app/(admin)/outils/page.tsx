import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getLysmaTools } from '@/lib/tools'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function OutilsPage() {
  const session = await auth()
  if (!session) redirect('/connexion')

  const [tools, clients, accesses] = await Promise.all([
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
  ])

  const clientsByTool = new Map(clients.map((item) => [item.outil, item._count.outil]))

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
