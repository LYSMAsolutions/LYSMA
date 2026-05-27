'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import styles from './page.module.css'

type Props = {
  email: string
}

export function DoubleAuthentificationClient({ email }: Props) {
  const router = useRouter()
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')
  const [manualKey, setManualKey] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState('')
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false

    async function setup() {
      setLoading(true)
      setError('')

      try {
        const res = await fetch('/api/security/2fa/setup', { method: 'POST' })
        const data = await res.json()

        if (!res.ok) {
          setError(data.error ?? 'Impossible de générer le QR code de double authentification.')
          return
        }

        if (!cancelled) {
          setQrCodeDataUrl(data.qrCodeDataUrl)
          setManualKey(data.manualKey)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    setup()
    return () => {
      cancelled = true
    }
  }, [])

  async function confirm() {
    setConfirming(true)
    setError('')

    try {
      const res = await fetch('/api/security/2fa/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Code incorrect. Vérifiez Google Authenticator et réessayez.')
        return
      }

      setRecoveryCodes(data.recoveryCodes ?? [])
      router.refresh()
      setTimeout(() => router.push('/dashboard'), 1200)
    } finally {
      setConfirming(false)
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.logo}>
          <img src="/logo/livo-app-logo.png" alt="Livo-app" width={74} height={74} />
          <div>
            <p className={styles.badge}>Sécurité obligatoire</p>
            <h1>Activez la double authentification</h1>
          </div>
        </div>

        <p className={styles.intro}>
          Pour protéger votre espace LIVO, scannez ce QR code avec Google Authenticator,
          Microsoft Authenticator ou Authy. Cette étape est obligatoire avant d’accéder à l’outil.
        </p>

        <div className={styles.account}>{email}</div>

        {loading && <p className={styles.muted}>Génération du QR code sécurisé...</p>}

        {!loading && qrCodeDataUrl && (
          <div className={styles.setup}>
            <div className={styles.qrBox}>
              <img src={qrCodeDataUrl} alt="QR code à scanner avec Google Authenticator" />
            </div>

            <div className={styles.steps}>
              <p>1. Ouvrez Google Authenticator.</p>
              <p>2. Appuyez sur “+”, puis scannez le QR code.</p>
              <p>3. Saisissez ci-dessous le code à 6 chiffres affiché dans l’application.</p>

              <div className={styles.manualKey}>
                Clé manuelle : <code>{manualKey}</code>
              </div>
            </div>
          </div>
        )}

        <div className={styles.confirm}>
          <Input
            label="Code Google Authenticator"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            inputMode="numeric"
            autoComplete="one-time-code"
            inputSize="lg"
          />
          <Button
            variant="primary"
            size="lg"
            onClick={confirm}
            loading={confirming}
            disabled={code.length !== 6 || loading}
            fullWidth
          >
            Activer et accéder à LIVO
          </Button>
        </div>

        {recoveryCodes.length > 0 && (
          <div className={styles.recovery}>
            <h2>Codes de secours</h2>
            <p>Conservez ces codes dans un endroit sûr. Ils ne seront affichés qu’une seule fois.</p>
            <div className={styles.recoveryGrid}>
              {recoveryCodes.map((recoveryCode) => (
                <code key={recoveryCode}>{recoveryCode}</code>
              ))}
            </div>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}
      </section>
    </main>
  )
}
