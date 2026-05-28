import crypto from 'node:crypto'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { requestIp, requestUserAgent } from './audit'

export const TRUSTED_DEVICE_COOKIE = 'livo_trusted_device'
const TRUSTED_DEVICE_DAYS = 60

function hashTrustedDeviceToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export function readTrustedDeviceTokenFromCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) return null

  const cookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${TRUSTED_DEVICE_COOKIE}=`))

  return cookie ? decodeURIComponent(cookie.slice(TRUSTED_DEVICE_COOKIE.length + 1)) : null
}

export async function verifyTrustedDevice(input: {
  userId: string
  token: string | null | undefined
}) {
  if (!input.token) return false

  const tokenHash = hashTrustedDeviceToken(input.token)
  const device = await prisma.trustedDevice.findFirst({
    where: {
      userId: input.userId,
      tokenHash,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    select: { id: true },
  })

  if (!device) return false

  await prisma.trustedDevice.update({
    where: { id: device.id },
    data: { lastUsedAt: new Date() },
  })

  return true
}

export async function createTrustedDevice(req: NextRequest, userId: string) {
  const token = crypto.randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + TRUSTED_DEVICE_DAYS * 24 * 60 * 60 * 1000)

  await prisma.trustedDevice.create({
    data: {
      userId,
      tokenHash: hashTrustedDeviceToken(token),
      ip: requestIp(req.headers),
      userAgent: requestUserAgent(req.headers),
      label: 'Navigateur autorisé',
      expiresAt,
      lastUsedAt: new Date(),
    },
  })

  const cookieStore = await cookies()
  cookieStore.set(TRUSTED_DEVICE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: expiresAt,
  })

  return { expiresAt }
}

export async function revokeCurrentTrustedDevice() {
  const cookieStore = await cookies()
  const token = cookieStore.get(TRUSTED_DEVICE_COOKIE)?.value

  if (token) {
    await prisma.trustedDevice.updateMany({
      where: {
        tokenHash: hashTrustedDeviceToken(token),
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    })
  }

  cookieStore.delete(TRUSTED_DEVICE_COOKIE)
}
