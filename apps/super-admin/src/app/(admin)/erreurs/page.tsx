import { prisma } from '@/lib/prisma'
import styles from './page.module.css'
import { ErrorActions } from './ErrorActions'

export const dynamic = 'force-dynamic'

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)
}

function statusClass(statut: string) {
  if (statut === 'RESOLU') return styles.green
  if (statut === 'IGNORE') return styles.muted
  if (statut === 'EN_COURS') return styles.yellow
  return styles.red
}

export default async function ErreursPage({
  searchParams,
}: {
  searchParams: Promise<{ outil?: string; statut?: string }>
}) {
  const params = await searchParams
  const where = {
    outil: params.outil || undefined,
    statut: params.statut || undefined,
  }

  const [errors, counts] = await Promise.all([
    prisma.errorReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 80,
    }),
    prisma.errorReport.groupBy({
      by: ['statut'],
      _count: { statut: true },
    }),
  ])

  const countMap = new Map(counts.map((item) => [item.statut, item._count.statut]))

  return (
    <main className={styles.page}>
      <div className={styles.termHeader}>
        <span className={styles.termPrompt}>root@lysma</span>
        <span>:</span>
        <span className={styles.termCmd}>~/erreurs</span>
      </div>

      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>observabilite</span>
          <h1>Erreurs outils</h1>
          <p>Reception, suivi et resolution des erreurs remontees par les outils LYSMA.</p>
        </div>
        <div className={styles.statGrid}>
          <div className={styles.statCard}><span>nouvelles</span><strong>{countMap.get('NOUVEAU') ?? 0}</strong></div>
          <div className={styles.statCard}><span>en cours</span><strong>{countMap.get('EN_COURS') ?? 0}</strong></div>
          <div className={styles.statCard}><span>resolues</span><strong>{countMap.get('RESOLU') ?? 0}</strong></div>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>// rapports_erreurs</span>
          <span className={styles.panelMeta}>{errors.length} lignes</span>
        </div>

        {errors.length === 0 ? (
          <div className={styles.empty}>Aucune erreur remontee.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>outil</th>
                <th>statut</th>
                <th>message</th>
                <th>url</th>
                <th>date</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {errors.map((error) => (
                <tr key={error.id}>
                  <td><span className={styles.tag}>{error.outil}</span></td>
                  <td><span className={statusClass(error.statut)}>{error.statut.toLowerCase()}</span></td>
                  <td>
                    <strong>{error.message}</strong>
                    {error.stack ? <small>{error.stack.slice(0, 180)}</small> : null}
                  </td>
                  <td className={styles.url}>{error.url ?? '-'}</td>
                  <td>{formatDate(error.createdAt)}</td>
                  <td><ErrorActions id={error.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}
