import Link from 'next/link'
import styles from './page.module.css'

const links = [
  { href: '/finance', label: 'Dashboard' },
  { href: '/finance/revenus', label: 'Revenus' },
  { href: '/finance/charges', label: 'Charges' },
  { href: '/finance/sites', label: 'Sites vitrines' },
  { href: '/finance/urssaf', label: 'URSSAF' },
  { href: '/finance/rentabilite', label: 'Rentabilite' },
  { href: '/finance/exports', label: 'Exports' },
]

export function FinanceNav() {
  return (
    <nav className={styles.navTabs} aria-label="Navigation finance">
      {links.map((link) => (
        <Link key={link.href} href={link.href}>{link.label}</Link>
      ))}
    </nav>
  )
}

