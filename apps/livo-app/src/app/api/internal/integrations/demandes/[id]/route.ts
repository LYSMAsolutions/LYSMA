import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { isInternalApiAuthorized } from '@/lib/security/internal-api'
import { encryptSecret } from '@/lib/security/crypto'
import { sendTransactionalEmail } from '@/lib/email'
import crypto from 'node:crypto'

function generateApiSecret() {
  return 'sk_live_' + crypto.randomBytes(32).toString('hex')
}

function generateQrSecret() {
  return crypto.randomBytes(32).toString('hex')
}

function generateQrKeyId() {
  return crypto.randomBytes(8).toString('hex')
}

const schema = z.object({
  statut: z.enum(['APPROUVEE', 'REFUSEE']),
  noteAdmin: z.string().trim().max(2000).optional().nullable(),
  // Uniquement pour APPROUVEE — crée le GarageLink en même temps
  partnerId: z.string().min(1).optional().nullable(),
  externalGarageId: z.string().trim().min(1).max(120).optional().nullable(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isInternalApiAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id } = await params

  const demande = await prisma.demandeIntegration.findUnique({
    where: { id },
    include: {
      garage: {
        include: {
          owner: { select: { id: true, email: true, prenom: true, nom: true } },
        },
      },
    },
  })

  if (!demande) {
    return NextResponse.json({ error: 'Demande introuvable.' }, { status: 404 })
  }

  if (demande.statut !== 'EN_ATTENTE') {
    return NextResponse.json({ error: 'Cette demande a déjà été traitée.' }, { status: 409 })
  }

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { statut, noteAdmin, partnerId, externalGarageId } = parsed.data

  // Approbation sans création d'intégration (refus ou approbation simple)
  if (statut === 'REFUSEE' || !partnerId || !externalGarageId) {
    const updated = await prisma.demandeIntegration.update({
      where: { id },
      data: { statut, noteAdmin: noteAdmin || null },
    })

    if (statut === 'REFUSEE' && demande.contactEditeur) {
      sendTransactionalEmail({
        to: demande.contactEditeur,
        subject: `Demande d'intégration LIVO refusée — ${demande.nomLogiciel}`,
        html: `
          <p>Bonjour,</p>
          <p>Votre demande d'intégration de <strong>${demande.nomLogiciel}</strong> avec le garage <strong>${demande.garage.nom}</strong> a été refusée.</p>
          ${noteAdmin ? `<p>Motif : ${noteAdmin}</p>` : ''}
          <p>Contactez-nous pour plus d'informations.</p>
          <p>L'équipe LYSMA Solutions</p>
        `.trim(),
      }).catch(() => undefined)
    }

    return NextResponse.json({ success: true, demande: updated })
  }

  // Approbation + création GarageLink en une transaction
  const partner = await prisma.externalIntegrationPartner.findUnique({ where: { id: partnerId } })
  if (!partner || !partner.active) {
    return NextResponse.json({ error: 'Partenaire introuvable ou inactif.' }, { status: 404 })
  }

  const apiSecret = generateApiSecret()
  const qrSecret = generateQrSecret()
  const qrKeyId = generateQrKeyId()

  const [updatedDemande, integration] = await prisma.$transaction([
    prisma.demandeIntegration.update({
      where: { id },
      data: { statut: 'APPROUVEE', noteAdmin: noteAdmin || null },
    }),
    prisma.externalGarageIntegration.create({
      data: {
        partnerId,
        garageId: demande.garageId,
        externalGarageId,
        apiSecretEncrypted: encryptSecret(apiSecret),
        qrSecretEncrypted: encryptSecret(qrSecret),
        qrKeyId,
        active: true,
      },
    }),
  ])

  const credentials = {
    partnerKey: partner.key,
    apiSecret,
    externalGarageId: integration.externalGarageId,
  }

  const endpoint = 'https://livo-app.com/api/v1/or/qr'

  // Email à l'éditeur avec les credentials
  if (demande.contactEditeur) {
    sendTransactionalEmail({
      to: demande.contactEditeur,
      subject: `Intégration LIVO approuvée — ${demande.nomLogiciel} × ${demande.garage.nom}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto">
          <h2 style="color:#1a6fff">Intégration LIVO activée</h2>
          <p>Bonjour,</p>
          <p>La demande d'intégration de <strong>${demande.nomLogiciel}</strong> avec le garage <strong>${demande.garage.nom}</strong> a été approuvée.</p>
          <p>Voici vos identifiants d'accès à l'API LIVO. <strong>Conservez-les précieusement — ils ne seront plus affichés.</strong></p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr style="background:#f0f5ff">
              <td style="padding:10px 14px;font-weight:600;color:#1a3a6f;width:160px">Endpoint</td>
              <td style="padding:10px 14px;font-family:monospace">${endpoint}</td>
            </tr>
            <tr>
              <td style="padding:10px 14px;font-weight:600;color:#1a3a6f">Partner Key</td>
              <td style="padding:10px 14px;font-family:monospace">${credentials.partnerKey}</td>
            </tr>
            <tr style="background:#f0f5ff">
              <td style="padding:10px 14px;font-weight:600;color:#1a3a6f">API Secret</td>
              <td style="padding:10px 14px;font-family:monospace">${credentials.apiSecret}</td>
            </tr>
            <tr>
              <td style="padding:10px 14px;font-weight:600;color:#1a3a6f">Garage ID</td>
              <td style="padding:10px 14px;font-family:monospace">${credentials.externalGarageId}</td>
            </tr>
          </table>
          ${noteAdmin ? `<p><strong>Note LYSMA :</strong> ${noteAdmin}</p>` : ''}
          <p style="color:#888;font-size:13px">Ces identifiants sont strictement confidentiels. Ne les partagez pas.</p>
          <p>L'équipe LYSMA Solutions</p>
        </div>
      `.trim(),
    }).catch(() => undefined)
  }

  // Notification in-app pour le propriétaire du garage
  if (demande.garage.owner?.email) {
    sendTransactionalEmail({
      to: demande.garage.owner.email,
      subject: `Intégration QR activée sur votre garage — ${demande.nomLogiciel}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto">
          <h2 style="color:#1a6fff">Intégration QR activée</h2>
          <p>Bonjour ${demande.garage.owner.prenom ?? ''},</p>
          <p>L'intégration de <strong>${demande.nomLogiciel}</strong> avec votre garage <strong>${demande.garage.nom}</strong> est maintenant active.</p>
          <p>Votre logiciel de facturation peut désormais envoyer des ordres de réparation directement dans LIVO. Les mécaniciens peuvent scanner le QR code généré pour accéder à la fiche directement.</p>
          <p>Connectez-vous à <a href="https://livo-app.com">livo-app.com</a> pour voir les ordres reçus.</p>
          <p>L'équipe LYSMA Solutions</p>
        </div>
      `.trim(),
    }).catch(() => undefined)
  }

  return NextResponse.json({
    success: true,
    demande: updatedDemande,
    integration: {
      id: integration.id,
      externalGarageId: integration.externalGarageId,
    },
    credentials,
    note: 'Conservez ces identifiants — le apiSecret ne pourra plus être affiché en clair.',
  })
}
