import { auth } from '@/lib/auth'
import { getPrimaryGarageForUser } from '@/lib/garage'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/ui'
import { ExternalOrderForm } from './ExternalOrderForm'
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
  const number = Number(value ?? 0)
  return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(number)} h`
}

function formatEur(value: unknown) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(value ?? 0))
}

function rentabilityTone(soldHours: number, realMinutes: number) {
  if (!soldHours) return { label: 'À compléter', className: styles.neutral }
  const realHours = realMinutes / 60
  const ratio = realHours / soldHours
  if (ratio <= 0.9) return { label: 'Rentable', className: styles.good }
  if (ratio <= 1.1) return { label: 'À surveiller', className: styles.warning }
  return { label: 'Non rentable', className: styles.bad }
}

export default async function OrExternesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/connexion')

  const garage = await getPrimaryGarageForUser(session.user.id)
  if (!garage) redirect('/dashboard')

  const orders = await prisma.externalWorkOrder.findMany({
    where: { garageId: garage.id },
    include: {
      pointages: {
        include: {
          compagnon: { include: { user: true } },
        },
        orderBy: { debutAt: 'desc' },
      },
    },
    orderBy: { openedAt: 'desc' },
    take: 100,
  })

  const ouverts = orders.filter((order) => !['CLOTURE', 'ANNULE'].includes(order.status)).length
  const totalReelMinutes = orders.reduce(
    (sum, order) => sum + order.pointages.reduce((s, pointage) => s + (pointage.dureeMinutes ?? 0), 0),
    0
  )
  const totalVendu = orders.reduce((sum, order) => sum + Number(order.soldHours ?? 0), 0)

  return (
    <>
      <Header
        title="OR externes"
        description="Pointage et rentabilité sur ordres de réparation créés hors LIVO."
      />

      <main className={styles.content}>
        <section className={styles.kpis}>
          <article>
            <span>OR suivis</span>
            <strong>{orders.length}</strong>
          </article>
          <article>
            <span>OR ouverts</span>
            <strong>{ouverts}</strong>
          </article>
          <article>
            <span>Temps vendu</span>
            <strong>{formatHours(totalVendu)}</strong>
          </article>
          <article>
            <span>Temps réel</span>
            <strong>{formatH(totalReelMinutes)}</strong>
          </article>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Créer un OR externe</h2>
              <p>Utilisez ce formulaire si le garage travaille déjà avec son propre logiciel métier.</p>
            </div>
          </div>
          <ExternalOrderForm />
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>OR externes suivis</h2>
              <p>Lecture simple du temps vendu, du temps réel et de l’écart atelier.</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <p className={styles.empty}>Aucun OR externe enregistré pour le moment.</p>
          ) : (
            <div className={styles.list}>
              {orders.map((order) => {
                const realMinutes = order.pointages.reduce((sum, pointage) => sum + (pointage.dureeMinutes ?? 0), 0)
                const soldHours = Number(order.soldHours ?? 0)
                const deltaMinutes = Math.round(soldHours * 60) - realMinutes
                const tone = rentabilityTone(soldHours, realMinutes)
                const status = STATUS_LABELS[order.status] ?? { label: order.status, variant: 'muted' as const }

                return (
                  <article key={order.id} className={styles.order}>
                    <div className={styles.orderMain}>
                      <div>
                        <div className={styles.orderTitle}>
                          <strong>{order.externalNumber}</strong>
                          <Badge variant={status.variant} dot>
                            {status.label}
                          </Badge>
                          <span className={`${styles.rentability} ${tone.className}`}>{tone.label}</span>
                        </div>
                        <p>{order.vehicleLabel}{order.immatriculation ? ` · ${order.immatriculation}` : ''}</p>
                        <small>{order.clientName} · {order.operation}</small>
                      </div>
                    </div>
                    <div className={styles.metrics}>
                      <span><small>Vendu</small><strong>{formatHours(order.soldHours)}</strong></span>
                      <span><small>Réel</small><strong>{formatH(realMinutes)}</strong></span>
                      <span>
                        <small>Écart</small>
                        <strong className={deltaMinutes >= 0 ? styles.goodText : styles.badText}>
                          {deltaMinutes >= 0 ? '+' : ''}{formatH(deltaMinutes)}
                        </strong>
                      </span>
                      <span><small>Montant HT</small><strong>{formatEur(order.soldAmountHT)}</strong></span>
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
