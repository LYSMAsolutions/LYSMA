import type { Metadata } from 'next'
import { canonical } from '@/lib/seo'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Politique de confidentialité - LIVO',
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
        <p className={styles.updated}>Dernière mise à jour : juin 2026</p>

        <section className={styles.section}>
          <h2 className={styles.h2}>1. Responsable du traitement</h2>
          <p>LYSMA Solutions — contact : contact@lysmasolutions.fr</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>2. Données collectées</h2>
          <p>Dans le cadre de l'utilisation de LIVO, nous collectons uniquement les données utiles au service :</p>
          <ul className={styles.list}>
            <li>Informations du compte : nom, prénom, adresse email, mot de passe hashé, statut de sécurité.</li>
            <li>Informations du garage : nom, adresse, SIRET, téléphone, email, état d'abonnement.</li>
            <li>Données atelier et RH : compagnons, horaires de pointage, pauses, absences, fiches de travail.</li>
            <li>Données véhicules et clients : immatriculation, véhicule, client, interventions à effectuer.</li>
            <li>Identifiants techniques nécessaires au support : userId, garageId, compagnonId, ficheId, OR externe et IDs de pointage.</li>
            <li>Chatbox : question posée, réponse affichée, identifiant anonyme de visiteur, identifiant de session, identifiant de conversation, utilisateur et garage lorsque la personne est connectée.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>3. Finalités du traitement</h2>
          <p>Les données sont utilisées pour :</p>
          <ul className={styles.list}>
            <li>Faire fonctionner l'application de gestion d'atelier.</li>
            <li>Générer les fiches de travaux, documents RH et relevés de pointage.</li>
            <li>Suivre le temps de travail et conserver un historique des pointages enregistrés.</li>
            <li>Assurer le support, retrouver une information perdue et corriger les erreurs.</li>
            <li>Améliorer l'expérience LIVO et préparer des connexions avec d'autres outils demandées par les garages.</li>
          </ul>
          <p className={styles.text}>Les données ne sont pas vendues et ne sont pas utilisées à des fins publicitaires.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>4. Cookies utilisés</h2>
          <p className={styles.text}>LIVO utilise des cookies nécessaires au fonctionnement et à la sécurité :</p>
          <ul className={styles.list}>
            <li className={styles.text}><code className={styles.code}>livo-app.session-token</code> - session d'authentification.</li>
            <li className={styles.text}><code className={styles.code}>livo_cookie_consent</code> - mémorisation du choix cookies.</li>
            <li className={styles.text}><code className={styles.code}>atelier-garage-id</code> - accès espace atelier.</li>
            <li className={styles.text}><code className={styles.code}>atelier-compagnon-id</code> - session compagnon atelier.</li>
            <li className={styles.text}><code className={styles.code}>livo_trusted_device</code> - appareil reconnu après double authentification.</li>
            <li className={styles.text}><code className={styles.code}>livo_connected_data_notice_v3</code> - mémorisation de l'information V3 dans l'espace connecté.</li>
          </ul>
          <p className={styles.text}>Ces cookies ne sont pas utilisés à des fins publicitaires ou analytiques.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>5. Chatbox V3</h2>
          <p className={styles.text}>
            Les échanges avec la chatbox peuvent être enregistrés afin d'améliorer la qualité des réponses. Un identifiant anonyme peut être utilisé pour vous signaler, lors d'une prochaine visite, qu'une réponse à votre question a été améliorée. Cet identifiant ne permet pas de vous identifier personnellement et n'est pas utilisé à des fins publicitaires.
          </p>
          <p className={styles.text}>
            Cet identifiant est propre à LIVO et ne sert pas à suivre une personne entre plusieurs clients ou sites. Il peut être supprimé depuis la chatbox avec l'action "Ne pas conserver ma conversation".
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>6. Conservation des données</h2>
          <p>
            Les données du compte, du garage et de l'atelier sont conservées pendant la durée de l'abonnement actif,
            puis selon les obligations légales, sociales et comptables applicables. Les relevés de pointage peuvent
            être conservés plus longtemps lorsqu'ils servent à documenter le temps de travail.
          </p>
          <p className={styles.text}>
            Les échanges chatbox et données support sont conservés le temps nécessaire au support, à la correction
            des erreurs et à l'amélioration du service.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>7. Hébergement</h2>
          <p>Les données sont hébergées sur Supabase et Vercel, dans des datacenters situés en Europe lorsque les services le permettent.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>8. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className={styles.list}>
            <li>Droit d'accès à vos données.</li>
            <li>Droit de rectification.</li>
            <li>Droit à l'effacement.</li>
            <li>Droit à la portabilité.</li>
            <li>Droit d'opposition lorsque le droit applicable le permet.</li>
          </ul>
          <p>Pour exercer ces droits : <a href="mailto:contact@lysmasolutions.fr" className={styles.link}>contact@lysmasolutions.fr</a></p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>9. Contact</h2>
          <p>Pour toute question relative à la protection de vos données : <a href="mailto:contact@lysmasolutions.fr" className={styles.link}>contact@lysmasolutions.fr</a></p>
        </section>
      </div>
    </div>
  )
}
