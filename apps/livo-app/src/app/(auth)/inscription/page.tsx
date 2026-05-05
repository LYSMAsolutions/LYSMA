'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Input, Button } from '@/components/ui'
import { Check, ArrowRight, Buildings, User } from '@phosphor-icons/react'
import styles from './page.module.css'

export default function InscriptionPage() {
  const router = useRouter()
  const [step, setStep] = useState<'compte' | 'garage'>('compte')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Étape 1 — Compte
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Étape 2 — Garage
  const [garageNom, setGarageNom] = useState('')
  const [garageTel, setGarageTel] = useState('')
  const [garageVille, setGarageVille] = useState('')

  function validateEtape1() {
    if (!prenom || !nom || !email || !password) return 'Tous les champs sont requis'
    if (password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères'
    if (password !== confirmPassword) return 'Les mots de passe ne correspondent pas'
    return null
  }

 async function handleSubmit() {
  setError('')

  if (step === 'compte') {
    const err = validateEtape1()
    if (err) { setError(err); return }
    setStep('garage')
    return
  }

  // Étape garage
  if (!garageNom) { setError('Le nom du garage est requis'); return }

  setLoading(true)
  try {
    const res = await fetch('/api/inscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prenom, nom, email, password, garageNom, garageTel, garageVille }),
    })

    const data = await res.json()
    console.log('INSCRIPTION RESULT:', data)

    if (!res.ok) {
      setError(typeof data.error === 'string' ? data.error : 'Erreur lors de la création du compte')
      return
    }

    const signInResult = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    console.log('SIGNIN RESULT:', signInResult)

    if (signInResult?.ok) {
      router.push('/dashboard')
    } else {
      router.push('/connexion')
    }
  } finally {
    setLoading(false)
  }
}

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Logo */}
        <div className={styles.logoWrap}>
          <img src="/logo/livo-app-logo.png" alt="Livo-app" width={80} height={80} style={{ objectFit: 'contain' }} />
          <div>
            <div className={styles.logoName}>LIVO-APP</div>
            <div className={styles.logoSub}>by LYSMA Solutions</div>
          </div>
        </div>

        {/* Steps */}
        <div className={styles.steps}>
          <div className={`${styles.stepItem} ${step === 'compte' ? styles.stepActive : styles.stepDone}`}>
            {step === 'garage' ? <Check weight="bold" size={12} /> : <User size={12} />}
            <span>Votre compte</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.stepItem} ${step === 'garage' ? styles.stepActive : styles.stepPending}`}>
            <Buildings size={12} />
            <span>Votre garage</span>
          </div>
        </div>

        {/* Étape 1 */}
        {step === 'compte' && (
          <div className={styles.form}>
            <div className={styles.formTitle}>Créer votre compte</div>
            <div className={styles.row2}>
              <Input label="Prénom *" value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Jean" autoFocus />
              <Input label="Nom *" value={nom} onChange={e => setNom(e.target.value)} placeholder="Dupont" />
            </div>
            <Input label="Email *" value={email} onChange={e => setEmail(e.target.value)} placeholder="jean@garage.fr" type="email" />
            <Input label="Mot de passe *" value={password} onChange={e => setPassword(e.target.value)} placeholder="8 caractères minimum" type="password" />
            <Input label="Confirmer le mot de passe *" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" type="password" />
          </div>
        )}

        {/* Étape 2 */}
        {step === 'garage' && (
          <div className={styles.form}>
            <div className={styles.formTitle}>Votre garage</div>
            <Input label="Nom du garage *" value={garageNom} onChange={e => setGarageNom(e.target.value)} placeholder="Garage Dupont" autoFocus />
            <Input label="Ville" value={garageVille} onChange={e => setGarageVille(e.target.value)} placeholder="Paris" />
            <Input label="Téléphone" value={garageTel} onChange={e => setGarageTel(e.target.value)} placeholder="01 43 56 78 90" type="tel" />
            <div className={styles.trialBadge}>
              <Check weight="bold" size={14} />
              <span>30 jours d'essai gratuit — aucune carte requise</span>
            </div>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          {step === 'garage' && (
            <Button variant="secondary" onClick={() => { setStep('compte'); setError('') }}>
              Retour
            </Button>
          )}
          <Button
            variant="primary"
            loading={loading}
            icon={step === 'compte' ? <ArrowRight weight="bold" /> : undefined}
            onClick={handleSubmit}
            fullWidth={step === 'compte'}
          >
            {step === 'compte' ? 'Continuer' : 'Créer mon compte'}
          </Button>
        </div>

        <p className={styles.loginLink}>
          Déjà un compte ?{' '}
          <Link href="/connexion">Se connecter</Link>
        </p>

      </div>
    </div>
  )
}
