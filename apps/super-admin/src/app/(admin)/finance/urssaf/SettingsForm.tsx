'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { FinanceSettingsView } from '@/lib/finance'
import styles from '../page.module.css'

export function SettingsForm({ settings }: { settings: FinanceSettingsView }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({
    urssafRate: String(settings.urssafRate),
    vatRate: String(settings.vatRate),
    vatStatus: settings.vatStatus,
    declarationFrequency: settings.declarationFrequency,
  })

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    const res = await fetch('/api/finance/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setBusy(false)
    if (!res.ok) {
      alert('Parametres impossibles a enregistrer.')
      return
    }
    router.refresh()
  }

  return (
    <form className={`${styles.panelBody} ${styles.settingsForm}`} onSubmit={submit}>
      <label>
        Taux URSSAF
        <input value={form.urssafRate} type="number" step="0.01" onChange={(event) => setForm({ ...form, urssafRate: event.target.value })} />
      </label>
      <label>
        Taux TVA
        <input value={form.vatRate} type="number" step="0.01" onChange={(event) => setForm({ ...form, vatRate: event.target.value })} />
      </label>
      <label>
        Statut TVA
        <select value={form.vatStatus} onChange={(event) => setForm({ ...form, vatStatus: event.target.value as typeof form.vatStatus })}>
          <option value="FRANCHISE">Franchise</option>
          <option value="ASSUJETTI">Assujetti</option>
        </select>
      </label>
      <label>
        Declaration
        <select value={form.declarationFrequency} onChange={(event) => setForm({ ...form, declarationFrequency: event.target.value as typeof form.declarationFrequency })}>
          <option value="MENSUELLE">Mensuelle</option>
          <option value="TRIMESTRIELLE">Trimestrielle</option>
        </select>
      </label>
      <div className={`${styles.formActions} ${styles.full}`}>
        <button className={styles.primaryAction} disabled={busy}>{busy ? 'Enregistrement...' : 'Enregistrer les parametres'}</button>
      </div>
    </form>
  )
}
