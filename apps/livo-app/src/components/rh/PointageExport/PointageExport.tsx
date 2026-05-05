'use client'

import { useState } from 'react'
import { FilePdf } from '@phosphor-icons/react'
import styles from './PointageExport.module.css'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

type Props = {
  compagnonId: string
  compagnonNom: string
}

const MOIS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

export function PointageExport({ compagnonId, compagnonNom }: Props) {
  const now = new Date()
  const [mois, setMois] = useState(now.getMonth() + 1)
  const [annee, setAnnee] = useState(now.getFullYear())
  const [loading, setLoading] = useState(false)

  async function downloadPDF() {
    setLoading(true)
    try {
      const res = await fetch(`/api/pdf/pointage/${compagnonId}?mois=${mois}&annee=${annee}`)
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Pointage_${compagnonNom}_${mois.toString().padStart(2,'0')}_${annee}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      console.error('Erreur génération PDF')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <select className={styles.select} value={mois} onChange={e => setMois(Number(e.target.value))}>
        {MOIS.map((m, i) => (
          <option key={i} value={i + 1}>{m}</option>
        ))}
      </select>
      <select className={styles.select} value={annee} onChange={e => setAnnee(Number(e.target.value))}>
        {[annee - 1, annee].map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <button className={styles.btn} onClick={downloadPDF} disabled={loading}>
        <FilePdf weight="fill" size={14} />
        {loading ? 'Génération...' : 'Exporter pointage PDF'}
      </button>
    </div>
  )
}
