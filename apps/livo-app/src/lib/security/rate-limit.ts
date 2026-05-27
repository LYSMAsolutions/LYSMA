import { prisma } from '@/lib/prisma'

type RateLimitOptions = {
  key: string
  limit: number
  windowSeconds: number
  blockSeconds?: number
}

export async function checkRateLimit(options: RateLimitOptions) {
  const now = new Date()
  const existing = await prisma.rateLimitBucket.findUnique({
    where: { key: options.key },
  })

  if (existing?.blockedUntil && existing.blockedUntil > now) {
    return { allowed: false, retryAt: existing.blockedUntil }
  }

  if (!existing || existing.resetAt <= now) {
    await prisma.rateLimitBucket.upsert({
      where: { key: options.key },
      create: {
        key: options.key,
        count: 1,
        resetAt: new Date(now.getTime() + options.windowSeconds * 1000),
      },
      update: {
        count: 1,
        resetAt: new Date(now.getTime() + options.windowSeconds * 1000),
        blockedUntil: null,
      },
    })
    return { allowed: true, remaining: options.limit - 1 }
  }

  const nextCount = existing.count + 1
  const shouldBlock = nextCount > options.limit
  const blockedUntil = shouldBlock && options.blockSeconds
    ? new Date(now.getTime() + options.blockSeconds * 1000)
    : existing.blockedUntil

  await prisma.rateLimitBucket.update({
    where: { key: options.key },
    data: {
      count: nextCount,
      blockedUntil,
    },
  })

  return {
    allowed: !shouldBlock,
    retryAt: blockedUntil ?? existing.resetAt,
    remaining: Math.max(0, options.limit - nextCount),
  }
}
