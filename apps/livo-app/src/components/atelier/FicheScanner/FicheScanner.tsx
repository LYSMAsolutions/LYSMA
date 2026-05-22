'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MagnifyingGlass, Barcode, X, Check, Play } from '@phosphor-icons/react'
import { Badge } from '@/components/ui'
import styles from './FicheScanner.module.css'

type FicheTrouvee = {
  id: string
  numero: string
  statut: string
  travaux: string
  vehicule: string
  immat: string | null
  clientNom: string
  pointagesActifs: { compagnonId: string; compagnonNom: string; debutAt: string }[]
}

type Props = {
  compagnonId: string
  onPointer: (ficheId: string) => void
  onClose: () => void
}

const STATUT_BADGE: Record<string, { label: string; variant: 'blue'|'warning'|'success'|'muted'|'default' }> = {
  EN_ATTENTE: { label: 'En attente', variant: 'warning' },
  EN_COURS:   { label: 'En cours',   variant: 'blue' },
  EN_PAUSE:   { label: 'En pause',   variant: 'warning' },
  TERMINEE:   { label: 'Terminee',   variant: 'success' },
}

export function FicheScanner({ compagnonId, onPointer, onClose }: Props) {
  const [mode, setMode] = useState<'search' | 'scan'>('search')
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [fiche, setFiche] = useState<FicheTrouvee | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [scanActive, setScanActive] = useState(false)
  const [scanError, setScanError] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scannerControlsRef = useRef<{ stop: () => void } | null>(null)

  const searchFiche = useCallback(async (q: string) => {
    if (!q || q.length < 2) return
    setSearching(true)
    setNotFound(false)
    setFiche(null)
    try {
      const res = await fetch(`/api/atelier-auth/fiche-search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (data.fiche) {
        setFiche(data.fiche)
      } else {
        setNotFound(true)
      }
    } finally {
      setSearching(false)
    }
  }, [])

  const stopScan = useCallback(() => {
    scannerControlsRef.current?.stop()
    scannerControlsRef.current = null

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setScanActive(false)
  }, [])

  const startScan = useCallback(async () => {
    setScanError('')

    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      setScanError('La camera necessite une connexion HTTPS securisee.')
      return
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setScanError("La camera n'est pas disponible sur ce navigateur.")
      return
    }

    if (!videoRef.current) {
      setScanError('Initialisation camera en cours. Reessayez dans une seconde.')
      return
    }

    try {
      stopScan()
      setScanActive(true)

      const { BrowserMultiFormatOneDReader } = await import('@zxing/browser')
      const reader = new BrowserMultiFormatOneDReader(undefined, {
        delayBetweenScanAttempts: 250,
      })

      const controls = await reader.decodeFromConstraints(
        {
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        },
        videoRef.current,
        (result) => {
          if (!result) return

          const text = result.getText()
          stopScan()
          setMode('search')
          setQuery(text)
          searchFiche(text)
        },
      )

      scannerControlsRef.current = controls
      streamRef.current = videoRef.current.srcObject as MediaStream | null
    } catch (err) {
      stopScan()
      const name = err instanceof DOMException ? err.name : ''
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setScanError('Acces camera refuse. Autorisez la camera dans le navigateur.')
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setScanError('Aucune camera detectee sur cet appareil.')
      } else if (name === 'NotReadableError' || name === 'TrackStartError') {
        setScanError('Camera deja utilisee par une autre application.')
      } else {
        setScanError("Camera non disponible. Verifiez l'autorisation et le HTTPS.")
      }
    }
  }, [searchFiche, stopScan])

  useEffect(() => () => stopScan(), [stopScan])

  useEffect(() => {
    if (mode !== 'scan' || scanActive || scanError) return

    const timer = window.setTimeout(() => {
      startScan()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [mode, scanActive, scanError, startScan])

  const estDejaPointe = fiche?.pointagesActifs.some(p => p.compagnonId === compagnonId)
  const badge = fiche ? (STATUT_BADGE[fiche.statut] ?? { label: fiche.statut, variant: 'muted' as const }) : null

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <h2 className={styles.title}>Trouver une fiche</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === 'search' ? styles.tabActive : ''}`}
            onClick={() => { setMode('search'); stopScan() }}
          >
            <MagnifyingGlass size={16} /> Recherche manuelle
          </button>
          <button
            className={`${styles.tab} ${mode === 'scan' ? styles.tabActive : ''}`}
            onClick={() => setMode('scan')}
          >
            <Barcode size={16} /> Scanner code-barres
          </button>
        </div>

        <div className={styles.body}>

          {mode === 'search' && (
            <div className={styles.searchSection}>
              <div className={styles.searchRow}>
                <input
                  className={styles.searchInput}
                  value={query}
                  onChange={e => setQuery(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && searchFiche(query)}
                  placeholder="Ex: FT-2026-001"
                  autoFocus
                  inputMode="text"
                />
                <button
                  className={styles.searchBtn}
                  onClick={() => searchFiche(query)}
                  disabled={searching || query.length < 2}
                >
                  {searching ? '...' : <MagnifyingGlass weight="bold" size={18} />}
                </button>
              </div>
              <p className={styles.searchHint}>Tapez le numero de fiche ou d'OR puis appuyez sur Entree</p>
            </div>
          )}

          {mode === 'scan' && (
            <div className={styles.scanSection}>
              {scanError ? (
                <div className={styles.scanError}>
                  <p>{scanError}</p>
                  <button className={styles.scanRetry} onClick={startScan}>Reessayer</button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className={styles.scanVideo}
                    autoPlay
                    playsInline
                    muted
                  />
                  <div className={styles.scanOverlay}>
                    <div className={styles.scanFrame} />
                    <p className={styles.scanLabel}>Pointez vers le code-barres de la fiche</p>
                  </div>
                  {scanActive && (
                    <button className={styles.stopScanBtn} onClick={() => { stopScan(); setMode('search') }}>
                      <X size={14} /> Arreter le scan
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {notFound && (
            <div className={styles.notFound}>
              Aucune fiche trouvee pour "{query}"
            </div>
          )}

          {fiche && badge && (
            <div className={styles.ficheResult}>
              <div className={styles.ficheResultHeader}>
                <span className={styles.ficheNumero}>{fiche.numero}</span>
                <Badge variant={badge.variant} dot>{badge.label}</Badge>
              </div>
              <div className={styles.ficheResultInfo}>
                <span className={styles.ficheVehicule}>{fiche.vehicule}</span>
                {fiche.immat && <span className={styles.ficheImmat}>{fiche.immat}</span>}
                <span className={styles.ficheClient}>{fiche.clientNom}</span>
              </div>
              <div className={styles.ficheTravaux}>
                {fiche.travaux.split('\n').filter(Boolean).slice(0, 3).map((t, i) => (
                  <span key={i} className={styles.ficheTravailItem}>- {t}</span>
                ))}
              </div>
              {fiche.pointagesActifs.length > 0 && (
                <div className={styles.ficheEnCours}>
                  {fiche.pointagesActifs.map(p => (
                    <span key={p.compagnonId}>{p.compagnonNom.split(' ')[0]} travaille dessus</span>
                  ))}
                </div>
              )}

              {estDejaPointe ? (
                <div className={styles.dejaPointe}>
                  <Check weight="bold" size={14} /> Vous pointez deja sur cette fiche
                </div>
              ) : (
                <button
                  className={styles.pointerBtn}
                  onClick={() => { onPointer(fiche.id); onClose() }}
                >
                  <Play weight="fill" size={16} /> Pointer sur cette fiche
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
