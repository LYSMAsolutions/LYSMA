import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Badge, StatCard, PageHeader } from '@/components/ui'
import styles from './page.module.css'

export const revalidate = 0

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
        where: { statut: 'TRIAL', trialFinAt: { lte: sevenDaysFromNow } },
      }),
      prisma.message.count({ where: { statut: 'NOUVEAU' } }),
    ])

  const statusMap = new Map(statusGroups.map((item) => [item.statut, item._count.statut]))

  return (
    <div className={styles.page}>
      <PageHeader
        title="Pilotage clients"
        description="Gestion des comptes, accès, essais et messages sur tous les outils LYSMA."
      >
        <Link href="/acces" className={styles.btnPrimary}>Nouvel accès</Link>
        <Link href="/messagerie" className={styles.btnSecondary}>Messages</Link>
      </PageHeader>

      <section className={styles.statsGrid} aria-label="Indicateurs clients">
        <StatCard label="Clients total" value={totalClients} color="cyan" />
        <StatCard label="Actifs" value={actifs} color="green" />
        <StatCard label="Essais" value={trials} color="yellow" />
        <StatCard label="Trials à surveiller" value={trialAttention} color={trialAttention > 0 ? 'red' : 'muted'} />
        <StatCard label="Messages nouveaux" value={messagesNouveaux} color={messagesNouveaux > 0 ? 'red' : 'muted'} />
      </section>

      <form className={styles.filters}>
        <label>
          <span>Recherche</span>
          <input name="q" defaultValue={q} placeholder="Nom, email, société, téléphone, note…" />
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
            <option value="RESILIE">Résilié ({statusMap.get('RESILIE') ?? 0})</option>
          </select>
        </label>
        <button type="submit" className={styles.btnFilter}>Filtrer</button>
        <Link href="/clients" className={styles.btnReset}>Réinitialiser</Link>
      </form>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>
            {clients.length} résultat{clients.length > 1 ? 's' : ''} sur 200 max
          </span>
          <Link href="/corbeille" className={styles.panelLink}>Corbeille & traces</Link>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client</th>
              <th>Contact</th>
              <th>Outil</th>
              <th>Statut</th>
              <th>Abonnement</th>
              <th>Trial</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const joursRestants = client.trialFinAt
                ? Math.ceil((new Date(client.trialFinAt).getTime() - now.getTime()) / 86400000)
                : null
              const trialExpire = joursRestants !== null && joursRestants < 0
              const trialUrgent = joursRestants !== null && joursRestants >= 0 && joursRestants <= 7

              const statutVariant = {
                ACTIF: 'success',
                TRIAL: 'warning',
                SUSPENDU: 'error',
                RESILIE: 'muted',
              }[client.statut] as 'success' | 'warning' | 'error' | 'muted' ?? 'muted'

              return (
                <tr key={client.id} className={trialExpire ? styles.rowExpire : ''}>
                  <td>
                    <Link href={`/clients/${client.id}`} className={styles.clientName}>{client.nom}</Link>
                    {client.societe && <span className={styles.muted}>{client.societe}</span>}
                    <span className={styles.muted}>#{client.id.slice(-8)}</span>
                  </td>
                  <td>
                    <span>{client.email}</span>
                    <span className={styles.muted}>{client.telephone ?? '—'}</span>
                  </td>
                  <td><span className={styles.tag}>{client.outil}</span></td>
                  <td>
                    <Badge variant={statutVariant}>
                      {client.statut.charAt(0) + client.statut.slice(1).toLowerCase()}
                    </Badge>
                  </td>
                  <td>
                    <Badge variant={client.abonnementActif ? 'success' : 'muted'}>
                      {client.abonnementActif ? 'Actif' : 'Inactif'}
                    </Badge>
                    {client.abonnement && <span className={styles.muted}>{client.abonnement}</span>}
                  </td>
                  <td>
                    {joursRestants !== null ? (
                      <Badge variant={trialExpire ? 'error' : trialUrgent ? 'warning' : 'muted'}>
                        {trialExpire
                          ? `expiré ${Math.abs(joursRestants)}j`
                          : `${joursRestants}j`}
                      </Badge>
                    ) : (
                      <span className={styles.muted}>—</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/clients/${client.id}`} className={styles.actionBtn}>Piloter</Link>
                      <Link href={`/acces?client=${client.id}`} className={styles.actionBtn}>Accès</Link>
                      <Link href="/messagerie" className={styles.actionBtn}>Support</Link>
                    </div>
                  </td>
                </tr>
              )
            })}
            {clients.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.empty}>Aucun client ne correspond aux filtres</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}
