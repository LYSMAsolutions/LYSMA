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

  // Email à l'éditeur avec les credentials + documentation complète
  if (demande.contactEditeur) {
    sendTransactionalEmail({
      to: demande.contactEditeur,
      subject: `Intégration LIVO approuvée — ${demande.nomLogiciel} × ${demande.garage.nom}`,
      html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a2e">
<div style="max-width:640px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08)">

  <!-- Header -->
  <div style="background:#1a6fff;padding:32px 40px">
    <p style="margin:0 0 4px;color:rgba(255,255,255,0.7);font-size:13px;letter-spacing:1px;text-transform:uppercase">LYSMA Solutions</p>
    <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700">Intégration LIVO activée</h1>
    <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px">${demande.nomLogiciel} × ${demande.garage.nom}</p>
  </div>

  <div style="padding:32px 40px">

    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#333">
      Bonjour,<br><br>
      La demande d'intégration QR entre <strong>${demande.nomLogiciel}</strong> et le garage <strong>${demande.garage.nom}</strong> a été approuvée par LYSMA Solutions.
      Voici tout ce qu'il faut pour mettre en place l'intégration de votre côté — aucun contact supplémentaire n'est nécessaire.
    </p>

    <!-- Credentials -->
    <div style="background:#f8faff;border:1px solid #dde8f5;border-radius:8px;padding:20px 24px;margin-bottom:28px">
      <p style="margin:0 0 14px;font-size:13px;font-weight:700;color:#1a6fff;text-transform:uppercase;letter-spacing:1px">Vos identifiants d'accès</p>
      <p style="margin:0 0 16px;font-size:13px;color:#e05a00;font-weight:600">⚠ Conservez ces informations précieusement — l'API Secret ne pourra plus être affiché.</p>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 12px;font-size:13px;font-weight:600;color:#555;width:130px;vertical-align:top">Endpoint</td><td style="padding:8px 12px;font-family:monospace;font-size:13px;background:#fff;border-radius:4px;word-break:break-all">${endpoint}</td></tr>
        <tr><td style="padding:8px 12px;font-size:13px;font-weight:600;color:#555;vertical-align:top">Partner Key</td><td style="padding:8px 12px;font-family:monospace;font-size:12px;background:#fff;border-radius:4px;word-break:break-all">${credentials.partnerKey}</td></tr>
        <tr><td style="padding:8px 12px;font-size:13px;font-weight:600;color:#555;vertical-align:top">API Secret</td><td style="padding:8px 12px;font-family:monospace;font-size:12px;background:#fff;border-radius:4px;word-break:break-all">${credentials.apiSecret}</td></tr>
        <tr><td style="padding:8px 12px;font-size:13px;font-weight:600;color:#555;vertical-align:top">Garage ID</td><td style="padding:8px 12px;font-family:monospace;font-size:13px;background:#fff;border-radius:4px">${credentials.externalGarageId}</td></tr>
      </table>
    </div>

    <!-- Comment ça marche -->
    <h2 style="margin:0 0 12px;font-size:17px;font-weight:700;color:#1a1a2e">Comment ça fonctionne</h2>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#444">
      LIVO est un logiciel de gestion d'atelier automobile. Le garage utilise LIVO pour créer et suivre ses fiches de travail. L'intégration permet à votre logiciel de facturation de <strong>pousser les ordres de réparation (OR) directement dans LIVO</strong>, sans ressaisie manuelle.
    </p>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#444">
      En échange, votre logiciel reçoit un <strong>QR code signé</strong> à imprimer sur le bon de travail papier. Le mécanicien scanne ce QR code depuis l'application mobile LIVO pour ouvrir directement la fiche correspondante.
    </p>

    <!-- Étapes -->
    <div style="display:flex;flex-direction:column;gap:0;margin-bottom:28px">
      <div style="display:flex;gap:14px;padding:14px 0;border-bottom:1px solid #eef2fa">
        <div style="width:28px;height:28px;border-radius:50%;background:#1a6fff;color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;line-height:28px;text-align:center">1</div>
        <div><strong style="font-size:14px">Appel API à la création ou mise à jour d'un OR</strong><br><span style="font-size:13px;color:#666">Quand un OR est créé ou modifié dans votre logiciel, envoyez une requête POST à l'endpoint LIVO avec les informations du dossier.</span></div>
      </div>
      <div style="display:flex;gap:14px;padding:14px 0;border-bottom:1px solid #eef2fa">
        <div style="width:28px;height:28px;border-radius:50%;background:#1a6fff;color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;line-height:28px;text-align:center">2</div>
        <div><strong style="font-size:14px">LIVO retourne un QR payload signé</strong><br><span style="font-size:13px;color:#666">La réponse contient un champ <code style="background:#f0f5ff;padding:1px 5px;border-radius:3px">qr_payload</code> — une chaîne de texte signée cryptographiquement.</span></div>
      </div>
      <div style="display:flex;gap:14px;padding:14px 0;border-bottom:1px solid #eef2fa">
        <div style="width:28px;height:28px;border-radius:50%;background:#1a6fff;color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;line-height:28px;text-align:center">3</div>
        <div><strong style="font-size:14px">Générez un QR code à partir de ce payload</strong><br><span style="font-size:13px;color:#666">Encodez le <code style="background:#f0f5ff;padding:1px 5px;border-radius:3px">qr_payload</code> en QR code (format standard QR Code, correction L ou M) et imprimez-le sur le bon de travail du client.</span></div>
      </div>
      <div style="display:flex;gap:14px;padding:14px 0">
        <div style="width:28px;height:28px;border-radius:50%;background:#1a6fff;color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;line-height:28px;text-align:center">4</div>
        <div><strong style="font-size:14px">Le mécanicien scanne le QR depuis LIVO</strong><br><span style="font-size:13px;color:#666">Via l'application LIVO Atelier, le mécanicien scanne le QR imprimé. LIVO récupère automatiquement les infos du véhicule et du client pour préremplir la fiche.</span></div>
      </div>
    </div>

    <!-- Requête exemple -->
    <h2 style="margin:0 0 12px;font-size:17px;font-weight:700;color:#1a1a2e">Exemple de requête</h2>
    <div style="background:#1a1a2e;border-radius:8px;padding:20px 24px;margin-bottom:8px;overflow-x:auto">
      <pre style="margin:0;color:#e8f0ff;font-family:monospace;font-size:12px;line-height:1.7;white-space:pre-wrap">POST ${endpoint}
x-livo-partner-key: ${credentials.partnerKey}
x-livo-garage-id: ${credentials.externalGarageId}
x-livo-api-secret: ${credentials.apiSecret}
Content-Type: application/json

{
  "number": "OR-2026-001",
  "client": {
    "nom": "Martin François",
    "tel": "0612345678"
  },
  "vehicule": {
    "immat": "AB-123-CD",
    "marque": "Peugeot",
    "modele": "308",
    "annee": 2019,
    "vin": "VF3LBHZTXJS123456"
  },
  "travaux": "Vidange moteur + remplacement filtre à huile"
}</pre>
    </div>

    <!-- Réponse -->
    <h2 style="margin:16px 0 12px;font-size:17px;font-weight:700;color:#1a1a2e">Réponse attendue</h2>
    <div style="background:#1a1a2e;border-radius:8px;padding:20px 24px;margin-bottom:8px;overflow-x:auto">
      <pre style="margin:0;color:#e8f0ff;font-family:monospace;font-size:12px;line-height:1.7;white-space:pre-wrap">{
  "success": true,
  "or": {
    "number": "OR-2026-001",
    "status": "OUVERT"
  },
  "qr_payload": "LIVO:v1:eyJhbGciOi..."
}</pre>
    </div>
    <p style="margin:8px 0 28px;font-size:13px;color:#666">Le champ <code style="background:#f0f5ff;padding:1px 5px;border-radius:3px">qr_payload</code> est la chaîne à encoder en QR code. Utilisez n'importe quelle bibliothèque QR standard de votre langage (ex : <code>qrcode</code> en Python/JS, <code>ZXing</code> en Java, <code>BarcodeWriter</code> en C#...).</p>

    <!-- Champs -->
    <h2 style="margin:0 0 12px;font-size:17px;font-weight:700;color:#1a1a2e">Champs du body</h2>
    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:28px">
      <thead>
        <tr style="background:#f0f5ff">
          <th style="padding:9px 12px;text-align:left;color:#1a6fff;font-size:12px;text-transform:uppercase;letter-spacing:0.5px">Champ</th>
          <th style="padding:9px 12px;text-align:left;color:#1a6fff;font-size:12px;text-transform:uppercase;letter-spacing:0.5px">Type</th>
          <th style="padding:9px 12px;text-align:left;color:#1a6fff;font-size:12px;text-transform:uppercase;letter-spacing:0.5px">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid #eef2fa"><td style="padding:9px 12px"><code>number</code></td><td style="padding:9px 12px;color:#888">string*</td><td style="padding:9px 12px;color:#555">Numéro de l'OR dans votre logiciel. Requis.</td></tr>
        <tr style="border-bottom:1px solid #eef2fa;background:#fafbff"><td style="padding:9px 12px"><code>client.nom</code></td><td style="padding:9px 12px;color:#888">string</td><td style="padding:9px 12px;color:#555">Nom complet du client.</td></tr>
        <tr style="border-bottom:1px solid #eef2fa"><td style="padding:9px 12px"><code>client.tel</code></td><td style="padding:9px 12px;color:#888">string</td><td style="padding:9px 12px;color:#555">Téléphone du client.</td></tr>
        <tr style="border-bottom:1px solid #eef2fa;background:#fafbff"><td style="padding:9px 12px"><code>vehicule.immat</code></td><td style="padding:9px 12px;color:#888">string</td><td style="padding:9px 12px;color:#555">Immatriculation du véhicule.</td></tr>
        <tr style="border-bottom:1px solid #eef2fa"><td style="padding:9px 12px"><code>vehicule.marque</code></td><td style="padding:9px 12px;color:#888">string</td><td style="padding:9px 12px;color:#555">Marque du véhicule.</td></tr>
        <tr style="border-bottom:1px solid #eef2fa;background:#fafbff"><td style="padding:9px 12px"><code>vehicule.modele</code></td><td style="padding:9px 12px;color:#888">string</td><td style="padding:9px 12px;color:#555">Modèle du véhicule.</td></tr>
        <tr style="border-bottom:1px solid #eef2fa"><td style="padding:9px 12px"><code>vehicule.annee</code></td><td style="padding:9px 12px;color:#888">number</td><td style="padding:9px 12px;color:#555">Année du véhicule (ex : 2019).</td></tr>
        <tr style="border-bottom:1px solid #eef2fa;background:#fafbff"><td style="padding:9px 12px"><code>vehicule.vin</code></td><td style="padding:9px 12px;color:#555">string</td><td style="padding:9px 12px;color:#555">Numéro VIN (optionnel mais recommandé).</td></tr>
        <tr><td style="padding:9px 12px"><code>travaux</code></td><td style="padding:9px 12px;color:#888">string</td><td style="padding:9px 12px;color:#555">Description des travaux demandés.</td></tr>
      </tbody>
    </table>

    <!-- Codes erreur -->
    <h2 style="margin:0 0 12px;font-size:17px;font-weight:700;color:#1a1a2e">Codes de retour</h2>
    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:32px">
      <tr style="background:#f0f5ff"><th style="padding:8px 12px;text-align:left;color:#1a6fff;font-size:12px;text-transform:uppercase">Code</th><th style="padding:8px 12px;text-align:left;color:#1a6fff;font-size:12px;text-transform:uppercase">Signification</th></tr>
      <tr style="border-bottom:1px solid #eef2fa"><td style="padding:8px 12px"><code>201</code></td><td style="padding:8px 12px;color:#555">OR créé avec succès</td></tr>
      <tr style="border-bottom:1px solid #eef2fa;background:#fafbff"><td style="padding:8px 12px"><code>200</code></td><td style="padding:8px 12px;color:#555">OR mis à jour (même numéro, nouvelle version)</td></tr>
      <tr style="border-bottom:1px solid #eef2fa"><td style="padding:8px 12px"><code>400</code></td><td style="padding:8px 12px;color:#555">Données invalides (champ requis manquant)</td></tr>
      <tr style="border-bottom:1px solid #eef2fa;background:#fafbff"><td style="padding:8px 12px"><code>401</code></td><td style="padding:8px 12px;color:#555">Authentification incorrecte (vérifiez les headers)</td></tr>
      <tr><td style="padding:8px 12px"><code>429</code></td><td style="padding:8px 12px;color:#555">Trop de requêtes (limite : 60/minute)</td></tr>
    </table>

    ${noteAdmin ? `<div style="background:#fffbf0;border:1px solid #f0d8a0;border-radius:8px;padding:16px 20px;margin-bottom:24px"><p style="margin:0;font-size:13px;color:#8a6a00"><strong>Note de LYSMA Solutions :</strong> ${noteAdmin}</p></div>` : ''}

    <hr style="border:none;border-top:1px solid #eef2fa;margin:0 0 24px">
    <p style="margin:0;font-size:13px;color:#888;line-height:1.6">
      Ces identifiants sont strictement confidentiels et propres au garage <strong>${demande.garage.nom}</strong>. Ne les partagez pas.<br>
      Pour toute question technique, répondez à cet email.
    </p>

  </div>

  <div style="background:#f8faff;padding:20px 40px;border-top:1px solid #eef2fa">
    <p style="margin:0;font-size:12px;color:#aaa;text-align:center">LYSMA Solutions — Logiciel de gestion d'atelier automobile LIVO</p>
  </div>

</div>
</body>
</html>
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
