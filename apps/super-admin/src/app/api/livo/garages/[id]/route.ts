import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getLivoGarage, updateLivoGarage } from '@/lib/livo-api'
import { writeAuditLog } from '@/lib/audit'
import { z } from 'zod'

const schema = z.object({
  garage: z.object({
    nom: z.string().trim().min(1).optional(),
    adresse: z.string().trim().nullable().optional(),
    ville: z.string().trim().nullable().optional(),
    codePostal: z.string().trim().nullable().optional(),
    telephone: z.string().trim().nullable().optional(),
    email: z.string().trim().email().nullable().optional(),
    siret: z.string().trim().nullable().optional(),
    passwordAtelier: z.string().trim().nullable().optional(),
  }).optional(),
  owner: z.object({
    nom: z.string().trim().min(1).optional(),
    prenom: z.string().trim().min(1).optional(),
    telephone: z.string().trim().nullable().optional(),
    actif: z.boolean().optional(),
  }).optional(),
  abonnementActif: z.boolean().optional(),
  actif: z.boolean().optional(),
  trialEndsAt: z.string().datetime().optional(),
  compagnon: z.object({
    id: z.string(),
    nom: z.string().trim().optional(),
    prenom: z.string().trim().optional(),
    poste: z.string().trim().nullable().optional(),
    matricule: z.string().trim().nullable().optional(),
    pin: z.string().trim().nullable().optional(),
    actif: z.boolean().optional(),
  }).optional(),
  vehicule: z.object({
    id: z.string(),
    immatriculation: z.string().trim().nullable().optional(),
    clientNom: z.string().trim().optional(),
    clientPrenom: z.string().trim().nullable().optional(),
    clientTel: z.string().trim().nullable().optional(),
    clientEmail: z.string().trim().email().nullable().optional(),
    notes: z.string().trim().nullable().optional(),
  }).optional(),
  fiche: z.object({
    id: z.string(),
    statut: z.enum(['EN_ATTENTE', 'EN_COURS', 'EN_PAUSE', 'TERMINEE', 'CLOTUREE', 'ANNULEE']).optional(),
    travaux: z.string().trim().optional(),
    notes: z.string().trim().nullable().optional(),
  }).optional(),
  taux: z.object({
    id: z.string(),
    libelle: z.string().trim().optional(),
    montant: z.coerce.number().nonnegative().optional(),
    actif: z.boolean().optional(),
    pin: z.string().trim().nullable().optional(),
  }).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const before = await getLivoGarage(id)

  try {
    const result = await updateLivoGarage(id, parsed.data)
    await writeAuditLog({
      outil: 'livo-app',
      cibleType: 'garage',
      cibleId: id,
      action: 'pilot_update',
      acteurId: session.user.id,
      acteurEmail: session.user.email,
      resume: 'Modification LIVO depuis Super Admin',
      avant: before,
      apres: result.garage,
    })

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    await writeAuditLog({
      outil: 'livo-app',
      cibleType: 'garage',
      cibleId: id,
      action: 'pilot_update',
      statut: 'ERROR',
      acteurId: session.user.id,
      acteurEmail: session.user.email,
      resume: 'Echec modification LIVO depuis Super Admin',
      avant: before,
      apres: parsed.data,
      erreur: error instanceof Error ? error.message : 'Erreur inconnue',
    })

    return NextResponse.json(
      { error: 'Erreur API LIVO' },
      { status: 500 }
    )
  }
}
