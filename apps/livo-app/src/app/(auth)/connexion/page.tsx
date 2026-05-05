'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import styles from './page.module.css'

export default function ConnexionPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
      return
    }

    // Vérifier le mode (admin ou atelier)
    const sessionRes = await fetch('/api/auth/session')
    const session = await sessionRes.json()

    if ((session as any)?.atelierMode) {
      router.push('/atelier-dashboard')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>
            <img src="/logo/livo-app-logo.png" alt="Livo-app" width={80} height={80} style={{ objectFit: 'contain' }} />
          </div>
          <span className={styles.logoName}>Livo-app</span>
        </div>

        <div className={styles.heading}>
          <h1 className={styles.title}>Connexion</h1>
          <p className={styles.subtitle}>Accédez à votre espace</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input label="Email" type="email" placeholder="vous@garage.fr" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" inputSize="lg" />
          <Input
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            inputSize="lg"
            iconRight={
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer', display: 'flex', color: 'var(--color-text-muted)' }}>
                {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            }
            error={error}
          />
          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            Se connecter
          </Button>
        </form>

        <p className={styles.inscriptionLink}>
          Pas encore de compte ? <a href="/inscription">Créer un compte gratuit</a>
        </p>

        <p className={styles.footer}>Livo-app · Gestion d&apos;atelier automobile</p>
      </div>
    </div>
  )
}
