import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { ParametresClient } from '@/components/parametres/ParametresClient/ParametresClient'
import styles from './page.module.css'

export const revalidate = 0

export default async function ParametresPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/connexion')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { garages: { take: 1 } },
  })

  const garage = user?.garages[0]
  if (!garage) redirect('/dashboard')

  const [taux, compagnons] = await Promise.all([
    prisma.tauxGarage.findMany({ where: { garageId: garage.id }, orderBy: { type: 'asc' } }),
    prisma.compagnon.findMany({
      where: { garageId: garage.id, actif: true },
      include: { user: true },
      orderBy: { user: { nom: 'asc' } },
    }),
  ])

  return (
    <>
      <Header title="Paramètres" description="Configuration de votre garage" />
      <div className={styles.content}>
        <ParametresClient
          garage={{
            id: garage.id,
            nom: garage.nom,
            adresse: garage.adresse,
            codePostal: garage.codePostal,
            ville: garage.ville,
            telephone: garage.telephone,
            email: garage.email,
            siret: garage.siret,
          }}
          taux={taux.map(t => ({
            id: t.id,
            type: t.type as 'T1'|'T2'|'T3'|'T4'|'CARROSSERIE'|'PEINTURE'|'AUTRE',
            libelle: t.libelle,
            montant: Number(t.montant),
            actif: t.actif,
          }))}
          compagnons={compagnons.map(c => ({
            id: c.id,
            prenom: c.user?.prenom ?? c.prenom,
            nom: c.user?.nom ?? c.nom,
            poste: c.poste,
            hasPin: !!c.pin,
          }))}
        />
      </div>
    </>
  )
}
