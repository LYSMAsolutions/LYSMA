'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  House,
  Robot,
  Buildings,
  Envelope,
  ChatCircle,
  Bug,
  ClockCounterClockwise,
  Key,
  CurrencyEur,
  Wrench,
  HeartStraight,
  Car,
  Globe,
  Trash,
  Terminal,
  SignOut,
  UserCircle,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import styles from './Sidebar.module.css'

type NavItem = {
  href: string
  label: string
  Icon: Icon
  badge?: 'messages' | 'erreurs'
}

const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', Icon: House },
  { href: '/echo', label: 'ECHO', Icon: Robot },
  { href: '/clients', label: 'Clients', Icon: Buildings },
  { href: '/messagerie', label: 'Messagerie', Icon: Envelope, badge: 'messages' },
  { href: '/chatbox', label: 'Chatbox', Icon: ChatCircle },
  { href: '/erreurs', label: 'Erreurs', Icon: Bug, badge: 'erreurs' },
  { href: '/journal', label: 'Journal', Icon: ClockCounterClockwise },
  { href: '/acces', label: 'Accès', Icon: Key },
  { href: '/finance', label: 'Finance', Icon: CurrencyEur },
  { href: '/outils', label: 'Outils', Icon: Wrench },
  { href: '/pma', label: 'Portail PMA', Icon: HeartStraight },
  { href: '/livo', label: 'LIVO', Icon: Car },
  { href: '/sites', label: 'Sites', Icon: Globe },
  { href: '/corbeille', label: 'Corbeille', Icon: Trash },
  { href: '/root', label: 'Workspace', Icon: Terminal },
]

type Props = {
  messagesNonLus?: number
  erreursOuvertes?: number
  userName?: string
  userEmail?: string
}

export function Sidebar({
  messagesNonLus = 0,
  erreursOuvertes = 0,
  userName = 'Admin',
  userEmail = '',
}: Props) {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoMark}>L</div>
        <div className={styles.logoText}>
          <span className={styles.logoName}>LYSMA</span>
          <span className={styles.logoSub}>super-admin</span>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV.map(({ href, label, Icon, badge }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          const badgeCount =
            badge === 'messages' ? messagesNonLus :
            badge === 'erreurs' ? erreursOuvertes : 0

          return (
            <Link
              key={href}
              href={href}
              className={`${styles.navItem} ${isActive ? styles.navActive : ''}`}
            >
              <Icon
                className={styles.navIcon}
                weight={isActive ? 'fill' : 'regular'}
                size={18}
              />
              <span className={styles.navLabel}>{label}</span>
              {badgeCount > 0 && (
                <span className={styles.badge}>{badgeCount}</span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className={styles.spacer} />

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.userRow}>
          <UserCircle size={32} className={styles.userIcon} weight="fill" />
          <div className={styles.userInfo}>
            <span className={styles.userName}>{userName}</span>
            {userEmail && <span className={styles.userEmail}>{userEmail}</span>}
          </div>
        </div>
        <button
          className={styles.logoutBtn}
          onClick={() => signOut({ callbackUrl: '/connexion' })}
        >
          <SignOut size={14} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
