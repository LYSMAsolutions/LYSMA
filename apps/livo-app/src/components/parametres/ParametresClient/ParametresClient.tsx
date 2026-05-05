'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { Check, Buildings, CurrencyEur, LockKey, Eye, EyeSlash, DeviceMobile } from '@phosphor-icons/react'
import styles from './ParametresClient.module.css'

type TauxGarage = {
  id: string
  type: 'T1' | 'T2' | 'T3' | 'T4' | 'CARROSSERIE' | 'PEINTURE' | 'AUTRE'
  libelle: string
  montant: number
  actif: boolean
}

type Garage = {
  id: string
  nom: string
  adresse: string | null
  codePostal: string | null
  ville: string | null
  telephone: string | null
  email: string | null
  siret: string | null
}

type Compagnon = {
  id: string
  prenom: string
  nom: string
  poste: string | null
  hasPin: boolean
}

type Props = {
  garage: Garage
  taux: TauxGarage[]
  compagnons: Compagnon[]
}

export function ParametresClient({ garage, taux: tauxInit, compagnons }: Props) {
  const router = useRouter()

  // Garage
  const [nom, setNom] = useState(garage.nom)
  const [adresse, setAdresse] = useState(garage.adresse ?? '')
  const [codePostal, setCodePostal] = useState(garage.codePostal ?? '')
  const [ville, setVille] = useState(garage.ville ?? '')
  const [telephone, setTelephone] = useState(garage.telephone ?? '')
  const [email, setEmail] = useState(garage.email ?? '')
  const [siret, setSiret] = useState(garage.siret ?? '')
  const [savingGarage, setSavingGarage] = useState(false)
  const [savedGarage, setSavedGarage] = useState(false)

  // Taux
  const [taux, setTaux] = useState(tauxInit)
  const [savingTaux, setSavingTaux] = useState(false)
  const [savedTaux, setSavedTaux] = useState(false)

  // Mot de passe atelier
  const [passwordAtelier, setPasswordAtelier] = useState('')
  const [confirmPasswordAtelier, setConfirmPasswordAtelier] = useState('')
  const [showPasswordAtelier, setShowPasswordAtelier] = useState(false)
  const [savingPasswordAtelier, setSavingPasswordAtelier] = useState(false)
  const [savedPasswordAtelier, setSavedPasswordAtelier] = useState(false)
  const [errorPasswordAtelier, setErrorPasswordAtelier] = useState('')

  // PINs compagnons
  const [pins, setPins] = useState<Record<string, string>>({})
  const [savingPins, setSavingPins] = useState<Record<string, boolean>>({})
  const [savedPins, setSavedPins] = useState<Record<string, boolean>>({})
  const [errorPins, setErrorPins] = useState<Record<string, string>>({})

  async function saveGarage() {
    setSavingGarage(true)
    try {
      const res = await fetch('/api/parametres', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ garageId: garage.id, type: 'garage', data: { nom, adresse, codePostal, ville, telephone, email, siret } }),
      })
      if (res.ok) { setSavedGarage(true); setTimeout(() => setSavedGarage(false), 2000); router.refresh() }
    } finally { setSavingGarage(false) }
  }

  async function saveTaux() {
    setSavingTaux(true)
    try {
      const res = await fetch('/api/parametres', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ garageId: garage.id, type: 'taux', data: { taux } }),
      })
      if (res.ok) { setSavedTaux(true); setTimeout(() => setSavedTaux(false), 2000); router.refresh() }
    } finally { setSavingTaux(false) }
  }

  async function savePasswordAtelier() {
    setErrorPasswordAtelier('')
    if (passwordAtelier.length < 4) { setErrorPasswordAtelier('Minimum 4 caractères'); return }
    if (passwordAtelier !== confirmPasswordAtelier) { setErrorPasswordAtelier('Les mots de passe ne correspondent pas'); return }
    setSavingPasswordAtelier(true)
    try {
      const res = await fetch('/api/parametres', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ garageId: garage.id, type: 'password-atelier', data: { password: passwordAtelier } }),
      })
      if (res.ok) {
        setSavedPasswordAtelier(true)
        setPasswordAtelier('')
        setConfirmPasswordAtelier('')
        setTimeout(() => setSavedPasswordAtelier(false), 2000)
      }
    } finally { setSavingPasswordAtelier(false) }
  }

  async function savePin(compagnonId: string) {
    const pin = pins[compagnonId] ?? ''
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setErrorPins(p => ({ ...p, [compagnonId]: 'PIN doit être 4 chiffres' }))
      return
    }
    setErrorPins(p => ({ ...p, [compagnonId]: '' }))
    setSavingPins(p => ({ ...p, [compagnonId]: true }))
    try {
      const res = await fetch('/api/parametres', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ garageId: garage.id, type: 'pin-compagnon', data: { compagnonId, pin } }),
      })
      if (res.ok) {
        setSavedPins(p => ({ ...p, [compagnonId]: true }))
        setPins(p => ({ ...p, [compagnonId]: '' }))
        setTimeout(() => setSavedPins(p => ({ ...p, [compagnonId]: false })), 2000)
        router.refresh()
      }
    } finally { setSavingPins(p => ({ ...p, [compagnonId]: false })) }
  }

  function updateTaux(id: string, field: keyof TauxGarage, value: string | number | boolean) {
    setTaux(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  return (
    <div className={styles.wrapper}>

      {/* ── Infos garage ───────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}><Buildings size={16} /></div>
          <div>
            <h2 className={styles.sectionTitle}>Informations du garage</h2>
            <p className={styles.sectionDesc}>Ces informations apparaissent sur vos PDFs</p>
          </div>
        </div>
        <div className={styles.form}>
          <Input label="Nom du garage *" value={nom} onChange={e => setNom(e.target.value)} placeholder="Garage Dupont" />
          <Input label="Adresse" value={adresse} onChange={e => setAdresse(e.target.value)} placeholder="12 rue de la Mécanique" />
          <div className={styles.row2}>
            <Input label="Code postal" value={codePostal} onChange={e => setCodePostal(e.target.value)} placeholder="75011" />
            <Input label="Ville" value={ville} onChange={e => setVille(e.target.value)} placeholder="Paris" />
          </div>
          <div className={styles.row2}>
            <Input label="Téléphone" value={telephone} onChange={e => setTelephone(e.target.value)} placeholder="01 43 56 78 90" type="tel" />
            <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="contact@garage.fr" type="email" />
          </div>
          <Input label="SIRET" value={siret} onChange={e => setSiret(e.target.value)} placeholder="123 456 789 00012" />
        </div>
        <div className={styles.sectionFooter}>
          <Button variant="primary" size="sm" loading={savingGarage} icon={savedGarage ? <Check weight="bold" /> : undefined} onClick={saveGarage}>
            {savedGarage ? 'Enregistré !' : 'Enregistrer'}
          </Button>
        </div>
      </section>

      {/* ── Taux horaires ──────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}><CurrencyEur size={16} /></div>
          <div>
            <h2 className={styles.sectionTitle}>Taux horaires</h2>
            <p className={styles.sectionDesc}>Configurez vos taux par catégorie de travaux</p>
          </div>
        </div>
        <div className={styles.tauxGrid}>
          {taux.map(t => (
            <div key={t.id} className={`${styles.tauxCard} ${!t.actif ? styles.tauxInactif : ''}`}>
              <div className={styles.tauxHeader}>
                <span className={styles.tauxType}>{t.type}</span>
                <label className={styles.toggleLabel}>
                  <input type="checkbox" checked={t.actif} onChange={e => updateTaux(t.id, 'actif', e.target.checked)} className={styles.toggleInput} />
                  <span className={`${styles.toggle} ${t.actif ? styles.toggleOn : ''}`} />
                </label>
              </div>
              <input className={styles.tauxLibelle} value={t.libelle} onChange={e => updateTaux(t.id, 'libelle', e.target.value)} placeholder="Libellé" />
              <div className={styles.tauxMontantWrapper}>
                <input type="number" className={styles.tauxMontant} value={t.montant} onChange={e => updateTaux(t.id, 'montant', parseFloat(e.target.value) || 0)} min="0" step="1" />
                <span className={styles.tauxUnite}>€/h</span>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.sectionFooter}>
          <Button variant="primary" size="sm" loading={savingTaux} icon={savedTaux ? <Check weight="bold" /> : undefined} onClick={saveTaux}>
            {savedTaux ? 'Enregistré !' : 'Enregistrer les taux'}
          </Button>
        </div>
      </section>

      {/* ── Accès atelier ──────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}><DeviceMobile size={16} /></div>
          <div>
            <h2 className={styles.sectionTitle}>Accès atelier</h2>
            <p className={styles.sectionDesc}>Configurez l'accès tablette pour vos compagnons — <a href="/atelier-login" target="_blank" className={styles.link}>Ouvrir l'espace atelier</a></p>
          </div>
        </div>

        <div className={styles.form}>
          {/* Mot de passe atelier */}
          <div className={styles.atelierBlock}>
            <h3 className={styles.subTitle}><LockKey size={14} /> Mot de passe atelier</h3>
            <p className={styles.subDesc}>Différent de votre mot de passe admin — partagé avec l'équipe sur la tablette</p>
            <div className={styles.row2}>
              <div className={styles.passwordWrapper}>
                <Input
                  label="Nouveau mot de passe atelier"
                  value={passwordAtelier}
                  onChange={e => setPasswordAtelier(e.target.value)}
                  type={showPasswordAtelier ? 'text' : 'password'}
                  placeholder="Min. 4 caractères"
                  iconRight={
                    <button type="button" onClick={() => setShowPasswordAtelier(v => !v)} style={{ cursor: 'pointer', display: 'flex', color: 'var(--color-text-muted)' }}>
                      {showPasswordAtelier ? <EyeSlash size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
              </div>
              <Input
                label="Confirmer"
                value={confirmPasswordAtelier}
                onChange={e => setConfirmPasswordAtelier(e.target.value)}
                type="password"
                placeholder="••••••••"
              />
            </div>
            {errorPasswordAtelier && <p className={styles.errorSm}>{errorPasswordAtelier}</p>}
            <div className={styles.inlineAction}>
              <Button variant="secondary" size="sm" loading={savingPasswordAtelier} icon={savedPasswordAtelier ? <Check weight="bold" /> : undefined} onClick={savePasswordAtelier}>
                {savedPasswordAtelier ? 'Enregistré !' : 'Définir le mot de passe atelier'}
              </Button>
            </div>
          </div>

          {/* PINs compagnons */}
          <div className={styles.atelierBlock}>
            <h3 className={styles.subTitle}>PINs des compagnons</h3>
            <p className={styles.subDesc}>Chaque compagnon entre son PIN de 4 chiffres pour accéder à son espace</p>
            <div className={styles.pinsList}>
              {compagnons.map(c => {
                const initials = `${c.prenom[0]}${c.nom[0]}`.toUpperCase()
                return (
                  <div key={c.id} className={styles.pinRow}>
                    <div className={styles.pinAvatar}>{initials}</div>
                    <div className={styles.pinInfo}>
                      <span className={styles.pinNom}>{c.prenom} {c.nom}</span>
                      <span className={styles.pinPoste}>{c.poste ?? 'Mécanicien'}</span>
                    </div>
                    <div className={styles.pinBadge} data-has={c.hasPin}>
                      {c.hasPin ? '✓ PIN configuré' : '⚠ Aucun PIN'}
                    </div>
                    <input
                      type="text"
                      className={styles.pinInput}
                      value={pins[c.id] ?? ''}
                      onChange={e => setPins(p => ({ ...p, [c.id]: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                      placeholder="0000"
                      maxLength={4}
                      inputMode="numeric"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      loading={savingPins[c.id]}
                      icon={savedPins[c.id] ? <Check weight="bold" /> : undefined}
                      onClick={() => savePin(c.id)}
                    >
                      {savedPins[c.id] ? 'OK' : 'Définir'}
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
