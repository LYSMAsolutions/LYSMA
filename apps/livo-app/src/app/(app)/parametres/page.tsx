import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPrimaryGarageForUser } from '@/lib/garage'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { ParametresClient } from '@/components/parametres/ParametresClient/ParametresClient'
import styles from './page.module.css'

export const revalidate = 0

export default async function ParametresPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/connexion')

  const garage = await getPrimaryGarageForUser(session.user.id)
  if (!garage) redirect('/dashboard')

  const [user, taux, compagnons, demandesIntegration] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorEnabled: true },
    }),
    prisma.tauxGarage.findMany({ where: { garageId: garage.id }, orderBy: { type: 'asc' } }),
    prisma.compagnon.findMany({
      where: { garageId: garage.id, actif: true },
      include: { user: true },
      orderBy: { user: { nom: 'asc' } },
    }),
    prisma.demandeIntegration.findMany({
      where: { garageId: garage.id },
      orderBy: { createdAt: 'desc' },
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
          security={{
            twoFactorEnabled: user?.twoFactorEnabled ?? false,
          }}
          demandesIntegration={demandesIntegration.map(d => ({
            id: d.id,
            nomLogiciel: d.nomLogiciel,
            nomEditeur: d.nomEditeur,
            contactEditeur: d.contactEditeur,
            identifiantGarage: d.identifiantGarage,
            message: d.message,
            statut: d.statut as 'EN_ATTENTE' | 'APPROUVEE' | 'REFUSEE',
            noteAdmin: d.noteAdmin,
            createdAt: d.createdAt.toISOString(),
          }))}
        />
      </div>
    </>
  )
}
