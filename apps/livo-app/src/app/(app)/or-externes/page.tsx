import { auth } from '@/lib/auth'
import { getPrimaryGarageForUser } from '@/lib/garage'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/ui'
import { DashboardNewFicheButton } from '@/components/atelier/NouvelleFiche/DashboardNewFicheButton'
import { calculateWorkshopMetrics } from '@/lib/workshop-metrics'
import { ExternalOrderCloseButton } from './ExternalOrderCloseButton'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

const STATUS_LABELS: Record<string, { label: string; variant: 'blue' | 'success' | 'warning' | 'muted' | 'error' }> = {
  OUVERT: { label: 'Ouvert', variant: 'blue' },
  EN_COURS: { label: 'En cours', variant: 'blue' },
  EN_PAUSE: { label: 'En pause', variant: 'warning' },
  TERMINE: { label: 'Terminé', variant: 'success' },
  CLOTURE: { label: 'Clôturé', variant: 'muted' },
  ANNULE: { label: 'Annulé', variant: 'error' },
}

function formatH(minutes: number) {
  const sign = minutes < 0 ? '-' : ''
  const abs = Math.abs(minutes)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  return `${sign}${h} h ${String(m).padStart(2, '0')}`
}

function formatHours(value: unknown) {
  return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(Number(value ?? 0))} h`
}

function formatEur(value: unknown) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(value ?? 0))
}

function efficiencyTone(efficiencyPercent: number | null) {
  if (efficiencyPercent === null) return { label: 'À compléter', className: styles.neutral }
  if (efficiencyPercent >= 110) return { label: 'Temps maîtrisé', className: styles.good }
  if (efficiencyPercent >= 90) return { label: 'À surveiller', className: styles.warning }
  return { label: 'Temps dépassé', className: styles.bad }
}

export default async function OrExternesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/connexion')

  const garage = await getPrimaryGarageForUser(session.user.id)
  if (!garage) redirect('/dashboard')

  const [orders, taux] = await Promise.all([
    prisma.externalWorkOrder.findMany({
      where: { garageId: garage.id },
      include: {
        lines: { orderBy: { position: 'asc' } },
        pointages: {
          include: { compagnon: { include: { user: true } } },
          orderBy: { debutAt: 'desc' },
        },
      },
      orderBy: { openedAt: 'desc' },
      take: 100,
    }),
    prisma.tauxGarage.findMany({
      where: { garageId: garage.id, actif: true },
      orderBy: { type: 'asc' },
    }),
  ])

  const tauxSerialises = taux.map((item) => ({
    type: item.type,
    libelle: item.libelle,
    montant: Number(item.montant),
  }))
  const ouverts = orders.filter((order) => !['CLOTURE', 'ANNULE'].includes(order.status)).length
  const totalReelMinutes = orders.reduce(
    (sum, order) => sum + order.pointages.reduce((value, pointage) => value + (pointage.dureeMinutes ?? 0), 0),
    0
  )
  const totalVendu = orders.reduce((sum, order) => sum + Number(order.soldHours ?? 0), 0)

  return (
    <>
      <Header
        title="OR atelier"
        action={<DashboardNewFicheButton garageId={garage.id} variant="secondary" label="Fiche de travail" />}
        description="Suivi des ordres reçus depuis le logiciel de facturation."
      />

      <main className={styles.content}>
          <article>
            <strong>Travaux internes</strong>
            <span>Pour une intervention hors logiciel de facturation, créez une fiche de travail LIVO.</span>
            <DashboardNewFicheButton garageId={garage.id} variant="secondary" label="Créer une fiche" />
          </article>



        <section className={styles.kpis}>
          <article><span>OR reçus</span><strong>{orders.length}</strong></article>
          <article><span>OR ouverts</span><strong>{ouverts}</strong></article>
          <article><span>Temps vendu</span><strong>{formatHours(totalVendu)}</strong></article>
          <article><span>Temps réel</span><strong>{formatH(totalReelMinutes)}</strong></article>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Suivi des OR reçus</h2>
              <p>Temps prévu, vendu, facturé et réellement pointé dans l’atelier.</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <p className={styles.empty}>Aucun OR reçu pour le moment.</p>
          ) : (
            <div className={styles.list}>
              {orders.map((order) => {
                const realMinutes = order.pointages.reduce((sum, pointage) => sum + (pointage.dureeMinutes ?? 0), 0)
                const metrics = calculateWorkshopMetrics({
                  plannedHours: order.plannedHours ? Number(order.plannedHours) : null,
                  soldHours: order.soldHours ? Number(order.soldHours) : null,
                  billedHours: order.billedHours ? Number(order.billedHours) : null,
                  actualMinutes: realMinutes,
                  billedAmountHT: order.billedAmountHT ? Number(order.billedAmountHT) : null,
                  laborAmountHT: order.laborAmountHT ? Number(order.laborAmountHT) : null,
                  billingHourlyRateHT: order.billingHourlyRateHT ? Number(order.billingHourlyRateHT) : null,
                  internalLaborCostRateHT: order.internalLaborCostRateHT ? Number(order.internalLaborCostRateHT) : null,
                })
                const deltaMinutes = metrics.timeDeltaHours === null ? null : Math.round(metrics.timeDeltaHours * 60)
                const activePointages = order.pointages.some((pointage) => ['EN_COURS', 'EN_PAUSE'].includes(pointage.statut))
                const canClose = !activePointages && !['CLOTURE', 'ANNULE'].includes(order.status)
                const tone = efficiencyTone(metrics.efficiencyPercent)
                const status = STATUS_LABELS[order.status] ?? { label: order.status, variant: 'muted' as const }

                return (
                  <article key={order.id} className={styles.order}>
                    <div className={styles.orderMain}>
                      <div>
                        <div className={styles.orderTitle}>
                          <strong>{order.externalNumber}</strong>
                          <Badge variant={status.variant} dot>{status.label}</Badge>
                          <span className={`${styles.rentability} ${tone.className}`}>{tone.label}</span>
                          {canClose && (
                            <ExternalOrderCloseButton
                              orderId={order.id}
                              externalNumber={order.externalNumber}
                              realMinutes={realMinutes}
                              billedHours={order.billedHours ? Number(order.billedHours) : null}
                              billedAmountHT={order.billedAmountHT ? Number(order.billedAmountHT) : null}
                              laborAmountHT={order.laborAmountHT ? Number(order.laborAmountHT) : null}
                              taux={tauxSerialises}
                            />
                          )}
                        </div>
                        <p>{order.vehicleLabel || 'Véhicule non renseigné'}{order.immatriculation ? ` · ${order.immatriculation}` : ''}</p>
                        <small>{order.clientName || 'Client non renseigné'} · {order.operation || 'Aucun travail renseigné'}</small>
                        {order.lines.length > 0 && (
                          <ul>{order.lines.slice(0, 4).map((line) => <li key={line.id}>{line.label}</li>)}</ul>
                        )}
                      </div>
                    </div>
                    <div className={styles.metrics}>
                      <span><small>Prévu</small><strong>{metrics.plannedHours === null ? '—' : formatHours(metrics.plannedHours)}</strong></span>
                      <span><small>Vendu</small><strong>{metrics.soldHours === null ? '—' : formatHours(metrics.soldHours)}</strong></span>
                      <span><small>Facturé</small><strong>{metrics.billedHours === null ? 'À compléter' : formatHours(metrics.billedHours)}</strong></span>
                      <span><small>Réel</small><strong>{formatH(realMinutes)}</strong></span>
                      <span><small>Taux</small><strong>{order.tauxLibelle || 'À la clôture'}</strong></span>
                      <span>
                        <small>Écart</small>
                        <strong className={deltaMinutes !== null && deltaMinutes >= 0 ? styles.goodText : styles.badText}>
                          {deltaMinutes === null ? 'À compléter' : `${deltaMinutes >= 0 ? '+' : ''}${formatH(deltaMinutes)}`}
                        </strong>
                      </span>
                      <span><small>Montant HT</small><strong>{metrics.billedAmountHT === null ? 'À la clôture' : formatEur(metrics.billedAmountHT)}</strong></span>
                      <span><small>Efficacité temps</small><strong>{metrics.efficiencyPercent === null ? '—' : `${Math.round(metrics.efficiencyPercent)} %`}</strong></span>
                      {metrics.laborMarginHT !== null && (
                        <span><small>Rentabilité MO estimée</small><strong>{formatEur(metrics.laborMarginHT)}</strong></span>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
