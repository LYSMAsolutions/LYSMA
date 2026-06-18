'use client'

import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  CaretDown,
  CreditCard,
  House,
  Question,
  QrCode,
  SignIn,
  Sparkle,
  SquaresFour,
} from '@phosphor-icons/react'
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import styles from './page.module.css'

type NavChild = {
  label: string
  href: string
}

type NavGroup = {
  id: 'produit' | 'or-externes' | 'ressources'
  label: string
  icon: typeof SquaresFour
  children: NavChild[]
}

const navGroups: NavGroup[] = [
  {
    id: 'produit',
    label: 'Produit',
    icon: SquaresFour,
    children: [
      { label: 'Fonctionnalités', href: '/#fonctionnalites' },
      { label: 'Fonctionnement', href: '/#fonctionnement' },
      { label: 'Pilotage', href: '/#pilotage' },
      { label: 'Périmètre', href: '/#perimetre' },
    ],
  },
  {
    id: 'or-externes',
    label: 'OR externes',
    icon: QrCode,
    children: [
      { label: 'Vue d’ensemble', href: '/#or-externes' },
      { label: 'API & QR code OR', href: '/api-qr-ordre-reparation-garage' },
    ],
  },
  {
    id: 'ressources',
    label: 'Ressources',
    icon: BookOpen,
    children: [
      { label: 'Démonstration', href: '/demo' },
      { label: 'À propos', href: '/a-propos' },
      { label: 'Temps de travail', href: '/conformite-temps-travail' },
      { label: 'LIVO en Dordogne', href: '/logiciel-pointage-garage-dordogne' },
      { label: 'Confidentialité', href: '/politique-confidentialite' },
      { label: 'Cookies', href: '/cookies' },
    ],
  },
]

const directItems = [
  { label: 'Tarifs', href: '/#tarifs', icon: CreditCard },
  { label: 'FAQ', href: '/#faq', icon: Question },
]

const sectionHrefs = [
  '#accueil',
  '#fonctionnalites',
  '#fonctionnement',
  '#pilotage',
  '#or-externes',
  '#perimetre',
  '#tarifs',
  '#faq',
]

function hrefParts(href: string) {
  const [path, hash] = href.split('#')
  return { path: path || '/', hash: hash ? `#${hash}` : null }
}

export function PublicSidebar() {
  const sidebarRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const [activeHref, setActiveHref] = useState('#accueil')

  const isHrefActive = (href: string) => {
    const { path, hash } = hrefParts(href)

    if (hash) return pathname === path && activeHref === hash
    return pathname === path
  }

  useEffect(() => {
    if (pathname !== '/') return

    let animationFrame = 0

    const updateActiveSection = () => {
      const activationLine = Math.max(150, window.innerHeight * 0.34)
      let nextActive = sectionHrefs[0]
      let nearestSectionTop = Number.NEGATIVE_INFINITY

      sectionHrefs.forEach((href) => {
        const section = document.querySelector<HTMLElement>(href)
        const sectionTop = section?.getBoundingClientRect().top

        if (
          sectionTop !== undefined &&
          sectionTop <= activationLine &&
          sectionTop > nearestSectionTop
        ) {
          nextActive = href
          nearestSectionTop = sectionTop
        }
      })

      setActiveHref((current) => (current === nextActive ? current : nextActive))
    }

    const handleScroll = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(updateActiveSection)
    }

    updateActiveSection()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [pathname])

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const sidebar = sidebarRef.current

    if (!sidebar || event.pointerType === 'touch') return

    const bounds = sidebar.getBoundingClientRect()
    sidebar.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`)
    sidebar.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`)
    sidebar.style.setProperty('--pointer-opacity', '1')
  }

  const handlePointerLeave = () => {
    sidebarRef.current?.style.setProperty('--pointer-opacity', '0')
  }

  return (
    <aside
      ref={sidebarRef}
      className={styles.sidebar}
      aria-label="Navigation LIVO"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Link href="/" className={styles.brand} aria-label="Accueil LIVO">
        <span className={styles.brandMark}>
          <Image src="/logo/livo-app-logo.png" alt="" width={42} height={42} priority />
        </span>
        <span className={styles.brandCopy}>
          <strong>LIVO</strong>
          <small>Pointage atelier</small>
        </span>
      </Link>

      <div className={styles.navHeading}>
        <span>Découvrir LIVO</span>
        <span className={styles.navHeadingLine} />
      </div>

      <nav className={styles.nav} aria-label="Navigation principale">
        <Link
          href="/"
          className={styles.navItem}
          title="Accueil"
          aria-current={pathname === '/' && activeHref === '#accueil' ? 'page' : undefined}
          onClick={() => setActiveHref('#accueil')}
        >
          <span className={styles.navIcon} aria-hidden="true">
            <House size={19} weight="duotone" />
          </span>
          <span className={styles.navLabel}>Accueil</span>
          <span className={styles.navDot} aria-hidden="true" />
        </Link>

        {navGroups.map((group) => {
          const Icon = group.icon
          const isGroupActive = group.children.some((item) => isHrefActive(item.href))

          return (
            <details key={group.id} className={styles.navGroup} open={isGroupActive || undefined}>
              <summary
                className={styles.navItem}
                title={group.label}
                data-active={isGroupActive || undefined}
              >
                <span className={styles.navIcon} aria-hidden="true">
                  <Icon size={19} weight="duotone" />
                </span>
                <span className={styles.navLabel}>{group.label}</span>
                <CaretDown className={styles.navCaret} size={14} aria-hidden="true" />
              </summary>

              <div className={styles.subNav}>
                {group.children.map((item) => {
                  const active = isHrefActive(item.href)
                  const { hash } = hrefParts(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href as Route}
                      className={styles.subNavItem}
                      aria-current={active ? (hash ? 'location' : 'page') : undefined}
                      onClick={() => hash && setActiveHref(hash)}
                    >
                      <span aria-hidden="true" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </details>
          )
        })}

        {directItems.map((item) => {
          const Icon = item.icon
          const active = isHrefActive(item.href)
          const { hash } = hrefParts(item.href)

          return (
            <Link
              key={item.href}
              href={item.href as Route}
              className={styles.navItem}
              title={item.label}
              aria-current={active ? 'location' : undefined}
              onClick={() => hash && setActiveHref(hash)}
            >
              <span className={styles.navIcon} aria-hidden="true">
                <Icon size={19} weight="duotone" />
              </span>
              <span className={styles.navLabel}>{item.label}</span>
              <span className={styles.navDot} aria-hidden="true" />
            </Link>
          )
        })}
      </nav>

      <div className={styles.sidebarActions}>
        <Link
          href="/connexion"
          className={`${styles.secondaryButton} ${styles.sidebarButton}`}
          title="Connexion"
        >
          <SignIn
            className={styles.sidebarButtonIcon}
            size={20}
            weight="duotone"
            aria-hidden="true"
          />
          <span className={styles.sidebarButtonLabel}>Connexion</span>
        </Link>
        <Link
          href="/inscription"
          className={`${styles.primaryButton} ${styles.sidebarButton}`}
          title="Essai gratuit"
        >
          <Sparkle
            className={styles.sidebarButtonIcon}
            size={20}
            weight="duotone"
            aria-hidden="true"
          />
          <span className={styles.sidebarButtonLabel}>Essai gratuit</span>
        </Link>
        <small className={styles.sidebarNote}>30 jours · Sans engagement</small>
      </div>
    </aside>
  )
}
