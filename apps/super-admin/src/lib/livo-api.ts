const LIVO_API_URL = process.env.LIVO_API_URL ?? 'https://livo-app.com'
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? ''

function headers() {
  return {
    'Content-Type': 'application/json',
    'x-internal-api-key': INTERNAL_API_KEY,
  }
}

export type GarageStats = {
  compagnons: number
  vehicules: number
  fichesCA?: number
  fichesTotal?: number
  fichesCloturees?: number
  caTotal: number
  dernierPointage?: string | null
}

export type GarageListItem = {
  id: string
  nom: string
  adresse: string | null
  ville: string | null
  codePostal: string | null
  telephone: string | null
  email: string | null
  siret: string | null
  actif: boolean
  abonnementActif: boolean
  trialEndsAt: string | null
  joursRestants: number | null
  trialExpire: boolean
  createdAt: string
  owner: {
    id: string
    nom: string
    prenom: string
    email: string
    createdAt: string
  }
  stats: GarageStats
}

export type GarageDetail = GarageListItem & {
  compagnons: any[]
  ficheTravaux: any[]
  taux: any[]
  vehicules?: any[]
  joursOuverts?: any[]
}

export async function getLivoGarages(): Promise<GarageListItem[]> {
  try {
    const res = await fetch(`${LIVO_API_URL}/api/internal/garages`, {
      headers: headers(),
      next: { revalidate: 30 },
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const data = await res.json()

    return data.garages ?? []
  } catch (err) {
    console.error('LIVO API error:', err)
    return []
  }
}

export async function getLivoGarage(id: string): Promise<GarageDetail | null> {
  try {
    const res = await fetch(`${LIVO_API_URL}/api/internal/garages/${id}`, {
      headers: headers(),
      next: { revalidate: 10 },
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()

    return data.garage ?? null
  } catch (err) {
    console.error('LIVO API error:', err)
    return null
  }
}

export async function updateLivoGarage(
  id: string,
  data: Record<string, unknown>
) {
  const res = await fetch(`${LIVO_API_URL}/api/internal/garages/${id}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error('Erreur mise à jour')
  }

  return res.json()
}

export async function getLivoTrash() {
  try {
    const res = await fetch(`${LIVO_API_URL}/api/internal/trash`, {
      headers: headers(),
      next: { revalidate: 0 },
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return data.items ?? []
  } catch (err) {
    console.error('LIVO trash API error:', err)
    return []
  }
}

export type DemandeIntegration = {
  id: string
  nomLogiciel: string
  nomEditeur: string | null
  contactEditeur: string | null
  identifiantGarage: string
  message: string | null
  statut: 'EN_ATTENTE' | 'APPROUVEE' | 'REFUSEE'
  noteAdmin: string | null
  createdAt: string
  garage: {
    id: string
    nom: string
    ville: string | null
    telephone: string | null
    email: string | null
    owner: { nom: string; prenom: string; email: string }
  }
}

export async function getLivoDemandes(statut?: string): Promise<DemandeIntegration[]> {
  try {
    const url = `${LIVO_API_URL}/api/internal/integrations/demandes${statut ? `?statut=${statut}` : ''}`
    const res = await fetch(url, { headers: headers(), next: { revalidate: 0 } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return data.demandes ?? []
  } catch (err) {
    console.error('LIVO demandes API error:', err)
    return []
  }
}

export async function traiteLivoDemande(id: string, statut: 'APPROUVEE' | 'REFUSEE', noteAdmin?: string) {
  const res = await fetch(`${LIVO_API_URL}/api/internal/integrations/demandes/${id}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ statut, noteAdmin: noteAdmin || null }),
  })
  if (!res.ok) throw new Error(`Erreur traitement demande: HTTP ${res.status}`)
  return res.json()
}

export async function restoreLivoTrashItem(type: string, id: string, userId?: string) {
  const res = await fetch(`${LIVO_API_URL}/api/internal/trash/${type}/${id}/restore`, {
    method: 'POST',
    headers: {
      ...headers(),
      ...(userId ? { 'x-super-admin-user-id': userId } : {}),
    },
  })

  if (!res.ok) throw new Error(`Erreur restauration LIVO ${res.status}`)
  return res.json()
}
