'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShieldCheck, X } from '@phosphor-icons/react'
import styles from './AppShell.module.css'

const NOTICE_COOKIE = 'livo_connected_data_notice_v3'
const ONE_YEAR = 60 * 60 * 24 * 365

function getNoticeCookie() {
  return document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${NOTICE_COOKIE}=`))
    ?.split('=')[1]
}

function saveNoticeCookie() {
  document.cookie = `${NOTICE_COOKIE}=ack; Max-Age=${ONE_YEAR}; Path=/; SameSite=Lax`
}

export function ConnectedDataNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(getNoticeCookie() !== 'ack')
  }, [])

  function closeNotice() {
    saveNoticeCookie()
    setVisible(false)
  }

  if (!visible) return null

  return (
    <aside className={styles.privacyNotice} role="dialog" aria-label="Information confidentialité LIVO">
      <div className={styles.privacyNoticeIcon}>
        <ShieldCheck size={20} weight="duotone" aria-hidden />
      </div>
      <div className={styles.privacyNoticeText}>
        <strong>Information confidentialité V3</strong>
        <p>
          Les échanges avec la chatbox peuvent être enregistrés afin d'améliorer la qualité des réponses. Un identifiant anonyme peut être utilisé pour vous signaler, lors d'une prochaine visite, qu'une réponse à votre question a été améliorée. Cet identifiant ne permet pas de vous identifier personnellement et n'est pas utilisé à des fins publicitaires.
        </p>
        <div>
          <Link href="/politique-confidentialite">Confidentialité</Link>
          <Link href="/cookies">Cookies</Link>
        </div>
      </div>
      <button type="button" onClick={closeNotice} className={styles.privacyNoticeClose} aria-label="J'ai compris">
        <X size={16} weight="bold" aria-hidden />
      </button>
    </aside>
  )
}
