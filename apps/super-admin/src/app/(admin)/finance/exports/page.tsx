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
          <div className={styles.termHeader}><span className={styles.prompt}>finance@lysma</span><span className={styles.cmd}> $ exports</span></div>
          <h1>Exports expert-comptable</h1>
          <p>Generation des dossiers mensuels et annuels : resume, revenus, charges, URSSAF, TVA, factures, paiements et rentabilite.</p>
        </div>
      </section>
      <FinanceNav />
      <section className={styles.exportGrid}>
        <ExportCard title="PDF mensuel" text="Rapport de pilotage interne pour le mois en cours." href="/api/finance/export?format=pdf&period=monthly" />
        <ExportCard title="PDF annuel" text="Rapport consolide de l'annee pour l'expert-comptable." href="/api/finance/export?format=pdf&period=annual" />
        <ExportCard title="Excel mensuel" text="Classeur Excel multi-feuilles : Resume, Revenus, Charges, URSSAF, Factures, Paiements, Rentabilite." href="/api/finance/export?format=excel&period=monthly" />
        <ExportCard title="Excel annuel" text="Extraction annuelle complete au format compatible Excel." href="/api/finance/export?format=excel&period=annual" />
      </section>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span className={styles.panelTitle}>// contenu_export</span>
            <p>Le dossier inclut {data.revenues.length} revenus, {data.expenses.length} charges, {data.invoices.length} factures et {data.payments.length} paiements.</p>
          </div>
        </div>
        <div className={styles.panelBody}>
          <p className={styles.muted}>
            Resultat estime actuel : {formatEuro(data.kpis.netResult)}. Les statuts Sage, GoCardless et facturation electronique sont prevus dans les donnees, sans integration active pour le moment.
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
