'use client'

import { useState } from 'react'
import { Play, Stop, Clock, User, CheckCircle, FilePdf } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui'
import { ClotureFiche } from '@/components/atelier/ClotureFiche/ClotureFiche'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './FicheCard.module.css'

type StatutFiche = 'EN_ATTENTE' | 'EN_COURS' | 'EN_PAUSE' | 'TERMINEE' | 'CLOTUREE' | 'ANNULEE'
type TauxType = 'T1' | 'T2' | 'T3' | 'T4' | 'CARROSSERIE' | 'PEINTURE' | 'AUTRE'
type TauxGarage = { type: TauxType; libelle: string; montant: number }
type PointageFicheActif = { compagnonId: string; compagnonNom: string; debutAt: string }

type Props = {
  ficheId: string
  numero: string
  statut: StatutFiche
  travaux: string
  vehicule: string
  immat: string | null
  clientNom: string
  tempsReel?: number | null
  pointagesActifs: PointageFicheActif[]
  compagnonId: string
  estPointe: boolean
  taux?: TauxGarage[]
}

const STATUT_BADGE: Record<StatutFiche, { label: string; variant: 'blue'|'success'|'warning'|'muted'|'error'|'gold'|'cyan'|'default' }> = {
  EN_ATTENTE: { label: 'En attente', variant: 'warning' },
  EN_COURS:   { label: 'En cours',   variant: 'blue' },
  EN_PAUSE:   { label: 'En pause',   variant: 'warning' },
  TERMINEE:   { label: 'Terminée',   variant: 'success' },
  CLOTUREE:   { label: 'Clôturée',   variant: 'muted' },
  ANNULEE:    { label: 'Annulée',    variant: 'error' },
}

function formatH(minutes: number) {
  const h = Math.floor(minutes / 60); const m = minutes % 60
  return m > 0 ? `${h}h${m.toString().padStart(2,'0')}` : `${h}h`
}

export function FicheCard({
  ficheId, numero, statut: statutInit, travaux, vehicule, immat,
  clientNom, tempsReel, pointagesActifs: ptgInit, compagnonId, estPointe: estPointeInit, taux = [],
}: Props) {
  const router = useRouter()
  const [statut, setStatut] = useState<StatutFiche>(statutInit)
  const [estPointe, setEstPointe] = useState(estPointeInit)
  const [loading, setLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [modalCloture, setModalCloture] = useState(false)

  const badge = STATUT_BADGE[statut]
  const lignes = travaux.split('\n').filter(Boolean)
  const peutPointer = ['EN_ATTENTE', 'EN_COURS'].includes(statut)
  const peutCloturer = statut === 'TERMINEE'
  const estCloturee = statut === 'CLOTUREE'

  async function togglePointage() {
    setLoading(true)
    try {
      const res = await fetch('/api/pointage-fiche/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compagnonId, ficheId, action: estPointe ? 'DEPOINTER' : 'POINTER' }),
      })
      const data = await res.json()
      if (data.success) {
        setEstPointe(!estPointe)
        if (!estPointe) setStatut('EN_COURS')
      }
    } finally {
      setLoading(false)
    }
  }

  async function downloadPDF() {
    setPdfLoading(true)
    try {
      const res = await fetch(`/api/pdf/fiche/${ficheId}`)
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${numero}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      console.error('Erreur génération PDF')
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <>
      <div className={cn(styles.card, estPointe && styles.active, styles[statut.toLowerCase()])}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href={`/fiches/${ficheId}`} className={styles.numero} onClick={e => e.stopPropagation()}>{numero}</Link>
            <Badge variant={badge.variant} dot>{badge.label}</Badge>
          </div>
          <div className={styles.headerActions}>
            {peutPointer && (
              <button className={cn(styles.actionBtn, estPointe ? styles.stopBtn : styles.startBtn)} onClick={togglePointage} disabled={loading}>
                {loading ? <span className={styles.spinner} /> : estPointe ? <><Stop weight="fill" size={13} /> Dépointer</> : <><Play weight="fill" size={13} /> Pointer</>}
              </button>
            )}
            {peutCloturer && (
              <button className={cn(styles.actionBtn, styles.clotureBtn)} onClick={() => setModalCloture(true)}>
                <CheckCircle weight="fill" size={13} /> Clôturer
              </button>
            )}
            {estCloturee && (
              <button className={styles.pdfBtn} onClick={downloadPDF} disabled={pdfLoading}>
                <FilePdf weight="fill" size={13} />
                {pdfLoading ? 'Génération...' : 'PDF'}
              </button>
            )}
          </div>
        </div>

        <div className={styles.vehiculeInfo}>
          <span className={styles.vehicule}>{vehicule}</span>
          {immat && <span className={styles.immat}>{immat}</span>}
          <span className={styles.client}>{clientNom}</span>
        </div>

        <ul className={styles.travaux}>
          {lignes.slice(0, 3).map((t, i) => <li key={i} className={styles.travailItem}>{t}</li>)}
          {lignes.length > 3 && <li className={styles.more}>+{lignes.length - 3} autre{lignes.length - 3 > 1 ? 's' : ''}</li>}
        </ul>

        <div className={styles.footer}>
          {ptgInit.length > 0 && (
            <div className={styles.compagnonsActifs}>
              {ptgInit.map((p) => (
                <span key={p.compagnonId} className={styles.compagnonBadge}>
                  <User size={10} />{p.compagnonNom.split(' ')[0]}
                </span>
              ))}
            </div>
          )}
          {tempsReel != null && tempsReel > 0 && (
            <div className={styles.temps}>
              <Clock size={12} /><span>{formatH(Math.round(Number(tempsReel) * 60))} réel</span>
            </div>
          )}
        </div>
      </div>

      {modalCloture && (
        <ClotureFiche
          ficheId={ficheId}
          numero={numero}
          vehicule={vehicule}
          tempsReel={tempsReel ?? null}
          taux={taux}
          onClose={() => setModalCloture(false)}
          onCloturee={() => { setModalCloture(false); router.refresh() }}
        />
      )}
    </>
  )
}
