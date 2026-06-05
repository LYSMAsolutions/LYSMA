import { auth } from '@/lib/auth'
import { getPrimaryGarageForUser } from '@/lib/garage'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/ui'
import { DashboardNewFicheButton } from '@/components/atelier/NouvelleFiche/DashboardNewFicheButton'
import { ExternalOrderForm } from './ExternalOrderForm'
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

  const [orders, taux] = await Promise.all([
    prisma.externalWorkOrder.findMany({
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
    (sum, order) => sum + order.pointages.reduce((s, pointage) => s + (pointage.dureeMinutes ?? 0), 0),
    0
  )
  const totalVendu = orders.reduce((sum, order) => sum + Number(order.soldHours ?? 0), 0)

  return (
    <>
      <Header
        title="OR atelier"
        action={<DashboardNewFicheButton garageId={garage.id} variant="secondary" label="Fiche de travail" />}
        description="Import, QR et pointage sur les ordres créés dans le logiciel de facturation."
      />

      <main className={styles.content}>
        <section className={styles.explain}>
          <strong>Le logiciel atelier reste la source de l’OR.</strong>
          <span>
            LIVO récupère l’OR via API ou QR pour pointer, mesurer le temps réel et préparer la clôture sans double saisie.
          </span>
        </section>

        <section className={styles.flowGrid}>
          <article>
            <strong>Flux recommandé</strong>
            <span>Le logiciel de facturation envoie l’OR à LIVO, puis imprime un QR sur l’ordre remis au compagnon.</span>
            <code>POST /api/integrations/work-orders</code>
          </article>
          <article>
            <strong>Secours sans intégration</strong>
            <span>Le compagnon tape seulement le numéro OR. LIVO pointe sans les détails client/véhicule, puis l’admin renseigne le taux à la clôture.</span>
          </article>
          <article>
            <strong>Hors OR logiciel</strong>
            <span>Pour une intervention interne ou un cas non facturé dans le logiciel atelier, créez une fiche de travail LIVO.</span>
            <DashboardNewFicheButton garageId={garage.id} variant="secondary" label="Créer une fiche" />
          </article>
        </section>

        <section className={styles.kpis}>
          <article>
            <span>Fiches miroir</span>
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
              <h2>OR de secours</h2>
              <p>À utiliser seulement si le QR est absent et si le logiciel de facturation n’envoie pas encore les OR à LIVO.</p>
            </div>
          </div>
          <details className={styles.manualDetails}>
            <summary>Créer manuellement un OR miroir</summary>
            <ExternalOrderForm />
          </details>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Suivi des fiches miroir</h2>
              <p>Lecture simple du temps vendu, du temps réel et de l’écart atelier.</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <p className={styles.empty}>Aucune fiche miroir enregistrée pour le moment.</p>
          ) : (
            <div className={styles.list}>
              {orders.map((order) => {
                const realMinutes = order.pointages.reduce((sum, pointage) => sum + (pointage.dureeMinutes ?? 0), 0)
                const soldHours = Number(order.soldHours ?? 0)
                const deltaMinutes = Math.round(soldHours * 60) - realMinutes
                const activePointages = order.pointages.some((pointage) => ['EN_COURS', 'EN_PAUSE'].includes(pointage.statut))
                const canClose = !activePointages && !['CLOTURE', 'ANNULE'].includes(order.status)
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
                          {canClose && (
                            <ExternalOrderCloseButton
                              orderId={order.id}
                              externalNumber={order.externalNumber}
                              realMinutes={realMinutes}
                              soldHours={order.soldHours ? Number(order.soldHours) : null}
                              soldAmountHT={order.soldAmountHT ? Number(order.soldAmountHT) : null}
                              taux={tauxSerialises}
                            />
                          )}
                        </div>
                        <p>
                          {order.vehicleLabel || 'Véhicule non renseigné'}
                          {order.immatriculation ? ` · ${order.immatriculation}` : ''}
                        </p>
                        <small>
                          {order.clientName || 'Client non renseigné'} · {order.operation || 'Aucune opération renseignée'}
                        </small>
                      </div>
                    </div>
                    <div className={styles.metrics}>
                      <span><small>Vendu</small><strong>{formatHours(order.soldHours)}</strong></span>
                      <span><small>Réel</small><strong>{formatH(realMinutes)}</strong></span>
                      <span><small>Taux</small><strong>{order.tauxApplique || 'À la clôture'}</strong></span>
                      <span>
                        <small>Écart</small>
                        <strong className={deltaMinutes >= 0 ? styles.goodText : styles.badText}>
                          {soldHours ? `${deltaMinutes >= 0 ? '+' : ''}${formatH(deltaMinutes)}` : 'Mode secours'}
                        </strong>
                      </span>
                      <span><small>Montant HT</small><strong>{order.soldAmountHT ? formatEur(order.soldAmountHT) : 'À la clôture'}</strong></span>
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
