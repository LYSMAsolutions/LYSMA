import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPrimaryGarageForUser } from '@/lib/garage'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/ui'
import { Car, MagnifyingGlass } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

const STATUT_BADGE: Record<
  string,
  {
    label: string
    variant: 'blue' | 'success' | 'warning' | 'muted' | 'error' | 'gold' | 'cyan' | 'default'
  }
> = {
  EN_ATTENTE: { label: 'En attente', variant: 'warning' },
  EN_COURS: { label: 'En cours', variant: 'blue' },
  EN_PAUSE: { label: 'En pause', variant: 'warning' },
  TERMINEE: { label: 'Terminée', variant: 'success' },
  CLOTUREE: { label: 'Clôturée', variant: 'muted' },
  ANNULEE: { label: 'Annulée', variant: 'error' },
}

export default async function VehiculesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/connexion')
  }

  const { q = '' } = await searchParams
  const query = q.trim()

  const garage = await getPrimaryGarageForUser(session.user.id)

  if (!garage) {
    redirect('/dashboard')
  }

  const vehicules = await prisma.vehicule.findMany({
    where: {
      garageId: garage.id,
      ...(query
        ? {
            OR: [
              { immatriculation: { contains: query, mode: 'insensitive' } },
              { marque: { contains: query, mode: 'insensitive' } },
              { modele: { contains: query, mode: 'insensitive' } },
              { clientNom: { contains: query, mode: 'insensitive' } },
              { clientPrenom: { contains: query, mode: 'insensitive' } },
              { clientTel: { contains: query, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: {
      fiches: {
        orderBy: {
          dateOuverture: 'desc',
        },
        take: 1,
      },
      _count: {
        select: {
          fiches: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return (
    <>
      <Header
        title="Véhicules"
        description={`${vehicules.length} véhicule${vehicules.length > 1 ? 's' : ''}`}
      />

      <div className={styles.content}>
        <form className={styles.searchForm} method="GET">
          <div className={styles.searchWrapper}>
            <MagnifyingGlass className={styles.searchIcon} size={16} />

            <input
              name="q"
              defaultValue={query}
              placeholder="Immat, marque, modèle, client..."
              className={styles.searchInput}
              autoComplete="off"
            />
          </div>

          {query && (
            <Link href="/vehicules" className={styles.clearSearch}>
              Effacer
            </Link>
          )}
        </form>

        {vehicules.length === 0 ? (
          <div className={styles.empty}>
            <Car size={36} />

            <p>{query ? `Aucun résultat pour "${query}"` : 'Aucun véhicule enregistré'}</p>

            {!query && (
              <p className={styles.emptyHint}>
                Les véhicules sont créés lors de la création d&apos;une fiche de travaux
              </p>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {vehicules.map((vehicule) => {
              const derniereFiche = vehicule.fiches[0]
              const badge = derniereFiche ? STATUT_BADGE[derniereFiche.statut] : null

              return (
                <Link key={vehicule.id} href={`/vehicules/${vehicule.id}`} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.vehiculeIcon}>
                      <Car weight="fill" size={18} />
                    </div>

                    <div className={styles.vehiculeInfo}>
                      <span className={styles.vehiculeNom}>
                        {vehicule.marque} {vehicule.modele}
                      </span>

                      {vehicule.immatriculation && (
                        <span className={styles.immat}>{vehicule.immatriculation}</span>
                      )}
                    </div>

                    {badge && (
                      <Badge variant={badge.variant} dot>
                        {badge.label}
                      </Badge>
                    )}
                  </div>

                  <div className={styles.clientInfo}>
                    <span className={styles.clientNom}>
                      {vehicule.clientNom}
                      {vehicule.clientPrenom ? ` ${vehicule.clientPrenom}` : ''}
                    </span>

                    {vehicule.clientTel && (
                      <span className={styles.clientTel}>{vehicule.clientTel}</span>
                    )}
                  </div>

                  <div className={styles.cardFooter}>
                    <span className={styles.nbFiches}>
                      {vehicule._count.fiches} fiche{vehicule._count.fiches > 1 ? 's' : ''}
                    </span>

                    {vehicule.annee && <span className={styles.annee}>{vehicule.annee}</span>}

                    {vehicule.vin && (
                      <span className={styles.vin} title="VIN">
                        {vehicule.vin.slice(0, 8)}…
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
