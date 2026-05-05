/**
 * SEED — Crée le premier garage + admin
 * Usage : npx ts-node prisma/seed.ts
 * (ou node --loader ts-node/esm prisma/seed.ts)
 */
import { PrismaClient } from "../src/generated/prisma/client.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1. Créer le garage
  const garage = await prisma.garage.upsert({
    where: { code: "GAR01" },
    update: {},
    create: {
      name: "Garage Demo",
      code: "GAR01",
    },
  });
  console.log("✅ Garage créé :", garage.name, "(code:", garage.code + ")");

  // 2. Créer l'admin
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.fr" },
    update: {},
    create: {
      email: "admin@demo.fr",
      nom: "Admin",
      prenom: "LYSMA",
      role: "ADMIN",
      password: passwordHash,
      garageId: garage.id,
    },
  });
  console.log("✅ Admin créé :", admin.email, "(password: admin123)");

  // 3. Créer un technicien atelier
  const tech = await prisma.user.create({
    data: {
      nom: "Dupont",
      prenom: "Jean",
      role: "ATELIER",
      pinCode: "1234",
      garageId: garage.id,
    },
  });
  console.log("✅ Technicien créé :", tech.prenom, tech.nom, "(PIN: 1234)");

  console.log("\n🚀 Base prête ! Connexion :");
  console.log("   Admin  → email: admin@demo.fr  | password: admin123");
  console.log("   Atelier → code garage: GAR01   | PIN: 1234");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
