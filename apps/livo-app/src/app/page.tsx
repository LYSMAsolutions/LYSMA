import type { Metadata, Route } from 'next'
import {
  Buildings,
  CalendarCheck,
  CarProfile,
  ChartLineUp,
  CheckCircle,
  ClipboardText,
  Clock,
  DeviceMobile,
  FilePdf,
  Gauge,
  LockKey,
  QrCode,
  ShieldCheck,
  Timer,
  Wrench,
  XCircle,
} from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { LIVO_PRICING } from '@/lib/pricing'
import { canonical } from '@/lib/seo'
import { PublicSidebar } from './PublicSidebar'
import styles from './page.module.css'

const pageTitle = 'LIVO — Pointage et pilotage du temps pour ateliers automobiles'
const pageDescription =
  'LIVO relie le pointage des compagnons aux fiches de travail, aux véhicules et aux ordres de réparation afin de suivre le temps réel de l’atelier.'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    'logiciel de pointage atelier',
    'logiciel pointage garage',
    'pointage compagnon garage',
    'suivi temps réel atelier',
    'temps vendu temps réel',
    'fiche de travail garage',
    'ordre de réparation QR code',
    'relevé mensuel pointage',
    'rentabilité opérationnelle atelier',
    'logiciel carrosserie',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: canonical('/') },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: 'website',
    siteName: 'LIVO',
    url: canonical('/'),
  },
}

const dashboardStats = [
  { label: 'Compagnons présents', value: '4', detail: 'sur 6 actifs' },
  { label: 'Fiches en cours', value: '7', detail: 'dans l’atelier' },
  { label: 'Temps vendu', value: '18 h 30', detail: 'fiches clôturées' },
  { label: 'Temps réel', value: '16 h 42', detail: 'temps pointé' },
]

const features = [
  {
    icon: Timer,
    title: 'Pointage de la journée',
    text: 'Le compagnon enregistre son arrivée, ses pauses, ses reprises et son départ depuis l’espace atelier.',
  },
  {
    icon: Wrench,
    title: 'Pointage sur les travaux',
    text: 'Le temps passé est rattaché à une fiche LIVO ou à un ordre de réparation externe présent dans LIVO.',
  },
  {
    icon: ClipboardText,
    title: 'Fiches de travail',
    text: 'Créez une fiche avec le véhicule, le client, les travaux, les notes et les informations nécessaires à la clôture.',
  },
  {
    icon: DeviceMobile,
    title: 'Espace atelier séparé',
    text: 'Une tablette ou un autre appareil connecté donne accès aux compagnons par code PIN, sans ouvrir le compte administrateur.',
  },
  {
    icon: Gauge,
    title: 'Atelier en direct',
    text: 'Le tableau de bord indique les présences, les pauses, les fiches actives, les véhicules suivis et les points d’attention.',
  },
  {
    icon: ChartLineUp,
    title: 'Écarts de temps',
    text: 'Les fiches clôturées comparent le temps vendu au temps réellement pointé et valorisent l’écart avec le taux configuré.',
  },
  {
    icon: CalendarCheck,
    title: 'Rapports et absences',
    text: 'Consultez les tendances atelier, les indicateurs par compagnon, les absences et les relevés mensuels.',
  },
  {
    icon: FilePdf,
    title: 'Documents PDF',
    text: 'Téléchargez les fiches de travail et les relevés mensuels de pointage produits à partir des données enregistrées.',
  },
  {
    icon: CarProfile,
    title: 'Historique des véhicules',
    text: 'Retrouvez les véhicules, leurs clients, leurs fiches précédentes et les indicateurs issus des dossiers clôturés.',
  },
  {
    icon: ShieldCheck,
    title: 'Accès administrateur protégé',
    text: 'L’adresse email est vérifiée et le compte administrateur utilise une double authentification par application TOTP.',
  },
]

const workflowSteps = [
  {
    icon: Buildings,
    title: 'Configurer le garage',
    text: 'Renseignez le garage, les taux horaires, le mot de passe de l’espace atelier et les codes PIN des compagnons.',
  },
  {
    icon: ClipboardText,
    title: 'Préparer le travail',
    text: 'Créez une fiche LIVO ou utilisez un OR externe déjà importé, scanné ou saisi dans l’application.',
  },
  {
    icon: Timer,
    title: 'Pointer au fil de la journée',
    text: 'Chaque compagnon enregistre sa présence puis démarre et arrête le travail auquel il consacre du temps.',
  },
  {
    icon: ChartLineUp,
    title: 'Clôturer et analyser',
    text: 'Le responsable renseigne le temps vendu et le taux, puis consulte les écarts et les rapports disponibles.',
  },
]

const includedScope = [
  'Suivi des présences, pauses et départs.',
  'Temps réellement passé sur les fiches et OR présents dans LIVO.',
  'Création de fiches, suivi des véhicules et historique client associé.',
  'Clôture, temps vendu, taux horaire et indicateurs d’écart.',
  'Rapports atelier, absences et relevés mensuels PDF.',
]

const excludedScope = [
  'LIVO ne remplace pas un DMS, un logiciel de facturation ou un logiciel de comptabilité.',
  'LIVO ne gère pas les stocks, les achats de pièces, les devis ni les factures clients.',
  'Les indicateurs LIVO ne constituent pas une marge comptable complète.',
  'La connexion à un logiciel métier n’est pas automatique : elle doit être configurée et validée.',
  'LIVO est une application web connectée ; aucun mode hors ligne ni application mobile native n’est proposé.',
]

const faqItems = [
  {
    question: 'Que fait précisément LIVO dans un garage ?',
    answer:
      'LIVO suit la journée des compagnons et le temps passé sur les fiches ou OR disponibles dans l’application. Il centralise aussi les véhicules, les dossiers de travail, les clôtures, les rapports et les relevés mensuels.',
  },
  {
    question: 'LIVO remplace-t-il mon logiciel de garage ou de facturation ?',
    answer:
      'Non. LIVO ne produit ni devis ni facture et ne gère pas les stocks. Il complète l’organisation existante avec le pointage et le suivi opérationnel du temps atelier.',
  },
  {
    question: 'Comment LIVO calcule-t-il la rentabilité affichée ?',
    answer:
      'LIVO calcule un écart opérationnel entre la valeur vendue de la fiche et le temps réel valorisé avec le taux horaire configuré. Cet indicateur aide au pilotage, mais il ne remplace pas une marge comptable intégrant les pièces, les charges et tous les coûts du garage.',
  },
  {
    question: 'Peut-on utiliser LIVO sur une tablette ou un smartphone ?',
    answer:
      'Oui, depuis un navigateur web et avec une connexion internet. L’espace atelier est prévu pour un écran partagé, une tablette, un ordinateur ou un téléphone. LIVO ne propose pas de mode hors ligne.',
  },
  {
    question: 'Les compagnons doivent-ils utiliser le compte administrateur ?',
    answer:
      'Non. Le garage dispose d’un espace atelier séparé. Chaque compagnon actif peut être identifié par son code PIN avant de pointer sa journée ou une intervention.',
  },
  {
    question: 'LIVO peut-il récupérer les ordres de réparation de mon logiciel métier ?',
    answer:
      'LIVO possède des routes d’intégration et un flux QR pour les OR externes. Leur utilisation suppose toutefois une configuration technique avec le logiciel concerné. Aucun connecteur universel n’est activé automatiquement.',
  },
  {
    question: 'Que se passe-t-il sans intégration avec mon logiciel métier ?',
    answer:
      'Le garage peut créer ses propres fiches de travail dans LIVO. Un OR miroir peut aussi être saisi manuellement comme solution de secours, avec moins d’informations qu’un OR importé.',
  },
  {
    question: 'Quels documents peut-on télécharger ?',
    answer:
      'LIVO génère des fiches de travail PDF et des relevés mensuels de pointage PDF à partir des informations enregistrées dans l’application.',
  },
  {
    question: 'Quel est le prix de LIVO ?',
    answer:
      `L’offre affichée est de ${LIVO_PRICING.primaryPlan.priceMonthly} € par mois pour un garage, avec des compagnons illimités et ${LIVO_PRICING.trialDays} jours d’essai. L’activation de l’abonnement est accompagnée ; le paiement autonome en ligne n’est pas proposé dans l’application à ce jour.`,
  },
  {
    question: 'LIVO fonctionne-t-il sans matériel dédié ?',
    answer:
      'Oui. Aucun terminal propriétaire n’est imposé. Il faut toutefois disposer d’un appareil compatible avec un navigateur web récent et d’une connexion internet.',
  },
]

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'LIVO',
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'Gestion du temps atelier automobile',
  operatingSystem: 'Application web',
  url: canonical('/'),
  description: pageDescription,
  featureList: features.map((feature) => feature.title),
  offers: {
    '@type': 'Offer',
    price: String(LIVO_PRICING.primaryPlan.priceMonthly),
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LYSMA Solutions',
  url: 'https://lysmasolutions.fr',
  brand: {
    '@type': 'Brand',
    name: 'LIVO',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
}

export default function HomePage() {
  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <PublicSidebar />

      <main className={styles.content}>
        <section id="accueil" className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Application web pour garages et carrosseries</span>
            <h1>Le temps réellement passé dans l’atelier, relié au travail effectué.</h1>
            <p className={styles.lead}>
              LIVO relie la présence des compagnons aux fiches, aux véhicules et aux ordres de
              réparation disponibles dans l’application. Le responsable suit ainsi l’activité en
              cours et compare le temps vendu au temps pointé.
            </p>
            <div className={styles.heroActions}>
              <Link href="/inscription" className={styles.primaryButton}>
                Essayer LIVO pendant {LIVO_PRICING.trialDays} jours
              </Link>
              <Link href="/demo" className={styles.secondaryButton}>
                Explorer la démonstration
              </Link>
            </div>
            <p className={styles.reassurance}>
              Application web · Connexion internet requise · Aucun terminal propriétaire imposé
            </p>
          </div>

          <div className={styles.dashboardCard} aria-label="Exemple fictif de tableau de bord atelier">
            <div className={styles.dashboardHeader}>
              <div>
                <strong>Tableau de bord atelier</strong>
                <span>Exemple de présentation avec données fictives</span>
              </div>
              <span className={styles.liveBadge}>Exemple</span>
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
                <span>Temps vendu comparé au temps réel</span>
                <strong>18 h 30 / 16 h 42</strong>
              </div>
              <div className={styles.progressBar} aria-hidden="true"><span /></div>
              <small>Ces chiffres illustrent l’interface ; ils ne proviennent pas d’un garage réel.</small>
            </div>
          </div>
        </section>

        <section id="fonctionnalites" className={styles.section} aria-labelledby="features-title">
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>Fonctionnalités disponibles</span>
            <h2 id="features-title">Ce qu’un garage peut réellement faire avec LIVO</h2>
            <p>
              Les fonctions ci-dessous correspondent aux parcours présents dans l’application :
              administration du garage, espace atelier, pointage, fiches, véhicules, rapports et documents.
            </p>
          </div>
          <div className={styles.featureGrid}>
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <article key={feature.title} className={styles.featureCard}>
                  <span className={styles.featureIcon}><Icon size={24} weight="duotone" /></span>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section id="fonctionnement" className={styles.workflowSection} aria-labelledby="workflow-title">
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>Parcours quotidien</span>
            <h2 id="workflow-title">Du paramétrage au rapport atelier</h2>
            <p>Le fonctionnement suit le déroulement réel d’une journée de production.</p>
          </div>
          <div className={styles.workflowGrid}>
            {workflowSteps.map((step) => {
              const Icon = step.icon
              return (
                <article key={step.title}>
                  <span className={styles.workflowIcon}><Icon size={22} weight="duotone" /></span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section id="pilotage" className={styles.highlightSection} aria-labelledby="pilotage-title">
          <div className={styles.highlightCopy}>
            <span className={styles.sectionKicker}>Indicateur de pilotage</span>
            <h2 id="pilotage-title">Comprendre l’écart entre le vendu et le réalisé</h2>
            <p>
              À la clôture, LIVO compare le temps vendu au temps réel issu des pointages. Le taux
              horaire du garage permet de valoriser cet écart pour repérer les dossiers à examiner.
            </p>
            <p className={styles.definitionNote}>
              Cet indicateur n’est pas une marge comptable : il n’intègre pas automatiquement les
              pièces, les achats, les charges fixes ni tous les coûts de l’entreprise.
            </p>
          </div>
          <div className={styles.timeExample} aria-label="Exemple fictif de comparaison de temps">
            <div><span>Temps vendu</span><strong>2 h 00</strong></div>
            <div><span>Temps réel</span><strong>2 h 35</strong></div>
            <div><span>Écart de temps</span><strong>− 35 min</strong></div>
            <div><span>Lecture</span><strong>À examiner</strong></div>
          </div>
        </section>

        <section id="or-externes" className={styles.securitySection} aria-labelledby="external-orders-title">
          <div>
            <span className={styles.sectionKicker}>Ordres de réparation externes</span>
            <h2 id="external-orders-title">Une intégration possible, jamais supposée</h2>
            <p>
              LIVO sait recevoir et suivre un OR externe, générer ou lire son identifiant QR et
              enregistrer le temps du compagnon. Cette capacité technique doit être configurée avec
              le logiciel métier concerné avant d’être utilisée dans un garage.
            </p>
            <Link href="/api-qr-ordre-reparation-garage" className={styles.secondaryButton}>
              Comprendre le fonctionnement API et QR
            </Link>
          </div>
          <div className={styles.securityGrid}>
            <article>
              <QrCode size={24} weight="duotone" />
              <h3>Avec intégration configurée</h3>
              <p>L’OR peut être importé puis retrouvé par son numéro ou son QR code.</p>
            </article>
            <article>
              <ClipboardText size={24} weight="duotone" />
              <h3>Sans connecteur</h3>
              <p>Une fiche LIVO reste disponible ; un OR miroir peut aussi être saisi en secours.</p>
            </article>
            <article>
              <XCircle size={24} weight="duotone" />
              <h3>Pas de compatibilité automatique</h3>
              <p>La présence d’une API ne garantit pas la connexion immédiate à tous les logiciels du marché.</p>
            </article>
          </div>
        </section>

        <section id="perimetre" className={styles.section} aria-labelledby="scope-title">
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>Périmètre du produit</span>
            <h2 id="scope-title">Savoir ce que LIVO couvre avant de l’adopter</h2>
            <p>
              LIVO est un outil de pointage et de pilotage opérationnel. Il complète les logiciels
              métier du garage au lieu de prétendre les remplacer.
            </p>
          </div>
          <div className={styles.scopeGrid}>
            <article className={`${styles.scopeCard} ${styles.scopeIncluded}`}>
              <h3><CheckCircle size={22} weight="duotone" /> Ce que LIVO prend en charge</h3>
              <ul>{includedScope.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className={`${styles.scopeCard} ${styles.scopeExcluded}`}>
              <h3><XCircle size={22} weight="duotone" /> Ce que LIVO ne prétend pas faire</h3>
              <ul>{excludedScope.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </div>
        </section>

        <section id="tarifs" className={styles.pricingSection} aria-labelledby="pricing-title">
          <div className={styles.pricingCopy}>
            <span className={styles.sectionKicker}>Tarif affiché</span>
            <h2 id="pricing-title">Un garage, des compagnons illimités</h2>
            <p>
              L’inscription ouvre une période d’essai. À son terme, l’activation de l’abonnement est
              accompagnée par LYSMA Solutions ; aucun paiement autonome n’est actuellement proposé dans LIVO.
            </p>
          </div>
          <div className={styles.priceCard}>
            <span className={styles.trialBadge}>{LIVO_PRICING.trialDays} jours d’essai</span>
            <div className={styles.price}>
              <strong>{LIVO_PRICING.primaryPlan.priceMonthly} €</strong>
              <span>/ mois</span>
            </div>
            <ul>
              <li>Un garage</li>
              <li>Compagnons illimités</li>
              <li>Application web sans terminal propriétaire</li>
              <li>Pointage, fiches, véhicules, rapports et PDF</li>
              <li>Intégration OR externe sur configuration</li>
            </ul>
            <Link href="/inscription" className={styles.primaryButton}>Créer un compte d’essai</Link>
          </div>
        </section>

        <section id="faq" className={styles.section} aria-labelledby="faq-title">
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>Réponses sans ambiguïté</span>
            <h2 id="faq-title">Questions fréquentes sur LIVO</h2>
            <p>Chaque réponse décrit le fonctionnement actuel de l’application.</p>
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
            <span>Pointage et pilotage du temps pour ateliers automobiles.</span>
          </div>
          <nav aria-label="Navigation secondaire">
            <Link href={'/a-propos' as Route}>À propos</Link>
            <Link href="/demo">Démonstration</Link>
            <Link href="/connexion">Connexion</Link>
            <Link href="/inscription">Essai</Link>
            <Link href="/cookies">Cookies</Link>
            <Link href="/politique-confidentialite">Confidentialité</Link>
          </nav>
        </footer>
      </main>
    </div>
  )
}
