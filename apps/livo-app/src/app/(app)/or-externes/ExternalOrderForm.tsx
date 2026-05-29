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
        setError(typeof data?.error === 'string' ? data.error : 'Impossible de créer cet OR externe.')
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
      <div className={styles.formGrid}>
        <label>
          <span>Numéro OR externe *</span>
          <input name="externalNumber" required placeholder="OR-2026-1487" />
        </label>
        <label>
          <span>Logiciel source</span>
          <input name="sourceSoftware" placeholder="Logiciel métier du garage" />
        </label>
        <label>
          <span>Client *</span>
          <input name="clientName" required placeholder="Nom du client" />
        </label>
        <label>
          <span>Véhicule *</span>
          <input name="vehicleLabel" required placeholder="Renault Clio IV" />
        </label>
        <label>
          <span>Immatriculation</span>
          <input name="immatriculation" placeholder="AA-123-BB" />
        </label>
        <label>
          <span>VIN</span>
          <input name="vin" placeholder="VF1..." />
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
      <label>
        <span>Opération / description *</span>
        <textarea name="operation" required rows={3} placeholder="Remplacement embrayage, diagnostic, peinture..." />
      </label>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" disabled={loading} className={styles.submit}>
        {loading ? 'Création...' : 'Créer l’OR externe'}
      </button>
    </form>
  )
}
