import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getLivoGarages } from '@/lib/livo-api'
import { getShowcaseOverviewSites } from '@/lib/site-vitrine-manifest'
import { redirect } from 'next/navigation'
import styles from './page.module.css'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/connexion')

  const [clients, messages, livoGarages, showcaseSites, totalClients, clientsActifs, clientsTrial, messagesNonLus] = await Promise.all([
    prisma.client.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.message.findMany({ where: { statut: 'NOUVEAU' }, orderBy: { createdAt: 'desc' }, take: 5 }),
    getLivoGarages(),
    getShowcaseOverviewSites(),
    prisma.client.count(),
    prisma.client.count({ where: { statut: 'ACTIF' } }),
    prisma.client.count({ where: { statut: 'TRIAL' } }),
    prisma.message.count({ where: { statut: 'NOUVEAU' } }),
  ])

  const stats = {
    total: totalClients,
    actifs: clientsActifs,
    trial: clientsTrial,
    messages: messagesNonLus,
    garages: livoGarages.length,
    sites: showcaseSites.length,
  }

  const now = new Date()

  return (
    <div className={styles.page}>
      <div className={styles.termHeader}>
        <span className={styles.termPrompt}>admin@lysma</span>
        <span className={styles.termCmd}> $ dashboard --status</span>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}> 
        <StatCard label="total_clients" value={stats.total} color="cyan" />
        <StatCard label="abonnements_actifs" value={stats.actifs} color="green" />
        <StatCard label="en_trial" value={stats.trial} color="yellow" />
        <StatCard label="messages_non_lus" value={stats.messages} color={stats.messages > 0 ? 'red' : 'muted'} />
        <StatCard label="garages_livo" value={stats.garages} color="purple" />
        <StatCard label="sites_vitrine" value={stats.sites} color="cyan" />
      </div>

      <div className={styles.grid}>
        {/* Clients récents */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>// clients_récents</span>
            <a href="/clients" className={styles.panelLink}>voir tout →</a>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>nom</th>
                <th>email</th>
                <th>outil</th>
                <th>statut</th>
                <th>créé</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id}>
                  <td><a href={`/clients/${c.id}`} className={styles.link}>{c.nom}</a></td>
                  <td className={styles.muted}>{c.email}</td>
                  <td><span className={styles.tag}>{c.outil}</span></td>
                  <td><StatusDot statut={c.statut} /></td>
                  <td className={styles.muted}>{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr><td colSpan={5} className={styles.empty}>// aucun client</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Messages */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>// messages_entrants</span>
            <a href="/messagerie" className={styles.panelLink}>voir tout →</a>
          </div>
          <div className={styles.messageList}>
            {messages.map(m => (
              <a key={m.id} href="/messagerie" className={styles.messageItem}>
                <div className={styles.messageMeta}>
                  <span className={styles.messageNom}>{m.nom}</span>
                  <span className={styles.messageDot} style={{background:'var(--red)'}} />
                  <span className={styles.messageDate}>
                    {new Date(m.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <p className={styles.messagePreview}>{m.message.slice(0, 80)}...</p>
              </a>
            ))}
            {messages.length === 0 && (
              <div className={styles.empty}>// aucun nouveau message</div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>// livo_garages</span>
            <a href="/livo" className={styles.panelLink}>ouvrir livo →</a>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>garage</th>
                <th>client</th>
                <th>statut</th>
                <th>ca</th>
              </tr>
            </thead>
            <tbody>
              {livoGarages.slice(0, 5).map((garage) => (
                <tr key={garage.id}>
                  <td><a href={`/livo/${garage.id}`} className={styles.link}>{garage.nom}</a></td>
                  <td className={styles.muted}>{garage.owner.prenom} {garage.owner.nom}</td>
                  <td><span className={garage.abonnementActif ? styles.green : garage.trialExpire ? styles.red : styles.yellow}>{garage.abonnementActif ? 'actif' : garage.trialExpire ? 'expire' : 'trial'}</span></td>
                  <td className={styles.muted}>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(garage.stats.caTotal)}</td>
                </tr>
              ))}
              {livoGarages.length === 0 && (
                <tr><td colSpan={4} className={styles.empty}>// aucun garage livo connecte</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>// sites_vitrine</span>
            <a href="/sites" className={styles.panelLink}>ouvrir sites →</a>
          </div>
          <div className={styles.messageList}>
            {showcaseSites.slice(0, 5).map((site) => (
              <a key={site.id} href={`/sites/${site.id}/studio`} className={styles.messageItem}>
                <div className={styles.messageMeta}>
                  <span className={styles.messageNom}>{site.name}</span>
                  <span className={styles.messageDate}>{site.kind}</span>
                </div>
                <p className={styles.messagePreview}>{site.relativePath}</p>
              </a>
            ))}
            {showcaseSites.length === 0 && (
              <div className={styles.empty}>// aucun site vitrine detecte</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    cyan: 'var(--cyan)', green: 'var(--green)',
    yellow: 'var(--yellow)', red: 'var(--red)', muted: 'var(--text-muted)', purple: 'var(--purple)',
  }
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue} style={{color: colors[color]}}>{value}</span>
    </div>
  )
}

function StatusDot({ statut }: { statut: string }) {
  const map: Record<string, {color: string; label: string}> = {
    ACTIF:    { color: 'var(--green)',  label: 'actif' },
    TRIAL:    { color: 'var(--yellow)', label: 'trial' },
    SUSPENDU: { color: 'var(--red)',    label: 'suspendu' },
    RESILIE:  { color: 'var(--text-muted)', label: 'résilié' },
  }
  const s = map[statut] ?? { color: 'var(--text-muted)', label: statut.toLowerCase() }
  return (
    <span style={{display:'flex', alignItems:'center', gap:5}}>
      <span style={{width:6,height:6,borderRadius:'50%',background:s.color,display:'inline-block'}} />
      <span style={{color:s.color, fontSize:11, fontFamily:'var(--font-mono)'}}>{s.label}</span>
    </span>
  )
}
