'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './page.module.css'

export function ErrorActions({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function update(statut: 'EN_COURS' | 'RESOLU' | 'IGNORE') {
    setLoading(statut)
    try {
      const res = await fetch(`/api/errors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        alert(data?.error ?? 'Mise a jour impossible')
        return
      }

      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className={styles.actions}>
      <button type="button" onClick={() => update('EN_COURS')} disabled={Boolean(loading)}>
        {loading === 'EN_COURS' ? '...' : 'prendre'}
      </button>
      <button type="button" onClick={() => update('RESOLU')} disabled={Boolean(loading)}>
        {loading === 'RESOLU' ? '...' : 'resolu'}
      </button>
      <button type="button" onClick={() => update('IGNORE')} disabled={Boolean(loading)}>
        {loading === 'IGNORE' ? '...' : 'ignorer'}
      </button>
    </div>
  )
}
