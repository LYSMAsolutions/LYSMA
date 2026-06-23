import { auth } from '@/lib/auth'
import { getFinanceData, formatEuro, formatPercent, formatDate } from '@/lib/finance'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Badge, StatCard, PageHeader } from '@/components/ui'
import { FinanceNav } from './FinanceNav'
import styles from './page.module.css'

export const revalidate = 0

export default async function FinancePage() {
  const session = await auth()
  if (!session) redirect('/connexion')

  const data = await getFinanceData()

  const activeRevenues = data.revenues.filter(r => r.status === 'ACTIF' || r.status === 'ACTIF_PAYANT')
  const trialRevenues = data.revenues.filter(r => r.status === 'ESSAI')

  return (
    <div className={styles.page}>
      <PageHeader
        title="Finance & Comptabilité"
        description="Pilotage du CA, abonnements clients, charges LYSMA, URSSAF estimée et rentabilité par outil."
      >
        <Link href="/finance/exports" className={styles.btnPrimary}>Exporter</Link>
        <Link href="/finance/charges" className={styles.btnSecondary}>Charges</Link>
      </PageHeader>

      <FinanceNav />

      <section className={styles.statsGrid}>
        <StatCard label="CA mois" value={formatEuro(data.kpis.monthRevenue)} color="cyan" />
        <StatCard label="CA annuel" value={formatEuro(data.kpis.yearRevenue)} color="green" />
        <StatCard label="MRR" value={formatEuro(data.kpis.mrr)} color="purple" />
        <StatCard label="ARR" value={formatEuro(data.kpis.arr)} color="purple" />
        <StatCard label="Clients actifs" value={data.kpis.activeSubscriptions} color="green" />
        <StatCard label="Essais en cours" value={data.kpis.trialSubscriptions} color="yellow" />
        <StatCard label="Impayés" value={data.kpis.unpaidSubscriptions} color={data.kpis.unpaidSubscriptions > 0 ? 'red' : 'muted'} />
        <StatCard label="Charges mensuelles" value={formatEuro(data.kpis.monthlyExpenses)} color="yellow" />
        <StatCard label="Charges annuelles" value={formatEuro(data.kpis.annualExpenses)} color="yellow" />
        <StatCard label="URSSAF estimée" value={formatEuro(data.kpis.urssafEstimate)} color="red" />
        <StatCard label="Net estimé" value={formatEuro(data.kpis.netResult)} color={data.kpis.netResult >= 0 ? 'green' : 'red'} />
        <StatCard label="Rentabilité" value={formatPercent(data.kpis.profitabilityRate)} color={data.kpis.profitabilityRate >= 0 ? 'green' : 'red'} />
        <StatCard label="Offert" value={formatEuro(data.kpis.offeredRevenue)} color="muted" />
        <StatCard label="Potentiel essais" value={`${formatEuro(data.kpis.trialPotentialMrr)} / mois`} color="yellow" />
      </section>

      <section className={styles.grid}>
        <Panel title="Revenus entrants" subtitle="Abonnements vendus et prochaines facturations.">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Client</th>
                <th>Outil</th>
                <th>Formule</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Prochaine facture</th>
              </tr>
            </thead>
            <tbody>
              {activeRevenues.slice(0, 6).map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className={styles.mainText}>{item.clientCompany ?? item.clientName}</span>
                    <span className={styles.muted}>{item.clientName}</span>
                  </td>
                  <td><span className={styles.tag}>{item.tool}</span></td>
                  <td>{item.planName}</td>
                  <td>
                    <span className={styles.green}>{formatEuro(item.amountHT)} HT</span>
                    <span className={styles.muted}>{item.frequency.toLowerCase()}</span>
                  </td>
                  <td><RevenueStatus value={item.status} /></td>
                  <td>{formatDate(item.nextInvoiceAt)}</td>
                </tr>
              ))}
              {activeRevenues.length === 0 && (
                <tr><td colSpan={6} className={styles.empty}>Aucun revenu actif payant enregistré</td></tr>
              )}
            </tbody>
          </table>
        </Panel>

        <Panel title="Prévision" subtitle="Lecture rapide du mois prochain.">
          <div className={styles.panelBody}>
            <StatCard
              label="Prévision mois prochain"
              value={formatEuro(data.kpis.nextMonthForecast)}
              color={data.kpis.nextMonthForecast >= 0 ? 'green' : 'red'}
            />
            <p className={styles.muted} style={{ marginTop: '12px' }}>
              Calcul : MRR − charges mensuelles − URSSAF estimée. TVA séparée pour Sage.
            </p>
          </div>
        </Panel>
      </section>

      <Panel title="Essais en cours" subtitle="Ces montants ne sont pas comptés dans le CA ou les exports comptables.">
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client</th>
              <th>Outil</th>
              <th>Formule</th>
              <th>Potentiel</th>
              <th>Fin essai</th>
            </tr>
          </thead>
          <tbody>
            {trialRevenues.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className={styles.mainText}>{item.clientCompany ?? item.clientName}</span>
                  <span className={styles.muted}>{item.clientName}</span>
                </td>
                <td><span className={styles.tag}>{item.tool}</span></td>
                <td>{item.planName}</td>
                <td>{formatEuro(item.amountHT)} / mois</td>
                <td>{formatDate(item.trialEndAt)}</td>
              </tr>
            ))}
            {trialRevenues.length === 0 && (
              <tr><td colSpan={5} className={styles.empty}>Aucun essai en cours</td></tr>
            )}
          </tbody>
        </table>
      </Panel>

      <Panel title="Marge par outil" subtitle="Vue produit : ce qui rapporte, ce qui consomme.">
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Outil</th>
              <th>CA mensuel</th>
              <th>Charges</th>
              <th>Marge estimée</th>
              <th>Rentabilité</th>
              <th>Clients</th>
            </tr>
          </thead>
          <tbody>
            {data.margins.map((item) => (
              <tr key={item.tool}>
                <td><span className={styles.tag}>{item.tool}</span></td>
                <td>{formatEuro(item.revenue)}</td>
                <td>{formatEuro(item.expenses)}</td>
                <td className={item.grossMargin >= 0 ? styles.green : styles.red}>
                  {formatEuro(item.grossMargin)}
                </td>
                <td>{formatPercent(item.netMargin)}</td>
                <td>{item.customers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  )
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <span className={styles.panelTitle}>{title}</span>
          {subtitle && <span className={styles.panelSubtitle}>{subtitle}</span>}
        </div>
      </div>
      {children}
    </section>
  )
}

function RevenueStatus({ value }: { value: string }) {
  const variant =
    value === 'ACTIF' || value === 'ACTIF_PAYANT' ? 'success' :
    value === 'ESSAI' ? 'warning' :
    value === 'IMPAYE' ? 'error' : 'muted'
  const label = value.toLowerCase().replace('_', ' ')
  return <Badge variant={variant as 'success' | 'warning' | 'error' | 'muted'}>{label}</Badge>
}
