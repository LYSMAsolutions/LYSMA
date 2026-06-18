'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import styles from './page.module.css'

const navItems = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Pointage atelier', href: '#pointage-atelier' },
  { label: 'Temps vendu vs temps réel', href: '#temps-reel' },
  { label: 'Rentabilité atelier', href: '#rentabilite' },
  { label: 'Relevés mensuels', href: '#releves' },
  { label: 'Fonctionnement', href: '#fonctionnement' },
  { label: 'Tarifs', href: '#tarifs' },
  { label: 'FAQ', href: '#faq' },
]

export function PublicSidebar() {
  const sidebarRef = useRef<HTMLElement>(null)
  const [activeHref, setActiveHref] = useState('#accueil')

  useEffect(() => {
    let animationFrame = 0

    const updateActiveSection = () => {
      const activationLine = Math.max(150, window.innerHeight * 0.34)
      let nextActive = navItems[0].href
      let nearestSectionTop = Number.NEGATIVE_INFINITY

      navItems.forEach((item) => {
        const section = document.querySelector<HTMLElement>(item.href)
        const sectionTop = section?.getBoundingClientRect().top

        if (
          sectionTop !== undefined &&
          sectionTop <= activationLine &&
          sectionTop > nearestSectionTop
        ) {
          nextActive = item.href
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
  }, [])

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
        {navItems.map((item, index) => (
          <a
            key={item.href}
            href={item.href}
            aria-current={activeHref === item.href ? 'location' : undefined}
            onClick={() => setActiveHref(item.href)}
          >
            <span className={styles.navIndex}>{String(index + 1).padStart(2, '0')}</span>
            <span className={styles.navLabel}>{item.label}</span>
            <span className={styles.navDot} aria-hidden="true" />
          </a>
        ))}
      </nav>

      <div className={styles.sidebarActions}>
        <Link href="/connexion" className={styles.secondaryButton}>
          Connexion
        </Link>
        <Link href="/inscription" className={styles.primaryButton}>
          Essai gratuit
        </Link>
        <small className={styles.sidebarNote}>30 jours · Sans engagement</small>
      </div>
    </aside>
  )
}
