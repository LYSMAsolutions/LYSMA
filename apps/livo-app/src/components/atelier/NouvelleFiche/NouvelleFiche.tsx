'use client'

import { useState, useEffect } from 'react'
import { X, MagnifyingGlass, Car, Plus, Info, FilePdf, Check } from '@phosphor-icons/react'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/utils'
import { formatImmat, formatVIN, formatVehiculeLabel, formatNom, formatPrenom, formatTelephone } from '@/lib/formatters'
import styles from './NouvelleFiche.module.css'

type Vehicule = {
  id: string
  immatriculation: string | null
  marque: string
  modele: string
  annee: number | null
  clientNom: string
  clientPrenom: string | null
}

type Props = {
  garageId: string
  onClose: () => void
  onCreated: () => void
}

export function NouvelleFiche({ garageId, onClose, onCreated }: Props) {
  const [step, setStep] = useState<'vehicule' | 'travaux'>('vehicule')
  const [search, setSearch] = useState('')
  const [vehicules, setVehicules] = useState<Vehicule[]>([])
  const [vehiculeSelectionne, setVehiculeSelectionne] = useState<Vehicule | null>(null)
  const [nouveauVehicule, setNouveauVehicule] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [ficheCreee, setFicheCreee] = useState<{ id: string; numero: string } | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  const [marque, setMarque] = useState('')
  const [modele, setModele] = useState('')
  const [immat, setImmat] = useState('')
  const [annee, setAnnee] = useState('')
  const [vin, setVin] = useState('')
  const [clientNom, setClientNom] = useState('')
  const [clientPrenom, setClientPrenom] = useState('')
  const [clientTel, setClientTel] = useState('')

  const [travaux, setTravaux] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (search.length < 1) { setVehicules([]); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/fiches?garageId=${garageId}&q=${encodeURIComponent(search)}`)
        const data = await res.json()
        setVehicules(data.vehicules ?? [])
      } finally { setLoading(false) }
    }, 300)
    return () => clearTimeout(timer)
  }, [search, garageId])

  async function handleSubmit() {
    if (!travaux.trim()) return
    setSubmitError('')
    setSubmitting(true)
    try {
      const body: Record<string, unknown> = { garageId, travaux, notes }
      if (vehiculeSelectionne) {
        body.vehiculeId = vehiculeSelectionne.id
      } else {
        body.vehicule = {
          marque, modele,
          immatriculation: immat || undefined,
          annee: annee ? parseInt(annee) : undefined,
          vin: vin || undefined,
          clientNom,
          clientPrenom: clientPrenom || undefined,
          clientTel: clientTel || undefined,
        }
      }
      const res = await fetch('/api/fiches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const data = await res.json()
        setFicheCreee(data.fiche)
      } else {
        const data = await res.json().catch(() => null)
        setSubmitError(data?.error ?? 'Impossible de creer la fiche')
      }
    } catch {
      setSubmitError('Impossible de creer la fiche')
    } finally { setSubmitting(false) }
  }

  async function downloadPDF() {
    if (!ficheCreee) return
    setPdfLoading(true)
    try {
      const res = await fetch(`/api/pdf/fiche/${ficheCreee.id}`)
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${ficheCreee.numero}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      console.error('Erreur PDF')
    } finally {
      setPdfLoading(false)
    }
  }

  const peutContinuer = vehiculeSelectionne || (nouveauVehicule && marque && modele && clientNom)

  // Écran de confirmation après création
  if (ficheCreee) {
    const vehiculeLabel = vehiculeSelectionne
      ? `${vehiculeSelectionne.marque} ${vehiculeSelectionne.modele}`
      : `${marque} ${modele}`
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2 className={styles.title}>Fiche créée ✓</h2>
          </div>
          <div className={styles.body}>
            <div className={styles.confirmBox}>
              <div className={styles.confirmIcon}><Check weight="bold" size={28} /></div>
              <div className={styles.confirmInfo}>
                <span className={styles.confirmNumero}>{ficheCreee.numero}</span>
                <span className={styles.confirmVehicule}>{vehiculeLabel}</span>
              </div>
            </div>
            <p className={styles.confirmHint}>
              Imprimez la fiche de travaux pour la remettre au compagnon.
            </p>
          </div>
          <div className={styles.footer}>
            <Button variant="secondary" onClick={() => { onCreated() }}>
              Fermer sans imprimer
            </Button>
            <Button
              variant="primary"
              icon={<FilePdf weight="fill" />}
              loading={pdfLoading}
              onClick={downloadPDF}
            >
              Imprimer la fiche
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>Nouvelle fiche de travaux</h2>
            <div className={styles.steps}>
              <span className={cn(styles.step, step === 'vehicule' && styles.stepActive)}>1. Véhicule</span>
              <span className={styles.stepSep}>→</span>
              <span className={cn(styles.step, step === 'travaux' && styles.stepActive)}>2. Travaux</span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        {/* ── Étape 1 ─────────────────────────────────────────── */}
        {step === 'vehicule' && (
          <div className={styles.body}>
            {!nouveauVehicule ? (
              <>
                <div className={styles.searchPanel}>
                  <p className={styles.searchLabel}>Vehicule existant</p>
                  <Input
                    placeholder="Rechercher par immat, marque, client..."
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    iconLeft={<MagnifyingGlass />}
                    inputSize="lg"
                  />
                </div>

                {vehiculeSelectionne && (
                  <div className={styles.selected}>
                    <div className={styles.selectedInfo}>
                      <Car weight="fill" size={16} />
                      <span>{vehiculeSelectionne.marque} {vehiculeSelectionne.modele}</span>
                      {vehiculeSelectionne.immatriculation && <span className={styles.immat}>{vehiculeSelectionne.immatriculation}</span>}
                      <span className={styles.client}>{vehiculeSelectionne.clientNom}</span>
                    </div>
                    <button className={styles.deselect} onClick={() => setVehiculeSelectionne(null)}><X size={14} /></button>
                  </div>
                )}

                {!vehiculeSelectionne && vehicules.length > 0 && (
                  <div className={styles.results}>
                    {vehicules.map((v) => (
                      <button key={v.id} className={styles.resultItem} onClick={() => setVehiculeSelectionne(v)}>
                        <div className={styles.resultLeft}>
                          <span className={styles.resultVehicule}>{v.marque} {v.modele}</span>
                          {v.immatriculation && <span className={styles.resultImmat}>{v.immatriculation}</span>}
                        </div>
                        <span className={styles.resultClient}>{v.clientNom} {v.clientPrenom ?? ''}</span>
                      </button>
                    ))}
                  </div>
                )}

                {!vehiculeSelectionne && search.length > 0 && vehicules.length === 0 && !loading && (
                  <p className={styles.noResult}>Aucun véhicule trouvé</p>
                )}

                <div className={styles.createPanel}>
                  <div>
                    <p className={styles.createTitle}>Vehicule non trouve ?</p>
                    <p className={styles.createHint}>Ajoutez-le puis creez sa premiere fiche.</p>
                  </div>
                  <button className={styles.newVehiculeBtn} onClick={() => setNouveauVehicule(true)}>
                    <Plus size={14} /> Nouveau vehicule
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.newVehiculeForm}>
                {/* Info immat */}
                <div className={styles.infoBox}>
                  <Info size={13} />
                  <span>Les immatriculations sont saisies manuellement. Formats FR (AB-123-CD, 123 ABC 75) et international acceptés.</span>
                </div>

                <div className={styles.formRow}>
                  <Input
                    label="Marque *"
                    placeholder="Peugeot, Renault..."
                    value={marque}
                    onChange={e => setMarque(formatVehiculeLabel(e.target.value))}
                    required
                  />
                  <Input
                    label="Modèle *"
                    placeholder="308, Clio..."
                    value={modele}
                    onChange={e => setModele(formatVehiculeLabel(e.target.value))}
                    required
                  />
                </div>
                <div className={styles.formRow}>
                  <Input
                    label="Immatriculation"
                    placeholder="AB-123-CD"
                    value={immat}
                    onChange={e => setImmat(formatImmat(e.target.value))}
                  />
                  <Input
                    label="Année"
                    placeholder="2020"
                    value={annee}
                    onChange={e => setAnnee(e.target.value)}
                    type="number"
                  />
                </div>
                <Input
                  label="N° de série (VIN)"
                  placeholder="VF1XXXXXXXXXXXXXX"
                  value={vin}
                  onChange={e => setVin(formatVIN(e.target.value))}
                />

                <div className={styles.separator}>Client</div>

                <div className={styles.formRow}>
                  <Input
                    label="Nom *"
                    placeholder="Dupont"
                    value={clientNom}
                    onChange={e => setClientNom(formatNom(e.target.value))}
                    required
                  />
                  <Input
                    label="Prénom"
                    placeholder="Jean"
                    value={clientPrenom}
                    onChange={e => setClientPrenom(formatPrenom(e.target.value))}
                  />
                </div>
                <Input
                  label="Téléphone"
                  placeholder="06 00 00 00 00"
                  value={clientTel}
                  onChange={e => setClientTel(formatTelephone(e.target.value))}
                  type="tel"
                />

                <button className={styles.backBtn} onClick={() => setNouveauVehicule(false)}>
                  ← Rechercher un véhicule existant
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Étape 2 ─────────────────────────────────────────── */}
        {step === 'travaux' && (
          <div className={styles.body}>
            <div className={styles.recap}>
              <Car weight="fill" size={14} />
              <span>{vehiculeSelectionne?.marque ?? marque} {vehiculeSelectionne?.modele ?? modele}</span>
              {(vehiculeSelectionne?.immatriculation ?? immat) && (
                <span className={styles.immat}>{vehiculeSelectionne?.immatriculation ?? immat}</span>
              )}
              <span className={styles.client}>{vehiculeSelectionne?.clientNom ?? clientNom}</span>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Travaux à effectuer *</label>
              <textarea
                className={styles.textarea}
                placeholder={'Vidange moteur\nFiltre à huile\nFiltre à air\nContrôle niveaux\nContrôle pression pneus'}
                value={travaux}
                onChange={(e) => setTravaux(e.target.value)}
                rows={6}
                autoFocus
              />
              <p className={styles.hint}>Une ligne = un travail</p>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Notes internes</label>
              <textarea
                className={styles.textareaSm}
                placeholder="Informations complémentaires pour le compagnon..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {submitError && <p className={styles.submitError}>{submitError}</p>}
          </div>
        )}

        <div className={styles.footer}>
          {step === 'vehicule' ? (
            <>
              <Button variant="ghost" onClick={onClose}>Annuler</Button>
              <Button variant="primary" disabled={!peutContinuer} onClick={() => setStep('travaux')}>Continuer</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setStep('vehicule')}>Retour</Button>
              <Button variant="primary" disabled={!travaux.trim()} loading={submitting} onClick={handleSubmit}>Créer la fiche</Button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
