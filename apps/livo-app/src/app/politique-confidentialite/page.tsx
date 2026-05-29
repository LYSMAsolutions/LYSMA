import type { Metadata } from 'next'
import { canonical } from '@/lib/seo'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Politique de confidentialité — LIVO',
  description: 'Politique de confidentialité de LIVO : données collectées, finalités, cookies, conservation et droits RGPD.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: canonical('/politique-confidentialite'),
  },
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.h1}>Politique de confidentialité</h1>
        <p className={styles.updated}>Dernière mise à jour : mai 2026</p>

        <section className={styles.section}>
          <h2 className={styles.h2}>1. Responsable du traitement</h2>
          <p>LYSMA Solutions — contact : lysmasolutions@gmail.com</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>2. Données collectées</h2>
          <p>Dans le cadre de l’utilisation de LIVO, nous collectons :</p>
          <ul className={styles.list}>
            <li>Informations du compte : nom, prénom, adresse email, mot de passe hashé.</li>
            <li>Informations du garage : nom, adresse, SIRET, téléphone.</li>
            <li>Données RH : noms des compagnons, horaires de pointage, pauses, absences.</li>
            <li>Données véhicules et clients : immatriculation, nom client, interventions.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>3. Finalité du traitement</h2>
          <p>Les données sont utilisées exclusivement pour :</p>
          <ul className={styles.list}>
            <li>Le fonctionnement de l’application de gestion d’atelier.</li>
            <li>La génération des fiches de travaux et documents RH.</li>
            <li>Le suivi du temps de travail et la preuve des heures travaillées.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>4. Cookies utilisés</h2>
          <p className={styles.text}>LIVO utilise uniquement des cookies strictement nécessaires :</p>
          <ul className={styles.list}>
            <li className={styles.text}><code className={styles.code}>next-auth.session-token</code> — session d’authentification administrateur.</li>
            <li className={styles.text}><code className={styles.code}>atelier-garage-id</code> — accès espace atelier.</li>
            <li className={styles.text}><code className={styles.code}>atelier-compagnon-id</code> — session compagnon atelier.</li>
            <li className={styles.text}><code className={styles.code}>livo_trusted_device</code> — appareil reconnu après double authentification.</li>
          </ul>
          <p className={styles.text}>Ces cookies ne sont pas utilisés à des fins publicitaires ou analytiques.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>5. Conservation des données</h2>
          <p>
            Les données sont conservées pendant la durée de l’abonnement actif, puis selon les obligations
            légales, sociales et comptables applicables à l’entreprise. Les relevés de pointage peuvent être
            conservés plus longtemps lorsqu’ils servent à la preuve du temps de travail.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>6. Hébergement</h2>
          <p>Les données sont hébergées sur Supabase et Vercel, dans des datacenters situés en Europe lorsque les services le permettent.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>7. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className={styles.list}>
            <li>Droit d’accès à vos données.</li>
            <li>Droit de rectification.</li>
            <li>Droit à l’effacement.</li>
            <li>Droit à la portabilité.</li>
            <li>Droit d’opposition.</li>
          </ul>
          <p>Pour exercer ces droits : <a href="mailto:lysmasolutions@gmail.com" className={styles.link}>lysmasolutions@gmail.com</a></p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>8. Contact</h2>
          <p>Pour toute question relative à la protection de vos données : <a href="mailto:lysmasolutions@gmail.com" className={styles.link}>lysmasolutions@gmail.com</a></p>
        </section>
      </div>
    </div>
  )
}
