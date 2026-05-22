import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'

export const revalidate = 0

const STATUT_COLOR: Record<string, string> = {
  ACTIF: 'var(--green)',
  TRIAL: 'var(--yellow)',
  SUSPENDU: 'var(--red)',
  RESILIE: 'var(--text-muted)',
}

type ClientsPageProps = {
  searchParams?: Promise<{
    q?: string
    outil?: string
    statut?: string
  }>
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const session = await auth()
  if (!session) redirect('/connexion')

  const params = await searchParams
  const q = params?.q?.trim() ?? ''
  const outil = params?.outil?.trim() ?? ''
  const statut = params?.statut?.trim() ?? ''
  const now = new Date()
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 86400000)

  const where = {
    ...(outil ? { outil } : {}),
    ...(statut ? { statut: statut as 'TRIAL' | 'ACTIF' | 'SUSPENDU' | 'RESILIE' } : {}),
    ...(q
      ? {
          OR: [
            { nom: { contains: q, mode: 'insensitive' as const } },
            { email: { contains: q, mode: 'insensitive' as const } },
            { societe: { contains: q, mode: 'insensitive' as const } },
            { telephone: { contains: q, mode: 'insensitive' as const } },
            { notes: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const [clients, statusGroups, outilGroups, totalClients, actifs, trials, trialAttention, messagesNouveaux] =
    await Promise.all([
      prisma.client.findMany({
        where,
        include: { acces: true, _count: { select: { messages: true } } },
        orderBy: { createdAt: 'desc' },
        take: 200,
      }),
      prisma.client.groupBy({ by: ['statut'], _count: { statut: true } }),
      prisma.client.groupBy({ by: ['outil'], _count: { outil: true }, orderBy: { outil: 'asc' } }),
      prisma.client.count(),
      prisma.client.count({ where: { statut: 'ACTIF' } }),
      prisma.client.count({ where: { statut: 'TRIAL' } }),
      prisma.client.count({
        where: {
          statut: 'TRIAL',
          trialFinAt: { lte: sevenDaysFromNow },
        },
      }),
      prisma.message.count({ where: { statut: 'NOUVEAU' } }),
    ])

  const statusMap = new Map(statusGroups.map((item) => [item.statut, item._count.statut]))

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <div className={styles.termHeader}>
            <span className={styles.prompt}>super-admin</span>
            <span className={styles.cmd}> $ clients --control-center</span>
          </div>
          <h1>Pilotage clients</h1>
          <p>
            Controle des comptes, acces, essais, messages et signaux faibles sur tous les outils LYSMA.
          </p>
        </div>
        <div className={styles.heroActions}>
          <Link href="/acces" className={styles.btnNew}>Nouvel acces</Link>
          <Link href="/messagerie" className={styles.btnGhost}>Messages</Link>
        </div>
      </section>

      <section className={styles.statsGrid} aria-label="Indicateurs clients">
        <StatCard label="clients_total" value={totalClients} tone="cyan" />
        <StatCard label="actifs" value={actifs} tone="green" />
        <StatCard label="essais" value={trials} tone="yellow" />
        <StatCard label="trial_a_surveillance" value={trialAttention} tone={trialAttention > 0 ? 'red' : 'muted'} />
        <StatCard label="messages_nouveaux" value={messagesNouveaux} tone={messagesNouveaux > 0 ? 'red' : 'muted'} />
      </section>

      <form className={styles.filters}>
        <label className={styles.searchBox}>
          <span>Recherche</span>
          <input
            name="q"
            defaultValue={q}
            placeholder="Nom, email, societe, telephone, note..."
          />
        </label>
        <label>
          <span>Outil</span>
          <select name="outil" defaultValue={outil}>
            <option value="">Tous les outils</option>
            {outilGroups.map((item) => (
              <option key={item.outil} value={item.outil}>
                {item.outil} ({item._count.outil})
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Statut</span>
          <select name="statut" defaultValue={statut}>
            <option value="">Tous les statuts</option>
            <option value="TRIAL">Trial ({statusMap.get('TRIAL') ?? 0})</option>
            <option value="ACTIF">Actif ({statusMap.get('ACTIF') ?? 0})</option>
            <option value="SUSPENDU">Suspendu ({statusMap.get('SUSPENDU') ?? 0})</option>
            <option value="RESILIE">Resilie ({statusMap.get('RESILIE') ?? 0})</option>
          </select>
        </label>
        <button type="submit" className={styles.btnNew}>Filtrer</button>
        <Link href="/clients" className={styles.btnGhost}>Reinitialiser</Link>
      </form>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span className={styles.panelTitle}>// clients_controles</span>
            <p>{clients.length} resultat{clients.length > 1 ? 's' : ''} affiches sur 200 maximum.</p>
          </div>
          <Link href="/corbeille" className={styles.panelLink}>corbeille & traces</Link>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>client</th>
              <th>contact</th>
              <th>outil</th>
              <th>statut</th>
              <th>abonnement</th>
              <th>trial</th>
              <th>signaux</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const joursRestants = client.trialFinAt
                ? Math.ceil((new Date(client.trialFinAt).getTime() - now.getTime()) / 86400000)
                : null
              const trialExpire = joursRestants !== null && joursRestants < 0
              const trialUrgent = joursRestants !== null && joursRestants >= 0 && joursRestants <= 7

              return (
                <tr key={client.id} className={trialExpire ? styles.rowExpire : ''}>
                  <td>
                    <Link href={`/clients/${client.id}`} className={styles.link}>{client.nom}</Link>
                    <span className={styles.id}>#{client.id.slice(-8)}</span>
                    {client.societe && <span className={styles.societe}>{client.societe}</span>}
                  </td>
                  <td>
                    <span className={styles.primary}>{client.email}</span>
                    <span className={styles.muted}>{client.telephone ?? 'telephone non renseigne'}</span>
                  </td>
                  <td><span className={styles.tag}>{client.outil}</span></td>
                  <td>
                    <span className={styles.statut} style={{ color: STATUT_COLOR[client.statut] }}>
                      {client.statut.toLowerCase()}
                    </span>
                  </td>
                  <td>
                    <span className={client.abonnementActif ? styles.green : styles.muted}>
                      {client.abonnementActif ? 'actif' : 'inactif'}
                    </span>
                    <span className={styles.muted}>{client.abonnement ?? 'aucune offre'}</span>
                  </td>
                  <td>
                    {joursRestants !== null ? (
                      <span className={trialExpire ? styles.red : trialUrgent ? styles.yellow : styles.muted}>
                        {trialExpire ? `expire depuis ${Math.abs(joursRestants)}j` : `${joursRestants}j restants`}
                      </span>
                    ) : (
                      <span className={styles.muted}>non defini</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.signalList}>
                      <span>{client.acces.length} acces</span>
                      <span>{client._count.messages} messages</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/clients/${client.id}`} className={styles.actionBtn}>Piloter</Link>
                      <Link href={`/acces?client=${client.id}`} className={styles.actionBtn}>Acces</Link>
                      <Link href="/messagerie" className={styles.actionBtn}>Support</Link>
                    </div>
                  </td>
                </tr>
              )
            })}
            {clients.length === 0 && (
              <tr>
                <td colSpan={8} className={styles.empty}>// aucun client ne correspond aux filtres</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={`${styles.statValue} ${styles[tone] ?? ''}`}>{value}</span>
    </div>
  )
}
