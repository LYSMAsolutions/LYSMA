'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { List } from '@phosphor-icons/react'
import { useCallback, useEffect, useRef, useState } from 'react'
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

const MOBILE_BREAKPOINT = '(max-width: 1024px)'
const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function PublicSiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  useEffect(() => {
    closeMenu()
  }, [pathname, closeMenu])

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT)
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (!event.matches) closeMenu()
    }

    mediaQuery.addEventListener('change', handleBreakpointChange)
    return () => mediaQuery.removeEventListener('change', handleBreakpointChange)
  }, [closeMenu])

  useEffect(() => {
    if (!isMenuOpen) return

    const drawer = drawerRef.current
    const previousOverflow = document.body.style.overflow
    const previousTouchAction = document.body.style.touchAction
    const focusFrame = window.requestAnimationFrame(() => {
      drawer?.querySelector<HTMLElement>('[data-mobile-close]')?.focus()
    })

    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        return
      }

      if (event.key !== 'Tab' || !drawer) return

      const focusableElements = Array.from(
        drawer.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS),
      ).filter((element) => element.getClientRects().length > 0)

      if (focusableElements.length === 0) {
        event.preventDefault()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction = previousTouchAction
      menuButtonRef.current?.focus()
    }
  }, [isMenuOpen, closeMenu])

  if (!PUBLIC_SITE_ROUTES.has(pathname)) return children

  return (
    <div className={styles.publicShell}>
      <div className={styles.desktopSidebar}>
        <PublicSidebar />
      </div>

      <header className={styles.mobileHeader}>
        <button
          ref={menuButtonRef}
          type="button"
          className={styles.mobileMenuButton}
          aria-label="Ouvrir le menu"
          aria-controls="livo-mobile-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(true)}
        >
          <List size={22} weight="bold" aria-hidden="true" />
        </button>

        <Link href="/" className={styles.mobileHeaderBrand} aria-label="Accueil LIVO">
          <Image src="/logo/livo-app-logo.png" alt="" width={30} height={30} priority />
          <span>LIVO</span>
        </Link>

        <span className={styles.mobileHeaderSpacer} aria-hidden="true" />
      </header>

      <div
        className={styles.mobileBackdrop}
        data-open={isMenuOpen || undefined}
        aria-hidden="true"
        onClick={closeMenu}
      />

      <div
        ref={drawerRef}
        id="livo-mobile-navigation"
        className={styles.mobileDrawer}
        data-open={isMenuOpen || undefined}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation LIVO"
        aria-hidden={isMenuOpen ? undefined : true}
        inert={isMenuOpen ? undefined : true}
      >
        <PublicSidebar mobile onNavigate={closeMenu} onRequestClose={closeMenu} />
      </div>

      <div className={styles.publicPage} aria-hidden={isMenuOpen || undefined}>
        {children}
      </div>
    </div>
  )
}
