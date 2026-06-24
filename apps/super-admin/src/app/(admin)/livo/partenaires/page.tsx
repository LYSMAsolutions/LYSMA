import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getLivoPartners } from '@/lib/livo-api'
import Link from 'next/link'
import { StatCard, PageHeader, Badge } from '@/components/ui'
import { CreatePartnerForm } from './CreatePartnerForm'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function PartenairesPage() {
  const session = await auth()
  if (!session) redirect('/connexion')

  const partners = await getLivoPartners()

  const actifs = partners.filter(p => p.active)
  const totalIntegrations = partners.reduce((acc, p) => acc + p.integrationsCount, 0)

  return (
    <div className={styles.page}>
      <PageHeader
        title="Partenaires QR"
        description="Éditeurs de logiciels de facturation intégrés."
      >
        <Link href="/livo/integrations" className={styles.btnSecondary}>← Retour Intégrations</Link>
      </PageHeader>

      <div className={styles.statsGrid}>
        <StatCard label="Total partenaires" value={partners.length} color="cyan" />
        <StatCard label="Actifs" value={actifs.length} color="green" />
        <StatCard label="Total intégrations" value={totalIntegrations} color="muted" />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Partenaires enregistrés</h2>
          <CreatePartnerForm />
        </div>

        {partners.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyTitle}>Aucun partenaire enregistré</span>
            <span className={styles.emptyDesc}>Ajoutez un premier partenaire pour commencer.</span>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Clé partenaire</th>
                  <th>Intégrations</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((p) => {
                  const keyMasked = p.key.length > 8
                    ? p.key.slice(0, 8) + '…' + p.key.slice(-4)
                    : p.key
                  return (
                    <tr key={p.id}>
                      <td className={styles.partnerName}>{p.name}</td>
                      <td>
                        <code className={styles.code}>{keyMasked}</code>
                      </td>
                      <td className={styles.count}>{p.integrationsCount}</td>
                      <td>
                        <Badge variant={p.active ? 'success' : 'muted'}>
                          {p.active ? 'Actif' : 'Inactif'}
                        </Badge>
                      </td>
                      <td className={styles.muted}>
                        {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
