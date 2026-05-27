import type { Metadata } from 'next'
import Link from 'next/link'
import styles from '../demo/page.module.css'

export const metadata: Metadata = {
  title: 'Démo admin LIVO',
  description:
    'Démo publique de l’espace admin LIVO : dashboard atelier, compagnons, véhicules, fiches de travaux et rentabilité.',
  robots: {
    index: false,
    follow: true,
  },
}

const stats = [
  { label: 'CA du jour', value: '1 240 €', hint: '+ 18 % vs moyenne' },
  { label: 'Fiches en cours', value: '8', hint: '3 urgentes' },
  { label: 'Compagnons actifs', value: '4', hint: '1 en pause' },
  { label: 'Rentabilité atelier', value: '72 %', hint: 'Objectif 70 %' },
]

const fiches = [
  ['FT-2026-014', 'Renault Clio IV', 'Distribution + pompe à eau', 'En attente'],
  ['FT-2026-015', 'Peugeot 308', 'Freinage avant', 'En cours'],
  ['FT-2026-016', 'BMW Série 1', 'Pare-chocs + peinture', 'En cours'],
  ['FT-2026-017', 'Renault Kangoo', 'Diagnostic démarrage', 'Terminée'],
]

const compagnons = [
  ['Marc Dubois', 'Chef atelier', 'Disponible'],
  ['Lina Martin', 'Carrossière', 'Sur fiche'],
  ['Karim Benali', 'Mécanicien', 'Pause café'],
  ['Sophie Leclerc', 'Peintre', 'Sur fiche'],
]

export default function LivoDemoAdminPage() {
  return (
    <main className={styles.adminDemo}>
      <aside className={styles.adminSidebar} aria-label="Navigation démo admin">
        <div className={styles.adminLogo}>
          <span>L</span>
          <strong>LIVO</strong>
        </div>
        <nav>
          <a href="#dashboard" aria-current="page">Tableau de bord</a>
          <a href="#fiches">Fiches</a>
          <a href="#compagnons">Compagnons</a>
          <a href="#vehicules">Véhicules</a>
          <a href="#rentabilite">Rentabilité</a>
        </nav>
        <Link href="/demo" className={styles.adminBack}>Changer d’espace</Link>
      </aside>

      <section className={styles.adminMain}>
        <header className={styles.adminHeader}>
          <div>
            <p className={styles.demoBadge}>Démo admin · données fictives</p>
            <h1 id="dashboard">Garage Morel Auto</h1>
            <span>Pilotage atelier, pointage, fiches et rentabilité en temps réel.</span>
          </div>
          <Link href="/demo-atelier" className={styles.adminHeaderCta}>Voir l’espace atelier</Link>
        </header>

        <div className={styles.adminStats}>
          {stats.map((stat) => (
            <article key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.hint}</small>
            </article>
          ))}
        </div>

        <div className={styles.adminGrid}>
          <section className={styles.adminPanel} id="fiches">
            <div className={styles.adminPanelHead}>
              <h2>Fiches de travaux</h2>
              <span>Suivi atelier</span>
            </div>
            <div className={styles.adminTable}>
              {fiches.map(([numero, vehicule, travaux, statut]) => (
                <div className={styles.adminRow} key={numero}>
                  <strong>{numero}</strong>
                  <span>{vehicule}</span>
                  <span>{travaux}</span>
                  <em>{statut}</em>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.adminPanel} id="compagnons">
            <div className={styles.adminPanelHead}>
              <h2>Compagnons</h2>
              <span>Présence atelier</span>
            </div>
            <div className={styles.adminList}>
              {compagnons.map(([nom, poste, statut]) => (
                <div key={nom}>
                  <span>{nom}</span>
                  <small>{poste}</small>
                  <strong>{statut}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.adminPanel} id="vehicules">
            <div className={styles.adminPanelHead}>
              <h2>Véhicules atelier</h2>
              <span>Vue rapide</span>
            </div>
            <div className={styles.adminTimeline}>
              <div><span>08:10</span><strong>Renault Clio IV entrée atelier</strong></div>
              <div><span>09:40</span><strong>BMW Série 1 en préparation peinture</strong></div>
              <div><span>11:25</span><strong>Peugeot 308 contrôle freinage</strong></div>
            </div>
          </section>

          <section className={styles.adminPanel} id="rentabilite">
            <div className={styles.adminPanelHead}>
              <h2>Rentabilité</h2>
              <span>Estimation du jour</span>
            </div>
            <div className={styles.adminGauge}>
              <span style={{ width: '72%' }} />
            </div>
            <p className={styles.adminNote}>4 h 50 facturables suivies aujourd’hui sur les fiches en cours.</p>
          </section>
        </div>
      </section>
    </main>
  )
}
