'use client'

import { SignOutButton } from '@/components/layout/SignOutButton/SignOutButton'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Gauge,
  Wrench,
  Users,
  Car,
  CalendarCheck,
  Gear,
  SignOut,
} from '@phosphor-icons/react'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { href: '/dashboard',   label: 'Tableau de bord', icon: Gauge },
  { href: '/atelier',     label: 'Atelier',          icon: Wrench },
  { href: '/compagnons',  label: 'Compagnons',       icon: Users },
  { href: '/vehicules',   label: 'Véhicules',        icon: Car },
  { href: '/rapports',    label: 'RH',               icon: CalendarCheck },
] as const

const BOTTOM_ITEMS = [
  { href: '/parametres', label: 'Paramètres', icon: Gear },
] as const

type SidebarProps = {
  garageNom: string
  userNom: string
  userEmail: string
  userInitiale: string
}

export function Sidebar({ garageNom, userNom, userEmail, userInitiale }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>

      {/* Logo */}
      <div className={styles.logo}>
        <img
          src="/logo/livo-app-logo.png"
          alt="LIVO"
          className={styles.logoImg}
        />
        <div className={cn(styles.logoText, styles.fadeItem)}>
          <span className={styles.logoName}>LIVO-APP</span>
          <span className={styles.logoSub}>Gestion atelier</span>
        </div>
      </div>

      <div className={cn(styles.logoBy, styles.fadeItem)}>BY LYSMA Solutions</div>

      {/* Garage actif */}
      <div className={styles.garageSelector}>
        <div className={styles.garageDot} />
        <span className={cn(styles.garageName, styles.fadeItem)}>Mon Garage</span>
      </div>

      {/* Nav principale */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(styles.navItem, isActive && styles.active)}
            >
              <Icon
                weight={isActive ? 'fill' : 'regular'}
                className={styles.navIcon}
              />
              <span className={cn(styles.navLabel, styles.fadeItem)}>{label}</span>
              {isActive && <span className={styles.activePill} aria-hidden />}
              <span className={styles.tooltip}>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Nav bas */}
      <div className={styles.bottomNav}>
        {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(styles.navItem, pathname === href && styles.active)}
          >
            <Icon className={styles.navIcon} />
            <span className={cn(styles.navLabel, styles.fadeItem)}>{label}</span>
            <span className={styles.tooltip}>{label}</span>
          </Link>
        ))}

        {/* User */}
        <div className={styles.userRow}>
          
          <div className={cn(styles.userInfo, styles.fadeItem)}>
            <span className={styles.userName}>{garageNom}</span>
            <span className={styles.userEmail}>{userEmail}</span>
          </div>
          <SignOutButton />
        </div>
      </div>

    </aside>
  )
}
