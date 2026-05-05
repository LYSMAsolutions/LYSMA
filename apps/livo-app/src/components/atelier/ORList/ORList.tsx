import { Badge } from '@/components/ui'
import { Wrench, Clock, User } from '@phosphor-icons/react/dist/ssr'
import { STATUT_OR_LABELS } from '@/constants'
import type { StatutOR } from '@/types'
import styles from './ORList.module.css'

type OR = {
  id: string
  numero: string
  statut: StatutOR
  description: string | null
  heuresEstimees: number | null
  vehicule: { immatriculation: string | null; marque: string; modele: string }
  compagnon: { user: { prenom: string; nom: string } } | null
}

type Props = { ors: OR[] }

const STATUT_VARIANT: Record<StatutOR, 'blue' | 'success' | 'warning' | 'error' | 'gold' | 'muted'> = {
  BROUILLON: 'muted',
  EN_ATTENTE: 'warning',
  EN_COURS: 'blue',
  EN_PAUSE: 'warning',
  TERMINE: 'success',
  FACTURE: 'gold',
  ANNULE: 'error',
}

export function ORList({ ors }: Props) {
  if (ors.length === 0) {
    return (
      <div className={styles.empty}>
        <Wrench size={32} />
        <p>Aucun ordre de réparation aujourd&apos;hui</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {ors.map((or) => (
        <div key={or.id} className={styles.item}>
          <div className={styles.itemLeft}>
            <span className={styles.numero}>{or.numero}</span>
            <span className={styles.vehicule}>
              {or.vehicule.marque} {or.vehicule.modele}
              {or.vehicule.immatriculation && (
                <span className={styles.immat}> · {or.vehicule.immatriculation}</span>
              )}
            </span>
            {or.description && (
              <span className={styles.desc}>{or.description}</span>
            )}
          </div>

          <div className={styles.itemRight}>
            <Badge variant={STATUT_VARIANT[or.statut]} dot>
              {STATUT_OR_LABELS[or.statut]}
            </Badge>

            <div className={styles.meta}>
              {or.heuresEstimees && (
                <span className={styles.metaItem}>
                  <Clock size={12} />
                  {Number(or.heuresEstimees)}h
                </span>
              )}
              {or.compagnon && (
                <span className={styles.metaItem}>
                  <User size={12} />
                  {or.compagnon.user.prenom}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
