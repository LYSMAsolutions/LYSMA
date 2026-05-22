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
