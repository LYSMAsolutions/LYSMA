import { getLivoTrash } from '@/lib/livo-api'
import { fetchPmaTrash } from '@/lib/pma-api'
import { prisma } from '@/lib/prisma'
import styles from './page.module.css'
import { RestoreTrashButton } from './RestoreTrashButton'

export const dynamic = 'force-dynamic'

type TrashItem = {
  id: string
  type: string
  outil: string
  label: string
  garageNom?: string | null
  clientNom?: string | null
  detail?: string | null
  deletedAt?: string | null
  deletedBy?: string | null
  data?: Record<string, unknown>
}

function formatDate(value?: string | null) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export default async function CorbeillePage() {
  const [livoItems, recentRestores] = await Promise.all([
    getLivoTrash() as Promise<TrashItem[]>,
    prisma.auditLog.findMany({
      where: {
        action: 'restore',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 8,
    }),
  ])
  const pmaResult = await fetchPmaTrash()

  const items = [...livoItems, ...((pmaResult.items as TrashItem[]) ?? [])].sort((a, b) => {
    return new Date(b.deletedAt ?? 0).getTime() - new Date(a.deletedAt ?? 0).getTime()
  })

  const livoCount = items.filter((item) => item.outil === 'livo-app').length
  const pmaCount = items.filter((item) => item.outil === 'portail-pma').length

  return (
    <main className={styles.page}>
      <div className={styles.termHeader}>
        <span className={styles.termPrompt}>root@lysma</span>
        <span>:</span>
        <span className={styles.termCmd}>~/corbeille</span>
      </div>

      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>recuperation</span>
          <h1>Corbeille globale</h1>
          <p>
            Les suppressions recuperables des outils sont centralisees ici : absences LIVO, utilisateurs PMA,
            magasins PMA et magasiniers PMA.
          </p>
        </div>
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <span>total</span>
            <strong>{items.length}</strong>
          </div>
          <div className={styles.statCard}>
            <span>livo</span>
            <strong>{livoCount}</strong>
          </div>
          <div className={styles.statCard}>
            <span>pma</span>
            <strong>{pmaCount}</strong>
          </div>
        </div>
      </section>

      {pmaResult.error ? (
        <section className={styles.warning}>
          <strong>PMA indisponible</strong>
          <span>{pmaResult.error}</span>
        </section>
      ) : null}

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>// elements supprimés</span>
          <span className={styles.panelMeta}>multi-outils</span>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>Aucun element recuperable pour le moment.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>outil</th>
                <th>type</th>
                <th>element</th>
                <th>client</th>
                <th>supprime le</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={`${item.outil}-${item.type}-${item.id}`}>
                  <td><span className={styles.tag}>{item.outil}</span></td>
                  <td>{item.type}</td>
                  <td>
                    <strong>{item.label}</strong>
                    <small>{item.detail ?? item.id}</small>
                  </td>
                  <td>{item.garageNom ?? item.clientNom ?? '-'}</td>
                  <td>{formatDate(item.deletedAt)}</td>
                  <td><RestoreTrashButton outil={item.outil} type={item.type} id={item.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>// dernieres restaurations</span>
          <span className={styles.panelMeta}>audit</span>
        </div>

        {recentRestores.length === 0 ? (
          <div className={styles.empty}>Aucune restauration historisee.</div>
        ) : (
          <div className={styles.auditList}>
            {recentRestores.map((entry) => (
              <article key={entry.id} className={styles.auditItem}>
                <div>
                  <strong>{entry.outil}</strong>
                  <span>{entry.resume ?? entry.action}</span>
                </div>
                <time>{formatDate(entry.createdAt.toISOString())}</time>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
