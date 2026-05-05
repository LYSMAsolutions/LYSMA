import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('LYSMAadmin2026!', 12)

  await prisma.adminUser.upsert({
    where: { email: 'lysmasolutions@gmail.com' },
    update: {},
    create: {
      email: 'lysmasolutions@gmail.com',
      passwordHash: hash,
      nom: 'LYSMA Admin',
    },
  })

  console.log('Admin cree : lysmasolutions@gmail.com')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
