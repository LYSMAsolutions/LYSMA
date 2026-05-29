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

type ReviewStatus = 'BROUILLON' | 'A_VERIFIER' | 'VALIDE' | 'CONTESTE'

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
  logoSrc?: string
  review?: {
    status: ReviewStatus
    validatedAt?: Date | string | null
    validatedByName?: string | null
  } | null
}

const MOIS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
]

const STATUT_LABELS: Record<string, string> = {
  ABSENT: 'Absent',
  ARRIVE: 'Arrivé',
  EN_TRAVAIL: 'En travail',
  PAUSE_CAFE: 'Pause café',
  PAUSE_DEJEUNER: 'Pause déjeuner',
  PARTI: 'Journée clôturée',
}

const REVIEW_LABELS: Record<ReviewStatus, string> = {
  BROUILLON: 'Brouillon',
  A_VERIFIER: 'À vérifier',
  VALIDE: 'Validé',
  CONTESTE: 'Contesté',
}

function asDate(date: Date | string | null | undefined) {
  return date ? new Date(date) : null
}

function minutesBetween(start: Date | null, end: Date | null) {
  if (!start || !end) return 0
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000))
}

function pauseMinutes(pointage: PointageJour) {
  const cafe = minutesBetween(asDate(pointage.pauseCafeDebut), asDate(pointage.pauseCafeFin))
  const dejeuner = minutesBetween(asDate(pointage.pauseDejDebut), asDate(pointage.pauseDejFin))
  return cafe + dejeuner
}

function formatTime(date: Date | null) {
  const value = asDate(date)
  if (!value) return '-'
  return value.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatShortDate(date: Date) {
  return new Date(date).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: '2-digit' })
}

function formatDuration(minutes: number) {
  const sign = minutes < 0 ? '-' : ''
  const abs = Math.abs(minutes)
  const hours = Math.floor(abs / 60)
  const mins = abs % 60
  return `${sign}${hours} h ${String(mins).padStart(2, '0')}`
}

function formatContractHours(hours: number) {
  return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(hours)} h / semaine`
}

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 8,
    backgroundColor: '#ffffff',
    color: '#172033',
    paddingTop: 30,
    paddingBottom: 54,
    paddingHorizontal: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 18,
    paddingBottom: 14,
    marginBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.blueElectric,
  },
  garageBlock: { width: '31%' },
  titleBlock: { width: '38%', alignItems: 'center' },
  periodBlock: { width: '31%', alignItems: 'flex-end' },
  garageName: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep, marginBottom: 5 },
  infoText: { fontSize: 7.5, color: '#4a5568', lineHeight: 1.35 },
  documentTitle: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep, marginBottom: 3 },
  documentSub: { fontSize: 9, color: COLORS.blueElectric, fontFamily: 'Helvetica-Bold' },
  documentMeta: { fontSize: 7, color: '#64748b', marginTop: 5, textAlign: 'center', lineHeight: 1.35 },
  periodLabel: { fontSize: 7, color: COLORS.blueElectric, textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', letterSpacing: 0.8 },
  periodValue: { fontSize: 10, color: COLORS.blueDeep, fontFamily: 'Helvetica-Bold', marginTop: 3 },
  generatedAt: { fontSize: 7, color: '#64748b', marginTop: 8 },
  identityGrid: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  identityCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dbe7f5',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#f8fbff',
  },
  cardLabel: { fontSize: 7, color: COLORS.blueElectric, textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', letterSpacing: 0.8, marginBottom: 5 },
  cardTitle: { fontSize: 12, color: COLORS.blueDeep, fontFamily: 'Helvetica-Bold', marginBottom: 3 },
  cardText: { fontSize: 8, color: '#334155', lineHeight: 1.35 },
  summaryGrid: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  summaryCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dbe7f5',
    borderRadius: 6,
    padding: 9,
    backgroundColor: '#ffffff',
  },
  summaryLabel: { fontSize: 7, color: '#64748b', textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', letterSpacing: 0.7 },
  summaryValue: { fontSize: 14, color: COLORS.blueDeep, fontFamily: 'Helvetica-Bold', marginTop: 4 },
  summaryValuePositive: { color: COLORS.success },
  summaryValueNegative: { color: COLORS.error },
  sectionTitle: {
    fontSize: 9,
    color: COLORS.blueElectric,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  table: { borderWidth: 1, borderColor: '#dbe7f5', borderRadius: 5, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: COLORS.blueDeep, paddingVertical: 6, paddingHorizontal: 6 },
  tableHeaderCell: { fontSize: 6.5, color: '#ffffff', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.4 },
  tableRow: { flexDirection: 'row', paddingVertical: 5.5, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
  tableRowAlt: { backgroundColor: '#f8fbff' },
  tableCell: { fontSize: 7.2, color: '#27364a' },
  tableCellBold: { fontSize: 7.2, color: COLORS.blueDeep, fontFamily: 'Helvetica-Bold' },
  noData: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#dbe7f5',
    borderRadius: 6,
    color: '#64748b',
    fontSize: 8,
  },
  legalNote: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#fff8e6',
    borderWidth: 1,
    borderColor: '#f2d28a',
    borderRadius: 6,
  },
  legalTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#8a5a00', marginBottom: 4 },
  legalText: { fontSize: 7, color: '#6f4b00', lineHeight: 1.35 },
  traceNote: {
    marginTop: 8,
    padding: 9,
    borderWidth: 1,
    borderColor: '#dbe7f5',
    borderRadius: 6,
    backgroundColor: '#f8fbff',
  },
  traceTitle: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: COLORS.blueDeep, marginBottom: 3 },
  traceText: { fontSize: 7, color: '#475569', lineHeight: 1.35 },
  signatures: { flexDirection: 'row', gap: 12, marginTop: 12 },
  signatureBox: {
    flex: 1,
    minHeight: 86,
    borderWidth: 1,
    borderColor: '#dbe7f5',
    borderRadius: 6,
    padding: 10,
  },
  signatureTitle: { fontSize: 8, color: COLORS.blueDeep, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.6 },
  signatureText: { fontSize: 7, color: '#64748b', marginTop: 5, lineHeight: 1.35 },
  signatureLine: { borderBottomWidth: 1, borderBottomColor: '#94a3b8', marginTop: 26 },
  signatureDate: { fontSize: 7, color: '#64748b', marginTop: 6 },
  footer: {
    position: 'absolute',
    bottom: 18,
    left: 32,
    right: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#dbe7f5',
    paddingTop: 8,
  },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerLogo: { width: 18, height: 18 },
  footerText: { fontSize: 6.5, color: '#64748b' },
  footerStrong: { fontSize: 7, color: COLORS.blueDeep, fontFamily: 'Helvetica-Bold' },
})

const WIDTHS = {
  date: 58,
  arrival: 46,
  coffee: 62,
  lunch: 62,
  departure: 46,
  pause: 46,
  worked: 46,
}

export function PointagePDF({ compagnon, garage, pointages, mois, annee, logoSrc, review }: Props) {
  const debutPeriode = new Date(annee, mois - 1, 1)
  const finPeriode = new Date(annee, mois, 0)
  const joursAvecPointage = pointages.filter((pointage) => pointage.heureArrivee || pointage.statutActuel !== 'ABSENT')
  const totalMinutes = pointages.reduce((sum, pointage) => sum + (pointage.dureeMinutes ?? 0), 0)
  const totalPauseMinutes = pointages.reduce((sum, pointage) => sum + pauseMinutes(pointage), 0)
  const joursPresents = pointages.filter((pointage) => Boolean(pointage.heureArrivee)).length
  const contratMinutesMois = Math.round((compagnon.heuresContrat * 52 * 60) / 12)
  const deltaMinutes = totalMinutes - contratMinutesMois
  const generatedAt = new Date()
  const reviewStatus = review?.status ?? 'BROUILLON'
  const validatedAt = asDate(review?.validatedAt)

  return (
    <Document title={`Relevé de pointage ${MOIS[mois - 1]} ${annee} - ${compagnon.prenom} ${compagnon.nom}`} author="LIVO">
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View style={s.garageBlock}>
            <Text style={s.garageName}>{garage.nom}</Text>
            {garage.adresse && <Text style={s.infoText}>{garage.adresse}</Text>}
            <Text style={s.infoText}>{[garage.codePostal, garage.ville].filter(Boolean).join(' ')}</Text>
            {garage.telephone && <Text style={s.infoText}>Tél. : {garage.telephone}</Text>}
            {garage.email && <Text style={s.infoText}>Email : {garage.email}</Text>}
            {garage.siret && <Text style={s.infoText}>SIRET : {garage.siret}</Text>}
          </View>

          <View style={s.titleBlock}>
            <Text style={s.documentTitle}>Relevé de pointage</Text>
            <Text style={s.documentSub}>Suivi du temps de travail</Text>
            <Text style={s.documentMeta}>
              Document de suivi objectif, fiable et accessible des temps déclarés dans LIVO.
            </Text>
          </View>

          <View style={s.periodBlock}>
            <Text style={s.periodLabel}>Période concernée</Text>
            <Text style={s.periodValue}>{MOIS[mois - 1]} {annee}</Text>
            <Text style={s.generatedAt}>Généré le {formatDate(generatedAt)}</Text>
          </View>
        </View>

        <View style={s.identityGrid}>
          <View style={s.identityCard}>
            <Text style={s.cardLabel}>Entreprise</Text>
            <Text style={s.cardTitle}>{garage.nom}</Text>
            <Text style={s.cardText}>Période : du {formatDate(debutPeriode)} au {formatDate(finPeriode)}</Text>
          </View>
          <View style={s.identityCard}>
            <Text style={s.cardLabel}>Salarié</Text>
            <Text style={s.cardTitle}>{compagnon.prenom} {compagnon.nom}</Text>
            <Text style={s.cardText}>
              {compagnon.poste ? `${compagnon.poste}\n` : ''}
              {compagnon.matricule ? `Matricule : ${compagnon.matricule}\n` : ''}
              Référence contrat : {formatContractHours(compagnon.heuresContrat)}
            </Text>
          </View>
        </View>

        <View style={s.summaryGrid}>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>Jours pointés</Text>
            <Text style={s.summaryValue}>{joursPresents}</Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>Heures travaillées</Text>
            <Text style={s.summaryValue}>{formatDuration(totalMinutes)}</Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>Pauses enregistrées</Text>
            <Text style={s.summaryValue}>{formatDuration(totalPauseMinutes)}</Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>Écart au contrat</Text>
            <Text style={[s.summaryValue, deltaMinutes >= 0 ? s.summaryValuePositive : s.summaryValueNegative]}>
              {deltaMinutes >= 0 ? '+' : ''}{formatDuration(deltaMinutes)}
            </Text>
          </View>
        </View>

        <View style={s.traceNote}>
          <Text style={s.traceTitle}>Statut de validation mensuelle</Text>
          <Text style={s.traceText}>
            Statut : {REVIEW_LABELS[reviewStatus]}.{' '}
            {validatedAt
              ? `Validé le ${formatDate(validatedAt)}${review?.validatedByName ? ` par ${review.validatedByName}` : ''}.`
              : 'Ce relevé n’a pas encore été validé par un responsable.'}
          </Text>
        </View>

        <Text style={s.sectionTitle}>Détail des pointages</Text>
        {joursAvecPointage.length > 0 ? (
          <View style={s.table}>
            <View style={s.tableHeader}>
              <Text style={[s.tableHeaderCell, { width: WIDTHS.date }]}>Date</Text>
              <Text style={[s.tableHeaderCell, { width: WIDTHS.arrival }]}>Arrivée</Text>
              <Text style={[s.tableHeaderCell, { width: WIDTHS.coffee }]}>Pause café</Text>
              <Text style={[s.tableHeaderCell, { width: WIDTHS.lunch }]}>Pause déjeuner</Text>
              <Text style={[s.tableHeaderCell, { width: WIDTHS.departure }]}>Départ</Text>
              <Text style={[s.tableHeaderCell, { width: WIDTHS.pause }]}>Pause</Text>
              <Text style={[s.tableHeaderCell, { width: WIDTHS.worked }]}>Travail</Text>
              <Text style={[s.tableHeaderCell, { flex: 1 }]}>Statut</Text>
            </View>

            {joursAvecPointage.map((pointage, index) => {
              const pauseCafe = pointage.pauseCafeDebut
                ? `${formatTime(pointage.pauseCafeDebut)} - ${formatTime(pointage.pauseCafeFin)}`
                : '-'
              const pauseDej = pointage.pauseDejDebut
                ? `${formatTime(pointage.pauseDejDebut)} - ${formatTime(pointage.pauseDejFin)}`
                : '-'
              const statut = STATUT_LABELS[pointage.statutActuel] ?? pointage.statutActuel.replaceAll('_', ' ')

              return (
                <View key={`${pointage.date}-${index}`} style={index % 2 === 1 ? [s.tableRow, s.tableRowAlt] : s.tableRow} wrap={false}>
                  <Text style={[s.tableCell, { width: WIDTHS.date }]}>{formatShortDate(pointage.date)}</Text>
                  <Text style={[s.tableCell, { width: WIDTHS.arrival }]}>{formatTime(pointage.heureArrivee)}</Text>
                  <Text style={[s.tableCell, { width: WIDTHS.coffee }]}>{pauseCafe}</Text>
                  <Text style={[s.tableCell, { width: WIDTHS.lunch }]}>{pauseDej}</Text>
                  <Text style={[s.tableCell, { width: WIDTHS.departure }]}>{formatTime(pointage.heureDepart)}</Text>
                  <Text style={[s.tableCell, { width: WIDTHS.pause }]}>{formatDuration(pauseMinutes(pointage))}</Text>
                  <Text style={[s.tableCellBold, { width: WIDTHS.worked }]}>{formatDuration(pointage.dureeMinutes ?? 0)}</Text>
                  <Text style={[s.tableCell, { flex: 1 }]}>{statut}</Text>
                </View>
              )
            })}
          </View>
        ) : (
          <Text style={s.noData}>Aucun pointage enregistré sur la période.</Text>
        )}

        <View style={s.legalNote}>
          <Text style={s.legalTitle}>Base légale - suivi du temps de travail</Text>
          <Text style={s.legalText}>
            Ce relevé constitue un document interne de suivi du temps de travail. Il s’inscrit dans l’obligation de
            mettre en place un système objectif, fiable et accessible de mesure du temps de travail, rappelée par
            l’arrêt CJUE C-55/18 du 14 mai 2019 et par la jurisprudence relative à la preuve des heures travaillées.
            Les données doivent être conservées et présentées en cas de contrôle, de litige ou de demande de
            l’autorité compétente. Ce document doit être vérifié et validé par l’employeur.
          </Text>
        </View>

        <View style={s.traceNote}>
          <Text style={s.traceTitle}>Traçabilité et conservation</Text>
          <Text style={s.traceText}>
            Les horaires affichés proviennent des pointages enregistrés dans LIVO. Toute correction ultérieure doit
            être tracée, datée, motivée et rattachée à un utilisateur identifié. Conservation recommandée : au moins
            5 ans, sous réserve des obligations applicables à l’entreprise.
          </Text>
        </View>

        <View style={s.signatures}>
          <View style={s.signatureBox}>
            <Text style={s.signatureTitle}>Signature du salarié</Text>
            <Text style={s.signatureText}>Je reconnais avoir pris connaissance du présent relevé de pointage.</Text>
            <View style={s.signatureLine} />
            <Text style={s.signatureDate}>Date : ____ / ____ / ______</Text>
          </View>
          <View style={s.signatureBox}>
            <Text style={s.signatureTitle}>Signature de l’employeur</Text>
            <Text style={s.signatureText}>Relevé vérifié et validé par l’employeur ou son représentant.</Text>
            <View style={s.signatureLine} />
            <Text style={s.signatureDate}>Date de validation : ____ / ____ / ______</Text>
          </View>
        </View>

        <View style={s.footer} fixed>
          <View style={s.footerLeft}>
            {logoSrc && <Image src={logoSrc} style={s.footerLogo} />}
            <Text style={s.footerStrong}>LIVO</Text>
            <Text style={s.footerText}>by LYSMA Solutions</Text>
          </View>
          <Text style={s.footerText}>
            {compagnon.prenom} {compagnon.nom} - {MOIS[mois - 1]} {annee}
          </Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
