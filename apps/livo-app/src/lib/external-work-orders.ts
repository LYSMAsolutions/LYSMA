import { z } from 'zod'

export const externalWorkOrderPayloadSchema = z.object({
  externalNumber: z.string().trim().min(1).max(80),
  sourceSoftware: z.string().trim().max(120).optional().nullable(),
  clientName: z.string().trim().max(160).optional().nullable(),
  vehicleLabel: z.string().trim().max(160).optional().nullable(),
  immatriculation: z.string().trim().max(40).optional().nullable(),
  vin: z.string().trim().max(80).optional().nullable(),
  operation: z.string().trim().max(3000).optional().nullable(),
  soldHours: z.coerce.number().min(0).max(999).optional().nullable(),
  soldAmountHT: z.coerce.number().min(0).max(999999).optional().nullable(),
})

export type ExternalWorkOrderPayload = z.infer<typeof externalWorkOrderPayloadSchema>

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readString(source: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = source[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  }
  return undefined
}

function readNumber(source: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = source[key]
    if (typeof value === 'number' && Number.isFinite(value)) return value
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value.replace(',', '.'))
      if (Number.isFinite(parsed)) return parsed
    }
  }
  return undefined
}

function readNestedRecord(source: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = source[key]
    if (isRecord(value)) return value
  }
  return undefined
}

function readOperation(source: UnknownRecord) {
  const direct = readString(source, ['operation', 'operations', 'travaux', 'repairs', 'works', 'description'])
  if (direct) return direct

  for (const key of ['repairLines', 'workLines', 'operationsLines', 'lines']) {
    const value = source[key]
    if (Array.isArray(value)) {
      const lines = value
        .map((item) => {
          if (typeof item === 'string') return item.trim()
          if (isRecord(item)) {
            return readString(item, ['label', 'name', 'description', 'operation'])
          }
          return undefined
        })
        .filter(Boolean)

      if (lines.length) return lines.join('\n')
    }
  }

  return undefined
}

function normalizeFromRecord(source: UnknownRecord): Partial<ExternalWorkOrderPayload> {
  const client = readNestedRecord(source, ['client', 'customer'])
  const vehicle = readNestedRecord(source, ['vehicle', 'vehicule', 'car'])

  const clientName =
    readString(source, ['clientName', 'customerName', 'nomClient']) ??
    (client ? readString(client, ['name', 'fullName', 'nom', 'label']) : undefined)

  const vehicleLabel =
    readString(source, ['vehicleLabel', 'vehicule', 'vehicleName', 'vehiculeLabel']) ??
    (vehicle
      ? readString(vehicle, ['label', 'name', 'modeleComplet']) ??
        [readString(vehicle, ['brand', 'marque']), readString(vehicle, ['model', 'modele'])]
          .filter(Boolean)
          .join(' ')
      : undefined)

  return {
    externalNumber: readString(source, [
      'externalNumber',
      'workOrderNumber',
      'orNumber',
      'numeroOR',
      'numeroOr',
      'numero',
      'number',
      'id',
    ]),
    sourceSoftware: readString(source, ['sourceSoftware', 'software', 'source', 'provider']),
    clientName,
    vehicleLabel: vehicleLabel || undefined,
    immatriculation:
      readString(source, ['immatriculation', 'registration', 'plate', 'licensePlate']) ??
      (vehicle ? readString(vehicle, ['immatriculation', 'registration', 'plate', 'licensePlate']) : undefined),
    vin:
      readString(source, ['vin', 'VIN', 'serialNumber', 'numeroSerie']) ??
      (vehicle ? readString(vehicle, ['vin', 'VIN', 'serialNumber', 'numeroSerie']) : undefined),
    operation: readOperation(source),
    soldHours: readNumber(source, ['soldHours', 'tempsVendu', 'tempsFacture', 'billedHours']),
    soldAmountHT: readNumber(source, ['soldAmountHT', 'montantHT', 'amountHT', 'billedAmountHT']),
  }
}

function normalizeUrlPayload(raw: string) {
  try {
    const url = new URL(raw)
    const params = Object.fromEntries(url.searchParams.entries())
    return normalizeFromRecord(params)
  } catch {
    return null
  }
}

export function parseExternalWorkOrderQrPayload(rawPayload: string) {
  const raw = rawPayload.trim()
  if (!raw) {
    return { success: false as const, error: 'QR code vide.' }
  }

  let normalized: Partial<ExternalWorkOrderPayload> | null = null

  try {
    const parsed = JSON.parse(raw)
    if (isRecord(parsed)) normalized = normalizeFromRecord(parsed)
  } catch {
    normalized = normalizeUrlPayload(raw)
  }

  if (!normalized && raw.length <= 80) {
    normalized = { externalNumber: raw }
  }

  const result = externalWorkOrderPayloadSchema.safeParse(normalized)
  if (!result.success) {
    return { success: false as const, error: 'QR code OR non reconnu.' }
  }

  return { success: true as const, data: result.data }
}

export function buildExternalWorkOrderQrPayload(input: ExternalWorkOrderPayload) {
  const payload: Record<string, unknown> = {
    type: 'LIVO_WORK_ORDER',
    version: 1,
  }

  for (const [key, value] of Object.entries(input)) {
    if (value !== null && value !== undefined && value !== '') {
      payload[key] = value
    }
  }

  return JSON.stringify(payload)
}

export function compactExternalWorkOrderData(input: Partial<ExternalWorkOrderPayload>) {
  const data: Record<string, string | number> = {}

  for (const [key, value] of Object.entries(input)) {
    if (value !== null && value !== undefined && value !== '') {
      data[key] = value
    }
  }

  return data
}
