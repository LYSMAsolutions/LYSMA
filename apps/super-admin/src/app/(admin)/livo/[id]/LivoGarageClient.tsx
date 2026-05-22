'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

type AuditRow = {
  id: string
  action: string
  statut: string
  acteurEmail: string | null
  resume: string | null
  erreur: string | null
  createdAt: string
}

type Props = {
  garage: any
  auditLogs: AuditRow[]
  livoUrl: string
}

function formatEur(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0))
}

function nullifyEmpty<T extends Record<string, any>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, item === '' ? null : item]),
  )
}

export function LivoGarageClient({ garage, auditLogs, livoUrl }: Props) {
  const router = useRouter()

  if (!garage) {
    return <div style={{ padding: 20 }}>Impossible de charger les donnees du garage.</div>
  }

  const stats = garage.stats ?? {}
  const owner = garage.owner ?? {}
  const compagnons = garage.compagnons ?? []
  const ficheTravaux = garage.ficheTravaux ?? []
  const taux = garage.taux ?? []
  const vehicules = garage.vehicules ?? []

  const [abonnementActif, setAbonnementActif] = useState(Boolean(garage.abonnementActif))
  const [actif, setActif] = useState(Boolean(garage.actif))
  const [garageForm, setGarageForm] = useState({
    nom: garage.nom ?? '',
    adresse: garage.adresse ?? '',
    ville: garage.ville ?? '',
    codePostal: garage.codePostal ?? '',
    telephone: garage.telephone ?? '',
    email: garage.email ?? '',
    siret: garage.siret ?? '',
    passwordAtelier: '',
  })
  const [ownerForm, setOwnerForm] = useState({
    prenom: owner.prenom ?? '',
    nom: owner.nom ?? '',
    telephone: owner.telephone ?? '',
    actif: Boolean(owner.actif ?? true),
  })
  const [saving, setSaving] = useState(false)

  const joursRestants = garage.trialEndsAt
    ? Math.ceil((new Date(garage.trialEndsAt).getTime() - Date.now()) / 86400000)
    : null

  async function save() {
    setSaving(true)
    const garagePayload = nullifyEmpty(garageForm)
    if (!garageForm.passwordAtelier) delete garagePayload.passwordAtelier

    try {
      const res = await fetch(`/api/livo/garages/${garage.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          abonnementActif,
          actif,
          garage: garagePayload,
          owner: nullifyEmpty(ownerForm),
        }),
      })

      if (!res.ok) throw new Error('Erreur sauvegarde')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.detail}>
      <div className={styles.header}>
        <div>
          <div className={styles.nom}>{garage.nom ?? 'Garage sans nom'}</div>
          <div className={styles.owner}>
            {owner.prenom ?? ''} {owner.nom ?? ''} - {owner.email ?? 'email inconnu'}
          </div>
          {(garage.adresse || garage.codePostal || garage.ville) && (
            <div className={styles.addr}>
              {[garage.adresse, garage.codePostal, garage.ville].filter(Boolean).join(', ')}
            </div>
          )}
        </div>

        <div className={styles.headerRight}>
          <a className={styles.btnGhost} href={livoUrl} target="_blank" rel="noreferrer">
            ouvrir_livo
          </a>
          <button className={styles.btnSave} onClick={save} disabled={saving}>
            {saving ? 'sauvegarde...' : 'enregistrer'}
          </button>
        </div>
      </div>

      <div className={styles.cols}>
        <div className={styles.col}>
          <div className={styles.panel}>
            <div className={styles.panelTitle}>// apercu_pilote</div>
            <div className={styles.previewBox}>
              <PreviewMetric label="etat_compte" value={actif ? 'operationnel' : 'suspendu'} tone={actif ? 'green' : 'red'} />
              <PreviewMetric label="abonnement" value={abonnementActif ? 'actif' : 'trial / inactif'} tone={abonnementActif ? 'green' : 'yellow'} />
              <PreviewMetric label="activite" value={`${stats.fichesTotal ?? 0} fiches - ${stats.compagnons ?? 0} compagnons`} tone="blue" />
              <p>
                Snapshot depuis l API interne LIVO. Chaque modification envoyee depuis ce cockpit
                est journalisee dans Super Admin.
              </p>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>// statistiques</div>
            <div className={styles.statsGrid}>
              <StatBox label="compagnons" value={stats.compagnons ?? 0} color="cyan" />
              <StatBox label="vehicules" value={stats.vehicules ?? 0} color="blue" />
              <StatBox label="fiches_total" value={stats.fichesTotal ?? 0} color="yellow" />
              <StatBox label="fiches_cloturees" value={stats.fichesCloturees ?? 0} color="green" />
              <StatBox label="ca_total" value={formatEur(stats.caTotal ?? 0)} color="purple" />
              {stats.dernierPointage && (
                <StatBox
                  label="dernier_pointage"
                  value={new Date(stats.dernierPointage).toLocaleDateString('fr-FR')}
                  color="muted"
                />
              )}
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>// controles_acces</div>
            <div className={styles.controls}>
              <Toggle label="abonnement_actif" checked={abonnementActif} onChange={setAbonnementActif} />
              <Toggle label="compte_actif" checked={actif} onChange={setActif} dangerWhenOff />
              <div className={styles.infoRow}>
                <span className={styles.controlLabel}>trial_fin</span>
                <span
                  style={{
                    color:
                      joursRestants !== null && joursRestants < 0
                        ? 'var(--red)'
                        : joursRestants !== null && joursRestants <= 7
                          ? 'var(--yellow)'
                          : 'var(--text-muted)',
                    fontSize: 11,
                  }}
                >
                  {garage.trialEndsAt
                    ? `${new Date(garage.trialEndsAt).toLocaleDateString('fr-FR')} (${joursRestants !== null && joursRestants < 0 ? `expire ${Math.abs(joursRestants)}j` : `${joursRestants}j restants`})`
                    : '-'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>// edition_garage</div>
            <div className={styles.formGrid}>
              <Field label="nom" value={garageForm.nom} onChange={(value) => setGarageForm({ ...garageForm, nom: value })} />
              <Field label="adresse" value={garageForm.adresse} onChange={(value) => setGarageForm({ ...garageForm, adresse: value })} />
              <Field label="code_postal" value={garageForm.codePostal} onChange={(value) => setGarageForm({ ...garageForm, codePostal: value })} />
              <Field label="ville" value={garageForm.ville} onChange={(value) => setGarageForm({ ...garageForm, ville: value })} />
              <Field label="telephone" value={garageForm.telephone} onChange={(value) => setGarageForm({ ...garageForm, telephone: value })} />
              <Field label="email" value={garageForm.email} onChange={(value) => setGarageForm({ ...garageForm, email: value })} />
              <Field label="siret" value={garageForm.siret} onChange={(value) => setGarageForm({ ...garageForm, siret: value })} />
              <Field label="mdp_atelier" value={garageForm.passwordAtelier} onChange={(value) => setGarageForm({ ...garageForm, passwordAtelier: value })} placeholder="vide = pas de changement" />
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>// proprietaire</div>
            <div className={styles.formGrid}>
              <Field label="prenom" value={ownerForm.prenom} onChange={(value) => setOwnerForm({ ...ownerForm, prenom: value })} />
              <Field label="nom" value={ownerForm.nom} onChange={(value) => setOwnerForm({ ...ownerForm, nom: value })} />
              <Field label="telephone" value={ownerForm.telephone} onChange={(value) => setOwnerForm({ ...ownerForm, telephone: value })} />
              <label className={styles.checkLine}>
                <input type="checkbox" checked={ownerForm.actif} onChange={(event) => setOwnerForm({ ...ownerForm, actif: event.target.checked })} />
                <span>owner actif</span>
              </label>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>// informations</div>
            <div className={styles.infoList}>
              {garage.telephone && <InfoRow k="telephone" v={garage.telephone} />}
              {garage.email && <InfoRow k="email" v={garage.email} />}
              {garage.siret && <InfoRow k="siret" v={garage.siret} />}
              <InfoRow k="cree_le" v={garage.createdAt ? new Date(garage.createdAt).toLocaleDateString('fr-FR') : '-'} />
            </div>
          </div>
        </div>

        <div className={styles.col}>
          <div className={styles.panel}>
            <div className={styles.panelTitle}>// compagnons ({compagnons.length})</div>
            <table className={styles.miniTable}>
              <thead>
                <tr><th>nom</th><th>poste</th><th>matricule</th><th>actif</th></tr>
              </thead>
              <tbody>
                {compagnons.map((compagnon: any) => (
                  <tr key={compagnon.id}>
                    <td>{compagnon.prenom} {compagnon.nom}</td>
                    <td className={styles.muted}>{compagnon.poste ?? 'Mecanicien'}</td>
                    <td className={styles.mono}>{compagnon.matricule ?? '-'}</td>
                    <td><span style={{ color: compagnon.actif ? 'var(--green)' : 'var(--red)' }}>{compagnon.actif ? 'actif' : 'inactif'}</span></td>
                  </tr>
                ))}
                {compagnons.length === 0 && <tr><td colSpan={4} className={styles.empty}>// aucun compagnon</td></tr>}
              </tbody>
            </table>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>// fiches_recentes</div>
            <table className={styles.miniTable}>
              <thead>
                <tr><th>numero</th><th>vehicule</th><th>statut</th><th>montant</th><th>date</th></tr>
              </thead>
              <tbody>
                {ficheTravaux.map((fiche: any) => (
                  <tr key={fiche.id}>
                    <td className={styles.mono} style={{ color: 'var(--cyan)' }}>{fiche.numero}</td>
                    <td className={styles.muted}>{[fiche.vehicule?.marque, fiche.vehicule?.modele].filter(Boolean).join(' ') || '-'}</td>
                    <td><span style={{ color: statusColor(fiche.statut), fontSize: 10 }}>{String(fiche.statut ?? 'inconnu').toLowerCase()}</span></td>
                    <td className={styles.mono} style={{ color: 'var(--purple)' }}>{fiche.montantHT ? formatEur(fiche.montantHT) : '-'}</td>
                    <td className={styles.muted}>{fiche.dateFermeture ? new Date(fiche.dateFermeture).toLocaleDateString('fr-FR') : fiche.dateOuverture ? new Date(fiche.dateOuverture).toLocaleDateString('fr-FR') : '-'}</td>
                  </tr>
                ))}
                {ficheTravaux.length === 0 && <tr><td colSpan={5} className={styles.empty}>// aucune fiche</td></tr>}
              </tbody>
            </table>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>// vehicules_recents ({vehicules.length})</div>
            <table className={styles.miniTable}>
              <thead>
                <tr><th>immat</th><th>vehicule</th><th>client</th><th>contact</th></tr>
              </thead>
              <tbody>
                {vehicules.slice(0, 12).map((vehicule: any) => (
                  <tr key={vehicule.id}>
                    <td className={styles.mono}>{vehicule.immatriculation ?? '-'}</td>
                    <td>{[vehicule.marque, vehicule.modele].filter(Boolean).join(' ')}</td>
                    <td className={styles.muted}>{[vehicule.clientPrenom, vehicule.clientNom].filter(Boolean).join(' ')}</td>
                    <td className={styles.muted}>{vehicule.clientTel ?? vehicule.clientEmail ?? '-'}</td>
                  </tr>
                ))}
                {vehicules.length === 0 && <tr><td colSpan={4} className={styles.empty}>// aucun vehicule</td></tr>}
              </tbody>
            </table>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>// taux_horaires</div>
            <div className={styles.tauxGrid}>
              {taux.filter((item: any) => item.actif).map((item: any) => (
                <div key={item.type} className={styles.taux}>
                  <span className={styles.tauxType}>{item.type}</span>
                  <span className={styles.tauxVal}>{formatEur(item.montant)}/h</span>
                  <span className={styles.tauxLib}>{item.libelle}</span>
                </div>
              ))}
              {taux.filter((item: any) => item.actif).length === 0 && <div className={styles.empty}>// aucun taux actif</div>}
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>// audit_super_admin</div>
            <div className={styles.auditList}>
              {auditLogs.map((log) => (
                <div key={log.id} className={styles.auditItem}>
                  <span style={{ color: log.statut === 'ERROR' ? 'var(--red)' : 'var(--green)' }}>{log.statut}</span>
                  <strong>{log.action}</strong>
                  <small>{log.acteurEmail ?? 'super-admin'} - {new Date(log.createdAt).toLocaleString('fr-FR')}</small>
                  {log.resume && <p>{log.resume}</p>}
                  {log.erreur && <p style={{ color: 'var(--red)' }}>{log.erreur}</p>}
                </div>
              ))}
              {auditLogs.length === 0 && <div className={styles.empty}>// aucune action tracee</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function statusColor(statut: string) {
  const colors: Record<string, string> = {
    CLOTUREE: 'var(--green)',
    EN_COURS: 'var(--blue)',
    EN_ATTENTE: 'var(--yellow)',
    TERMINEE: 'var(--cyan)',
    ANNULEE: 'var(--red)',
  }
  return colors[statut] ?? 'var(--text-muted)'
}

function PreviewMetric({ label, value, tone }: { label: string; value: string; tone: string }) {
  const colors: Record<string, string> = {
    green: 'var(--green)',
    red: 'var(--red)',
    yellow: 'var(--yellow)',
    blue: 'var(--blue)',
  }

  return (
    <div>
      <span>{label}</span>
      <strong style={{ color: colors[tone] ?? 'var(--text-secondary)' }}>{value}</strong>
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
  dangerWhenOff = false,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
  dangerWhenOff?: boolean
}) {
  return (
    <div className={styles.control}>
      <span className={styles.controlLabel}>{label}</span>
      <label className={styles.toggle}>
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
        <span className={`${styles.slider} ${checked ? styles.sliderOn : ''}`} />
        <span style={{ color: checked ? 'var(--green)' : dangerWhenOff ? 'var(--red)' : 'var(--text-muted)', fontSize: 11 }}>
          {checked ? 'actif' : 'inactif'}
        </span>
      </label>
    </div>
  )
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function StatBox({ label, value, color }: { label: string; value: any; color: string }) {
  const colors: Record<string, string> = {
    cyan: 'var(--cyan)',
    blue: 'var(--blue)',
    green: 'var(--green)',
    yellow: 'var(--yellow)',
    purple: 'var(--purple)',
    muted: 'var(--text-muted)',
  }

  return (
    <div className={styles.statBox}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statVal} style={{ color: colors[color] }}>
        {value}
      </span>
    </div>
  )
}

function InfoRow({ k, v }: { k: string; v: string }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.controlLabel}>{k}</span>
      <span className={styles.infoVal}>{v}</span>
    </div>
  )
}
