import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/ui'
import { TrendUp, TrendDown } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import {
  CompagnonsClient,
  CompagnonsActionButton,
} from '@/components/compagnons/CompagnonsClient/CompagnonsClient'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

function formatEur(val: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(Number(val ?? 0))
}

export default async function CompagnonsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/connexion')
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
      actif: true,
    },
    include: {
      garages: {
        where: {
          actif: true,
        },
        take: 1,
      },
    },
  })

  const garage = user?.garages[0]

  if (!garage) {
    redirect('/dashboard')
  }

  const now = new Date()
  const debutMois = new Date(now.getFullYear(), now.getMonth(), 1)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const compagnons = await prisma.compagnon.findMany({
    where: {
      garageId: garage.id,
      actif: true,
    },
    include: {
      user: true,
      pointagesJour: {
        where: {
          date: {
            gte: debutMois,
          },
        },
      },
      absences: {
        where: {
          dateDebut: {
            gte: debutMois,
          },
        },
      },
      pointagesFiche: {
        where: {
          fiche: {
            garageId: garage.id,
            statut: 'CLOTUREE',
            dateFermeture: {
              gte: debutMois,
            },
          },
        },
        include: {
          fiche: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

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

  const STATUT_COLORS: Record<
    string,
    {
      label: string
      variant: 'muted' | 'success' | 'warning' | 'blue' | 'error' | 'gold' | 'cyan' | 'default'
    }
  > = {
    ABSENT: { label: 'Absent', variant: 'muted' },
    EN_TRAVAIL: { label: 'En travail', variant: 'success' },
    PAUSE_CAFE: { label: 'Pause café', variant: 'warning' },
    PAUSE_DEJEUNER: { label: 'Pause déjeuner', variant: 'warning' },
    PARTI: { label: 'Parti', variant: 'muted' },
    ARRIVE: { label: 'Arrivé', variant: 'blue' },
  }

  return (
    <CompagnonsClient garageId={garage.id}>
      <Header
        title="Compagnons"
        description={`${compagnons.length} actif${compagnons.length > 1 ? 's' : ''}`}
        action={<CompagnonsActionButton garageId={garage.id} />}
      />

      <div className={styles.content}>
        {compagnons.length === 0 ? (
          <div className={styles.empty}>
            <p>Aucun compagnon — cliquez sur Ajouter pour commencer</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {compagnons.map((compagnon) => {
              const prenom = compagnon.user?.prenom ?? compagnon.prenom ?? ''
              const nom = compagnon.user?.nom ?? compagnon.nom ?? ''
              const initials = `${prenom[0] ?? '?'}${nom[0] ?? '?'}`.toUpperCase()

              const ficheIds = [...new Set(compagnon.pointagesFiche.map((p) => p.ficheId))]

              let delta = 0

              for (const pointageFiche of compagnon.pointagesFiche) {
                const fiche = pointageFiche.fiche

                if (!fiche) {
                  continue
                }

                const tauxFiche = fiche.tauxApplique
                  ? tauxMap[fiche.tauxApplique] ?? tauxMoyen
                  : tauxMoyen

                delta +=
                  (Number(fiche.tempsFacture ?? 0) -
                    Number(fiche.tempsReel ?? fiche.tempsFacture ?? 0)) *
                  tauxFiche
              }

              const nbAbsences = compagnon.absences.reduce(
                (sum, absence) => sum + Number(absence.nbJours ?? 0),
                0
              )

              const pointageJour = compagnon.pointagesJour.find((pointage) => {
                const date = new Date(pointage.date)
                const cleanDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

                return cleanDate.getTime() === today.getTime()
              })

              const statut = pointageJour?.statutActuel ?? 'ABSENT'
              const badge = STATUT_COLORS[statut] ?? {
                label: statut,
                variant: 'muted' as const,
              }

              return (
                <Link key={compagnon.id} href={`/compagnons/${compagnon.id}`} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.avatar}>{initials}</div>

                    <div className={styles.info}>
                      <span className={styles.nom}>
                        {prenom} {nom}
                      </span>

                      <span className={styles.poste}>{compagnon.poste ?? 'Mécanicien'}</span>
                    </div>

                    <Badge variant={badge.variant} dot>
                      {badge.label}
                    </Badge>
                  </div>

                  <div className={styles.stats}>
                    <span className={styles.statItem}>
                      {ficheIds.length} fiche{ficheIds.length > 1 ? 's' : ''} ce mois
                    </span>

                    <span className={`${styles.statItem} ${delta >= 0 ? styles.gain : styles.perte}`}>
                      {delta >= 0 ? <TrendUp size={12} /> : <TrendDown size={12} />}
                      {delta >= 0 ? '+' : ''}
                      {formatEur(delta)}
                    </span>
                  </div>

                  {nbAbsences > 0 && (
                    <Badge variant="warning">{nbAbsences}j d&apos;absence ce mois</Badge>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </CompagnonsClient>
  )
}