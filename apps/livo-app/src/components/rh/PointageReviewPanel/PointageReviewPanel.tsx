'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './PointageReviewPanel.module.css'

type ReviewStatus = 'BROUILLON' | 'A_VERIFIER' | 'VALIDE' | 'CONTESTE'

type Props = {
  compagnonId: string
  mois: number
  annee: number
  initialStatus: ReviewStatus
  validatedAt?: string | null
  validatedBy?: string | null
}

const STATUS_LABELS: Record<ReviewStatus, string> = {
  BROUILLON: 'Brouillon',
  A_VERIFIER: 'À vérifier',
  VALIDE: 'Validé',
  CONTESTE: 'Contesté',
}

export function PointageReviewPanel({
  compagnonId,
  mois,
  annee,
  initialStatus,
  validatedAt,
  validatedBy,
}: Props) {
  const router = useRouter()
  const [motif, setMotif] = useState('')
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')

  async function submit(action: 'VALIDER' | 'CONTESTER' | 'A_VERIFIER') {
    setError('')
    if (motif.trim().length < 8) {
      setError('Saisissez un motif clair avant de modifier le statut du relevé.')
      return
    }

    setLoading(action)
    try {
      const res = await fetch(`/api/pointage-releves/${compagnonId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mois, annee, action, motif }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(typeof data?.error === 'string' ? data.error : 'Action impossible.')
        return
      }
      setMotif('')
      router.refresh()
    } catch {
      setError('Connexion impossible. Réessayez dans un instant.')
    } finally {
      setLoading('')
    }
  }

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <span className={styles.kicker}>Validation mensuelle</span>
          <h2>Relevé de pointage</h2>
        </div>
        <span className={`${styles.status} ${styles[initialStatus.toLowerCase()]}`}>
          {STATUS_LABELS[initialStatus]}
        </span>
      </div>

      {validatedAt && (
        <p className={styles.meta}>
          Validé le {new Date(validatedAt).toLocaleDateString('fr-FR')} {validatedBy ? `par ${validatedBy}` : ''}
        </p>
      )}

      <label className={styles.label}>
        <span>Motif ou observation obligatoire</span>
        <textarea
          value={motif}
          onChange={(event) => setMotif(event.target.value)}
          placeholder="Exemple : relevé vérifié avec le responsable atelier."
          rows={3}
        />
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button type="button" onClick={() => submit('A_VERIFIER')} disabled={!!loading}>
          {loading === 'A_VERIFIER' ? 'Enregistrement...' : 'Marquer à vérifier'}
        </button>
        <button type="button" onClick={() => submit('CONTESTER')} disabled={!!loading} className={styles.secondary}>
          {loading === 'CONTESTER' ? 'Contestation...' : 'Contester'}
        </button>
        <button type="button" onClick={() => submit('VALIDER')} disabled={!!loading} className={styles.primary}>
          {loading === 'VALIDER' ? 'Validation...' : 'Valider le mois'}
        </button>
      </div>
    </section>
  )
}
