'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MagnifyingGlass, Barcode, X, Check, Play } from '@phosphor-icons/react'
import { Badge } from '@/components/ui'
import styles from './FicheScanner.module.css'

type NativeBarcodeDetector = {
  detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue?: string }>>
}

type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => NativeBarcodeDetector

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
  TERMINEE:   { label: 'Terminée',   variant: 'success' },
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
  const lastScanRef = useRef('')
  const nativeScanActiveRef = useRef(false)

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
    nativeScanActiveRef.current = false
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

  const handleScanResult = useCallback((rawText: string) => {
    const text = rawText.trim().toUpperCase()
    if (!text || text === lastScanRef.current) return

    lastScanRef.current = text
    stopScan()
    setMode('search')
    setQuery(text)
    searchFiche(text)
  }, [searchFiche, stopScan])

  const startScan = useCallback(async () => {
    setScanError('')

    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      setScanError('La caméra nécessite une connexion HTTPS sécurisée.')
      return
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setScanError("La caméra n’est pas disponible sur ce navigateur.")
      return
    }

    if (!videoRef.current) {
      setScanError('Initialisation de la caméra en cours. Réessayez dans une seconde.')
      return
    }

    try {
      stopScan()
      setScanActive(true)

      const nativeDetectorClass = 'BarcodeDetector' in window
        ? (window as Window & { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector
        : undefined

      if (nativeDetectorClass) {
        const detector = new nativeDetectorClass({
          formats: ['code_128', 'code_39', 'code_93', 'qr_code'],
        })
        nativeScanActiveRef.current = true

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        })

        videoRef.current.srcObject = stream
        streamRef.current = stream
        await videoRef.current.play().catch(() => undefined)

        const scanNativeFrame = async () => {
          if (!nativeScanActiveRef.current || !videoRef.current) return
          try {
            const results = await detector.detect(videoRef.current)
            const value = results.find((item) => item.rawValue)?.rawValue
            if (value) {
              handleScanResult(value)
              return
            }
          } catch {
            // Some browsers expose BarcodeDetector but fail on video frames.
          }
          window.setTimeout(scanNativeFrame, 180)
        }

        scanNativeFrame()
        return
      }

      const { BarcodeFormat, BrowserMultiFormatReader } = await import('@zxing/browser')
      const reader = new BrowserMultiFormatReader(undefined, {
        delayBetweenScanAttempts: 160,
      })
      reader.possibleFormats = [
        BarcodeFormat.QR_CODE,
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        BarcodeFormat.CODE_93,
      ]

      const controls = await reader.decodeFromConstraints(
        {
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        },
        videoRef.current,
        (result) => {
          if (!result) return

          handleScanResult(result.getText())
        },
      )

      scannerControlsRef.current = controls
      streamRef.current = videoRef.current.srcObject as MediaStream | null
    } catch (err) {
      stopScan()
      const name = err instanceof DOMException ? err.name : ''
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setScanError('Accès caméra refusé. Autorisez la caméra dans le navigateur.')
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setScanError('Aucune caméra détectée sur cet appareil.')
      } else if (name === 'NotReadableError' || name === 'TrackStartError') {
        setScanError('Caméra déjà utilisée par une autre application.')
      } else {
        setScanError("Caméra non disponible. Vérifiez l’autorisation et le HTTPS.")
      }
    }
  }, [handleScanResult, stopScan])

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
            <Barcode size={16} /> Scanner QR fiche
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
              <p className={styles.searchHint}>Tapez le numéro de fiche ou d’OR puis appuyez sur Entrée</p>
            </div>
          )}

          {mode === 'scan' && (
            <div className={styles.scanSection}>
              {scanError ? (
                <div className={styles.scanError}>
                  <p>{scanError}</p>
                  <button className={styles.scanRetry} onClick={startScan}>Réessayer</button>
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
                    <p className={styles.scanLabel}>Cadrez le QR code SCAN ATELIER</p>
                  </div>
                  {scanActive && (
                    <button className={styles.stopScanBtn} onClick={() => { stopScan(); setMode('search') }}>
                      <X size={14} /> Arrêter le scan
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {notFound && (
            <div className={styles.notFound}>
              Aucune fiche trouvée pour "{query}"
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
                  <Check weight="bold" size={14} /> Vous pointez déjà sur cette fiche
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
