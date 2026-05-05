import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Button, Badge } from '@/components/ui'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { FicheDetailClient } from '@/components/atelier/FicheDetail/FicheDetailClient'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

const STATUT_BADGE: Record<
  string,
  {
    label: string
    variant: 'blue' | 'success' | 'warning' | 'muted' | 'error' | 'default'
  }
> = {
  EN_ATTENTE: { label: 'En attente', variant: 'warning' },
  EN_COURS: { label: 'En cours', variant: 'blue' },
  EN_PAUSE: { label: 'En pause', variant: 'warning' },
  TERMINEE: { label: 'Terminée', variant: 'success' },
  CLOTUREE: { label: 'Clôturée', variant: 'muted' },
  ANNULEE: { label: 'Annulée', variant: 'error' },
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatH(value: number) {
  const h = Math.floor(Number(value ?? 0))
  const m = Math.round((Number(value ?? 0) - h) * 60)

  return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`
}

function formatEur(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(value ?? 0))
}

export default async function FicheDetailPage({
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

  const fiche = await prisma.ficheTravaux.findFirst({
    where: {
      id,
      garageId: garage.id,
    },
    include: {
      vehicule: true,
      pointagesFiche: {
        include: {
          compagnon: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          debutAt: 'asc',
        },
      },
    },
  })

  if (!fiche) {
    notFound()
  }

  const badge = STATUT_BADGE[fiche.statut] ?? {
    label: fiche.statut,
    variant: 'muted' as const,
  }

  const travauxLignes = fiche.travaux
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return (
    <>
      <Header
        title={fiche.numero}
        description={`${fiche.vehicule.marque} ${fiche.vehicule.modele}${
          fiche.vehicule.immatriculation ? ` · ${fiche.vehicule.immatriculation}` : ''
        }`}
        action={
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <FicheDetailClient ficheId={fiche.id} numero={fiche.numero} />

            <Link href="/atelier">
              <Button variant="secondary" size="sm" icon={<ArrowLeft />}>
                Atelier
              </Button>
            </Link>
          </div>
        }
      />

      <div className={styles.content}>
        <div className={styles.topRow}>
          <Badge variant={badge.variant} dot>
            {badge.label}
          </Badge>

          <span className={styles.date}>Ouvert le {formatDate(fiche.dateOuverture)}</span>

          {fiche.dateFermeture && (
            <span className={styles.date}>Clôturé le {formatDate(fiche.dateFermeture)}</span>
          )}
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Véhicule</h3>

            <div className={styles.infoRows}>
              <InfoRow label="Véhicule" value={`${fiche.vehicule.marque} ${fiche.vehicule.modele}`} />

              {fiche.vehicule.immatriculation && (
                <InfoRow label="Immatriculation" value={fiche.vehicule.immatriculation} mono />
              )}

              {fiche.vehicule.annee && (
                <InfoRow label="Année" value={String(fiche.vehicule.annee)} />
              )}

              {fiche.vehicule.vin && <InfoRow label="VIN" value={fiche.vehicule.vin} mono />}
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Client</h3>

            <div className={styles.infoRows}>
              <InfoRow
                label="Nom"
                value={`${fiche.vehicule.clientNom}${
                  fiche.vehicule.clientPrenom ? ` ${fiche.vehicule.clientPrenom}` : ''
                }`}
              />

              {fiche.vehicule.clientTel && (
                <InfoRow label="Téléphone" value={fiche.vehicule.clientTel} />
              )}

              {fiche.vehicule.clientEmail && (
                <InfoRow label="Email" value={fiche.vehicule.clientEmail} />
              )}
            </div>
          </div>

          {fiche.statut === 'CLOTUREE' && fiche.montantHT && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Facturation</h3>

              <div className={styles.infoRows}>
                {fiche.tempsFacture && (
                  <InfoRow label="Temps facturé" value={formatH(Number(fiche.tempsFacture))} />
                )}

                {fiche.tempsReel && (
                  <InfoRow label="Temps réel" value={formatH(Number(fiche.tempsReel))} />
                )}

                {fiche.tauxApplique && <InfoRow label="Taux" value={fiche.tauxApplique} />}

                <InfoRow label="Montant HT" value={formatEur(Number(fiche.montantHT))} highlight />
              </div>
            </div>
          )}
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Travaux à effectuer</h3>

          {travauxLignes.length > 0 ? (
            <ul className={styles.travaux}>
              {travauxLignes.map((travail, index) => (
                <li key={`${travail}-${index}`} className={styles.travailItem}>
                  {travail}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.notesText}>Aucun travail renseigné.</p>
          )}

          {fiche.notes && (
            <div className={styles.notes}>
              <span className={styles.notesLabel}>Notes internes</span>
              <p className={styles.notesText}>{fiche.notes}</p>
            </div>
          )}
        </div>

        {fiche.pointagesFiche.length > 0 && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Compagnons intervenus</h3>

            <div className={styles.compagnonsList}>
              {fiche.pointagesFiche.map((pointageFiche, index) => {
                const compagnon = pointageFiche.compagnon
                const prenom = compagnon.user?.prenom ?? compagnon.prenom ?? ''
                const nom = compagnon.user?.nom ?? compagnon.nom ?? ''

                const debut = new Date(pointageFiche.debutAt).toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })

                const fin = pointageFiche.finAt
                  ? new Date(pointageFiche.finAt).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'En cours'

                const duree = pointageFiche.dureeMinutes
                  ? formatH(pointageFiche.dureeMinutes / 60)
                  : '—'

                return (
                  <div
                    key={pointageFiche.id}
                    className={`${styles.compagnonRow} ${
                      index % 2 === 1 ? styles.compagnonRowAlt : ''
                    }`}
                  >
                    <span className={styles.compagnonNom}>
                      {`${prenom} ${nom}`.trim() || 'Compagnon'}
                    </span>

                    <span className={styles.compagnonInfo}>
                      {debut} → {fin}
                    </span>

                    <span className={styles.compagnonDuree}>{duree}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function InfoRow({
  label,
  value,
  mono,
  highlight,
}: {
  label: string
  value: string
  mono?: boolean
  highlight?: boolean
}) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>

      <span
        className={`${styles.infoValue} ${mono ? styles.mono : ''} ${
          highlight ? styles.highlight : ''
        }`}
      >
        {value}
      </span>
    </div>
  )
}