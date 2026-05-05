/* ============================================================
   LIVO — Types globaux
   ============================================================ */

/* ── Entités métier ─────────────────────────────────────────── */
export type Role = 'SUPER_ADMIN' | 'OWNER' | 'MANAGER' | 'COMPAGNON'

export type TauxType = 'T1' | 'T2' | 'T3' | 'T4' | 'CARROSSERIE' | 'PEINTURE' | 'AUTRE'

export type StatutOR =
  | 'BROUILLON'
  | 'EN_ATTENTE'
  | 'EN_COURS'
  | 'EN_PAUSE'
  | 'TERMINE'
  | 'FACTURE'
  | 'ANNULE'

export type StatutPointage =
  | 'ABSENT'
  | 'ARRIVE'
  | 'PAUSE_CAFE'
  | 'PAUSE_DEJEUNER'
  | 'EN_TRAVAIL'
  | 'PARTI'

export type TypeAbsence =
  | 'CONGE_PAYE'
  | 'RTT'
  | 'ARRET_MALADIE'
  | 'FORMATION'
  | 'CONGE_SANS_SOLDE'
  | 'AUTRE'

export type StatutGarage = 'OUVERT' | 'FERME' | 'PAUSE'

/* ── Utilitaires ────────────────────────────────────────────── */
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type AsyncFn<T = void> = () => Promise<T>

/* ── API responses ──────────────────────────────────────────── */
export type ApiSuccess<T> = {
  success: true
  data: T
}

export type ApiError = {
  success: false
  error: string
  code?: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

/* ── Pagination ─────────────────────────────────────────────── */
export type PaginationParams = {
  page: number
  limit: number
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
