'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  ArrowRight,
  Barcode,
  Buildings,
  Coffee,
  ForkKnife,
  IdentificationCard,
  Lock,
  LockKey,
  Play,
  SignOut,
  Stop,
  Wrench,
  X,
} from '@phosphor-icons/react'
import { Badge } from '@/components/ui'
import loginStyles from '../(atelier)/atelier-login/page.module.css'
import atelierStyles from '@/components/atelier/AtelierDashboard/AtelierDashboard.module.css'
import styles from './page.module.css'

type LoginStep = 'login' | 'compagnon' | 'pin' | 'atelier'
type Statut = 'ABSENT' | 'EN_TRAVAIL' | 'PAUSE_CAFE' | 'PAUSE_DEJEUNER' | 'PARTI'
type StatutFiche = 'EN_ATTENTE' | 'EN_COURS' | 'EN_PAUSE' | 'TERMINEE'

type Compagnon = {
  id: string
  prenom: string
  nom: string
  poste: string | null
  hasPin: boolean
  statut: Statut
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

const GARAGE = {
  id: 'demo-garage',
  nom: 'Garage Morel Auto',
  email: 'atelier@garage-demo.fr',
  password: 'demo',
}

const COMPAGNONS_DEMO: Compagnon[] = [
  { id: 'marc', prenom: 'Marc', nom: 'Dubois', poste: 'Chef atelier', hasPin: true, statut: 'ABSENT', heureArrivee: null },
  { id: 'lina', prenom: 'Lina', nom: 'Martin', poste: 'Carrossière', hasPin: true, statut: 'EN_TRAVAIL', heureArrivee: todayAt('07:55') },
  { id: 'karim', prenom: 'Karim', nom: 'Benali', poste: 'Mécanicien', hasPin: true, statut: 'PAUSE_CAFE', heureArrivee: todayAt('08:03') },
  { id: 'sophie', prenom: 'Sophie', nom: 'Leclerc', poste: 'Peintre', hasPin: true, statut: 'EN_TRAVAIL', heureArrivee: todayAt('07:48') },
]

const FICHES_DEMO: Fiche[] = [
  {
    id: 'ft-014',
    numero: 'FT-2026-014',
    statut: 'EN_ATTENTE',
    travaux: 'Distribution\nPompe à eau\nRévision complète',
    vehicule: 'Renault Clio IV',
    immat: 'GH-246-MQ',
    clientNom: 'Perrin',
    tempsReel: null,
    pointagesActifs: [],
  },
  {
    id: 'ft-015',
    numero: 'FT-2026-015',
    statut: 'EN_COURS',
    travaux: 'Freinage avant\nContrôle bruit train roulant',
    vehicule: 'Peugeot 308',
    immat: 'GM-821-LP',
    clientNom: 'ETS Lavigne',
    tempsReel: 1.4,
    pointagesActifs: [{ compagnonId: 'lina', compagnonNom: 'Lina Martin', debutAt: todayAt('10:12') }],
  },
  {
    id: 'ft-016',
    numero: 'FT-2026-016',
    statut: 'EN_COURS',
    travaux: 'Pare-chocs avant\nPréparation peinture\nLustrage',
    vehicule: 'BMW Série 1',
    immat: 'FY-119-CR',
    clientNom: 'Renaud',
    tempsReel: 4.2,
    pointagesActifs: [{ compagnonId: 'sophie', compagnonNom: 'Sophie Leclerc', debutAt: todayAt('09:40') }],
  },
  {
    id: 'ft-017',
    numero: 'FT-2026-017',
    statut: 'TERMINEE',
    travaux: 'Diagnostic démarrage\nBatterie\nContrôle charge alternateur',
    vehicule: 'Renault Kangoo',
    immat: 'BN-774-VT',
    clientNom: 'Boulangerie Martin',
    tempsReel: 1.2,
    pointagesActifs: [],
  },
]

const STATUT_BADGE: Record<Statut, { label: string; variant: 'muted' | 'success' | 'warning' | 'blue' }> = {
  ABSENT: { label: 'Absent', variant: 'muted' },
  EN_TRAVAIL: { label: 'En travail', variant: 'success' },
  PAUSE_CAFE: { label: 'Pause café', variant: 'warning' },
  PAUSE_DEJEUNER: { label: 'Pause déjeuner', variant: 'warning' },
  PARTI: { label: 'Parti', variant: 'muted' },
}

const FICHE_BADGE: Record<StatutFiche, { label: string; variant: 'blue' | 'success' | 'warning' | 'muted' }> = {
  EN_ATTENTE: { label: 'En attente', variant: 'warning' },
  EN_COURS: { label: 'En cours', variant: 'blue' },
  EN_PAUSE: { label: 'En pause', variant: 'warning' },
  TERMINEE: { label: 'Terminée', variant: 'success' },
}

function todayAt(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  const date = new Date()
  date.setHours(hours ?? 0, minutes ?? 0, 0, 0)
  return date.toISOString()
}

function initials(compagnon: Compagnon) {
  return `${compagnon.prenom[0]}${compagnon.nom[0]}`.toUpperCase()
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

export function LivoDemoClient() {
  const [step, setStep] = useState<LoginStep>('login')
  const [email, setEmail] = useState(GARAGE.email)
  const [password, setPassword] = useState(GARAGE.password)
  const [loginError, setLoginError] = useState('')
  const [compagnons, setCompagnons] = useState<Compagnon[]>(COMPAGNONS_DEMO)
  const [fiches, setFiches] = useState<Fiche[]>(FICHES_DEMO)
  const [compagnonSelectionne, setCompagnonSelectionne] = useState<Compagnon | null>(null)
  const [compagnonConnecteId, setCompagnonConnecteId] = useState<string | null>(null)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [scannerOpen, setScannerOpen] = useState(false)
  const [confirmDepartOpen, setConfirmDepartOpen] = useState(false)
  const [pointageError, setPointageError] = useState('')
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  const compagnonConnecte = compagnons.find((compagnon) => compagnon.id === compagnonConnecteId)

  function handleLogin() {
    setLoginError('')
    if (!email || !password) {
      setLoginError('Saisissez l’email du garage et le mot de passe atelier.')
      return
    }
    setStep('compagnon')
  }

  function handleSelectCompagnon(compagnon: Compagnon) {
    setCompagnonSelectionne(compagnon)
    setPin('')
    setPinError('')
    setStep('pin')
  }

  function handlePinDigit(digit: string) {
    if (pin.length >= 4 || !compagnonSelectionne) return
    const nextPin = pin + digit
    setPin(nextPin)
    if (nextPin.length === 4) {
      if (nextPin === '1234') {
        setCompagnonConnecteId(compagnonSelectionne.id)
        setStep('atelier')
      } else {
        setPinError('Code PIN incorrect. Pour la démo, utilisez 1234.')
        setPin('')
      }
    }
  }

  function actionPointage(action: 'ARRIVEE' | 'PAUSE_CAFE_DEBUT' | 'PAUSE_CAFE_FIN' | 'PAUSE_DEJ_DEBUT' | 'PAUSE_DEJ_FIN' | 'DEPART') {
    if (!compagnonConnecteId) return
    setLoadingAction(action)
    setPointageError('')

    window.setTimeout(() => {
      setCompagnons((current) => current.map((compagnon) => {
        if (compagnon.id !== compagnonConnecteId) return compagnon

        if (action === 'ARRIVEE') {
          if (compagnon.statut === 'PARTI') {
            setPointageError('Votre journée a déjà été clôturée. Vous ne pouvez plus repointer en arrivée atelier aujourd’hui.')
            return compagnon
          }
          return { ...compagnon, statut: 'EN_TRAVAIL', heureArrivee: new Date().toISOString() }
        }

        if (action === 'PAUSE_CAFE_DEBUT') return { ...compagnon, statut: 'PAUSE_CAFE' }
        if (action === 'PAUSE_CAFE_FIN') return { ...compagnon, statut: 'EN_TRAVAIL' }
        if (action === 'PAUSE_DEJ_DEBUT') return { ...compagnon, statut: 'PAUSE_DEJEUNER' }
        if (action === 'PAUSE_DEJ_FIN') return { ...compagnon, statut: 'EN_TRAVAIL' }
        if (action === 'DEPART') return { ...compagnon, statut: 'PARTI' }

        return compagnon
      }))
      setLoadingAction(null)
    }, 240)
  }

  function actionFiche(ficheId: string, action: 'POINTER' | 'DEPOINTER') {
    if (!compagnonConnecteId || !compagnonConnecte) return
    setLoadingAction(ficheId)

    window.setTimeout(() => {
      setFiches((current) => current.map((fiche) => {
        if (fiche.id !== ficheId) return fiche

        if (action === 'POINTER') {
          const dejaPointe = fiche.pointagesActifs.some((pointage) => pointage.compagnonId === compagnonConnecteId)
          if (dejaPointe) return fiche
          return {
            ...fiche,
            statut: 'EN_COURS',
            pointagesActifs: [
              ...fiche.pointagesActifs,
              {
                compagnonId: compagnonConnecteId,
                compagnonNom: `${compagnonConnecte.prenom} ${compagnonConnecte.nom}`,
                debutAt: new Date().toISOString(),
              },
            ],
          }
        }

        const pointagesActifs = fiche.pointagesActifs.filter((pointage) => pointage.compagnonId !== compagnonConnecteId)
        return {
          ...fiche,
          statut: pointagesActifs.length > 0 ? 'EN_COURS' : 'TERMINEE',
          pointagesActifs,
        }
      }))
      setLoadingAction(null)
    }, 220)
  }

  function deconnecter() {
    setCompagnonConnecteId(null)
    setCompagnonSelectionne(null)
    setPin('')
    setStep('atelier')
  }

  if (step === 'login') {
    return (
      <div className={loginStyles.page}>
        <div className={styles.demoRibbon}>Démo publique · données fictives · aucune action enregistrée</div>
        <div className={loginStyles.card}>
          <div className={loginStyles.logoWrap}>
            <div className={styles.demoLogoIcon}>
              <Image src="/logo/livo-app-logo.png" alt="LIVO" width={58} height={58} priority />
            </div>
            <div>
              <div className={loginStyles.logoName}>Espace Atelier</div>
              <div className={loginStyles.logoSub}>LIVO-APP</div>
            </div>
          </div>

          <h1 className={loginStyles.title}>Connexion atelier</h1>
          <p className={loginStyles.intro}>
            Connectez d’abord le garage. Ensuite, chaque compagnon choisit son profil et saisit son code PIN.
          </p>

          <div className={loginStyles.steps}>
            <div className={`${loginStyles.step} ${loginStyles.stepActive}`}>
              <Buildings size={16} />
              <span>1. Garage</span>
            </div>
            <div className={loginStyles.step}>
              <IdentificationCard size={16} />
              <span>2. Compagnon</span>
            </div>
            <div className={loginStyles.step}>
              <LockKey size={16} />
              <span>3. PIN</span>
            </div>
          </div>

          <div className={loginStyles.form}>
            <input
              className={loginStyles.input}
              type="email"
              placeholder="Email du garage"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoFocus
            />
            <input
              className={loginStyles.input}
              type="password"
              placeholder="Mot de passe atelier"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleLogin()}
            />
            {loginError && <p className={loginStyles.error}>{loginError}</p>}
            <button className={loginStyles.btnPrimary} onClick={handleLogin}>
              Accéder à l’atelier
            </button>
          </div>

          <button className={styles.linkButton} onClick={() => setStep('compagnon')}>
            → Passer directement à la sélection compagnon
          </button>
        </div>
      </div>
    )
  }

  if (step === 'compagnon') {
    return (
      <div className={loginStyles.page}>
        <div className={styles.demoRibbon}>Démo publique · PIN compagnon : 1234</div>
        <div className={loginStyles.cardLarge}>
          <div className={loginStyles.garageHeader}>
            <div className={loginStyles.garageDot} />
            <span className={loginStyles.garageNom}>{GARAGE.nom}</span>
          </div>
          <h1 className={loginStyles.title}>Qui êtes-vous ?</h1>

          <p className={loginStyles.intro}>Choisissez votre profil pour ouvrir votre espace atelier.</p>

          <div className={loginStyles.compagnonsGrid}>
            {compagnons.map((compagnon) => (
              <button
                key={compagnon.id}
                className={loginStyles.compagnonBtn}
                onClick={() => handleSelectCompagnon(compagnon)}
              >
                <div className={loginStyles.compagnonAvatar}>{initials(compagnon)}</div>
                <span className={loginStyles.compagnonNom}>{compagnon.prenom}</span>
                <span className={loginStyles.compagnonPoste}>{compagnon.poste ?? 'Mécanicien'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (step === 'pin' && compagnonSelectionne) {
    return (
      <div className={loginStyles.page}>
        <div className={styles.demoRibbon}>Démo publique · tapez 1234</div>
        <div className={loginStyles.card}>
          <button className={loginStyles.backBtn} onClick={() => { setStep('compagnon'); setPinError('') }}>
            ← Retour
          </button>

          <div className={loginStyles.compagnonSelected}>
            <div className={loginStyles.compagnonAvatarLg}>{initials(compagnonSelectionne)}</div>
            <span className={loginStyles.compagnonNomLg}>{compagnonSelectionne.prenom} {compagnonSelectionne.nom}</span>
          </div>

          <p className={loginStyles.pinLabel}>Entrez votre code PIN</p>

          <div className={loginStyles.pinDots}>
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className={`${loginStyles.pinDot} ${pin.length > index ? loginStyles.pinDotFilled : ''}`} />
            ))}
          </div>

          {pinError && <p className={loginStyles.error}>{pinError}</p>}

          <div className={loginStyles.pinPad}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((digit, index) => (
              <button
                key={index}
                className={`${loginStyles.pinKey} ${digit === '' ? loginStyles.pinKeyEmpty : ''}`}
                onClick={() => digit === '⌫' ? setPin((current) => current.slice(0, -1)) : digit !== '' && handlePinDigit(digit)}
                disabled={digit === ''}
              >
                {digit}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const statut = compagnonConnecte?.statut ?? 'ABSENT'
  const badge = STATUT_BADGE[statut]
  const heureArrivee = formatTime(compagnonConnecte?.heureArrivee ?? null)
  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const heureStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={atelierStyles.page}>
      <div className={styles.demoRibbon}>Démo publique · aucune donnée réelle n’est enregistrée</div>
      <div className={atelierStyles.header}>
        <div className={atelierStyles.headerLeft}>
          <div className={atelierStyles.garageDot} />
          <span className={atelierStyles.garageNom}>{GARAGE.nom}</span>
          <span className={atelierStyles.headerDate}>{dateStr}</span>
        </div>
        <div className={atelierStyles.headerRight}>
          <span className={atelierStyles.horloge}>{heureStr}</span>
          {compagnonConnecte && (
            <button className={atelierStyles.deconnecterBtn} onClick={deconnecter}>
              <Lock size={14} /> Verrouiller
            </button>
          )}
        </div>
      </div>

      {!compagnonConnecteId && (
        <div className={atelierStyles.selectionWrap}>
          <h2 className={atelierStyles.selectionTitle}>Qui êtes-vous ?</h2>
          <div className={atelierStyles.compagnonsGrid}>
            {compagnons.map((compagnon) => {
              const companionBadge = STATUT_BADGE[compagnon.statut]
              return (
                <button
                  key={compagnon.id}
                  className={atelierStyles.compagnonCard}
                  onClick={() => handleSelectCompagnon(compagnon)}
                >
                  <div className={atelierStyles.compagnonAvatar}>{initials(compagnon)}</div>
                  <span className={atelierStyles.compagnonNom}>{compagnon.prenom}</span>
                  <span className={atelierStyles.compagnonPoste}>{compagnon.poste ?? 'Mécanicien'}</span>
                  <Badge variant={companionBadge.variant} dot>{companionBadge.label}</Badge>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {compagnonConnecte && (
        <div className={atelierStyles.dashboard}>
          <div className={atelierStyles.compagnonBlock}>
            <div className={atelierStyles.compagnonBlockLeft}>
              <div className={atelierStyles.compagnonAvatarLg}>{initials(compagnonConnecte)}</div>
              <div>
                <div className={atelierStyles.compagnonNomLg}>{compagnonConnecte.prenom} {compagnonConnecte.nom}</div>
                <div className={atelierStyles.compagnonPosteLg}>{compagnonConnecte.poste ?? 'Mécanicien'}</div>
                {heureArrivee && <div className={atelierStyles.arriveeHeure}>Arrivée {heureArrivee}</div>}
              </div>
              <Badge variant={badge.variant} dot>{badge.label}</Badge>
            </div>

            <div className={atelierStyles.actionsJournee}>
              {statut === 'ABSENT' && (
                <button className={`${atelierStyles.actionBtn} ${atelierStyles.actionArrivee}`}
                  onClick={() => actionPointage('ARRIVEE')} disabled={!!loadingAction}>
                  <ArrowRight weight="bold" size={20} />
                  Arrivée atelier
                </button>
              )}
              {statut === 'EN_TRAVAIL' && (
                <>
                  <button className={`${atelierStyles.actionBtn} ${atelierStyles.actionPause}`}
                    onClick={() => actionPointage('PAUSE_CAFE_DEBUT')} disabled={!!loadingAction}>
                    <Coffee weight="fill" size={18} /> Pause café
                  </button>
                  <button className={`${atelierStyles.actionBtn} ${atelierStyles.actionPause}`}
                    onClick={() => actionPointage('PAUSE_DEJ_DEBUT')} disabled={!!loadingAction}>
                    <ForkKnife weight="fill" size={18} /> Pause déjeuner
                  </button>
                  <button className={`${atelierStyles.actionBtn} ${atelierStyles.actionDepart}`}
                    onClick={() => setConfirmDepartOpen(true)} disabled={!!loadingAction}>
                    <SignOut weight="bold" size={18} /> Fin de journée
                  </button>
                </>
              )}
              {(statut === 'PAUSE_CAFE' || statut === 'PAUSE_DEJEUNER') && (
                <button className={`${atelierStyles.actionBtn} ${atelierStyles.actionReprise}`}
                  onClick={() => actionPointage(statut === 'PAUSE_CAFE' ? 'PAUSE_CAFE_FIN' : 'PAUSE_DEJ_FIN')}
                  disabled={!!loadingAction}>
                  <ArrowRight weight="bold" size={20} /> Reprendre
                </button>
              )}
              {statut === 'PARTI' && (
                <div className={atelierStyles.partiMsg}>Bonne journée !</div>
              )}
            </div>
            {pointageError && <p className={atelierStyles.pointageError}>{pointageError}</p>}
          </div>

          <div className={atelierStyles.fichesSection}>
            <div className={atelierStyles.fichesTitleRow}>
              <h3 className={atelierStyles.fichesTitle}>
                <Wrench size={16} /> Fiches de travaux
                <span className={atelierStyles.fichesCount}>{fiches.length}</span>
              </h3>
              <button className={atelierStyles.scanBtn} onClick={() => setScannerOpen(true)}>
                <Barcode weight="bold" size={16} /> Rechercher / Scanner
              </button>
            </div>

            <div className={atelierStyles.fichesList}>
              {fiches.map((fiche) => {
                const estPointe = fiche.pointagesActifs.some((pointage) => pointage.compagnonId === compagnonConnecteId)
                const ficheBadge = FICHE_BADGE[fiche.statut]
                const peutPointer = ['EN_ATTENTE', 'EN_COURS', 'TERMINEE'].includes(fiche.statut) && statut === 'EN_TRAVAIL'
                const pointageMoi = fiche.pointagesActifs.find((pointage) => pointage.compagnonId === compagnonConnecteId)
                const lignes = fiche.travaux.split('\n').filter(Boolean)

                return (
                  <div key={fiche.id} className={`${atelierStyles.ficheCard} ${estPointe ? atelierStyles.ficheActive : ''}`}>
                    <div className={atelierStyles.ficheCardHeader}>
                      <div className={atelierStyles.ficheCardLeft}>
                        <span className={atelierStyles.ficheNumero}>{fiche.numero}</span>
                        <Badge variant={ficheBadge.variant} dot>{ficheBadge.label}</Badge>
                      </div>
                      {peutPointer && (
                        <button
                          className={`${atelierStyles.ficheBtn} ${estPointe ? atelierStyles.ficheBtnStop : atelierStyles.ficheBtnStart}`}
                          onClick={() => actionFiche(fiche.id, estPointe ? 'DEPOINTER' : 'POINTER')}
                          disabled={!!loadingAction}
                        >
                          {loadingAction === fiche.id
                            ? '...'
                            : estPointe
                              ? <><Stop weight="fill" size={16} /> Dépointer</>
                              : <><Play weight="fill" size={16} /> Pointer</>
                          }
                        </button>
                      )}
                    </div>
                    <div className={atelierStyles.ficheVehicule}>
                      <span className={atelierStyles.ficheVehiculeNom}>{fiche.vehicule}</span>
                      {fiche.immat && <span className={atelierStyles.ficheImmat}>{fiche.immat}</span>}
                      <span className={atelierStyles.ficheClient}>{fiche.clientNom}</span>
                    </div>
                    <ul className={atelierStyles.ficheTravaux}>
                      {lignes.slice(0, 2).map((travail, index) => <li key={index}>{travail}</li>)}
                      {lignes.length > 2 && <li className={atelierStyles.ficheMore}>+{lignes.length - 2} autre{lignes.length - 2 > 1 ? 's' : ''}</li>}
                    </ul>
                    {estPointe && pointageMoi && (
                      <div className={atelierStyles.ficheEnCours}>
                        En cours depuis {formatDuree(pointageMoi.debutAt)}
                      </div>
                    )}
                    {fiche.pointagesActifs.filter((pointage) => pointage.compagnonId !== compagnonConnecteId).map((pointage) => (
                      <div key={pointage.compagnonId} className={atelierStyles.ficheAutreCompagnon}>
                        {pointage.compagnonNom.split(' ')[0]} travaille dessus
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {scannerOpen && compagnonConnecteId && (
        <DemoScanner
          fiches={fiches}
          onClose={() => setScannerOpen(false)}
          onPointer={(ficheId) => {
            actionFiche(ficheId, 'POINTER')
            setScannerOpen(false)
          }}
        />
      )}

      {confirmDepartOpen && (
        <div className={atelierStyles.confirmOverlay} onClick={(event) => event.target === event.currentTarget && setConfirmDepartOpen(false)}>
          <div className={atelierStyles.confirmModal} role="dialog" aria-modal="true" aria-labelledby="confirm-fin-journee-title">
            <h2 id="confirm-fin-journee-title">Confirmer la fin de journée ?</h2>
            <p>
              Cette action clôture votre journée de pointage. Vous ne pourrez plus revenir à l’état Arrivé atelier aujourd’hui.
            </p>
            <div className={atelierStyles.confirmActions}>
              <button className={atelierStyles.confirmCancel} onClick={() => setConfirmDepartOpen(false)} disabled={!!loadingAction}>
                Annuler
              </button>
              <button className={atelierStyles.confirmDanger} onClick={() => { actionPointage('DEPART'); setConfirmDepartOpen(false) }} disabled={!!loadingAction}>
                Confirmer la fin de journée
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DemoScanner({
  fiches,
  onClose,
  onPointer,
}: {
  fiches: Fiche[]
  onClose: () => void
  onPointer: (ficheId: string) => void
}) {
  const [query, setQuery] = useState('FT-2026-014')
  const results = fiches.filter((fiche) =>
    `${fiche.numero} ${fiche.vehicule} ${fiche.immat ?? ''} ${fiche.clientNom}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className={styles.scanOverlay} onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className={styles.scanModal}>
        <div className={styles.scanHeader}>
          <h2>Trouver une fiche</h2>
          <button onClick={onClose} aria-label="Fermer"><X size={18} /></button>
        </div>
        <p className={styles.scanIntro}>
          Démo sans caméra : tapez un numéro de fiche, une immatriculation ou choisissez une fiche ci-dessous.
        </p>
        <input
          className={styles.scanInput}
          value={query}
          onChange={(event) => setQuery(event.target.value.toUpperCase())}
          placeholder="Ex : FT-2026-014"
          autoFocus
        />
        <div className={styles.scanResults}>
          {results.map((fiche) => (
            <button key={fiche.id} onClick={() => onPointer(fiche.id)}>
              <strong>{fiche.numero}</strong>
              <span>{fiche.vehicule} · {fiche.immat} · {fiche.clientNom}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
