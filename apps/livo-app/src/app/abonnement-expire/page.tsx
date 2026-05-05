import styles from './page.module.css'

export const metadata = { title: 'Abonnement expiré — LIVO-APP' }

export default function AbonnementExpirePage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>⏰</div>
        <h1 className={styles.title}>Période d'essai terminée</h1>
        <p className={styles.desc}>
          Votre période d'essai gratuite de 30 jours est expirée.<br />
          Contactez-nous pour activer votre abonnement et continuer à utiliser LIVO-APP.
        </p>
        <div className={styles.contact}>
          <a href="mailto:contact@lysmasolutions.fr" className={styles.btn}>
            Contacter LYSMA Solutions
          </a>
          <p className={styles.hint}>contact@lysmasolutions.fr</p>
        </div>
        <div className={styles.tarifs}>
          <div className={styles.tarif}>
            <span className={styles.tarifNom}>Starter</span>
            <span className={styles.tarifPrix}>49€<span>/mois</span></span>
            <span className={styles.tarifDesc}>1 garage · 5 compagnons</span>
          </div>
          <div className={`${styles.tarif} ${styles.tarifPopulaire}`}>
            <span className={styles.tarifBadge}>Populaire</span>
            <span className={styles.tarifNom}>Pro</span>
            <span className={styles.tarifPrix}>99€<span>/mois</span></span>
            <span className={styles.tarifDesc}>1 garage · compagnons illimités</span>
          </div>
          <div className={styles.tarif}>
            <span className={styles.tarifNom}>Entreprise</span>
            <span className={styles.tarifPrix}>199€<span>/mois</span></span>
            <span className={styles.tarifDesc}>Multi-garages · tout inclus</span>
          </div>
        </div>
        <a href="/connexion" className={styles.link}>← Retour à la connexion</a>
      </div>
    </div>
  )
}
