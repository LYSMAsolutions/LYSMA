'use client'

import { useState, useEffect } from 'react'
import { X, MagnifyingGlass, Car, Plus, Info, FilePdf, Check, Wrench } from '@phosphor-icons/react'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/utils'
import { formatImmat, formatVIN, formatVehiculeLabel, formatNom, formatPrenom, formatTelephone } from '@/lib/formatters'
import { getInterventionsLiees } from '@/lib/bibliotheque-metier'
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

type InterventionMetier = {
  id: string
  categorie: string
  intervention: string
  synonymes: string[]
  pieces_suggerees: string[]
  controles_suggeres: string[]
  operations_fin: string[]
  frequence: 'Très fréquent' | 'Fréquent' | 'Occasionnel' | 'Rare'
}

type BibliothequeMetierResponse = {
  interventions?: InterventionMetier[]
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
  const [interventionSearch, setInterventionSearch] = useState('')
  const [interventions, setInterventions] = useState<InterventionMetier[]>([])
  const [interventionsLoading, setInterventionsLoading] = useState(false)
  const [selectedInterventions, setSelectedInterventions] = useState<InterventionMetier[]>([])
  const [expandedInterventionId, setExpandedInterventionId] = useState<string | null>(null)
  const [chipSelections, setChipSelections] = useState<Record<string, { pieces: Set<string>; controles: Set<string> }>>({})


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

  useEffect(() => {
    if (step !== 'travaux') return

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setInterventionsLoading(true)
      try {
        const params = new URLSearchParams({ limit: interventionSearch.trim() ? '12' : '8' })
        if (interventionSearch.trim()) params.set('q', interventionSearch.trim())

        const res = await fetch(`/api/bibliotheque-metier/interventions?${params.toString()}`, {
          signal: controller.signal,
        })
        const data: BibliothequeMetierResponse = await res.json()
        setInterventions(data.interventions ?? [])
      } catch (error) {
        const aborted = error instanceof DOMException && error.name === 'AbortError'
        if (!aborted) setInterventions([])
      } finally {
        if (!controller.signal.aborted) setInterventionsLoading(false)
      }
    }, interventionSearch.trim() ? 250 : 0)

    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [step, interventionSearch])

  function normalizeLine(line: string) {
    return line.trim().toLocaleLowerCase('fr-FR')
  }

  function appendUniqueLines(current: string, lines: string[]) {
    const existingLines = current
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    const existing = new Set(existingLines.map(normalizeLine))
    const next = [...existingLines]

    for (const line of lines.map((value) => value.trim()).filter(Boolean)) {
      const key = normalizeLine(line)
      if (existing.has(key)) continue

      existing.add(key)
      next.push(line)
    }

    return next.join('\n')
  }

  function addIntervention(intervention: InterventionMetier) {
    setSelectedInterventions((current) => {
      if (current.some((item) => item.id === intervention.id)) return current
      return [...current, intervention]
    })
    setChipSelections((current) => ({
      ...current,
      [intervention.id]: {
        pieces: new Set(intervention.pieces_suggerees),
        controles: new Set<string>(),
      },
    }))
    setTravaux((current) => appendUniqueLines(current, [intervention.intervention]))
    setExpandedInterventionId(intervention.id)
    setInterventionSearch('')
  }

  function removeIntervention(interventionId: string) {
    setSelectedInterventions((current) => current.filter((item) => item.id !== interventionId))
    setChipSelections((current) => {
      const next = { ...current }
      delete next[interventionId]
      return next
    })
    setExpandedInterventionId((current) => current === interventionId ? null : current)
  }

  function toggleChip(interventionId: string, type: 'pieces' | 'controles', value: string) {
    setChipSelections((current) => {
      const prev = current[interventionId]
      if (!prev) return current
      const set = new Set(prev[type])
      if (set.has(value)) set.delete(value)
      else set.add(value)
      return { ...current, [interventionId]: { ...prev, [type]: set } }
    })
  }

  async function handleSubmit() {
    if (!travaux.trim()) return
    setSubmitError('')
    setSubmitting(true)
    try {
      const body: Record<string, unknown> = {
        garageId,
        travaux,
        notes,
        interventionsMetier: selectedInterventions.map((intervention) => ({
          id: intervention.id,
          intervention: intervention.intervention,
          piecesConfirmees: [...(chipSelections[intervention.id]?.pieces ?? [])],
          controlesConfirmes: [...(chipSelections[intervention.id]?.controles ?? [])],
        })),
      }
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
        setSubmitError(data?.error ?? 'Impossible de créer la fiche')
      }
    } catch {
      setSubmitError('Impossible de créer la fiche')
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
  const selectedInterventionIds = new Set(selectedInterventions.map((intervention) => intervention.id))
  const visibleInterventions = interventions.filter((intervention) => !selectedInterventionIds.has(intervention.id))

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
      <div className={cn(styles.modal, step === 'travaux' && styles.modalWide)}>

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

            <div className={styles.libraryPanel}>
              <div className={styles.libraryHeader}>
                <div>
                  <label className={styles.label} htmlFor="intervention-metier-search">
                    Bibliothèque métier
                  </label>
                  {selectedInterventions.length > 0 && (
                    <p className={styles.libraryMeta}>
                      {selectedInterventions.length} intervention{selectedInterventions.length > 1 ? 's' : ''} sélectionnée{selectedInterventions.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>

              <Input
                id="intervention-metier-search"
                placeholder="Plaquettes avant, vidange, diagnostic..."
                value={interventionSearch}
                onChange={(e) => setInterventionSearch(e.target.value)}
                iconLeft={<MagnifyingGlass />}
                inputSize="lg"
                autoFocus
              />

              {(visibleInterventions.length > 0 || interventionsLoading) && (
                <div className={styles.interventionResults}>
                  {visibleInterventions.map((intervention) => (
                    <button
                      key={intervention.id}
                      type="button"
                      className={styles.interventionResult}
                      onClick={() => addIntervention(intervention)}
                    >
                      <span className={styles.interventionResultIcon}>
                        <Wrench size={15} weight="bold" />
                      </span>
                      <span className={styles.interventionResultInfo}>
                        <span className={styles.interventionName}>{intervention.intervention}</span>
                        <span className={styles.interventionMeta}>
                          {intervention.categorie} · {intervention.frequence}
                        </span>
                      </span>
                      <Plus size={15} />
                    </button>
                  ))}

                  {interventionsLoading && (
                    <p className={styles.libraryLoading}>Recherche en cours...</p>
                  )}
                </div>
              )}

              {selectedInterventions.length > 0 && (
                <div className={styles.selectedInterventions}>
                  {selectedInterventions.map((intervention) => {
                    const expanded = expandedInterventionId === intervention.id

                    return (
                      <div key={intervention.id} className={styles.selectedIntervention}>
                        <div className={styles.selectedInterventionTop}>
                          <button
                            type="button"
                            className={styles.selectedInterventionMain}
                            aria-expanded={expanded}
                            onClick={() => setExpandedInterventionId(expanded ? null : intervention.id)}
                          >
                            <span className={styles.selectedInterventionTitle}>{intervention.intervention}</span>
                            <span className={styles.interventionMeta}>
                              {intervention.categorie} · {intervention.id}
                            </span>
                          </button>

                          <button
                            type="button"
                            className={styles.removeIntervention}
                            onClick={() => removeIntervention(intervention.id)}
                            aria-label={`Retirer ${intervention.intervention}`}
                          >
                            <X size={14} />
                          </button>
                        </div>

                        {!expanded && (
                          <span className={styles.interventionSummary}>
                            {(chipSelections[intervention.id]?.pieces.size ?? 0)} pièce{(chipSelections[intervention.id]?.pieces.size ?? 0) !== 1 ? 's' : ''}
                            {' · '}
                            {(chipSelections[intervention.id]?.controles.size ?? 0)} contrôle{(chipSelections[intervention.id]?.controles.size ?? 0) !== 1 ? 's' : ''}
                          </span>
                        )}

                        {expanded && (
                          <div className={styles.interventionDetails} style={{ gridTemplateColumns: '1fr', gap: 0 }}>
                            {intervention.pieces_suggerees.length > 0 && (
                              <div className={styles.chipsSection}>
                                <span className={styles.chipsSectionTitle}>Pièces à remplacer</span>
                                <div className={styles.chipsRow}>
                                  {intervention.pieces_suggerees.map((piece) => {
                                    const selected = chipSelections[intervention.id]?.pieces.has(piece) ?? false
                                    return (
                                      <button
                                        key={piece}
                                        type="button"
                                        className={cn(styles.chip, selected && styles.chipSelected)}
                                        onClick={() => toggleChip(intervention.id, 'pieces', piece)}
                                      >
                                        <span className={styles.chipCheck}>{selected ? '✓' : ''}</span>
                                        {piece}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            {intervention.controles_suggeres.length > 0 && (
                              <div className={styles.chipsSection}>
                                <span className={styles.chipsSectionTitle}>Contrôles à effectuer</span>
                                <div className={styles.chipsRow}>
                                  {intervention.controles_suggeres.map((controle) => {
                                    const selected = chipSelections[intervention.id]?.controles.has(controle) ?? false
                                    return (
                                      <button
                                        key={controle}
                                        type="button"
                                        className={cn(styles.chip, selected && styles.chipSelected)}
                                        onClick={() => toggleChip(intervention.id, 'controles', controle)}
                                      >
                                        <span className={styles.chipCheck}>{selected ? '✓' : ''}</span>
                                        {controle}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {selectedInterventions.length > 0 && (() => {
              const suggestions = selectedInterventions
                .flatMap((i) => getInterventionsLiees(i.id))
                .filter((s, idx, arr) =>
                  !selectedInterventionIds.has(s.id) &&
                  arr.findIndex((x) => x.id === s.id) === idx
                )
                .slice(0, 6)
              return suggestions.length > 0 ? (
                <div className={styles.suggestionsPanel}>
                  <span className={styles.suggestionsLabel}>Ajouter aussi</span>
                  <div className={styles.suggestionsRow}>
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={styles.suggestionBtn}
                        onClick={() => addIntervention(s)}
                      >
                        <Plus size={12} />
                        {s.intervention}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null
            })()}

            <div className={styles.field}>
              <label className={styles.label}>Travaux à effectuer *</label>
              <textarea
                className={styles.textarea}
                placeholder={'Vidange moteur\nFiltre à huile\nFiltre à air\nContrôle niveaux\nContrôle pression pneus'}
                value={travaux}
                onChange={(e) => setTravaux(e.target.value)}
                rows={6}
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
