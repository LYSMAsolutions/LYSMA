import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Logiciel de pointage atelier mécanique | Livo',
  description:
    'Livo est un logiciel de gestion atelier pour garages et carrosseries : pointage des compagnons, suivi véhicules, fiches de travail et rentabilité atelier.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Logiciel de pointage atelier mécanique | Livo',
    description:
      'Logiciel de gestion atelier pour garages et carrosseries : pointage compagnon, suivi véhicules, fiches de travail et rentabilité atelier.',
    type: 'website',
    siteName: 'Livo',
  },
}

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Livo',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'Livo est un logiciel de pointage atelier mécanique et carrosserie pour suivre les compagnons, les véhicules, les fiches de travail, les ordres de réparation et la rentabilité atelier.',
  offers: {
    '@type': 'Offer',
    price: '89',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
  },
}

const features = [
  {
    title: 'Pointage atelier',
    text: 'Les compagnons pointent leur arrivée, leurs pauses, leurs interventions et leur fin de journée depuis une interface simple, pensée pour l’atelier.',
  },
  {
    title: 'Fiches de travail et OR',
    text: 'Chaque fiche de travail atelier centralise le véhicule, le client, les opérations prévues, les temps passés et l’état d’avancement.',
  },
  {
    title: 'Suivi véhicules atelier',
    text: 'Le chef d’atelier visualise les véhicules présents, les travaux en cours et les interventions à clôturer, sans courir après les informations.',
  },
  {
    title: 'Rentabilité atelier',
    text: 'Livo rapproche les heures réelles, les heures facturées et les montants pour mieux piloter la productivité atelier.',
  },
]

const benefits = [
  'Moins d’oublis au pointage compagnon.',
  'Une vision fiable du temps réel atelier.',
  'Des fiches de travail plus propres et plus faciles à suivre.',
  'Une lecture immédiate de la rentabilité atelier.',
  'Une organisation plus fluide entre le bureau et l’atelier.',
  'Un suivi clair des pauses, absences et formations.',
]

export default function HomePage() {
  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />

      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Accueil Livo">
          <Image src="/logo/livo-app-logo.png" alt="" width={44} height={44} priority />
          <span>Livo</span>
        </Link>
        <nav className={styles.nav} aria-label="Navigation principale">
          <a href="#fonctionnalites">Fonctionnalités</a>
          <a href="#pointage">Pointage</a>
          <a href="#rentabilite">Rentabilité</a>
          <Link href="/connexion">Connexion</Link>
          <Link href="/inscription" className={styles.navCta}>
            Essayer 30 jours
          </Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>Logiciel atelier pour garages et carrosseries</span>
          <h1>Logiciel de pointage atelier mécanique et carrosserie</h1>
          <p className={styles.lead}>
            Livo aide les garages, ateliers mécaniques et carrosseries à suivre le pointage des compagnons,
            les véhicules présents à l’atelier, les fiches de travail, les ordres de réparation et la
            rentabilité atelier en temps réel.
          </p>
          <div className={styles.heroActions}>
            <Link href="/inscription" className={styles.primaryCta}>
              Essayer Livo 30 jours gratuitement
            </Link>
            <Link href="/connexion" className={styles.secondaryCta}>
              Accéder à mon atelier
            </Link>
          </div>
          <p className={styles.reassurance}>
            Essai gratuit de 30 jours, puis 89 € par mois, sans engagement.
          </p>
        </div>

        <div className={styles.preview} aria-label="Aperçu du tableau de bord Livo">
          <div className={styles.previewTop}>
            <span />
            <span />
            <span />
          </div>
          <div className={styles.previewHeader}>
            <div>
              <strong>Atelier en temps réel</strong>
              <small>Pointage, véhicules et fiches de travail</small>
            </div>
            <span className={styles.liveBadge}>en direct</span>
          </div>
          <div className={styles.previewStats}>
            <div><span>Compagnons</span><strong>6 actifs</strong></div>
            <div><span>Véhicules</span><strong>14 suivis</strong></div>
            <div><span>Rentabilité</span><strong>+18 %</strong></div>
          </div>
          <div className={styles.previewList}>
            <div><span>Renault Kangoo</span><strong>OR en cours</strong></div>
            <div><span>Peugeot 208</span><strong>Pointage actif</strong></div>
            <div><span>BMW Série 3</span><strong>À clôturer</strong></div>
          </div>
        </div>
      </section>

      <section className={styles.problem}>
        <div>
          <span className={styles.sectionKicker}>Problème terrain</span>
          <h2>Quand le temps atelier n’est pas suivi, la rentabilité devient floue.</h2>
        </div>
        <p>
          Dans un garage ou une carrosserie, quelques minutes oubliées sur chaque intervention finissent
          par peser lourd. Les fiches papier se dispersent, les heures réelles sont estimées trop tard,
          les véhicules restent parfois en attente sans visibilité, et le chef d’atelier manque de données
          fiables pour piloter la productivité atelier.
        </p>
      </section>

      <section id="fonctionnalites" className={styles.features}>
        <div className={styles.sectionIntro}>
          <span className={styles.sectionKicker}>Fonctionnalités principales</span>
          <h2>Un logiciel atelier mécanique conçu pour le quotidien.</h2>
          <p>
            Livo rassemble les outils essentiels de gestion atelier dans une interface claire :
            pointage atelier, suivi véhicules, fiche de travail atelier, ordre de réparation,
            pauses, absences, formations et indicateurs de rentabilité.
          </p>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <article key={feature.title} className={styles.feature}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pointage" className={styles.split}>
        <div className={styles.glassPanel}>
          <span className={styles.sectionKicker}>Pointage compagnons</span>
          <h2>Un pointage compagnon simple, fiable et adapté à l’atelier.</h2>
          <p>
            Chaque compagnon peut pointer son arrivée atelier, démarrer une intervention, se mettre en
            pause, reprendre le travail et clôturer sa journée. Le responsable garde une vision claire
            des présences, des travaux en cours et du temps réellement passé sur chaque fiche.
          </p>
        </div>
        <div className={styles.benefitList}>
          {benefits.map((benefit) => (
            <div key={benefit} className={styles.benefit}>
              <span />
              <p>{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.vehicleSection}>
        <div className={styles.sectionIntro}>
          <span className={styles.sectionKicker}>Suivi véhicules atelier</span>
          <h2>Les véhicules, les fiches et les OR restent sous contrôle.</h2>
          <p>
            Livo permet de suivre les véhicules présents à l’atelier, leurs fiches de travail,
            leur ordre de réparation et leur avancement. Le bureau sait ce qui est en attente,
            ce qui est en cours, ce qui doit être clôturé et ce qui peut être facturé.
          </p>
        </div>
      </section>

      <section id="rentabilite" className={styles.pricing}>
        <div className={styles.priceCopy}>
          <span className={styles.sectionKicker}>Rentabilité et productivité</span>
          <h2>Des chiffres lisibles pour prendre de meilleures décisions.</h2>
          <p>
            Le suivi des heures réelles, des heures facturées et des écarts aide à comprendre où l’atelier
            gagne du temps, où il en perd, et quelles interventions méritent une attention particulière.
            Livo transforme le temps réel atelier en données utiles pour la gestion atelier.
          </p>
        </div>
        <div className={styles.priceCard}>
          <span className={styles.trial}>Essai gratuit 30 jours</span>
          <div className={styles.price}>
            <strong>89 €</strong>
            <span>/ mois</span>
          </div>
          <p>Un logiciel carrosserie et mécanique clair, sans engagement.</p>
          <ul>
            <li>Pointage atelier et pointage compagnon</li>
            <li>Suivi véhicules atelier</li>
            <li>Fiches de travail et ordres de réparation</li>
            <li>Rentabilité et productivité atelier</li>
          </ul>
          <Link href="/inscription" className={styles.primaryCta}>
            Demander l’essai gratuit
          </Link>
        </div>
      </section>

      <section className={styles.target}>
        <div>
          <span className={styles.sectionKicker}>Garages et carrosseries</span>
          <h2>Pour les ateliers qui veulent travailler avec plus de précision.</h2>
          <p>
            Livo s’adresse aux garages, ateliers mécaniques, carrosseries et structures automobiles
            qui veulent mieux suivre leurs équipes, leurs véhicules et leurs temps de production,
            sans ajouter de complexité au quotidien.
          </p>
        </div>
        <Link href="/inscription" className={styles.largeCta}>
          Démarrer 30 jours d’essai
        </Link>
      </section>

      <footer className={styles.footer}>
        <span>Livo par LYSMA Solutions</span>
        <div>
          <Link href="/cookies">Cookies</Link>
          <Link href="/politique-confidentialite">Confidentialité</Link>
          <Link href="/connexion">Connexion</Link>
        </div>
      </footer>
    </main>
  )
}
