import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { decryptSecret } from '@/lib/security/crypto'
import { isInternalApiAuthorized } from '@/lib/security/internal-api'
import {
  authenticateExternalIntegrationRequest,
  hashExternalRequest,
} from '@/lib/security/external-integration'
import {
  compactExternalWorkOrderData,
  externalWorkOrderImportSchema,
  externalWorkOrderPayloadSchema,
  mapExternalWorkOrderLineType,
  mapExternalWorkOrderStatus,
  summarizeExternalWorkOrderLines,
} from '@/lib/external-work-orders'
import { buildSignedExternalWorkOrderQrPayload } from '@/lib/work-order-qr'
import {
  externalWorkOrderUniqueWhere,
  normalizeExternalWorkOrderNumber,
  shouldUpdateExternalRevision,
} from '@/lib/external-work-order-key'

const legacyUpsertSchema = externalWorkOrderPayloadSchema.extend({
  garageId: z.string().min(1),
})

function apiError(status: number, code: string, error: string, details?: unknown) {
  return NextResponse.json({ success: false, code, error, ...(details ? { details } : {}) }, { status })
}

function toVehicleLabel(make?: string | null, model?: string | null) {
  return [make, model].filter(Boolean).join(' ') || null
}

function toSafeLogPayload(input: {
  schemaVersion?: string
  eventType?: string
  externalId?: string
  externalNumber?: string
  lineCount?: number
}) {
  return {
    schemaVersion: input.schemaVersion ?? null,
    eventType: input.eventType ?? null,
    externalId: input.externalId ?? null,
    externalNumber: input.externalNumber ?? null,
    lineCount: input.lineCount ?? 0,
  }
}

async function buildPartnerResponse(
  integration: Awaited<ReturnType<typeof prisma.externalGarageIntegration.findFirst>> & {
    partner?: { key: string } | null
  },
  order: { id: string; externalId: string | null; externalNumber: string; externalRevision: number | null; status: string },
  replayed: boolean
) {
  if (!integration?.partner || !order.externalId || order.externalRevision === null) {
    throw new Error('Impossible de générer le QR signé de cet OR.')
  }

  const qrSecret = decryptSecret(integration.qrSecretEncrypted)
  const qrPayload = buildSignedExternalWorkOrderQrPayload({
    v: 1,
    type: 'external_or',
    variant: 'reference',
    partner: integration.partner.key,
    garage: integration.externalGarageId,
    order: order.externalId,
    number: order.externalNumber,
    revision: order.externalRevision,
    issuedAt: Math.floor(Date.now() / 1000),
    keyId: integration.qrKeyId,
  }, qrSecret)

  return NextResponse.json({
    success: true,
    replayed,
    order: {
      id: order.id,
      externalId: order.externalId,
      externalNumber: order.externalNumber,
      revision: order.externalRevision,
      status: order.status,
    },
    qr: {
      format: 'LIVO_OR_V1',
      payload: qrPayload,
    },
  }, { status: replayed ? 200 : 201 })
}

async function logAuthenticationFailure(
  integration: { id: string; garageId: string } | undefined,
  message: string
) {
  if (!integration) return
  await prisma.externalWorkOrderSyncLog.create({
    data: {
      garageId: integration.garageId,
      integrationId: integration.id,
      action: 'IMPORT_AUTHENTICATION_FAILED',
      status: 'ERROR',
      message,
      signatureValid: false,
    },
  }).catch(() => undefined)
}

async function handlePartnerImport(req: NextRequest, rawBody: string) {
  const startedAt = Date.now()
  const auth = await authenticateExternalIntegrationRequest(req, rawBody)
  if (!auth.success) {
    await logAuthenticationFailure(auth.integration, auth.error)
    return apiError(auth.status, 'PARTNER_AUTH_FAILED', auth.error)
  }

  let rawPayload: unknown
  try {
    rawPayload = JSON.parse(rawBody)
  } catch {
    return apiError(400, 'INVALID_JSON', 'Le contenu envoyé n’est pas un JSON valide.')
  }

  const parsed = externalWorkOrderImportSchema.safeParse(rawPayload)
  if (!parsed.success) {
    await prisma.externalWorkOrderSyncLog.create({
      data: {
        garageId: auth.integration.garageId,
        integrationId: auth.integration.id,
        action: 'IMPORT_VALIDATION_FAILED',
        status: 'ERROR',
        message: 'Le format de l’OR reçu est invalide.',
        requestHash: auth.requestHash,
        signatureValid: true,
        durationMs: Date.now() - startedAt,
      },
    }).catch(() => undefined)
    return apiError(400, 'INVALID_WORK_ORDER', 'Les informations de l’OR sont invalides.', parsed.error.flatten())
  }

  const payload = parsed.data
  if (payload.garageExternalId !== auth.integration.externalGarageId) {
    return apiError(403, 'GARAGE_MISMATCH', 'Cet OR ne correspond pas au garage authentifié.')
  }

  const existingImport = await prisma.externalWorkOrderSyncLog.findFirst({
    where: {
      integrationId: auth.integration.id,
      idempotencyKey: auth.idempotencyKey,
    },
    include: { externalWorkOrder: true },
  })

  if (existingImport) {
    if (existingImport.requestHash !== auth.requestHash) {
      return apiError(409, 'IDEMPOTENCY_CONFLICT', 'Cette clé de rejeu a déjà été utilisée avec un autre contenu.')
    }
    if (existingImport.status === 'SUCCESS' && existingImport.externalWorkOrder) {
      return buildPartnerResponse(auth.integration, existingImport.externalWorkOrder, true)
    }
    return apiError(409, 'IMPORT_ALREADY_PROCESSED', 'Cet import a déjà été reçu.')
  }

  const workOrder = payload.workOrder
  const functionalWhere = externalWorkOrderUniqueWhere(auth.integration.garageId, workOrder.number)
  const safePayload = toSafeLogPayload({
    schemaVersion: payload.schemaVersion,
    eventType: payload.eventType,
    externalId: workOrder.externalId,
    externalNumber: workOrder.number,
    lineCount: workOrder.lines.length,
  })

  const current = await prisma.externalWorkOrder.findUnique({
    where: functionalWhere,
    select: {
      id: true,
      integrationId: true,
      externalId: true,
      externalNumber: true,
      externalRevision: true,
      status: true,
    },
  })

  if (
    current
    && current.integrationId
    && current.externalId
    && !shouldUpdateExternalRevision(current.externalRevision, workOrder.revision)
  ) {
    await prisma.externalWorkOrderSyncLog.create({
      data: {
        garageId: auth.integration.garageId,
        integrationId: auth.integration.id,
        externalWorkOrderId: current.id,
        action: 'IMPORT_REVISION_IGNORED',
        status: 'SUCCESS',
        message: current.externalRevision === workOrder.revision
          ? 'Cette version de l’OR est déjà enregistrée.'
          : 'Une version plus récente de cet OR est déjà enregistrée.',
        eventId: payload.eventId,
        idempotencyKey: auth.idempotencyKey,
        nonce: auth.nonce,
        requestHash: auth.requestHash,
        signatureValid: true,
        externalRevision: workOrder.revision,
        durationMs: Date.now() - startedAt,
        payload: safePayload,
      },
    })
    return buildPartnerResponse(auth.integration, current, true)
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const existing = await tx.externalWorkOrder.findUnique({ where: functionalWhere })

      const mappedStatus = mapExternalWorkOrderStatus(workOrder.status)
      const operation = summarizeExternalWorkOrderLines(workOrder.lines)
        || existing?.operation
        || 'Travaux reçus depuis le logiciel atelier.'
      const commonData = {
        source: 'API_EXTERNE' as const,
        integrationId: auth.integration.id,
        externalId: workOrder.externalId,
        externalNumber: workOrder.number,
        externalNumberNormalized: normalizeExternalWorkOrderNumber(workOrder.number),
        externalRevision: workOrder.revision,
        sourceSoftware: auth.integration.partner.name,
        clientName: workOrder.customer?.displayName || null,
        vehicleLabel: toVehicleLabel(workOrder.vehicle?.make, workOrder.vehicle?.model),
        immatriculation: workOrder.vehicle?.registration || null,
        vin: workOrder.vehicle?.vin || null,
        operation,
        plannedHours: workOrder.totals.plannedHours ?? null,
        soldHours: workOrder.totals.soldHours ?? null,
        billedHours: workOrder.totals.billedHours ?? null,
        soldAmountHT: workOrder.totals.billedAmountHT ?? null,
        billedAmountHT: workOrder.totals.billedAmountHT ?? null,
        laborAmountHT: workOrder.totals.laborAmountHT ?? null,
        tauxHoraire: workOrder.totals.billingHourlyRateHT ?? null,
        billingHourlyRateHT: workOrder.totals.billingHourlyRateHT ?? null,
        internalLaborCostRateHT: workOrder.totals.internalLaborCostRateHT ?? null,
        status: mappedStatus,
        openedAt: workOrder.openedAt ? new Date(workOrder.openedAt) : existing?.openedAt ?? new Date(),
        closedAt: ['CLOTURE', 'ANNULE'].includes(mappedStatus)
          ? new Date(workOrder.closedAt ?? workOrder.updatedAt ?? payload.occurredAt)
          : null,
        sourceUpdatedAt: new Date(workOrder.updatedAt ?? payload.occurredAt),
        lastImportedAt: new Date(),
        importMetadata: {
          schemaVersion: payload.schemaVersion,
          eventId: payload.eventId,
          eventType: payload.eventType,
        },
      }

      const importedLines = workOrder.lines.map((line) => ({
        externalLineId: line.externalLineId,
        position: line.position,
        type: mapExternalWorkOrderLineType(line.type),
        code: line.code || null,
        label: line.label,
        description: line.description || null,
        quantity: line.quantity ?? null,
        unit: line.unit || null,
        plannedHours: line.plannedHours ?? null,
        soldHours: line.soldHours ?? null,
        billedHours: line.billedHours ?? null,
        unitPriceHT: line.unitPriceHT ?? null,
        billedAmountHT: line.billedAmountHT ?? null,
        costAmountHT: line.costAmountHT ?? null,
        billingHourlyRateHT: line.billingHourlyRateHT ?? null,
        metadata: line.metadata as Prisma.InputJsonValue | undefined,
      }))

      const base = await tx.externalWorkOrder.upsert({
        where: functionalWhere,
        create: {
          garageId: auth.integration.garageId,
          ...commonData,
          lines: importedLines.length ? { create: importedLines } : undefined,
        },
        update: {},
      })
      const applyIncomingRevision = !base.integrationId
        || !base.externalId
        || shouldUpdateExternalRevision(base.externalRevision, workOrder.revision)
      const saved = applyIncomingRevision
        ? await tx.externalWorkOrder.update({ where: { id: base.id }, data: commonData })
        : base

      if (applyIncomingRevision) {
        const importedLineIds = importedLines.map((line) => line.externalLineId)
        await tx.externalWorkOrderLine.deleteMany({
          where: {
            externalWorkOrderId: saved.id,
            ...(importedLineIds.length ? { externalLineId: { notIn: importedLineIds } } : {}),
          },
        })

        for (const line of importedLines) {
          const { externalLineId, ...lineData } = line
          await tx.externalWorkOrderLine.upsert({
            where: {
              externalWorkOrderId_externalLineId: {
                externalWorkOrderId: saved.id,
                externalLineId,
              },
            },
            create: {
              externalWorkOrderId: saved.id,
              externalLineId,
              ...lineData,
            },
            update: lineData,
          })
        }
      }

      await tx.externalGarageIntegration.update({
        where: { id: auth.integration.id },
        data: { lastImportedAt: new Date() },
      })

      await tx.externalWorkOrderSyncLog.create({
        data: {
          garageId: auth.integration.garageId,
          integrationId: auth.integration.id,
          externalWorkOrderId: saved.id,
          action: existing
            ? applyIncomingRevision ? 'UPDATE_FROM_PARTNER_API' : 'REUSE_FROM_PARTNER_API'
            : 'CREATE_FROM_PARTNER_API',
          status: 'SUCCESS',
          message: existing
            ? applyIncomingRevision ? 'OR reçu et mis à jour.' : 'OR déjà reçu, version conservée.'
            : 'OR reçu dans LIVO.',
          eventId: payload.eventId,
          idempotencyKey: auth.idempotencyKey,
          nonce: auth.nonce,
          requestHash: auth.requestHash,
          signatureValid: true,
          externalRevision: workOrder.revision,
          durationMs: Date.now() - startedAt,
          payload: safePayload,
        },
      })

      return saved
    })

    return buildPartnerResponse(auth.integration, order, false)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const duplicate = await prisma.externalWorkOrderSyncLog.findFirst({
        where: { integrationId: auth.integration.id, idempotencyKey: auth.idempotencyKey },
        include: { externalWorkOrder: true },
      })
      if (duplicate?.requestHash === auth.requestHash && duplicate.status === 'SUCCESS' && duplicate.externalWorkOrder) {
        return buildPartnerResponse(auth.integration, duplicate.externalWorkOrder, true)
      }
      const reused = await prisma.externalWorkOrder.findUnique({ where: functionalWhere })
      if (reused) return buildPartnerResponse(auth.integration, reused, true)
      return apiError(409, 'REPLAY_DETECTED', 'Cette requête a déjà été reçue.')
    }

    await prisma.externalWorkOrderSyncLog.create({
      data: {
        garageId: auth.integration.garageId,
        integrationId: auth.integration.id,
        externalWorkOrderId: current?.id ?? null,
        action: 'IMPORT_FAILED',
        status: 'ERROR',
        message: 'L’import de l’OR a échoué.',
        eventId: payload.eventId,
        requestHash: auth.requestHash,
        signatureValid: true,
        externalRevision: workOrder.revision,
        durationMs: Date.now() - startedAt,
        payload: safePayload,
      },
    }).catch(() => undefined)

    return apiError(500, 'IMPORT_FAILED', 'L’import de l’OR a échoué.')
  }
}

async function handleLegacyImport(req: NextRequest, rawBody: string) {
  if (process.env.ALLOW_LEGACY_WORK_ORDER_API !== 'true' || !isInternalApiAuthorized(req)) {
    return apiError(401, 'PARTNER_AUTH_REQUIRED', 'Authentification partenaire requise.')
  }

  let body: unknown
  try {
    body = JSON.parse(rawBody)
  } catch {
    return apiError(400, 'INVALID_JSON', 'Le contenu envoyé n’est pas un JSON valide.')
  }

  const parsed = legacyUpsertSchema.safeParse(body)
  if (!parsed.success) return apiError(400, 'INVALID_LEGACY_PAYLOAD', 'Les informations de l’OR sont invalides.')

  const { garageId, ...payload } = parsed.data
  const garage = await prisma.garage.findUnique({ where: { id: garageId }, select: { id: true } })
  if (!garage) return apiError(404, 'GARAGE_NOT_FOUND', 'Garage introuvable.')

  const compactData = compactExternalWorkOrderData(payload)
  const legacyFunctionalWhere = externalWorkOrderUniqueWhere(garageId, payload.externalNumber)
  const order = await prisma.$transaction(async (tx) => {
    const existing = await tx.externalWorkOrder.findUnique({ where: legacyFunctionalWhere })
    const saved = existing
      ? await tx.externalWorkOrder.update({
          where: { id: existing.id },
          data: {
            ...compactData,
            source: 'API_EXTERNE',
            billedAmountHT: payload.soldAmountHT ?? existing.billedAmountHT,
            operation: payload.operation || existing.operation || 'OR reçu depuis le logiciel atelier.',
            lastImportedAt: new Date(),
            importMetadata: { legacyApi: true, importedAt: new Date().toISOString() },
          },
        })
      : await tx.externalWorkOrder.create({
          data: {
            garageId,
            source: 'API_EXTERNE',
            externalNumber: payload.externalNumber,
            externalNumberNormalized: normalizeExternalWorkOrderNumber(payload.externalNumber),
            ...compactData,
            billedAmountHT: payload.soldAmountHT ?? null,
            operation: payload.operation || 'OR reçu depuis le logiciel atelier.',
            lastImportedAt: new Date(),
            importMetadata: { legacyApi: true, importedAt: new Date().toISOString() },
          },
        })

    await tx.externalWorkOrderSyncLog.create({
      data: {
        garageId,
        externalWorkOrderId: saved.id,
        action: existing ? 'UPDATE_FROM_LEGACY_API' : 'CREATE_FROM_LEGACY_API',
        status: 'SUCCESS',
        message: 'OR reçu via le format historique.',
        requestHash: hashExternalRequest(rawBody),
        signatureValid: true,
        legacyFormat: true,
        payload: {
          externalNumber: payload.externalNumber,
          sourceSoftware: payload.sourceSoftware || null,
        },
      },
    })
    return saved
  })

  return NextResponse.json({
    success: true,
    legacy: true,
    warning: 'Format historique à remplacer par le contrat partenaire signé.',
    order: { id: order.id, externalNumber: order.externalNumber, status: order.status },
    qrPayload: payload.externalNumber,
  }, { status: 201 })
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  if (req.headers.has('x-livo-partner-key')) {
    return handlePartnerImport(req, rawBody)
  }
  return handleLegacyImport(req, rawBody)
}
