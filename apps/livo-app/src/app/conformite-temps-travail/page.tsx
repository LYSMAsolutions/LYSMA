import type { Metadata } from 'next'
import Link from 'next/link'
import { canonical } from '@/lib/seo'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Conformité temps de travail | Livo',
  description:
    'Comprendre pourquoi le suivi du temps de travail est important pour les garages, ateliers mécaniques et carrosseries, et comment Livo aide à conserver un historique fiable.',
  alternates: {
    canonical: canonical('/conformite-temps-travail'),
  },
  openGraph: {
    title: 'Temps de travail : êtes-vous réellement en conformité ?',
    description:
      'Livo aide les ateliers automobiles à suivre les temps de travail, les pointages et les heures passées sur les ordres de réparation.',
    url: canonical('/conformite-temps-travail'),
    type: 'article',
    siteName: 'Livo',
  },
}

const risks = [
  "des rappels d'heures supplémentaires",
  'des demandes de repos compensateurs',
  "des litiges prud'homaux",
  'des sanctions administratives',
  'des difficultés à prouver le respect des obligations légales',
]

const livoHelps = [
  'enregistrer les prises et fins de poste',
  'suivre les temps passés sur chaque ordre de réparation',
  'conserver un historique des pointages',
  'consulter les données par salarié',
  'faciliter le suivi des heures travaillées',
  "disposer d'éléments de preuve exploitables en cas de contrôle ou de litige",
]

const workshopQuestions = [
  'qui travaille',
  'sur quel véhicule',
  'pendant combien de temps',
  'avec quelle rentabilité',
]

export default function WorkTimeCompliancePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          Livo
        </Link>
        <nav className={styles.nav} aria-label="Navigation secondaire">
          <Link href="/">Accueil</Link>
          <Link href="/demo">Démo</Link>
          <Link href="/connexion">Connexion</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <span className={styles.kicker}>Conformité temps de travail</span>
        <h1>Temps de travail : êtes-vous réellement en conformité ?</h1>
        <p>
          Savez-vous prouver les horaires réellement effectués par vos salariés ? En cas de contrôle
          de l’Inspection du travail ou de litige prud’homal, l’employeur doit être en mesure de
          justifier les heures de travail réalisées, les heures supplémentaires, les temps de repos
          et le respect des durées maximales de travail.
        </p>
      </section>

      <section className={styles.article}>
        <article className={styles.card}>
          <h2>Une obligation de suivi</h2>
          <p>
            Le Code du travail impose aux employeurs de suivre le temps de travail de leurs salariés
            et de conserver les éléments permettant d’en justifier.
          </p>
          <p>
            La Cour de justice de l’Union européenne, dans sa décision CJUE du 14 mai 2019 C-55/18,
            est venue renforcer cette obligation en précisant que les employeurs doivent disposer
            d’un système objectif, fiable et accessible permettant de mesurer la durée du temps de
            travail journalier de chaque salarié.
          </p>
        </article>

        <article className={styles.card}>
          <h2>Les risques d’un suivi insuffisant</h2>
          <p>
            Un simple planning prévisionnel ou un fichier Excel modifiable ne permettent pas
            toujours de démontrer les horaires réellement effectués.
          </p>
          <ul>
            {risks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </article>

        <article className={styles.card}>
          <h2>Comment Livo vous aide</h2>
          <p>
            Livo a été conçu pour permettre aux entreprises de disposer d’un historique fiable,
            horodaté et consultable des temps de travail réalisés.
          </p>
          <ul>
            {livoHelps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className={styles.card}>
          <h2>Une solution pensée pour les ateliers</h2>
          <p>
            Contrairement aux logiciels RH généralistes, Livo a été conçu pour les garages, ateliers
            mécaniques et carrosseries. L’objectif n’est pas seulement de pointer des heures.
          </p>
          <div className={styles.questionGrid}>
            {workshopQuestions.map((question) => (
              <span key={question}>{question}</span>
            ))}
          </div>
        </article>

        <aside className={styles.notice}>
          <strong>Important</strong>
          <p>
            Livo est un outil d’aide au suivi du temps de travail. L’employeur reste responsable du
            respect de ses obligations légales et réglementaires en matière de durée du travail, de
            repos et de rémunération.
          </p>
        </aside>
      </section>

      <section className={styles.cta}>
        <div>
          <span className={styles.kicker}>Atelier automobile</span>
          <h2>Suivre le temps, les véhicules et la rentabilité au même endroit.</h2>
        </div>
        <Link href="/demo" className={styles.primaryCta}>
          Voir la démo Livo
        </Link>
      </section>
    </main>
  )
}
