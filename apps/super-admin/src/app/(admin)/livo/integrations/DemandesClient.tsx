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

function ApproveForm({
  demande,
  partners,
  onApproved,
  onRefused,
}: {
  demande: DemandeIntegration
  partners: Partner[]
  onApproved: (c: CreatedCredentials) => void
  onRefused: () => void
}) {
  const [partnerId, setPartnerId] = useState(partners[0]?.id ?? '')
  const [externalId, setExternalId] = useState(demande.identifiantGarage)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [pendingApprove, startApprove] = useTransition()
  const [pendingRefuse, startRefuse] = useTransition()
  const router = useRouter()

  async function handleApprove(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!partnerId) { setError('Sélectionnez un partenaire'); return }
    if (!externalId.trim()) { setError('ID garage requis'); return }

    startApprove(async () => {
      try {
        const res = await fetch(`/api/livo-demande/${demande.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            statut: 'APPROUVEE',
            noteAdmin: note || null,
            partnerId,
            externalGarageId: externalId.trim(),
          }),
        })
        const data = await res.json().catch(() => null)
        if (!res.ok) { setError(data?.error ?? `Erreur HTTP ${res.status}`); return }
        if (data.credentials) {
          onApproved({ demandeId: demande.id, credentials: data.credentials, note: data.note })
        }
        router.refresh()
      } catch {
        setError('Erreur réseau')
      }
    })
  }

  async function handleRefuse() {
    setError('')
    startRefuse(async () => {
      try {
        const res = await fetch(`/api/livo-demande/${demande.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ statut: 'REFUSEE', noteAdmin: note || null }),
        })
        const data = await res.json().catch(() => null)
        if (!res.ok) { setError(data?.error ?? `Erreur HTTP ${res.status}`); return }
        onRefused()
        router.refresh()
      } catch {
        setError('Erreur réseau')
      }
    })
  }

  return (
    <form className={styles.approveForm} onSubmit={handleApprove}>
      <div className={styles.approveFields}>
        <select
          className={styles.select}
          value={partnerId}
          onChange={e => setPartnerId(e.target.value)}
          disabled={pendingApprove || pendingRefuse}
        >
          <option value="">— Partenaire —</option>
          {partners.filter(p => p.active).map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <input
          className={styles.inlineInput}
          placeholder="ID garage logiciel"
          value={externalId}
          onChange={e => setExternalId(e.target.value)}
          disabled={pendingApprove || pendingRefuse}
        />
        <input
          className={styles.noteInput}
          placeholder="Note admin (optionnel)"
          value={note}
          onChange={e => setNote(e.target.value)}
          disabled={pendingApprove || pendingRefuse}
        />
      </div>
      {demande.message && <p className={styles.msgClient}>Message client : {demande.message}</p>}
      {error && <p className={styles.inlineError}>{error}</p>}
      <div className={styles.btns}>
        <button className={styles.btnApprove} type="submit" disabled={pendingApprove || pendingRefuse}>
          {pendingApprove ? 'Approbation…' : '✓ Approuver & activer'}
        </button>
        <button
          className={styles.btnRefuse}
          type="button"
          onClick={handleRefuse}
          disabled={pendingApprove || pendingRefuse}
        >
          {pendingRefuse ? '…' : 'Refuser'}
        </button>
      </div>
    </form>
  )
}

export function DemandesClient({ demandes, partners, garageLinks }: Props) {
  const [createdCreds, setCreatedCreds] = useState<CreatedCredentials | null>(null)

  return (
    <div className={styles.wrapper}>
      {createdCreds && (
        <div className={styles.credentialsBox}>
          <p className={styles.credentialsTitle}>✓ Intégration activée — credentials envoyés par email à l&apos;éditeur</p>
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
          <p className={styles.credentialsWarning}>⚠ Ces credentials ne seront plus affichés ici. L&apos;éditeur les a reçus par email.</p>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {demandes.map((d) => {
              const existingLink = garageLinks.find(gl => gl.garage.id === d.garage.id)

              return (
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
                    {d.statut === 'APPROUVEE' && existingLink && (
                      <span className={styles.muted}>{existingLink.partner.name}</span>
                    )}
                  </td>
                  <td className={styles.muted}>{new Date(d.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td>
                    {d.statut === 'EN_ATTENTE' ? (
                      <ApproveForm
                        demande={d}
                        partners={partners}
                        onApproved={(c) => setCreatedCreds(c)}
                        onRefused={() => {}}
                      />
                    ) : (
                      <span className={styles.noteAdmin}>{d.noteAdmin ?? '—'}</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
