import { prisma } from '@/lib/prisma'
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

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ outil?: string; action?: string; statut?: string }>
}) {
  const params = await searchParams
  const logs = await prisma.auditLog.findMany({
    where: {
      outil: params.outil || undefined,
      action: params.action || undefined,
      statut: params.statut || undefined,
    },
    orderBy: { createdAt: 'desc' },
    take: 120,
  })

  return (
    <main className={styles.page}>
      <div className={styles.termHeader}>
        <span className={styles.termPrompt}>root@lysma</span>
        <span>:</span>
        <span className={styles.termCmd}>~/journal</span>
      </div>

      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>audit</span>
          <h1>Journal d'activite</h1>
          <p>Historique des actions sensibles : publication, restauration, acces, messages, erreurs et modifications.</p>
        </div>
        <div className={styles.statCard}>
          <span>lignes</span>
          <strong>{logs.length}</strong>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>// audit_logs</span>
          <span className={styles.panelMeta}>120 derniers evenements</span>
        </div>

        {logs.length === 0 ? (
          <div className={styles.empty}>Aucune action auditee.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>date</th>
                <th>outil</th>
                <th>action</th>
                <th>cible</th>
                <th>acteur</th>
                <th>resume</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{formatDate(log.createdAt)}</td>
                  <td><span className={styles.tag}>{log.outil}</span></td>
                  <td className={log.statut === 'ERROR' ? styles.red : styles.green}>{log.action}</td>
                  <td>
                    <strong>{log.cibleType}</strong>
                    <small>{log.cibleId ?? '-'}</small>
                  </td>
                  <td>{log.acteurEmail ?? log.acteurId ?? 'systeme'}</td>
                  <td>
                    <strong>{log.resume ?? '-'}</strong>
                    {log.erreur ? <small>{log.erreur}</small> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}
