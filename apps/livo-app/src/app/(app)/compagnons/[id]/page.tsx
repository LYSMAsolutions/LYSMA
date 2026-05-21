import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPrimaryGarageForUser } from '@/lib/garage'
import { redirect, notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Button, Badge } from '@/components/ui'
import { PointageExport } from '@/components/rh/PointageExport/PointageExport'
import { ArrowLeft, Clock, Wrench, Calendar } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { getSoldeConges, getCompteurAbsences } from '@/lib/rh'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

function formatH(val: number) {
  const h = Math.floor(Number(val ?? 0))
  const m = Math.round((Number(val ?? 0) - h) * 60)
  return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`
}

function formatEur(val: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(Number(val ?? 0))
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(d: Date | null) {
  if (!d) return '—'

  return new Date(d).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const TYPE_LABELS: Record<string, string> = {
  CONGE_PAYE: 'Congé payé',
  RTT: 'RTT',
  ARRET_MALADIE: 'Arrêt maladie',
  FORMATION: 'Formation',
  CONGE_SANS_SOLDE: 'Congé sans solde',
  AUTRE: 'Autre',
}

const STATUT_FICHE: Record<
  string,
  {
    label: string
    variant: 'blue' | 'success' | 'warning' | 'muted' | 'error' | 'gold' | 'cyan' | 'default'
  }
> = {
  EN_ATTENTE: { label: 'En attente', variant: 'warning' },
  EN_COURS: { label: 'En cours', variant: 'blue' },
  EN_PAUSE: { label: 'En pause', variant: 'warning' },
  TERMINEE: { label: 'Terminée', variant: 'success' },
  CLOTUREE: { label: 'Clôturée', variant: 'muted' },
  ANNULEE: { label: 'Annulée', variant: 'error' },
}

export default async function CompagnonFichePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const session = await auth()

  if (!session?.user?.id) {
    redirect('/connexion')
  }

  const garage = await getPrimaryGarageForUser(session.user.id)

  if (!garage) {
    redirect('/dashboard')
  }

  const compagnon = await prisma.compagnon.findFirst({
    where: {
      id,
      garageId: garage.id,
      actif: true,
    },
    include: {
      user: true,
      pointagesJour: {
        orderBy: {
          date: 'desc',
        },
        take: 30,
      },
      absences: {
        orderBy: {
          dateDebut: 'desc',
        },
        take: 20,
      },
      pointagesFiche: {
        include: {
          fiche: {
            include: {
              vehicule: true,
            },
          },
        },
        orderBy: {
          debutAt: 'desc',
        },
        take: 20,
      },
    },
  })

  if (!compagnon) {
    notFound()
  }

  const prenom = compagnon.user?.prenom ?? compagnon.prenom ?? ''
  const nom = compagnon.user?.nom ?? compagnon.nom ?? ''
  const telephone = compagnon.user?.telephone ?? null
  const initials = `${prenom[0] ?? '?'}${nom[0] ?? '?'}`.toUpperCase()

  const taux = await prisma.tauxGarage.findMany({
    where: {
      garageId: garage.id,
      actif: true,
    },
  })

  const tauxMap = Object.fromEntries(taux.map((t) => [t.type, Number(t.montant)]))
  const tauxMoyen = taux.length
    ? taux.reduce((sum, t) => sum + Number(t.montant), 0) / taux.length
    : 65

  const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

  const fichesMois = compagnon.pointagesFiche.filter((pointage) => {
    return (
      new Date(pointage.debutAt) >= debutMois &&
      pointage.fiche?.statut === 'CLOTUREE'
    )
  })

  const delta = fichesMois.reduce((sum, pointage) => {
    const fiche = pointage.fiche

    if (!fiche) {
      return sum
    }

    const tauxFiche = fiche.tauxApplique
      ? tauxMap[fiche.tauxApplique] ?? tauxMoyen
      : tauxMoyen

    return (
      sum +
      (Number(fiche.tempsFacture ?? 0) -
        Number(fiche.tempsReel ?? fiche.tempsFacture ?? 0)) *
        tauxFiche
    )
  }, 0)

  const [solde, compteurs] = await Promise.all([
    compagnon.dateEntree
      ? getSoldeConges(compagnon.id, compagnon.dateEntree)
      : { acquis: 0, pris: 0, solde: 0 },
    getCompteurAbsences(compagnon.id),
  ])

  return (
    <>
      <Header
        title={`${prenom} ${nom}`.trim() || 'Compagnon'}
        description={`${compagnon.poste ?? 'Mécanicien'}`}
        action={
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <PointageExport compagnonId={compagnon.id} compagnonNom={`${prenom}_${nom}`} />

            <Link href="/compagnons">
              <Button variant="secondary" size="sm" icon={<ArrowLeft />}>
                Retour
              </Button>
            </Link>
          </div>
        }
      />

      <div className={styles.content}>
        <div className={styles.profilCard}>
          <div className={styles.profilLeft}>
            <div className={styles.avatar}>{initials}</div>

            <div className={styles.profilInfo}>
              <h2 className={styles.profilNom}>
                {prenom} {nom}
              </h2>

              <p className={styles.profilSub}>
                {compagnon.poste ?? 'Mécanicien'} · {Number(compagnon.heuresContrat ?? 35)}h/sem
              </p>

              {telephone && <p className={styles.profilContact}>{telephone}</p>}

              {compagnon.dateEntree && (
                <p className={styles.profilContact}>
                  Entrée : {formatDate(compagnon.dateEntree)}
                </p>
              )}
            </div>
          </div>

          <div className={styles.profilKpis}>
            <div className={styles.profilKpi}>
              <span className={styles.profilKpiVal}>{fichesMois.length}</span>
              <span className={styles.profilKpiLabel}>Fiches ce mois</span>
            </div>

            <div className={styles.profilKpi}>
              <span className={`${styles.profilKpiVal} ${delta >= 0 ? styles.gain : styles.perte}`}>
                {delta >= 0 ? '+' : ''}
                {formatEur(delta)}
              </span>

              <span className={styles.profilKpiLabel}>Rentabilité mois</span>
            </div>

            <div className={styles.profilKpi}>
              <span
                className={styles.profilKpiVal}
                style={{
                  color: solde.solde < 5 ? 'var(--color-error)' : 'var(--color-success)',
                }}
              >
                {solde.solde}j
              </span>

              <span className={styles.profilKpiLabel}>Congés restants</span>
            </div>
          </div>
        </div>

        <div className={styles.congesGrid}>
          <CongeCard label="Congés payés" acquis={solde.acquis} pris={solde.pris} solde={solde.solde} />

          <div className={styles.compteurCard}>
            <span className={styles.compteurLabel}>RTT</span>
            <span className={styles.compteurVal}>{compteurs.RTT ?? 0}j</span>
          </div>

          <div className={styles.compteurCard}>
            <span className={styles.compteurLabel}>Arrêts maladie</span>
            <span
              className={styles.compteurVal}
              style={{
                color: (compteurs.ARRET_MALADIE ?? 0) > 0 ? 'var(--color-error)' : undefined,
              }}
            >
              {compteurs.ARRET_MALADIE ?? 0}j
            </span>
          </div>

          <div className={styles.compteurCard}>
            <span className={styles.compteurLabel}>Formations</span>
            <span className={styles.compteurVal} style={{ color: 'var(--color-gold)' }}>
              {compteurs.FORMATION ?? 0}j
            </span>
          </div>
        </div>

        <div className={styles.grid}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Clock size={14} />
              Pointages récents
            </h2>

            <div className={styles.pointageList}>
              {compagnon.pointagesJour.length === 0 ? (
                <p className={styles.emptyMsg}>Aucun pointage</p>
              ) : (
                compagnon.pointagesJour.map((pointage) => (
                  <div key={pointage.id} className={styles.pointageItem}>
                    <span className={styles.pointageDate}>{formatDate(pointage.date)}</span>

                    <div className={styles.pointageHeures}>
                      <span>{formatTime(pointage.heureArrivee)}</span>
                      <span className={styles.separator}>→</span>
                      <span>{formatTime(pointage.heureDepart)}</span>
                    </div>

                    <span className={styles.pointageDuree}>
                      {pointage.dureeMinutes ? formatH(pointage.dureeMinutes / 60) : '—'}
                    </span>

                    <Badge variant={pointage.statutActuel === 'PARTI' ? 'success' : 'blue'} dot>
                      {pointage.statutActuel === 'PARTI' ? 'Terminé' : 'En cours'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Wrench size={14} />
              Fiches récentes
            </h2>

            <div className={styles.orList}>
              {compagnon.pointagesFiche.length === 0 ? (
                <p className={styles.emptyMsg}>Aucune fiche</p>
              ) : (
                compagnon.pointagesFiche.map((pointageFiche) => {
                  const fiche = pointageFiche.fiche

                  if (!fiche) {
                    return null
                  }

                  const statut = STATUT_FICHE[fiche.statut] ?? {
                    label: fiche.statut,
                    variant: 'muted' as const,
                  }

                  const tauxFiche = fiche.tauxApplique
                    ? tauxMap[fiche.tauxApplique] ?? tauxMoyen
                    : tauxMoyen

                  const deltaFiche =
                    fiche.statut === 'CLOTUREE'
                      ? (Number(fiche.tempsFacture ?? 0) -
                          Number(fiche.tempsReel ?? fiche.tempsFacture ?? 0)) *
                        tauxFiche
                      : null

                  return (
                    <div key={pointageFiche.id} className={styles.orItem}>
                      <div className={styles.orLeft}>
                        <span className={styles.orNumero}>{fiche.numero}</span>

                        <span className={styles.orVehicule}>
                          {[fiche.vehicule?.marque, fiche.vehicule?.modele].filter(Boolean).join(' ') || 'Véhicule'}
                        </span>

                        <span className={styles.orDate}>{formatDate(pointageFiche.debutAt)}</span>
                      </div>

                      <div className={styles.orRight}>
                        <Badge variant={statut.variant} dot>
                          {statut.label}
                        </Badge>

                        {deltaFiche !== null && (
                          <span className={deltaFiche >= 0 ? styles.gain : styles.perte}>
                            {deltaFiche >= 0 ? '+' : ''}
                            {formatEur(deltaFiche)}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </section>
        </div>

        {compagnon.absences.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Calendar size={14} />
              Absences
            </h2>

            <div className={styles.absenceList}>
              {compagnon.absences.map((absence) => (
                <div key={absence.id} className={styles.absenceItem}>
                  <Badge variant="warning">{TYPE_LABELS[absence.type] ?? absence.type}</Badge>

                  <span className={styles.absenceDates}>
                    {formatDate(absence.dateDebut)} → {formatDate(absence.dateFin)}
                  </span>

                  <span className={styles.absenceJours}>
                    {Number(absence.nbJours ?? 0)}j
                  </span>

                  {absence.approuve ? (
                    <Badge variant="success">Approuvé</Badge>
                  ) : (
                    <Badge variant="muted">En attente</Badge>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

function CongeCard({
  label,
  acquis,
  pris,
  solde,
}: {
  label: string
  acquis: number
  pris: number
  solde: number
}) {
  const pct = acquis > 0 ? Math.min(100, (pris / acquis) * 100) : 0

  return (
    <div className={styles.congeCard}>
      <div className={styles.congeHeader}>
        <span className={styles.congeLabel}>{label}</span>

        <span
          className={styles.congeSolde}
          style={{
            color: solde < 5 ? 'var(--color-error)' : 'var(--color-success)',
          }}
        >
          {solde}j restants
        </span>
      </div>

      <div className={styles.congeBar}>
        <div className={styles.congeFill} style={{ width: `${pct}%` }} />
      </div>

      <div className={styles.congeStats}>
        <span>{acquis}j acquis</span>
        <span>{pris}j pris</span>
      </div>
    </div>
  )
}
