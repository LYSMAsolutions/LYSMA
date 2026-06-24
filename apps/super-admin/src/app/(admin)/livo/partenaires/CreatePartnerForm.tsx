'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import styles from './CreatePartnerForm.module.css'

export function CreatePartnerForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [pending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!name.trim()) { setError('Le nom est requis'); return }

    try {
      const res = await fetch('/api/livo-partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) { setError(data?.error ?? `Erreur HTTP ${res.status}`); return }
      setSuccess(`Partenaire "${data.partner?.name ?? name}" créé.`)
      setName('')
      setOpen(false)
      startTransition(() => router.refresh())
    } catch {
      setError('Erreur réseau')
    }
  }

  return (
    <div className={styles.wrapper}>
      {!open ? (
        <button className={styles.btnPrimary} onClick={() => setOpen(true)}>
          + Nouveau partenaire
        </button>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            placeholder="Nom du partenaire (éditeur)"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={pending}
            autoFocus
          />
          <button className={styles.btnPrimary} type="submit" disabled={pending}>
            {pending ? 'Création…' : 'Créer'}
          </button>
          <button
            className={styles.btnSecondary}
            type="button"
            onClick={() => { setOpen(false); setError(''); setName('') }}
          >
            Annuler
          </button>
        </form>
      )}
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
    </div>
  )
}
