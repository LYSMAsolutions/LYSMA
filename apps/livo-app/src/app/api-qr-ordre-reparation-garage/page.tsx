import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { canonical } from '@/lib/seo'
import styles from '../seo-landing.module.css'

const url = canonical('/api-qr-ordre-reparation-garage')

export const metadata: Metadata = {
  title: 'API QR code OR garage | LIVO ordre de réparation',
  description:
    'API LIVO pour logiciels de facturation atelier : génération QR code sur ordre de réparation, pointage compagnon, suivi temps réel et clôture admin.',
  keywords: [
    'API QR code ordre de réparation',
    'pointage OR garage',
    'logiciel pointage ordre réparation',
    'logiciel facturation garage API',
    'QR code OR atelier',
    'GTAPRO pointage atelier',
    'Lacour pointage garage',
    'logiciel MRA franchisé',
  ],
  alternates: {
    canonical: url,
  },
  openGraph: {
    title: 'API QR code OR garage | LIVO',
    description:
      'Connecter LIVO aux logiciels de facturation atelier pour pointer les OR par QR code, sans double saisie admin.',
    url,
    type: 'website',
    siteName: 'LIVO',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'LIVO API OR',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url,
  description:
    'API web pour importer les ordres de réparation des logiciels de facturation atelier et générer un QR code reconnu par LIVO.',
  offers: {
    '@type': 'Offer',
    price: '89',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
  },
}

const steps = [
  "Le logiciel de facturation crée l'ordre de réparation comme aujourd'hui.",
  "L'éditeur envoie les données OR à LIVO via une API sécurisée.",
  "Le logiciel imprime un QR code sur l'OR remis au compagnon.",
  'Le compagnon scanne le QR code, pointe et dépointe, sans choisir de taux horaire.',
  "L'admin clôture ensuite l'OR avec les taux et les informations de rentabilité.",
]

export default function ApiQrOrSeoPage() {
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
          <Link href="/logiciel-pointage-garage-dordogne">Dordogne</Link>
          <Link href="/demo">Démo</Link>
          <Link href="/inscription">Essai gratuit</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>API QR code pour OR atelier</span>
          <h1>Pointage OR garage par QR code, sans double saisie admin</h1>
          <p className={styles.lead}>
            LIVO peut recevoir les ordres de réparation créés dans le logiciel de facturation atelier,
            générer un QR code et permettre aux compagnons de pointer directement sur l'OR.
          </p>
          <div className={styles.actions}>
            <Link href="/inscription" className={styles.primary}>Demander un accès LIVO</Link>
            <Link href="/demo" className={styles.secondary}>Voir la démo</Link>
          </div>
        </div>

        <aside className={styles.proof}>
          <strong>Objectif intégration</strong>
          <span>
            LIVO fournit une API à l'éditeur du logiciel de facturation. Le garage garde son logiciel métier
            comme source de l'OR, et LIVO mesure le temps réel atelier.
          </span>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionIntro}>
          <span className={styles.kicker}>Flux pensé atelier</span>
          <h2>Le compagnon pointe. L'admin clôture. Le logiciel de facturation reste la source.</h2>
          <p>
            Le but n'est pas de demander à l'admin de recréer les ordres de réparation dans LIVO. Le but est
            d'éviter les doubles tâches entre le logiciel de facturation et l'outil de suivi atelier.
          </p>
        </div>
        <div className={styles.grid}>
          <article className={styles.card}>
            <h3>API sécurisée</h3>
            <p>Import ou mise à jour des OR depuis le logiciel métier avec client, véhicule, immatriculation et travaux.</p>
          </article>
          <article className={styles.card}>
            <h3>QR code OR</h3>
            <p>Le QR code imprimé sur l'ordre de réparation permet au compagnon de retrouver l'OR en atelier.</p>
          </article>
          <article className={styles.card}>
            <h3>Pointage simple</h3>
            <p>Le compagnon ne choisit pas de taux horaire : il pointe, dépointe, et l'admin renseigne les taux à la clôture.</p>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.split}>
          <div className={styles.splitPanel}>
            <span className={styles.kicker}>Compatibilité logicielle</span>
            <h2>Un pont possible avec les logiciels de facturation atelier.</h2>
            <p>
              LIVO est pensé pour être compatible avec les logiciels de facturation du marché lorsque l'éditeur
              implémente l'API : GTAPRO, Lacour ou d'autres solutions utilisées par les MRA, garages franchisés
              et ateliers indépendants.
            </p>
          </div>
          <ul className={styles.list}>
            <li>Connexion possible par API documentée pour les éditeurs.</li>
            <li>QR code utilisable sur les OR imprimés par le logiciel de facturation.</li>
            <li>Fallback manuel si le garage n'a pas encore d'intégration API.</li>
            <li>Clôture admin avec taux horaire, temps vendu et rentabilité.</li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionIntro}>
          <span className={styles.kicker}>Parcours API</span>
          <h2>Comment fonctionne le QR code sur un ordre de réparation ?</h2>
        </div>
        <ul className={styles.list}>
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <div className={styles.faqGrid}>
          <article className={styles.faq}>
            <h3>LIVO remplace-t-il le logiciel de facturation ?</h3>
            <p>Non. LIVO complète le logiciel de facturation en ajoutant le pointage atelier, le suivi temps réel et la rentabilité.</p>
          </article>
          <article className={styles.faq}>
            <h3>Un garage sans API peut-il utiliser LIVO ?</h3>
            <p>Oui. Le compagnon peut retrouver un OR par numéro ou l'atelier peut créer une fiche de travail interne si besoin.</p>
          </article>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>LIVO par LYSMA Solutions</span>
        <div>
          <Link href="/">Accueil</Link>
          <Link href="/logiciel-pointage-garage-dordogne">Dordogne</Link>
          <Link href="/conformite-temps-travail">Conformité</Link>
          <Link href="/politique-confidentialite">Confidentialité</Link>
        </div>
      </footer>
    </main>
  )
}
