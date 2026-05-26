'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './CookieBanner.module.css'

const CONSENT_KEY = 'livo-cookie-consent'
const CONSENT_COOKIE = 'livo_cookie_consent'

function getCookieConsent() {
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

function saveCookieConsent(value: 'accepted' | 'declined') {
  localStorage.setItem(CONSENT_KEY, value)
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=31536000; Path=/; SameSite=Lax`
  window.dispatchEvent(new Event('livo-cookie-consent-change'))
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function syncVisibility() {
      setVisible(!getCookieConsent())
    }

    syncVisibility()
    window.addEventListener('livo-cookie-consent-change', syncVisibility)
    return () => window.removeEventListener('livo-cookie-consent-change', syncVisibility)
  }, [])

  function accept() {
    saveCookieConsent('accepted')
    setVisible(false)
  }

  function decline() {
    saveCookieConsent('declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className={styles.banner} role="dialog" aria-label="Consentement cookies">
      <div className={styles.content}>
        <div className={styles.text}>
          <strong className={styles.title}>Cookies et confidentialité</strong>
          <p className={styles.desc}>
            LIVO-APP utilise des cookies strictement nécessaires au fonctionnement de
            l’application : création de compte, authentification et session sécurisée.
            Ces cookies ne sont pas utilisés à des fins publicitaires.{' '}
            <Link href="/cookies" className={styles.link}>
              Gérer mes choix
            </Link>
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.btnDecline} onClick={decline}>
            Refuser
          </button>
          <button className={styles.btnAccept} onClick={accept}>
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
