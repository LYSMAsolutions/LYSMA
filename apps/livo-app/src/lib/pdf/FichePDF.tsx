import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { COLORS } from './styles'

type Compagnon = { prenom: string; nom: string; poste: string | null }
type PointageFiche = { compagnon: Compagnon; dureeMinutes: number | null; debutAt: Date; finAt: Date | null }

type Props = {
  fiche: {
    numero: string
    statut: string
    travaux: string
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
  barcodeSrc?: string
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

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#ffffff',
    paddingTop: 28,
    paddingBottom: 44,
    paddingHorizontal: 32,
  },

  // ── Filigrane ─────────────────────────────────────────────
  watermark: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    alignItems: 'center',
    opacity: 0.04,
  },
  watermarkImg: { width: 280, height: 280 },

  // ── Header ────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.blueElectric,
  },
  headerLeft: { flexDirection: 'column', flex: 1 },
  headerCenter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1.15, paddingHorizontal: 8, gap: 8 },
  garageNom: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep, marginBottom: 3 },
  garageInfo: { fontSize: 8, color: '#444444', marginBottom: 1 },

  headerRight: { flexDirection: 'column', alignItems: 'flex-end' },
  docTitle: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep, marginBottom: 4 },
  docNumero: { fontSize: 10, color: COLORS.blueElectric, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  docDate: { fontSize: 8, color: '#666666' },

  livoSmall: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  livoLogo: { width: 20, height: 20 },
  livoText: { fontSize: 7, color: COLORS.textMuted },

  // ── Section title ─────────────────────────────────────────
  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.blueElectric,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#dde8f5',
  },

  // ── Véhicule + Client ─────────────────────────────────────
  vcGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  vcBlock: {
    flex: 1,
    backgroundColor: '#f8faff',
    borderWidth: 1,
    borderColor: '#dde8f5',
    borderRadius: 4,
    padding: 10,
  },
  vcLabel: { fontSize: 7, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  vcNom: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep, marginBottom: 4 },
  vcInfo: { fontSize: 8, color: '#555555', marginBottom: 2 },
  vcMono: { fontSize: 8, color: '#555555', fontFamily: 'Helvetica', marginBottom: 2 },

  // ── Travaux ───────────────────────────────────────────────
  travauxSection: { marginBottom: 14 },
  travailRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 5, gap: 6 },
  travailBullet: { fontSize: 10, color: COLORS.blueElectric, fontFamily: 'Helvetica-Bold', marginTop: -1 },
  travailText: { flex: 1, fontSize: 9, color: '#222222', lineHeight: 1.3 },

  notesBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#fffbf0',
    borderWidth: 1,
    borderColor: '#f0d8a0',
    borderRadius: 3,
  },
  notesLabel: { fontSize: 7, color: '#8a6a00', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  notesText: { fontSize: 8, color: '#665500' },

  // ── Travaux à prévoir ─────────────────────────────────────
  prevoir: {
    marginBottom: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#dde8f5',
    borderRadius: 4,
    minHeight: 40,
  },

  // ── Tableau travaux effectués ─────────────────────────────
  tableSection: { marginBottom: 14 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.blueDeep,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 3,
    marginBottom: 1,
  },
  thCell: { fontSize: 8, color: '#ffffff', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.6 },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2fa',
    minHeight: 28,
  },
  tableRowAlt: { backgroundColor: '#f8faff' },
  tdCell: { fontSize: 8, color: '#333333' },

  // ── KPIs si clôturée ─────────────────────────────────────
  kpiRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  kpi: { flex: 1, backgroundColor: '#f0f5ff', borderWidth: 1, borderColor: '#dde8f5', borderRadius: 4, padding: 8, alignItems: 'center' },
  kpiVal: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep },
  kpiLabel: { fontSize: 7, color: COLORS.textMuted, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.6 },
  kpiGain: { flex: 1, borderRadius: 4, padding: 8, alignItems: 'center', borderWidth: 1 },

  // ── Signatures ────────────────────────────────────────────
  sigRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  sigBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dde8f5',
    borderRadius: 4,
    padding: 10,
    minHeight: 60,
  },
  sigTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  sigSub: { fontSize: 7, color: '#888888', marginBottom: 24 },
  sigLine: { borderBottomWidth: 1, borderBottomColor: '#b0c0d8' },
  sigDate: { fontSize: 7, color: '#888888', marginTop: 4 },

  // ── Barcode ───────────────────────────────────────────
  barcodeSection: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  barcodeImg: { width: 160, height: 40 },

  // ── Footer ────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 14,
    left: 32,
    right: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#dde8f5',
  },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerLogoCircle: { width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.blueElectric, alignItems: 'center', justifyContent: 'center' },
  footerLogoText: { fontSize: 7, color: '#ffffff', fontFamily: 'Helvetica-Bold' },
  footerAppName: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep },
  footerBy: { fontSize: 6, color: COLORS.textMuted, marginTop: 1 },
  footerCenter: { fontSize: 7, color: '#666666' },
  footerRight: { fontSize: 7, color: '#888888' },
})

// Lignes vides pour le tableau manuel
const EMPTY_ROWS = 8

export function FichePDF({ fiche, garage, logoSrc, barcodeSrc, qrCodeSrc }: Props) {
  const travailsLignes = fiche.travaux.split('\n').filter(Boolean)
  const tReel = fiche.tempsReel ?? 0
  const tFacture = fiche.tempsFacture ?? 0
  const delta = tFacture - tReel
  const tauxVal = fiche.montantHT && tFacture > 0 ? fiche.montantHT / tFacture : null
  const isGain = delta >= 0
  const isCloturee = fiche.statut === 'CLOTUREE'

  return (
    <Document title={`${garage.nom} — ${fiche.numero}`} author="LIVO-APP">
      <Page size="A4" style={s.page}>

        {/* Filigrane */}
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
          <View style={s.headerCenter}>
            {barcodeSrc && (
              <Image src={barcodeSrc} style={{ width: 170, height: 54 }} />
            )}
            {qrCodeSrc && (
              <View style={{ alignItems: 'center' }}>
                <Image src={qrCodeSrc} style={{ width: 58, height: 58 }} />
                <Text style={{ fontSize: 6, color: COLORS.textMuted, marginTop: 2 }}>SCAN ATELIER</Text>
              </View>
            )}
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

        {/* Travaux à effectuer */}
        <View style={s.travauxSection}>
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

        {/* Travaux à prévoir */}
        <Text style={s.sectionTitle}>Travaux à prévoir</Text>
        <View style={s.prevoir} />

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
                  <Text style={[s.kpiVal, { color: isGain ? COLORS.success : COLORS.error, fontSize: 11 }]}>
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
            <Text style={[s.thCell, { width: 35 }]}>Qté</Text>
            <Text style={[s.thCell, { flex: 1 }]}>Désignation</Text>
            <Text style={[s.thCell, { width: 100 }]}>Référence</Text>
          </View>
          {/* Lignes vides pour remplissage manuel */}
          {Array.from({ length: EMPTY_ROWS }).map((_, i) => (
            <View key={i} style={i % 2 === 1 ? [s.tableRow, s.tableRowAlt] : s.tableRow}>
              <Text style={[s.tdCell, { width: 35 }]}></Text>
              <Text style={[s.tdCell, { flex: 1 }]}></Text>
              <Text style={[s.tdCell, { width: 100 }]}></Text>
            </View>
          ))}
        </View>

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
            <View style={{ alignItems: 'center' }}>
              <View style={s.footerLogoCircle}>
                <Image src={logoSrc} style={{ width: 25, height: 25 }} />
              </View>
              <Text style={s.footerBy}>by LYSMA Solutions</Text>
            </View>
            <View>
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
