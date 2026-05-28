import { NextRequest, NextResponse } from 'next/server'
import { getPrimaryGarageForUser } from '@/lib/garage'
import { prisma } from '@/lib/prisma'
import { requireSecureSession } from '@/lib/security/secure-session'

export async function GET(req: NextRequest) {
  const { session, response } = await requireSecureSession()
  if (response) return response

  const garage = await getPrimaryGarageForUser(session.user.id)
  if (!garage) {
    return NextResponse.json({ results: [] })
  }

  const q = new URL(req.url).searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const [vehicules, fiches, compagnons] = await Promise.all([
    prisma.vehicule.findMany({
      where: {
        garageId: garage.id,
        OR: [
          { immatriculation: { contains: q, mode: 'insensitive' } },
          { marque: { contains: q, mode: 'insensitive' } },
          { modele: { contains: q, mode: 'insensitive' } },
          { clientNom: { contains: q, mode: 'insensitive' } },
          { clientPrenom: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
    prisma.ficheTravaux.findMany({
      where: {
        garageId: garage.id,
        OR: [
          { numero: { contains: q, mode: 'insensitive' } },
          { travaux: { contains: q, mode: 'insensitive' } },
          { vehicule: { immatriculation: { contains: q, mode: 'insensitive' } } },
          { vehicule: { marque: { contains: q, mode: 'insensitive' } } },
          { vehicule: { modele: { contains: q, mode: 'insensitive' } } },
        ],
      },
      include: { vehicule: true },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
    prisma.compagnon.findMany({
      where: {
        garageId: garage.id,
        actif: true,
        OR: [
          { nom: { contains: q, mode: 'insensitive' } },
          { prenom: { contains: q, mode: 'insensitive' } },
          { user: { nom: { contains: q, mode: 'insensitive' } } },
          { user: { prenom: { contains: q, mode: 'insensitive' } } },
        ],
      },
      include: { user: true },
      orderBy: [{ prenom: 'asc' }, { nom: 'asc' }],
      take: 5,
    }),
  ])

  const pages = [
    { id: 'dashboard', title: 'Tableau de bord', subtitle: 'Vue générale', href: '/dashboard' },
    { id: 'atelier', title: 'Atelier', subtitle: 'Pointages et fiches actives', href: '/atelier' },
    { id: 'compagnons', title: 'Compagnons', subtitle: 'Équipe', href: '/compagnons' },
    { id: 'vehicules', title: 'Véhicules', subtitle: 'Parc clients', href: '/vehicules' },
    { id: 'rh', title: 'RH', subtitle: 'Absences et congés', href: '/rapports' },
    { id: 'parametres', title: 'Paramètres', subtitle: 'Configuration', href: '/parametres' },
  ].filter((page) =>
    `${page.title} ${page.subtitle}`.toLowerCase().includes(q.toLowerCase())
  )

  return NextResponse.json({
    results: [
      ...pages.map((page) => ({ ...page, type: 'page' })),
      ...vehicules.map((vehicule) => ({
        id: vehicule.id,
        type: 'vehicule',
        title: `${vehicule.marque} ${vehicule.modele}`,
        subtitle: [vehicule.immatriculation, `${vehicule.clientPrenom ?? ''} ${vehicule.clientNom}`.trim()]
          .filter(Boolean)
          .join(' · '),
        href: `/vehicules/${vehicule.id}`,
      })),
      ...fiches.map((fiche) => ({
        id: fiche.id,
        type: 'fiche',
        title: fiche.numero,
        subtitle: `${fiche.vehicule.marque} ${fiche.vehicule.modele}`,
        href: `/fiches/${fiche.id}`,
      })),
      ...compagnons.map((compagnon) => ({
        id: compagnon.id,
        type: 'compagnon',
        title:
          `${compagnon.user?.prenom ?? compagnon.prenom} ${compagnon.user?.nom ?? compagnon.nom}`.trim() ||
          'Compagnon',
        subtitle: compagnon.poste ?? 'Compagnon',
        href: `/compagnons/${compagnon.id}`,
      })),
    ],
  })
}
