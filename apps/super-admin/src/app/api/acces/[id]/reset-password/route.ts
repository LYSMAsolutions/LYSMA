import { NextResponse } from 'next/server'
import { randomInt } from 'crypto'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeAuditLog } from '@/lib/audit'

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$'
  let password = ''

  for (let i = 0; i < 14; i++) {
    password += chars[randomInt(0, chars.length)]
  }

  return password
}

function gmailUrl(email: string, password: string) {
  const subject = 'Votre nouvel acces LYSMA'
  const body = [
    'Bonjour,',
    '',
    'Voici vos nouveaux identifiants temporaires :',
    `Email : ${email}`,
    `Mot de passe temporaire : ${password}`,
    '',
    'Merci de changer ce mot de passe lors de votre prochaine connexion.',
    '',
    'LYSMA Solutions',
  ].join('\n')

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const { id } = await params
  const password = generatePassword()

  const before = await prisma.acces.findUnique({
    where: { id },
    include: { client: true },
  })

  if (!before) {
    return NextResponse.json({ error: 'Acces introuvable' }, { status: 404 })
  }

  const access = await prisma.acces.update({
    where: { id },
    data: {
      motDePasseTemp: password,
      premiereConnexion: true,
      actif: true,
    },
  })

  await writeAuditLog({
    outil: before.client.outil,
    cibleType: 'acces',
    cibleId: access.id,
    action: 'access_reset_password',
    acteurId: session.user.id,
    acteurEmail: session.user.email,
    resume: `Nouveau mot de passe temporaire pour ${access.email}`,
    avant: { ...before, motDePasseTemp: '***' },
    apres: { ...access, motDePasseTemp: '***' },
  })

  return NextResponse.json({
    success: true,
    email: access.email,
    motDePasseTemp: password,
    gmailUrl: gmailUrl(access.email, password),
  })
}
