import Link from 'next/link'
import styles from './TrialBanner.module.css'

type Props = { joursRestants: number }

export function TrialBanner({ joursRestants }: Props) {
  const urgent = joursRestants <= 3

  return (
    <div className={`${styles.banner} ${urgent ? styles.urgent : ''}`}>
      <span className={styles.text}>
        {urgent ? '⚠️' : '⏳'}{' '}
        <strong>{joursRestants} jour{joursRestants > 1 ? 's' : ''}</strong> restant{joursRestants > 1 ? 's' : ''} sur votre période d'essai
      </span>
      <Link href="mailto:contact@lysmasolutions.fr" className={styles.cta}>
        Activer mon abonnement →
      </Link>
    </div>
  )
}
