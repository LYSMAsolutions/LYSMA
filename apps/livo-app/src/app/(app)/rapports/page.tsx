import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { RHClient } from '@/components/rh/RHClient/RHClient'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function RHPage() {
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

  const compagnons = await prisma.compagnon.findMany({
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
  })

  const absences = await prisma.absence.findMany({
    where: {
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
        title="RH & Absences"
        description="Suivi des congés, arrêts et formations"
      />

      <div className={styles.content}>
        <RHClient compagnons={compagnonsSerialises} absences={absencesSerialises} />
      </div>
    </>
  )
}