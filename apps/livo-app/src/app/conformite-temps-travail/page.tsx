import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { canonical } from '@/lib/seo'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Suivi du temps de travail en atelier | LIVO',
  description:
    'Comprendre quelles données de temps LIVO enregistre dans un atelier et pourquoi elles ne remplacent pas l’analyse juridique et sociale de l’employeur.',
  alternates: {
    canonical: canonical('/conformite-temps-travail'),
  },
  openGraph: {
    title: 'Mieux documenter le temps de travail dans un atelier',
    description:
      'LIVO enregistre les pointages de journée et les temps passés sur les travaux suivis dans l’application.',
    url: canonical('/conformite-temps-travail'),
    type: 'article',
    siteName: 'Livo',
  },
}

const limits = [
  'LIVO ne calcule pas automatiquement la paie ni les heures supplémentaires dues.',
  'LIVO ne décide pas si une organisation respecte toutes les règles applicables.',
  'La qualité du relevé dépend des pointages et corrections effectivement enregistrés.',
  'Les règles de repos, conventions collectives et situations individuelles doivent être analysées séparément.',
]

const livoHelps = [
  'enregistrer les prises et fins de poste',
  'suivre les temps passés sur chaque ordre de réparation',
  'conserver un historique des pointages',
  'consulter les données par salarié',
  'faciliter le suivi des heures travaillées',
  'générer un relevé mensuel à partir des informations enregistrées',
]

const workshopQuestions = [
  'qui travaille',
  'sur quel véhicule',
  'pendant combien de temps',
  'avec quel écart entre temps vendu et temps réel',
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
          <Link href={'/a-propos' as Route}>À propos</Link>
          <Link href="/demo">Démo</Link>
          <Link href="/connexion">Connexion</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <span className={styles.kicker}>Suivi du temps de travail</span>
        <h1>Mieux documenter le temps réellement enregistré dans l’atelier</h1>
        <p>
          LIVO conserve les arrivées, les pauses, les reprises, les départs et les temps pointés sur
          les travaux. Ces données peuvent faciliter le suivi interne, mais elles ne suffisent pas à
          garantir à elles seules la conformité juridique de l’employeur.
        </p>
      </section>

      <section className={styles.article}>
        <article className={styles.card}>
          <h2>Les informations enregistrées par LIVO</h2>
          <p>
            Lorsqu’un compagnon utilise l’espace atelier, les actions de pointage sont horodatées et
            rattachées à sa journée. Les temps consacrés aux fiches et OR présents dans LIVO sont
            enregistrés séparément.
          </p>
          <p>
            Le responsable peut consulter ces informations, gérer les absences et produire un relevé
            mensuel. Le document reflète les données présentes dans l’application au moment de sa génération.
          </p>
        </article>

        <article className={styles.card}>
          <h2>Ce que le relevé ne détermine pas</h2>
          <p>
            Un relevé technique ne remplace ni les règles internes du garage, ni la convention
            collective applicable, ni l’analyse d’un professionnel du droit ou de la paie.
          </p>
          <ul>
            {limits.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ul>
        </article>

        <article className={styles.card}>
          <h2>Comment LIVO facilite le suivi</h2>
          <p>
            LIVO structure les informations saisies par les compagnons et les responsables afin
            qu’elles puissent être consultées par personne et par période.
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
            LIVO est un outil d’enregistrement et d’aide au suivi. L’employeur reste responsable de
            la fiabilité des données, des éventuelles corrections et du respect des règles légales,
            conventionnelles et contractuelles applicables. Cette page ne constitue pas un conseil juridique.
          </p>
        </aside>
      </section>

      <section className={styles.cta}>
        <div>
          <span className={styles.kicker}>Atelier automobile</span>
          <h2>Suivre le temps, les véhicules et les dossiers au même endroit.</h2>
        </div>
        <Link href="/demo" className={styles.primaryCta}>
          Voir la démo Livo
        </Link>
      </section>
    </main>
  )
}
