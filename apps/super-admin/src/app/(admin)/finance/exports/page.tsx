import { auth } from '@/lib/auth'
import { getFinanceData, formatEuro } from '@/lib/finance'
import { redirect } from 'next/navigation'
import { FinanceNav } from '../FinanceNav'
import styles from '../page.module.css'

export const revalidate = 0

export default async function ExportsPage() {
  const session = await auth()
  if (!session) redirect('/connexion')
  const data = await getFinanceData()

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <div className={styles.termHeader}><span className={styles.prompt}>lysmasolutions@gmail.com</span><span className={styles.cmd}>exports pre-comptables</span></div>
          <h1>Exports expert-comptable</h1>
          <p>Generation des dossiers pre-comptables mensuels et annuels : resume, revenus payants, charges reelles, URSSAF, TVA, factures, paiements et rentabilite.</p>
        </div>
      </section>
      <FinanceNav />
      <section className={styles.exportGrid}>
        <ExportCard title="PDF mensuel" text="Synthese pre-comptable du mois en cours, sans essais gratuits ni offres." href="/api/finance/export?format=pdf&period=monthly" />
        <ExportCard title="PDF annuel" text="Synthese annuelle a verifier avec l'expert-comptable." href="/api/finance/export?format=pdf&period=annual" />
        <ExportCard title="Excel mensuel" text="Classeur compatible Excel : Resume, Revenus payants, Charges, Sites vitrines, URSSAF, Factures, Paiements, Rentabilite." href="/api/finance/export?format=excel&period=monthly" />
        <ExportCard title="Excel annuel" text="Extraction annuelle complete compatible Excel." href="/api/finance/export?format=excel&period=annual" />
      </section>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span className={styles.panelTitle}>// contenu_export</span>
            <p>Le dossier inclut {data.revenues.filter((item) => item.status === 'ACTIF' || item.status === 'ACTIF_PAYANT').length} revenus payants, {data.expenses.length} charges, {data.showcaseSites.length} sites vitrines, {data.invoices.length} factures et {data.payments.length} paiements.</p>
          </div>
        </div>
        <div className={styles.panelBody}>
          <p className={styles.muted}>
            Resultat estime actuel : {formatEuro(data.kpis.netResult)}. Les statuts Sage, GoCardless, facture electronique et plateforme agreee sont prevus dans les donnees, sans integration active pour le moment.
          </p>
        </div>
      </section>
    </div>
  )
}

function ExportCard({ title, text, href }: { title: string; text: string; href: string }) {
  return (
    <article className={styles.exportCard}>
      <h2>{title}</h2>
      <p>{text}</p>
      <a href={href} className={styles.primaryAction}>Telecharger</a>
    </article>
  )
}

