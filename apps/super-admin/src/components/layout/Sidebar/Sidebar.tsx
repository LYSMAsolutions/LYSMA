'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import styles from './Sidebar.module.css'

const NAV = [
  { href: '/dashboard', label: 'Tableau de bord', icon: '>' },
  { href: '/echo', label: 'ECHO', icon: 'E' },
  { href: '/clients', label: 'Clients', icon: 'C' },
  { href: '/messagerie', label: 'Messagerie', icon: '@' },
  { href: '/chatbox', label: 'Chatbox', icon: '?' },
  { href: '/erreurs', label: 'Erreurs', icon: '!' },
  { href: '/journal', label: 'Journal', icon: '~' },
  { href: '/acces', label: 'Acces', icon: '#' },
  { href: '/finance', label: 'Finance', icon: 'F' },
  { href: '/outils', label: 'Outils', icon: '*' },
  { href: '/pma', label: 'Portail PMA', icon: 'P' },
  { href: '/livo', label: 'LIVO', icon: 'L' },
  { href: '/sites', label: 'Sites', icon: 'S' },
  { href: '/corbeille', label: 'Corbeille', icon: 'R' },
  { href: '/root', label: 'Workspace', icon: '$' },
]

type Props = { messagesNonLus?: number; erreursOuvertes?: number }

export function Sidebar({ messagesNonLus = 0, erreursOuvertes = 0 }: Props) {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoSymbol}>L</span>
        <div className={styles.logoText}>
          <span className={styles.logoName}>LYSMA</span>
          <span className={styles.logoSub}>super-admin</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {NAV.map(({ href, label, icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')

          return (
            <Link
              key={href}
              href={href}
              className={`${styles.navItem} ${isActive ? styles.navActive : ''}`}
            >
              <span className={styles.navIcon} aria-hidden="true">{icon}</span>
              <span className={styles.navLabel}>{label}</span>
              {href === '/messagerie' && messagesNonLus > 0 && (
                <span className={styles.badge}>{messagesNonLus}</span>
              )}
              {href === '/erreurs' && erreursOuvertes > 0 && (
                <span className={styles.badge}>{erreursOuvertes}</span>
              )}
            </Link>
          )
        })}
      </nav>

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
          Deconnexion
        </button>
      </div>
    </aside>
  )
}
