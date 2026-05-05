'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function ConnexionPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) {
      setError('Accès refusé')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.terminal}>
        <div className={styles.titleBar}>
          <div className={styles.dots}>
            <span className={styles.dot} style={{background:'#ff5f57'}} />
            <span className={styles.dot} style={{background:'#febc2e'}} />
            <span className={styles.dot} style={{background:'#28c840'}} />
          </div>
          <span className={styles.termTitle}>lysma-admin — bash</span>
        </div>

        <div className={styles.body}>
          <div className={styles.prompt}>
            <span className={styles.promptUser}>admin</span>
            <span className={styles.promptAt}>@</span>
            <span className={styles.promptHost}>lysma-solutions</span>
            <span className={styles.promptPath}> ~/admin</span>
            <span className={styles.promptSymbol}> $</span>
            <span className={styles.promptCmd}> login</span>
          </div>

          <div className={styles.output}>
            <span className={styles.outputLine}>LYSMA Solutions — Super Admin v1.0</span>
            <span className={styles.outputLine} style={{color:'var(--text-muted)'}}>Authentification requise.</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>$ email:</label>
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@lysmasolutions.fr"
                autoFocus
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>$ password:</label>
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>

            {error && (
              <div className={styles.error}>
                <span style={{color:'var(--red)'}}>✗ </span>{error}
              </div>
            )}

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? (
                <span className={styles.loading}>▋ Authentification en cours...</span>
              ) : (
                <span>▶ Accéder au panneau de contrôle</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
