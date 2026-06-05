import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { canonical } from '@/lib/seo'
import styles from '../seo-landing.module.css'

const url = canonical('/logiciel-pointage-garage-dordogne')

export const metadata: Metadata = {
  title: 'Logiciel pointage garage Dordogne | LIVO atelier',
  description:
    'LIVO accompagne les garages, MRA et carrosseries en Dordogne : pointage atelier, OR, fiches de travail, suivi compagnons, rentabilité et API QR code.',
  keywords: [
    'logiciel pointage garage Dordogne',
    'pointage atelier Dordogne',
    'logiciel garage Périgueux',
    'logiciel garage Bergerac',
    'logiciel carrosserie Dordogne',
    'suivi OR garage Dordogne',
    'pointage compagnon atelier',
    'logiciel MRA Dordogne',
  ],
  alternates: {
    canonical: url,
  },
  openGraph: {
    title: 'Logiciel pointage garage Dordogne | LIVO',
    description:
      'Pointage atelier, suivi OR, fiches de travail et rentabilité pour garages, MRA et carrosseries en Dordogne.',
    url,
    type: 'website',
    siteName: 'LIVO',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'LIVO',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url,
  areaServed: [
    'Dordogne',
    'Périgueux',
    'Bergerac',
    'Sarlat-la-Canéda',
    'Nontron',
    'Ribérac',
    'Terrasson-Lavilledieu',
    'Montpon-Ménestérol',
  ],
  description:
    'Logiciel web premium pour garages et carrosseries : pointage atelier, suivi des compagnons, fiches de travail, ordres de réparation et rentabilité.',
  offers: {
    '@type': 'Offer',
    price: '89',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
  },
}

const cities = [
  'Périgueux',
  'Bergerac',
  'Sarlat-la-Canéda',
  'Nontron',
  'Ribérac',
  'Terrasson-Lavilledieu',
  'Montpon-Ménestérol',
  'Boulazac',
  'Trélissac',
  'Coulounieix-Chamiers',
  'Saint-Astier',
  'Thiviers',
]

export default function DordogneSeoPage() {
  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <Image src="/logo/livo-app-logo.png" alt="" width={38} height={38} priority />
          <span>LIVO</span>
        </Link>
        <nav className={styles.nav} aria-label="Navigation LIVO">
          <Link href="/">Accueil</Link>
          <Link href="/api-qr-ordre-reparation-garage">API QR OR</Link>
          <Link href="/demo">Démo</Link>
          <Link href="/inscription">Essai gratuit</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Déploiement prioritaire Dordogne</span>
          <h1>Logiciel de pointage garage pour ateliers en Dordogne</h1>
          <p className={styles.lead}>
            LIVO aide les garages, MRA, agents de marque, concessions locales et carrosseries de Dordogne
            à suivre les compagnons, les ordres de réparation, les fiches de travail et la rentabilité atelier.
          </p>
          <div className={styles.actions}>
            <Link href="/inscription" className={styles.primary}>Essayer LIVO 30 jours</Link>
            <Link href="/demo" className={styles.secondary}>Voir la démo</Link>
          </div>
        </div>

        <aside className={styles.proof}>
          <strong>Recherches couvertes</strong>
          <ul>
            <li>pointage garage Dordogne</li>
            <li>logiciel atelier mécanique Périgueux</li>
            <li>suivi OR carrosserie Bergerac</li>
            <li>pointage compagnon atelier automobile</li>
          </ul>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionIntro}>
          <span className={styles.kicker}>Garages indépendants et réseaux</span>
          <h2>Un outil premium pour les ateliers qui veulent gagner en précision.</h2>
          <p>
            LIVO n'est pas un simple tableau de pointage. C'est un logiciel métier pour relier le temps réel
            des compagnons aux véhicules, aux fiches de travail et aux ordres de réparation.
          </p>
        </div>

        <div className={styles.grid}>
          <article className={styles.card}>
            <h3>Pointage atelier</h3>
            <p>Arrivée, pause, reprise, départ et temps passé sur chaque intervention, depuis une interface simple.</p>
          </article>
          <article className={styles.card}>
            <h3>OR et fiches</h3>
            <p>Suivi des ordres de réparation, fiches de travail, véhicules, clients et opérations à réaliser.</p>
          </article>
          <article className={styles.card}>
            <h3>Rentabilité</h3>
            <p>Comparaison entre temps vendu, temps réel et montant facturé pour piloter l'atelier avec des données fiables.</p>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.split}>
          <div className={styles.splitPanel}>
            <span className={styles.kicker}>Couverture locale</span>
            <h2>Pour les garages de Périgueux, Bergerac, Sarlat et toute la Dordogne.</h2>
            <p>
              Le référencement démarre localement avec les recherches les plus naturelles des professionnels :
              logiciel garage, pointage atelier, suivi OR, logiciel carrosserie, outil compagnon et rentabilité atelier.
            </p>
          </div>
          <ul className={styles.list}>
            {cities.map((city) => (
              <li key={city}>Logiciel garage et pointage atelier à {city}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionIntro}>
          <span className={styles.kicker}>MRA, franchisés ou indépendants</span>
          <h2>LIVO s'adapte au fonctionnement du garage, pas l'inverse.</h2>
          <p>
            Un atelier peut utiliser LIVO avec ses fiches internes, avec des OR saisis en secours, ou avec des OR
            transmis par un logiciel de facturation via API et QR code lorsque l'intégration est activée.
          </p>
        </div>
        <div className={styles.faqGrid}>
          <article className={styles.faq}>
            <h3>Est-ce réservé aux grands garages ?</h3>
            <p>Non. LIVO vise autant les MRA indépendants que les garages franchisés, concessions locales et carrosseries.</p>
          </article>
          <article className={styles.faq}>
            <h3>Pourquoi une page Dordogne ?</h3>
            <p>Parce que le lancement commercial démarre localement, avec des recherches terrain comme "logiciel pointage garage Dordogne".</p>
          </article>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>LIVO par LYSMA Solutions</span>
        <div>
          <Link href="/">Accueil</Link>
          <Link href="/api-qr-ordre-reparation-garage">API QR OR</Link>
          <Link href="/conformite-temps-travail">Conformité</Link>
          <Link href="/politique-confidentialite">Confidentialité</Link>
        </div>
      </footer>
    </main>
  )
}
