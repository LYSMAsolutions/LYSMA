import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { COLORS } from './styles'

type PointageJour = {
  date: Date
  statutActuel: string
  heureArrivee: Date | null
  heureDepart: Date | null
  pauseCafeDebut: Date | null
  pauseCafeFin: Date | null
  pauseDejDebut: Date | null
  pauseDejFin: Date | null
  dureeMinutes: number | null
}

type Props = {
  compagnon: {
    prenom: string
    nom: string
    poste: string | null
    matricule: string | null
    heuresContrat: number
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
  pointages: PointageJour[]
  mois: number
  annee: number
  logoSrc: string
}

const MOIS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

function formatTime(d: Date | null) {
  if (!d) return '—'
  return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
function formatH(min: number) {
  const h = Math.floor(min / 60); const m = min % 60
  return `${h}h${m.toString().padStart(2,'0')}`
}
function formatDateFR(d: Date) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#ffffff',
    paddingTop: 32,
    paddingBottom: 48,
    paddingHorizontal: 32,
  },

  // ── Barre légale verticale gauche ─────────────────────────
  legalBar: {
    position: 'absolute',
    left: 10,
    top: 100,
    bottom: 60,
    width: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legalBarLine: {
    position: 'absolute',
    left: 5,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#dde8f5',
  },
  legalBarText: {
    fontSize: 7,
    color: '#8099cc',
    transform: 'rotate(-90deg)',
    letterSpacing: 1,
    width: 200,
    textAlign: 'center',
  },

  // ── Header 3 colonnes ─────────────────────────────────────
  header: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.blueElectric,
  },
  col1: { flex: 1.2 },
  col2: {
    flex: 1.5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#dde8f5',
    paddingHorizontal: 16,
  },
  col3: { flex: 1, alignItems: 'flex-end' },

  garageNom: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep, marginBottom: 6 },
  garageInfoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 3, gap: 4 },
  garageInfoIcon: { fontSize: 8, color: COLORS.blueElectric, width: 10 },
  garageInfoText: { fontSize: 8, color: '#333333', flex: 1 },

  docTitle: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep, marginBottom: 2 },
  docMois: { fontSize: 11, color: COLORS.blueElectric, marginBottom: 8 },
  docSectionLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#555555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 },
  compagnonRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  compagnonNom: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep },
  compagnonSub: { fontSize: 8, color: '#666666' },

  contratBox: {
    backgroundColor: '#f4f7ff',
    borderRadius: 6,
    padding: 10,
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  contratLabel: { fontSize: 7, color: COLORS.blueElectric, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
  contratVal: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep },
  contratSub: { fontSize: 8, color: '#666666', marginTop: 1 },
  periodeBox: {
    backgroundColor: '#f4f7ff',
    borderRadius: 6,
    padding: 8,
    alignItems: 'flex-end',
    width: '100%',
  },
  periodeLabel: { fontSize: 7, color: COLORS.blueElectric, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
  periodeVal: { fontSize: 8, color: COLORS.blueDeep },

  // ── Filigrane ─────────────────────────────────────────────
  watermark: {
    position: 'absolute',
    top: 200,
    left: 0,
    right: 0,
    alignItems: 'center',
    opacity: 0.04,
  },
  watermarkImg: { width: 40, height: 20 },

  // ── Tableau ───────────────────────────────────────────────
  tableWrap: { marginTop: 4 },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: COLORS.blueDeep,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 1,
  },
  thCell: { fontSize: 7, color: '#ffffff', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.6 },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2fa',
  },
  tableRowAlt: { backgroundColor: '#f8faff' },
  tdCell: { fontSize: 8, color: '#333333' },
  tdBold: { fontSize: 8, color: COLORS.blueDeep, fontFamily: 'Helvetica-Bold' },

  // ── Total ─────────────────────────────────────────────────
  totalRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.blueDeep,
    padding: 12,
    borderRadius: 6,
    marginTop: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLeft: {},
  totalLabel: { fontSize: 9, color: '#ffffff', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  totalSub: { fontSize: 7, color: '#a0c0e0', marginTop: 2 },
  totalVal: { fontSize: 20, color: COLORS.gold, fontFamily: 'Helvetica-Bold' },
  totalRight: { alignItems: 'flex-end' },
  totalVsLabel: { fontSize: 8, color: '#a0c0e0', textTransform: 'uppercase', letterSpacing: 0.5 },
  totalVsVal: { fontSize: 14, fontFamily: 'Helvetica-Bold', marginTop: 2 },

  // ── Note légale ───────────────────────────────────────────
  legalNote: {
    marginTop: 14,
    padding: 10,
    backgroundColor: '#fffbf0',
    borderWidth: 1,
    borderColor: '#f0d8a0',
    borderRadius: 6,
  },
  legalTextWrap: { flex: 1 },
  legalTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#8a6a00', marginBottom: 3 },
  legalText: { fontSize: 7, color: '#8a6a00', lineHeight: 1.4 },

  // ── Signatures ────────────────────────────────────────────
  sigRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  sigBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dde8f5',
    borderRadius: 6,
    padding: 12,
  },
  sigHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  sigIcon: { fontSize: 16 },
  sigTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep, textTransform: 'uppercase', letterSpacing: 0.5 },
  sigSub: { fontSize: 7, color: '#888888', marginBottom: 28 },
  sigLine: { borderBottomWidth: 1, borderBottomColor: '#b0c0d8', marginTop: 4 },
  sigDate: { fontSize: 7, color: '#888888', marginTop: 6 },

  // ── Footer ────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 32,
    right: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#dde8f5',
  },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerLogoCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.blueElectric,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLogoText: { fontSize: 7, color: '#ffffff', fontFamily: 'Helvetica-Bold' },
  footerAppName: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep },
  footerDash: { fontSize: 8, color: '#888888' },
  footerDocType: { fontSize: 7, color: '#888888' },
  footerCenter: { fontSize: 7, color: '#666666' },
  footerRight: { fontSize: 7, color: '#888888' },
})

const COL_WIDTHS = { date: 65, arrivee: 50, cafe: 50, dej: 50, depart: 50, duree: 40, statut: 55 }

export function PointagePDF({ compagnon, garage, pointages, mois, annee, logoSrc }: Props) {
  const totalMinutes = pointages.reduce((sum, p) => sum + (p.dureeMinutes ?? 0), 0)
  const joursPresents = pointages.filter(p => p.heureArrivee).length
  const heuresContratMois = Math.round(compagnon.heuresContrat * 4.33)
  const delta = Math.round(totalMinutes / 60) - heuresContratMois
  const joursAvecPointage = pointages.filter(p => p.heureArrivee || p.statutActuel !== 'ABSENT')

  const debutPeriode = new Date(annee, mois - 1, 1)
  const finPeriode = new Date(annee, mois, 0)

  return (
    <Document title={`Pointage ${MOIS[mois-1]} ${annee} - ${compagnon.nom}`} author="LIVO-APP">
      <Page size="A4" style={s.page}>

        {/* Filigrane */}
        <View style={s.watermark} fixed>
          <Image src={logoSrc} style={s.watermarkImg} />
        </View>

        {/* Barre légale verticale */}
        <View style={s.legalBar} fixed>
          <View style={s.legalBarLine} />
          <Text style={s.legalBarText}>Document légal — CJUE 2019/2024</Text>
        </View>

        {/* Header 3 colonnes */}
        <View style={s.header}>
          {/* Col 1 — Garage */}
          <View style={s.col1}>
            <Text style={s.garageNom}>{garage.nom}</Text>
            {garage.adresse && (
              <View style={s.garageInfoRow}>
                <Text style={s.garageInfoIcon}></Text>
                <Text style={s.garageInfoText}>{garage.adresse}{'\n'}{[garage.codePostal, garage.ville].filter(Boolean).join(' ')}</Text>
              </View>
            )}
            {garage.telephone && (
              <View style={s.garageInfoRow}>
                <Text style={s.garageInfoIcon}></Text>
                <Text style={s.garageInfoText}>{garage.telephone}</Text>
              </View>
            )}
            {garage.email && (
              <View style={s.garageInfoRow}>
                <Text style={s.garageInfoIcon}></Text>
                <Text style={s.garageInfoText}>{garage.email}</Text>
              </View>
            )}
            {garage.siret && (
              <View style={s.garageInfoRow}>
                <Text style={s.garageInfoIcon}></Text>
                <Text style={s.garageInfoText}>SIRET : {garage.siret}</Text>
              </View>
            )}
          </View>

          {/* Col 2 — Titre + Compagnon */}
          <View style={s.col2}>
            <Text style={s.docTitle}>Fiche de Pointage</Text>
            <Text style={s.docMois}>{MOIS[mois-1]} {annee}</Text>
            <Text style={s.docSectionLabel}>Informations du compagnon</Text>
            <View style={s.compagnonRow}>
              <Text style={s.compagnonNom}>{compagnon.prenom} {compagnon.nom}</Text>
            </View>
            {compagnon.poste && <Text style={s.compagnonSub}>{compagnon.poste}</Text>}
            {compagnon.matricule && <Text style={s.compagnonSub}>Matricule : {compagnon.matricule}</Text>}
          </View>

          {/* Col 3 — Contrat + Période */}
          <View style={s.col3}>
            <View style={s.contratBox}>
              <Text style={s.contratLabel}>Contrat</Text>
              <Text style={s.contratVal}>{compagnon.heuresContrat}h/sem</Text>
              <Text style={s.contratSub}>H {heuresContratMois}h ce mois</Text>
            </View>
            <View style={s.periodeBox}>
              <Text style={s.periodeLabel}>Période concernée</Text>
              <Text style={s.periodeVal}>Du {formatDateFR(debutPeriode)} au {formatDateFR(finPeriode)}</Text>
            </View>
          </View>
        </View>

        {/* Tableau */}
        <View style={s.tableWrap}>
          <View style={s.tableHead}>
            <Text style={[s.thCell, { width: COL_WIDTHS.date }]}>Date</Text>
            <Text style={[s.thCell, { width: COL_WIDTHS.arrivee }]}>Arrivée</Text>
            <Text style={[s.thCell, { width: COL_WIDTHS.cafe }]}>P. Café</Text>
            <Text style={[s.thCell, { width: COL_WIDTHS.dej }]}>P. Déj.</Text>
            <Text style={[s.thCell, { width: COL_WIDTHS.depart }]}>Départ</Text>
            <Text style={[s.thCell, { width: COL_WIDTHS.duree }]}>Durée</Text>
            <Text style={[s.thCell, { flex: 1 }]}>Statut</Text>
          </View>

          {joursAvecPointage.map((p, i) => {
            const date = new Date(p.date)
            const dayLabel = date.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: '2-digit' })
            const pauseCafe = p.pauseCafeDebut ? `${formatTime(p.pauseCafeDebut)}-${formatTime(p.pauseCafeFin)}` : '—'
            const pauseDej = p.pauseDejDebut ? `${formatTime(p.pauseDejDebut)}-${formatTime(p.pauseDejFin)}` : '—'
            const statut = p.statutActuel === 'PARTI' ? 'Présent' : p.statutActuel.replace('_', ' ')
            return (
              <View key={i} style={i % 2 === 1 ? [s.tableRow, s.tableRowAlt] : s.tableRow}>
                <Text style={[s.tdCell, { width: COL_WIDTHS.date }]}>{dayLabel}</Text>
                <Text style={[s.tdCell, { width: COL_WIDTHS.arrivee }]}>{formatTime(p.heureArrivee)}</Text>
                <Text style={[s.tdCell, { width: COL_WIDTHS.cafe, fontSize: 7 }]}>{pauseCafe}</Text>
                <Text style={[s.tdCell, { width: COL_WIDTHS.dej, fontSize: 7 }]}>{pauseDej}</Text>
                <Text style={[s.tdCell, { width: COL_WIDTHS.depart }]}>{formatTime(p.heureDepart)}</Text>
                <Text style={[s.tdBold, { width: COL_WIDTHS.duree }]}>{p.dureeMinutes ? formatH(p.dureeMinutes) : '—'}</Text>
                <Text style={[s.tdCell, { flex: 1, fontSize: 7 }]}>{statut}</Text>
              </View>
            )
          })}
        </View>

        {/* Total */}
        <View style={s.totalRow}>
          <View style={s.totalLeft}>
            <Text style={s.totalLabel}>Total heures travaillées</Text>
            <Text style={s.totalSub}>{joursPresents} jours de présence</Text>
          </View>
          <Text style={s.totalVal}>{formatH(totalMinutes)}</Text>
          <View style={s.totalRight}>
            <Text style={s.totalVsLabel}>VS Contrat</Text>
            <Text style={[s.totalVsVal, { color: delta >= 0 ? COLORS.success : COLORS.error }]}>
              {delta >= 0 ? '+' : ''}{delta}h
            </Text>
          </View>
        </View>

        {/* Note légale */}
        <View style={s.legalNote}>
          <View style={s.legalTextWrap}>
            <Text style={s.legalTitle}>Base légale — Obligation de suivi du temps de travail</Text>
            <Text style={s.legalText}>
              Document établi conformément à la directive CJUE C-55/18 (14 mai 2019) et sa confirmation de 2024.{'\n'}
              Conservation obligatoire 5 ans. Accessible à l'inspection du travail sur demande.
            </Text>
          </View>
        </View>

        {/* Signatures */}
        <View style={s.sigRow}>
          <View style={s.sigBox}>
            <View style={s.sigHeader}>
              <Text style={s.sigIcon}>✍</Text>
              <Text style={s.sigTitle}>Signature du salarié</Text>
            </View>
            <Text style={s.sigSub}>Je certifie l'exactitude des informations ci-dessus</Text>
            <View style={s.sigLine} />
            <Text style={s.sigDate}>Date : _______________</Text>
          </View>
          <View style={s.sigBox}>
            <View style={s.sigHeader}>
              <Text style={s.sigIcon}>✓</Text>
              <Text style={s.sigTitle}>Signature de l'employeur</Text>
            </View>
            <Text style={s.sigSub}>Validé par le responsable</Text>
            <View style={s.sigLine} />
            <Text style={s.sigDate}>Date : _______________</Text>
          </View>
        </View>

        {/* Footer */}
<View style={s.footer} fixed>
  <View style={s.footerLeft}>
    <View style={{ alignItems: 'center' }}>
      <View style={s.footerLogoCircle}>
        <Image src={logoSrc} style={{ width: 20, height: 20 }} />
      </View>
      <Text style={{ fontSize: 5, color: '#888888', marginTop: 2 }}>by LYSMA Solutions</Text>
    </View>
    <Text style={s.footerDash}> — </Text>
    <Text style={s.footerDocType}>Document légal de suivi du temps de travail</Text>
  </View>
  <Text style={s.footerCenter}>{compagnon.prenom} {compagnon.nom} — {MOIS[mois-1]} {annee}</Text>
  <Text style={s.footerRight} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
</View>

      </Page>
    </Document>
  )
}
