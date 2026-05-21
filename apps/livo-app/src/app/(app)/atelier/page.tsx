import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPrimaryGarageForUser } from '@/lib/garage'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { GarageStatus } from '@/components/atelier/GarageStatus/GarageStatus'
import { CompagnonCard } from '@/components/atelier/CompagnonCard/CompagnonCard'
import { FicheCard } from '@/components/atelier/FicheCard/FicheCard'
import {
  AtelierClient,
  AtelierActionButton,
} from '@/components/atelier/AtelierClient/AtelierClient'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function AtelierPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/connexion')
  }

  const garage = await getPrimaryGarageForUser(session.user.id)

  if (!garage) {
    redirect('/dashboard')
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [compagnons, fiches, taux] = await Promise.all([
    prisma.compagnon.findMany({
      where: {
        garageId: garage.id,
        actif: true,
      },
      include: {
        user: true,
        pointagesJour: {
          where: {
            date: today,
          },
          take: 1,
        },
        pointagesFiche: {
          where: {
            statut: {
              in: ['EN_COURS', 'EN_PAUSE'],
            },
          },
        },
      },
      orderBy: [
        { prenom: 'asc' },
        { nom: 'asc' },
      ],
    }),

    prisma.ficheTravaux.findMany({
      where: {
        garageId: garage.id,
        statut: {
          in: ['EN_ATTENTE', 'EN_COURS', 'EN_PAUSE', 'TERMINEE'],
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
    }),

    prisma.tauxGarage.findMany({
      where: {
        garageId: garage.id,
        actif: true,
      },
      orderBy: {
        type: 'asc',
      },
    }),
  ])

  const dateStr = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const compagnonConnecte = compagnons.find(
  (compagnon: any) => compagnon.user?.id === session.user.id
)
  const compagnonId = compagnonConnecte?.id ?? compagnons[0]?.id ?? ''

  const tauxSerialises = taux.map((item) => ({
    type: item.type as 'T1' | 'T2' | 'T3' | 'T4' | 'CARROSSERIE' | 'PEINTURE' | 'AUTRE',
    libelle: item.libelle,
    montant: Number(item.montant),
  }))

  return (
    <AtelierClient garageId={garage.id}>
      <Header
        title="Atelier"
        description={dateStr}
        action={<AtelierActionButton garageId={garage.id} />}
      />

      <div className={styles.content}>
        <GarageStatus
          garageId={garage.id}
          garageName={garage.nom}
          statutInitial={garage.statutJour}
        />

        <div className={styles.grid}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Compagnons <span className={styles.count}>{compagnons.length}</span>
            </h2>

            {compagnons.length === 0 ? (
              <div className={styles.empty}>
                <p>Aucun compagnon actif</p>
              </div>
            ) : (
              <div className={styles.compagnonsGrid}>
                {compagnons.map((compagnon) => {
                  const pointageJour = compagnon.pointagesJour[0]

                  const heureArrivee = pointageJour?.heureArrivee
                    ? new Date(pointageJour.heureArrivee).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : null

                  const prenom = compagnon.user?.prenom ?? compagnon.prenom ?? ''
                  const nom = compagnon.user?.nom ?? compagnon.nom ?? ''

                  return (
                    <CompagnonCard
                      key={compagnon.id}
                      compagnonId={compagnon.id}
                      nom={nom}
                      prenom={prenom}
                      poste={compagnon.poste ?? 'Mécanicien'}
                      statutInitial={(pointageJour?.statutActuel ?? 'ABSENT') as any}
                      heureArrivee={heureArrivee}
                      fichesActives={compagnon.pointagesFiche.length}
                    />
                  )
                })}
              </div>
            )}
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Fiches de travaux <span className={styles.count}>{fiches.length}</span>
            </h2>

            {fiches.length === 0 ? (
              <div className={styles.empty}>
                <p>Aucune fiche active</p>
              </div>
            ) : (
              <div className={styles.fichesGrid}>
                {fiches.map((fiche) => {
                  const estPointe = compagnonId
                    ? fiche.pointagesFiche.some((pointage) => pointage.compagnonId === compagnonId)
                    : false

                  return (
                    <FicheCard
                      key={fiche.id}
                      ficheId={fiche.id}
                      numero={fiche.numero}
                      statut={fiche.statut as any}
                      travaux={fiche.travaux}
                      vehicule={`${fiche.vehicule.marque} ${fiche.vehicule.modele}`}
                      immat={fiche.vehicule.immatriculation}
                      clientNom={fiche.vehicule.clientNom}
                      tempsReel={fiche.tempsReel ? Number(fiche.tempsReel) : null}
                      pointagesActifs={fiche.pointagesFiche.map((pointage) => {
                        const prenom =
                          pointage.compagnon.user?.prenom ??
                          pointage.compagnon.prenom ??
                          ''

                        const nom =
                          pointage.compagnon.user?.nom ??
                          pointage.compagnon.nom ??
                          ''

                        return {
                          compagnonId: pointage.compagnonId,
                          compagnonNom: `${prenom} ${nom}`.trim() || 'Compagnon',
                          debutAt: pointage.debutAt.toISOString(),
                        }
                      })}
                      compagnonId={compagnonId}
                      estPointe={estPointe}
                      taux={tauxSerialises}
                    />
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </AtelierClient>
  )
}
