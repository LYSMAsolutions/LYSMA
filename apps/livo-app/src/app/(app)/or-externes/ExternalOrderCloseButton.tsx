'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

type TauxType = 'T1' | 'T2' | 'T3' | 'T4' | 'CARROSSERIE' | 'PEINTURE' | 'AUTRE'

type TauxGarage = {
  type: TauxType
  libelle: string
  montant: number
}

type Props = {
  orderId: string
  externalNumber: string
  realMinutes: number
  soldHours: number | null
  soldAmountHT: number | null
  taux: TauxGarage[]
}

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h} h ${String(m).padStart(2, '0')}`
}

export function ExternalOrderCloseButton({
  orderId,
  externalNumber,
  realMinutes,
  soldHours,
  soldAmountHT,
  taux,
}: Props) {
  const router = useRouter()
  const defaultHours = soldHours ?? Math.max(0, Math.round((realMinutes / 60) * 100) / 100)
  const [open, setOpen] = useState(false)
  const [hours, setHours] = useState(defaultHours ? String(defaultHours) : '')
  const [selectedTaux, setSelectedTaux] = useState<TauxType>(taux[0]?.type ?? 'T1')
  const [amount, setAmount] = useState(soldAmountHT ? String(soldAmountHT) : '')
  const [manualAmount, setManualAmount] = useState(Boolean(soldAmountHT))
  const [motif, setMotif] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const tauxSelectionne = useMemo(
    () => taux.find((item) => item.type === selectedTaux) ?? taux[0] ?? null,
    [selectedTaux, taux]
  )
  const hoursNumber = Number(hours.replace(',', '.')) || 0
  const calculatedAmount = tauxSelectionne ? hoursNumber * tauxSelectionne.montant : 0

  useEffect(() => {
    if (!manualAmount) setAmount(calculatedAmount ? calculatedAmount.toFixed(2) : '')
  }, [calculatedAmount, manualAmount])

  async function submit() {
    if (!tauxSelectionne) {
      setError('Aucun taux actif configure pour ce garage.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/or-externes/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CLOTURER',
          tauxType: tauxSelectionne.type,
          soldHours: hoursNumber,
          soldAmountHT: Number(amount.replace(',', '.')) || null,
          motif: motif.trim() || undefined,
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(typeof data?.error === 'string' ? data.error : 'Cloture impossible.')
        return
      }
      setOpen(false)
      router.refresh()
    } catch {
      setError('Connexion impossible. Reessayez dans un instant.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button type="button" className={styles.closeOrderButton} onClick={() => setOpen(true)}>
        Cloturer
      </button>

      {open && (
        <div className={styles.closeOverlay} onClick={(event) => event.target === event.currentTarget && setOpen(false)}>
          <div className={styles.closeModal} role="dialog" aria-modal="true" aria-labelledby="close-or-title">
            <div className={styles.closeHeader}>
              <div>
                <h2 id="close-or-title">Cloturer l OR</h2>
                <p>{externalNumber}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)}>Fermer</button>
            </div>

            <div className={styles.closeRecap}>
              <span>Temps reel pointe</span>
              <strong>{formatMinutes(realMinutes)}</strong>
            </div>

            <label className={styles.closeField}>
              <span>Temps vendu / facture</span>
              <input
                type="number"
                min="0"
                step="0.25"
                value={hours}
                onChange={(event) => setHours(event.target.value)}
              />
            </label>

            <div className={styles.closeField}>
              <span>Taux applicable</span>
              <div className={styles.closeRateGrid}>
                {taux.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    className={item.type === selectedTaux ? styles.closeRateActive : ''}
                    onClick={() => setSelectedTaux(item.type)}
                  >
                    <strong>{item.type}</strong>
                    <small>{item.montant} EUR/h</small>
                    <em>{item.libelle}</em>
                  </button>
                ))}
              </div>
            </div>

            <label className={styles.closeField}>
              <span>Montant HT</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => {
                  setManualAmount(true)
                  setAmount(event.target.value)
                }}
              />
            </label>

            {manualAmount && (
              <button type="button" className={styles.recalcButton} onClick={() => setManualAmount(false)}>
                Recalculer automatiquement
              </button>
            )}

            <label className={styles.closeField}>
              <span>Note de cloture</span>
              <textarea rows={3} value={motif} onChange={(event) => setMotif(event.target.value)} />
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.closeActions}>
              <button type="button" className={styles.cancelCloseButton} onClick={() => setOpen(false)}>
                Annuler
              </button>
              <button type="button" className={styles.confirmCloseButton} onClick={submit} disabled={loading || !tauxSelectionne}>
                {loading ? 'Cloture...' : 'Cloturer l OR'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
