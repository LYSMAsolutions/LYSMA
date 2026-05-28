import { prisma } from '@/lib/prisma'

export async function getDashboardData(garageId: string) {
  const now = new Date()
  const debutJour = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const finJour = new Date(debutJour.getTime() + 86400000)
  const debutSemaine = new Date(debutJour)
  debutSemaine.setDate(debutJour.getDate() - debutJour.getDay() + 1)
  const debutMois = new Date(now.getFullYear(), now.getMonth(), 1)

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

  const rentabiliteParCompagnon = fichesMois.reduce(
    (acc, fiche) => {
      const rentabilite = calcRentabilite(fiche)
      const compagnonsUniques = [...new Set(fiche.pointagesFiche.map((p) => p.compagnonId))]

      if (compagnonsUniques.length === 0) {
        return acc
      }

      const deltaParCompagnon = rentabilite.delta / compagnonsUniques.length
      const tReelParCompagnon = rentabilite.tReel / compagnonsUniques.length
      const tFactureParCompagnon = rentabilite.tFacture / compagnonsUniques.length

      for (const compagnonId of compagnonsUniques) {
        const pointageFiche = fiche.pointagesFiche.find((p) => p.compagnonId === compagnonId)

        if (!pointageFiche) {
          continue
        }

        const compagnon = pointageFiche.compagnon
        const nom = `${compagnon.user?.prenom ?? compagnon.prenom ?? ''} ${compagnon.user?.nom ?? compagnon.nom ?? ''}`.trim()

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

        acc[compagnonId].delta += deltaParCompagnon
        acc[compagnonId].tFacture += tFactureParCompagnon
        acc[compagnonId].tReel += tReelParCompagnon
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

  const rentabiliteJour = calcRentabiliteGlobale(fichesJour)
  const rentabiliteSemaine = calcRentabiliteGlobale(fichesSemaine)
  const rentabiliteMois = calcRentabiliteGlobale(fichesMois)

  const tempsFactureJour = fichesJour.reduce((sum, fiche) => sum + Number(fiche.tempsFacture ?? 0), 0)
  const tempsReelJour = fichesJour.reduce((sum, fiche) => sum + Number(fiche.tempsReel ?? fiche.tempsFacture ?? 0), 0)

  const compagnonsActifs = pointagesJour.filter(
    (pointage) => !['ABSENT', 'PARTI'].includes(pointage.statutActuel)
  ).length

  const pointageJourParCompagnon = new Map(pointagesJour.map((pointage) => [pointage.compagnonId, pointage]))
  const pointageFicheParCompagnon = new Map<string, (typeof pointagesFicheActifs)[number]>()

  for (const pointageFiche of pointagesFicheActifs) {
    if (!pointageFicheParCompagnon.has(pointageFiche.compagnonId)) {
      pointageFicheParCompagnon.set(pointageFiche.compagnonId, pointageFiche)
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
    const statutJour = pointageJour?.statutActuel ?? 'ABSENT'
    const enPauseJour = ['PAUSE_CAFE', 'PAUSE_DEJEUNER'].includes(statutJour)
    const parti = statutJour === 'PARTI'
    const absent = statutJour === 'ABSENT'
    const enPauseFiche = pointageFiche?.statut === 'EN_PAUSE'
    const travaille = Boolean(pointageFiche) && !enPauseFiche
    const inactif = !pointageFiche && !absent && !parti && !enPauseJour

    const depuis = pointageFiche?.debutAt ?? pointageJour?.heureArrivee ?? null

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
        : null,
      heureArrivee: pointageJour?.heureArrivee,
    }
  })

  const compagnonsInactifs = atelierLive.filter((compagnon) => compagnon.tone === 'inactive')
  const fichesLongues = pointagesFicheActifs.filter((pointage) => (minutesDepuis(pointage.debutAt) ?? 0) >= 240)

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
            detail: fichesLongues.map((pointage) => pointage.fiche.numero).join(', '),
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
    caJour: calcCA(fichesJour),
    caSemaine: calcCA(fichesSemaine),
    caMois: calcCA(fichesMois),
    rentabiliteJour,
    rentabiliteSemaine,
    rentabiliteMois,
    tempsFactureJour,
    tempsReelJour,
    compagnonsActifs,
    fichesEnCours,
    fichesTermineesNonCloturees,
    fichesTermineesJour: fichesJour.length,
    vehiculesAtelier: vehiculesAtelier.length,
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
    rentabiliteFichesJour: fichesJour.map((fiche) => ({
      id: fiche.id,
      numero: fiche.numero,
      vehicule: `${fiche.vehicule.marque} ${fiche.vehicule.modele}`,
      ...calcRentabilite(fiche),
    })),
  }
}
