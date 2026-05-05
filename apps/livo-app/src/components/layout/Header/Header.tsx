'use client'

import { Bell, MagnifyingGlass } from '@phosphor-icons/react'
import styles from './Header.module.css'

type HeaderProps = {
  title: string
  description?: string
  action?: React.ReactNode
}

export function Header({ title, description, action }: HeaderProps) {
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
        <button className={styles.iconBtn} aria-label="Rechercher">
          <MagnifyingGlass weight="regular" />
        </button>
        <button className={styles.iconBtn} aria-label="Notifications">
          <Bell weight="regular" />
          <span className={styles.notifDot} aria-hidden />
        </button>
        {action && <div className={styles.action}>{action}</div>}
      </div>
    </header>
  )
}
