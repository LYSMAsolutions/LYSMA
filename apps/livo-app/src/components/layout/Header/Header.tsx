'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Bell, ChatCircleDots, MagnifyingGlass, X } from '@phosphor-icons/react'
import styles from './Header.module.css'

type HeaderProps = {
  title: string
  description?: string
  action?: React.ReactNode
}

export function Header({ title, description, action }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [supportMessage, setSupportMessage] = useState('')
  const [supportStatus, setSupportStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [results, setResults] = useState<
    { id: string; type: string; title: string; subtitle: string; href: string }[]
  >([])
  const [notifications, setNotifications] = useState<
    { id: string; title: string; createdAt: string; href: string }[]
  >([])
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function loadNotifications() {
      fetch('/api/notifications')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setNotifications(data?.notifications ?? []))
        .catch(() => setNotifications([]))
    }

    loadNotifications()
    const timer = setInterval(loadNotifications, 30000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!searchOpen) return
    searchRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.results ?? [])
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  async function sendSupportMessage() {
    const message = supportMessage.trim()
    if (message.length < 3) return

    setSupportStatus('sending')
    const res = await fetch('/api/support-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })

    if (!res.ok) {
      setSupportStatus('error')
      return
    }

    setSupportMessage('')
    setSupportStatus('sent')
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>{title}</h1>
          {description && (
            <p className={styles.description}>{description}</p>
          )}
        </div>
      </div>

      <div className={styles.right}>
        <button
          className={styles.iconBtn}
          aria-label="Rechercher"
          onClick={() => {
            setNotificationsOpen(false)
            setSupportOpen(false)
            setSearchOpen((open) => !open)
          }}
        >
          <MagnifyingGlass weight="regular" />
        </button>
        <button
          className={styles.iconBtn}
          aria-label="Notifications"
          onClick={() => {
            setSearchOpen(false)
            setSupportOpen(false)
            setNotificationsOpen((open) => !open)
            fetch('/api/notifications')
              .then((res) => (res.ok ? res.json() : null))
              .then((data) => setNotifications(data?.notifications ?? []))
              .catch(() => setNotifications([]))
          }}
        >
          <Bell weight="regular" />
          {notifications.length > 0 && <span className={styles.notifDot} aria-hidden />}
        </button>
        <button
          className={styles.iconBtn}
          aria-label="Contacter LYSMA"
          title="Contacter LYSMA"
          onClick={() => {
            setSearchOpen(false)
            setNotificationsOpen(false)
            setSupportOpen((open) => !open)
            setSupportStatus('idle')
          }}
        >
          <ChatCircleDots weight="regular" />
        </button>
        {action && <div className={styles.action}>{action}</div>}
      </div>

      {searchOpen && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un vehicule, une fiche, un compagnon..."
              className={styles.searchInput}
            />
            <button className={styles.closeBtn} onClick={() => setSearchOpen(false)}>
              <X />
            </button>
          </div>

          <div className={styles.panelList}>
            {query.trim().length < 2 && <p className={styles.empty}>Tape au moins 2 caracteres.</p>}
            {query.trim().length >= 2 && results.length === 0 && (
              <p className={styles.empty}>Aucun resultat.</p>
            )}
            {results.map((result) => (
              <Link key={`${result.type}-${result.id}`} href={result.href as any} className={styles.row}>
                <span className={styles.rowType}>{result.type}</span>
                <span className={styles.rowMain}>
                  <strong>{result.title}</strong>
                  <span>{result.subtitle}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {notificationsOpen && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <strong>Notifications</strong>
            <button className={styles.closeBtn} onClick={() => setNotificationsOpen(false)}>
              <X />
            </button>
          </div>

          <div className={styles.panelList}>
            {notifications.length === 0 && <p className={styles.empty}>Aucune notification recente.</p>}
            {notifications.map((notification) => (
              <Link key={notification.id} href={notification.href as any} className={styles.row}>
                <span className={styles.rowMain}>
                  <strong>{notification.title}</strong>
                  <span>
                    {new Date(notification.createdAt).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {supportOpen && (
        <div className={`${styles.panel} ${styles.supportPanel}`}>
          <div className={styles.panelHeader}>
            <strong>Message a LYSMA</strong>
            <button className={styles.closeBtn} onClick={() => setSupportOpen(false)}>
              <X />
            </button>
          </div>

          <div className={styles.supportBody}>
            <textarea
              value={supportMessage}
              onChange={(event) => {
                setSupportMessage(event.target.value)
                setSupportStatus('idle')
              }}
              className={styles.supportTextarea}
              placeholder="Besoin d'aide, question, bug, demande d'evolution..."
              rows={5}
            />
            <div className={styles.supportFooter}>
              <span className={styles.supportState}>
                {supportStatus === 'sent' && 'Message envoye.'}
                {supportStatus === 'error' && 'Envoi impossible pour le moment.'}
              </span>
              <button
                className={styles.supportSend}
                onClick={sendSupportMessage}
                disabled={supportStatus === 'sending' || supportMessage.trim().length < 3}
              >
                {supportStatus === 'sending' ? 'Envoi...' : 'Envoyer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
