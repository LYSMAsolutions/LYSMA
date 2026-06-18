import type { Metadata } from 'next'
import {
  ChartLineUp,
  ClipboardText,
  Eye,
  ShieldCheck,
  Timer,
  Wrench,
} from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import Link from 'next/link'
import { canonical } from '@/lib/seo'
import styles from '../seo-landing.module.css'

const title = 'À propos de LIVO — Mission et périmètre du logiciel'
const description =
  'Découvrez pourquoi LIVO a été conçu, ce que l’application apporte aux ateliers automobiles et les limites clairement assumées de son périmètre.'

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  alternates: { canonical: canonical('/a-propos') },
  openGraph: {
    title,
    description,
    type: 'website',
    siteName: 'LIVO',
    url: canonical('/a-propos'),
  },
}

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: title,
  description,
  url: canonical('/a-propos'),
  mainEntity: {
    '@type': 'SoftwareApplication',
    name: 'LIVO',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Application web',
    publisher: {
      '@type': 'Organization',
      name: 'LYSMA Solutions',
      url: 'https://lysmasolutions.fr',
    },
  },
}

const principles = [
  {
    icon: Eye,
    title: 'Rendre le travail visible',
    text: 'Le responsable doit pouvoir relier le temps enregistré à une journée, une fiche, un véhicule ou un OR présent dans LIVO.',
  },
  {
    icon: Timer,
    title: 'Saisir au bon moment',
    text: 'Le pointage est effectué dans l’atelier, au fil du travail, afin d’éviter une reconstitution approximative en fin de journée.',
  },
  {
    icon: ChartLineUp,
    title: 'Produire des indicateurs lisibles',
    text: 'LIVO transforme les temps enregistrés en comparaisons opérationnelles compréhensibles, sans les présenter comme une comptabilité complète.',
  },
  {
    icon: ShieldCheck,
    title: 'Séparer les accès',
    text: 'Le compte administrateur et l’espace atelier répondent à des usages différents et disposent de mécanismes d’accès distincts.',
  },
]

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />

      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <Image src="/logo/livo-app-logo.png" alt="" width={38} height={38} priority />
          <span>LIVO</span>
        </Link>
        <nav className={styles.nav} aria-label="Navigation principale">
          <Link href="/">Présentation</Link>
          <Link href="/demo">Démonstration</Link>
          <Link href="/#tarifs">Tarifs</Link>
          <Link href="/connexion">Connexion</Link>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>À propos de LIVO</span>
            <h1>Un outil centré sur le temps réellement consacré au travail atelier.</h1>
            <p className={styles.lead}>
              LIVO est une application web éditée par LYSMA Solutions pour les garages,
              carrosseries et ateliers automobiles. Sa mission est de relier le pointage des
              compagnons aux travaux suivis par l’entreprise, sans remplacer les logiciels de
              facturation, de comptabilité ou de gestion de stock.
            </p>
            <div className={styles.actions}>
              <Link href="/demo" className={styles.primary}>Voir la démonstration</Link>
              <Link href="/#fonctionnalites" className={styles.secondary}>Consulter les fonctions</Link>
            </div>
          </div>
          <aside className={styles.proof} aria-label="Positionnement de LIVO">
            <strong>Le rôle de LIVO</strong>
            <span>Donner une lecture opérationnelle du temps atelier.</span>
            <ul>
              <li>Présence et pauses des compagnons.</li>
              <li>Temps passé sur les fiches et OR disponibles.</li>
              <li>Suivi des véhicules et dossiers de travail.</li>
              <li>Comparaison du temps vendu et du temps réel.</li>
              <li>Rapports et documents issus des données saisies.</li>
            </ul>
          </aside>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionIntro}>
            <span className={styles.kicker}>Pourquoi LIVO existe</span>
            <h2>Éviter que le temps atelier reste une estimation tardive</h2>
            <p>
              Une fiche peut être connue du bureau sans que le temps réellement passé soit mesuré
              au moment où le travail a lieu. LIVO crée un lien direct entre l’activité du
              compagnon et le dossier suivi. Le responsable dispose ainsi d’informations plus
              structurées pour comprendre la journée et préparer ses décisions.
            </p>
          </div>
          <div className={styles.grid}>
            {principles.map((principle) => {
              const Icon = principle.icon
              return (
                <article key={principle.title} className={styles.card}>
                  <Icon size={26} weight="duotone" />
                  <h3>{principle.title}</h3>
                  <p>{principle.text}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.split}>
            <article className={styles.splitPanel}>
              <span className={styles.kicker}>Conception du produit</span>
              <h2>Deux espaces pour deux usages</h2>
              <p>
                L’espace administrateur sert à préparer les fiches, suivre l’activité, clôturer les
                dossiers et consulter les rapports. L’espace atelier est conçu pour le pointage
                quotidien des compagnons sur un appareil partagé ou individuel.
              </p>
              <ul className={styles.list}>
                <li><ClipboardText size={18} /> Administration des fiches, véhicules et rapports.</li>
                <li><Wrench size={18} /> Pointage simplifié dans l’atelier.</li>
                <li><ShieldCheck size={18} /> Accès séparés pour limiter l’exposition du compte administrateur.</li>
              </ul>
            </article>
            <article className={styles.splitPanel}>
              <span className={styles.kicker}>Transparence</span>
              <h2>Un périmètre volontairement défini</h2>
              <p>
                LIVO ne génère pas les devis et les factures, ne gère pas les stocks et ne calcule
                pas une marge comptable exhaustive. Les connexions aux logiciels métier doivent
                être configurées au cas par cas. L’application fonctionne dans un navigateur avec
                une connexion internet et ne dispose pas de mode hors ligne.
              </p>
              <p>
                Cette délimitation permet de présenter LIVO pour ce qu’il est : un outil de
                pointage et de pilotage du temps, destiné à compléter l’organisation du garage.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionIntro}>
            <span className={styles.kicker}>Éditeur</span>
            <h2>LIVO est édité par LYSMA Solutions</h2>
            <p>
              LYSMA Solutions conçoit et maintient l’application LIVO. Le produit évolue autour
              d’un objectif constant : enregistrer le temps atelier de manière compréhensible et
              le relier aux dossiers que le garage suit réellement.
            </p>
          </div>
          <div className={styles.actions}>
            <Link href="/" className={styles.secondary}>Retour à la présentation</Link>
            <Link href="/inscription" className={styles.primary}>Créer un compte d’essai</Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>LIVO — LYSMA Solutions</span>
        <div>
          <Link href="/politique-confidentialite">Confidentialité</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/">Présentation</Link>
        </div>
      </footer>
    </div>
  )
}
