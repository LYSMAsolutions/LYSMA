'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendUp, TrendDown, CurrencyEur, Clock, Wrench, Users } from '@phosphor-icons/react'
import { Badge } from '@/components/ui'
import styles from './RapportsClient.module.css'

type FicheMois = {
  mois: string
  label: string
  ca: number
  rentabilite: number
  nbFiches: number
}

type CompagnonStat = {
  id: string
  nom: string
  prenom: string
  poste: string | null
  nbFiches: number
  tFacture: number
  tReel: number
  delta: number
  ca: number
}

type FicheRecente = {
  id: string
  numero: string
  vehicule: string
  clientNom: string
  dateFermeture: string
  montantHT: number
  tempsFacture: number
  tempsReel: number
  delta: number
  tauxApplique: string | null
}

type Props = {
  fichesMois: FicheMois[]
  compagnonStats: CompagnonStat[]
  fichesRecentes: FicheRecente[]
  caTotal: number
  caAnnee: number
  rentabiliteAnnee: number
  nbFichesAnnee: number
}

function formatEur(v: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)
}
function formatH(h: number) {
  const hh = Math.floor(h); const mm = Math.round((h - hh) * 60)
  return mm > 0 ? `${hh}h${mm.toString().padStart(2,'0')}` : `${hh}h`
}

export function RapportsClient({ fichesMois, compagnonStats, fichesRecentes, caTotal, caAnnee, rentabiliteAnnee, nbFichesAnnee }: Props) {
  const [periode, setPeriode] = useState<'mois' | 'annee'>('mois')

  const moisActuel = fichesMois[fichesMois.length - 1]
  const moisPrecedent = fichesMois[fichesMois.length - 2]
  const evolutionCA = moisPrecedent && moisPrecedent.ca > 0
    ? ((moisActuel?.ca ?? 0) - moisPrecedent.ca) / moisPrecedent.ca * 100
    : 0

  return (
    <div className={styles.wrapper}>

      {/* ── KPIs ──────────────────────────────────────────── */}
      <div className={styles.kpisGrid}>
        <KpiCard
          icon={<CurrencyEur weight="fill" />}
          label="CA ce mois"
          value={formatEur(moisActuel?.ca ?? 0)}
          sub={` Gain : ${formatEur(moisActuel?.rentabilite ?? 0)}`}
          trend={(moisActuel?.rentabilite ?? 0) >= 0 ? 'up' : 'down'}
        />
        <KpiCard
          icon={<TrendUp weight="fill" />}
          label="CA année facturé"
          value={formatEur(caAnnee)}
          sub={`Gain : ${formatEur(rentabiliteAnnee)}`}
          trend={rentabiliteAnnee >= 0 ? 'up' : 'down'}
        />
        <KpiCard
          icon={<TrendUp weight="fill" />}
          label="Gain annuel"
          value={formatEur(rentabiliteAnnee)}
          sub="Surplus temps facturé vs réel"
          trend={rentabiliteAnnee >= 0 ? 'up' : 'down'}
        />
        <KpiCard
          icon={<Wrench weight="fill" />}
          label="Fiches ce mois"
          value={String(moisActuel?.nbFiches ?? 0)}
          sub={`Gain : ${formatEur(moisActuel?.rentabilite ?? 0)}`}
          trend={(moisActuel?.rentabilite ?? 0) >= 0 ? 'up' : 'down'}
        />
      </div>

      {/* ── Graphique CA par mois ─────────────────────────── */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Chiffre d'affaires mensuel</h2>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${periode === 'mois' ? styles.tabActive : ''}`} onClick={() => setPeriode('mois')}>6 mois</button>
            <button className={`${styles.tab} ${periode === 'annee' ? styles.tabActive : ''}`} onClick={() => setPeriode('annee')}>Année</button>
          </div>
        </div>
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={fichesMois.slice(periode === 'mois' ? -6 : -12)} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="label" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k€`} />
              <Tooltip
                contentStyle={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)', borderRadius: 8, fontSize: 12 }}
                formatter={(value: any) => [formatEur(value as number), 'CA']}                cursor={{ fill: 'rgba(26,111,255,0.06)' }}
              />
              <Bar dataKey="ca" radius={[4,4,0,0]}>
                {fichesMois.slice(periode === 'mois' ? -6 : -12).map((_, i, arr) => (
                  <Cell key={i} fill={i === arr.length - 1 ? 'var(--color-blue-electric)' : 'rgba(26,111,255,0.35)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.twoCol}>

        {/* ── Stats par compagnon ───────────────────────── */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}><Users size={14} /> Compagnons — ce mois</h2>
          </div>
          {compagnonStats.length === 0 ? (
            <p className={styles.empty}>Aucune donnée ce mois</p>
          ) : (
            <div className={styles.compagnonsList}>
              {compagnonStats.sort((a,b) => b.ca - a.ca).map(c => (
                <div key={c.id} className={styles.compagnonRow}>
                  <div className={styles.compagnonAvatar}>{c.prenom[0]}{c.nom[0]}</div>
                  <div className={styles.compagnonInfo}>
                    <span className={styles.compagnonNom}>{c.prenom} {c.nom}</span>
                    <span className={styles.compagnonPoste}>{c.poste ?? 'Mécanicien'} · {c.nbFiches} fiche{c.nbFiches > 1 ? 's' : ''}</span>
                  </div>
                  <div className={styles.compagnonStats}>
                    <span className={styles.compagnonCA}>{formatEur(c.ca)}</span>
                    <span className={`${styles.compagnonDelta} ${c.delta >= 0 ? styles.gain : styles.perte}`}>
                      {c.delta >= 0 ? <TrendUp size={10} /> : <TrendDown size={10} />}
                      {c.delta >= 0 ? '+' : ''}{formatEur(c.delta)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Fiches récentes ───────────────────────────── */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}><Wrench size={14} /> Fiches clôturées récentes</h2>
          </div>
          {fichesRecentes.length === 0 ? (
            <p className={styles.empty}>Aucune fiche clôturée</p>
          ) : (
            <div className={styles.fichesList}>
              {fichesRecentes.map(f => (
                <div key={f.id} className={styles.ficheRow}>
                  <div className={styles.ficheLeft}>
                    <span className={styles.ficheNumero}>{f.numero}</span>
                    <span className={styles.ficheVehicule}>{f.vehicule}</span>
                    <span className={styles.ficheClient}>{f.clientNom}</span>
                  </div>
                  <div className={styles.ficheRight}>
                    <span className={styles.ficheMontant}>{formatEur(f.montantHT)}</span>
                    <span className={`${styles.ficheDelta} ${f.delta >= 0 ? styles.gain : styles.perte}`}>
                      {f.delta >= 0 ? '+' : ''}{formatEur(f.delta)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function KpiCard({ icon, label, value, sub, trend }: { icon: React.ReactNode; label: string; value: string; sub?: string; trend?: 'up' | 'down' }) {
  return (
    <div className={styles.kpi}>
      <div className={styles.kpiIcon}>{icon}</div>
      <div className={styles.kpiBody}>
        <span className={styles.kpiLabel}>{label}</span>
        <span className={styles.kpiValue}>{value}</span>
        {sub && (
          <span className={`${styles.kpiSub} ${trend === 'up' ? styles.gain : trend === 'down' ? styles.perte : ''}`}>
            {trend === 'up' && <TrendUp size={10} />}
            {trend === 'down' && <TrendDown size={10} />}
            {sub}
          </span>
        )}
      </div>
    </div>
  )
}
