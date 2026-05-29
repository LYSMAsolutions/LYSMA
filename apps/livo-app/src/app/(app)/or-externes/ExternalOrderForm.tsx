'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export function ExternalOrderForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(formData: FormData) {
    setLoading(true)
    setError('')

    const payload = {
      externalNumber: String(formData.get('externalNumber') ?? ''),
      sourceSoftware: String(formData.get('sourceSoftware') ?? ''),
      clientName: String(formData.get('clientName') ?? ''),
      vehicleLabel: String(formData.get('vehicleLabel') ?? ''),
      immatriculation: String(formData.get('immatriculation') ?? ''),
      vin: String(formData.get('vin') ?? ''),
      operation: String(formData.get('operation') ?? ''),
      soldHours: formData.get('soldHours') ? Number(formData.get('soldHours')) : null,
      soldAmountHT: formData.get('soldAmountHT') ? Number(formData.get('soldAmountHT')) : null,
    }

    try {
      const res = await fetch('/api/or-externes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(typeof data?.error === 'string' ? data.error : 'Impossible de créer cette fiche miroir.')
        return
      }
      router.refresh()
    } catch {
      setError('Connexion impossible. Réessayez dans un instant.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={submit} className={styles.form}>
      <div className={styles.formGridCompact}>
        <label>
          <span>Numéro OR externe *</span>
          <input name="externalNumber" required placeholder="OR-2026-1487" />
        </label>
        <label>
          <span>Logiciel source</span>
          <input name="sourceSoftware" placeholder="Logiciel métier du garage" />
        </label>
        <label>
          <span>Temps vendu</span>
          <input name="soldHours" type="number" min="0" step="0.25" placeholder="2.50" />
        </label>
        <label>
          <span>Montant vendu HT</span>
          <input name="soldAmountHT" type="number" min="0" step="0.01" placeholder="180.00" />
        </label>
      </div>

      <details className={styles.optionalDetails}>
        <summary>Informations facultatives si elles sont disponibles</summary>
        <div className={styles.formGrid}>
          <label>
            <span>Client</span>
            <input name="clientName" placeholder="Nom du client" />
          </label>
          <label>
            <span>Véhicule</span>
            <input name="vehicleLabel" placeholder="Renault Clio IV" />
          </label>
          <label>
            <span>Immatriculation</span>
            <input name="immatriculation" placeholder="AA-123-BB" />
          </label>
          <label>
            <span>VIN</span>
            <input name="vin" placeholder="VF1..." />
          </label>
        </div>
        <label>
          <span>Opération / description</span>
          <textarea name="operation" rows={3} placeholder="Information récupérée depuis le logiciel métier, si disponible." />
        </label>
      </details>

      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" disabled={loading} className={styles.submit}>
        {loading ? 'Création...' : 'Créer la fiche miroir'}
      </button>
    </form>
  )
}
