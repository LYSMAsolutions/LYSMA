import crypto from 'node:crypto'

const PERIOD = 30
const DIGITS = 6

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export function generateTotpSecret() {
  const bytes = crypto.randomBytes(20)
  let bits = ''
  for (const byte of bytes) bits += byte.toString(2).padStart(8, '0')
  return bits.match(/.{1,5}/g)?.map((chunk) => alphabet[parseInt(chunk.padEnd(5, '0'), 2)]).join('') ?? ''
}

function base32Decode(secret: string) {
  const clean = secret.replace(/=+$/g, '').replace(/\s/g, '').toUpperCase()
  let bits = ''
  for (const char of clean) {
    const value = alphabet.indexOf(char)
    if (value === -1) throw new Error('Secret TOTP invalide')
    bits += value.toString(2).padStart(5, '0')
  }
  const bytes = bits.match(/.{1,8}/g)?.filter((chunk) => chunk.length === 8).map((chunk) => parseInt(chunk, 2)) ?? []
  return Buffer.from(bytes)
}

function hotp(secret: string, counter: number) {
  const key = base32Decode(secret)
  const buffer = Buffer.alloc(8)
  buffer.writeBigUInt64BE(BigInt(counter))
  const hmac = crypto.createHmac('sha1', key).update(buffer).digest()
  const offset = hmac[hmac.length - 1] & 0xf
  const code = (
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)
  ) % 10 ** DIGITS
  return code.toString().padStart(DIGITS, '0')
}

export function verifyTotpCode(secret: string, code: string) {
  if (!/^\d{6}$/.test(code)) return false
  const counter = Math.floor(Date.now() / 1000 / PERIOD)
  return [-1, 0, 1].some((window) => hotp(secret, counter + window) === code)
}

export function totpUri(input: { issuer: string; account: string; secret: string }) {
  const label = encodeURIComponent(`${input.issuer}:${input.account}`)
  const issuer = encodeURIComponent(input.issuer)
  return `otpauth://totp/${label}?secret=${input.secret}&issuer=${issuer}&algorithm=SHA1&digits=${DIGITS}&period=${PERIOD}`
}
