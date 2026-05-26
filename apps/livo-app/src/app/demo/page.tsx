import type { Metadata } from 'next'
import Link from 'next/link'
import { LivoDemoClient } from './LivoDemoClient'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Démo LIVO - Logiciel atelier garage et carrosserie',
  description:
    'Démo publique LIVO avec faux garage, compagnons, pointages, fiches atelier, véhicules, rentabilité, absences et rapports.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function LivoDemoPage() {
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand} aria-label="Retour accueil LIVO">
          <span className={styles.brandMark}>L</span>
          <span>
            <strong>LIVO</strong>
              <small>démo commerciale</small>
          </span>
        </Link>
        <div className={styles.topActions}>
          <span className={styles.demoBadge}>Données fictives</span>
          <Link href="/inscription" className={styles.cta}>Essayer 30 jours</Link>
        </div>
      </header>
      <LivoDemoClient />
    </main>
  )
}
