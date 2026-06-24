'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { signOut } from 'next-auth/react'
import {
  House,
  Users,
  Globe,
  Car,
  Robot,
  ChatCircle,
  HeartStraight,
  Envelope,
  Bug,
  ClockCounterClockwise,
  CurrencyEur,
  ChartPie,
  TrendUp,
  TrendDown,
  Percent,
  Bank,
  Export,
  Gear,
  Key,
  Wrench,
  Terminal,
  Trash,
  IdentificationCard,
  Cube,
  Pulse,
  SignOut,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import styles from './Sidebar.module.css'

type NavItem = {
  href: string
  label: string
  Icon: Icon
  badge?: 'messages' | 'erreurs'
}

type NavGroup = {
  section: string
  Icon: Icon
  items: NavItem[]
}

type NavEntry = NavItem | NavGroup

function isGroup(entry: NavEntry): entry is NavGroup {
  return 'section' in entry
}

const NAV: NavEntry[] = [
  { href: '/dashboard', label: 'Dashboard', Icon: House },
  {
    section: 'Clients',
    Icon: Users,
    items: [
      { href: '/clients', label: 'Tous les clients', Icon: IdentificationCard },
      { href: '/sites', label: 'Sites vitrine', Icon: Globe },
      { href: '/livo', label: 'LIVO Garages', Icon: Car },
    ],
  },
  {
    section: 'Produits',
    Icon: Cube,
    items: [
      { href: '/echo', label: 'ECHO', Icon: Robot },
      { href: '/chatbox', label: 'Chatbox', Icon: ChatCircle },
      { href: '/pma', label: 'Portail PMA', Icon: HeartStraight },
    ],
  },
  {
    section: 'Opérations',
    Icon: Pulse,
    items: [
      { href: '/messagerie', label: 'Messagerie', Icon: Envelope, badge: 'messages' },
      { href: '/erreurs', label: 'Erreurs', Icon: Bug, badge: 'erreurs' },
      { href: '/journal', label: 'Journal', Icon: ClockCounterClockwise },
    ],
  },
  {
    section: 'Finance',
    Icon: CurrencyEur,
    items: [
      { href: '/finance', label: "Vue d'ensemble", Icon: ChartPie },
      { href: '/finance/revenus', label: 'Revenus', Icon: TrendUp },
      { href: '/finance/charges', label: 'Charges', Icon: TrendDown },
      { href: '/finance/rentabilite', label: 'Rentabilité', Icon: Percent },
      { href: '/finance/sites', label: 'Sites vitrine', Icon: Globe },
      { href: '/finance/urssaf', label: 'URSSAF', Icon: Bank },
      { href: '/finance/exports', label: 'Exports', Icon: Export },
    ],
  },
  {
    section: 'Admin',
    Icon: Gear,
    items: [
      { href: '/acces', label: 'Accès & Clés', Icon: Key },
      { href: '/outils', label: 'Outils', Icon: Wrench },
      { href: '/root', label: 'Workspace', Icon: Terminal },
      { href: '/corbeille', label: 'Corbeille', Icon: Trash },
    ],
  },
]

type Props = {
  userName: string
  userEmail: string
  messagesNonLus?: number
  erreursOuvertes?: number
}

export function Sidebar({ userName, userEmail, messagesNonLus = 0, erreursOuvertes = 0 }: Props) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  function getBadgeCount(badge?: 'messages' | 'erreurs') {
    if (badge === 'messages') return messagesNonLus
    if (badge === 'erreurs') return erreursOuvertes
    return 0
  }

  return (
    <aside
      className={styles.sidebar}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      data-open={isOpen}
    >
      <div className={styles.logo}>
        <div className={styles.logoMark}>SA</div>
        <div className={`${styles.logoText} ${styles.fadeItem}`}>
          <span className={styles.logoName}>LYSMA Admin</span>
          <span className={styles.logoSub}>Super Administration</span>
        </div>
      </div>

      <div className={`${styles.logoBy} ${styles.fadeItem}`}>BY LYSMA Solutions</div>

      <nav className={styles.nav}>
        {NAV.map((entry, index) => {
          if (!isGroup(entry)) {
            const active = isActive(entry.href)
            return (
              <Link
                key={entry.href}
                href={entry.href}
                className={`${styles.navItem} ${active ? styles.active : ''}`}
              >
                <entry.Icon
                  weight={active ? 'fill' : 'regular'}
                  className={styles.navIcon}
                />
                <span className={`${styles.navLabel} ${styles.fadeItem}`}>{entry.label}</span>
                {active && <span className={styles.activePill} aria-hidden />}
                <span className={styles.tooltip}>{entry.label}</span>
              </Link>
            )
          }

          return (
            <div key={entry.section} className={styles.group}>
              {index > 0 && <div className={styles.separator} />}
              <div className={`${styles.sectionHeader} ${styles.fadeItem}`}>
                {entry.section.toUpperCase()}
              </div>
              {entry.items.map((item) => {
                const active = isActive(item.href)
                const badgeCount = getBadgeCount(item.badge)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navItem} ${styles.subItem} ${active ? styles.active : ''}`}
                  >
                    <item.Icon
                      weight={active ? 'fill' : 'regular'}
                      className={styles.navIcon}
                    />
                    <span className={`${styles.navLabel} ${styles.fadeItem}`}>{item.label}</span>
                    {badgeCount > 0 && (
                      <span className={`${styles.badge} ${styles.fadeItem}`}>{badgeCount}</span>
                    )}
                    {active && <span className={styles.activePill} aria-hidden />}
                    <span className={styles.tooltip}>{entry.section} › {item.label}</span>
                  </Link>
                )
              })}
            </div>
          )
        })}
      </nav>

      <div style={{ flex: 1 }} />

      <div className={styles.bottomNav}>
        <div className={styles.userRow}>
          <div className={`${styles.userInfo} ${styles.fadeItem}`}>
            <span className={styles.userName}>{userName}</span>
            <span className={styles.userEmail}>{userEmail}</span>
          </div>
        </div>
        <button
          className={styles.logoutBtn}
          onClick={() => signOut({ callbackUrl: '/connexion' })}
        >
          <SignOut size={14} weight="bold" />
          <span className={`${styles.logoutLabel} ${styles.fadeItem}`}>Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}
