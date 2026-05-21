'use client'

import { useState } from 'react'
import styles from './page.module.css'

type Props = {
  requestId: string
  email: string
  company: string
}

function gmailComposeUrl(email: string, company: string, temporaryPassword: string) {
  const subject = `Vos acces Portail PMA - ${company}`
  const body = [
    `Bonjour,`,
    ``,
    `Votre espace Portail PMA est pret.`,
    ``,
    `Identifiant : ${email}`,
    `Mot de passe temporaire : ${temporaryPassword}`,
    ``,
    `Vous devrez changer ce mot de passe a la premiere connexion.`,
    ``,
    `LYSMA Solutions`,
  ].join('\n')

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export default function PmaApproveButton({ requestId, email, company }: Props) {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function approve() {
    setLoading(true)
    setError('')
    setPassword('')

    const res = await fetch(`/api/pma/requests/${requestId}/approve`, {
      method: 'POST',
    })
    const data = await res.json().catch(() => null)
    setLoading(false)

    if (!res.ok || !data?.success) {
      setError(data?.error || 'Erreur PMA')
      return
    }

    setPassword(data.temporaryPassword)
  }

  return (
    <div className={styles.approveBox}>
      <button type="button" className={styles.actionBtn} onClick={approve} disabled={loading || Boolean(password)}>
        {loading ? 'validation...' : password ? 'valide' : 'generer acces'}
      </button>

      {error ? <span className={styles.error}>{error}</span> : null}

      {password ? (
        <div className={styles.passwordBox}>
          <span>mdp_temporaire</span>
          <code>{password}</code>
          <a href={gmailComposeUrl(email, company, password)} target="_blank" rel="noreferrer">
            ouvrir gmail
          </a>
        </div>
      ) : null}
    </div>
  )
}
