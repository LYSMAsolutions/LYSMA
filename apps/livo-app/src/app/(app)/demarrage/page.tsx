import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPrimaryGarageForUser } from '@/lib/garage'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import Link from 'next/link'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function DemarragePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/connexion')

  const garage = await getPrimaryGarageForUser(session.user.id)
  if (!garage) redirect('/connexion')

  const [compagnonsCount, fichesCount, vehiculesCount, tauxCount] = await Promise.all([
    prisma.compagnon.count({ where: { garageId: garage.id, actif: true } }),
    prisma.ficheTravaux.count({ where: { garageId: garage.id } }),
    prisma.vehicule.count({ where: { garageId: garage.id } }),
    prisma.tauxGarage.count({ where: { garageId: garage.id } }),
  ])

  const etapes = [
    {
      id: 'garage',
      label: 'Nommer votre garage',
      description: 'Donnez un nom à votre atelier dans les paramètres.',
      done: Boolean(garage.nom),
      href: '/parametres',
      cta: 'Ouvrir les paramètres',
    },
    {
      id: 'taux',
      label: 'Configurer vos taux horaires',
      description: 'Définissez vos taux T1–T4, carrosserie, peinture pour calculer la rentabilité.',
      done: tauxCount > 0,
      href: '/parametres',
      cta: 'Configurer les taux',
    },
    {
      id: 'compagnon',
      label: 'Ajouter un compagnon',
      description: 'Créez au moins un compagnon pour commencer le pointage atelier.',
      done: compagnonsCount > 0,
      href: '/compagnons',
      cta: 'Ajouter un compagnon',
    },
    {
      id: 'vehicule',
      label: 'Enregistrer un véhicule client',
      description: 'Ajoutez votre premier véhicule avec les infos client.',
      done: vehiculesCount > 0,
      href: '/vehicules',
      cta: 'Ajouter un véhicule',
    },
    {
      id: 'fiche',
      label: 'Créer une première fiche de travaux',
      description: 'Ouvrez un ordre de réparation et assignez-le à un compagnon.',
      done: fichesCount > 0,
      href: '/atelier',
      cta: 'Créer une fiche',
    },
  ]

  const doneCount = etapes.filter((e) => e.done).length
  const allDone = doneCount === etapes.length

  return (
    <>
      <Header
        title="Prise en main"
        description="Suivez ces étapes pour être opérationnel en quelques minutes."
      />
      <div className={styles.page}>
        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${Math.round((doneCount / etapes.length) * 100)}%` }}
            />
          </div>
          <span className={styles.progressLabel}>
            {doneCount} / {etapes.length} étapes complétées
          </span>
        </div>

        {allDone && (
          <div className={styles.allDone}>
            <span>✓</span>
            <div>
              <strong>LIVO est prêt !</strong>
              <p>Votre atelier est configuré. Rendez-vous sur le tableau de bord.</p>
            </div>
            <Link href="/dashboard" className={styles.ctaPrimary}>Aller au dashboard →</Link>
          </div>
        )}

        <ol className={styles.etapes}>
          {etapes.map((etape, index) => (
            <li key={etape.id} className={`${styles.etape} ${etape.done ? styles.done : ''}`}>
              <div className={styles.etapeNum}>
                {etape.done ? '✓' : index + 1}
              </div>
              <div className={styles.etapeBody}>
                <strong className={styles.etapeLabel}>{etape.label}</strong>
                <p className={styles.etapeDesc}>{etape.description}</p>
              </div>
              {!etape.done && (
                <Link href={etape.href as '/parametres'} className={styles.etapeCta}>
                  {etape.cta} →
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}
