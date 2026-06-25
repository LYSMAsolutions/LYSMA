'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlass } from '@phosphor-icons/react'
import styles from './GlobalSearch.module.css'

type SearchResult = {
  id: string
  type: 'page' | 'vehicule' | 'fiche' | 'compagnon'
  title: string
  subtitle: string
  href: string
}

const TYPE_LABEL: Record<SearchResult['type'], string> = {
  page: 'Page',
  vehicule: 'Véhicule',
  fiche: 'Fiche',
  compagnon: 'Compagnon',
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results ?? [])
      setActiveIndex(0)
    } catch {
      setResults([])
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => search(query), 200)
    return () => clearTimeout(t)
  }, [query, search])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => inputRef.current?.focus(), 50)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [])

  const go = useCallback((href: string) => {
    router.push(href as '/dashboard')
    setOpen(false)
    setQuery('')
    setResults([])
  }, [router])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && results[activeIndex]) go(results[activeIndex].href)
  }

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50) }}
        aria-label="Recherche (Ctrl+K)"
        title="Recherche globale (Ctrl+K)"
      >
        <MagnifyingGlass className={styles.triggerIcon} />
        <span className={styles.triggerLabel}>Recherche</span>
        <kbd className={styles.kbd}>Ctrl K</kbd>
      </button>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.inputRow}>
              <MagnifyingGlass className={styles.inputIcon} />
              <input
                ref={inputRef}
                className={styles.input}
                placeholder="Rechercher un véhicule, une fiche, un compagnon…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={onKey}
                autoComplete="off"
              />
              {query && (
                <button type="button" className={styles.clear} onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }}>✕</button>
              )}
            </div>

            {results.length > 0 && (
              <ul className={styles.results}>
                {results.map((r, i) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      className={`${styles.result} ${i === activeIndex ? styles.active : ''}`}
                      onClick={() => go(r.href)}
                      onMouseEnter={() => setActiveIndex(i)}
                    >
                      <span className={styles.resultType}>{TYPE_LABEL[r.type]}</span>
                      <span className={styles.resultTitle}>{r.title}</span>
                      <span className={styles.resultSub}>{r.subtitle}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {query.length >= 2 && results.length === 0 && (
              <p className={styles.empty}>Aucun résultat pour « {query} »</p>
            )}

            <div className={styles.footer}>
              <span><kbd>↑↓</kbd> naviguer</span>
              <span><kbd>↵</kbd> ouvrir</span>
              <span><kbd>Échap</kbd> fermer</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
