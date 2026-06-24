'use client'

import { useMobileMenu } from '../MobileMenuContext'
import styles from './MobileBar.module.css'

export function MobileBar() {
  const { toggle } = useMobileMenu()
  return (
    <div className={styles.bar}>
      <button className={styles.hamburger} onClick={toggle} aria-label="Menu">
        <span />
        <span />
        <span />
      </button>
      <div className={styles.logo}>
        <img src="/logo/livo-app-logo.png" alt="LIVO" className={styles.logoImg} />
        <span className={styles.logoName}>LIVO</span>
      </div>
    </div>
  )
}
