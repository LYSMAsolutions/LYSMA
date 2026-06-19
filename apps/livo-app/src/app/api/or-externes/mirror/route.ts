import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma, type ExternalPointageStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getPointageAccess } from '@/lib/access'
import { decryptSecret } from '@/lib/security/crypto'
import {
  mapExternalWorkOrderLineType,
  parseExternalWorkOrderQrPayload,
} from '@/lib/external-work-orders'
import {
  type ExternalQrDetails,
  type ExternalQrIdentity,
  isCurrentExternalQrPayload,
  readExternalWorkOrderQrIdentity,
  validateEmbeddedExternalQrDetails,
  verifyExternalWorkOrderQrPayload,
} from '@/lib/work-order-qr'
import {
  decideExternalQrAction,
  externalWorkOrderUniqueWhere,
  normalizeExternalWorkOrderNumber,
  shouldUpdateExternalRevision,
} from '@/lib/external-work-order-key'

const schema = z.object({
  compagnonId: z.string().min(1),
  externalNumber: z.string().trim().max(80).optional().nullable(),
  qrPayload: z.string().trim().max(4000).optional().nullable(),
}).refine((value) => Boolean(value.externalNumber?.trim() || value.qrPayload?.trim()), {
  message: 'Un numéro OR ou un QR est requis.',
})

const ACTIVE_POINTAGE_STATUSES: ExternalPointageStatus[] = ['EN_COURS', 'EN_PAUSE']

function embeddedLineData(details: ExternalQrDetails) {
  return details.lines.map((line, index) => ({
    externalLineId: line.id || `qr-${index + 1}`,
    position: index,
    type: mapExternalWorkOrderLineType(line.type),
    label: line.label,
    plannedHours: line.plannedHours ?? null,
    soldHours: line.soldHours ?? null,
    billedHours: line.billedHours ?? null,
    billedAmountHT: line.billedAmountHT ?? null,
  }))
}

function embeddedOrderData(input: {
  identity: ExternalQrIdentity
  details: ExternalQrDetails
  integrationId: string
  sourceSoftware: string
}) {
  const { identity, details } = input
  return {
    integrationId: input.integrationId,
    externalId: identity.order,
    externalNumber: identity.number,
    externalNumberNormalized: normalizeExternalWorkOrderNumber(identity.number),
    externalRevision: identity.revision,
    sourceSoftware: input.sourceSoftware,
    clientName: details.clientName?.trim() || null,
    vehicleLabel: details.vehicleLabel?.trim() || null,
    immatriculation: details.immatriculation?.trim() || null,
    operation: details.operation?.trim()
      || details.lines.map((line) => line.label).join('\n')
      || 'Travaux reçus depuis le QR de l’OR.',
    plannedHours: details.plannedHours ?? null,
    soldHours: details.soldHours ?? null,
    billedHours: details.billedHours ?? null,
    soldAmountHT: details.billedAmountHT ?? null,
    billedAmountHT: details.billedAmountHT ?? null,
    laborAmountHT: details.laborAmountHT ?? null,
    tauxHoraire: details.billingHourlyRateHT ?? null,
    billingHourlyRateHT: details.billingHourlyRateHT ?? null,
    sourceUpdatedAt: new Date(identity.issuedAt * 1000),
    importMetadata: {
      createdFrom: 'embedded_qr',
      qrVariant: 'embedded',
      keyId: identity.keyId,
    },
  }
}

async function createOrUpdateFromEmbeddedQr(input: {
  garageId: string
  identity: ExternalQrIdentity
  details: ExternalQrDetails
  integrationId: string
  sourceSoftware: string
}) {
  const functionalWhere = externalWorkOrderUniqueWhere(input.garageId, input.identity.number)
  const data = embeddedOrderData(input)
  const lines = embeddedLineData(input.details)

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(async (tx) => {
        const before = await tx.externalWorkOrder.findUnique({ where: functionalWhere })

        if (!before) {
          const createdOrReused = await tx.externalWorkOrder.upsert({
            where: functionalWhere,
            create: {
              garageId: input.garageId,
              source: 'QR_CODE',
              status: 'OUVERT',
              ...data,
              lines: lines.length ? { create: lines } : undefined,
            },
            update: {},
          })

          if (!shouldUpdateExternalRevision(createdOrReused.externalRevision, input.identity.revision)) {
            return { order: createdOrReused, action: createdOrReused.source === 'QR_CODE' ? 'CREATED_OR_REUSED' : 'REUSED' }
          }
        }

        const current = before ?? await tx.externalWorkOrder.findUniqueOrThrow({ where: functionalWhere })
        if (!shouldUpdateExternalRevision(current.externalRevision, input.identity.revision)) {
          return { order: current, action: 'REUSED' as const }
        }

        const updated = await tx.externalWorkOrder.update({
          where: { id: current.id },
          data,
        })

        const lineIds = lines.map((line) => line.externalLineId)
        await tx.externalWorkOrderLine.deleteMany({
          where: {
            externalWorkOrderId: current.id,
            ...(lineIds.length ? { externalLineId: { notIn: lineIds } } : {}),
          },
        })
        for (const line of lines) {
          const { externalLineId, ...lineData } = line
          await tx.externalWorkOrderLine.upsert({
            where: {
              externalWorkOrderId_externalLineId: {
                externalWorkOrderId: current.id,
                externalLineId,
              },
            },
            create: { externalWorkOrderId: current.id, externalLineId, ...lineData },
            update: lineData,
          })
        }

        return { order: updated, action: 'UPDATED' as const }
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
    } catch (error) {
      const retryable = error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034'
      if (!retryable || attempt === 2) throw error
    }
  }

  throw new Error('Impossible de créer ou retrouver cet OR.')
}

export async function POST(req: NextRequest) {
  const access = await getPointageAccess()
  if (!access) return NextResponse.json({ error: 'Session atelier expirée.' }, { status: 401 })

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: 'Numéro OR ou QR requis.' }, { status: 400 })

  const compagnon = await prisma.compagnon.findFirst({
    where:
      access.mode === 'admin'
        ? { id: parsed.data.compagnonId, actif: true, garage: { ownerId: access.userId } }
        : { id: parsed.data.compagnonId, garageId: access.garageId, actif: true },
    select: { id: true, garageId: true },
  })

  if (!compagnon || (access.mode === 'atelier' && access.compagnonId !== compagnon.id)) {
    return NextResponse.json({ error: 'Compagnon introuvable.' }, { status: 404 })
  }

  const qrPayload = parsed.data.qrPayload?.trim()
  let externalNumber = parsed.data.externalNumber?.trim() || null
  let verifiedIdentity: ExternalQrIdentity | null = null
  let integration: {
    id: string
    qrSecretEncrypted: string
    partner: { name: string }
  } | null = null
  let legacyFormat = false

  if (qrPayload && isCurrentExternalQrPayload(qrPayload)) {
    const identityResult = readExternalWorkOrderQrIdentity(qrPayload)
    if (!identityResult.success) {
      return NextResponse.json({ error: 'QR invalide.' }, { status: 400 })
    }

    integration = await prisma.externalGarageIntegration.findFirst({
      where: {
        garageId: compagnon.garageId,
        externalGarageId: identityResult.identity.garage,
        qrKeyId: identityResult.identity.keyId,
        active: true,
        partner: { key: identityResult.identity.partner, active: true },
      },
      select: {
        id: true,
        qrSecretEncrypted: true,
        partner: { select: { name: true } },
      },
    })

    if (!integration) return NextResponse.json({ error: 'QR invalide.' }, { status: 400 })

    let secret: string
    try {
      secret = decryptSecret(integration.qrSecretEncrypted)
    } catch {
      return NextResponse.json({ error: 'QR momentanément indisponible.' }, { status: 503 })
    }

    const maxAgeSeconds = Number(process.env.EXTERNAL_QR_MAX_AGE_SECONDS || 90 * 24 * 60 * 60)
    const verified = verifyExternalWorkOrderQrPayload(qrPayload, secret, { maxAgeSeconds })
    if (!verified.success) {
      await prisma.externalWorkOrderSyncLog.create({
        data: {
          garageId: compagnon.garageId,
          integrationId: integration.id,
          action: 'QR_SCAN_REJECTED',
          status: 'ERROR',
          message: verified.error,
          signatureValid: verified.error === 'QR expiré.',
        },
      }).catch(() => undefined)
      return NextResponse.json({ error: verified.error === 'QR expiré.' ? 'QR expiré.' : 'QR invalide.' }, { status: 400 })
    }

    verifiedIdentity = verified.identity
    externalNumber = verified.identity.number
  } else if (qrPayload) {
    const legacy = parseExternalWorkOrderQrPayload(qrPayload)
    if (!legacy.success) return NextResponse.json({ error: 'QR invalide.' }, { status: 400 })
    externalNumber = legacy.data.externalNumber
    legacyFormat = true
  }

  if (!externalNumber) return NextResponse.json({ error: 'Numéro OR requis.' }, { status: 400 })

  let functionalWhere: ReturnType<typeof externalWorkOrderUniqueWhere>
  try {
    functionalWhere = externalWorkOrderUniqueWhere(compagnon.garageId, externalNumber)
  } catch {
    return NextResponse.json({ error: qrPayload ? 'QR invalide.' : 'Numéro OR invalide.' }, { status: 400 })
  }

  let order = await prisma.externalWorkOrder.findUnique({ where: functionalWhere })
  let scanAction = 'REUSED'

  const embeddedValidation = verifiedIdentity?.variant === 'embedded'
    ? validateEmbeddedExternalQrDetails(verifiedIdentity)
    : null
  const decision = decideExternalQrAction({
    exists: Boolean(order),
    variant: verifiedIdentity?.variant ?? null,
    embeddedDetailsComplete: embeddedValidation?.complete ?? false,
    currentRevision: order?.externalRevision,
    incomingRevision: verifiedIdentity?.revision,
  })

  if (decision === 'NOT_RECEIVED') {
    return NextResponse.json({ error: 'OR non reçu dans LIVO.' }, { status: 404 })
  }
  if (decision === 'INCOMPLETE') {
    return NextResponse.json({ error: 'Informations OR incomplètes.' }, { status: 422 })
  }

  if (decision === 'CREATE' && verifiedIdentity && embeddedValidation?.complete && integration) {
    try {
      const result = await createOrUpdateFromEmbeddedQr({
        garageId: compagnon.garageId,
        identity: verifiedIdentity,
        details: embeddedValidation.details,
        integrationId: integration.id,
        sourceSoftware: integration.partner.name,
      })
      order = result.order
      scanAction = result.action
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
        order = await prisma.externalWorkOrder.findUnique({ where: functionalWhere })
      } else {
        throw error
      }
    }
  } else if (decision === 'UPDATE' && order && verifiedIdentity && embeddedValidation?.complete && integration) {
    const result = await createOrUpdateFromEmbeddedQr({
      garageId: compagnon.garageId,
      identity: verifiedIdentity,
      details: embeddedValidation.details,
      integrationId: integration.id,
      sourceSoftware: integration.partner.name,
    })
    order = result.order
    scanAction = result.action
  }

  if (!order) return NextResponse.json({ error: 'OR non reçu dans LIVO.' }, { status: 404 })
  if (['CLOTURE', 'ANNULE'].includes(order.status)) {
    return NextResponse.json({ error: 'Cet OR est déjà clôturé.' }, { status: 409 })
  }

  await prisma.externalWorkOrderSyncLog.create({
    data: {
      garageId: compagnon.garageId,
      integrationId: order.integrationId,
      externalWorkOrderId: order.id,
      action: legacyFormat ? 'LEGACY_QR_SCAN' : `QR_SCAN_${scanAction}`,
      status: 'SUCCESS',
      message: scanAction === 'UPDATED'
        ? 'OR retrouvé et mis à jour depuis un QR plus récent.'
        : scanAction === 'CREATED_OR_REUSED'
          ? 'OR créé ou retrouvé depuis le QR.'
          : 'OR existant retrouvé.',
      legacyFormat,
      signatureValid: legacyFormat ? null : true,
      externalRevision: verifiedIdentity?.revision ?? null,
      payload: { externalNumber: order.externalNumber },
    },
  }).catch(() => undefined)

  const completeOrder = await prisma.externalWorkOrder.findUniqueOrThrow({
    where: { id: order.id },
    include: {
      lines: { orderBy: { position: 'asc' }, take: 50 },
      pointages: {
        where: { compagnonId: compagnon.id, statut: { in: ACTIVE_POINTAGE_STATUSES } },
        take: 1,
        orderBy: { debutAt: 'desc' },
      },
    },
  })
  const realMinutes = await prisma.externalWorkOrderPointage.aggregate({
    where: { externalWorkOrderId: order.id, statut: 'TERMINE' },
    _sum: { dureeMinutes: true },
  })

  return NextResponse.json({
    message: scanAction === 'CREATED_OR_REUSED' ? 'OR enregistré.' : 'OR reçu.',
    order: {
      id: completeOrder.id,
      externalNumber: completeOrder.externalNumber,
      source: completeOrder.source,
      sourceSoftware: completeOrder.sourceSoftware,
      clientName: completeOrder.clientName,
      vehicleLabel: completeOrder.vehicleLabel,
      immatriculation: completeOrder.immatriculation,
      operation: completeOrder.operation,
      status: completeOrder.status,
      plannedHours: completeOrder.plannedHours ? Number(completeOrder.plannedHours) : null,
      soldHours: completeOrder.soldHours ? Number(completeOrder.soldHours) : null,
      billedHours: completeOrder.billedHours ? Number(completeOrder.billedHours) : null,
      billedAmountHT: completeOrder.billedAmountHT ? Number(completeOrder.billedAmountHT) : null,
      realMinutes: realMinutes._sum.dureeMinutes ?? completeOrder.actualMinutes,
      lines: completeOrder.lines.map((line) => ({ id: line.id, type: line.type, label: line.label })),
      activePointage: completeOrder.pointages[0]
        ? { id: completeOrder.pointages[0].id, debutAt: completeOrder.pointages[0].debutAt }
        : null,
    },
  })
}
