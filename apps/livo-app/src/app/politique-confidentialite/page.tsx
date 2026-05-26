import styles from './page.module.css'

export const metadata = {
  title: 'Politique de confidentialité — LIVO-APP',
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
          <p>Dans le cadre de l’utilisation de LIVO-APP, nous collectons :</p>
          <ul className={styles.list}>
            <li>Informations du compte : nom, prénom, adresse email, mot de passe hashé</li>
            <li>Informations du garage : nom, adresse, SIRET, téléphone</li>
            <li>Données RH : noms des compagnons, horaires de pointage, absences</li>
            <li>Données véhicules et clients : immatriculation, nom client, interventions</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>3. Finalité du traitement</h2>
          <p>Les données sont utilisées exclusivement pour :</p>
          <ul className={styles.list}>
            <li>Le fonctionnement de l’application de gestion d’atelier</li>
            <li>La génération des fiches de travaux et documents RH</li>
            <li>Le suivi légal du temps de travail, conformément à la directive CJUE 2019</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>4. Cookies utilisés</h2>
          <p className={styles.text}>LIVO-APP utilise uniquement des cookies <strong>strictement nécessaires</strong> :</p>
          <ul className={styles.list}>
            <li className={styles.text}><code className={styles.code}>next-auth.session-token</code> — session d’authentification administrateur, durée 30 jours</li>
            <li className={styles.text}><code className={styles.code}>atelier-garage-id</code> — accès espace atelier, durée 12 heures</li>
            <li className={styles.text}><code className={styles.code}>atelier-compagnon-id</code> — session compagnon atelier, durée 12 heures</li>
          </ul>
          <p className={styles.text}>Ces cookies ne sont pas utilisés à des fins publicitaires ou analytiques.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>5. Conservation des données</h2>
          <p>Les données sont conservées pendant la durée de l’abonnement actif, puis jusqu’à 3 ans après résiliation, conformément aux obligations légales et comptables applicables.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>6. Hébergement</h2>
          <p>Les données sont hébergées sur Supabase et Vercel, dans des datacenters situés en Europe lorsque les services le permettent.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>7. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className={styles.list}>
            <li>Droit d’accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l’effacement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d’opposition</li>
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
