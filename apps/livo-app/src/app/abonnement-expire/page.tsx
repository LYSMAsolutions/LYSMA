import { LIVO_PRICING } from '@/lib/pricing'
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
            <span className={styles.tarifNom}>Essai</span>
            <span className={styles.tarifPrix}>0€<span>/{LIVO_PRICING.trialDays} jours</span></span>
            <span className={styles.tarifDesc}>Découverte complète de LIVO</span>
          </div>
          <div className={`${styles.tarif} ${styles.tarifPopulaire}`}>
            <span className={styles.tarifBadge}>Offre active</span>
            <span className={styles.tarifNom}>{LIVO_PRICING.primaryPlan.name}</span>
            <span className={styles.tarifPrix}>{LIVO_PRICING.primaryPlan.priceMonthly}€<span>/mois</span></span>
            <span className={styles.tarifDesc}>{LIVO_PRICING.primaryPlan.included}</span>
          </div>
          <div className={styles.tarif}>
            <span className={styles.tarifNom}>Multi-garages</span>
            <span className={styles.tarifPrix}>{LIVO_PRICING.enterpriseLabel}</span>
            <span className={styles.tarifDesc}>Accompagnement adapté au réseau</span>
          </div>
        </div>
        <a href="/connexion" className={styles.link}>← Retour à la connexion</a>
      </div>
    </div>
  )
}
