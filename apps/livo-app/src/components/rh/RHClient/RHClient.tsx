'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Badge } from '@/components/ui'
import { Plus, Check, X } from '@phosphor-icons/react'
import { AbsenceForm } from '@/components/rh/AbsenceForm/AbsenceForm'
import styles from './RHClient.module.css'

type Compagnon = {
  id: string
  nom: string
  prenom: string
}

type Absence = {
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
}

type Props = {
  compagnons: Compagnon[]
  absences: Absence[]
}

const TYPE_LABELS: Record<string, string> = {
  CONGE_PAYE: 'Congé payé',
  RTT: 'RTT',
  ARRET_MALADIE: 'Arrêt maladie',
  FORMATION: 'Formation',
  CONGE_SANS_SOLDE: 'Congé sans solde',
  AUTRE: 'Autre',
}

const TYPE_VARIANT: Record<string, 'blue' | 'cyan' | 'error' | 'gold' | 'warning' | 'muted'> = {
  CONGE_PAYE: 'blue',
  RTT: 'cyan',
  ARRET_MALADIE: 'error',
  FORMATION: 'gold',
  CONGE_SANS_SOLDE: 'warning',
  AUTRE: 'muted',
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getCompagnonName(absence: Absence) {
  const prenom = absence.compagnon?.user?.prenom ?? ''
  const nom = absence.compagnon?.user?.nom ?? ''
  const fullName = `${prenom} ${nom}`.trim()

  return fullName || 'Compagnon inconnu'
}

export function RHClient({ compagnons, absences: absencesInit }: Props) {
  const router = useRouter()
  const [modal, setModal] = useState(false)
  const [absences, setAbsences] = useState(absencesInit ?? [])

  async function toggleApproval(id: string, approuve: boolean) {
    const res = await fetch('/api/absences', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approuve }),
    })

    if (res.ok) {
      setAbsences((current) =>
        current.map((absence) =>
          absence.id === id ? { ...absence, approuve } : absence
        )
      )
      router.refresh()
    }
  }

  async function deleteAbsence(id: string) {
    const res = await fetch('/api/absences', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (res.ok) {
      setAbsences((current) => current.filter((absence) => absence.id !== id))
      router.refresh()
    }
  }

  const enAttente = absences.filter((absence) => !absence.approuve)
  const approuvees = absences.filter((absence) => absence.approuve)

  return (
    <>
      <div className={styles.actionBar}>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus />}
          onClick={() => setModal(true)}
          disabled={compagnons.length === 0}
        >
          Saisir une absence
        </Button>
      </div>

      {compagnons.length === 0 && (
        <div className={styles.empty}>
          <p>Aucun compagnon actif. Ajoute d’abord un compagnon.</p>
        </div>
      )}

      {enAttente.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            En attente de validation
            <span className={styles.count}>{enAttente.length}</span>
          </h2>

          <div className={styles.list}>
            {enAttente.map((absence) => (
              <div key={absence.id} className={`${styles.item} ${styles.itemPending}`}>
                <div className={styles.itemLeft}>
                  <div className={styles.itemTop}>
                    <span className={styles.itemNom}>{getCompagnonName(absence)}</span>

                    <Badge variant={TYPE_VARIANT[absence.type] ?? 'muted'}>
                      {TYPE_LABELS[absence.type] ?? absence.type}
                    </Badge>
                  </div>

                  <div className={styles.itemDates}>
                    {formatDate(absence.dateDebut)} → {formatDate(absence.dateFin)}
                    <span className={styles.itemJours}>{Number(absence.nbJours)}j ouvrés</span>
                  </div>

                  {absence.notes && <p className={styles.itemNotes}>{absence.notes}</p>}
                </div>

                <div className={styles.itemActions}>
                  <button
                    className={styles.btnApprove}
                    onClick={() => toggleApproval(absence.id, true)}
                    title="Approuver"
                    type="button"
                  >
                    <Check weight="bold" size={14} />
                  </button>

                  <button
                    className={styles.btnRefuse}
                    onClick={() => deleteAbsence(absence.id)}
                    title="Refuser"
                    type="button"
                  >
                    <X weight="bold" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Absences validées
          <span className={styles.count}>{approuvees.length}</span>
        </h2>

        {approuvees.length === 0 ? (
          <div className={styles.empty}>
            <p>Aucune absence validée</p>
          </div>
        ) : (
          <div className={styles.list}>
            {approuvees.map((absence) => (
              <div key={absence.id} className={styles.item}>
                <div className={styles.itemLeft}>
                  <div className={styles.itemTop}>
                    <span className={styles.itemNom}>{getCompagnonName(absence)}</span>

                    <Badge variant={TYPE_VARIANT[absence.type] ?? 'muted'}>
                      {TYPE_LABELS[absence.type] ?? absence.type}
                    </Badge>

                    <Badge variant="success" dot>
                      Validée
                    </Badge>
                  </div>

                  <div className={styles.itemDates}>
                    {formatDate(absence.dateDebut)} → {formatDate(absence.dateFin)}
                    <span className={styles.itemJours}>{Number(absence.nbJours)}j ouvrés</span>
                  </div>

                  {absence.notes && <p className={styles.itemNotes}>{absence.notes}</p>}
                </div>

                <button
                  className={styles.btnRefuse}
                  onClick={() => deleteAbsence(absence.id)}
                  title="Supprimer"
                  type="button"
                >
                  <X weight="bold" size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {modal && (
        <AbsenceForm
          compagnons={compagnons}
          onClose={() => setModal(false)}
          onCreated={(absence) => {
            setAbsences((current) => [absence, ...current])
            setModal(false)
            router.refresh()
          }}
        />
      )}
    </>
  )
}
