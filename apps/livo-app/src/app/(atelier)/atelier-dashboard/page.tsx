import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AtelierDashboardClient } from '@/components/atelier/AtelierDashboard/AtelierDashboardClient'

export const revalidate = 0

export default async function AtelierDashboardPage() {
  const cookieStore = await cookies()
  const garageId = cookieStore.get('atelier-garage-id')?.value
  const compagnonId = cookieStore.get('atelier-compagnon-id')?.value

  if (!garageId) redirect('/atelier-login')

  const today = new Date(); today.setHours(0,0,0,0)

  const [garage, compagnons, fiches] = await Promise.all([
    prisma.garage.findUnique({ where: { id: garageId } }),
    prisma.compagnon.findMany({
      where: { garageId, actif: true },
      orderBy: { prenom: 'asc' },
    }),
    prisma.ficheTravaux.findMany({
      where: {
        garageId,
        statut: { in: ['EN_ATTENTE', 'EN_COURS', 'EN_PAUSE', 'TERMINEE'] },
      },
      include: {
        vehicule: true,
        pointagesFiche: {
          where: { statut: { in: ['EN_COURS', 'EN_PAUSE'] } },
          include: { compagnon: true },
        },
      },
      orderBy: { dateOuverture: 'desc' },
    }),
  ])

  if (!garage) redirect('/atelier-login')

  // Pointages du jour pour tous les compagnons
  const pointagesJour = await prisma.pointageJour.findMany({
    where: {
      date: today,
      compagnon: { garageId },
    },
    include: { compagnon: true },
  })

  const compagnonsSerialises = compagnons.map(c => {
    const ptj = pointagesJour.find(p => p.compagnonId === c.id)
    return {
      id: c.id,
      prenom: c.prenom,
      nom: c.nom,
      poste: c.poste,
      hasPin: !!c.pin,
      statut: ptj?.statutActuel ?? 'ABSENT',
      heureArrivee: ptj?.heureArrivee?.toISOString() ?? null,
    }
  })

  const fichesSerialises = fiches.map(f => ({
    id: f.id,
    numero: f.numero,
    statut: f.statut,
    travaux: f.travaux,
    vehicule: `${f.vehicule.marque} ${f.vehicule.modele}`,
    immat: f.vehicule.immatriculation,
    clientNom: f.vehicule.clientNom,
    tempsReel: f.tempsReel ? Number(f.tempsReel) : null,
    pointagesActifs: f.pointagesFiche.map(p => ({
      compagnonId: p.compagnonId,
      compagnonNom: `${p.compagnon.prenom} ${p.compagnon.nom}`,
      debutAt: p.debutAt.toISOString(),
    })),
  }))

  return (
    <AtelierDashboardClient
      garage={{ id: garage.id, nom: garage.nom, statutJour: garage.statutJour }}
      compagnons={compagnonsSerialises}
      fiches={fichesSerialises}
      compagnonConnecteId={compagnonId ?? null}
    />
  )
} 
