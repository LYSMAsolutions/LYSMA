'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { DemandeIntegration } from '@/lib/livo-api'
import { Badge } from '@/components/ui'
import styles from './DemandesClient.module.css'

type Props = { demandes: DemandeIntegration[] }

function statutToBadge(statut: string): 'warning' | 'success' | 'error' {
  if (statut === 'APPROUVEE') return 'success'
  if (statut === 'REFUSEE') return 'error'
  return 'warning'
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

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Logiciel</th>
              <th>Éditeur / Contact</th>
              <th>Garage</th>
              <th>ID Garage Logiciel</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {demandes.map((d) => (
              <tr key={d.id} className={d.statut === 'EN_ATTENTE' ? styles.rowAttente : ''}>
                <td className={styles.software}>{d.nomLogiciel}</td>
                <td>
                  <span className={styles.editorName}>{d.nomEditeur ?? '—'}</span>
                  {d.contactEditeur && <span className={styles.muted}>{d.contactEditeur}</span>}
                </td>
                <td>
                  <span className={styles.garageName}>{d.garage.nom}</span>
                  {d.garage.ville && <span className={styles.muted}>{d.garage.ville}</span>}
                  <span className={styles.muted}>{d.garage.owner.email}</span>
                </td>
                <td>
                  <code className={styles.code}>{d.identifiantGarage}</code>
                </td>
                <td>
                  <Badge variant={statutToBadge(d.statut)}>
                    {d.statut === 'EN_ATTENTE' ? 'En attente' : d.statut === 'APPROUVEE' ? 'Approuvée' : 'Refusée'}
                  </Badge>
                </td>
                <td className={styles.muted}>{new Date(d.createdAt).toLocaleDateString('fr-FR')}</td>
                <td>
                  {d.statut === 'EN_ATTENTE' ? (
                    <div className={styles.actions}>
                      <input
                        className={styles.noteInput}
                        placeholder="Note admin (optionnel)"
                        value={notes[d.id] ?? ''}
                        onChange={e => setNotes(n => ({ ...n, [d.id]: e.target.value }))}
                        disabled={pending && activeId === d.id}
                      />
                      {d.message && <p className={styles.msgClient}>{d.message}</p>}
                      <div className={styles.btns}>
                        <button
                          className={styles.btnApprove}
                          onClick={() => traiter(d.id, 'APPROUVEE')}
                          disabled={pending && activeId === d.id}
                        >
                          {activeId === d.id ? 'Chargement…' : 'Approuver'}
                        </button>
                        <button
                          className={styles.btnRefuse}
                          onClick={() => traiter(d.id, 'REFUSEE')}
                          disabled={pending && activeId === d.id}
                        >
                          Refuser
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span className={styles.noteAdmin}>{d.noteAdmin ?? '—'}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
