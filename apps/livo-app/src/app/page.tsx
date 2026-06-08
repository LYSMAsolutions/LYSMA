import type { Metadata } from 'next'
import {
  CalendarCheck,
  CarProfile,
  ChartLineUp,
  Clock,
  LockKey,
  QrCode,
  ShieldCheck,
  Timer,
  Wrench,
} from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import Link from 'next/link'
import { canonical } from '@/lib/seo'
import styles from './page.module.css'

const pageTitle = 'LIVO — Logiciel de pointage atelier pour garages et carrosseries'
const pageDescription =
  'LIVO aide les garages et carrosseries à suivre le pointage des compagnons, les véhicules, les ordres de réparation, le temps vendu vs temps réel et la rentabilité atelier.'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    'logiciel de pointage atelier',
    'logiciel pointage garage',
    'logiciel carrosserie',
    'pointage compagnon',
    'pointage atelier',
    'temps vendu vs temps réel',
    'rentabilité atelier',
    'rentabilité compagnon',
    'suivi véhicules atelier',
    'ordre de réparation garage',
    'relevés mensuels atelier',
    'logiciel garage indépendant',
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: canonical('/'),
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: 'website',
    siteName: 'LIVO',
    url: canonical('/'),
  },
}

const navItems = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Pointage atelier', href: '#pointage-atelier' },
  { label: 'Temps vendu vs temps réel', href: '#temps-reel' },
  { label: 'Rentabilité atelier', href: '#rentabilite' },
  { label: 'Relevés mensuels', href: '#releves' },
  { label: 'Fonctionnement', href: '#fonctionnement' },
  { label: 'Tarifs', href: '#tarifs' },
  { label: 'FAQ', href: '#faq' },
]

const dashboardStats = [
  { label: 'Compagnons actifs', value: '6', detail: 'présents atelier' },
  { label: 'Véhicules suivis', value: '14', detail: 'en production' },
  { label: 'OR en cours', value: '18', detail: 'à piloter' },
  { label: 'Rentabilité atelier', value: '87 %', detail: 'lecture du jour' },
]

const painPoints = [
  'Les heures réelles sont parfois estimées trop tard.',
  'Les fiches papier se dispersent entre le bureau et l’atelier.',
  'Le temps perdu sur une intervention n’est pas toujours mesuré.',
  'Les véhicules en attente manquent de visibilité.',
  'Les écarts entre temps vendu et temps réel restent invisibles.',
]

const positioningCards = [
  {
    title: 'Badgeuse RH',
    text: 'Elle suit la présence, mais ne rattache pas le temps aux véhicules, aux OR et à la rentabilité atelier.',
  },
  {
    title: 'DMS complet',
    text: 'Il peut être puissant, mais souvent trop lourd si le garage veut seulement mieux suivre son temps réel.',
  },
  {
    title: 'LIVO',
    text: 'LIVO complète votre organisation avec une couche simple de pointage, de preuve et de pilotage atelier.',
  },
]

const features = [
  {
    icon: Timer,
    title: 'Pointage compagnon',
    text: 'Arrivée, pause, reprise, intervention et fin de journée depuis une interface lisible.',
  },
  {
    icon: Wrench,
    title: 'Pointage par OR ou véhicule',
    text: 'Le temps peut être rattaché à une fiche, un véhicule ou un ordre de réparation externe.',
  },
  {
    icon: Clock,
    title: 'Temps vendu vs temps réel',
    text: 'Comparez le temps facturé avec le temps réellement passé à l’atelier.',
  },
  {
    icon: ChartLineUp,
    title: 'Rentabilité par compagnon',
    text: 'Repérez les écarts, les temps improductifs et les interventions à surveiller.',
  },
  {
    icon: CarProfile,
    title: 'Suivi véhicules atelier',
    text: 'Gardez une vision claire des véhicules présents, en cours, en attente ou à clôturer.',
  },
  {
    icon: CalendarCheck,
    title: 'Relevés mensuels',
    text: 'Générez des relevés propres pour le suivi du temps de travail et les contrôles internes.',
  },
  {
    icon: QrCode,
    title: 'API QR code OR',
    text: 'Préparez la connexion avec vos OR existants via QR code ou API partenaire.',
  },
  {
    icon: ShieldCheck,
    title: 'Sécurité renforcée',
    text: 'Email validé, double authentification et protections serveur pour les accès sensibles.',
  },
]

const targets = [
  'Garages de 2 à 10 compagnons',
  'Carrosseries indépendantes',
  'Ateliers mécaniques',
  'MRA et agents de marque',
  'Petits ateliers qui ne veulent pas installer une usine à gaz',
]

const faqItems = [
  {
    question: 'LIVO remplace-t-il mon logiciel de garage ?',
    answer:
      'Non. LIVO ne remplace pas votre DMS, votre logiciel de facturation ou votre outil métier. Il ajoute une couche de pointage, de temps réel et de rentabilité atelier.',
  },
  {
    question: 'Le pointage se fait-il par ordre de réparation ?',
    answer:
      'Oui. Le compagnon peut pointer sur une fiche LIVO, un véhicule ou un numéro d’ordre de réparation externe selon l’organisation du garage.',
  },
  {
    question: 'Peut-on utiliser LIVO sur tablette ?',
    answer:
      'Oui. LIVO fonctionne sur ordinateur, tablette et smartphone. L’atelier peut donc pointer depuis un écran partagé ou depuis un téléphone.',
  },
  {
    question: 'LIVO compare-t-il le temps vendu et le temps réel ?',
    answer:
      'Oui. LIVO permet de comparer le temps vendu, le temps réellement pointé et l’écart entre les deux pour mieux comprendre la rentabilité.',
  },
  {
    question: 'LIVO calcule-t-il la rentabilité par compagnon ?',
    answer:
      'Oui. Les temps pointés permettent d’analyser la productivité et la rentabilité par compagnon, par véhicule ou par intervention.',
  },
  {
    question: 'LIVO génère-t-il des relevés mensuels ?',
    answer:
      'Oui. LIVO permet de générer des relevés mensuels de pointage avec les heures, les pauses, les absences et les éléments de suivi utiles.',
  },
  {
    question: 'LIVO est-il adapté aux petits garages ?',
    answer:
      'Oui. LIVO est pensé pour les garages indépendants qui veulent un outil simple, sans matériel spécifique et sans déployer une solution lourde.',
  },
  {
    question: 'LIVO fonctionne-t-il pour une carrosserie ?',
    answer:
      'Oui. LIVO convient aux carrosseries qui veulent suivre les compagnons, les véhicules, les travaux en cours et les écarts entre temps prévu et temps réel.',
  },
  {
    question: 'Existe-t-il une API ou un QR code pour les OR ?',
    answer:
      'Oui. LIVO prévoit une architecture API et QR code pour rattacher le pointage aux OR créés dans un logiciel métier existant.',
  },
  {
    question: 'Quel est le prix de LIVO ?',
    answer:
      'LIVO est proposé à 89 € par mois, avec 30 jours d’essai gratuit, sans engagement et sans matériel spécifique obligatoire.',
  },
]

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'LIVO',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: canonical('/'),
  description: pageDescription,
  offers: {
    '@type': 'Offer',
    price: '89',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LYSMA Solutions',
  url: 'https://lysmasolutions.fr',
  email: 'lysmasolutions@gmail.com',
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

export default function HomePage() {
  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <aside className={styles.sidebar} aria-label="Navigation LIVO">
        <Link href="/" className={styles.brand} aria-label="Accueil LIVO">
          <Image src="/logo/livo-app-logo.png" alt="" width={46} height={46} priority />
          <span>
            <strong>LIVO</strong>
            <small>Pointage atelier</small>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Navigation principale">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.sidebarActions}>
          <Link href="/connexion" className={styles.secondaryButton}>
            Connexion
          </Link>
          <Link href="/inscription" className={styles.primaryButton}>
            Essai gratuit
          </Link>
        </div>
      </aside>

      <main className={styles.content}>
        <section id="accueil" className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Logiciel français pour ateliers automobiles</span>
            <h1>Le logiciel de pointage atelier pensé pour les garages et carrosseries</h1>
            <p className={styles.lead}>
              LIVO aide les ateliers à suivre les compagnons, les véhicules, les ordres de
              réparation et la rentabilité en temps réel, sans remplacer votre logiciel de garage.
            </p>
            <div className={styles.heroActions}>
              <Link href="/inscription" className={styles.primaryButton}>
                Essayer 30 jours gratuitement
              </Link>
              <Link href="/demo" className={styles.secondaryButton}>
                Voir la démo
              </Link>
            </div>
            <p className={styles.reassurance}>
              89 € / mois après l’essai. Sans engagement. Aucun matériel spécifique obligatoire.
            </p>
          </div>

          <div className={styles.dashboardCard} aria-label="Aperçu du tableau de bord atelier">
            <div className={styles.dashboardHeader}>
              <div>
                <strong>Tableau de bord atelier</strong>
                <span>Temps réel, OR, véhicules et rentabilité</span>
              </div>
              <span className={styles.liveBadge}>En direct</span>
            </div>

            <div className={styles.dashboardStats}>
              {dashboardStats.map((stat) => (
                <div key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                  <small>{stat.detail}</small>
                </div>
              ))}
            </div>

            <div className={styles.comparisonPanel}>
              <div>
                <span>Temps vendu vs temps réel</span>
                <strong>2h00 / 2h35</strong>
              </div>
              <div className={styles.progressBar} aria-hidden="true">
                <span />
              </div>
              <small>Écart détecté : +35 min</small>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="probleme-title">
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>Problème terrain</span>
            <h2 id="probleme-title">Sans suivi précis, la rentabilité atelier reste floue</h2>
            <p>
              Dans un garage ou une carrosserie, quelques minutes mal suivies sur chaque
              intervention finissent par peser lourd. LIVO rend le temps atelier lisible,
              exploitable et rattaché aux véhicules ou aux OR.
            </p>
          </div>
          <div className={styles.problemGrid}>
            {painPoints.map((point) => (
              <article key={point} className={styles.problemCard}>
                <span />
                <p>{point}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="positionnement-title">
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>Positionnement</span>
            <h2 id="positionnement-title">Ni badgeuse RH, ni DMS complet</h2>
            <p>
              LIVO ne cherche pas à remplacer votre organisation. Il complète votre logiciel de
              garage en mesurant ce qui manque souvent : le temps réel atelier.
            </p>
          </div>
          <div className={styles.positionGrid}>
            {positioningCards.map((card) => (
              <article key={card.title} className={styles.positionCard}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="pointage-atelier" className={styles.section} aria-labelledby="features-title">
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>Fonctionnalités clés</span>
            <h2 id="features-title">Tout ce qu’il faut pour piloter le temps atelier</h2>
            <p>
              Les écrans restent simples pour les compagnons. Les données deviennent utiles pour
              le responsable : présence, OR, véhicules, temps réel, relevés et rentabilité.
            </p>
          </div>
          <div className={styles.featureGrid}>
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <article key={feature.title} className={styles.featureCard}>
                  <span className={styles.featureIcon}>
                    <Icon size={24} weight="duotone" />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section id="temps-reel" className={styles.highlightSection} aria-labelledby="temps-title">
          <div className={styles.highlightCopy}>
            <span className={styles.sectionKicker}>Temps vendu vs temps réel</span>
            <h2 id="temps-title">Comparez enfin le temps facturé et le temps réellement passé</h2>
            <p>
              LIVO permet d’identifier les écarts, les interventions moins rentables et les pertes
              de temps récurrentes.
            </p>
          </div>
          <div className={styles.timeExample}>
            <div>
              <span>Temps vendu</span>
              <strong>2h00</strong>
            </div>
            <div>
              <span>Temps réel</span>
              <strong>2h35</strong>
            </div>
            <div>
              <span>Écart</span>
              <strong>+35 min</strong>
            </div>
            <div>
              <span>Productivité</span>
              <strong>77 %</strong>
            </div>
          </div>
        </section>

        <section id="rentabilite" className={styles.section} aria-labelledby="target-title">
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>Pour qui ?</span>
            <h2 id="target-title">Conçu pour les garages et carrosseries indépendants</h2>
            <p>
              LIVO s’adresse aux ateliers qui veulent une lecture fiable du terrain sans alourdir
              le quotidien des équipes.
            </p>
          </div>
          <div className={styles.targetGrid}>
            {targets.map((target) => (
              <div key={target} className={styles.targetItem}>
                <Wrench size={18} weight="duotone" />
                <span>{target}</span>
              </div>
            ))}
          </div>
        </section>

        <section
          id="fonctionnement"
          className={styles.workflowSection}
          aria-labelledby="fonctionnement-title"
        >
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>Fonctionnement</span>
            <h2 id="fonctionnement-title">Un fonctionnement simple pour l’atelier</h2>
          </div>
          <div className={styles.workflowGrid}>
            <article>
              <span>1</span>
              <h3>Le compagnon pointe</h3>
              <p>Il utilise une tablette, un smartphone ou un PC depuis l’atelier.</p>
            </article>
            <article>
              <span>2</span>
              <h3>LIVO rattache le temps</h3>
              <p>Le temps est lié au véhicule, à l’OR ou à la fiche de travail.</p>
            </article>
            <article>
              <span>3</span>
              <h3>Le responsable analyse</h3>
              <p>Il suit les écarts, les relevés mensuels et la rentabilité atelier.</p>
            </article>
          </div>
        </section>

        <section id="releves" className={styles.securitySection} aria-labelledby="security-title">
          <div>
            <span className={styles.sectionKicker}>Relevés mensuels et sécurité</span>
            <h2 id="security-title">Des données de pointage mieux structurées et mieux protégées</h2>
            <p>
              LIVO aide à produire des relevés mensuels lisibles et protège les accès sensibles
              avec email validé et double authentification compatible Google Authenticator.
            </p>
          </div>
          <div className={styles.securityGrid}>
            <article>
              <CalendarCheck size={24} weight="duotone" />
              <h3>Relevés mensuels</h3>
              <p>Heures, pauses, absences et validations regroupées proprement.</p>
            </article>
            <article>
              <LockKey size={24} weight="duotone" />
              <h3>Double authentification</h3>
              <p>Connexion sécurisée avec un code généré sur téléphone.</p>
            </article>
            <article>
              <ShieldCheck size={24} weight="duotone" />
              <h3>Accès contrôlés</h3>
              <p>Les règles importantes sont vérifiées côté serveur.</p>
            </article>
          </div>
        </section>

        <section id="tarifs" className={styles.pricingSection} aria-labelledby="pricing-title">
          <div className={styles.pricingCopy}>
            <span className={styles.sectionKicker}>Tarifs</span>
            <h2 id="pricing-title">Un tarif simple pour démarrer sans matériel spécifique</h2>
            <p>
              LIVO reste volontairement lisible : un abonnement mensuel, un essai gratuit et une
              mise en route adaptée aux garages et carrosseries indépendants.
            </p>
          </div>
          <div className={styles.priceCard}>
            <span className={styles.trialBadge}>30 jours d’essai gratuit</span>
            <div className={styles.price}>
              <strong>89 €</strong>
              <span>/ mois</span>
            </div>
            <ul>
              <li>Sans engagement</li>
              <li>Pas de matériel spécifique obligatoire</li>
              <li>Usage tablette, smartphone et PC</li>
              <li>Pointage, OR, véhicules, relevés et rentabilité</li>
            </ul>
            <Link href="/inscription" className={styles.primaryButton}>
              Demander un accès LIVO
            </Link>
          </div>
        </section>

        <section id="faq" className={styles.section} aria-labelledby="faq-title">
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>FAQ</span>
            <h2 id="faq-title">Questions fréquentes sur LIVO</h2>
            <p>
              Les réponses essentielles pour comprendre comment LIVO s’intègre dans un atelier
              automobile sans remplacer votre logiciel métier.
            </p>
          </div>
          <div className={styles.faqGrid}>
            {faqItems.map((item) => (
              <article key={item.question} className={styles.faqItem}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <div>
            <strong>LIVO</strong>
            <span>Logiciel français de pointage atelier pour garages et carrosseries.</span>
          </div>
          <nav aria-label="Navigation secondaire">
            <Link href="/connexion">Connexion</Link>
            <Link href="/inscription">Essai gratuit</Link>
            <Link href="/demo">Démo</Link>
            <Link href="/cookies">Cookies</Link>
            <Link href="/politique-confidentialite">Confidentialité</Link>
          </nav>
        </footer>
      </main>
    </div>
  )
}
