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
    take: 5,
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
    fichesTermineesJour: fichesJour.length,
    rentabiliteParCompagnon: Object.values(rentabiliteParCompagnon),
    rentabiliteFichesJour: fichesJour.map((fiche) => ({
      id: fiche.id,
      numero: fiche.numero,
      vehicule: `${fiche.vehicule.marque} ${fiche.vehicule.modele}`,
      ...calcRentabilite(fiche),
    })),
  }
}