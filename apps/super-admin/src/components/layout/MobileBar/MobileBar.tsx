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
        <div className={styles.logoMark}>SA</div>
        <span className={styles.logoName}>LYSMA Admin</span>
      </div>
    </div>
  )
}
