import { auth } from '@/lib/auth'
import { getFinanceData, formatEuro, formatDate } from '@/lib/finance'
import { redirect } from 'next/navigation'
import { FinanceNav } from '../FinanceNav'
import styles from '../page.module.css'

export const revalidate = 0

export default async function RevenusPage() {
  const session = await auth()
  if (!session) redirect('/connexion')
  const data = await getFinanceData()

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <div className={styles.termHeader}><span className={styles.prompt}>lysmasolutions@gmail.com</span><span className={styles.cmd}>revenus</span></div>
          <h1>Revenus entrants</h1>
          <p>Abonnements vendus, essais, impayes, prochaines facturations et champs prets pour GoCardless et Sage.</p>
        </div>
      </section>
      <FinanceNav />
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span className={styles.panelTitle}>// abonnements_clients</span>
            <p>{data.revenues.length} abonnement{data.revenues.length > 1 ? 's' : ''} suivi{data.revenues.length > 1 ? 's' : ''}.</p>
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>client</th>
              <th>outil</th>
              <th>formule</th>
              <th>HT</th>
              <th>TVA</th>
              <th>TTC</th>
              <th>frequence</th>
              <th>statut</th>
              <th>debut</th>
              <th>facture</th>
              <th>prelevement</th>
              <th>paiement</th>
            </tr>
          </thead>
          <tbody>
              {data.revenues.map((item) => (
              <tr key={item.id}>
                <td><span className={styles.mainText}>{item.clientCompany ?? item.clientName}</span><span className={styles.muted}>{item.clientName}</span></td>
                <td><span className={styles.tag}>{item.tool}</span></td>
                <td>{item.planName}</td>
                <td>{formatEuro(item.amountHT)}</td>
                <td>{formatEuro(item.vatAmount)}</td>
                <td>{formatEuro(item.amountTTC)}</td>
                <td>{item.frequency.toLowerCase()}</td>
                <td><span className={statusClass(item.status)}>{item.status.toLowerCase()}</span></td>
                <td>{formatDate(item.startDate)}</td>
                <td>{formatDate(item.nextInvoiceAt)}</td>
                <td>{formatDate(item.nextPaymentAt)}</td>
                <td>{item.status === 'IMPAYE' ? 'a relancer' : 'suivi'}</td>
              </tr>
            ))}
            {data.revenues.length === 0 && <tr><td colSpan={12} className={styles.empty}>Aucun revenu enregistre</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  )

  function statusClass(status: string) {
    if (status === 'ACTIF' || status === 'ACTIF_PAYANT') return styles.green
    if (status === 'ESSAI') return styles.yellow
    if (status === 'IMPAYE') return styles.red
    if (status === 'OFFERT') return styles.muted
    return styles.muted
  }
}

