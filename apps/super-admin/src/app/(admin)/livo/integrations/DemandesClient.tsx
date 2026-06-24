'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { DemandeIntegration, Partner, GarageLink, Credentials } from '@/lib/livo-api'
import { Badge } from '@/components/ui'
import styles from './DemandesClient.module.css'

type Props = {
  demandes: DemandeIntegration[]
  partners: Partner[]
  garageLinks: GarageLink[]
}

function statutToBadge(statut: string): 'warning' | 'success' | 'error' {
  if (statut === 'APPROUVEE') return 'success'
  if (statut === 'REFUSEE') return 'error'
  return 'warning'
}

type CreatedCredentials = {
  demandeId: string
  credentials: Credentials
  note?: string
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      className={styles.copyBtn}
      onClick={async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? 'Copié ✓' : 'Copier'}
    </button>
  )
}

function IntegrationCell({
  demande,
  partners,
  garageLinks,
  onCreated,
}: {
  demande: DemandeIntegration
  partners: Partner[]
  garageLinks: GarageLink[]
  onCreated: (c: CreatedCredentials) => void
}) {
  const [open, setOpen] = useState(false)
  const [partnerId, setPartnerId] = useState('')
  const [externalId, setExternalId] = useState(demande.identifiantGarage)
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const existingLink = garageLinks.find(gl => gl.garage.id === demande.garage.id)
  const activePartners = partners.filter(p => p.active)

  if (demande.statut === 'EN_ATTENTE' || demande.statut === 'REFUSEE') return <span className={styles.noteAdmin}>—</span>

  if (existingLink) {
    return (
      <div className={styles.integrationActive}>
        <Badge variant="success">Intégration active</Badge>
        <span className={styles.muted}>{existingLink.partner.name}</span>
      </div>
    )
  }

  if (!open) {
    return (
      <button className={styles.btnCreate} onClick={() => setOpen(true)}>
        Créer l&apos;intégration
      </button>
    )
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!partnerId) { setError('Sélectionnez un partenaire'); return }
    if (!externalId.trim()) { setError('ID garage requis'); return }

    try {
      const res = await fetch('/api/livo-garage-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerId, garageId: demande.garage.id, externalGarageId: externalId.trim() }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) { setError(data?.error ?? `Erreur HTTP ${res.status}`); return }
      onCreated({ demandeId: demande.id, credentials: data.credentials, note: data.note })
      setOpen(false)
      startTransition(() => router.refresh())
    } catch {
      setError('Erreur réseau')
    }
  }

  return (
    <form className={styles.inlineForm} onSubmit={handleCreate}>
      <select
        className={styles.select}
        value={partnerId}
        onChange={e => setPartnerId(e.target.value)}
        disabled={pending}
      >
        <option value="">— Partenaire —</option>
        {activePartners.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <input
        className={styles.inlineInput}
        placeholder="ID garage logiciel"
        value={externalId}
        onChange={e => setExternalId(e.target.value)}
        disabled={pending}
      />
      <button className={styles.btnApprove} type="submit" disabled={pending}>
        {pending ? '…' : 'Créer'}
      </button>
      <button
        className={styles.btnRefuse}
        type="button"
        onClick={() => { setOpen(false); setError('') }}
      >
        ✕
      </button>
      {error && <p className={styles.inlineError}>{error}</p>}
    </form>
  )
}

export function DemandesClient({ demandes, partners, garageLinks }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [createdCreds, setCreatedCreds] = useState<CreatedCredentials | null>(null)

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

      {createdCreds && (
        <div className={styles.credentialsBox}>
          <p className={styles.credentialsTitle}>✓ Intégration créée — transmettez ces identifiants à l&apos;éditeur</p>
          {createdCreds.note && <p className={styles.credentialsNote}>{createdCreds.note}</p>}
          <div className={styles.credentialsList}>
            <div className={styles.credRow}>
              <span className={styles.credLabel}>Endpoint</span>
              <code className={styles.credValue}>POST https://livo-app.com/api/v1/or/qr</code>
              <CopyButton value="https://livo-app.com/api/v1/or/qr" />
            </div>
            <div className={styles.credRow}>
              <span className={styles.credLabel}>Partner Key</span>
              <code className={styles.credValue}>{createdCreds.credentials.partnerKey}</code>
              <CopyButton value={createdCreds.credentials.partnerKey} />
            </div>
            <div className={styles.credRow}>
              <span className={styles.credLabel}>API Secret</span>
              <code className={styles.credValue}>{createdCreds.credentials.apiSecret}</code>
              <CopyButton value={createdCreds.credentials.apiSecret} />
            </div>
            <div className={styles.credRow}>
              <span className={styles.credLabel}>Garage ID</span>
              <code className={styles.credValue}>{createdCreds.credentials.externalGarageId}</code>
              <CopyButton value={createdCreds.credentials.externalGarageId} />
            </div>
          </div>
          <p className={styles.credentialsWarning}>⚠ Ces identifiants ne seront plus affichés. Conservez-les maintenant.</p>
          <button className={styles.credentialsClose} onClick={() => setCreatedCreds(null)}>Fermer</button>
        </div>
      )}

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
              <th>Intégration</th>
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
                  <IntegrationCell
                    demande={d}
                    partners={partners}
                    garageLinks={garageLinks}
                    onCreated={(c) => setCreatedCreds(c)}
                  />
                </td>
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
