import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'

export const revalidate = 0

const STATUT_COLOR: Record<string, string> = {
  ACTIF: 'var(--green)', TRIAL: 'var(--yellow)',
  SUSPENDU: 'var(--red)', RESILIE: 'var(--text-muted)',
}

export default async function ClientsPage() {
  const session = await auth()
  if (!session) redirect('/connexion')

  const clients = await prisma.client.findMany({
    include: { acces: true, _count: { select: { messages: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const now = new Date()

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.title}>
          <span className={styles.prompt}>$</span>
          <span className={styles.cmd}>clients --list-all</span>
          <span className={styles.count}>{clients.length} résultats</span>
        </div>
        <Link href="/acces" className={styles.btnNew}>
          + nouveau_client
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>id</th>
            <th>nom</th>
            <th>email</th>
            <th>outil</th>
            <th>statut</th>
            <th>abonnement</th>
            <th>trial_fin</th>
            <th>accès</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(c => {
            const joursRestants = c.trialFinAt
              ? Math.ceil((new Date(c.trialFinAt).getTime() - now.getTime()) / 86400000)
              : null
            const trialExpire = joursRestants !== null && joursRestants < 0

            return (
              <tr key={c.id} className={trialExpire ? styles.rowExpire : ''}>
                <td className={styles.tdId}>{c.id.slice(-8)}</td>
                <td>
                  <Link href={`/clients/${c.id}`} className={styles.link}>{c.nom}</Link>
                  {c.societe && <span className={styles.societe}> ({c.societe})</span>}
                </td>
                <td className={styles.muted}>{c.email}</td>
                <td><span className={styles.tag}>{c.outil}</span></td>
                <td>
                  <span className={styles.statut} style={{color: STATUT_COLOR[c.statut]}}>
                    ● {c.statut.toLowerCase()}
                  </span>
                </td>
                <td className={styles.muted}>{c.abonnement ?? '—'}</td>
                <td>
                  {joursRestants !== null ? (
                    <span style={{color: trialExpire ? 'var(--red)' : joursRestants <= 7 ? 'var(--yellow)' : 'var(--text-muted)', fontSize: 11}}>
                      {trialExpire ? `expiré (${Math.abs(joursRestants)}j)` : `${joursRestants}j`}
                    </span>
                  ) : <span className={styles.muted}>—</span>}
                </td>
                <td className={styles.muted}>{c.acces.length} accès</td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`/clients/${c.id}`} className={styles.actionBtn}>voir</Link>
                  </div>
                </td>
              </tr>
            )
          })}
          {clients.length === 0 && (
            <tr><td colSpan={9} className={styles.empty}>// aucun client enregistré</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
