'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Play, Stop, Coffee, ForkKnife, SignOut, ArrowRight, Wrench, Lock, Barcode } from '@phosphor-icons/react'
import { FicheScanner } from '@/components/atelier/FicheScanner/FicheScanner'
import { Badge } from '@/components/ui'
import styles from './AtelierDashboard.module.css'

type Statut = 'ABSENT' | 'EN_TRAVAIL' | 'PAUSE_CAFE' | 'PAUSE_DEJEUNER' | 'PARTI'
type StatutFiche = 'EN_ATTENTE' | 'EN_COURS' | 'EN_PAUSE' | 'TERMINEE'

type Compagnon = {
  id: string; prenom: string; nom: string; poste: string | null
  hasPin: boolean; statut: string; heureArrivee: string | null
}

type Fiche = {
  id: string; numero: string; statut: StatutFiche; travaux: string
  vehicule: string; immat: string | null; clientNom: string
  tempsReel: number | null
  pointagesActifs: { compagnonId: string; compagnonNom: string; debutAt: string }[]
}

type Props = {
  garage: { id: string; nom: string; statutJour: string }
  compagnons: Compagnon[]
  fiches: Fiche[]
  compagnonConnecteId: string | null
}

const STATUT_BADGE: Record<string, { label: string; variant: 'muted'|'success'|'warning'|'blue'|'error'|'default' }> = {
  ABSENT: { label: 'Absent', variant: 'muted' },
  EN_TRAVAIL: { label: 'En travail', variant: 'success' },
  PAUSE_CAFE: { label: 'Pause café', variant: 'warning' },
  PAUSE_DEJEUNER: { label: 'Pause déjeuner', variant: 'warning' },
  PARTI: { label: 'Parti', variant: 'muted' },
}

const FICHE_BADGE: Record<string, { label: string; variant: 'blue'|'success'|'warning'|'muted'|'default' }> = {
  EN_ATTENTE: { label: 'En attente', variant: 'warning' },
  EN_COURS: { label: 'En cours', variant: 'blue' },
  EN_PAUSE: { label: 'En pause', variant: 'warning' },
  TERMINEE: { label: 'Terminée', variant: 'success' },
}

function formatTime(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatDuree(debutIso: string) {
  const debut = new Date(debutIso)
  const now = new Date()
  const min = Math.floor((now.getTime() - debut.getTime()) / 60000)
  const h = Math.floor(min / 60); const m = min % 60
  return `${h}h${m.toString().padStart(2,'0')}`
}

// ── PIN Modal ────────────────────────────────────────────────
function PinModal({ compagnon, onSuccess, onClose }: { compagnon: Compagnon; onSuccess: (id: string) => void; onClose: () => void }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleDigit(d: string) {
    if (pin.length >= 4) return
    const np = pin + d
    setPin(np)
    if (np.length === 4) verify(np)
  }

  async function verify(p: string) {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/atelier-auth/compagnon-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compagnonId: compagnon.id, pin: p }),
      })
      const data = await res.json()
      if (res.ok) { onSuccess(compagnon.id) }
      else { setError(data.error); setPin('') }
    } finally { setLoading(false) }
  }

  const initials = `${compagnon.prenom[0]}${compagnon.nom[0]}`.toUpperCase()

  return (
    <div className={styles.pinOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.pinModal}>
        <button className={styles.pinBack} onClick={onClose}>← Retour</button>
        <div className={styles.pinAvatar}>{initials}</div>
        <p className={styles.pinName}>{compagnon.prenom} {compagnon.nom}</p>
        <p className={styles.pinLabel}>Entrez votre PIN</p>
        <div className={styles.pinDots}>
          {[0,1,2,3].map(i => <div key={i} className={`${styles.pinDot} ${pin.length > i ? styles.pinDotFilled : ''}`} />)}
        </div>
        {error && <p className={styles.pinError}>{error}</p>}
        <div className={styles.pinPad}>
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d, i) => (
            <button key={i} className={`${styles.pinKey} ${d === '' ? styles.pinKeyEmpty : ''}`}
              onClick={() => d === '⌫' ? setPin(p => p.slice(0,-1)) : d !== '' && handleDigit(d)}
              disabled={loading || d === ''}>
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AtelierDashboardClient({ garage, compagnons: compagnonsInit, fiches: fichesInit, compagnonConnecteId: initConnecte }: Props) {
  const router = useRouter()
  const [compagnonConnecteId, setCompagnonConnecteId] = useState(initConnecte)
  const [pinTarget, setPinTarget] = useState<Compagnon | null>(null)
  const [compagnons, setCompagnons] = useState(compagnonsInit)
  const [fiches, setFiches] = useState(fichesInit)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [scannerOpen, setScannerOpen] = useState(false)
  const [now, setNow] = useState(new Date())

  // Horloge temps réel
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const compagnonConnecte = compagnons.find(c => c.id === compagnonConnecteId)

  function handlePinSuccess(id: string) {
    setCompagnonConnecteId(id)
    setPinTarget(null)
  }

  async function actionPointage(action: string) {
    if (!compagnonConnecteId) return
    setLoadingAction(action)
    try {
      const res = await fetch('/api/pointage-jour/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compagnonId: compagnonConnecteId, action }),
      })
      const data = await res.json()
      if (data.success) {
        setCompagnons(prev => prev.map(c => c.id === compagnonConnecteId
          ? { ...c, statut: data.pointage.statutActuel, heureArrivee: data.pointage.heureArrivee }
          : c
        ))
      }
    } finally { setLoadingAction(null) }
  }

  async function actionFiche(ficheId: string, action: 'POINTER' | 'DEPOINTER') {
    if (!compagnonConnecteId) return
    setLoadingAction(ficheId)

    // Mise à jour optimiste immédiate
    setFiches(prev => prev.map(f => {
      if (f.id !== ficheId) return f
      if (action === 'POINTER') {
        return {
          ...f,
          statut: 'EN_COURS' as const,
          pointagesActifs: [
            ...f.pointagesActifs,
            { compagnonId: compagnonConnecteId, compagnonNom: 'Vous', debutAt: new Date().toISOString() }
          ]
        }
      } else {
        return {
          ...f,
          pointagesActifs: f.pointagesActifs.filter(p => p.compagnonId !== compagnonConnecteId)
        }
      }
    }))

    try {
      const res = await fetch('/api/pointage-fiche/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compagnonId: compagnonConnecteId, ficheId, action }),
      })
      if (!res.ok) {
        // Rollback si erreur
        router.refresh()
      } else {
        // Refresh silencieux pour sync
        router.refresh()
      }
    } catch {
      router.refresh()
    } finally {
      setLoadingAction(null)
    }
  }

  function deconnecter() {
    setCompagnonConnecteId(null)
    document.cookie = 'atelier-compagnon-id=; Max-Age=0; path=/'
  }

  const statut = compagnonConnecte?.statut ?? 'ABSENT'
  const badge = STATUT_BADGE[statut] ?? { label: statut, variant: 'muted' as const }
  const heureArrivee = formatTime(compagnonConnecte?.heureArrivee ?? null)
  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const heureStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={styles.page}>

      {/* ── Header ──────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.garageDot} />
          <span className={styles.garageNom}>{garage.nom}</span>
          <span className={styles.headerDate}>{dateStr}</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.horloge}>{heureStr}</span>
          {compagnonConnecte && (
            <button className={styles.deconnecterBtn} onClick={deconnecter}>
              <Lock size={14} /> Verrouiller
            </button>
          )}
        </div>
      </div>

      {/* ── Sélection compagnon (si non connecté) ───────── */}
      {!compagnonConnecteId && (
        <div className={styles.selectionWrap}>
          <h2 className={styles.selectionTitle}>Qui êtes-vous ?</h2>
          <div className={styles.compagnonsGrid}>
            {compagnons.map(c => {
              const b = STATUT_BADGE[c.statut] ?? { label: c.statut, variant: 'muted' as const }
              const initials = `${c.prenom[0]}${c.nom[0]}`.toUpperCase()
              return (
                <button key={c.id} className={styles.compagnonCard}
                  onClick={() => c.hasPin ? setPinTarget(c) : setCompagnonConnecteId(c.id)}>
                  <div className={styles.compagnonAvatar}>{initials}</div>
                  <span className={styles.compagnonNom}>{c.prenom}</span>
                  <span className={styles.compagnonPoste}>{c.poste ?? 'Mécanicien'}</span>
                  <Badge variant={b.variant} dot>{b.label}</Badge>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Dashboard compagnon connecté ────────────────── */}
      {compagnonConnecte && (
        <div className={styles.dashboard}>

          {/* Bloc compagnon + pointage journée */}
          <div className={styles.compagnonBlock}>
            <div className={styles.compagnonBlockLeft}>
              <div className={styles.compagnonAvatarLg}>
                {`${compagnonConnecte.prenom[0]}${compagnonConnecte.nom[0]}`.toUpperCase()}
              </div>
              <div>
                <div className={styles.compagnonNomLg}>{compagnonConnecte.prenom} {compagnonConnecte.nom}</div>
                <div className={styles.compagnonPosteLg}>{compagnonConnecte.poste ?? 'Mécanicien'}</div>
                {heureArrivee && <div className={styles.arriveeHeure}>Arrivée {heureArrivee}</div>}
              </div>
              <Badge variant={badge.variant} dot>{badge.label}</Badge>
            </div>

            <div className={styles.actionsJournee}>
              {statut === 'ABSENT' && (
                <button className={`${styles.actionBtn} ${styles.actionArrivee}`}
                  onClick={() => actionPointage('ARRIVEE')} disabled={!!loadingAction}>
                  <ArrowRight weight="bold" size={20} />
                  Arrivée atelier
                </button>
              )}
              {statut === 'EN_TRAVAIL' && (
                <>
                  <button className={`${styles.actionBtn} ${styles.actionPause}`}
                    onClick={() => actionPointage('PAUSE_CAFE_DEBUT')} disabled={!!loadingAction}>
                    <Coffee weight="fill" size={18} /> Pause café
                  </button>
                  <button className={`${styles.actionBtn} ${styles.actionPause}`}
                    onClick={() => actionPointage('PAUSE_DEJ_DEBUT')} disabled={!!loadingAction}>
                    <ForkKnife weight="fill" size={18} /> Pause déjeuner
                  </button>
                  <button className={`${styles.actionBtn} ${styles.actionDepart}`}
                    onClick={() => actionPointage('DEPART')} disabled={!!loadingAction}>
                    <SignOut weight="bold" size={18} /> Fin de journée
                  </button>
                </>
              )}
              {(statut === 'PAUSE_CAFE' || statut === 'PAUSE_DEJEUNER') && (
                <button className={`${styles.actionBtn} ${styles.actionReprise}`}
                  onClick={() => actionPointage(statut === 'PAUSE_CAFE' ? 'PAUSE_CAFE_FIN' : 'PAUSE_DEJ_FIN')}
                  disabled={!!loadingAction}>
                  <ArrowRight weight="bold" size={20} /> Reprendre
                </button>
              )}
              {statut === 'PARTI' && (
                <div className={styles.partiMsg}>Bonne journée !</div>
              )}
            </div>
          </div>

          {/* Fiches du jour */}
          <div className={styles.fichesSection}>
            <div className={styles.fichesTitleRow}>
              <h3 className={styles.fichesTitle}>
                <Wrench size={16} /> Fiches de travaux
                <span className={styles.fichesCount}>{fiches.length}</span>
              </h3>
              <button className={styles.scanBtn} onClick={() => setScannerOpen(true)}>
                <Barcode weight="bold" size={16} /> Rechercher / Scanner
              </button>
            </div>

            {fiches.length === 0 ? (
              <div className={styles.fichesEmpty}>Aucune fiche active</div>
            ) : (
              <div className={styles.fichesList}>
                {fiches.map(f => {
                  const estPointe = f.pointagesActifs.some(p => p.compagnonId === compagnonConnecteId)
                  const fb = FICHE_BADGE[f.statut] ?? { label: f.statut, variant: 'muted' as const }
                  const peutPointer = ['EN_ATTENTE', 'EN_COURS', 'TERMINEE'].includes(f.statut) && statut === 'EN_TRAVAIL'
                  const ptgMoi = f.pointagesActifs.find(p => p.compagnonId === compagnonConnecteId)
                  const lignes = f.travaux.split('\n').filter(Boolean)

                  return (
                    <div key={f.id} className={`${styles.ficheCard} ${estPointe ? styles.ficheActive : ''}`}>
                      <div className={styles.ficheCardHeader}>
                        <div className={styles.ficheCardLeft}>
                          <span className={styles.ficheNumero}>{f.numero}</span>
                          <Badge variant={fb.variant} dot>{fb.label}</Badge>
                        </div>
                        {peutPointer && (
                          <button
                            className={`${styles.ficheBtn} ${estPointe ? styles.ficheBtnStop : styles.ficheBtnStart}`}
                            onClick={() => actionFiche(f.id, estPointe ? 'DEPOINTER' : 'POINTER')}
                            disabled={!!loadingAction}
                          >
                            {loadingAction === f.id
                              ? '...'
                              : estPointe
                              ? <><Stop weight="fill" size={16} /> Dépointer</>
                              : <><Play weight="fill" size={16} /> Pointer</>
                            }
                          </button>
                        )}
                      </div>
                      <div className={styles.ficheVehicule}>
                        <span className={styles.ficheVehiculeNom}>{f.vehicule}</span>
                        {f.immat && <span className={styles.ficheImmat}>{f.immat}</span>}
                        <span className={styles.ficheClient}>{f.clientNom}</span>
                      </div>
                      <ul className={styles.ficheTravaux}>
                        {lignes.slice(0, 2).map((t, i) => <li key={i}>{t}</li>)}
                        {lignes.length > 2 && <li className={styles.ficheMore}>+{lignes.length - 2} autre{lignes.length - 2 > 1 ? 's' : ''}</li>}
                      </ul>
                      {estPointe && ptgMoi && (
                        <div className={styles.ficheEnCours}>
                          ⏱ En cours depuis {formatDuree(ptgMoi.debutAt)}
                        </div>
                      )}
                      {f.pointagesActifs.filter(p => p.compagnonId !== compagnonConnecteId).map(p => (
                        <div key={p.compagnonId} className={styles.ficheAutreCompagnon}>
                          {p.compagnonNom.split(' ')[0]} travaille dessus
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Scanner modal */}
      {scannerOpen && compagnonConnecteId && (
        <FicheScanner
          compagnonId={compagnonConnecteId}
          onPointer={(ficheId) => { actionFiche(ficheId, 'POINTER') }}
          onClose={() => setScannerOpen(false)}
        />
      )}

      {/* PIN Modal */}
      {pinTarget && (
        <PinModal compagnon={pinTarget} onSuccess={handlePinSuccess} onClose={() => setPinTarget(null)} />
      )}
    </div>
  )
}
