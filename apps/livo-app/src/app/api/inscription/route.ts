import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { SecurityAuditEvent } from '@prisma/client'
import { sendEmailVerification } from '@/lib/security/email-verification'
import { validateStrongPassword } from '@/lib/security/password'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { requestIp, requestUserAgent, writeSecurityAuditLog } from '@/lib/security/audit'

const schema = z.object({
  prenom: z.string().trim().min(1),
  nom: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(12, 'Minimum 12 caractères'),
  garageNom: z.string().trim().min(1),
  garageTel: z.string().trim().optional(),
  garageVille: z.string().trim().optional(),
})

const TAUX_DEFAUT = [
  { type: 'T1', libelle: 'Taux 1 — Standard', montant: 65, actif: true },
  { type: 'T2', libelle: 'Taux 2 — Spécialisé', montant: 80, actif: true },
  { type: 'T3', libelle: 'Taux 3 — Expert', montant: 95, actif: true },
  { type: 'T4', libelle: 'Taux 4 — Diagnostic', montant: 110, actif: true },
  { type: 'CARROSSERIE', libelle: 'Carrosserie', montant: 75, actif: true },
  { type: 'PEINTURE', libelle: 'Peinture', montant: 70, actif: true },
  { type: 'AUTRE', libelle: 'Autre', montant: 60, actif: true },
] as const

export async function POST(req: NextRequest) {
  const ip = requestIp(req.headers)
  const userAgent = requestUserAgent(req.headers)
  const limiter = await checkRateLimit({
    key: `signup:${ip ?? 'unknown'}`,
    limit: 8,
    windowSeconds: 60 * 15,
    blockSeconds: 60 * 30,
  })
  if (!limiter.allowed) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez dans quelques minutes.' },
      { status: 429 },
    )
  }

  const cookieConsent = req.cookies.get('livo_cookie_consent')?.value
  if (cookieConsent !== 'accepted') {
    return NextResponse.json(
      { error: 'Vous devez accepter les cookies nécessaires avant de créer un compte.' },
      { status: 403 },
    )
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { prenom, nom, email, password, garageNom, garageTel, garageVille } = parsed.data
  const passwordValidation = validateStrongPassword(password)
  if (!passwordValidation.valid) {
    return NextResponse.json({ error: passwordValidation.message }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (existing) {
    return NextResponse.json(
      { error: 'Cet email est déjà utilisé.' },
      { status: 409 }
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const trialEndsAt = new Date()
  trialEndsAt.setDate(trialEndsAt.getDate() + 30)

  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        prenom,
        nom,
        email,
        passwordHash,
        passwordChangedAt: new Date(),
        role: 'OWNER',
        actif: true,
      },
    })

    const garage = await tx.garage.create({
      data: {
        nom: garageNom,
        telephone: garageTel || null,
        ville: garageVille || null,
        ownerId: newUser.id,
        trialEndsAt,
        actif: true,
      },
    })

    await tx.tauxGarage.createMany({
      data: TAUX_DEFAUT.map((taux) => ({
        ...taux,
        garageId: garage.id,
      })),
    })

    return newUser
  })

  await writeSecurityAuditLog({
    event: SecurityAuditEvent.SIGNUP_CREATED,
    userId: user.id,
    ip,
    userAgent,
  })

  try {
    await sendEmailVerification(user.id)
  } catch (error) {
    await prisma.user.delete({ where: { id: user.id } }).catch(() => null)
    console.error('[signup] email verification failed', error)
    return NextResponse.json(
      { error: 'Le compte n’a pas pu être créé car l’email de validation n’a pas pu être envoyé. Vérifiez la configuration email puis réessayez.' },
      { status: 502 },
    )
  }

  return NextResponse.json({
    success: true,
    userId: user.id,
    requiresEmailVerification: true,
  })
}
