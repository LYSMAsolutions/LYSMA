import { prisma } from '@/lib/prisma'
import { Badge, StatCard, PageHeader } from '@/components/ui'
import { ErrorActions } from './ErrorActions'
import styles from './page.module.css'

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

function statutToBadge(statut: string): 'error' | 'warning' | 'success' | 'muted' {
  if (statut === 'RESOLU') return 'success'
  if (statut === 'IGNORE') return 'muted'
  if (statut === 'EN_COURS') return 'warning'
  return 'error'
}

function statutLabel(statut: string) {
  const map: Record<string, string> = {
    NOUVEAU: 'Nouveau',
    EN_COURS: 'En cours',
    RESOLU: 'Résolu',
    IGNORE: 'Ignoré',
  }
  return map[statut] ?? statut
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
      <PageHeader
        title="Erreurs outils"
        description="Réception, suivi et résolution des erreurs remontées par les outils LYSMA."
      />

      <div className={styles.statsGrid}>
        <StatCard
          label="Nouvelles"
          value={countMap.get('NOUVEAU') ?? 0}
          color={(countMap.get('NOUVEAU') ?? 0) > 0 ? 'red' : 'muted'}
        />
        <StatCard
          label="En cours"
          value={countMap.get('EN_COURS') ?? 0}
          color={(countMap.get('EN_COURS') ?? 0) > 0 ? 'yellow' : 'muted'}
        />
        <StatCard
          label="Résolues"
          value={countMap.get('RESOLU') ?? 0}
          color="green"
        />
      </div>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>Rapports d&apos;erreurs</span>
          <span className={styles.panelMeta}>{errors.length} entrées</span>
        </div>

        {errors.length === 0 ? (
          <div className={styles.empty}>Aucune erreur remontée.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Outil</th>
                <th>Statut</th>
                <th>Message</th>
                <th>URL</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {errors.map((error) => (
                <tr key={error.id}>
                  <td><span className={styles.tag}>{error.outil}</span></td>
                  <td>
                    <Badge variant={statutToBadge(error.statut)}>
                      {statutLabel(error.statut)}
                    </Badge>
                  </td>
                  <td>
                    <span className={styles.errorMessage}>{error.message}</span>
                    {error.stack && (
                      <span className={styles.errorStack}>{error.stack.slice(0, 180)}</span>
                    )}
                  </td>
                  <td><span className={styles.url}>{error.url ?? '—'}</span></td>
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
