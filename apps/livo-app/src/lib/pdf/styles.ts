import { StyleSheet } from '@react-pdf/renderer'

// Couleurs LIVO
export const COLORS = {
  blueDeep:    '#0a2a6e',
  blueElectric:'#1a6fff',
  cyan:        '#40c0ff',
  gold:        '#f0a020',
  success:     '#20c060',
  error:       '#ff4040',
  warning:     '#f0a020',
  bgBase:      '#04060f',
  bgSurface:   '#080e1e',
  textPrimary: '#f0f4ff',
  textSecondary:'#8099cc',
  textMuted:   '#4a5a80',
  border:      '#1a2a4a',
  white:       '#ffffff',
  black:       '#000000',
}

export const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: COLORS.black,
    backgroundColor: COLORS.white,
    padding: 40,
  },

  // ── Header ──────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.blueElectric,
  },
  headerLeft: { flexDirection: 'column', gap: 2 },
  headerRight: { flexDirection: 'column', alignItems: 'flex-end', gap: 2 },

  logoText: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.blueElectric,
    letterSpacing: 2,
  },
  logoSub: {
    fontSize: 8,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },

  docTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.blueDeep,
  },
  docSubtitle: {
    fontSize: 9,
    color: COLORS.textSecondary,
  },
  docDate: {
    fontSize: 9,
    color: COLORS.textMuted,
  },

  // ── Section ──────────────────────────────────────────────────
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.blueElectric,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e8f0',
  },

  // ── Grid infos ───────────────────────────────────────────────
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoBlock: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8faff',
    borderWidth: 1,
    borderColor: '#dde8f5',
    borderRadius: 4,
    padding: 10,
  },
  infoLabel: {
    fontSize: 7,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.blueDeep,
  },
  infoValueSm: {
    fontSize: 9,
    color: COLORS.black,
  },

  // ── Table ────────────────────────────────────────────────────
  table: {
    borderWidth: 1,
    borderColor: '#dde8f5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.blueDeep,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2fa',
  },
  tableRowAlt: {
    backgroundColor: '#f8faff',
  },
  tableCell: {
    fontSize: 9,
    color: COLORS.black,
  },
  tableCellBold: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.blueDeep,
  },

  // ── Badge statut ─────────────────────────────────────────────
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── Signature ────────────────────────────────────────────────
  signatureZone: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  signatureBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dde8f5',
    borderRadius: 4,
    padding: 12,
    minHeight: 80,
  },
  signatureLabel: {
    fontSize: 8,
    color: COLORS.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#b0c0d8',
    marginTop: 40,
  },

  // ── Footer ───────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#dde8f5',
  },
  footerText: {
    fontSize: 7,
    color: COLORS.textMuted,
  },

  // ── Utilitaires ──────────────────────────────────────────────
  row: { flexDirection: 'row', alignItems: 'center' },
  spaceBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bold: { fontFamily: 'Helvetica-Bold' },
  mt4: { marginTop: 4 },
  mt8: { marginTop: 8 },
  mt12: { marginTop: 12 },
  mb4: { marginBottom: 4 },
  mb8: { marginBottom: 8 },
})
