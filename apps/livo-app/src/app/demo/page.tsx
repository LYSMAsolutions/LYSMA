import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Démo LIVO - Choisir un espace',
  description:
    'Démo publique LIVO avec accès séparé à l’espace admin et à l’espace atelier compagnon.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function LivoDemoPage() {
  return (
    <main className={styles.demoHome}>
      <section className={styles.demoHero}>
        <p className={styles.demoBadge}>Démo publique · données fictives · aucune action enregistrée</p>
        <h1>Choisissez l’espace LIVO à présenter.</h1>
        <p>
          La démonstration est séparée du vrai système. Elle permet de montrer le pilotage côté administration
          et le parcours atelier utilisé par les compagnons.
        </p>

        <div className={styles.demoChoices}>
          <Link href="/demo-admin" className={styles.demoChoice}>
            <span className={styles.demoChoiceIcon}>01</span>
            <strong>Espace admin</strong>
            <small>Dashboard, véhicules, fiches, compagnons, rentabilité et suivi atelier.</small>
            <span className={styles.demoChoiceCta}>Ouvrir l’espace admin</span>
          </Link>

          <Link href="/demo-atelier" className={styles.demoChoice}>
            <span className={styles.demoChoiceIcon}>02</span>
            <strong>Espace atelier</strong>
            <small>Sélection compagnon, code PIN 1234, arrivée atelier, pauses et fiches de travaux.</small>
            <span className={styles.demoChoiceCta}>Ouvrir l’espace atelier</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
