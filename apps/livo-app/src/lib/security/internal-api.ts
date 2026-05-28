import crypto from 'node:crypto'
import type { NextRequest } from 'next/server'

export function isInternalApiAuthorized(req: NextRequest) {
  const expected = process.env.INTERNAL_API_KEY
  const provided = req.headers.get('x-internal-api-key')

  if (!expected || !provided) return false

  const expectedBuffer = Buffer.from(expected)
  const providedBuffer = Buffer.from(provided)

  if (expectedBuffer.length !== providedBuffer.length) return false

  return crypto.timingSafeEqual(expectedBuffer, providedBuffer)
}
