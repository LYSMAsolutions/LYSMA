import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPrimaryGarageForUser } from '@/lib/garage'
import { prisma } from '@/lib/prisma'

function companionName(compagnon: {
  nom: string
  prenom: string
  user: { nom: string; prenom: string } | null
}) {
  return `${compagnon.user?.prenom ?? compagnon.prenom} ${compagnon.user?.nom ?? compagnon.nom}`.trim()
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const garage = await getPrimaryGarageForUser(session.user.id)
  if (!garage) {
    return NextResponse.json({ notifications: [] })
  }

  const since = new Date(Date.now() - 1000 * 60 * 60 * 24)

  const [pointagesJour, pointagesFiche, fichesTerminees, absences] = await Promise.all([
    prisma.pointageJour.findMany({
      where: {
        updatedAt: { gte: since },
        compagnon: { garageId: garage.id },
      },
      include: { compagnon: { include: { user: true } } },
      orderBy: { updatedAt: 'desc' },
      take: 8,
    }),
    prisma.pointageFiche.findMany({
      where: {
        updatedAt: { gte: since },
        fiche: { garageId: garage.id },
      },
      include: {
        compagnon: { include: { user: true } },
        fiche: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 8,
    }),
    prisma.ficheTravaux.findMany({
      where: {
        garageId: garage.id,
        statut: 'TERMINEE',
        updatedAt: { gte: since },
      },
      orderBy: { updatedAt: 'desc' },
      take: 4,
    }),
    prisma.absence.findMany({
      where: {
        approuve: false,
        compagnon: { garageId: garage.id },
      },
      include: { compagnon: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
  ])

  const notifications = [
    ...pointagesJour.flatMap((pointage) => {
      const nom = companionName(pointage.compagnon)
      const items = []

      if (pointage.heureArrivee) {
        items.push({
          id: `jour-arrivee-${pointage.id}`,
          title: `${nom} a pointe son arrivee`,
          createdAt: pointage.heureArrivee.toISOString(),
          href: `/compagnons/${pointage.compagnonId}`,
        })
      }

      if (pointage.heureDepart) {
        items.push({
          id: `jour-depart-${pointage.id}`,
          title: `${nom} a pointe son depart`,
          createdAt: pointage.heureDepart.toISOString(),
          href: `/compagnons/${pointage.compagnonId}`,
        })
      }

      return items
    }),
    ...pointagesFiche.map((pointage) => ({
      id: `fiche-${pointage.id}-${pointage.statut}`,
      title:
        pointage.statut === 'TERMINE'
          ? `${companionName(pointage.compagnon)} a depointe de ${pointage.fiche.numero}`
          : `${companionName(pointage.compagnon)} a pointe sur ${pointage.fiche.numero}`,
      createdAt: pointage.updatedAt.toISOString(),
      href: `/fiches/${pointage.ficheId}`,
    })),
    ...fichesTerminees.map((fiche) => ({
      id: `terminee-${fiche.id}`,
      title: `${fiche.numero} est terminee`,
      createdAt: fiche.updatedAt.toISOString(),
      href: `/fiches/${fiche.id}`,
    })),
    ...absences.map((absence) => ({
      id: `absence-${absence.id}`,
      title: `Absence a valider pour ${companionName(absence.compagnon)}`,
      createdAt: absence.createdAt.toISOString(),
      href: '/rapports',
    })),
  ]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 12)

  return NextResponse.json({ notifications })
}
