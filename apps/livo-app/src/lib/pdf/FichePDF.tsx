import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { COLORS } from './styles'
import React from 'react'

type Compagnon = { prenom: string; nom: string; poste: string | null }
type PointageFiche = { compagnon: Compagnon; dureeMinutes: number | null; debutAt: Date; finAt: Date | null }
type InterventionConfirmee = {
  id: string
  intervention: string
  piecesConfirmees: string[]
  controlesConfirmes: string[]
}

type Props = {
  fiche: {
    numero: string
    statut: string
    travaux: string
    interventionsMetier?: unknown
    notes: string | null
    tempsFacture: number | null
    tempsReel: number | null
    tauxApplique: string | null
    montantHT: number | null
    dateOuverture: Date
    dateFermeture: Date | null
    pointagesFiche: PointageFiche[]
    vehicule: {
      immatriculation: string | null
      marque: string
      modele: string
      annee: number | null
      vin: string | null
      clientNom: string
      clientPrenom: string | null
      clientTel: string | null
      clientEmail: string | null
    }
  }
  garage: {
    nom: string
    adresse?: string | null
    codePostal?: string | null
    ville?: string | null
    telephone?: string | null
    email?: string | null
    siret?: string | null
  }
  logoSrc: string
  qrCodeSrc?: string
}

function formatH(h: number) {
  const hh = Math.floor(h); const mm = Math.round((h - hh) * 60)
  return mm > 0 ? `${hh}h${mm.toString().padStart(2,'0')}` : `${hh}h00`
}
function formatDate(d: Date) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
function formatEur(v: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function parseInterventionsConfirmees(value: unknown): InterventionConfirmee[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return []
    const i = item as Record<string, unknown>
    if (typeof i.id !== 'string' || typeof i.intervention !== 'string') return []
    return [{
      id: i.id,
      intervention: i.intervention,
      piecesConfirmees: isStringArray(i.piecesConfirmees) ? i.piecesConfirmees : [],
      controlesConfirmes: isStringArray(i.controlesConfirmes) ? i.controlesConfirmes : [],
    }]
  })
}

const DEFAULT_CONTROLES = [
  'Contrôle niveaux',
  'Contrôle éclairage',
  'Contrôle pression pneus',
  'Contrôle essuie-glaces',
  'Contrôle visuel freinage',
]

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    backgroundColor: '#ffffff',
    paddingTop: 24,
    paddingBottom: 36,
    paddingHorizontal: 28,
  },

  watermark: {
    position: 'absolute',
    top: '28%',
    left: 0,
    right: 0,
    alignItems: 'center',
    opacity: 0.04,
  },
  watermarkImg: { width: 260, height: 260 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.blueElectric,
  },
  headerLeft: { flexDirection: 'column', flex: 1 },
  garageNom: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep, marginBottom: 2 },
  garageInfo: { fontSize: 7.5, color: '#444444', marginBottom: 1 },
  headerRight: { flexDirection: 'column', alignItems: 'flex-end' },
  docTitle: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep, marginBottom: 3 },
  docNumero: { fontSize: 9.5, color: COLORS.blueElectric, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  docDate: { fontSize: 7.5, color: '#666666' },

  // Section title
  sectionTitle: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.blueElectric,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#dde8f5',
  },

  // Véhicule + Client
  vcGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  vcBlock: {
    flex: 1,
    backgroundColor: '#f8faff',
    borderWidth: 1,
    borderColor: '#dde8f5',
    borderRadius: 4,
    padding: 8,
  },
  vcLabel: { fontSize: 6.5, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  vcNom: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep, marginBottom: 3 },
  vcInfo: { fontSize: 7.5, color: '#555555', marginBottom: 1 },
  vcMono: { fontSize: 7.5, color: '#555555', marginBottom: 1 },

  // Travaux | Contrôles+QR — colonnes côte à côte
  middleRow: { flexDirection: 'row', gap: 12, marginBottom: 10, alignItems: 'flex-start' },
  travauxCol: { flex: 1 },
  rightCol: { flex: 1, flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  controlesCol: { flex: 1 },

  travailRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4, gap: 5 },
  travailBullet: { fontSize: 9, color: COLORS.blueElectric, fontFamily: 'Helvetica-Bold', marginTop: -1 },
  travailText: { flex: 1, fontSize: 8.5, color: '#222222', lineHeight: 1.3 },

  controleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#dde8f5',
    borderRadius: 3,
    backgroundColor: '#f8faff',
    marginBottom: 4,
  },
  controleBox: { width: 9, height: 9, borderWidth: 1, borderColor: '#8899bb', borderRadius: 1 },
  controleText: { fontSize: 7, color: '#333333' },

  qrBlock: { alignItems: 'center' },
  qrImage: { width: 64, height: 64 },
  qrLabel: { fontSize: 5.5, color: COLORS.textMuted, marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.5 },

  notesBox: {
    marginTop: 6, padding: 6,
    backgroundColor: '#fffbf0', borderWidth: 1, borderColor: '#f0d8a0', borderRadius: 3,
  },
  notesLabel: { fontSize: 6.5, color: '#8a6a00', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  notesText: { fontSize: 7.5, color: '#665500' },

  // KPIs
  kpiRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  kpi: { flex: 1, backgroundColor: '#f0f5ff', borderWidth: 1, borderColor: '#dde8f5', borderRadius: 4, padding: 6, alignItems: 'center' },
  kpiVal: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep },
  kpiLabel: { fontSize: 6.5, color: COLORS.textMuted, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  kpiGain: { flex: 1, borderRadius: 4, padding: 6, alignItems: 'center', borderWidth: 1 },

  // Tableau
  tableSection: { marginBottom: 8 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.blueDeep,
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 3,
  },
  thCell: { fontSize: 7.5, color: '#ffffff', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  tableRowPre: {
    flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 7,
    borderBottomWidth: 1, borderBottomColor: '#dde8f5',
    backgroundColor: '#f4f8ff', minHeight: 20,
  },
  tableRow: {
    flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 7,
    borderBottomWidth: 1, borderBottomColor: '#eef2fa', minHeight: 20,
  },
  tableRowAlt: { backgroundColor: '#f8faff' },
  tdCell: { fontSize: 7.5, color: '#333333' },

  // Travaux à prévoir
  prevoir: {
    marginBottom: 8, padding: 8,
    borderWidth: 1, borderColor: '#dde8f5', borderRadius: 4, minHeight: 30,
  },

  // Signatures
  sigRow: { flexDirection: 'row', gap: 10 },
  sigBox: {
    flex: 1, borderWidth: 1, borderColor: '#dde8f5', borderRadius: 4, padding: 8, minHeight: 52,
  },
  sigTitle: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  sigSub: { fontSize: 6.5, color: '#888888', marginBottom: 18 },
  sigLine: { borderBottomWidth: 1, borderBottomColor: '#b0c0d8' },
  sigDate: { fontSize: 6.5, color: '#888888', marginTop: 3 },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 12, left: 28, right: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#dde8f5',
  },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  footerLogoCircle: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: COLORS.blueElectric,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  footerAppName: { fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep },
  footerBy: { fontSize: 6, color: COLORS.textMuted },
  footerCenter: { fontSize: 6.5, color: '#666666' },
  footerRight: { fontSize: 6.5, color: '#888888' },
})

export function FichePDF({ fiche, garage, logoSrc, qrCodeSrc }: Props) {
  const travailsLignes = fiche.travaux.split('\n').filter(Boolean)
  const interventionsConfirmees = parseInterventionsConfirmees(fiche.interventionsMetier)
  const allPiecesConfirmees = interventionsConfirmees.flatMap((i) => i.piecesConfirmees)
  const allControlesConfirmes = interventionsConfirmees.flatMap((i) => i.controlesConfirmes)
  const controles = allControlesConfirmes.length > 0 ? allControlesConfirmes : DEFAULT_CONTROLES
  const tReel = fiche.tempsReel ?? 0
  const tFacture = fiche.tempsFacture ?? 0
  const delta = tFacture - tReel
  const tauxVal = fiche.montantHT && tFacture > 0 ? fiche.montantHT / tFacture : null
  const isGain = delta >= 0
  const isCloturee = fiche.statut === 'CLOTUREE'
  const emptyRowsCount = Math.max(2, 5 - allPiecesConfirmees.length)

  return (
    <Document title={`${garage.nom} — ${fiche.numero}`} author="LIVO-APP">
      <Page size="A4" style={s.page}>

        <View style={s.watermark} fixed>
          <Image src={logoSrc} style={s.watermarkImg} />
        </View>

        {/* Header */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.garageNom}>{garage.nom}</Text>
            {garage.adresse && <Text style={s.garageInfo}>{garage.adresse}</Text>}
            {(garage.codePostal || garage.ville) && (
              <Text style={s.garageInfo}>{[garage.codePostal, garage.ville].filter(Boolean).join(' ')}</Text>
            )}
            {garage.telephone && <Text style={s.garageInfo}>Tél : {garage.telephone}</Text>}
            {garage.email && <Text style={s.garageInfo}>{garage.email}</Text>}
            {garage.siret && <Text style={s.garageInfo}>SIRET : {garage.siret}</Text>}
          </View>
          <View style={s.headerRight}>
            <Text style={s.docTitle}>Fiche de Travaux</Text>
            <Text style={s.docNumero}>{fiche.numero}</Text>
            <Text style={s.docDate}>Ouverture : {formatDate(fiche.dateOuverture)}</Text>
            {fiche.dateFermeture && <Text style={s.docDate}>Clôture : {formatDate(fiche.dateFermeture)}</Text>}
          </View>
        </View>

        {/* Véhicule & Client */}
        <Text style={s.sectionTitle}>Véhicule & Client</Text>
        <View style={s.vcGrid}>
          <View style={s.vcBlock}>
            <Text style={s.vcLabel}>Véhicule</Text>
            <Text style={s.vcNom}>{fiche.vehicule.marque} {fiche.vehicule.modele}</Text>
            {fiche.vehicule.immatriculation && <Text style={s.vcMono}>{fiche.vehicule.immatriculation}</Text>}
            {fiche.vehicule.annee && <Text style={s.vcInfo}>Année : {fiche.vehicule.annee}</Text>}
            {fiche.vehicule.vin && <Text style={s.vcMono}>VIN : {fiche.vehicule.vin}</Text>}
          </View>
          <View style={s.vcBlock}>
            <Text style={s.vcLabel}>Client</Text>
            <Text style={s.vcNom}>{fiche.vehicule.clientNom}{fiche.vehicule.clientPrenom ? ` ${fiche.vehicule.clientPrenom}` : ''}</Text>
            {fiche.vehicule.clientTel && <Text style={s.vcInfo}>{fiche.vehicule.clientTel}</Text>}
            {fiche.vehicule.clientEmail && <Text style={s.vcInfo}>{fiche.vehicule.clientEmail}</Text>}
          </View>
        </View>

        {/* Travaux à effectuer | Contrôles + QR */}
        <View style={s.middleRow}>
          <View style={s.travauxCol}>
            <Text style={s.sectionTitle}>Travaux à effectuer</Text>
            {travailsLignes.map((t, i) => (
              <View key={i} style={s.travailRow}>
                <Text style={s.travailBullet}>›</Text>
                <Text style={s.travailText}>{t}</Text>
              </View>
            ))}
            {fiche.notes && (
              <View style={s.notesBox}>
                <Text style={s.notesLabel}>Notes internes</Text>
                <Text style={s.notesText}>{fiche.notes}</Text>
              </View>
            )}
          </View>

          <View style={s.rightCol}>
            <View style={s.controlesCol}>
              <Text style={s.sectionTitle}>Contrôles à effectuer</Text>
              {controles.map((c) => (
                <View key={c} style={s.controleItem}>
                  <View style={s.controleBox} />
                  <Text style={s.controleText}>{c}</Text>
                </View>
              ))}
            </View>
            {qrCodeSrc && (
              <View style={s.qrBlock}>
                <Image src={qrCodeSrc} style={s.qrImage} />
                <Text style={s.qrLabel}>SCAN ATELIER</Text>
              </View>
            )}
          </View>
        </View>

        {/* KPIs si clôturée */}
        {isCloturee && tFacture > 0 && (
          <>
            <Text style={s.sectionTitle}>Synthèse facturation</Text>
            <View style={s.kpiRow}>
              <View style={s.kpi}>
                <Text style={s.kpiVal}>{formatH(tFacture)}</Text>
                <Text style={s.kpiLabel}>Temps facturé</Text>
              </View>
              <View style={s.kpi}>
                <Text style={s.kpiVal}>{formatH(tReel)}</Text>
                <Text style={s.kpiLabel}>Temps réel</Text>
              </View>
              {fiche.tauxApplique && (
                <View style={s.kpi}>
                  <Text style={s.kpiVal}>{fiche.tauxApplique}</Text>
                  <Text style={s.kpiLabel}>Taux</Text>
                </View>
              )}
              {fiche.montantHT && (
                <View style={[s.kpi, { backgroundColor: '#f0f8f0', borderColor: '#a0d8a0' }]}>
                  <Text style={[s.kpiVal, { color: COLORS.success }]}>{formatEur(fiche.montantHT)}</Text>
                  <Text style={s.kpiLabel}>Montant HT</Text>
                </View>
              )}
              {tReel > 0 && (
                <View style={[s.kpiGain, { backgroundColor: isGain ? '#f0fff4' : '#fff0f0', borderColor: isGain ? '#a0d8b0' : '#f0b0b0' }]}>
                  <Text style={[s.kpiVal, { color: isGain ? COLORS.success : COLORS.error, fontSize: 10 }]}>
                    {isGain ? '+' : ''}{tauxVal ? formatEur(delta * tauxVal) : '—'}
                  </Text>
                  <Text style={[s.kpiLabel, { color: isGain ? COLORS.success : COLORS.error }]}>
                    {isGain ? 'Gain' : 'Perte'}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* Tableau travaux effectués */}
        <View style={s.tableSection}>
          <Text style={s.sectionTitle}>Travaux effectués</Text>
          <View style={s.tableHeader}>
            <Text style={[s.thCell, { width: 32 }]}>Qté</Text>
            <Text style={[s.thCell, { flex: 1 }]}>Désignation</Text>
            <Text style={[s.thCell, { width: 90 }]}>Référence</Text>
          </View>
          {allPiecesConfirmees.map((piece, i) => (
            <View key={piece} style={[s.tableRowPre, i % 2 !== 0 ? { backgroundColor: '#eef3ff' } : {}]}>
              <Text style={[s.tdCell, { width: 32 }]}></Text>
              <Text style={[s.tdCell, { flex: 1 }]}>{piece}</Text>
              <Text style={[s.tdCell, { width: 90 }]}></Text>
            </View>
          ))}
          {Array.from({ length: emptyRowsCount }).map((_, i) => (
            <View key={i} style={i % 2 === 1 ? [s.tableRow, s.tableRowAlt] : s.tableRow}>
              <Text style={[s.tdCell, { width: 32 }]}></Text>
              <Text style={[s.tdCell, { flex: 1 }]}></Text>
              <Text style={[s.tdCell, { width: 90 }]}></Text>
            </View>
          ))}
        </View>

        {/* Travaux à prévoir */}
        <Text style={s.sectionTitle}>Travaux à prévoir</Text>
        <View style={s.prevoir} />

        {/* Signatures */}
        <View style={s.sigRow}>
          <View style={s.sigBox}>
            <Text style={s.sigTitle}>Signature du client</Text>
            <Text style={s.sigSub}>Lu et approuvé</Text>
            <View style={s.sigLine} />
            <Text style={s.sigDate}>Date : _______________</Text>
          </View>
          <View style={s.sigBox}>
            <Text style={s.sigTitle}>Cachet & signature du garage</Text>
            <View style={s.sigLine} />
            <Text style={s.sigDate}>Date : _______________</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <View style={s.footerLeft}>
            <View style={s.footerLogoCircle}>
              <Image src={logoSrc} style={{ width: 16, height: 16 }} />
            </View>
            <View>
              <Text style={s.footerAppName}>by LYSMA Solutions</Text>
              <Text style={s.footerBy}>{garage.nom}</Text>
            </View>
          </View>
          <Text style={s.footerCenter}>{fiche.numero} — Généré le {formatDate(new Date())}</Text>
          <Text style={s.footerRight} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>

      </Page>
    </Document>
  )
}
