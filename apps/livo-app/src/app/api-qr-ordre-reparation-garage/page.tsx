import type { Metadata, Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { LIVO_PRICING } from '@/lib/pricing'
import { canonical } from '@/lib/seo'
import styles from '../seo-landing.module.css'

const url = canonical('/api-qr-ordre-reparation-garage')

export const metadata: Metadata = {
  title: 'Intégration API et QR pour OR garage | LIVO',
  description:
    'Comprendre le flux technique permettant d’importer un ordre de réparation dans LIVO et de l’identifier par QR code lorsque l’intégration est configurée.',
  keywords: [
    'API QR code ordre de réparation',
    'pointage OR garage',
    'logiciel pointage ordre réparation',
    'logiciel facturation garage API',
    'QR code OR atelier',
    'intégration logiciel garage',
  ],
  alternates: {
    canonical: url,
  },
  openGraph: {
    title: 'API QR code OR garage | LIVO',
    description:
      'Flux API et QR disponible lorsque la connexion entre LIVO et le logiciel métier a été configurée.',
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
    'Endpoint web pour importer un ordre de réparation et retourner une valeur pouvant être encodée dans un QR code reconnu par LIVO.',
  offers: {
    '@type': 'Offer',
    price: String(LIVO_PRICING.primaryPlan.priceMonthly),
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
  },
}

const steps = [
  "Le logiciel métier crée l'ordre de réparation dans son propre environnement.",
  "Après configuration, l'éditeur ou l'intégrateur transmet les données nécessaires à LIVO.",
  "L'API retourne une valeur QR que le logiciel source peut encoder et imprimer sur l'OR.",
  'Le compagnon scanne ce QR code dans LIVO puis démarre ou arrête son pointage.',
  "Le responsable clôture ensuite l'OR miroir avec le taux et les données vendues disponibles.",
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
          <Link href={'/a-propos' as Route}>À propos</Link>
          <Link href="/logiciel-pointage-garage-dordogne">Dordogne</Link>
          <Link href="/demo">Démo</Link>
          <Link href="/inscription">Essai gratuit</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>API QR code pour OR atelier</span>
          <h1>Préparer un flux OR par API et QR code</h1>
          <p className={styles.lead}>
            LIVO peut recevoir un ordre de réparation externe et retourner une valeur destinée à
            être encodée dans un QR code. Ce parcours fonctionne uniquement après mise en place de
            l’intégration avec le logiciel source.
          </p>
          <div className={styles.actions}>
            <Link href="/inscription" className={styles.primary}>Demander un accès LIVO</Link>
            <Link href="/demo" className={styles.secondary}>Voir la démo</Link>
          </div>
        </div>

        <aside className={styles.proof}>
          <strong>Capacité technique, pas connecteur universel</strong>
          <span>
            L’API LIVO fournit le socle d’échange. Elle ne rend pas automatiquement compatible un
            logiciel métier qui n’a pas implémenté ce flux.
          </span>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionIntro}>
          <span className={styles.kicker}>Flux pensé atelier</span>
          <h2>Le logiciel métier reste la source de l’OR</h2>
          <p>
            Lorsque l’intégration est active, LIVO conserve un miroir opérationnel de l’OR pour le
            pointage. Les devis, factures et données comptables restent gérés dans le logiciel métier.
          </p>
        </div>
        <div className={styles.grid}>
          <article className={styles.card}>
            <h3>API sécurisée</h3>
            <p>L’endpoint d’intégration est protégé par une clé interne partagée lors de la configuration.</p>
          </article>
          <article className={styles.card}>
            <h3>QR code OR</h3>
            <p>L’API retourne une valeur que le logiciel source peut transformer en QR code imprimé.</p>
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
            <h2>Une connexion à valider avec chaque logiciel</h2>
            <p>
              La faisabilité dépend de la capacité du logiciel source à appeler l’API LIVO et à
              imprimer la valeur QR retournée. Aucune compatibilité avec un éditeur précis n’est
              annoncée tant que ce parcours n’a pas été configuré et vérifié.
            </p>
          </div>
          <ul className={styles.list}>
            <li>Import et mise à jour d’un OR externe par endpoint protégé.</li>
            <li>Valeur QR retournée au système qui réalise l’intégration.</li>
            <li>Saisie manuelle d’un OR miroir comme solution de secours.</li>
            <li>Clôture dans LIVO avec taux horaire, temps vendu et écart opérationnel.</li>
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
            <p>Non. Les devis et factures restent dans le logiciel métier. LIVO suit le pointage et l’écart de temps de l’OR miroir.</p>
          </article>
          <article className={styles.faq}>
            <h3>Un garage sans API peut-il utiliser LIVO ?</h3>
            <p>Oui. Il peut créer une fiche LIVO ou saisir un OR miroir. Cette solution demande davantage de saisie qu’une intégration configurée.</p>
          </article>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>LIVO par LYSMA Solutions</span>
        <div>
          <Link href="/">Accueil</Link>
          <Link href={'/a-propos' as Route}>À propos</Link>
          <Link href="/logiciel-pointage-garage-dordogne">Dordogne</Link>
          <Link href="/conformite-temps-travail">Conformité</Link>
          <Link href="/politique-confidentialite">Confidentialité</Link>
        </div>
      </footer>
    </main>
  )
}
