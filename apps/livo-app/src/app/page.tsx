import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'LIVO-APP - Gestion atelier garage et carrosserie',
  description:
    'LIVO-APP aide les garages et carrosseries a suivre les fiches de travaux, les pointages, les vehicules, la rentabilite et les absences atelier.',
  robots: {
    index: true,
    follow: true,
  },
}

const features = [
  {
    title: 'Fiches de travaux claires',
    text: 'Creation, suivi et cloture des interventions avec vehicule, client, temps passe et rentabilite.',
  },
  {
    title: 'Pointage atelier en direct',
    text: 'Les compagnons pointent et depointent depuis une interface simple, lisible et adaptee au terrain.',
  },
  {
    title: 'Rentabilite visible',
    text: 'CA, temps facture, temps reel et ecarts deviennent lisibles sans tableur a refaire le soir.',
  },
  {
    title: 'RH integre',
    text: 'Absences, activite compagnon et releves utiles pour garder une vision propre de l equipe.',
  },
]

const steps = [
  'Creation du garage en quelques minutes',
  'Essai gratuit pendant 30 jours',
  'Puis 89 € par mois, sans engagement',
]

export default function HomePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Accueil LIVO-APP">
          <Image src="/logo/livo-app-logo.png" alt="" width={44} height={44} priority />
          <span>LIVO-APP</span>
        </Link>
        <nav className={styles.nav} aria-label="Navigation principale">
          <a href="#fonctionnalites">Fonctionnalités</a>
          <a href="#tarif">Tarif</a>
          <Link href="/connexion">Connexion</Link>
          <Link href="/inscription" className={styles.navCta}>
            Essayer 30 jours
          </Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>Gestion atelier automobile</span>
          <h1>Gardez le controle de votre garage, sans complexite.</h1>
          <p className={styles.lead}>
            LIVO-APP centralise les fiches de travaux, les véhicules, les clients,
            les pointages atelier, les absences et la rentabilité. Un outil pensé
            pour les garages et carrosseries qui veulent du clair, du rapide, du fiable.
          </p>
          <div className={styles.heroActions}>
            <Link href="/inscription" className={styles.primaryCta}>
              Essayer le produit 30 jours gratuitement
            </Link>
            <Link href="/connexion" className={styles.secondaryCta}>
              J ai deja un compte
            </Link>
          </div>
          <p className={styles.reassurance}>
            Sans carte bancaire au demarrage. Puis 89 € par mois, sans engagement.
          </p>
        </div>

        <div className={styles.preview} aria-label="Apercu de LIVO-APP">
          <div className={styles.previewTop}>
            <span />
            <span />
            <span />
          </div>
          <div className={styles.previewHeader}>
            <div>
              <strong>Tableau de bord atelier</strong>
              <small>Aujourd'hui</small>
            </div>
            <span className={styles.liveBadge}>temps réel</span>
          </div>
          <div className={styles.previewStats}>
            <div><span>Fiches</span><strong>12</strong></div>
            <div><span>CA mois</span><strong>18 420 €</strong></div>
            <div><span>Compagnons</span><strong>6</strong></div>
          </div>
          <div className={styles.previewList}>
            <div><span>Renault Kangoo</span><strong>En cours</strong></div>
            <div><span>Peugeot 208</span><strong>Pointage actif</strong></div>
            <div><span>BMW Serie 3</span><strong>A cloturer</strong></div>
          </div>
        </div>
      </section>

      <section className={styles.problem}>
        <div>
          <span className={styles.sectionKicker}>Pourquoi LIVO</span>
          <h2>Le temps invisible coute cher à l'atelier.</h2>
        </div>
        <p>
          Quand les fiches papier, les pointages approximatifs et les suivis clients
          sont dispersés, il devient difficile de savoir ce qui est rentable, ce qui
          bloque et ce qui doit etre facture.
        </p>
      </section>

      <section id="fonctionnalites" className={styles.features}>
        <div className={styles.sectionIntro}>
          <span className={styles.sectionKicker}>Fonctionnalités</span>
          <h2>Tout ce qu'il faut pour piloter l'atelier.</h2>
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

      <section className={styles.workflow}>
        <div className={styles.sectionIntro}>
          <span className={styles.sectionKicker}>Mise en route</span>
          <h2>Simple à demarrer, simple à garder.</h2>
        </div>
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={step} className={styles.step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tarif" className={styles.pricing}>
        <div className={styles.priceCopy}>
          <span className={styles.sectionKicker}>Tarif</span>
          <h2>Une offre claire pour votre atelier.</h2>
          <p>
            Pas de module caché, pas de contrat long. Vous testez LIVO-APP pendant
            30 jours, puis vous continuez uniquement si l outil vous convient.
          </p>
        </div>
        <div className={styles.priceCard}>
          <span className={styles.trial}>30 jours gratuits</span>
          <div className={styles.price}>
            <strong>89 €</strong>
            <span>/ mois</span>
          </div>
          <p>Sans engagement. Support LYSMA inclus.</p>
          <ul>
            <li>Fiches de travaux illimitées</li>
            <li>Vehicules, clients et compagnons</li>
            <li>Pointage atelier et suivi RH</li>
            <li>Rapports et rentabilité</li>
          </ul>
          <Link href="/inscription" className={styles.primaryCta}>
            Demarrer l'essai gratuit
          </Link>
        </div>
      </section>

      <section className={styles.faq}>
        <h2>Questions rapides</h2>
        <div>
          <article>
            <h3>Est-ce installe sur un ordinateur ?</h3>
            <p>Non. LIVO-APP est accessible en ligne depuis navigateur, ordinateur pour le responsable atelier et sur tablette ou mobile pour l'atelier.</p>
          </article>
          <article>
            <h3>Pourquoi accepter les cookies ?</h3>
            <p>Les cookies de session sont necessaires pour creer un compte, rester connecte et sécuriser l'accés.</p>
          </article>
          <article>
            <h3>Puis-je arréter apres l'essai ?</h3>
            <p>Oui. L'essai dure 30 jours et l'abonnement est ensuite sans engagement.</p>
          </article>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>LIVO-APP par LYSMA Solutions</span>
        <div>
          <Link href="/cookies">Cookies</Link>
          <Link href="/politique-confidentialite">Confidentialite</Link>
          <Link href="/connexion">Connexion</Link>
        </div>
      </footer>
    </main>
  )
}
