import { auth } from '@/lib/auth'
import { getFinanceData } from '@/lib/finance'
import { redirect } from 'next/navigation'
import { FinanceNav } from '../FinanceNav'
import { ShowcaseSiteManager } from './ShowcaseSiteManager'
import styles from '../page.module.css'

export const revalidate = 0

export default async function FinanceSitesPage() {
  const session = await auth()
  if (!session) redirect('/connexion')
  const data = await getFinanceData()

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <div className={styles.termHeader}><span className={styles.prompt}>lysmasolutions@gmail.com</span><span className={styles.cmd}>sites vitrines</span></div>
          <h1>Finance des sites vitrines</h1>
          <p>
            Pilotage des creations facturees ou offertes, abonnements maintenance, domaines, emails,
            couts internes et marge reelle par client.
          </p>
        </div>
      </section>
      <FinanceNav />
      <ShowcaseSiteManager sites={data.showcaseSites} />
    </div>
  )
}

