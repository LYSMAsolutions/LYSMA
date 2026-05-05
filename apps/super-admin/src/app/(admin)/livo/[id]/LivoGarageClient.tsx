'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

type Props = {
  garage: any
}

function formatEur(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0))
}

export function LivoGarageClient({ garage }: Props) {
  const router = useRouter()

  if (!garage) {
    return (
      <div style={{ padding: 20 }}>
        Impossible de charger les données du garage.
      </div>
    )
  }

  const stats = garage.stats ?? {}
  const owner = garage.owner ?? {}
  const compagnons = garage.compagnons ?? []
  const ficheTravaux = garage.ficheTravaux ?? []
  const taux = garage.taux ?? []

  const [abonnementActif, setAbonnementActif] = useState(Boolean(garage.abonnementActif))
  const [actif, setActif] = useState(Boolean(garage.actif))
  const [saving, setSaving] = useState(false)

  const joursRestants = garage.trialEndsAt
    ? Math.ceil((new Date(garage.trialEndsAt).getTime() - Date.now()) / 86400000)
    : null

  async function save() {
    setSaving(true)

    try {
      const res = await fetch(`/api/livo/garages/${garage.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          abonnementActif,
          actif,
        }),
      })

      if (!res.ok) {
        throw new Error('Erreur sauvegarde')
      }

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
            {owner.prenom ?? ''} {owner.nom ?? ''} — {owner.email ?? 'email inconnu'}
          </div>

          {(garage.adresse || garage.codePostal || garage.ville) && (
            <div className={styles.addr}>
              {[garage.adresse, garage.codePostal, garage.ville].filter(Boolean).join(', ')}
            </div>
          )}
        </div>

        <div className={styles.headerRight}>
          <button className={styles.btnSave} onClick={save} disabled={saving}>
            {saving ? '▋ sauvegarde...' : '✓ enregistrer'}
          </button>
        </div>
      </div>

      <div className={styles.cols}>
        <div className={styles.col}>
          <div className={styles.panel}>
            <div className={styles.panelTitle}>// statistiques</div>

            <div className={styles.statsGrid}>
              <StatBox label="compagnons" value={stats.compagnons ?? 0} color="cyan" />
              <StatBox label="véhicules" value={stats.vehicules ?? 0} color="blue" />
              <StatBox label="fiches_total" value={stats.fichesTotal ?? 0} color="yellow" />
              <StatBox label="fiches_clôturées" value={stats.fichesCloturees ?? 0} color="green" />
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
            <div className={styles.panelTitle}>// contrôles_accès</div>

            <div className={styles.controls}>
              <div className={styles.control}>
                <span className={styles.controlLabel}>abonnement_actif</span>

                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={abonnementActif}
                    onChange={(event) => setAbonnementActif(event.target.checked)}
                  />

                  <span className={`${styles.slider} ${abonnementActif ? styles.sliderOn : ''}`} />

                  <span
                    style={{
                      color: abonnementActif ? 'var(--green)' : 'var(--text-muted)',
                      fontSize: 11,
                    }}
                  >
                    {abonnementActif ? '● actif' : '○ inactif'}
                  </span>
                </label>
              </div>

              <div className={styles.control}>
                <span className={styles.controlLabel}>compte_actif</span>

                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={actif}
                    onChange={(event) => setActif(event.target.checked)}
                  />

                  <span className={`${styles.slider} ${actif ? styles.sliderOn : ''}`} />

                  <span
                    style={{
                      color: actif ? 'var(--green)' : 'var(--red)',
                      fontSize: 11,
                    }}
                  >
                    {actif ? '● actif' : '● suspendu'}
                  </span>
                </label>
              </div>

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
                    ? `${new Date(garage.trialEndsAt).toLocaleDateString('fr-FR')} (${
                        joursRestants !== null && joursRestants < 0
                          ? `expiré ${Math.abs(joursRestants)}j`
                          : `${joursRestants}j restants`
                      })`
                    : '—'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>// informations</div>

            <div className={styles.infoList}>
              {garage.telephone && <InfoRow k="téléphone" v={garage.telephone} />}
              {garage.email && <InfoRow k="email" v={garage.email} />}
              {garage.siret && <InfoRow k="siret" v={garage.siret} />}

              <InfoRow
                k="créé_le"
                v={garage.createdAt ? new Date(garage.createdAt).toLocaleDateString('fr-FR') : '—'}
              />
            </div>
          </div>
        </div>

        <div className={styles.col}>
          <div className={styles.panel}>
            <div className={styles.panelTitle}>// compagnons ({compagnons.length})</div>

            <table className={styles.miniTable}>
              <thead>
                <tr>
                  <th>nom</th>
                  <th>poste</th>
                  <th>actif</th>
                </tr>
              </thead>

              <tbody>
                {compagnons.map((compagnon: any) => (
                  <tr key={compagnon.id}>
                    <td>
                      {compagnon.prenom} {compagnon.nom}
                    </td>

                    <td className={styles.muted}>{compagnon.poste ?? 'Mécanicien'}</td>

                    <td>
                      <span style={{ color: compagnon.actif ? 'var(--green)' : 'var(--red)' }}>
                        {compagnon.actif ? '✓' : '✗'}
                      </span>
                    </td>
                  </tr>
                ))}

                {compagnons.length === 0 && (
                  <tr>
                    <td colSpan={3} className={styles.empty}>
                      // aucun compagnon
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>// fiches_récentes</div>

            <table className={styles.miniTable}>
              <thead>
                <tr>
                  <th>numéro</th>
                  <th>véhicule</th>
                  <th>statut</th>
                  <th>montant</th>
                  <th>date</th>
                </tr>
              </thead>

              <tbody>
                {ficheTravaux.map((fiche: any) => {
                  const colors: Record<string, string> = {
                    CLOTUREE: 'var(--green)',
                    EN_COURS: 'var(--blue)',
                    EN_ATTENTE: 'var(--yellow)',
                    TERMINEE: 'var(--cyan)',
                  }

                  return (
                    <tr key={fiche.id}>
                      <td className={styles.mono} style={{ color: 'var(--cyan)' }}>
                        {fiche.numero}
                      </td>

                      <td className={styles.muted}>
                        {[fiche.vehicule?.marque, fiche.vehicule?.modele].filter(Boolean).join(' ') || '—'}
                      </td>

                      <td>
                        <span
                          style={{
                            color: colors[fiche.statut] ?? 'var(--text-muted)',
                            fontSize: 10,
                          }}
                        >
                          ● {String(fiche.statut ?? 'inconnu').toLowerCase()}
                        </span>
                      </td>

                      <td className={styles.mono} style={{ color: 'var(--purple)' }}>
                        {fiche.montantHT ? formatEur(fiche.montantHT) : '—'}
                      </td>

                      <td className={styles.muted}>
                        {fiche.dateFermeture
                          ? new Date(fiche.dateFermeture).toLocaleDateString('fr-FR')
                          : fiche.dateOuverture
                            ? new Date(fiche.dateOuverture).toLocaleDateString('fr-FR')
                            : '—'}
                      </td>
                    </tr>
                  )
                })}

                {ficheTravaux.length === 0 && (
                  <tr>
                    <td colSpan={5} className={styles.empty}>
                      // aucune fiche
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>// taux_horaires</div>

            <div className={styles.tauxGrid}>
              {taux
                .filter((item: any) => item.actif)
                .map((item: any) => (
                  <div key={item.type} className={styles.taux}>
                    <span className={styles.tauxType}>{item.type}</span>
                    <span className={styles.tauxVal}>{formatEur(item.montant)}/h</span>
                    <span className={styles.tauxLib}>{item.libelle}</span>
                  </div>
                ))}

              {taux.filter((item: any) => item.actif).length === 0 && (
                <div className={styles.empty}>// aucun taux actif</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string
  value: any
  color: string
}) {
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