import type { Metadata, Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { LIVO_PRICING } from '@/lib/pricing'
import { canonical } from '@/lib/seo'
import styles from '../seo-landing.module.css'

const url = canonical('/logiciel-pointage-garage-dordogne')

export const metadata: Metadata = {
  title: 'Logiciel pointage garage Dordogne | LIVO atelier',
  description:
    'LIVO est une application web accessible aux garages et carrosseries de Dordogne pour le pointage atelier, les fiches de travail et le suivi du temps réel.',
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
      'Application web de pointage atelier, fiches de travail et suivi du temps pour les garages et carrosseries de Dordogne.',
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
    'Application web pour garages et carrosseries : pointage des compagnons, fiches de travail, véhicules et écarts de temps.',
  offers: {
    '@type': 'Offer',
    price: String(LIVO_PRICING.primaryPlan.priceMonthly),
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
          <Link href={'/a-propos' as Route}>À propos</Link>
          <Link href="/api-qr-ordre-reparation-garage">Connexion OR et QR code</Link>
          <Link href="/demo">Démo</Link>
          <Link href="/inscription">Essai gratuit</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Application web accessible en Dordogne</span>
          <h1>Logiciel de pointage garage pour ateliers en Dordogne</h1>
          <p className={styles.lead}>
            LIVO permet aux ateliers automobiles de suivre les présences, les fiches de travail,
            les véhicules et les écarts entre temps vendu et temps réellement pointé.
          </p>
          <div className={styles.actions}>
            <Link href="/inscription" className={styles.primary}>Essayer LIVO 30 jours</Link>
            <Link href="/demo" className={styles.secondary}>Voir la démo</Link>
          </div>
        </div>

        <aside className={styles.proof}>
          <strong>Conditions d’utilisation</strong>
          <ul>
            <li>Un navigateur web récent.</li>
            <li>Une connexion internet dans l’atelier.</li>
            <li>Un appareil partagé ou individuel pour le pointage.</li>
            <li>Le paramétrage initial du garage et de ses compagnons.</li>
          </ul>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionIntro}>
          <span className={styles.kicker}>Fonctions disponibles</span>
          <h2>Relier le pointage aux dossiers suivis par l’atelier</h2>
          <p>
            LIVO complète l’organisation du garage avec un espace administrateur et un espace de
            pointage séparé pour les compagnons.
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
            <p>Comparaison opérationnelle entre temps vendu et temps réel. Cet indicateur ne remplace pas une marge comptable.</p>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.split}>
          <div className={styles.splitPanel}>
            <span className={styles.kicker}>Accès géographique</span>
            <h2>Le même service web dans toute la Dordogne</h2>
            <p>
              LIVO fonctionne en ligne. La localisation du garage ne modifie pas les fonctions de
              l’application et n’implique pas la présence d’une agence ou d’une équipe sur place.
            </p>
          </div>
          <ul className={styles.list}>
            {cities.map((city) => (
              <li key={city}>Accessible aux ateliers situés à {city}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionIntro}>
          <span className={styles.kicker}>Organisation existante</span>
          <h2>LIVO complète le logiciel métier du garage</h2>
          <p>
            Un atelier peut utiliser LIVO avec ses fiches internes, avec des OR saisis manuellement, ou avec des OR
            transmis par un logiciel de facturation et retrouvé par QR code lorsque la connexion est activée.
          </p>
        </div>
        <div className={styles.faqGrid}>
          <article className={styles.faq}>
            <h3>Est-ce réservé aux grands garages ?</h3>
            <p>Non. L’application ne fixe pas de taille minimale d’équipe et l’offre affichée n’impose pas de limite de compagnons.</p>
          </article>
          <article className={styles.faq}>
            <h3>LIVO est-il réservé à la Dordogne ?</h3>
            <p>Non. LIVO est une application web. Cette page précise simplement sa disponibilité pour les ateliers du département.</p>
          </article>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>LIVO par LYSMA Solutions</span>
        <div>
          <Link href="/">Accueil</Link>
          <Link href={'/a-propos' as Route}>À propos</Link>
          <Link href="/api-qr-ordre-reparation-garage">Connexion OR et QR code</Link>
          <Link href="/conformite-temps-travail">Conformité</Link>
          <Link href="/politique-confidentialite">Confidentialité</Link>
        </div>
      </footer>
    </main>
  )
}
