'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './CookieBanner.module.css'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('livo-cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('livo-cookie-consent', 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem('livo-cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className={styles.banner} role="dialog" aria-label="Consentement cookies">
      <div className={styles.content}>
        <div className={styles.text}>
          <strong className={styles.title}>Cookies & confidentialité</strong>
          <p className={styles.desc}>
            LIVO-APP utilise des cookies strictement nécessaires au fonctionnement de l'application
            (authentification, session). Ces cookies ne sont pas utilisés à des fins publicitaires.{' '}
            <Link href="/politique-confidentialite" className={styles.link}>
              En savoir plus
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
