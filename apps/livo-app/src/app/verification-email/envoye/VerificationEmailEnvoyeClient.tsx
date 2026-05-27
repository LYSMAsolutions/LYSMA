'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from '../page.module.css'

type Props = {
  initialEmail: string
}

export function VerificationEmailEnvoyeClient({ initialEmail }: Props) {
  const [email, setEmail] = useState(initialEmail)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function resend() {
    setStatus('sending')
    const res = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setStatus(res.ok ? 'sent' : 'error')
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.badge}>Vérification email</p>
        <h1>Consultez votre boîte mail.</h1>
        <p>
          Nous avons envoyé un lien de validation. Vous devez confirmer votre adresse email avant d’accéder à LIVO.
        </p>
        <label className={styles.label}>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@garage.fr" />
        </label>
        <button className={styles.cta} onClick={resend} disabled={status === 'sending' || !email}>
          {status === 'sending' ? 'Envoi en cours...' : 'Renvoyer le mail de vérification'}
        </button>
        {status === 'sent' && <p className={styles.success}>Email renvoyé si ce compte existe et n’est pas encore vérifié.</p>}
        {status === 'error' && <p className={styles.error}>Envoi impossible pour le moment. Réessayez dans quelques minutes.</p>}
        <Link href="/connexion" className={styles.link}>Retour à la connexion</Link>
      </section>
    </main>
  )
}
