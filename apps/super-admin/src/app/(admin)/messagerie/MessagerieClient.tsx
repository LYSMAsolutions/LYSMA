'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

type Message = {
  id: string; nom: string; email: string; societe: string | null
  telephone: string | null; outil: string; message: string
  statut: string; reponse: string | null; createdAt: string
  client: { nom: string } | null
}

export function MessagerieClient({ messages }: { messages: Message[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<Message | null>(messages[0] ?? null)
  const [reponse, setReponse] = useState(selected?.reponse ?? '')
  const [saving, setSaving] = useState(false)

  function selectMessage(m: Message) {
    setSelected(m)
    setReponse(m.reponse ?? '')
    if (m.statut === 'NOUVEAU') markLu(m.id)
  }

  async function markLu(id: string) {
    await fetch(`/api/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut: 'LU' }),
    })
    router.refresh()
  }

  async function marquerTraite() {
    if (!selected) return
    setSaving(true)
    await fetch(`/api/messages/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut: 'TRAITE', reponse }),
    })
    setSaving(false)
    router.refresh()
  }

  async function creerClient() {
    if (!selected) return
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: selected.nom,
        email: selected.email,
        societe: selected.societe,
        telephone: selected.telephone,
        outil: selected.outil,
        messageId: selected.id,
      }),
    })
    const data = await res.json()
    if (data.client) router.push(`/clients/${data.client.id}`)
  }

  const STATUT_COLOR: Record<string, string> = {
    NOUVEAU: 'var(--red)', LU: 'var(--yellow)', TRAITE: 'var(--green)',
  }

  return (
    <div className={styles.inbox}>
      {/* Liste */}
      <div className={styles.list}>
        {messages.map(m => (
          <div
            key={m.id}
            className={`${styles.msgRow} ${selected?.id === m.id ? styles.msgSelected : ''} ${m.statut === 'NOUVEAU' ? styles.msgNew : ''}`}
            onClick={() => selectMessage(m)}
          >
            <div className={styles.msgRowTop}>
              <span className={styles.msgNom}>{m.nom}</span>
              <span className={styles.msgDate}>{new Date(m.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className={styles.msgRowSub}>
              <span className={styles.msgOutil}>{m.outil}</span>
              <span className={styles.msgStatutDot} style={{background: STATUT_COLOR[m.statut]}} />
            </div>
            <p className={styles.msgPreview}>{m.message.slice(0, 60)}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <div className={styles.empty}>// boîte vide</div>
        )}
      </div>

      {/* Détail */}
      {selected ? (
        <div className={styles.detail}>
          <div className={styles.detailHeader}>
            <div className={styles.detailFrom}>
              <span className={styles.detailNom}>{selected.nom}</span>
              <span className={styles.detailEmail}>{selected.email}</span>
              {selected.societe && <span className={styles.detailSociete}>{selected.societe}</span>}
            </div>
            <div className={styles.detailActions}>
              {!selected.client && (
                <button className={styles.btnCreate} onClick={creerClient}>
                  + créer_client
                </button>
              )}
              {selected.client && (
                <span className={styles.linkedClient}>⇒ {selected.client.nom}</span>
              )}
              <button
                className={`${styles.btnTraite} ${selected.statut === 'TRAITE' ? styles.btnTraiteDone : ''}`}
                onClick={marquerTraite}
                disabled={saving}
              >
                {saving ? '▋...' : selected.statut === 'TRAITE' ? '✓ traité' : 'marquer_traité'}
              </button>
            </div>
          </div>

          <div className={styles.detailMeta}>
            <span>outil: <strong>{selected.outil}</strong></span>
            <span>reçu: {new Date(selected.createdAt).toLocaleString('fr-FR')}</span>
            {selected.telephone && <span>tél: {selected.telephone}</span>}
          </div>

          <div className={styles.detailMsg}>
            <div className={styles.msgLabel}>// message</div>
            <p className={styles.msgContent}>{selected.message}</p>
          </div>

          <div className={styles.detailReponse}>
            <div className={styles.msgLabel}>// réponse_interne (notes)</div>
            <textarea
              className={styles.reponseArea}
              value={reponse}
              onChange={e => setReponse(e.target.value)}
              placeholder="// notes sur ce message..."
              rows={5}
            />
          </div>
        </div>
      ) : (
        <div className={styles.noSelection}>
          <span className={styles.noSelectionText}>// sélectionner un message</span>
        </div>
      )}
    </div>
  )
}
