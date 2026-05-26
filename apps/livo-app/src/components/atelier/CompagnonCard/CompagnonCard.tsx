'use client'

import { useState } from 'react'
import { ArrowRight, Coffee, ForkKnife, SignOut, Timer } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui'
import styles from './CompagnonCard.module.css'

type Statut = 'ABSENT' | 'EN_TRAVAIL' | 'PAUSE_CAFE' | 'PAUSE_DEJEUNER' | 'PARTI'

type Props = {
  compagnonId: string
  nom: string
  prenom: string
  poste: string
  statutInitial: Statut
  heureArrivee?: string | null
  fichesActives?: number
}

const BADGE: Record<Statut, { label: string; variant: 'muted'|'success'|'warning'|'blue'|'error'|'gold'|'cyan'|'default' }> = {
  ABSENT:         { label: 'Absent',          variant: 'muted' },
  EN_TRAVAIL:     { label: 'En travail',      variant: 'success' },
  PAUSE_CAFE:     { label: 'Pause café',      variant: 'warning' },
  PAUSE_DEJEUNER: { label: 'Pause déjeuner',  variant: 'warning' },
  PARTI:          { label: 'Parti',           variant: 'muted' },
}

export function CompagnonCard({ compagnonId, nom, prenom, poste, statutInitial, heureArrivee, fichesActives = 0 }: Props) {
  const [statut, setStatut] = useState<Statut>(statutInitial)
  const [loading, setLoading] = useState<string | null>(null)
  const [heure, setHeure] = useState(heureArrivee)
  const [confirmDepartOpen, setConfirmDepartOpen] = useState(false)
  const [error, setError] = useState('')

  async function action(act: string, options?: { confirmerFinJournee?: boolean }) {
    setLoading(act)
    setError('')
    try {
      const res = await fetch('/api/pointage-jour/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compagnonId, action: act, ...options }),
      })
      const data = await res.json()
      if (data.success) {
        setStatut(data.pointage.statutActuel as Statut)
        if (data.pointage.heureArrivee && !heure) {
          setHeure(new Date(data.pointage.heureArrivee).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))
        }
        return true
      }
      setError(data.error ?? 'Action impossible pour le moment.')
      return false
    } catch {
      setError('Connexion impossible. Réessayez dans un instant.')
      return false
    } finally {
      setLoading(null)
    }
  }

  async function confirmerFinJournee() {
    const success = await action('DEPART', { confirmerFinJournee: true })
    if (success) setConfirmDepartOpen(false)
  }

  const initials = `${prenom[0]}${nom[0]}`.toUpperCase()
  const badge = BADGE[statut]

  return (
    <div className={cn(styles.card, styles[statut.toLowerCase()])}>
      <div className={styles.header}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.info}>
          <span className={styles.name}>{prenom} {nom}</span>
          <span className={styles.poste}>{poste}</span>
        </div>
        <Badge variant={badge.variant} dot>{badge.label}</Badge>
      </div>

      {heure && (
        <div className={styles.meta}>
          <Timer size={12} />
          <span>Arrivée {heure}</span>
          {fichesActives > 0 && statut === 'EN_TRAVAIL' && (
            <span className={styles.fichesCount}>{fichesActives} fiche{fichesActives > 1 ? 's' : ''}</span>
          )}
        </div>
      )}

      <div className={styles.actions}>
        {statut === 'ABSENT' && (
          <button className={cn(styles.btn, styles.btnSuccess)} onClick={() => action('ARRIVEE')} disabled={!!loading}>
            {loading === 'ARRIVEE' ? <span className={styles.spinner} /> : <ArrowRight weight="bold" size={16} />}
            Arrivée atelier
          </button>
        )}

        {statut === 'EN_TRAVAIL' && (
          <>
            <button className={cn(styles.btn, styles.btnWarning)} onClick={() => action('PAUSE_CAFE_DEBUT')} disabled={!!loading}>
              {loading === 'PAUSE_CAFE_DEBUT' ? <span className={styles.spinner} /> : <Coffee weight="fill" size={16} />}
              Pause café
            </button>
            <button className={cn(styles.btn, styles.btnWarning)} onClick={() => action('PAUSE_DEJ_DEBUT')} disabled={!!loading}>
              {loading === 'PAUSE_DEJ_DEBUT' ? <span className={styles.spinner} /> : <ForkKnife weight="fill" size={16} />}
              Pause déjeuner
            </button>
            <button className={cn(styles.btn, styles.btnMuted)} onClick={() => setConfirmDepartOpen(true)} disabled={!!loading}>
              {loading === 'DEPART' ? <span className={styles.spinner} /> : <SignOut weight="bold" size={16} />}
              Fin de journée
            </button>
          </>
        )}

        {(statut === 'PAUSE_CAFE' || statut === 'PAUSE_DEJEUNER') && (
          <button
            className={cn(styles.btn, styles.btnPrimary)}
            onClick={() => action(statut === 'PAUSE_CAFE' ? 'PAUSE_CAFE_FIN' : 'PAUSE_DEJ_FIN')}
            disabled={!!loading}
          >
            {loading ? <span className={styles.spinner} /> : <ArrowRight weight="bold" size={16} />}
            Reprendre
          </button>
        )}

        {statut === 'PARTI' && (
          <p className={styles.partiMsg}>Journée terminée</p>
        )}
      </div>
      {error && <p className={styles.error}>{error}</p>}

      {confirmDepartOpen && (
        <div className={styles.confirmOverlay} onClick={e => e.target === e.currentTarget && setConfirmDepartOpen(false)}>
          <div className={styles.confirmModal} role="dialog" aria-modal="true" aria-labelledby={`confirm-fin-journee-${compagnonId}`}>
            <h2 id={`confirm-fin-journee-${compagnonId}`}>Confirmer la fin de journée ?</h2>
            <p>
              Cette action clôture votre journée de pointage. Vous ne pourrez plus revenir à l’état Arrivé atelier aujourd’hui.
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmCancel} onClick={() => setConfirmDepartOpen(false)} disabled={!!loading}>
                Annuler
              </button>
              <button className={styles.confirmDanger} onClick={confirmerFinJournee} disabled={!!loading}>
                {loading === 'DEPART' ? 'Clôture...' : 'Confirmer la fin de journée'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
