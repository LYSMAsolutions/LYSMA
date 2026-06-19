import type { Metadata, Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { LIVO_PRICING } from '@/lib/pricing'
import { canonical } from '@/lib/seo'
import styles from '../seo-landing.module.css'

const url = canonical('/api-qr-ordre-reparation-garage')

export const metadata: Metadata = {
  title: 'Connexion des OR et QR code pour garage | LIVO',
  description:
    'Comprendre comment un ordre de réparation peut être transmis à LIVO puis retrouvé par son numéro ou son QR code lorsque la connexion est configurée.',
  keywords: [
    'QR code ordre de réparation',
    'pointage OR garage',
    'logiciel pointage ordre réparation',
    'connexion logiciel facturation garage',
    'QR code OR atelier',
    'connexion logiciel garage',
  ],
  alternates: {
    canonical: url,
  },
  openGraph: {
    title: 'Connexion des OR et QR code pour garage | LIVO',
    description:
      'Transmission et recherche des OR par QR code lorsque la connexion entre LIVO et le logiciel atelier a été configurée.',
    url,
    type: 'website',
    siteName: 'LIVO',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'LIVO - Connexion des ordres de réparation',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url,
  description:
    'Connexion permettant de transmettre un ordre de réparation à LIVO et de le retrouver par un QR code reconnu dans l’espace atelier.',
  offers: {
    '@type': 'Offer',
    price: String(LIVO_PRICING.primaryPlan.priceMonthly),
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
  },
}

const steps = [
  "Le logiciel métier crée l'ordre de réparation dans son propre environnement.",
  "Après configuration, le logiciel transmet les informations nécessaires à LIVO.",
  "Le logiciel peut imprimer sur l'OR le QR code reconnu par LIVO.",
  'Le compagnon scanne ce QR code dans LIVO puis démarre ou arrête son pointage.',
  "Le responsable clôture ensuite l'OR dans LIVO avec le taux et les données vendues disponibles.",
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
          <span className={styles.eyebrow}>Ordres de réparation et QR code</span>
          <h1>Retrouver un OR dans l’atelier par son QR code</h1>
          <p className={styles.lead}>
            LIVO peut recevoir un ordre de réparation depuis le logiciel atelier et permettre au
            compagnon de le retrouver avec le QR code imprimé. Ce fonctionnement est disponible
            uniquement lorsque la connexion avec le logiciel concerné a été configurée et vérifiée.
          </p>
          <div className={styles.actions}>
            <Link href="/inscription" className={styles.primary}>Demander un accès LIVO</Link>
            <Link href="/demo" className={styles.secondary}>Voir la démo</Link>
          </div>
        </div>

        <aside className={styles.proof}>
          <strong>Chaque logiciel doit être vérifié</strong>
          <span>
            LIVO n’annonce aucune compatibilité automatique. La transmission des OR doit être
            configurée avec le logiciel utilisé par le garage.
          </span>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionIntro}>
          <span className={styles.kicker}>Fonctionnement dans l’atelier</span>
          <h2>Le logiciel métier reste la source de l’OR</h2>
          <p>
            Lorsque la connexion est active, LIVO conserve une copie de travail de l’OR pour le
            pointage. Les devis, factures et données comptables restent gérés dans le logiciel métier.
          </p>
        </div>
        <div className={styles.grid}>
          <article className={styles.card}>
            <h3>Connexion protégée</h3>
            <p>La transmission est activée uniquement après la configuration prévue avec le logiciel atelier.</p>
          </article>
          <article className={styles.card}>
            <h3>QR code OR</h3>
            <p>Le logiciel atelier peut imprimer un QR code que LIVO reconnaît dans l’espace compagnon.</p>
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
              La faisabilité dépend de la capacité du logiciel source à transmettre l’OR à LIVO et à
              imprimer le QR code prévu. Aucune compatibilité avec un éditeur précis n’est
              annoncée tant que ce parcours n’a pas été configuré et vérifié.
            </p>
          </div>
          <ul className={styles.list}>
            <li>Import et mise à jour d’un OR après configuration.</li>
            <li>QR code utilisable par le compagnon dans l’espace atelier.</li>
            <li>Saisie manuelle d’un ordre de réparation lorsque le logiciel n’est pas connecté.</li>
            <li>Clôture dans LIVO avec taux horaire, temps vendu et écart opérationnel.</li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionIntro}>
          <span className={styles.kicker}>Parcours de l’OR</span>
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
            <p>Non. Les devis et factures restent dans le logiciel métier. LIVO suit le pointage et l’écart de temps de l’OR présent dans l’application.</p>
          </article>
          <article className={styles.faq}>
            <h3>Un garage sans connexion au logiciel atelier peut-il utiliser LIVO ?</h3>
            <p>Oui. Il peut créer une fiche LIVO ou saisir un ordre de réparation. Cette solution demande davantage de saisie qu’une connexion configurée.</p>
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
