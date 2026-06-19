import crypto from 'node:crypto'
import { PrismaClient } from '@prisma/client'
import { encryptSecret } from '../src/lib/security/crypto'

const prisma = new PrismaClient()

function argument(name: string) {
  const prefix = `--${name}=`
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length)
}

async function main() {
  const partnerKey = argument('partner-key')
  const partnerName = argument('partner-name')
  const garageId = argument('garage-id')
  const externalGarageId = argument('external-garage-id')
  const rotate = process.argv.includes('--rotate')

  if (!partnerKey || !partnerName || !garageId || !externalGarageId) {
    throw new Error(
      'Arguments requis: --partner-key, --partner-name, --garage-id et --external-garage-id.'
    )
  }

  const garage = await prisma.garage.findUnique({ where: { id: garageId }, select: { id: true, nom: true } })
  if (!garage) throw new Error('Garage LIVO introuvable.')

  const partner = await prisma.externalIntegrationPartner.upsert({
    where: { key: partnerKey },
    create: { key: partnerKey, name: partnerName },
    update: { name: partnerName, active: true },
  })

  const existing = await prisma.externalGarageIntegration.findFirst({
    where: { partnerId: partner.id, garageId },
  })
  if (existing && !rotate) {
    throw new Error('Cette connexion existe déjà. Utilisez --rotate pour renouveler ses secrets.')
  }

  const apiSecret = crypto.randomBytes(32).toString('base64url')
  const qrSecret = crypto.randomBytes(32).toString('base64url')
  const qrKeyId = `qr-${new Date().toISOString().slice(0, 7)}`

  await prisma.externalGarageIntegration.upsert({
    where: {
      partnerId_garageId: { partnerId: partner.id, garageId },
    },
    create: {
      partnerId: partner.id,
      garageId,
      externalGarageId,
      apiSecretEncrypted: encryptSecret(apiSecret),
      qrSecretEncrypted: encryptSecret(qrSecret),
      qrKeyId,
    },
    update: {
      externalGarageId,
      apiSecretEncrypted: encryptSecret(apiSecret),
      qrSecretEncrypted: encryptSecret(qrSecret),
      qrKeyId,
      active: true,
    },
  })

  process.stdout.write(JSON.stringify({
    partnerKey,
    garage: garage.nom,
    externalGarageId,
    apiSecret,
    qrSecret,
    qrKeyId,
    warning: 'Ces secrets ne seront plus affichés. Conservez-les dans un gestionnaire de secrets.',
  }, null, 2))
}

main()
  .catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : 'Provisionnement impossible.'}\n`)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
