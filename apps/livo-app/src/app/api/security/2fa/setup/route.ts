import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { encryptSecret } from '@/lib/security/crypto'
import { generateTotpSecret, totpUri } from '@/lib/security/totp'

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true },
  })
  if (!user) return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 })

  const secret = generateTotpSecret()
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorSecretEncrypted: encryptSecret(secret),
      twoFactorEnabled: false,
      twoFactorConfirmedAt: null,
    },
  })

  const uri = totpUri({ issuer: 'LIVO', account: user.email, secret })
  const qrCodeDataUrl = await QRCode.toDataURL(uri)

  return NextResponse.json({ qrCodeDataUrl, manualKey: secret })
}
