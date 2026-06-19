export function normalizeExternalWorkOrderNumber(externalNumber: string) {
  const normalized = externalNumber.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (!normalized) throw new Error('Numéro OR invalide.')
  return normalized
}

export function externalWorkOrderUniqueWhere(garageId: string, externalNumber: string) {
  return {
    garageId_externalNumberNormalized: {
      garageId,
      externalNumberNormalized: normalizeExternalWorkOrderNumber(externalNumber),
    },
  }
}

export function shouldUpdateExternalRevision(
  currentRevision: number | null | undefined,
  incomingRevision: number
) {
  return currentRevision === null || currentRevision === undefined || incomingRevision > currentRevision
}

export function decideExternalQrAction(input: {
  exists: boolean
  variant: 'reference' | 'embedded' | null
  embeddedDetailsComplete: boolean
  currentRevision?: number | null
  incomingRevision?: number | null
}) {
  if (!input.exists) {
    if (input.variant !== 'embedded') return 'NOT_RECEIVED' as const
    return input.embeddedDetailsComplete ? 'CREATE' as const : 'INCOMPLETE' as const
  }

  if (
    input.variant === 'embedded'
    && input.embeddedDetailsComplete
    && input.incomingRevision !== null
    && input.incomingRevision !== undefined
    && shouldUpdateExternalRevision(input.currentRevision, input.incomingRevision)
  ) {
    return 'UPDATE' as const
  }

  return 'REUSE' as const
}
