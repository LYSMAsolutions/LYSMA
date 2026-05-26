import { auth } from '@/lib/auth'
import { getFinanceData } from '@/lib/finance'
import { redirect } from 'next/navigation'
import { FinanceNav } from '../FinanceNav'
import { ExpenseManager } from './ExpenseManager'
import styles from '../page.module.css'

export const revalidate = 0

export default async function ChargesPage() {
  const session = await auth()
  if (!session) redirect('/connexion')
  const data = await getFinanceData()

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <div className={styles.termHeader}><span className={styles.prompt}>lysmasolutions@gmail.com</span><span className={styles.cmd}>charges</span></div>
          <h1>Charges et abonnements LYSMA</h1>
          <p>Suivi des abonnements payes par LYSMA : Vercel, OVH, IA, paiement, domaines, comptabilite, API et logiciels.</p>
        </div>
      </section>
      <FinanceNav />
      <ExpenseManager expenses={data.expenses} />
    </div>
  )
}

