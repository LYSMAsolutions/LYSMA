import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPrimaryGarageForUser } from '@/lib/garage'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { RapportsClient } from '@/components/rapports/RapportsClient/RapportsClient'
import { RapportsTabs } from '@/components/rapports/RapportsTabs/RapportsTabs'
import { RHClient } from '@/components/rh/RHClient/RHClient'
import { calculateWorkshopMetrics } from '@/lib/workshop-metrics'
import Link from 'next/link'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function vehicleLabel(vehicule: { marque: string | null; modele: string | null; immatriculation: string | null }) {
  const label = [vehicule.marque, vehicule.modele].filter(Boolean).join(' ').trim()
  return label || vehicule.immatriculation || 'Véhicule'
}

export default async function RapportsPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/connexion')
  }

  const garage = await getPrimaryGarageForUser(session.user.id)

  if (!garage) {
    redirect('/dashboard')
  }

  const requestedSource = (await searchParams).source
  const source = requestedSource === 'livo' || requestedSource === 'external' ? requestedSource : 'all'

  const now = new Date()
  const debutMois = new Date(now.getFullYear(), now.getMonth(), 1)
  const debutAnnee = new Date(now.getFullYear(), 0, 1)
  const debutDouzeMois = new Date(now.getFullYear(), now.getMonth() - 11, 1)

  const [
    compagnons,
    absences,
    fichesCloturees,
    externalOrders,
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
    prisma.externalWorkOrder.findMany({
      where: {
        garageId: garage.id,
        status: 'CLOTURE',
        closedAt: { gte: debutDouzeMois },
      },
      include: {
        pointages: { include: { compagnon: { include: { user: true } } } },
      },
      orderBy: { closedAt: 'asc' },
    }),
    prisma.tauxGarage.findMany({
      where: {
        garageId: garage.id,
        actif: true,
      },
    }),
  ])

  const fichesSelectionnees = source === 'external' ? [] : fichesCloturees
  const externalSelectionnes = source === 'livo' ? [] : externalOrders

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

  function calcExternal(order: (typeof externalOrders)[number]) {
    const actualMinutes = order.pointages.reduce((sum, pointage) => sum + (pointage.dureeMinutes ?? 0), 0)
    const metrics = calculateWorkshopMetrics({
      plannedHours: order.plannedHours ? Number(order.plannedHours) : null,
      soldHours: order.soldHours ? Number(order.soldHours) : null,
      billedHours: order.billedHours ? Number(order.billedHours) : null,
      actualMinutes,
      billedAmountHT: order.billedAmountHT ? Number(order.billedAmountHT) : null,
      laborAmountHT: order.laborAmountHT ? Number(order.laborAmountHT) : null,
      billingHourlyRateHT: order.billingHourlyRateHT ? Number(order.billingHourlyRateHT) : null,
      internalLaborCostRateHT: order.internalLaborCostRateHT ? Number(order.internalLaborCostRateHT) : null,
    })
    return {
      tempsFacture: metrics.billedHours ?? 0,
      tempsReel: metrics.actualHours,
      montantFacture: metrics.billedAmountHT ?? 0,
      delta: metrics.laborMarginHT ?? 0,
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

  for (const fiche of fichesSelectionnees) {
    if (!fiche.dateFermeture) continue

    const index = moisIndex.get(monthKey(fiche.dateFermeture))
    if (index === undefined) continue

    const rentabilite = calcRentabilite(fiche)
    fichesMois[index].ca += rentabilite.montantFacture
    fichesMois[index].rentabilite += rentabilite.delta
    fichesMois[index].nbFiches += 1
  }


  for (const order of externalSelectionnes) {
    if (!order.closedAt) continue
    const index = moisIndex.get(monthKey(order.closedAt))
    if (index === undefined) continue
    const metrics = calcExternal(order)
    fichesMois[index].ca += metrics.montantFacture
    fichesMois[index].rentabilite += metrics.delta
    fichesMois[index].nbFiches += 1
  }

  const fichesAnnee = fichesSelectionnees.filter((fiche) =>
    fiche.dateFermeture && fiche.dateFermeture >= debutAnnee
  )
  const fichesMoisActuel = fichesSelectionnees.filter((fiche) =>
    fiche.dateFermeture && fiche.dateFermeture >= debutMois
  )

  const externalAnnee = externalSelectionnes.filter((order) => order.closedAt && order.closedAt >= debutAnnee)
  const externalMoisActuel = externalSelectionnes.filter((order) => order.closedAt && order.closedAt >= debutMois)
  const caTotal = fichesSelectionnees.reduce((sum, fiche) => sum + calcRentabilite(fiche).montantFacture, 0)
    + externalSelectionnes.reduce((sum, order) => sum + calcExternal(order).montantFacture, 0)
  const caAnnee = fichesAnnee.reduce((sum, fiche) => sum + calcRentabilite(fiche).montantFacture, 0)
    + externalAnnee.reduce((sum, order) => sum + calcExternal(order).montantFacture, 0)
  const rentabiliteAnnee = fichesAnnee.reduce((sum, fiche) => sum + calcRentabilite(fiche).delta, 0)
    + externalAnnee.reduce((sum, order) => sum + calcExternal(order).delta, 0)

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

  for (const order of externalMoisActuel) {
    const metrics = calcExternal(order)
    const repartition = new Map<string, {
      compagnon: (typeof order.pointages)[number]['compagnon']
      minutes: number
    }>()
    for (const pointage of order.pointages) {
      const existing = repartition.get(pointage.compagnonId)
      repartition.set(pointage.compagnonId, {
        compagnon: pointage.compagnon,
        minutes: (existing?.minutes ?? 0) + (pointage.dureeMinutes ?? 0),
      })
    }
    const totalMinutes = Array.from(repartition.values()).reduce((sum, item) => sum + item.minutes, 0)
    for (const [compagnonId, item] of repartition) {
      const existing = compagnonStatsMap.get(compagnonId) ?? {
        id: compagnonId,
        nom: item.compagnon.user?.nom ?? item.compagnon.nom,
        prenom: item.compagnon.user?.prenom ?? item.compagnon.prenom,
        poste: item.compagnon.poste,
        nbFiches: 0,
        tFacture: 0,
        tReel: 0,
        delta: 0,
        ca: 0,
      }
      const weight = totalMinutes > 0 ? item.minutes / totalMinutes : 1 / Math.max(1, repartition.size)
      existing.nbFiches += 1
      existing.tFacture += metrics.tempsFacture * weight
      existing.tReel += metrics.tempsReel * weight
      existing.delta += metrics.delta * weight
      existing.ca += metrics.montantFacture * weight
      compagnonStatsMap.set(compagnonId, existing)
    }
  }

  const fichesRecentesLivo = fichesSelectionnees.map((fiche) => {
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

  const fichesRecentesExternes = externalSelectionnes.map((order) => {
    const metrics = calcExternal(order)
    return {
      id: order.id,
      numero: order.externalNumber,
      vehicule: order.vehicleLabel || order.immatriculation || 'Véhicule',
      clientNom: order.clientName || 'Client non renseigné',
      dateFermeture: order.closedAt?.toISOString() ?? '',
      montantHT: metrics.montantFacture,
      tempsFacture: metrics.tempsFacture,
      tempsReel: metrics.tempsReel,
      delta: metrics.delta,
      tauxApplique: order.tauxApplique,
    }
  })

  const fichesRecentes = [...fichesRecentesLivo, ...fichesRecentesExternes]
    .sort((left, right) => new Date(right.dateFermeture).getTime() - new Date(left.dateFermeture).getTime())
    .slice(0, 8)

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
        description="Valeur vendue, écarts de temps, activité atelier et absences"
      />

      <div className={styles.content}>
        <nav className={styles.sourceFilters} aria-label="Source des activités">
          <Link href="/rapports" className={source === 'all' ? styles.sourceFilterActive : ''}>Toutes les activités</Link>
          <Link href="/rapports?source=livo" className={source === 'livo' ? styles.sourceFilterActive : ''}>Fiches LIVO</Link>
          <Link href="/rapports?source=external" className={source === 'external' ? styles.sourceFilterActive : ''}>OR externes</Link>
        </nav>
        <RapportsTabs
          analytiques={(
            <RapportsClient
              fichesMois={fichesMois}
              compagnonStats={Array.from(compagnonStatsMap.values())}
              fichesRecentes={fichesRecentes}
              caTotal={caTotal}
              caAnnee={caAnnee}
              rentabiliteAnnee={rentabiliteAnnee}
              nbFichesAnnee={fichesAnnee.length + externalAnnee.length}
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
