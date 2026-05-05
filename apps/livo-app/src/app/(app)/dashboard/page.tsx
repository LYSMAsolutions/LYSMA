import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { getDashboardData } from '@/lib/dashboard'
import { Header } from '@/components/layout/Header'
import { Button, Badge } from '@/components/ui'
import { Plus, TrendUp, TrendDown, Clock, Users, Wrench } from '@phosphor-icons/react/dist/ssr'
import styles from './page.module.css'

function formatEur(val: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val)
}
function formatH(val: number) {
  const h = Math.floor(val)
  const m = Math.round((val - h) * 60)
  return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/connexion')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { garages: { take: 1 } },
  })

  const garage = user?.garages[0]
  if (!garage) redirect('/parametres')

  const data = await getDashboardData(garage.id)
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      <Header title="Tableau de bord" description={today} action={<Button variant="primary" size="sm" icon={<Plus />}>Nouvelle fiche</Button>} />
      <div className={styles.content}>

        <div className={styles.kpiGrid}>
          <KpiCard label="CA du jour"   value={formatEur(data.caJour)}    sub={`${data.fichesTermineesJour} fiche${data.fichesTermineesJour > 1 ? 's' : ''} clôturée${data.fichesTermineesJour > 1 ? 's' : ''}`} color="gold"  icon={<TrendUp weight="bold" />} />
          <KpiCard label="CA semaine"   value={formatEur(data.caSemaine)} sub="Semaine en cours"  color="blue"  icon={<TrendUp weight="bold" />} />
          <KpiCard label="CA mois"      value={formatEur(data.caMois)}    sub={new Date().toLocaleDateString('fr-FR', { month: 'long' })} color="cyan" icon={<TrendUp weight="bold" />} />
          <RentabiliteCard value={data.rentabiliteJour} semaine={data.rentabiliteSemaine} mois={data.rentabiliteMois} />
        </div>

        <div className={styles.statsRow}>
          <StatCard label="Temps facturé"     value={formatH(data.tempsFactureJour)} icon={<Clock weight="fill" />}  color="blue" />
          <StatCard label="Temps réel"        value={formatH(data.tempsReelJour)}    icon={<Clock weight="fill" />}  color="cyan" />
          <StatCard label="Compagnons actifs" value={String(data.compagnonsActifs)}  icon={<Users weight="fill" />}  color="success" />
          <StatCard label="Fiches en cours"   value={String(data.fichesEnCours.length)} icon={<Wrench weight="fill" />} color="warning" />
        </div>

        {data.rentabiliteFichesJour.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Rentabilité — Fiches du jour</h2>
            <div className={styles.rentabiliteList}>
              {data.rentabiliteFichesJour.map((f) => (
                <div key={f.id} className={styles.rentabiliteItem}>
                  <div className={styles.rentLeft}>
                    <span className={styles.orNumero}>{f.numero}</span>
                    <span className={styles.orVehicule}>{f.vehicule}</span>
                  </div>
                  <div className={styles.rentMeta}>
                    <span className={styles.metaItem}>{formatH(f.tFacture)} facturés</span>
                    <span className={styles.metaSep}>vs</span>
                    <span className={styles.metaItem}>{formatH(f.tReel)} réels</span>
                  </div>
                  <span className={cn(styles.rentDelta, f.delta >= 0 ? styles.gain : styles.perte)}>
                    {f.delta >= 0 ? '+' : ''}{formatEur(f.delta)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.rentabiliteParCompagnon.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Rentabilité par compagnon
                <span className={styles.sectionSub}>— {new Date().toLocaleDateString('fr-FR', { month: 'long' })}</span>
              </h2>
            </div>
            <div className={styles.compagnonGrid}>
              {data.rentabiliteParCompagnon.map((c) => (
                <div key={c.id} className={cn(styles.compagnonCard, c.delta >= 0 ? styles.cardGain : styles.cardPerte)}>
                  <div className={styles.compagnonHeader}>
                    <div className={styles.compagnonAvatar}>
                      {c.nom.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </div>
                    <div className={styles.compagnonInfo}>
                      <span className={styles.compagnonNom}>{c.nom}</span>
                      <span className={styles.compagnonSub}>{c.nbFiches} fiche{c.nbFiches > 1 ? 's' : ''} ce mois</span>
                    </div>
                    <span className={cn(styles.compagnonDelta, c.delta >= 0 ? styles.gain : styles.perte)}>
                      {c.delta >= 0 ? '+' : ''}{formatEur(c.delta)}
                    </span>
                  </div>
                  <div className={styles.compagnonStats}>
                    <div className={styles.compagnonStat}>
                      <span className={styles.compagnonStatLabel}>Facturé</span>
                      <span className={styles.compagnonStatValue}>{formatH(c.tFacture)}</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={cn(styles.progressFill, c.delta >= 0 ? styles.progressGain : styles.progressPerte)}
                        style={{ width: `${Math.min(100, c.tFacture > 0 ? (c.tReel / c.tFacture) * 100 : 0)}%` }}
                      />
                    </div>
                    <div className={styles.compagnonStat}>
                      <span className={styles.compagnonStatLabel}>Réel</span>
                      <span className={styles.compagnonStatValue}>{formatH(c.tReel)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.fichesEnCours.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Fiches en cours <span className={styles.count}>{data.fichesEnCours.length}</span></h2>
              <Button variant="ghost" size="sm">Voir tout</Button>
            </div>
            <div className={styles.orList}>
              {data.fichesEnCours.map((f) => {
                const compagnonActif = f.pointagesFiche[0]?.compagnon
                return (
                  <div key={f.id} className={styles.orItem}>
                    <div className={styles.orLeft}>
                      <span className={styles.orNumero}>{f.numero}</span>
                      <span className={styles.orVehicule}>
                        {f.vehicule.marque} {f.vehicule.modele}
                        {f.vehicule.immatriculation && <span className={styles.orImmat}> · {f.vehicule.immatriculation}</span>}
                      </span>
                      <span className={styles.orDesc}>{f.travaux.split('\n')[0]}</span>
                    </div>
                    <div className={styles.orRight}>
                      <Badge variant={f.statut === 'EN_COURS' ? 'blue' : f.statut === 'EN_ATTENTE' ? 'warning' : 'muted'} dot>
                        {f.statut === 'EN_COURS' ? 'En cours' : f.statut === 'EN_ATTENTE' ? 'En attente' : 'En pause'}
                      </Badge>
                      {compagnonActif && (
                        <span className={styles.orCompagnon}>{compagnonActif.user?.prenom ?? compagnonActif.prenom} {(compagnonActif.user?.nom ?? compagnonActif.nom)?.[0] ?? ''}..</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {data.fichesEnCours.length === 0 && data.caJour === 0 && (
          <div className={styles.empty}>
            <Wrench size={36} />
            <p>Aucune activité aujourd&apos;hui</p>
            <Button variant="primary" icon={<Plus />}>Créer une fiche</Button>
          </div>
        )}

      </div>
    </>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

function KpiCard({ label, value, sub, color, icon }: { label: string; value: string; sub: string; color: string; icon: React.ReactNode }) {
  return (
    <div className={`${styles.kpiCard} ${styles['kpi_' + color]}`}>
      <div className={styles.kpiTop}>
        <span className={styles.kpiLabel}>{label}</span>
        <span className={styles.kpiIcon}>{icon}</span>
      </div>
      <span className={styles.kpiValue}>{value}</span>
      <span className={styles.kpiSub}>{sub}</span>
    </div>
  )
}

function RentabiliteCard({ value, semaine, mois }: { value: number; semaine: number; mois: number }) {
  const isGain = value >= 0
  const fmt = (v: number) => `${v >= 0 ? '+' : ''}${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)}`
  return (
    <div className={`${styles.kpiCard} ${isGain ? styles.kpi_success : styles.kpi_error}`}>
      <div className={styles.kpiTop}>
        <span className={styles.kpiLabel}>Rentabilité jour</span>
        <span className={styles.kpiIcon}>{isGain ? <TrendUp weight="bold" /> : <TrendDown weight="bold" />}</span>
      </div>
      <span className={styles.kpiValue}>{fmt(value)}</span>
      <div className={styles.rentMiniStats}>
        <span className={`${styles.miniStat} ${semaine >= 0 ? styles.gain : styles.perte}`}>Sem. {fmt(semaine)}</span>
        <span className={`${styles.miniStat} ${mois >= 0 ? styles.gain : styles.perte}`}>Mois {fmt(mois)}</span>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className={`${styles.statCard} ${styles['stat_' + color]}`}>
      <span className={styles.statIcon}>{icon}</span>
      <div className={styles.statInfo}>
        <span className={styles.statValue}>{value}</span>
        <span className={styles.statLabel}>{label}</span>
      </div>
    </div>
  )
}
 