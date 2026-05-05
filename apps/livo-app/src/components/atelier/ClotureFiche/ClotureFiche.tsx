'use client'

import { useState, useEffect } from 'react'
import { X, Clock, CurrencyEur } from '@phosphor-icons/react'
import { Button } from '@/components/ui'
import styles from './ClotureFiche.module.css'

type TauxType = 'T1' | 'T2' | 'T3' | 'T4' | 'CARROSSERIE' | 'PEINTURE' | 'AUTRE'

type TauxGarage = {
  type: TauxType
  libelle: string
  montant: number
}

type Props = {
  ficheId: string
  numero: string
  vehicule: string
  tempsReel: number | null
  taux: TauxGarage[]
  onClose: () => void
  onCloturee: () => void
}

export function ClotureFiche({ ficheId, numero, vehicule, tempsReel, taux, onClose, onCloturee }: Props) {
  const [tempsFacture, setTempsFacture] = useState(tempsReel ? tempsReel.toFixed(2) : '')
  const [tauxSelectionne, setTauxSelectionne] = useState<TauxType>(taux[0]?.type ?? 'T1')
  const [tauxAutreMontant, setTauxAutreMontant] = useState('')
  const [montantHT, setMontantHT] = useState('')
  const [montantManuel, setMontantManuel] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const tauxVal = tauxSelectionne === 'AUTRE'
    ? (parseFloat(tauxAutreMontant) || 0)
    : (taux.find(t => t.type === tauxSelectionne)?.montant ?? 65)

  const tFactureNum = parseFloat(tempsFacture) || 0
  const montantCalcule = (tFactureNum * tauxVal).toFixed(2)

  useEffect(() => {
    if (!montantManuel) setMontantHT(montantCalcule)
  }, [montantCalcule, montantManuel])

  const deltaMinutes = tempsReel != null
    ? Math.round((tFactureNum - tempsReel) * 60)
    : null

  async function handleSubmit() {
    if (!tempsFacture || tFactureNum <= 0) return
    if (tauxSelectionne === 'AUTRE' && !tauxAutreMontant) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/fiches/${ficheId}/cloturer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempsFacture: tFactureNum,
          tauxApplique: tauxSelectionne,
          montantHT: parseFloat(montantHT) || undefined,
        }),
      })
      if (res.ok) onCloturee()
    } finally {
      setSubmitting(false)
    }
  }

  const peutCloturer = tempsFacture && tFactureNum > 0 && (tauxSelectionne !== 'AUTRE' || !!tauxAutreMontant)

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Clôturer la fiche</h2>
            <p className={styles.sub}>{numero} · {vehicule}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <div className={styles.body}>

          {/* Temps réel recap */}
          {tempsReel != null && (
            <div className={styles.recapTemps}>
              <Clock size={14} />
              <span>Temps réel passé : <strong>{Math.floor(tempsReel)}h{Math.round((tempsReel % 1) * 60).toString().padStart(2, '0')}</strong></span>
            </div>
          )}

          {/* Temps facturé */}
          <div className={styles.field}>
            <label className={styles.label}>Temps facturé (heures) *</label>
            <input
              type="number"
              className={styles.input}
              placeholder="Ex: 2.5"
              value={tempsFacture}
              onChange={e => setTempsFacture(e.target.value)}
              step="0.25"
              min="0"
              autoFocus
            />
            <p className={styles.hint}>Temps constructeur ou temps réel selon votre choix</p>
          </div>

          {/* Taux */}
          <div className={styles.field}>
            <label className={styles.label}>Taux applicable *</label>
            <div className={styles.tauxGrid}>
              {taux.map(t => (
                <button
                  key={t.type}
                  className={`${styles.tauxBtn} ${tauxSelectionne === t.type ? styles.tauxBtnActive : ''}`}
                  onClick={() => setTauxSelectionne(t.type)}
                  type="button"
                >
                  <span className={styles.tauxType}>{t.type}</span>
                  {t.type !== 'AUTRE'
                    ? <span className={styles.tauxMontant}>{t.montant}€/h</span>
                    : <span className={styles.tauxMontant}>Libre</span>
                  }
                  <span className={styles.tauxLibelle}>{t.libelle.split(' — ')[1] ?? t.libelle}</span>
                </button>
              ))}
            </div>

            {/* Taux AUTRE — saisie libre */}
            {tauxSelectionne === 'AUTRE' && (
              <div className={styles.autreWrapper}>
                <label className={styles.label}>Taux horaire personnalisé (€/h) *</label>
                <input
                  type="number"
                  className={styles.input}
                  placeholder="Ex: 70"
                  value={tauxAutreMontant}
                  onChange={e => setTauxAutreMontant(e.target.value)}
                  step="1"
                  min="0"
                />
              </div>
            )}
          </div>

          {/* Montant HT */}
          <div className={styles.field}>
            <label className={styles.label}>
              Montant HT
              {!montantManuel && <span className={styles.auto}>calculé auto</span>}
            </label>
            <div className={styles.montantWrapper}>
              <CurrencyEur size={16} className={styles.montantIcon} />
              <input
                type="number"
                className={styles.input}
                value={montantHT}
                onChange={e => { setMontantManuel(true); setMontantHT(e.target.value) }}
                step="0.01"
                min="0"
              />
            </div>
            {montantManuel && (
              <button className={styles.resetBtn} onClick={() => setMontantManuel(false)}>
                Recalculer automatiquement
              </button>
            )}
          </div>

          {/* Résumé rentabilité */}
          {deltaMinutes !== null && tFactureNum > 0 && tauxVal > 0 && (
            <div className={`${styles.rentaRecap} ${deltaMinutes >= 0 ? styles.gain : styles.perte}`}>
              <span className={styles.rentaLabel}>
                {deltaMinutes >= 0 ? '✓ Gain estimé' : '⚠ Perte estimée'}
              </span>
              <span className={styles.rentaVal}>
                {deltaMinutes >= 0 ? '+' : ''}
                {((tFactureNum - (tempsReel ?? 0)) * tauxVal).toFixed(0)} €
              </span>
              <span className={styles.rentaSub}>
                {Math.abs(deltaMinutes)}min {deltaMinutes >= 0 ? 'gagnées' : 'perdues'}
              </span>
            </div>
          )}

        </div>

        <div className={styles.footer}>
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button
            variant="primary"
            disabled={!peutCloturer}
            loading={submitting}
            onClick={handleSubmit}
          >
            Clôturer la fiche
          </Button>
        </div>

      </div>
    </div>
  )
}
