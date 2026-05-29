'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Play, Stop, Coffee, ForkKnife, SignOut, ArrowRight, Wrench, Lock, Barcode, ClipboardText } from '@phosphor-icons/react'
import { FicheScanner } from '@/components/atelier/FicheScanner/FicheScanner'
import { Badge } from '@/components/ui'
import styles from './AtelierDashboard.module.css'

type Statut = 'ABSENT' | 'EN_TRAVAIL' | 'PAUSE_CAFE' | 'PAUSE_DEJEUNER' | 'PARTI'
type StatutFiche = 'EN_ATTENTE' | 'EN_COURS' | 'EN_PAUSE' | 'TERMINEE' | 'CLOTUREE' | 'ANNULEE'

type Compagnon = {
  id: string
  prenom: string
  nom: string
  poste: string | null
  hasPin: boolean
  statut: string
  heureArrivee: string | null
}

type Fiche = {
  id: string
  numero: string
  statut: StatutFiche
  travaux: string
  vehicule: string
  immat: string | null
  clientNom: string
  tempsReel: number | null
  pointagesActifs: { compagnonId: string; compagnonNom: string; debutAt: string }[]
}

type ExternalMirror = {
  id: string
  externalNumber: string
  sourceSoftware: string | null
  clientName: string | null
  vehicleLabel: string | null
  immatriculation: string | null
  operation: string | null
  status: string
  soldHours: number | null
  realMinutes: number
  activePointage: { id: string; debutAt: string } | null
}

type Props = {
  garage: { id: string; nom: string; statutJour: string }
  compagnons: Compagnon[]
  fiches: Fiche[]
  compagnonConnecteId: string | null
}

const STATUT_BADGE: Record<string, { label: string; variant: 'muted' | 'success' | 'warning' | 'blue' | 'error' | 'default' }> = {
  ABSENT: { label: 'Absent', variant: 'muted' },
  EN_TRAVAIL: { label: 'En travail', variant: 'success' },
  PAUSE_CAFE: { label: 'Pause café', variant: 'warning' },
  PAUSE_DEJEUNER: { label: 'Pause déjeuner', variant: 'warning' },
  PARTI: { label: 'Parti', variant: 'muted' },
}

const FICHE_BADGE: Record<string, { label: string; variant: 'blue' | 'success' | 'warning' | 'muted' | 'default' }> = {
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
  const min = Math.max(0, Math.floor((now.getTime() - debut.getTime()) / 60000))
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h}h${m.toString().padStart(2, '0')}`
}

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h} h ${String(m).padStart(2, '0')}`
}

function PinModal({ compagnon, onSuccess, onClose }: { compagnon: Compagnon; onSuccess: (id: string) => void; onClose: () => void }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleDigit(d: string) {
    if (pin.length >= 4) return
    const nextPin = pin + d
    setPin(nextPin)
    if (nextPin.length === 4) verify(nextPin)
  }

  async function verify(value: string) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/atelier-auth/compagnon-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compagnonId: compagnon.id, pin: value }),
      })
      const data = await res.json()
      if (res.ok) onSuccess(compagnon.id)
      else {
        setError(data.error)
        setPin('')
      }
    } finally {
      setLoading(false)
    }
  }

  const initials = `${compagnon.prenom[0]}${compagnon.nom[0]}`.toUpperCase()

  return (
    <div className={styles.pinOverlay} onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className={styles.pinModal}>
        <button className={styles.pinBack} onClick={onClose}>← Retour</button>
        <div className={styles.pinAvatar}>{initials}</div>
        <p className={styles.pinName}>{compagnon.prenom} {compagnon.nom}</p>
        <p className={styles.pinLabel}>Entrez votre PIN</p>
        <div className={styles.pinDots}>
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className={`${styles.pinDot} ${pin.length > index ? styles.pinDotFilled : ''}`} />
          ))}
        </div>
        {error && <p className={styles.pinError}>{error}</p>}
        <div className={styles.pinPad}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((digit, index) => (
            <button
              key={index}
              className={`${styles.pinKey} ${digit === '' ? styles.pinKeyEmpty : ''}`}
              onClick={() => (digit === '⌫' ? setPin((value) => value.slice(0, -1)) : digit !== '' && handleDigit(digit))}
              disabled={loading || digit === ''}
            >
              {digit}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ExternalMirrorModal({
  compagnonId,
  canPoint,
  onClose,
}: {
  compagnonId: string
  canPoint: boolean
  onClose: () => void
}) {
  const [externalNumber, setExternalNumber] = useState('')
  const [order, setOrder] = useState<ExternalMirror | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState('')

  async function findOrCreate() {
    setError('')
    if (!externalNumber.trim()) {
      setError('Saisissez ou scannez un numéro OR.')
      return
    }

    setLoading('search')
    try {
      const res = await fetch('/api/or-externes/mirror', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compagnonId, externalNumber }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(typeof data?.error === 'string' ? data.error : 'Impossible de récupérer cette fiche miroir.')
        return
      }
      setOrder(data.order)
    } catch {
      setError('Connexion impossible. Réessayez dans un instant.')
    } finally {
      setLoading('')
    }
  }

  async function actionPointage(action: 'POINTER' | 'DEPOINTER') {
    if (!order) return
    setError('')
    setLoading(action)
    try {
      const res = await fetch(`/api/or-externes/${order.id}/pointage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compagnonId, action }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(typeof data?.error === 'string' ? data.error : 'Action impossible.')
        return
      }
      await findOrCreate()
    } catch {
      setError('Connexion impossible. Réessayez dans un instant.')
    } finally {
      setLoading('')
    }
  }

  return (
    <div className={styles.confirmOverlay} onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className={styles.externalModal} role="dialog" aria-modal="true" aria-labelledby="external-or-title">
        <div className={styles.externalHeader}>
          <div>
            <h2 id="external-or-title">OR externe</h2>
            <p>Scannez le QR code de l’OR ou saisissez uniquement son numéro.</p>
          </div>
          <button type="button" onClick={onClose}>Fermer</button>
        </div>

        <div className={styles.externalLookup}>
          <input
            value={externalNumber}
            onChange={(event) => setExternalNumber(event.target.value)}
            placeholder="Numéro OR externe"
            autoFocus
          />
          <button type="button" onClick={findOrCreate} disabled={loading === 'search'}>
            {loading === 'search' ? 'Recherche...' : 'Utiliser cet OR'}
          </button>
        </div>

        <p className={styles.externalHint}>
          La fiche miroir est créée automatiquement si elle n’existe pas encore. Aucune fiche complète n’est demandée au compagnon.
        </p>

        {error && <p className={styles.pointageError}>{error}</p>}

        {order && (
          <div className={styles.externalCard}>
            <div className={styles.externalCardTitle}>
              <strong>{order.externalNumber}</strong>
              <Badge variant={order.activePointage ? 'blue' : 'muted'} dot>
                {order.activePointage ? 'Pointage en cours' : 'Prêt à pointer'}
              </Badge>
            </div>
            <p>{order.vehicleLabel || 'Véhicule non renseigné'}{order.immatriculation ? ` · ${order.immatriculation}` : ''}</p>
            <small>{order.clientName || 'Client non renseigné'} · {order.operation || 'Fiche miroir LIVO'}</small>
            <div className={styles.externalStats}>
              <span><small>Temps réel</small><strong>{formatMinutes(order.realMinutes)}</strong></span>
              <span><small>Temps vendu</small><strong>{order.soldHours ? `${order.soldHours} h` : 'À compléter'}</strong></span>
            </div>

            {canPoint ? (
              <button
                type="button"
                className={`${styles.ficheBtn} ${order.activePointage ? styles.ficheBtnStop : styles.ficheBtnStart}`}
                onClick={() => actionPointage(order.activePointage ? 'DEPOINTER' : 'POINTER')}
                disabled={Boolean(loading)}
              >
                {order.activePointage ? <><Stop weight="fill" size={16} /> Dépointer</> : <><Play weight="fill" size={16} /> Pointer</>}
              </button>
            ) : (
              <p className={styles.externalHint}>Vous devez être en travail pour pointer sur un OR externe.</p>
            )}
          </div>
        )}
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
  const [externalOpen, setExternalOpen] = useState(false)
  const [confirmDepartOpen, setConfirmDepartOpen] = useState(false)
  const [pointageError, setPointageError] = useState('')
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  const compagnonConnecte = compagnons.find((compagnon) => compagnon.id === compagnonConnecteId)

  function handlePinSuccess(id: string) {
    setCompagnonConnecteId(id)
    setPinTarget(null)
  }

  async function actionPointage(action: string, options?: { confirmerFinJournee?: boolean }) {
    if (!compagnonConnecteId) return false
    setLoadingAction(action)
    setPointageError('')
    try {
      const res = await fetch('/api/pointage-jour/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compagnonId: compagnonConnecteId, action, ...options }),
      })
      const data = await res.json()
      if (data.success) {
        setCompagnons((previous) =>
          previous.map((compagnon) =>
            compagnon.id === compagnonConnecteId
              ? { ...compagnon, statut: data.pointage.statutActuel, heureArrivee: data.pointage.heureArrivee }
              : compagnon
          )
        )
        return true
      }
      setPointageError(data.error ?? 'Action impossible pour le moment.')
      return false
    } catch {
      setPointageError('Connexion impossible. Réessayez dans un instant.')
      return false
    } finally {
      setLoadingAction(null)
    }
  }

  async function confirmerFinJournee() {
    const success = await actionPointage('DEPART', { confirmerFinJournee: true })
    if (success) setConfirmDepartOpen(false)
  }

  async function actionFiche(ficheId: string, action: 'POINTER' | 'DEPOINTER') {
    if (!compagnonConnecteId) return
    setLoadingAction(ficheId)

    setFiches((previous) =>
      previous.map((fiche) => {
        if (fiche.id !== ficheId) return fiche
        if (action === 'POINTER') {
          return {
            ...fiche,
            statut: 'EN_COURS' as const,
            pointagesActifs: [
              ...fiche.pointagesActifs,
              { compagnonId: compagnonConnecteId, compagnonNom: 'Vous', debutAt: new Date().toISOString() },
            ],
          }
        }
        return {
          ...fiche,
          pointagesActifs: fiche.pointagesActifs.filter((pointage) => pointage.compagnonId !== compagnonConnecteId),
        }
      })
    )

    try {
      const res = await fetch('/api/pointage-fiche/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compagnonId: compagnonConnecteId, ficheId, action }),
      })
      if (!res.ok) router.refresh()
      else router.refresh()
    } catch {
      router.refresh()
    } finally {
      setLoadingAction(null)
    }
  }

  async function deconnecter() {
    await fetch('/api/atelier-auth/compagnon-pin', { method: 'DELETE' })
    setCompagnonConnecteId(null)
  }

  const statut = compagnonConnecte?.statut ?? 'ABSENT'
  const badge = STATUT_BADGE[statut] ?? { label: statut, variant: 'muted' as const }
  const heureArrivee = formatTime(compagnonConnecte?.heureArrivee ?? null)
  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const heureStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={styles.page}>
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

      {!compagnonConnecteId && (
        <div className={styles.selectionWrap}>
          <h2 className={styles.selectionTitle}>Qui êtes-vous ?</h2>
          <div className={styles.compagnonsGrid}>
            {compagnons.map((compagnon) => {
              const companionBadge = STATUT_BADGE[compagnon.statut] ?? { label: compagnon.statut, variant: 'muted' as const }
              const initials = `${compagnon.prenom[0]}${compagnon.nom[0]}`.toUpperCase()
              return (
                <button
                  key={compagnon.id}
                  className={styles.compagnonCard}
                  onClick={() => (compagnon.hasPin ? setPinTarget(compagnon) : setCompagnonConnecteId(compagnon.id))}
                >
                  <div className={styles.compagnonAvatar}>{initials}</div>
                  <span className={styles.compagnonNom}>{compagnon.prenom}</span>
                  <span className={styles.compagnonPoste}>{compagnon.poste ?? 'Mécanicien'}</span>
                  <Badge variant={companionBadge.variant} dot>{companionBadge.label}</Badge>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {compagnonConnecte && (
        <div className={styles.dashboard}>
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
                <button className={`${styles.actionBtn} ${styles.actionArrivee}`} onClick={() => actionPointage('ARRIVEE')} disabled={!!loadingAction}>
                  <ArrowRight weight="bold" size={20} />
                  Arrivée atelier
                </button>
              )}
              {statut === 'EN_TRAVAIL' && (
                <>
                  <button className={`${styles.actionBtn} ${styles.actionPause}`} onClick={() => actionPointage('PAUSE_CAFE_DEBUT')} disabled={!!loadingAction}>
                    <Coffee weight="fill" size={18} /> Pause café
                  </button>
                  <button className={`${styles.actionBtn} ${styles.actionPause}`} onClick={() => actionPointage('PAUSE_DEJ_DEBUT')} disabled={!!loadingAction}>
                    <ForkKnife weight="fill" size={18} /> Pause déjeuner
                  </button>
                  <button className={`${styles.actionBtn} ${styles.actionDepart}`} onClick={() => setConfirmDepartOpen(true)} disabled={!!loadingAction}>
                    <SignOut weight="bold" size={18} /> Fin de journée
                  </button>
                </>
              )}
              {(statut === 'PAUSE_CAFE' || statut === 'PAUSE_DEJEUNER') && (
                <button
                  className={`${styles.actionBtn} ${styles.actionReprise}`}
                  onClick={() => actionPointage(statut === 'PAUSE_CAFE' ? 'PAUSE_CAFE_FIN' : 'PAUSE_DEJ_FIN')}
                  disabled={!!loadingAction}
                >
                  <ArrowRight weight="bold" size={20} /> Reprendre
                </button>
              )}
              {statut === 'PARTI' && <div className={styles.partiMsg}>Bonne journée !</div>}
            </div>
            {pointageError && <p className={styles.pointageError}>{pointageError}</p>}
          </div>

          <div className={styles.fichesSection}>
            <div className={styles.fichesTitleRow}>
              <h3 className={styles.fichesTitle}>
                <Wrench size={16} /> Fiches de travaux
                <span className={styles.fichesCount}>{fiches.length}</span>
              </h3>
              <div className={styles.fichesActions}>
                <button className={styles.scanBtn} onClick={() => setExternalOpen(true)}>
                  <ClipboardText weight="bold" size={16} /> OR externe
                </button>
                <button className={styles.scanBtn} onClick={() => setScannerOpen(true)}>
                  <Barcode weight="bold" size={16} /> Rechercher / Scanner
                </button>
              </div>
            </div>

            {fiches.length === 0 ? (
              <div className={styles.fichesEmpty}>Aucune fiche active</div>
            ) : (
              <div className={styles.fichesList}>
                {fiches.map((fiche) => {
                  const estPointe = fiche.pointagesActifs.some((pointage) => pointage.compagnonId === compagnonConnecteId)
                  const ficheBadge = FICHE_BADGE[fiche.statut] ?? { label: fiche.statut, variant: 'muted' as const }
                  const peutPointer = ['EN_ATTENTE', 'EN_COURS', 'TERMINEE'].includes(fiche.statut) && statut === 'EN_TRAVAIL'
                  const pointageMoi = fiche.pointagesActifs.find((pointage) => pointage.compagnonId === compagnonConnecteId)
                  const lignes = fiche.travaux.split('\n').filter(Boolean)

                  return (
                    <div key={fiche.id} className={`${styles.ficheCard} ${estPointe ? styles.ficheActive : ''}`}>
                      <div className={styles.ficheCardHeader}>
                        <div className={styles.ficheCardLeft}>
                          <span className={styles.ficheNumero}>{fiche.numero}</span>
                          <Badge variant={ficheBadge.variant} dot>{ficheBadge.label}</Badge>
                        </div>
                        {peutPointer && (
                          <button
                            className={`${styles.ficheBtn} ${estPointe ? styles.ficheBtnStop : styles.ficheBtnStart}`}
                            onClick={() => actionFiche(fiche.id, estPointe ? 'DEPOINTER' : 'POINTER')}
                            disabled={!!loadingAction}
                          >
                            {loadingAction === fiche.id
                              ? '...'
                              : estPointe
                              ? <><Stop weight="fill" size={16} /> Dépointer</>
                              : <><Play weight="fill" size={16} /> Pointer</>}
                          </button>
                        )}
                      </div>
                      <div className={styles.ficheVehicule}>
                        <span className={styles.ficheVehiculeNom}>{fiche.vehicule}</span>
                        {fiche.immat && <span className={styles.ficheImmat}>{fiche.immat}</span>}
                        <span className={styles.ficheClient}>{fiche.clientNom}</span>
                      </div>
                      <ul className={styles.ficheTravaux}>
                        {lignes.slice(0, 2).map((ligne, index) => <li key={index}>{ligne}</li>)}
                        {lignes.length > 2 && <li className={styles.ficheMore}>+{lignes.length - 2} autre{lignes.length - 2 > 1 ? 's' : ''}</li>}
                      </ul>
                      {estPointe && pointageMoi && <div className={styles.ficheEnCours}>En cours depuis {formatDuree(pointageMoi.debutAt)}</div>}
                      {fiche.pointagesActifs.filter((pointage) => pointage.compagnonId !== compagnonConnecteId).map((pointage) => (
                        <div key={pointage.compagnonId} className={styles.ficheAutreCompagnon}>
                          {pointage.compagnonNom.split(' ')[0]} travaille dessus
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

      {scannerOpen && compagnonConnecteId && (
        <FicheScanner
          compagnonId={compagnonConnecteId}
          onPointer={(ficheId) => { actionFiche(ficheId, 'POINTER') }}
          onClose={() => setScannerOpen(false)}
        />
      )}

      {externalOpen && compagnonConnecteId && (
        <ExternalMirrorModal
          compagnonId={compagnonConnecteId}
          canPoint={statut === 'EN_TRAVAIL'}
          onClose={() => setExternalOpen(false)}
        />
      )}

      {pinTarget && <PinModal compagnon={pinTarget} onSuccess={handlePinSuccess} onClose={() => setPinTarget(null)} />}

      {confirmDepartOpen && (
        <div className={styles.confirmOverlay} onClick={(event) => event.target === event.currentTarget && setConfirmDepartOpen(false)}>
          <div className={styles.confirmModal} role="dialog" aria-modal="true" aria-labelledby="confirm-fin-journee-title">
            <h2 id="confirm-fin-journee-title">Confirmer la fin de journée ?</h2>
            <p>
              Cette action clôture votre journée de pointage. Vous ne pourrez plus revenir à l’état Arrivé atelier aujourd’hui.
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmCancel} onClick={() => setConfirmDepartOpen(false)} disabled={!!loadingAction}>
                Annuler
              </button>
              <button className={styles.confirmDanger} onClick={confirmerFinJournee} disabled={!!loadingAction}>
                {loadingAction === 'DEPART' ? 'Clôture...' : 'Confirmer la fin de journée'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
