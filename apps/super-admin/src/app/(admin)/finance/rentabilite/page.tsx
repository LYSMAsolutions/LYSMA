import { auth } from '@/lib/auth'
import { getFinanceData, formatEuro, formatPercent } from '@/lib/finance'
import { redirect } from 'next/navigation'
import { FinanceNav } from '../FinanceNav'
import styles from '../page.module.css'

export const revalidate = 0

export default async function RentabilitePage() {
  const session = await auth()
  if (!session) redirect('/connexion')
  const data = await getFinanceData()

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <div className={styles.termHeader}><span className={styles.prompt}>lysmasolutions@gmail.com</span><span className={styles.cmd}>rentabilite</span></div>
          <h1>Rentabilite detaillee</h1>
          <p>Lecture par produit : chiffre d'affaires, charges rattachees, marge, cout moyen client et revenu moyen client.</p>
        </div>
      </section>
      <FinanceNav />
      <section className={styles.marginGrid}>
        {data.margins.map((item) => (
          <article key={item.tool} className={styles.marginCard}>
            <h2>{item.tool}</h2>
            <p>{item.customers} client{item.customers > 1 ? 's' : ''} rattache{item.customers > 1 ? 's' : ''} a cet outil.</p>
            <section className={styles.statsGrid}>
              <Mini label="CA" value={formatEuro(item.revenue)} tone="green" />
              <Mini label="Charges" value={formatEuro(item.expenses)} tone="yellow" />
              <Mini label="Marge" value={formatEuro(item.grossMargin)} tone={item.grossMargin >= 0 ? 'green' : 'red'} />
              <Mini label="Marge nette" value={formatPercent(item.netMargin)} tone={item.netMargin >= 0 ? 'green' : 'red'} />
            </section>
            <table className={styles.table}>
              <tbody>
                <tr><td>Revenu moyen par client</td><td>{formatEuro(item.averageRevenue)}</td></tr>
                <tr><td>Cout moyen par client</td><td>{formatEuro(item.averageCost)}</td></tr>
                <tr><td>Resultat produit estime</td><td className={item.grossMargin >= 0 ? styles.green : styles.red}>{formatEuro(item.grossMargin)}</td></tr>
              </tbody>
            </table>
          </article>
        ))}
      </section>
    </div>
  )
}

function Mini({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={`${styles.statValue} ${styles[tone] ?? ''}`}>{value}</span>
    </div>
  )
}

