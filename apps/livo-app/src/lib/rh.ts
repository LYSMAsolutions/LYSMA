import { prisma } from '@/lib/prisma'

function startOfReferencePeriod(dateRef: Date) {
  let debut = new Date(dateRef.getFullYear(), 5, 1)

  if (dateRef < debut) {
    debut = new Date(dateRef.getFullYear() - 1, 5, 1)
  }

  return debut
}

export function calcCongesAcquis(dateEntree: Date, dateRef: Date = new Date()): number {
  const entree = new Date(dateEntree)
  const debutPeriode = startOfReferencePeriod(dateRef)
  const debut = entree > debutPeriode ? entree : debutPeriode

  if (debut > dateRef) {
    return 0
  }

  const moisTravailles = Math.max(
    0,
    Math.floor((dateRef.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
  )

  return Math.min(Math.floor(moisTravailles * 2.5), 30)
}

export async function getSoldeConges(compagnonId: string, dateEntree: Date) {
  const now = new Date()
  const acquis = calcCongesAcquis(dateEntree, now)
  const debutPeriode = startOfReferencePeriod(now)

  const absencesPrises = await prisma.absence.findMany({
    where: {
      compagnonId,
      type: 'CONGE_PAYE',
      approuve: true,
      dateDebut: {
        gte: debutPeriode,
      },
    },
  })

  const pris = absencesPrises.reduce((sum, absence) => {
    return sum + Number(absence.nbJours ?? 0)
  }, 0)

  return {
    acquis,
    pris,
    solde: Math.max(0, acquis - pris),
  }
}

export async function getCompteurAbsences(compagnonId: string, annee?: number) {
  const y = annee ?? new Date().getFullYear()
  const debut = new Date(y, 0, 1)
  const fin = new Date(y, 11, 31, 23, 59, 59, 999)

  const absences = await prisma.absence.findMany({
    where: {
      compagnonId,
      dateDebut: {
        gte: debut,
        lte: fin,
      },
    },
  })

  const compteurs: Record<string, number> = {
    CONGE_PAYE: 0,
    RTT: 0,
    ARRET_MALADIE: 0,
    FORMATION: 0,
    CONGE_SANS_SOLDE: 0,
    AUTRE: 0,
  }

  for (const absence of absences) {
    compteurs[absence.type] = (compteurs[absence.type] ?? 0) + Number(absence.nbJours ?? 0)
  }

  return compteurs
}

export async function verifSolde(
  compagnonId: string,
  dateEntree: Date,
  type: string,
  nbJours: number
): Promise<{ ok: boolean; message?: string }> {
  if (type !== 'CONGE_PAYE') {
    return { ok: true }
  }

  const { solde } = await getSoldeConges(compagnonId, dateEntree)

  if (nbJours > solde) {
    return {
      ok: false,
      message: `Solde insuffisant : ${solde}j disponibles, ${nbJours}j demandés`,
    }
  }

  return { ok: true }
}