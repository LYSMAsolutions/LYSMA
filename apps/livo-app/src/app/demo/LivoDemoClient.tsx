'use client'

import { useMemo, useState } from 'react'
import styles from './page.module.css'

type ViewKey = 'dashboard' | 'pointage' | 'atelier' | 'fiches' | 'rentabilite' | 'absences' | 'rapports'
type DeviceMode = 'desktop' | 'tablet' | 'mobile'
type FicheStatus = 'En cours' | 'En attente' | 'Terminée' | 'Contrôle'
type CompanionStatus = 'Arrivé atelier' | 'En pause' | 'En intervention' | 'Formation'

type Companion = {
  id: string
  name: string
  role: string
  status: CompanionStatus
  arrivedAt: string
  currentTask: string
  productive: string
  realHours: number
  billedHours: number
}

type Vehicle = {
  id: string
  label: string
  plate: string
  client: string
  ficheId: string
  status: string
  entryAt: string
}

type Fiche = {
  id: string
  number: string
  vehicle: string
  plate: string
  client: string
  work: string
  status: FicheStatus
  companion: string
  plannedHours: number
  realHours: number
  amount: number
  cost: number
  dueAt: string
}

type Absence = {
  id: string
  name: string
  reason: string
  period: string
  status: string
}

type DemoStats = {
  dayRevenue: number
  monthRevenue: number
  amount: number
  margin: number
  realHours: number
  billedHours: number
  occupancy: number
  vehiclesInShop: number
  closedToday: number
}

const views: Array<{ key: ViewKey; label: string; hint: string }> = [
  { key: 'dashboard', label: 'Dashboard', hint: 'Vue rapide' },
  { key: 'pointage', label: 'Pointage', hint: 'Compagnons' },
  { key: 'atelier', label: 'Atelier', hint: 'Véhicules' },
  { key: 'fiches', label: 'Fiches', hint: 'Travaux' },
  { key: 'rentabilite', label: 'Rentabilité', hint: 'Marge' },
  { key: 'absences', label: 'Absences', hint: 'Planning' },
  { key: 'rapports', label: 'Rapports', hint: 'Synthèse' },
]

const companions: Companion[] = [
  {
    id: 'marc',
    name: 'Marc Dubois',
    role: 'Chef atelier',
    status: 'En intervention',
    arrivedAt: '07:42',
    currentTask: 'FT-2026-014 - distribution Clio IV',
    productive: '6 h 20',
    realHours: 6.3,
    billedHours: 7.1,
  },
  {
    id: 'lina',
    name: 'Lina Martin',
    role: 'Carrossière',
    status: 'En intervention',
    arrivedAt: '07:55',
    currentTask: 'FT-2026-016 - préparation pare-chocs',
    productive: '5 h 45',
    realHours: 5.75,
    billedHours: 6.2,
  },
  {
    id: 'karim',
    name: 'Karim Benali',
    role: 'Mécanicien',
    status: 'En pause',
    arrivedAt: '08:03',
    currentTask: 'Pause déjeuner',
    productive: '4 h 10',
    realHours: 4.2,
    billedHours: 4.6,
  },
  {
    id: 'sophie',
    name: 'Sophie Leclerc',
    role: 'Peintre',
    status: 'En intervention',
    arrivedAt: '07:50',
    currentTask: 'FT-2026-019 - teinte aile arrière',
    productive: '5 h 05',
    realHours: 5.1,
    billedHours: 5.8,
  },
  {
    id: 'hugo',
    name: 'Hugo Bernard',
    role: 'Apprenti',
    status: 'Formation',
    arrivedAt: '08:12',
    currentTask: 'Contrôle qualité accompagné',
    productive: '3 h 30',
    realHours: 3.5,
    billedHours: 2.8,
  },
]

const fiches: Fiche[] = [
  {
    id: 'ft-014',
    number: 'FT-2026-014',
    vehicle: 'Renault Clio IV',
    plate: 'GH-246-MQ',
    client: 'Mme Perrin',
    work: 'Distribution, pompe à eau et révision',
    status: 'En cours',
    companion: 'Marc Dubois',
    plannedHours: 5.5,
    realHours: 4.75,
    amount: 620,
    cost: 352,
    dueAt: 'Aujourd’hui 17:30',
  },
  {
    id: 'ft-015',
    number: 'FT-2026-015',
    vehicle: 'Peugeot 308',
    plate: 'GM-821-LP',
    client: 'ETS Lavigne',
    work: 'Freinage avant et diagnostic bruit',
    status: 'En attente',
    companion: 'Karim Benali',
    plannedHours: 2.8,
    realHours: 1.4,
    amount: 390,
    cost: 214,
    dueAt: 'Demain 10:00',
  },
  {
    id: 'ft-016',
    number: 'FT-2026-016',
    vehicle: 'BMW Série 1',
    plate: 'FY-119-CR',
    client: 'M. Renaud',
    work: 'Pare-chocs avant, peinture et lustrage',
    status: 'Contrôle',
    companion: 'Lina Martin',
    plannedHours: 6.5,
    realHours: 6.1,
    amount: 980,
    cost: 571,
    dueAt: 'Aujourd’hui 16:45',
  },
  {
    id: 'ft-017',
    number: 'FT-2026-017',
    vehicle: 'Renault Kangoo',
    plate: 'BN-774-VT',
    client: 'Boulangerie Martin',
    work: 'Diagnostic démarrage et batterie',
    status: 'Terminée',
    companion: 'Marc Dubois',
    plannedHours: 1.5,
    realHours: 1.2,
    amount: 210,
    cost: 92,
    dueAt: 'Livrable',
  },
  {
    id: 'ft-019',
    number: 'FT-2026-019',
    vehicle: 'Citroën Jumpy',
    plate: 'HL-502-DK',
    client: 'Garage Moreau',
    work: 'Aile arrière, teinte et raccord',
    status: 'En cours',
    companion: 'Sophie Leclerc',
    plannedHours: 4.8,
    realHours: 3.9,
    amount: 740,
    cost: 410,
    dueAt: 'Demain 15:00',
  },
]

const vehicles: Vehicle[] = [
  { id: 'v1', label: 'Renault Clio IV', plate: 'GH-246-MQ', client: 'Mme Perrin', ficheId: 'ft-014', status: 'Travaux en cours', entryAt: '08:18' },
  { id: 'v2', label: 'Peugeot 308', plate: 'GM-821-LP', client: 'ETS Lavigne', ficheId: 'ft-015', status: 'Pièces attendues', entryAt: '09:05' },
  { id: 'v3', label: 'BMW Série 1', plate: 'FY-119-CR', client: 'M. Renaud', ficheId: 'ft-016', status: 'Contrôle qualité', entryAt: 'Hier 15:20' },
  { id: 'v4', label: 'Renault Kangoo', plate: 'BN-774-VT', client: 'Boulangerie Martin', ficheId: 'ft-017', status: 'Prêt à livrer', entryAt: '10:35' },
  { id: 'v5', label: 'Citroën Jumpy', plate: 'HL-502-DK', client: 'Garage Moreau', ficheId: 'ft-019', status: 'Peinture', entryAt: 'Hier 08:50' },
]

const absences: Absence[] = [
  { id: 'a1', name: 'Emma Girard', reason: 'Congé validé', period: 'Vendredi - journée', status: 'Planifié' },
  { id: 'a2', name: 'Karim Benali', reason: 'Formation climatisation', period: 'Mardi 14:00 - 17:00', status: 'Validé' },
  { id: 'a3', name: 'Hugo Bernard', reason: 'École alternance', period: 'Jeudi matin', status: 'Planifié' },
]

function euro(value: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
}

function hours(value: number) {
  return `${value.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} h`
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function LivoDemoClient() {
  const [activeView, setActiveView] = useState<ViewKey>('dashboard')
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')
  const [selectedFicheId, setSelectedFicheId] = useState<string>(fiches[0].id)
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>(companions[0].id)
  const [notice, setNotice] = useState('Démo isolée : aucune donnée réelle n’est enregistrée.')

  const selectedFiche = fiches.find((fiche) => fiche.id === selectedFicheId) ?? fiches[0]
  const selectedCompanion = companions.find((companion) => companion.id === selectedCompanionId) ?? companions[0]

  const stats = useMemo(() => {
    const amount = fiches.reduce((sum, fiche) => sum + fiche.amount, 0)
    const cost = fiches.reduce((sum, fiche) => sum + fiche.cost, 0)
    const realHours = fiches.reduce((sum, fiche) => sum + fiche.realHours, 0)
    const billedHours = fiches.reduce((sum, fiche) => sum + fiche.plannedHours, 0)

    return {
      dayRevenue: 2480,
      monthRevenue: 42800,
      amount,
      margin: amount - cost,
      realHours,
      billedHours,
      occupancy: 82,
      vehiclesInShop: vehicles.length,
      closedToday: fiches.filter((fiche) => fiche.status === 'Terminée').length,
    }
  }, [])

  function simulateAction(message: string) {
    setNotice(`${message} Simulation uniquement, rien n’est enregistré.`)
  }

  function openFiche(ficheId: string) {
    setSelectedFicheId(ficheId)
    setActiveView('fiches')
  }

  return (
    <div className={styles.demoShell}>
      <aside className={styles.sidebar}>
        <div className={styles.garageCard}>
          <span className={styles.garageLabel}>Garage fictif</span>
          <strong>Garage Morel Auto</strong>
          <small>Mécanique, carrosserie et entretien rapide</small>
        </div>

        <nav className={styles.nav} aria-label="Navigation demo LIVO">
          {views.map((view) => (
            <button
              key={view.key}
              type="button"
              className={cn(styles.navButton, activeView === view.key && styles.navButtonActive)}
              onClick={() => setActiveView(view.key)}
            >
              <span>{view.label}</span>
              <small>{view.hint}</small>
            </button>
          ))}
        </nav>

        <div className={styles.devicePanel}>
          <span>Mode de présentation</span>
          <div className={styles.deviceSwitch}>
            {(['desktop', 'tablet', 'mobile'] as DeviceMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                className={cn(styles.deviceButton, deviceMode === mode && styles.deviceButtonActive)}
                onClick={() => setDeviceMode(mode)}
              >
                {mode === 'desktop' ? 'Ordinateur' : mode === 'tablet' ? 'Tablette' : 'Atelier'}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className={cn(styles.demoFrame, styles[deviceMode])}>
        <div className={styles.appHeader}>
          <div>
            <span className={styles.overline}>LIVO - Démo terrain</span>
            <h1>{viewTitle(activeView)}</h1>
            <p>{viewDescription(activeView)}</p>
          </div>
          <div className={styles.headerStatus}>
            <strong>Mercredi 27 mai</strong>
            <span>Atelier ouvert depuis 07:42</span>
          </div>
        </div>

        <div className={styles.notice}>{notice}</div>

        {activeView === 'dashboard' && (
          <DashboardView stats={stats} onOpenFiche={openFiche} onAction={simulateAction} />
        )}

        {activeView === 'pointage' && (
          <PointageView
            selectedCompanionId={selectedCompanion.id}
            onSelectCompanion={setSelectedCompanionId}
            onAction={simulateAction}
          />
        )}

        {activeView === 'atelier' && <AtelierView onOpenFiche={openFiche} />}

        {activeView === 'fiches' && (
          <FichesView selectedFiche={selectedFiche} onSelectFiche={setSelectedFicheId} onAction={simulateAction} />
        )}

        {activeView === 'rentabilite' && <RentabiliteView stats={stats} />}

        {activeView === 'absences' && <AbsencesView onAction={simulateAction} />}

        {activeView === 'rapports' && <RapportsView stats={stats} onAction={simulateAction} />}
      </section>
    </div>
  )
}

function viewTitle(view: ViewKey) {
  const titles: Record<ViewKey, string> = {
    dashboard: 'Tableau de bord atelier',
    pointage: 'Pointage des compagnons',
    atelier: 'Vue atelier',
    fiches: 'Fiches de travail',
    rentabilite: 'Rentabilité atelier',
    absences: 'Congés et absences',
    rapports: 'Rapports simples',
  }

  return titles[view]
}

function viewDescription(view: ViewKey) {
  const descriptions: Record<ViewKey, string> = {
    dashboard: 'Une vision claire de la journée, des véhicules présents, des heures et de la marge estimée.',
    pointage: 'Suivez les arrivées, pauses, interventions et fins de journée sans ressaisie inutile.',
    atelier: 'Visualisez les véhicules présents, leur statut et la fiche atelier associée.',
    fiches: 'Consultez les travaux, les temps prévus, les temps réels et les marges estimées.',
    rentabilite: 'Comparez les heures vendues, les heures passées et la rentabilité par dossier.',
    absences: 'Gardez une vue simple sur les congés, formations et indisponibilités prévues.',
    rapports: 'Préparez une synthèse lisible pour piloter l’activité sans tableur compliqué.',
  }

  return descriptions[view]
}

function DashboardView({
  stats,
  onOpenFiche,
  onAction,
}: {
  stats: DemoStats
  onOpenFiche: (ficheId: string) => void
  onAction: (message: string) => void
}) {
  return (
    <div className={styles.viewStack}>
      <div className={styles.kpiGrid}>
        <Kpi label="CA du jour" value={euro(stats.dayRevenue)} detail="6 fiches facturables" tone="blue" />
        <Kpi label="Véhicules atelier" value={String(stats.vehiclesInShop)} detail="dont 2 prêts à livrer" tone="green" />
        <Kpi label="Heures réelles" value={hours(stats.realHours)} detail={`${hours(stats.billedHours)} prévues`} tone="orange" />
        <Kpi label="Marge estimée" value={euro(stats.margin)} detail="sur les fiches ouvertes" tone="purple" />
      </div>

      <div className={styles.gridTwo}>
        <section className={styles.panel}>
          <PanelTitle title="Fiches à surveiller" action="Voir toutes" onClick={() => onAction('Ouverture de la liste complète.')} />
          <div className={styles.list}>
            {fiches.slice(0, 4).map((fiche) => (
              <button key={fiche.id} type="button" className={styles.ficheRow} onClick={() => onOpenFiche(fiche.id)}>
                <span>
                  <strong>{fiche.number}</strong>
                  <small>{fiche.vehicle} - {fiche.client}</small>
                </span>
                <StatusBadge status={fiche.status} />
              </button>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <PanelTitle title="Atelier en temps réel" action="Actualiser" onClick={() => onAction('Actualisation demandée.')} />
          <div className={styles.timeline}>
            <TimelineItem time="07:42" title="Marc Dubois arrivé atelier" detail="Pointage validé" />
            <TimelineItem time="08:18" title="Clio IV entrée en intervention" detail="Distribution et pompe à eau" />
            <TimelineItem time="10:35" title="Kangoo prêt à livrer" detail="Diagnostic terminé" />
            <TimelineItem time="12:08" title="Pause atelier enregistrée" detail="3 compagnons en pause" />
          </div>
        </section>
      </div>
    </div>
  )
}

function PointageView({
  selectedCompanionId,
  onSelectCompanion,
  onAction,
}: {
  selectedCompanionId: string
  onSelectCompanion: (id: string) => void
  onAction: (message: string) => void
}) {
  const companion = companions.find((item) => item.id === selectedCompanionId) ?? companions[0]

  return (
    <div className={styles.gridTwo}>
      <section className={styles.panel}>
        <PanelTitle title="Compagnons pointés" action="Nouveau pointage" onClick={() => onAction('Pointage atelier demandé.')} />
        <div className={styles.companionGrid}>
          {companions.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cn(styles.companionCard, selectedCompanionId === item.id && styles.selectedCard)}
              onClick={() => onSelectCompanion(item.id)}
            >
              <span className={styles.avatar}>{initials(item.name)}</span>
              <strong>{item.name}</strong>
              <small>{item.role}</small>
              <StatusBadge status={item.status} />
            </button>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <PanelTitle title="Détail du pointage" action="Historique" onClick={() => onAction('Historique de pointage ouvert.')} />
        <div className={styles.detailCard}>
          <span className={styles.avatarLarge}>{initials(companion.name)}</span>
          <h2>{companion.name}</h2>
          <p>{companion.role}</p>
          <div className={styles.detailGrid}>
            <Info label="Arrivée" value={companion.arrivedAt} />
            <Info label="État" value={companion.status} />
            <Info label="Productif" value={companion.productive} />
            <Info label="Mission" value={companion.currentTask} />
          </div>
          <div className={styles.actionRow}>
            <button type="button" className={styles.secondaryButton} onClick={() => onAction('Pause enregistrée.')}>Pause</button>
            <button type="button" className={styles.primaryButton} onClick={() => onAction('Fin de journée demandée.')}>Dépointer</button>
          </div>
        </div>
      </section>
    </div>
  )
}

function AtelierView({ onOpenFiche }: { onOpenFiche: (ficheId: string) => void }) {
  return (
    <div className={styles.viewStack}>
      <div className={styles.kpiGrid}>
        <Kpi label="Présents" value="5" detail="compagnons pointés" tone="blue" />
        <Kpi label="En cours" value="3" detail="véhicules en intervention" tone="green" />
        <Kpi label="En attente" value="1" detail="pièces ou validation client" tone="orange" />
        <Kpi label="Prêts" value="1" detail="livraison possible" tone="purple" />
      </div>

      <section className={styles.panel}>
        <PanelTitle title="Véhicules présents à l’atelier" />
        <div className={styles.vehicleGrid}>
          {vehicles.map((vehicle) => (
            <button key={vehicle.id} type="button" className={styles.vehicleCard} onClick={() => onOpenFiche(vehicle.ficheId)}>
              <span className={styles.plate}>{vehicle.plate}</span>
              <strong>{vehicle.label}</strong>
              <small>{vehicle.client}</small>
              <span className={styles.vehicleMeta}>{vehicle.status} - Entrée {vehicle.entryAt}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

function FichesView({
  selectedFiche,
  onSelectFiche,
  onAction,
}: {
  selectedFiche: Fiche
  onSelectFiche: (id: string) => void
  onAction: (message: string) => void
}) {
  return (
    <div className={styles.gridTwoWide}>
      <section className={styles.panel}>
        <PanelTitle title="Liste des fiches de travail" action="Créer une fiche" onClick={() => onAction('Création de fiche ouverte.')} />
        <div className={styles.tableLike}>
          {fiches.map((fiche) => (
            <button
              key={fiche.id}
              type="button"
              className={cn(styles.tableRow, selectedFiche.id === fiche.id && styles.tableRowActive)}
              onClick={() => onSelectFiche(fiche.id)}
            >
              <span>
                <strong>{fiche.number}</strong>
                <small>{fiche.work}</small>
              </span>
              <span>{fiche.vehicle}</span>
              <span>{fiche.companion}</span>
              <StatusBadge status={fiche.status} />
            </button>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <PanelTitle title="Détail de la fiche" action="Imprimer" onClick={() => onAction('Export PDF demandé.')} />
        <div className={styles.detailCard}>
          <div className={styles.detailHeader}>
            <span>
              <strong>{selectedFiche.number}</strong>
              <small>{selectedFiche.client}</small>
            </span>
            <StatusBadge status={selectedFiche.status} />
          </div>
          <h2>{selectedFiche.vehicle}</h2>
          <p>{selectedFiche.work}</p>
          <div className={styles.detailGrid}>
            <Info label="Immatriculation" value={selectedFiche.plate} />
            <Info label="Compagnon" value={selectedFiche.companion} />
            <Info label="Échéance" value={selectedFiche.dueAt} />
            <Info label="Montant" value={euro(selectedFiche.amount)} />
            <Info label="Temps prévu" value={hours(selectedFiche.plannedHours)} />
            <Info label="Temps réel" value={hours(selectedFiche.realHours)} />
          </div>
          <div className={styles.progressBlock}>
            <span>Avancement estimé</span>
            <div className={styles.progressTrack}>
              <span style={{ width: `${Math.min(100, (selectedFiche.realHours / selectedFiche.plannedHours) * 100)}%` }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function RentabiliteView({ stats }: { stats: DemoStats }) {
  return (
    <div className={styles.viewStack}>
      <div className={styles.kpiGrid}>
        <Kpi label="CA fiches ouvertes" value={euro(stats.amount)} detail="hors devis non validés" tone="blue" />
        <Kpi label="Marge estimée" value={euro(stats.margin)} detail="pièces et temps inclus" tone="green" />
        <Kpi label="Occupation atelier" value={`${stats.occupancy} %`} detail="objectif 80 %" tone="purple" />
        <Kpi label="Écart heures" value="+2,9 h" detail="heures vendues vs réelles" tone="orange" />
      </div>

      <section className={styles.panel}>
        <PanelTitle title="Rentabilité par fiche" />
        <div className={styles.tableLike}>
          {fiches.map((fiche) => {
            const margin = fiche.amount - fiche.cost
            return (
              <div key={fiche.id} className={styles.tableRowStatic}>
                <span>
                  <strong>{fiche.number}</strong>
                  <small>{fiche.vehicle}</small>
                </span>
                <span>{euro(fiche.amount)}</span>
                <span>{euro(fiche.cost)}</span>
                <span className={margin > 200 ? styles.positive : styles.neutral}>{euro(margin)}</span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function AbsencesView({ onAction }: { onAction: (message: string) => void }) {
  return (
    <div className={styles.gridTwo}>
      <section className={styles.panel}>
        <PanelTitle title="Planning des absences" action="Ajouter" onClick={() => onAction('Ajout d’absence ouvert.')} />
        <div className={styles.list}>
          {absences.map((absence) => (
            <button key={absence.id} type="button" className={styles.ficheRow} onClick={() => onAction(`Absence ${absence.name} consultée.`)}>
              <span>
                <strong>{absence.name}</strong>
                <small>{absence.reason} - {absence.period}</small>
              </span>
              <span className={styles.smallChip}>{absence.status}</span>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <PanelTitle title="Impact atelier" />
        <div className={styles.kpiColumn}>
          <Kpi label="Capacité vendredi" value="82 %" detail="planning encore confortable" tone="green" />
          <Kpi label="Formation prévue" value="3 h" detail="Karim - climatisation" tone="blue" />
          <Kpi label="Risque retard" value="Faible" detail="aucune fiche urgente bloquée" tone="purple" />
        </div>
      </section>
    </div>
  )
}

function RapportsView({ stats, onAction }: { stats: DemoStats; onAction: (message: string) => void }) {
  return (
    <div className={styles.viewStack}>
      <div className={styles.kpiGrid}>
        <Kpi label="CA semaine" value="13 650,00 €" detail="du lundi au vendredi" tone="blue" />
        <Kpi label="CA mois" value={euro(stats.monthRevenue)} detail="objectif 48 000 €" tone="green" />
        <Kpi label="Fiches terminées" value="38" detail="sur le mois en cours" tone="purple" />
        <Kpi label="Temps productif" value="79 %" detail="moyenne atelier" tone="orange" />
      </div>

      <section className={styles.panel}>
        <PanelTitle title="Exports de démonstration" action="Exporter" onClick={() => onAction('Export rapport demandé.')} />
        <div className={styles.reportGrid}>
          <ReportCard title="Rapport atelier" text="Synthèse des fiches, véhicules, compagnons et statuts." onClick={() => onAction('Rapport atelier ouvert.')} />
          <ReportCard title="Pointage mensuel" text="Heures réelles, pauses, absences et formations." onClick={() => onAction('Pointage mensuel ouvert.')} />
          <ReportCard title="Rentabilité" text="CA, coûts estimés, marges et écart entre temps vendu et temps passé." onClick={() => onAction('Rapport rentabilité ouvert.')} />
        </div>
      </section>
    </div>
  )
}

function Kpi({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: 'blue' | 'green' | 'orange' | 'purple' }) {
  return (
    <article className={cn(styles.kpi, styles[`tone${tone}`])}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  )
}

function PanelTitle({ title, action, onClick }: { title: string; action?: string; onClick?: () => void }) {
  return (
    <div className={styles.panelTitle}>
      <h2>{title}</h2>
      {action ? (
        <button type="button" onClick={onClick}>
          {action}
        </button>
      ) : null}
    </div>
  )
}

function StatusBadge({ status }: { status: FicheStatus | CompanionStatus }) {
  const tone = status.includes('attente') || status === 'En pause'
    ? styles.badgeWarning
    : status === 'Terminée' || status === 'Arrivé atelier'
      ? styles.badgeSuccess
      : status === 'Contrôle' || status === 'Formation'
        ? styles.badgeInfo
        : styles.badgeActive

  return <span className={cn(styles.statusBadge, tone)}>{status}</span>
}

function TimelineItem({ time, title, detail }: { time: string; title: string; detail: string }) {
  return (
    <div className={styles.timelineItem}>
      <span>{time}</span>
      <div>
        <strong>{title}</strong>
        <small>{detail}</small>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.info}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function ReportCard({ title, text, onClick }: { title: string; text: string; onClick: () => void }) {
  return (
    <button type="button" className={styles.reportCard} onClick={onClick}>
      <strong>{title}</strong>
      <span>{text}</span>
    </button>
  )
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
