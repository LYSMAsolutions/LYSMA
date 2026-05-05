import type { TauxType, StatutOR, StatutPointage } from '@/types'

/* ── Taux horaires labels ───────────────────────────────────── */
export const TAUX_LABELS: Record<TauxType, string> = {
  T1: 'Taux 1',
  T2: 'Taux 2',
  T3: 'Taux 3',
  T4: 'Taux 4',
  CARROSSERIE: 'Carrosserie',
  PEINTURE: 'Peinture',
  AUTRE: 'Autre',
}

/* ── Statuts OR ─────────────────────────────────────────────── */
export const STATUT_OR_LABELS: Record<StatutOR, string> = {
  BROUILLON: 'Brouillon',
  EN_ATTENTE: 'En attente',
  EN_COURS: 'En cours',
  EN_PAUSE: 'En pause',
  TERMINE: 'Terminé',
  FACTURE: 'Facturé',
  ANNULE: 'Annulé',
}

export const STATUT_OR_COLORS: Record<StatutOR, string> = {
  BROUILLON: '#4a5a80',
  EN_ATTENTE: '#f0a020',
  EN_COURS: '#1a6fff',
  EN_PAUSE: '#e07010',
  TERMINE: '#20c060',
  FACTURE: '#40c0ff',
  ANNULE: '#ff4040',
}

/* ── Statuts pointage ───────────────────────────────────────── */
export const STATUT_POINTAGE_LABELS: Record<StatutPointage, string> = {
  ABSENT: 'Absent',
  ARRIVE: 'Arrivé',
  PAUSE_CAFE: 'Pause café',
  PAUSE_DEJEUNER: 'Pause déjeuner',
  EN_TRAVAIL: 'En travail',
  PARTI: 'Parti',
}

/* ── Routes ─────────────────────────────────────────────────── */
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/connexion',
    REGISTER: '/auth/inscription',
    FORGOT_PASSWORD: '/auth/mot-de-passe-oublie',
  },
  DASHBOARD: '/dashboard',
  ATELIER: '/atelier',
  COMPAGNONS: '/compagnons',
  VEHICULES: '/vehicules',
  RAPPORTS: '/rapports',
  PARAMETRES: '/parametres',
  ADMIN: {
    ROOT: 'https://admin.lysmasolutions.fr',
  },
} as const

/* ── Tarifs LIVO (plans) ────────────────────────────────────── */
export const PLANS = {
  STARTER: { label: 'Starter', prix: 49, compagnons: 3 },
  PRO: { label: 'Pro', prix: 99, compagnons: 10 },
  UNLIMITED: { label: 'Unlimited', prix: 199, compagnons: Infinity },
} as const

/* ── Durées pauses standard ─────────────────────────────────── */
export const DUREES_PAUSES_MIN = {
  CAFE: 15,
  DEJEUNER: 45,
} as const
