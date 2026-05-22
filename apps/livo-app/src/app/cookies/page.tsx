'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

const CONSENT_KEY = 'livo-cookie-consent'
const CONSENT_COOKIE = 'livo_cookie_consent'

function setConsent(value: 'accepted' | 'declined') {
  localStorage.setItem(CONSENT_KEY, value)
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=31536000; Path=/; SameSite=Lax`
  window.dispatchEvent(new Event('livo-cookie-consent-change'))
}

function readConsent() {
  if (typeof document === 'undefined') return null
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${CONSENT_COOKIE}=`))
    ?.split('=')[1]

  const stored = localStorage.getItem(CONSENT_KEY)
  if (!cookie && (stored === 'accepted' || stored === 'declined')) {
    document.cookie = `${CONSENT_COOKIE}=${stored}; Max-Age=31536000; Path=/; SameSite=Lax`
  }

  return cookie ?? stored
}

export default function CookiesPage() {
  const [consent, setConsentState] = useState<string | null>(null)

  useEffect(() => {
    setConsentState(readConsent())
  }, [])

  function accept() {
    setConsent('accepted')
    setConsentState('accepted')
  }

  function decline() {
    setConsent('declined')
    setConsentState('declined')
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <Link href="/" className={styles.back}>Retour accueil</Link>
        <span className={styles.kicker}>Cookies</span>
        <h1>Gestion du consentement cookies</h1>
        <p>
          LIVO-APP utilise des cookies necessaires pour creer un compte, securiser
          la session, rester connecte et proteger l acces a votre espace garage.
          Aucun cookie publicitaire n est utilise.
        </p>

        <div className={styles.status} data-state={consent === 'accepted' ? 'accepted' : 'blocked'}>
          <span>Statut actuel</span>
          <strong>{consent === 'accepted' ? 'Cookies acceptes' : 'Cookies non acceptes'}</strong>
        </div>

        <div className={styles.grid}>
          <article>
            <h2>Cookies necessaires</h2>
            <p>
              Ils permettent l authentification, la creation du compte, la securite
              de session et le fonctionnement normal de l application.
            </p>
          </article>
          <article>
            <h2>Cookies marketing</h2>
            <p>
              LIVO-APP n utilise pas de cookies publicitaires pour suivre vos
              visiteurs ou revendre des donnees.
            </p>
          </article>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.accept} onClick={accept}>
            Accepter les cookies
          </button>
          <button type="button" className={styles.decline} onClick={decline}>
            Refuser
          </button>
          <Link href="/inscription" className={styles.try}>
            Aller a l inscription
          </Link>
        </div>

        <p className={styles.note}>
          Si vous refusez les cookies, l ouverture de compte est bloquee car LIVO-APP
          ne peut pas creer et maintenir une session securisee.
        </p>
      </section>
    </main>
  )
}
