import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPrimaryGarageForUser } from '@/lib/garage'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { RapportsClient } from '@/components/rapports/RapportsClient/RapportsClient'
import { RapportsTabs } from '@/components/rapports/RapportsTabs/RapportsTabs'
import { RHClient } from '@/components/rh/RHClient/RHClient'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function vehicleLabel(vehicule: { marque: string | null; modele: string | null; immatriculation: string | null }) {
  const label = [vehicule.marque, vehicule.modele].filter(Boolean).join(' ').trim()
  return label || vehicule.immatriculation || 'Véhicule'
}

export default async function RapportsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/connexion')
  }

  const garage = await getPrimaryGarageForUser(session.user.id)

  if (!garage) {
    redirect('/dashboard')
  }

  const now = new Date()
  const debutMois = new Date(now.getFullYear(), now.getMonth(), 1)
  const debutAnnee = new Date(now.getFullYear(), 0, 1)
  const debutDouzeMois = new Date(now.getFullYear(), now.getMonth() - 11, 1)

  const [
    compagnons,
    absences,
    fichesCloturees,
    taux,
  ] = await Promise.all([
    prisma.compagnon.findMany({
      where: {
        garageId: garage.id,
        actif: true,
      },
      include: {
        user: true,
      },
      orderBy: [
        { prenom: 'asc' },
        { nom: 'asc' },
      ],
    }),
    prisma.absence.findMany({
      where: {
        deletedAt: null,
        compagnon: {
          garageId: garage.id,
        },
      },
      include: {
        compagnon: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        dateDebut: 'desc',
      },
    }),
    prisma.ficheTravaux.findMany({
      where: {
        garageId: garage.id,
        statut: 'CLOTUREE',
        dateFermeture: {
          gte: debutDouzeMois,
        },
      },
      include: {
        vehicule: true,
        pointagesFiche: {
          include: {
            compagnon: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: {
        dateFermeture: 'asc',
      },
    }),
    prisma.tauxGarage.findMany({
      where: {
        garageId: garage.id,
        actif: true,
      },
    }),
  ])

  const tauxMap = Object.fromEntries(taux.map((item) => [item.type, Number(item.montant)]))
  const tauxMoyen = taux.length
    ? taux.reduce((sum, item) => sum + Number(item.montant), 0) / taux.length
    : 65

  type FicheRapport = (typeof fichesCloturees)[number]

  function calcRentabilite(fiche: FicheRapport) {
    const tauxHoraire = fiche.tauxApplique ? tauxMap[fiche.tauxApplique] ?? tauxMoyen : tauxMoyen
    const tempsFacture = Number(fiche.tempsFacture ?? 0)
    const tempsReel = Number(fiche.tempsReel ?? fiche.tempsFacture ?? 0)
    const montantFacture = fiche.montantHT !== null ? Number(fiche.montantHT) : tempsFacture * tauxHoraire
    const montantReel = tempsReel * tauxHoraire

    return {
      tempsFacture,
      tempsReel,
      montantFacture,
      delta: montantFacture - montantReel,
    }
  }

  const moisIndex = new Map<string, number>()
  const fichesMois = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1)
    const key = monthKey(date)
    moisIndex.set(key, index)

    return {
      mois: key,
      label: new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(date),
      ca: 0,
      rentabilite: 0,
      nbFiches: 0,
    }
  })

  for (const fiche of fichesCloturees) {
    if (!fiche.dateFermeture) continue

    const index = moisIndex.get(monthKey(fiche.dateFermeture))
    if (index === undefined) continue

    const rentabilite = calcRentabilite(fiche)
    fichesMois[index].ca += rentabilite.montantFacture
    fichesMois[index].rentabilite += rentabilite.delta
    fichesMois[index].nbFiches += 1
  }

  const fichesAnnee = fichesCloturees.filter((fiche) =>
    fiche.dateFermeture && fiche.dateFermeture >= debutAnnee
  )
  const fichesMoisActuel = fichesCloturees.filter((fiche) =>
    fiche.dateFermeture && fiche.dateFermeture >= debutMois
  )

  const caTotal = fichesCloturees.reduce((sum, fiche) => sum + calcRentabilite(fiche).montantFacture, 0)
  const caAnnee = fichesAnnee.reduce((sum, fiche) => sum + calcRentabilite(fiche).montantFacture, 0)
  const rentabiliteAnnee = fichesAnnee.reduce((sum, fiche) => sum + calcRentabilite(fiche).delta, 0)

  const compagnonStatsMap = new Map<string, {
    id: string
    nom: string
    prenom: string
    poste: string | null
    nbFiches: number
    tFacture: number
    tReel: number
    delta: number
    ca: number
  }>()

  for (const fiche of fichesMoisActuel) {
    const rentabilite = calcRentabilite(fiche)
    const repartition = new Map<string, {
      compagnon: (typeof fiche.pointagesFiche)[number]['compagnon']
      minutes: number
    }>()

    for (const pointage of fiche.pointagesFiche) {
      const existing = repartition.get(pointage.compagnonId)
      repartition.set(pointage.compagnonId, {
        compagnon: pointage.compagnon,
        minutes: (existing?.minutes ?? 0) + (pointage.dureeMinutes ?? 0),
      })
    }

    if (repartition.size === 0) continue

    const totalMinutes = Array.from(repartition.values()).reduce((sum, item) => sum + item.minutes, 0)

    for (const [compagnonId, item] of repartition) {
      const { compagnon } = item
      const existing = compagnonStatsMap.get(compagnonId) ?? {
        id: compagnonId,
        nom: compagnon.user?.nom ?? compagnon.nom,
        prenom: compagnon.user?.prenom ?? compagnon.prenom,
        poste: compagnon.poste,
        nbFiches: 0,
        tFacture: 0,
        tReel: 0,
        delta: 0,
        ca: 0,
      }
      const weight = totalMinutes > 0 ? item.minutes / totalMinutes : 1 / repartition.size

      existing.nbFiches += 1
      existing.tFacture += rentabilite.tempsFacture * weight
      existing.tReel += rentabilite.tempsReel * weight
      existing.delta += rentabilite.delta * weight
      existing.ca += rentabilite.montantFacture * weight

      compagnonStatsMap.set(compagnonId, existing)
    }
  }

  const fichesRecentes = fichesCloturees
    .slice()
    .sort((a, b) => (b.dateFermeture?.getTime() ?? 0) - (a.dateFermeture?.getTime() ?? 0))
    .slice(0, 8)
    .map((fiche) => {
      const rentabilite = calcRentabilite(fiche)

      return {
        id: fiche.id,
        numero: fiche.numero,
        vehicule: vehicleLabel(fiche.vehicule),
        clientNom: fiche.vehicule.clientNom,
        dateFermeture: fiche.dateFermeture?.toISOString() ?? '',
        montantHT: rentabilite.montantFacture,
        tempsFacture: rentabilite.tempsFacture,
        tempsReel: rentabilite.tempsReel,
        delta: rentabilite.delta,
        tauxApplique: fiche.tauxApplique,
      }
    })

  const compagnonsSerialises = compagnons.map((compagnon) => ({
    id: compagnon.id,
    nom: compagnon.user?.nom ?? compagnon.nom,
    prenom: compagnon.user?.prenom ?? compagnon.prenom,
  }))

  const absencesSerialises = absences.map((absence) => ({
    id: absence.id,
    type: absence.type,
    dateDebut: absence.dateDebut.toISOString(),
    dateFin: absence.dateFin.toISOString(),
    nbJours: Number(absence.nbJours ?? 0),
    approuve: absence.approuve,
    notes: absence.notes,
    compagnon: {
      user: {
        nom: absence.compagnon.user?.nom ?? absence.compagnon.nom,
        prenom: absence.compagnon.user?.prenom ?? absence.compagnon.prenom,
      },
    },
  }))

  return (
    <>
      <Header
        title="Rapports"
        description="Valeur vendue, écarts opérationnels, RH et absences"
      />

      <div className={styles.content}>
        <RapportsTabs
          analytiques={(
            <RapportsClient
              fichesMois={fichesMois}
              compagnonStats={Array.from(compagnonStatsMap.values())}
              fichesRecentes={fichesRecentes}
              caTotal={caTotal}
              caAnnee={caAnnee}
              rentabiliteAnnee={rentabiliteAnnee}
              nbFichesAnnee={fichesAnnee.length}
            />
          )}
          rh={(
            <RHClient compagnons={compagnonsSerialises} absences={absencesSerialises} />
          )}
        />
      </div>
    </>
  )
}
