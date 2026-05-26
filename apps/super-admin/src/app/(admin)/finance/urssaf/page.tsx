import { auth } from '@/lib/auth'
import { getFinanceData, formatEuro, formatPercent } from '@/lib/finance'
import { redirect } from 'next/navigation'
import { FinanceNav } from '../FinanceNav'
import { SettingsForm } from './SettingsForm'
import styles from '../page.module.css'

export const revalidate = 0

export default async function UrssafPage() {
  const session = await auth()
  if (!session) redirect('/connexion')
  const data = await getFinanceData()

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <div className={styles.termHeader}><span className={styles.prompt}>lysmasolutions@gmail.com</span><span className={styles.cmd}>simulation URSSAF</span></div>
          <h1>Simulation URSSAF</h1>
          <p>Estimation du montant a mettre de cote selon le CA encaisse, le taux URSSAF et le regime TVA.</p>
        </div>
      </section>
      <FinanceNav />
      <section className={styles.statsGrid}>
        <Stat label="CA mois encaisse" value={formatEuro(data.kpis.monthRevenue)} tone="cyan" />
        <Stat label="CA annuel encaisse" value={formatEuro(data.kpis.yearRevenue)} tone="green" />
        <Stat label="Taux URSSAF" value={formatPercent(data.settings.urssafRate)} tone="yellow" />
        <Stat label="URSSAF estimee" value={formatEuro(data.kpis.urssafEstimate)} tone="red" />
        <Stat label="A mettre de cote" value={formatEuro(data.kpis.urssafEstimate + data.kpis.vatEstimate)} tone="red" />
        <Stat label="Apres URSSAF" value={formatEuro(data.kpis.monthRevenue - data.kpis.urssafEstimate)} tone="green" />
        <Stat label="TVA estimee" value={formatEuro(data.kpis.vatEstimate)} tone="purple" />
        <Stat label="Declaration" value={data.settings.declarationFrequency.toLowerCase()} tone="cyan" />
      </section>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span className={styles.panelTitle}>// parametres_fiscaux</span>
          <p>Les essais gratuits et les offres sont exclus de l'estimation URSSAF.</p>
          </div>
        </div>
        <SettingsForm settings={data.settings} />
      </section>
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

