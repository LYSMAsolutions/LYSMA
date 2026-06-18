'use client'

import { usePathname } from 'next/navigation'
import { PublicSidebar } from './PublicSidebar'
import styles from './page.module.css'

const PUBLIC_SITE_ROUTES = new Set([
  '/',
  '/a-propos',
  '/api-qr-ordre-reparation-garage',
  '/conformite-temps-travail',
  '/cookies',
  '/demo',
  '/logiciel-pointage-garage-dordogne',
  '/politique-confidentialite',
])

export function PublicSiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (!PUBLIC_SITE_ROUTES.has(pathname)) return children

  return (
    <div className={styles.publicShell}>
      <PublicSidebar />
      <div className={styles.publicPage}>{children}</div>
    </div>
  )
}
