'use client'

import { useState } from 'react'
import { X } from '@phosphor-icons/react'
import { Button } from '@/components/ui'
import styles from './AbsenceForm.module.css'

type TypeAbsence =
  | 'CONGE_PAYE'
  | 'RTT'
  | 'ARRET_MALADIE'
  | 'FORMATION'
  | 'CONGE_SANS_SOLDE'
  | 'AUTRE'

type Compagnon = {
  id: string
  nom: string
  prenom: string
}

type Props = {
  compagnons: Compagnon[]
  onClose: () => void
  onCreated: (absence: {
    id: string
    type: string
    dateDebut: string
    dateFin: string
    nbJours: number
    approuve: boolean
    notes: string | null
    compagnon?: {
      user?: {
        nom?: string
        prenom?: string
      }
    }
  }) => void
}

const TYPE_LABELS: Record<TypeAbsence, string> = {
  CONGE_PAYE: 'Congé payé',
  RTT: 'RTT',
  ARRET_MALADIE: 'Arrêt maladie',
  FORMATION: 'Formation',
  CONGE_SANS_SOLDE: 'Congé sans solde',
  AUTRE: 'Autre',
}

const TYPE_COLORS: Record<TypeAbsence, string> = {
  CONGE_PAYE: 'var(--color-blue-electric)',
  RTT: 'var(--color-cyan)',
  ARRET_MALADIE: 'var(--color-error)',
  FORMATION: 'var(--color-gold)',
  CONGE_SANS_SOLDE: 'var(--color-orange)',
  AUTRE: 'var(--color-text-muted)',
}

function calcJoursOuvres(dateDebut: string, dateFin: string) {
  if (!dateDebut || !dateFin) return 0

  const current = new Date(dateDebut)
  const end = new Date(dateFin)

  if (Number.isNaN(current.getTime()) || Number.isNaN(end.getTime())) return 0
  if (end < current) return 0

  let count = 0

  while (current <= end) {
    const day = current.getDay()

    if (day !== 0 && day !== 6) {
      count++
    }

    current.setDate(current.getDate() + 1)
  }

  return count
}

function getErrorMessage(error: unknown) {
  if (typeof error === 'string') return error

  if (
    error &&
    typeof error === 'object' &&
    'fieldErrors' in error
  ) {
    return 'Certains champs sont invalides.'
  }

  return 'Erreur lors de la création.'
}

export function AbsenceForm({ compagnons, onClose, onCreated }: Props) {
  const [compagnonId, setCompagnonId] = useState(compagnons[0]?.id ?? '')
  const [type, setType] = useState<TypeAbsence>('CONGE_PAYE')
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const nbJoursPreview = calcJoursOuvres(dateDebut, dateFin)

  async function handleSubmit() {
    if (!compagnonId) {
      setError('Choisis un compagnon.')
      return
    }

    if (!dateDebut || !dateFin) {
      setError('Choisis une date de début et une date de fin.')
      return
    }

    if (new Date(dateFin) < new Date(dateDebut)) {
      setError('La date de fin doit être après la date de début.')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/absences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          compagnonId,
          type,
          dateDebut,
          dateFin,
          notes: notes.trim() || undefined,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok || !data?.success) {
        setError(getErrorMessage(data?.error))
        return
      }

      onCreated({
        id: data.absence.id,
        type: data.absence.type,
        dateDebut: data.absence.dateDebut,
        dateFin: data.absence.dateFin,
        nbJours: Number(data.absence.nbJours ?? 0),
        approuve: data.absence.approuve,
        notes: data.absence.notes ?? null,
        compagnon: {
          user: {
            nom: data.absence.compagnon?.user?.nom ?? data.absence.compagnon?.nom,
            prenom: data.absence.compagnon?.user?.prenom ?? data.absence.compagnon?.prenom,
          },
        },
      })
    } catch {
      setError('Impossible de contacter le serveur.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className={styles.overlay}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Nouvelle absence</h2>

          <button className={styles.closeBtn} onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <label className={styles.label}>Compagnon *</label>

            <select
              className={styles.select}
              value={compagnonId}
              onChange={(event) => setCompagnonId(event.target.value)}
              disabled={compagnons.length === 0}
            >
              {compagnons.map((compagnon) => (
                <option key={compagnon.id} value={compagnon.id}>
                  {compagnon.prenom} {compagnon.nom}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Type d&apos;absence *</label>

            <div className={styles.typeGrid}>
              {(Object.entries(TYPE_LABELS) as [TypeAbsence, string][]).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`${styles.typeBtn} ${type === value ? styles.typeBtnActive : ''}`}
                  style={{ '--type-color': TYPE_COLORS[value] } as React.CSSProperties}
                  onClick={() => setType(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.dateRow}>
            <div className={styles.field}>
              <label className={styles.label}>Date de début *</label>

              <input
                type="date"
                className={styles.input}
                value={dateDebut}
                onChange={(event) => {
                  setDateDebut(event.target.value)

                  if (!dateFin || new Date(dateFin) < new Date(event.target.value)) {
                    setDateFin(event.target.value)
                  }
                }}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Date de fin *</label>

              <input
                type="date"
                className={styles.input}
                value={dateFin}
                min={dateDebut}
                onChange={(event) => setDateFin(event.target.value)}
              />
            </div>
          </div>

          {nbJoursPreview > 0 && (
            <div className={styles.joursPreview}>
              <span className={styles.joursVal}>{nbJoursPreview}</span>

              <span className={styles.joursLabel}>
                jour{nbJoursPreview > 1 ? 's' : ''} ouvré{nbJoursPreview > 1 ? 's' : ''}
              </span>
            </div>
          )}

          {type === 'ARRET_MALADIE' && (
            <div className={styles.infoLegal}>
              ⚖️ Justificatif obligatoire sous 48h — transmission CPAM à effectuer séparément
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Notes</label>

            <textarea
              className={styles.textarea}
              placeholder="Informations complémentaires..."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={2}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.footer}>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>

          <Button
            variant="primary"
            disabled={!compagnonId || !dateDebut || !dateFin || submitting}
            loading={submitting}
            onClick={handleSubmit}
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  )
}
