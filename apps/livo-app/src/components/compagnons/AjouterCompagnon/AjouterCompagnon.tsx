'use client'

import { useState } from 'react'
import { X } from '@phosphor-icons/react'
import { Button, Input } from '@/components/ui'
import styles from './AjouterCompagnon.module.css'

const POSTES = ['Mécanicien', 'Carrossier', 'Électricien', 'Peintre', 'Contrôleur technique', "Chef d'atelier", 'Autre']

type Props = {
  garageId: string
  onClose: () => void
  onCreated: () => void
}

export function AjouterCompagnon({ garageId, onClose, onCreated }: Props) {
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [poste, setPoste] = useState('Mécanicien')
  const [heuresContrat, setHeuresContrat] = useState('35')
  const [matricule, setMatricule] = useState('')
  const [dateEntree, setDateEntree] = useState(new Date().toISOString().split('T')[0] ?? '')
  const [pin, setPin] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!prenom || !nom) { setError('Prénom et nom sont requis'); return }
    if (pin && (pin.length !== 4 || !/^\d{4}$/.test(pin))) { setError('Le PIN doit être 4 chiffres'); return }
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/compagnons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garageId, prenom, nom, poste,
          heuresContrat: parseInt(heuresContrat) || 35,
          matricule: matricule || undefined,
          dateEntree,
          pin: pin || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(typeof data.error === 'string' ? data.error : 'Erreur'); return }
      onCreated()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Ajouter un compagnon</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <div className={styles.body}>
          <div className={styles.row2}>
            <Input label="Prénom *" value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Jean" autoFocus />
            <Input label="Nom *" value={nom} onChange={e => setNom(e.target.value)} placeholder="Dupont" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Poste</label>
            <select className={styles.select} value={poste} onChange={e => setPoste(e.target.value)}>
              {POSTES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label}>Heures / semaine</label>
              <div className={styles.heuresWrapper}>
                <input type="number" className={styles.heuresInput} value={heuresContrat} onChange={e => setHeuresContrat(e.target.value)} min="1" max="48" step="1" />
                <span className={styles.heuresUnit}>h/sem</span>
              </div>
            </div>
            <Input label="Matricule" value={matricule} onChange={e => setMatricule(e.target.value)} placeholder="C001" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Date d'entrée</label>
            <input type="date" className={styles.dateInput} value={dateEntree} onChange={e => setDateEntree(e.target.value)} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>PIN atelier (4 chiffres)</label>
            <input
              type="text"
              className={styles.pinInput}
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="0000"
              maxLength={4}
              inputMode="numeric"
            />
            <p className={styles.hint}>Le compagnon utilisera ce PIN pour accéder à l'espace atelier. Vous pourrez le modifier dans Paramètres.</p>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.footer}>
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button variant="primary" loading={submitting} onClick={handleSubmit}>Créer le compagnon</Button>
        </div>
      </div>
    </div>
  )
}
