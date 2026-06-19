import { prisma } from '@/lib/prisma'
import { calculateWorkshopMetrics } from '@/lib/workshop-metrics'

export type WorkshopSourceFilter = 'all' | 'livo' | 'external'

export async function getDashboardData(garageId: string, source: WorkshopSourceFilter = 'all') {
  const now = new Date()
  const debutJour = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const finJour = new Date(debutJour.getTime() + 86400000)
  const debutSemaine = new Date(debutJour)
  debutSemaine.setDate(debutJour.getDate() - debutJour.getDay() + 1)
  const debutMois = new Date(now.getFullYear(), now.getMonth(), 1)
  const includeLivo = source !== 'external'
  const includeExternal = source !== 'livo'

  const taux = await prisma.tauxGarage.findMany({
    where: {
      garageId,
      actif: true,
    },
  })

  const tauxMap = Object.fromEntries(taux.map((t) => [t.type, Number(t.montant)]))

  const tauxMoyen = taux.length
    ? taux.reduce((sum, t) => sum + Number(t.montant), 0) / taux.length
    : 65

  const includeFiche = {
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
  }

  const fichesJour = await prisma.ficheTravaux.findMany({
    where: {
      garageId,
      statut: 'CLOTUREE',
      dateFermeture: {
        gte: debutJour,
        lt: finJour,
      },
    },
    include: includeFiche,
  })

  const fichesSemaine = await prisma.ficheTravaux.findMany({
    where: {
      garageId,
      statut: 'CLOTUREE',
      dateFermeture: {
        gte: debutSemaine,
      },
    },
    include: includeFiche,
  })

  const fichesMois = await prisma.ficheTravaux.findMany({
    where: {
      garageId,
      statut: 'CLOTUREE',
      dateFermeture: {
        gte: debutMois,
      },
    },
    include: includeFiche,
  })

  const externalOrdersPeriode = await prisma.externalWorkOrder.findMany({
    where: {
      garageId,
      status: 'CLOTURE',
      closedAt: { gte: new Date(Math.min(debutSemaine.getTime(), debutMois.getTime())) },
    },
    include: {
      pointages: {
        include: { compagnon: { include: { user: true } } },
      },
    },
  })

  const externalOrdersJour = externalOrdersPeriode.filter((order) => order.closedAt && order.closedAt >= debutJour && order.closedAt < finJour)
  const externalOrdersSemaine = externalOrdersPeriode.filter((order) => order.closedAt && order.closedAt >= debutSemaine)
  const externalOrdersMois = externalOrdersPeriode.filter((order) => order.closedAt && order.closedAt >= debutMois)

  const fichesEnCours = await prisma.ficheTravaux.findMany({
    where: {
      garageId,
      statut: {
        in: ['EN_ATTENTE', 'EN_COURS', 'EN_PAUSE'],
      },
    },
    include: {
      vehicule: true,
      pointagesFiche: {
        where: {
          statut: {
            in: ['EN_COURS', 'EN_PAUSE'],
          },
        },
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
      dateOuverture: 'desc',
    },
    take: 6,
  })

  const fichesTermineesNonCloturees = await prisma.ficheTravaux.findMany({
    where: {
      garageId,
      statut: 'TERMINEE',
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
      updatedAt: 'desc',
    },
    take: 6,
  })

  const repartitionFiches = await prisma.ficheTravaux.groupBy({
    by: ['statut'],
    where: {
      garageId,
      statut: {
        in: ['EN_ATTENTE', 'EN_COURS', 'EN_PAUSE', 'TERMINEE'],
      },
    },
    _count: {
      _all: true,
    },
  })

  const vehiculesAtelier = await prisma.ficheTravaux.findMany({
    where: {
      garageId,
      statut: {
        in: ['EN_ATTENTE', 'EN_COURS', 'EN_PAUSE', 'TERMINEE'],
      },
    },
    distinct: ['vehiculeId'],
    select: {
      vehiculeId: true,
    },
  })

  const pointagesJour = await prisma.pointageJour.findMany({
    where: {
      date: debutJour,
      compagnon: {
        garageId,
      },
    },
    include: {
      compagnon: {
        include: {
          user: true,
        },
      },
    },
  })

  const compagnons = await prisma.compagnon.findMany({
    where: {
      garageId,
      actif: true,
    },
    include: {
      user: true,
    },
    orderBy: [
      {
        prenom: 'asc',
      },
      {
        nom: 'asc',
      },
    ],
  })

  const pointagesFicheActifs = await prisma.pointageFiche.findMany({
    where: {
      statut: {
        in: ['EN_COURS', 'EN_PAUSE'],
      },
      fiche: {
        garageId,
        statut: {
          in: ['EN_COURS', 'EN_PAUSE'],
        },
      },
    },
    include: {
      compagnon: {
        include: {
          user: true,
        },
      },
      fiche: {
        include: {
          vehicule: true,
        },
      },
    },
    orderBy: {
      debutAt: 'desc',
    },
  })

  const pointagesExternalActifs = await prisma.externalWorkOrderPointage.findMany({
    where: {
      statut: { in: ['EN_COURS', 'EN_PAUSE'] },
      externalWorkOrder: {
        garageId,
        status: { in: ['OUVERT', 'EN_COURS', 'EN_PAUSE', 'TERMINE'] },
      },
    },
    include: {
      compagnon: { include: { user: true } },
      externalWorkOrder: true,
    },
    orderBy: { debutAt: 'desc' },
  })

  const garage = await prisma.garage.findUnique({
    where: {
      id: garageId,
    },
    select: {
      statutJour: true,
    },
  })

  function calcRentabilite(fiche: (typeof fichesJour)[number]) {
    const tauxF = fiche.tauxApplique ? tauxMap[fiche.tauxApplique] ?? tauxMoyen : tauxMoyen
    const tFacture = Number(fiche.tempsFacture ?? 0)
    const tReel = Number(fiche.tempsReel ?? fiche.tempsFacture ?? 0)
    const montantFacture = fiche.montantHT ? Number(fiche.montantHT) : tFacture * tauxF
    const montantReel = tReel * tauxF
    const delta = montantFacture - montantReel

    return {
      tFacture,
      tReel,
      montantFacture,
      montantReel,
      delta,
      tauxF,
    }
  }

  function calcCA(fiches: typeof fichesJour) {
    return fiches.reduce((sum, fiche) => sum + calcRentabilite(fiche).montantFacture, 0)
  }

  function calcRentabiliteGlobale(fiches: typeof fichesJour) {
    return fiches.reduce((sum, fiche) => sum + calcRentabilite(fiche).delta, 0)
  }

  function calcExternalMetrics(order: (typeof externalOrdersPeriode)[number]) {
    const actualMinutes = order.pointages.reduce((sum, pointage) => sum + (pointage.dureeMinutes ?? 0), 0)
    return calculateWorkshopMetrics({
      plannedHours: order.plannedHours ? Number(order.plannedHours) : null,
      soldHours: order.soldHours ? Number(order.soldHours) : null,
      billedHours: order.billedHours ? Number(order.billedHours) : null,
      actualMinutes,
      billedAmountHT: order.billedAmountHT ? Number(order.billedAmountHT) : null,
      laborAmountHT: order.laborAmountHT ? Number(order.laborAmountHT) : null,
      billingHourlyRateHT: order.billingHourlyRateHT ? Number(order.billingHourlyRateHT) : null,
      internalLaborCostRateHT: order.internalLaborCostRateHT ? Number(order.internalLaborCostRateHT) : null,
    })
  }

  const rentabiliteParCompagnon = (includeLivo ? fichesMois : []).reduce(
    (acc, fiche) => {
      const rentabilite = calcRentabilite(fiche)
      const repartition = new Map<string, {
        pointage: (typeof fiche.pointagesFiche)[number]
        minutes: number
      }>()

      for (const pointage of fiche.pointagesFiche) {
        const existing = repartition.get(pointage.compagnonId)
        repartition.set(pointage.compagnonId, {
          pointage,
          minutes: (existing?.minutes ?? 0) + (pointage.dureeMinutes ?? 0),
        })
      }

      if (repartition.size === 0) {
        return acc
      }

      const totalMinutes = Array.from(repartition.values()).reduce((sum, item) => sum + item.minutes, 0)

      for (const [compagnonId, item] of repartition) {
        const compagnon = item.pointage.compagnon
        const nom = `${compagnon.user?.prenom ?? compagnon.prenom ?? ''} ${compagnon.user?.nom ?? compagnon.nom ?? ''}`.trim()
        const weight = totalMinutes > 0 ? item.minutes / totalMinutes : 1 / repartition.size

        if (!acc[compagnonId]) {
          acc[compagnonId] = {
            id: compagnonId,
            nom: nom || 'Compagnon',
            delta: 0,
            tFacture: 0,
            tReel: 0,
            nbFiches: 0,
          }
        }

        acc[compagnonId].delta += rentabilite.delta * weight
        acc[compagnonId].tFacture += rentabilite.tFacture * weight
        acc[compagnonId].tReel += rentabilite.tReel * weight
        acc[compagnonId].nbFiches += 1
      }

      return acc
    },
    {} as Record<
      string,
      {
        id: string
        nom: string
        delta: number
        tFacture: number
        tReel: number
        nbFiches: number
      }
    >
  )

  if (includeExternal) {
    for (const order of externalOrdersMois) {
      const metrics = calcExternalMetrics(order)
      const repartition = new Map<string, { pointage: (typeof order.pointages)[number]; minutes: number }>()
      for (const pointage of order.pointages) {
        const existing = repartition.get(pointage.compagnonId)
        repartition.set(pointage.compagnonId, {
          pointage,
          minutes: (existing?.minutes ?? 0) + (pointage.dureeMinutes ?? 0),
        })
      }
      const totalMinutes = Array.from(repartition.values()).reduce((sum, item) => sum + item.minutes, 0)
      for (const [compagnonId, item] of repartition) {
        const compagnon = item.pointage.compagnon
        const weight = totalMinutes > 0 ? item.minutes / totalMinutes : 1 / Math.max(1, repartition.size)
        const existing = rentabiliteParCompagnon[compagnonId] ?? {
          id: compagnonId,
          nom: `${compagnon.user?.prenom ?? compagnon.prenom} ${compagnon.user?.nom ?? compagnon.nom}`.trim() || 'Compagnon',
          delta: 0,
          tFacture: 0,
          tReel: 0,
          nbFiches: 0,
        }
        existing.delta += (metrics.laborMarginHT ?? 0) * weight
        existing.tFacture += (metrics.billedHours ?? 0) * weight
        existing.tReel += metrics.actualHours * weight
        existing.nbFiches += 1
        rentabiliteParCompagnon[compagnonId] = existing
      }
    }
  }

  const nativeJour = includeLivo ? fichesJour : []
  const nativeSemaine = includeLivo ? fichesSemaine : []
  const nativeMois = includeLivo ? fichesMois : []
  const externalJour = includeExternal ? externalOrdersJour : []
  const externalSemaine = includeExternal ? externalOrdersSemaine : []
  const externalMois = includeExternal ? externalOrdersMois : []

  const rentabiliteJour = calcRentabiliteGlobale(nativeJour) + externalJour.reduce((sum, order) => sum + (calcExternalMetrics(order).laborMarginHT ?? 0), 0)
  const rentabiliteSemaine = calcRentabiliteGlobale(nativeSemaine) + externalSemaine.reduce((sum, order) => sum + (calcExternalMetrics(order).laborMarginHT ?? 0), 0)
  const rentabiliteMois = calcRentabiliteGlobale(nativeMois) + externalMois.reduce((sum, order) => sum + (calcExternalMetrics(order).laborMarginHT ?? 0), 0)

  const tempsFactureJour = nativeJour.reduce((sum, fiche) => sum + Number(fiche.tempsFacture ?? 0), 0)
    + externalJour.reduce((sum, order) => sum + (calcExternalMetrics(order).billedHours ?? 0), 0)
  const tempsReelJour = nativeJour.reduce((sum, fiche) => sum + Number(fiche.tempsReel ?? fiche.tempsFacture ?? 0), 0)
    + externalJour.reduce((sum, order) => sum + calcExternalMetrics(order).actualHours, 0)

  const compagnonsActifs = pointagesJour.filter(
    (pointage) => !['ABSENT', 'PARTI'].includes(pointage.statutActuel)
  ).length

  const pointageJourParCompagnon = new Map(pointagesJour.map((pointage) => [pointage.compagnonId, pointage]))
  const pointageFicheParCompagnon = new Map<string, (typeof pointagesFicheActifs)[number]>()
  const pointageExternalParCompagnon = new Map<string, (typeof pointagesExternalActifs)[number]>()

  for (const pointageFiche of pointagesFicheActifs) {
    if (!pointageFicheParCompagnon.has(pointageFiche.compagnonId)) {
      pointageFicheParCompagnon.set(pointageFiche.compagnonId, pointageFiche)
    }
  }

  for (const pointageExternal of pointagesExternalActifs) {
    if (!pointageExternalParCompagnon.has(pointageExternal.compagnonId)) {
      pointageExternalParCompagnon.set(pointageExternal.compagnonId, pointageExternal)
    }
  }

  function minutesDepuis(date: Date | null | undefined) {
    if (!date) return null
    return Math.max(0, Math.floor((now.getTime() - date.getTime()) / 60000))
  }

  function nomCompagnon(compagnon: (typeof compagnons)[number]) {
    return `${compagnon.user?.prenom ?? compagnon.prenom ?? ''} ${compagnon.user?.nom ?? compagnon.nom ?? ''}`.trim() || 'Compagnon'
  }

  const atelierLive = compagnons.map((compagnon) => {
    const pointageJour = pointageJourParCompagnon.get(compagnon.id)
    const pointageFiche = pointageFicheParCompagnon.get(compagnon.id)
    const pointageExternal = pointageExternalParCompagnon.get(compagnon.id)
    const statutJour = pointageJour?.statutActuel ?? 'ABSENT'
    const enPauseJour = ['PAUSE_CAFE', 'PAUSE_DEJEUNER'].includes(statutJour)
    const parti = statutJour === 'PARTI'
    const absent = statutJour === 'ABSENT'
    const enPauseFiche = pointageFiche?.statut === 'EN_PAUSE' || pointageExternal?.statut === 'EN_PAUSE'
    const travaille = Boolean(pointageFiche || pointageExternal) && !enPauseFiche
    const inactif = !pointageFiche && !pointageExternal && !absent && !parti && !enPauseJour

    const depuis = pointageFiche?.debutAt ?? pointageExternal?.debutAt ?? pointageJour?.heureArrivee ?? null

    return {
      id: compagnon.id,
      nom: nomCompagnon(compagnon),
      poste: compagnon.poste,
      statutJour,
      statutLabel: travaille
        ? 'En travail'
        : enPauseFiche || enPauseJour
          ? 'En pause'
          : parti
            ? 'Parti'
            : absent
              ? 'Absent'
              : 'Disponible',
      tone: travaille ? 'work' : enPauseFiche || enPauseJour ? 'pause' : parti ? 'done' : absent ? 'absent' : 'inactive',
      depuisMinutes: minutesDepuis(depuis),
      fiche: pointageFiche
        ? {
            id: pointageFiche.fiche.id,
            numero: pointageFiche.fiche.numero,
            statut: pointageFiche.fiche.statut,
            travaux: pointageFiche.fiche.travaux.split('\n')[0],
            vehicule: `${pointageFiche.fiche.vehicule.marque} ${pointageFiche.fiche.vehicule.modele}`,
            immatriculation: pointageFiche.fiche.vehicule.immatriculation,
          }
        : pointageExternal
          ? {
              id: pointageExternal.externalWorkOrder.id,
              numero: pointageExternal.externalWorkOrder.externalNumber,
              statut: pointageExternal.externalWorkOrder.status,
              travaux: pointageExternal.externalWorkOrder.operation?.split('\n')[0] || 'Ordre de réparation externe',
              vehicule: pointageExternal.externalWorkOrder.vehicleLabel || 'Véhicule',
              immatriculation: pointageExternal.externalWorkOrder.immatriculation,
            }
          : null,
      heureArrivee: pointageJour?.heureArrivee,
    }
  })

  const compagnonsInactifs = atelierLive.filter((compagnon) => compagnon.tone === 'inactive')
  const fichesLongues = [
    ...pointagesFicheActifs.map((pointage) => ({ debutAt: pointage.debutAt, numero: pointage.fiche.numero })),
    ...pointagesExternalActifs.map((pointage) => ({ debutAt: pointage.debutAt, numero: pointage.externalWorkOrder.externalNumber })),
  ].filter((pointage) => (minutesDepuis(pointage.debutAt) ?? 0) >= 240)

  const alertes = [
    ...(compagnonsInactifs.length > 0
      ? [
          {
            type: 'warning' as const,
            titre: `${compagnonsInactifs.length} compagnon${compagnonsInactifs.length > 1 ? 's' : ''} présent${compagnonsInactifs.length > 1 ? 's' : ''} sans fiche active`,
            detail: compagnonsInactifs.map((compagnon) => compagnon.nom).join(', '),
          },
        ]
      : []),
    ...(fichesTermineesNonCloturees.length > 0
      ? [
          {
            type: 'action' as const,
            titre: `${fichesTermineesNonCloturees.length} fiche${fichesTermineesNonCloturees.length > 1 ? 's' : ''} à clôturer`,
            detail: fichesTermineesNonCloturees.map((fiche) => fiche.numero).join(', '),
          },
        ]
      : []),
    ...(fichesLongues.length > 0
      ? [
          {
            type: 'info' as const,
            titre: `${fichesLongues.length} intervention${fichesLongues.length > 1 ? 's' : ''} ouverte${fichesLongues.length > 1 ? 's' : ''} depuis plus de 4 h`,
            detail: fichesLongues.map((pointage) => pointage.numero).join(', '),
          },
        ]
      : []),
    ...(garage?.statutJour === 'OUVERT' && pointagesJour.length === 0
      ? [
          {
            type: 'warning' as const,
            titre: 'Atelier ouvert sans pointage',
            detail: 'Aucun compagnon n’a encore pointé aujourd’hui.',
          },
        ]
      : []),
  ]

  const statutCount = Object.fromEntries(repartitionFiches.map((item) => [item.statut, item._count._all]))

  return {
    source,
    caJour: calcCA(nativeJour) + externalJour.reduce((sum, order) => sum + (calcExternalMetrics(order).billedAmountHT ?? 0), 0),
    caSemaine: calcCA(nativeSemaine) + externalSemaine.reduce((sum, order) => sum + (calcExternalMetrics(order).billedAmountHT ?? 0), 0),
    caMois: calcCA(nativeMois) + externalMois.reduce((sum, order) => sum + (calcExternalMetrics(order).billedAmountHT ?? 0), 0),
    rentabiliteJour,
    rentabiliteSemaine,
    rentabiliteMois,
    tempsFactureJour,
    tempsReelJour,
    compagnonsActifs,
    fichesEnCours: includeLivo ? fichesEnCours : [],
    fichesTermineesNonCloturees,
    fichesTermineesJour: nativeJour.length + externalJour.length,
    vehiculesAtelier: (includeLivo ? vehiculesAtelier.length : 0)
      + (includeExternal ? new Set(pointagesExternalActifs.map((pointage) => pointage.externalWorkOrderId)).size : 0),
    atelierLive,
    alertes,
    fluxAtelier: {
      enAttente: statutCount.EN_ATTENTE ?? 0,
      enCours: statutCount.EN_COURS ?? 0,
      enPause: statutCount.EN_PAUSE ?? 0,
      aCloturer: statutCount.TERMINEE ?? 0,
    },
    presence: {
      presents: atelierLive.filter((compagnon) => !['absent', 'done'].includes(compagnon.tone)).length,
      enTravail: atelierLive.filter((compagnon) => compagnon.tone === 'work').length,
      enPause: atelierLive.filter((compagnon) => compagnon.tone === 'pause').length,
      disponibles: atelierLive.filter((compagnon) => compagnon.tone === 'inactive').length,
      absents: atelierLive.filter((compagnon) => compagnon.tone === 'absent').length,
    },
    rentabiliteParCompagnon: Object.values(rentabiliteParCompagnon),
    rentabiliteFichesJour: [
      ...nativeJour.map((fiche) => ({
        id: fiche.id,
        numero: fiche.numero,
        vehicule: `${fiche.vehicule.marque} ${fiche.vehicule.modele}`,
        source: 'Fiche LIVO',
        ...calcRentabilite(fiche),
      })),
      ...externalJour.map((order) => {
        const metrics = calcExternalMetrics(order)
        return {
          id: order.id,
          numero: order.externalNumber,
          vehicule: order.vehicleLabel || 'Véhicule',
          source: 'OR externe',
          tFacture: metrics.billedHours ?? 0,
          tReel: metrics.actualHours,
          montantFacture: metrics.billedAmountHT ?? 0,
          montantReel: metrics.estimatedLaborCostHT ?? 0,
          delta: metrics.laborMarginHT ?? 0,
          tauxF: metrics.billingHourlyRateHT ?? 0,
        }
      }),
    ],
  }
}
