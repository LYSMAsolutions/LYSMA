import { auth } from '@/lib/auth'
import { getFinanceData, formatEuro, formatPercent, formatDate } from '@/lib/finance'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FinanceNav } from './FinanceNav'
import styles from './page.module.css'

export const revalidate = 0

export default async function FinancePage() {
  const session = await auth()
  if (!session) redirect('/connexion')

  const data = await getFinanceData()

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <div className={styles.termHeader}>
            <span className={styles.prompt}>finance@lysma</span>
            <span className={styles.cmd}> $ cockpit --expert-comptable</span>
          </div>
          <h1>Finance / Expert-comptable</h1>
          <p>
            Pilotage du chiffre d'affaires, des abonnements clients, des charges LYSMA,
            de l'URSSAF estimee et de la rentabilite par outil.
          </p>
        </div>
        <div className={styles.heroActions}>
          <Link href="/finance/exports" className={styles.primaryAction}>Exporter</Link>
          <Link href="/finance/charges" className={styles.secondaryAction}>Charges</Link>
        </div>
      </section>

      <FinanceNav />

      {data.usesMockData && (
        <section className={styles.panel}>
          <div className={styles.panelBody}>
            <span className={styles.yellow}>Donnees de demonstration</span>
            <p className={styles.muted}>
              Aucune donnee finance n'existe encore. Le cockpit affiche une base de lecture pour valider les calculs.
            </p>
          </div>
        </section>
      )}

      <section className={styles.statsGrid}>
        <Stat label="CA mois" value={formatEuro(data.kpis.monthRevenue)} tone="cyan" />
        <Stat label="CA annuel" value={formatEuro(data.kpis.yearRevenue)} tone="green" />
        <Stat label="MRR" value={formatEuro(data.kpis.mrr)} tone="purple" />
        <Stat label="ARR" value={formatEuro(data.kpis.arr)} tone="purple" />
        <Stat label="Clients actifs" value={data.kpis.activeSubscriptions.toString()} tone="green" />
        <Stat label="Essais" value={data.kpis.trialSubscriptions.toString()} tone="yellow" />
        <Stat label="Impayes" value={data.kpis.unpaidSubscriptions.toString()} tone={data.kpis.unpaidSubscriptions > 0 ? 'red' : 'muted'} />
        <Stat label="Charges mensuelles" value={formatEuro(data.kpis.monthlyExpenses)} tone="yellow" />
        <Stat label="Charges annuelles" value={formatEuro(data.kpis.annualExpenses)} tone="yellow" />
        <Stat label="URSSAF estimee" value={formatEuro(data.kpis.urssafEstimate)} tone="red" />
        <Stat label="Net estime" value={formatEuro(data.kpis.netResult)} tone={data.kpis.netResult >= 0 ? 'green' : 'red'} />
        <Stat label="Rentabilite" value={formatPercent(data.kpis.profitabilityRate)} tone={data.kpis.profitabilityRate >= 0 ? 'green' : 'red'} />
      </section>

      <section className={styles.grid}>
        <Panel title="// revenus_entrants" subtitle="Abonnements vendus et prochaines facturations.">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>client</th>
                <th>outil</th>
                <th>formule</th>
                <th>montant</th>
                <th>statut</th>
                <th>prochaine facture</th>
              </tr>
            </thead>
            <tbody>
              {data.revenues.slice(0, 6).map((item) => (
                <tr key={item.id}>
                  <td><span className={styles.mainText}>{item.clientCompany ?? item.clientName}</span><span className={styles.muted}>{item.clientName}</span></td>
                  <td><span className={styles.tag}>{item.tool}</span></td>
                  <td>{item.planName}</td>
                  <td><span className={styles.green}>{formatEuro(item.amountHT)} HT</span><span className={styles.muted}>{item.frequency.toLowerCase()}</span></td>
                  <td><Status value={item.status} /></td>
                  <td>{formatDate(item.nextInvoiceAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="// prevision" subtitle="Lecture rapide du mois prochain.">
          <div className={styles.panelBody}>
            <Stat label="Prevision mois prochain" value={formatEuro(data.kpis.nextMonthForecast)} tone={data.kpis.nextMonthForecast >= 0 ? 'green' : 'red'} />
            <p className={styles.muted}>
              Calcul : MRR - charges mensuelles - URSSAF estimee. La TVA reste separee pour preparer la logique Sage et facturation electronique.
            </p>
          </div>
        </Panel>
      </section>

      <Panel title="// marge_par_outil" subtitle="Vue produit : ce qui rapporte, ce qui consomme.">
        <table className={styles.table}>
          <thead>
            <tr>
              <th>outil</th>
              <th>CA mensuel</th>
              <th>charges</th>
              <th>marge estimee</th>
              <th>rentabilite</th>
              <th>clients</th>
            </tr>
          </thead>
          <tbody>
            {data.margins.map((item) => (
              <tr key={item.tool}>
                <td><span className={styles.tag}>{item.tool}</span></td>
                <td>{formatEuro(item.revenue)}</td>
                <td>{formatEuro(item.expenses)}</td>
                <td className={item.grossMargin >= 0 ? styles.green : styles.red}>{formatEuro(item.grossMargin)}</td>
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

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={`${styles.statValue} ${styles[tone] ?? ''}`}>{value}</span>
    </div>
  )
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <span className={styles.panelTitle}>{title}</span>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

function Status({ value }: { value: string }) {
  const tone = value === 'ACTIF' ? 'green' : value === 'ESSAI' ? 'yellow' : value === 'IMPAYE' ? 'red' : 'muted'
  return <span className={styles[tone] ?? styles.muted}>{value.toLowerCase()}</span>
}
