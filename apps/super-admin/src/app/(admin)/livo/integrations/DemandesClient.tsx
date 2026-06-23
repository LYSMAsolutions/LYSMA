'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { DemandeIntegration } from '@/lib/livo-api'
import styles from './DemandesClient.module.css'

type Props = { demandes: DemandeIntegration[] }

const STATUT_COLOR: Record<string, string> = {
  EN_ATTENTE: 'var(--yellow)',
  APPROUVEE: 'var(--green)',
  REFUSEE: 'var(--red)',
}

export function DemandesClient({ demandes }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [error, setError] = useState('')

  async function traiter(id: string, statut: 'APPROUVEE' | 'REFUSEE') {
    setError('')
    setActiveId(id)
    try {
      const res = await fetch(`/api/livo-demande/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut, noteAdmin: notes[id] || null }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) { setError(data?.error ?? `Erreur HTTP ${res.status}`); return }
      startTransition(() => router.refresh())
    } catch {
      setError('Erreur réseau')
    } finally {
      setActiveId(null)
    }
  }

  return (
    <div className={styles.wrapper}>
      {error && <div className={styles.error}>{error}</div>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>logiciel</th>
            <th>éditeur / contact</th>
            <th>garage</th>
            <th>id_garage_logiciel</th>
            <th>statut</th>
            <th>date</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {demandes.map((d) => (
            <tr key={d.id} className={d.statut === 'EN_ATTENTE' ? styles.rowAttente : ''}>
              <td className={styles.mono}>{d.nomLogiciel}</td>
              <td>
                <div>{d.nomEditeur ?? <span className={styles.muted}>—</span>}</div>
                {d.contactEditeur && <div className={styles.muted}>{d.contactEditeur}</div>}
              </td>
              <td>
                <div>{d.garage.nom}</div>
                <div className={styles.muted}>{d.garage.ville ?? ''}</div>
                <div className={styles.muted}>{d.garage.owner.email}</div>
              </td>
              <td className={styles.mono}>{d.identifiantGarage}</td>
              <td style={{ color: STATUT_COLOR[d.statut] }}>{d.statut}</td>
              <td className={styles.muted}>{new Date(d.createdAt).toLocaleDateString('fr-FR')}</td>
              <td>
                {d.statut === 'EN_ATTENTE' ? (
                  <div className={styles.actions}>
                    <input
                      className={styles.noteInput}
                      placeholder="note (optionnel)"
                      value={notes[d.id] ?? ''}
                      onChange={e => setNotes(n => ({ ...n, [d.id]: e.target.value }))}
                      disabled={pending && activeId === d.id}
                    />
                    <div className={styles.btns}>
                      <button
                        className={styles.btnApprove}
                        onClick={() => traiter(d.id, 'APPROUVEE')}
                        disabled={pending && activeId === d.id}
                      >
                        {activeId === d.id ? '...' : 'approuver'}
                      </button>
                      <button
                        className={styles.btnRefuse}
                        onClick={() => traiter(d.id, 'REFUSEE')}
                        disabled={pending && activeId === d.id}
                      >
                        refuser
                      </button>
                    </div>
                    {d.message && <div className={styles.msg}>msg: {d.message}</div>}
                  </div>
                ) : (
                  <span className={styles.muted}>{d.noteAdmin ?? '—'}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
