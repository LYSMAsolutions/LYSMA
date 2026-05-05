'use client'

import { useState } from 'react'
import { Door, LockKey, PauseCircle } from '@phosphor-icons/react'
import styles from './GarageStatus.module.css'
import { cn } from '@/lib/utils'

type StatutGarage = 'OUVERT' | 'FERME' | 'PAUSE'

type Props = {
  garageId: string
  garageName: string
  statutInitial: StatutGarage
}

const STATUT_CONFIG = {
  OUVERT: {
    label: 'Ouvert',
    icon: Door,
    color: 'success',
    next: 'FERME' as StatutGarage,
    action: "Fermer l'atelier",
  },
  FERME: {
    label: 'Fermé',
    icon: LockKey,
    color: 'error',
    next: 'OUVERT' as StatutGarage,
    action: "Ouvrir l'atelier",
  },
  PAUSE: {
    label: 'En pause',
    icon: PauseCircle,
    color: 'warning',
    next: 'OUVERT' as StatutGarage,
    action: 'Reprendre',
  },
}

export function GarageStatus({ garageId, garageName, statutInitial }: Props) {
  const [statut, setStatut] = useState<StatutGarage>(statutInitial)
  const [loading, setLoading] = useState(false)

  const config = STATUT_CONFIG[statut]
  const Icon = config.icon

  async function toggleStatut() {
    setLoading(true)
    try {
      const res = await fetch('/api/garage/statut', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ garageId, statut: config.next }),
      })
      if (res.ok) setStatut(config.next)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={cn(styles.statusBadge, styles[config.color])}>
        <Icon weight="fill" size={16} />
        <span>{config.label}</span>
        <span className={cn(styles.dot, styles[config.color])} />
      </div>

      <div className={styles.info}>
        <h2 className={styles.garageName}>{garageName}</h2>
        <p className={styles.sub}>Atelier du jour</p>
      </div>

      <button
        className={cn(
          styles.toggleBtn,
          statut === 'OUVERT' ? styles.closeBtn : styles.openBtn,
          loading && styles.loading
        )}
        onClick={toggleStatut}
        disabled={loading}
      >
        <Icon weight="fill" size={20} />
        {loading ? 'En cours...' : config.action}
      </button>
    </div>
  )
}
