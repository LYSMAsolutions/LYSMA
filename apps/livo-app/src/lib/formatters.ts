// ============================================================
// LIVO — Formatters de saisie
// ============================================================

// ── Immatriculation ──────────────────────────────────────────
// Formats supportés :
// FR nouvelle   : AB-123-CD
// FR ancienne   : 123 ABC 75
// EU générique  : majuscules + tirets/espaces normalisés
// International : on force juste les majuscules + trim

export function formatImmat(value: string): string {
  const v = value.toUpperCase().trim()

  // FR nouvelle (SIV depuis 2009) : AA-000-AA
  const frNew = v.replace(/[^A-Z0-9]/g, '')
  if (/^[A-Z]{2}\d{3}[A-Z]{2}$/.test(frNew)) {
    return `${frNew.slice(0,2)}-${frNew.slice(2,5)}-${frNew.slice(5,7)}`
  }

  // FR ancienne (FNI) : 0000 AA 00
  const frOld = v.replace(/[^A-Z0-9]/g, '')
  if (/^\d{1,4}[A-Z]{1,3}\d{2,3}$/.test(frOld)) {
    const match = frOld.match(/^(\d{1,4})([A-Z]{1,3})(\d{2,3})$/)
    if (match) return `${match[1]} ${match[2]} ${match[3]}`
  }

  // Sinon : majuscules + on garde les séparateurs existants
  return v.replace(/[^A-Z0-9\s\-./]/g, '')
}

// ── VIN ──────────────────────────────────────────────────────
export function formatVIN(value: string): string {
  return value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '').slice(0, 17)
}

// ── Marque / Modèle ──────────────────────────────────────────
// Force majuscule première lettre de chaque mot
export function formatVehiculeLabel(value: string): string {
  if (!value) return value
  return value
    .split(/(\s+|-)/)
    .map(word => {
      if (word === ' ' || word === '-' || word === '') return word
      return word[0]!.toUpperCase() + word.slice(1)
    })
    .join('')
}

// ── Nom de famille ───────────────────────────────────────────
// DUPONT → Dupont, dupont → Dupont, JEAN-PIERRE → Jean-Pierre
export function formatNom(value: string): string {
  if (!value) return value
  return value
    .split(/(\s+|-)/)
    .map(part => {
      if (part === ' ' || part === '-' || part === '') return part
      return part[0]!.toUpperCase() + part.slice(1).toLowerCase()
    })
    .join('')
}

// ── Prénom (nom propre) ──────────────────────────────────────
export function formatPrenom(value: string): string {
  return formatNom(value)
}

// ── Téléphone FR ─────────────────────────────────────────────
// 0600000000 → 06 00 00 00 00
// +33600000000 → +33 6 00 00 00 00
export function formatTelephone(value: string): string {
  const digits = value.replace(/\D/g, '')

  if (digits.startsWith('33') && digits.length <= 13) {
    const num = digits.slice(2)
    if (num.length <= 9) {
      const formatted = num.match(/.{1,2}/g)?.join(' ') ?? num
      return `+33 ${formatted}`
    }
  }

  if (digits.length <= 10) {
    return digits.match(/.{1,2}/g)?.join(' ') ?? digits
  }

  return value.slice(0, 18)
}
