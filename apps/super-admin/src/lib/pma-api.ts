export type PmaAccountRequest = {
  id: string
  type: string
  sourceTool: string
  company: string
  sender: string
  email: string
  phone: string
  message: string
  priority: string
  status: string
  createdAt: string
}

export type PmaCustomer = {
  id: string
  company_name: string
  contact_first_name?: string | null
  contact_last_name?: string | null
  email: string
  phone?: string | null
  status: string
  tools_enabled: unknown
  created_at: string
}

export function getPmaBaseUrl() {
  return (process.env.PMA_PORTAL_URL || 'http://localhost:3001').replace(/\/$/, '')
}

export async function fetchPmaAccountRequests() {
  try {
    const res = await fetch(`${getPmaBaseUrl()}/api/account-requests`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      return { success: false as const, requests: [] as PmaAccountRequest[], error: `PMA ${res.status}` }
    }

    const data = await res.json()
    return {
      success: true as const,
      requests: (data.requests || []) as PmaAccountRequest[],
      error: null,
    }
  } catch (error) {
    return {
      success: false as const,
      requests: [] as PmaAccountRequest[],
      error: error instanceof Error ? error.message : 'pma_unreachable',
    }
  }
}

export async function fetchPmaCustomers() {
  try {
    const res = await fetch(`${getPmaBaseUrl()}/api/lysma-customers`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      return { success: false as const, customers: [] as PmaCustomer[], error: `PMA ${res.status}` }
    }

    const data = await res.json()
    return {
      success: true as const,
      customers: (data.customers || []) as PmaCustomer[],
      error: null,
    }
  } catch (error) {
    return {
      success: false as const,
      customers: [] as PmaCustomer[],
      error: error instanceof Error ? error.message : 'pma_unreachable',
    }
  }
}

function internalHeaders(userId?: string) {
  return {
    'Content-Type': 'application/json',
    'x-internal-api-key': process.env.INTERNAL_API_KEY ?? '',
    ...(userId ? { 'x-super-admin-user-id': userId } : {}),
  }
}

export async function fetchPmaTrash() {
  try {
    const res = await fetch(`${getPmaBaseUrl()}/api/internal/trash`, {
      headers: internalHeaders(),
      cache: 'no-store',
    })

    if (!res.ok) {
      return { success: false as const, items: [] as unknown[], error: `PMA ${res.status}` }
    }

    const data = await res.json()
    return {
      success: true as const,
      items: data.items || [],
      error: null,
    }
  } catch (error) {
    return {
      success: false as const,
      items: [] as unknown[],
      error: error instanceof Error ? error.message : 'pma_unreachable',
    }
  }
}

export async function restorePmaTrashItem(type: string, id: string, userId?: string) {
  const res = await fetch(`${getPmaBaseUrl()}/api/internal/trash/${type}/${id}/restore`, {
    method: 'POST',
    headers: internalHeaders(userId),
  })

  if (!res.ok) throw new Error(`Erreur restauration PMA ${res.status}`)
  return res.json()
}
