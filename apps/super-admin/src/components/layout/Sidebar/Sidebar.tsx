'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import styles from './Sidebar.module.css'

const NAV = [
  { href: '/dashboard', label: 'dashboard', icon: '>' },
  { href: '/clients', label: 'clients', icon: 'C' },
  { href: '/messagerie', label: 'messagerie', icon: '@' },
  { href: '/acces', label: 'acces', icon: '#' },
  { href: '/outils', label: 'outils', icon: '*' },
  { href: '/livo', label: 'livo-app', icon: 'L' },
  { href: '/sites', label: 'sites', icon: 'S' },
  { href: '/root', label: 'root', icon: '$' },
]

type Props = { messagesNonLus?: number }

export function Sidebar({ messagesNonLus = 0 }: Props) {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoSymbol}>L</span>
        <div className={styles.logoText}>
          <span className={styles.logoName}>LYSMA</span>
          <span className={styles.logoSub}>super-admin v1.0</span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>EXPLORER</div>
        <nav className={styles.nav}>
          {NAV.map(({ href, label, icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')

            return (
              <Link key={href} href={href} className={`${styles.navItem} ${isActive ? styles.navActive : ''}`}>
                <span className={styles.navIcon}>{icon}</span>
                <span className={styles.navLabel}>{label}</span>
                {href === '/messagerie' && messagesNonLus > 0 && (
                  <span className={styles.badge}>{messagesNonLus}</span>
                )}
                {isActive && <span className={styles.activeLine} />}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>OUTILS</div>
        <div className={styles.toolList}>
          <div className={styles.tool}>
            <span className={styles.toolDot} style={{ background: 'var(--green)' }} />
            <span className={styles.toolName}>livo-app</span>
            <span className={styles.toolStatus}>actif</span>
          </div>
          <div className={styles.tool}>
            <span className={styles.toolDot} style={{ background: 'var(--green)' }} />
            <span className={styles.toolName}>portail-pma</span>
            <span className={styles.toolStatus}>actif</span>
          </div>
          <div className={styles.tool}>
            <span className={styles.toolDot} style={{ background: 'var(--yellow)' }} />
            <span className={styles.toolName}>sites-vitrine</span>
            <span className={styles.toolStatus}>dev</span>
          </div>
        </div>
      </div>

      <div className={styles.spacer} />

      <div className={styles.footer}>
        <div className={styles.adminRow}>
          <span className={styles.adminIcon}>@</span>
          <div className={styles.adminInfo}>
            <span className={styles.adminName}>root</span>
            <span className={styles.adminEmail}>admin@lysmasolutions.fr</span>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={() => signOut({ callbackUrl: '/connexion' })}>
          $ logout
        </button>
      </div>
    </aside>
  )
}
