'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

type Client = {
  id: string; nom: string; email: string; telephone: string | null
  societe: string | null; outil: string; statut: string; abonnement: string | null
  trialDebutAt: string | null; trialFinAt: string | null
  abonnementActif: boolean; notes: string | null; createdAt: string
  acces: { id: string; email: string; actif: boolean; premiereConnexion: boolean; createdAt: string }[]
  messages: { id: string; nom: string; message: string; statut: string; createdAt: string }[]
}

type Props = { client: Client }

export function ClientDetailClient({ client }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [notes, setNotes] = useState(client.notes ?? '')
  const [abonnement, setAbonnement] = useState(client.abonnement ?? '')
  const [statut, setStatut] = useState(client.statut)
  const [abonnementActif, setAbonnementActif] = useState(client.abonnementActif)

  async function saveClient() {
    setSaving(true)
    try {
      await fetch(`/api/clients/${client.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, abonnement, statut, abonnementActif }),
      })
      router.refresh()
    } finally { setSaving(false) }
  }

  async function genererAcces() {
    const email = prompt('Email pour le nouvel accès :')
    if (!email) return
    const res = await fetch('/api/acces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: client.id, email }),
    })
    const data = await res.json()
    if (data.motDePasseTemp) {
      alert(`Accès créé !\nEmail: ${email}\nMot de passe: ${data.motDePasseTemp}`)
      router.refresh()
    }
  }

  async function resetAccessPassword(accessId: string) {
    const res = await fetch(`/api/acces/${accessId}/reset-password`, {
      method: 'POST',
    })
    const data = await res.json()

    if (!res.ok) {
      alert(data.error ?? 'Impossible de generer le mot de passe')
      return
    }

    alert(`Nouveau mot de passe temporaire :\n${data.motDePasseTemp}`)
    if (data.gmailUrl) window.open(data.gmailUrl, '_blank', 'noopener,noreferrer')
    router.refresh()
  }

  return (
    <div className={styles.detail}>
      {/* Header client */}
      <div className={styles.clientHeader}>
        <div className={styles.clientInfo}>
          <span className={styles.clientNom}>{client.nom}</span>
          <span className={styles.clientEmail}>{client.email}</span>
          {client.societe && <span className={styles.clientSociete}>{client.societe}</span>}
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnSave} onClick={saveClient} disabled={saving}>
            {saving ? '▋ saving...' : '✓ enregistrer'}
          </button>
          <button className={styles.btnAcces} onClick={genererAcces}>
            + générer_accès
          </button>
        </div>
      </div>

      <div className={styles.cols}>
        {/* Colonne gauche */}
        <div className={styles.colLeft}>
          {/* Infos */}
          <div className={styles.panel}>
            <div className={styles.panelTitle}>// informations</div>
            <div className={styles.fields}>
              <Field label="outil" value={client.outil} />
              <Field label="créé_le" value={new Date(client.createdAt).toLocaleDateString('fr-FR')} />
              {client.telephone && <Field label="téléphone" value={client.telephone} />}
              {client.trialDebutAt && <Field label="trial_début" value={new Date(client.trialDebutAt).toLocaleDateString('fr-FR')} />}
              {client.trialFinAt && <Field label="trial_fin" value={new Date(client.trialFinAt).toLocaleDateString('fr-FR')} />}
            </div>
          </div>

          {/* Statut & abonnement */}
          <div className={styles.panel}>
            <div className={styles.panelTitle}>// statut & abonnement</div>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>statut</label>
                <select className={styles.fieldSelect} value={statut} onChange={e => setStatut(e.target.value)}>
                  <option value="TRIAL">trial</option>
                  <option value="ACTIF">actif</option>
                  <option value="SUSPENDU">suspendu</option>
                  <option value="RESILIE">résilié</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>abonnement</label>
                <select className={styles.fieldSelect} value={abonnement} onChange={e => setAbonnement(e.target.value)}>
                  <option value="">—</option>
                  <option value="starter">starter (49€)</option>
                  <option value="pro">pro (99€)</option>
                  <option value="entreprise">entreprise (199€)</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>abonnement_actif</label>
                <label className={styles.toggle}>
                  <input type="checkbox" checked={abonnementActif} onChange={e => setAbonnementActif(e.target.checked)} />
                  <span className={`${styles.toggleSlider} ${abonnementActif ? styles.toggleOn : ''}`} />
                  <span style={{color: abonnementActif ? 'var(--green)' : 'var(--text-muted)', fontSize: 11}}>
                    {abonnementActif ? 'actif' : 'inactif'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className={styles.panel}>
            <div className={styles.panelTitle}>// notes_internes</div>
            <textarea
              className={styles.notes}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="// notes sur ce client..."
              rows={6}
            />
          </div>
        </div>

        {/* Colonne droite */}
        <div className={styles.colRight}>
          {/* Accès */}
          <div className={styles.panel}>
            <div className={styles.panelTitle}>// accès_générés ({client.acces.length})</div>
            <table className={styles.miniTable}>
              <thead><tr><th>email</th><th>actif</th><th>1ère_co</th><th>créé</th><th>action</th></tr></thead>
              <tbody>
                {client.acces.map(a => (
                  <tr key={a.id}>
                    <td className={styles.mono}>{a.email}</td>
                    <td><span style={{color: a.actif ? 'var(--green)' : 'var(--red)'}}>{a.actif ? '✓' : '✗'}</span></td>
                    <td><span style={{color: a.premiereConnexion ? 'var(--green)' : 'var(--yellow)'}}>{a.premiereConnexion ? 'oui' : 'non'}</span></td>
                    <td className={styles.muted}>{new Date(a.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <button className={styles.inlineBtn} onClick={() => resetAccessPassword(a.id)}>
                        reset_mdp
                      </button>
                    </td>
                  </tr>
                ))}
                {client.acces.length === 0 && <tr><td colSpan={5} className={styles.empty}>// aucun accès</td></tr>}
              </tbody>
            </table>
          </div>

          {/* Messages */}
          <div className={styles.panel}>
            <div className={styles.panelTitle}>// historique_messages ({client.messages.length})</div>
            <div className={styles.msgList}>
              {client.messages.map(m => (
                <div key={m.id} className={styles.msgItem}>
                  <div className={styles.msgMeta}>
                    <span className={styles.muted}>{new Date(m.createdAt).toLocaleDateString('fr-FR')}</span>
                    <span className={`${styles.msgStatut} ${m.statut === 'TRAITE' ? styles.traite : m.statut === 'NOUVEAU' ? styles.nouveau : ''}`}>{m.statut.toLowerCase()}</span>
                  </div>
                  <p className={styles.msgText}>{m.message.slice(0, 120)}</p>
                </div>
              ))}
              {client.messages.length === 0 && <div className={styles.empty}>// aucun message</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.fieldValue}>{value}</span>
    </div>
  )
}
