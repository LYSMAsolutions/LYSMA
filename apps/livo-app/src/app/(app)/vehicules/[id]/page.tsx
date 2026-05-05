import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Button, Badge } from '@/components/ui'
import { ArrowLeft, Car, Clock, CurrencyEur, TrendUp, TrendDown } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

function formatEur(val: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(Number(val ?? 0))
}

function formatH(val: number) {
  const h = Math.floor(Number(val ?? 0))
  const m = Math.round((Number(val ?? 0) - h) * 60)

  return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

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

export default async function VehiculeFichePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

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

  const vehicule = await prisma.vehicule.findFirst({
    where: {
      id,
      garageId: garage.id,
    },
    include: {
      fiches: {
        include: {
          pointagesFiche: {
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
      },
    },
  })

  if (!vehicule) {
    notFound()
  }

  const taux = await prisma.tauxGarage.findMany({
    where: {
      garageId: garage.id,
      actif: true,
    },
  })

  const tauxMap = Object.fromEntries(taux.map((t) => [t.type, Number(t.montant)]))

  const tauxMoyen = taux.length
    ? taux.reduce((s, t) => s + Number(t.montant), 0) / taux.length
    : 65

  const fichesCloturees = vehicule.fiches.filter((f) => f.statut === 'CLOTUREE')

  const caTotal = fichesCloturees.reduce((s, f) => s + Number(f.montantHT ?? 0), 0)
  const tempsFactureTotal = fichesCloturees.reduce((s, f) => s + Number(f.tempsFacture ?? 0), 0)
  const tempsReelTotal = fichesCloturees.reduce(
    (s, f) => s + Number(f.tempsReel ?? f.tempsFacture ?? 0),
    0
  )

  const rentabiliteTotal = fichesCloturees.reduce((s, f) => {
    const t = tauxMap[f.tauxApplique ?? 'T1'] ?? tauxMoyen

    return s + (Number(f.tempsFacture ?? 0) - Number(f.tempsReel ?? f.tempsFacture ?? 0)) * t
  }, 0)

  return (
    <>
      <Header
        title={`${vehicule.marque} ${vehicule.modele}`}
        description={vehicule.immatriculation ?? 'Sans immatriculation'}
        action={
          <Link href="/vehicules">
            <Button variant="secondary" size="sm" icon={<ArrowLeft />}>
              Retour
            </Button>
          </Link>
        }
      />

      <div className={styles.content}>
        <div className={styles.topGrid}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>
              <Car size={14} /> Véhicule
            </h3>

            <div className={styles.infoGrid}>
              <InfoRow label="Marque" value={vehicule.marque} />
              <InfoRow label="Modèle" value={vehicule.modele} />

              {vehicule.immatriculation && (
                <InfoRow label="Immatriculation" value={vehicule.immatriculation} mono />
              )}

              {vehicule.annee && <InfoRow label="Année" value={String(vehicule.annee)} />}
              {vehicule.vin && <InfoRow label="N° de série" value={vehicule.vin} mono />}
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Client</h3>

            <div className={styles.infoGrid}>
              <InfoRow
                label="Nom"
                value={`${vehicule.clientNom}${vehicule.clientPrenom ? ` ${vehicule.clientPrenom}` : ''}`}
              />

              {vehicule.clientTel && <InfoRow label="Téléphone" value={vehicule.clientTel} />}
              {vehicule.clientEmail && <InfoRow label="Email" value={vehicule.clientEmail} />}
            </div>
          </div>

          {fichesCloturees.length > 0 && (
            <div className={styles.statsCard}>
              <div className={styles.stat}>
                <span className={styles.statVal} style={{ color: 'var(--color-gold)' }}>
                  {formatEur(caTotal)}
                </span>
                <span className={styles.statLabel}>CA total</span>
              </div>

              <div className={styles.stat}>
                <span className={styles.statVal}>{formatH(tempsFactureTotal)}</span>
                <span className={styles.statLabel}>Temps facturé</span>
              </div>

              <div className={styles.stat}>
                <span
                  className={styles.statVal}
                  style={{
                    color:
                      rentabiliteTotal >= 0
                        ? 'var(--color-success)'
                        : 'var(--color-error)',
                  }}
                >
                  {rentabiliteTotal >= 0 ? '+' : ''}
                  {formatEur(rentabiliteTotal)}
                </span>
                <span className={styles.statLabel}>Rentabilité</span>
              </div>

              <div className={styles.stat}>
                <span className={styles.statVal}>{formatH(tempsReelTotal)}</span>
                <span className={styles.statLabel}>Temps réel</span>
              </div>
            </div>
          )}
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Historique fiches
            <span className={styles.count}>{vehicule.fiches.length}</span>
          </h2>

          {vehicule.fiches.length === 0 ? (
            <div className={styles.empty}>
              <p>Aucune fiche pour ce véhicule</p>
            </div>
          ) : (
            <div className={styles.fichesList}>
              {vehicule.fiches.map((f) => {
                const badge = STATUT_BADGE[f.statut] ?? {
                  label: f.statut,
                  variant: 'muted' as const,
                }

                const tauxVal = tauxMap[f.tauxApplique ?? 'T1'] ?? tauxMoyen

                const delta =
                  f.statut === 'CLOTUREE'
                    ? (Number(f.tempsFacture ?? 0) -
                        Number(f.tempsReel ?? f.tempsFacture ?? 0)) *
                      tauxVal
                    : null

                const compagnons = [
                  ...new Set(
                    f.pointagesFiche.map((p) => {
                      const prenom = p.compagnon.user?.prenom ?? p.compagnon.prenom ?? ''
                      const nom = p.compagnon.user?.nom ?? p.compagnon.nom ?? ''

                      return `${prenom} ${nom?.[0] ?? ''}.`.trim()
                    })
                  ),
                ].filter(Boolean)

                return (
                  <div key={f.id} className={styles.ficheItem}>
                    <div className={styles.ficheLeft}>
                      <div className={styles.ficheTop}>
                        <span className={styles.ficheNumero}>{f.numero}</span>

                        <Badge variant={badge.variant} dot>
                          {badge.label}
                        </Badge>
                      </div>

                      <p className={styles.ficheTravaux}>
                        {f.travaux.split('\n')[0] || 'Travaux non renseignés'}
                      </p>

                      <div className={styles.ficheMeta}>
                        <span>{formatDate(f.dateOuverture)}</span>
                        {compagnons.length > 0 && <span>· {compagnons.join(', ')}</span>}
                      </div>
                    </div>

                    <div className={styles.ficheRight}>
                      {f.tempsFacture && (
                        <div className={styles.ficheKpi}>
                          <Clock size={12} />
                          <span>{formatH(Number(f.tempsFacture))}</span>
                        </div>
                      )}

                      {f.montantHT && (
                        <div className={styles.ficheKpi}>
                          <CurrencyEur size={12} />
                          <span>{formatEur(Number(f.montantHT))}</span>
                        </div>
                      )}

                      {delta !== null && (
                        <span className={delta >= 0 ? styles.gain : styles.perte}>
                          {delta >= 0 ? <TrendUp size={12} /> : <TrendDown size={12} />}
                          {delta >= 0 ? '+' : ''}
                          {formatEur(delta)}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </>
  )
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>

      <span className={`${styles.infoValue} ${mono ? styles.mono : ''}`}>
        {value}
      </span>
    </div>
  )
}