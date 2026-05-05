'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Wrench } from '@phosphor-icons/react'
import styles from './page.module.css'

type Compagnon = {
  id: string
  prenom: string
  nom: string
  poste: string | null
}

type Step = 'login' | 'compagnon' | 'pin'

export default function AtelierLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [garageNom, setGarageNom] = useState('')
  const [garageId, setGarageId] = useState('')

  // Compagnons
  const [compagnons, setCompagnons] = useState<Compagnon[]>([])
  const [compagnonSelectionne, setCompagnonSelectionne] = useState<Compagnon | null>(null)

  // PIN
  const [pin, setPin] = useState('')

  async function handleLogin() {
    if (!email || !password) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/atelier-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }

      setGarageNom(data.garageNom)
      setGarageId(data.garageId)

      // Charger les compagnons
      const r2 = await fetch(`/api/atelier-auth/compagnons?garageId=${data.garageId}`)
      const d2 = await r2.json()
      setCompagnons(d2.compagnons ?? [])
      setStep('compagnon')
    } finally {
      setLoading(false)
    }
  }

  function handleSelectCompagnon(c: Compagnon) {
    setCompagnonSelectionne(c)
    setPin('')
    setError('')
    setStep('pin')
  }

  function handlePinDigit(digit: string) {
    if (pin.length >= 4) return
    const newPin = pin + digit
    setPin(newPin)
    if (newPin.length === 4) {
      verifyPin(newPin)
    }
  }

  function handlePinDelete() {
    setPin(p => p.slice(0, -1))
    setError('')
  }

  async function verifyPin(pinValue: string) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/atelier-auth/compagnon-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compagnonId: compagnonSelectionne!.id, pin: pinValue }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
        setPin('')
        return
      }
      router.push('/atelier-dashboard')
    } finally {
      setLoading(false)
    }
  }

  const initials = (c: Compagnon) => `${c.prenom[0]}${c.nom[0]}`.toUpperCase()

  return (
    <div className={styles.page}>

      {/* ── Étape 1 — Login atelier ──────────────────────── */}
      {step === 'login' && (
        <div className={styles.card}>
          <div className={styles.logoWrap}>
            <div className={styles.logoIcon}><Wrench weight="fill" size={28} /></div>
            <div>
              <div className={styles.logoName}>Espace Atelier</div>
              <div className={styles.logoSub}>LIVO-APP</div>
            </div>
          </div>

          <h1 className={styles.title}>Connexion atelier</h1>

          <div className={styles.form}>
            <input
              className={styles.input}
              type="email"
              placeholder="Email du garage"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Mot de passe atelier"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.btnPrimary} onClick={handleLogin} disabled={loading}>
              {loading ? 'Connexion...' : 'Accéder à l\'atelier'}
            </button>
          </div>

          <a href="/connexion" className={styles.adminLink}>
            → Accès administration
          </a>
        </div>
      )}

      {/* ── Étape 2 — Sélection compagnon ───────────────── */}
      {step === 'compagnon' && (
        <div className={styles.cardLarge}>
          <div className={styles.garageHeader}>
            <div className={styles.garageDot} />
            <span className={styles.garageNom}>{garageNom}</span>
          </div>
          <h1 className={styles.title}>Qui êtes-vous ?</h1>

          <div className={styles.compagnonsGrid}>
            {compagnons.map(c => (
              <button
                key={c.id}
                className={styles.compagnonBtn}
                onClick={() => handleSelectCompagnon(c)}
              >
                <div className={styles.compagnonAvatar}>{initials(c)}</div>
                <span className={styles.compagnonNom}>{c.prenom}</span>
                <span className={styles.compagnonPoste}>{c.poste ?? 'Mécanicien'}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Étape 3 — Saisie PIN ─────────────────────────── */}
      {step === 'pin' && compagnonSelectionne && (
        <div className={styles.card}>
          <button className={styles.backBtn} onClick={() => { setStep('compagnon'); setError('') }}>
            ← Retour
          </button>

          <div className={styles.compagnonSelected}>
            <div className={styles.compagnonAvatarLg}>{initials(compagnonSelectionne)}</div>
            <span className={styles.compagnonNomLg}>{compagnonSelectionne.prenom} {compagnonSelectionne.nom}</span>
          </div>

          <p className={styles.pinLabel}>Entrez votre code PIN</p>

          <div className={styles.pinDots}>
            {[0,1,2,3].map(i => (
              <div key={i} className={`${styles.pinDot} ${pin.length > i ? styles.pinDotFilled : ''}`} />
            ))}
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.pinPad}>
            {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d, i) => (
              <button
                key={i}
                className={`${styles.pinKey} ${d === '' ? styles.pinKeyEmpty : ''}`}
                onClick={() => d === '⌫' ? handlePinDelete() : d !== '' && handlePinDigit(d)}
                disabled={loading || d === ''}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
