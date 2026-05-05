import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding LIVO v2...')

  await prisma.pointageFiche.deleteMany()
  await prisma.pointageJour.deleteMany()
  await prisma.absence.deleteMany()
  await prisma.ficheTravaux.deleteMany()
  await prisma.vehicule.deleteMany()
  await prisma.compagnon.deleteMany()
  await prisma.tauxGarage.deleteMany()
  await prisma.jourOuvert.deleteMany()
  await prisma.garage.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑  Tables nettoyées')

  const owner = await prisma.user.create({
    data: { email: 'patron@livo.fr', nom: 'Dupont', prenom: 'Jean', role: 'OWNER', telephone: '0612345678' },
  })

  const garage = await prisma.garage.create({
    data: {
      nom: 'Garage Dupont',
      adresse: '12 rue de la Mécanique',
      ville: 'Paris',
      codePostal: '75011',
      telephone: '0143567890',
      email: 'contact@garage-dupont.fr',
      siret: '12345678900012',
      ownerId: owner.id,
      statutJour: 'OUVERT',
    },
  })

  await prisma.tauxGarage.createMany({
    data: [
      { garageId: garage.id, type: 'T1', libelle: 'Taux 1 — Standard',   montant: 65 },
      { garageId: garage.id, type: 'T2', libelle: 'Taux 2 — Spécialisé', montant: 80 },
      { garageId: garage.id, type: 'T3', libelle: 'Taux 3 — Expert',     montant: 95 },
      { garageId: garage.id, type: 'T4', libelle: 'Taux 4 — Diagnostic', montant: 110 },
      { garageId: garage.id, type: 'CARROSSERIE', libelle: 'Carrosserie', montant: 75 },
      { garageId: garage.id, type: 'PEINTURE',   libelle: 'Peinture',     montant: 90 },
      { garageId: garage.id, type: 'AUTRE', libelle: 'Autre',            montant: 60 },
    ],
  })

  await prisma.jourOuvert.createMany({
    data: [1,2,3,4,5].map(j => ({
      garageId: garage.id, jourSemaine: j,
      heureOuverture: '08:00', heureFermeture: j === 5 ? '17:00' : '18:00',
    })),
  })

  console.log('✅ Garage + taux + jours créés')

  const u1 = await prisma.user.create({ data: { email: 'thomas@livo.fr', nom: 'Martin', prenom: 'Thomas', role: 'COMPAGNON' } })
  const u2 = await prisma.user.create({ data: { email: 'lucas@livo.fr',  nom: 'Bernard', prenom: 'Lucas', role: 'COMPAGNON' } })

  const c1 = await prisma.compagnon.create({ data: { userId: u1.id, garageId: garage.id, matricule: 'C001', poste: 'Mécanicien',  heuresContrat: 35, dateEntree: new Date('2023-01-15') } })
  const c2 = await prisma.compagnon.create({ data: { userId: u2.id, garageId: garage.id, matricule: 'C002', poste: 'Carrossier', heuresContrat: 35, dateEntree: new Date('2022-06-01') } })

  console.log('✅ Compagnons créés')

  const v1 = await prisma.vehicule.create({ data: { garageId: garage.id, immatriculation: 'AB-123-CD', marque: 'Peugeot', modele: '308', annee: 2020, clientNom: 'Moreau', clientPrenom: 'Sophie', clientTel: '0611223344' } })
  const v2 = await prisma.vehicule.create({ data: { garageId: garage.id, immatriculation: 'CD-456-EF', marque: 'Renault', modele: 'Clio', annee: 2019, clientNom: 'Petit', clientPrenom: 'Marc' } })
  const v3 = await prisma.vehicule.create({ data: { garageId: garage.id, immatriculation: 'GH-789-IJ', marque: 'BMW', modele: '320d', annee: 2021, clientNom: 'Laurent', clientPrenom: 'Alice' } })

  console.log('✅ Véhicules créés')

  // Fiche terminée + clôturée (pour les stats)
  const f1 = await prisma.ficheTravaux.create({
    data: {
      garageId: garage.id, vehiculeId: v1.id,
      numero: 'FT-2026-001',
      statut: 'CLOTUREE',
      travaux: 'Vidange moteur\nFiltre à huile\nFiltre à air\nFiltre à pollen\nContrôle niveaux\nContrôle pression pneus\nContrôle éclairage',
      tempsFacture: 2.0,
      tempsReel: 1.75,
      tauxApplique: 'T1',
      montantHT: 130,
      dateOuverture: new Date(Date.now() - 86400000 * 2),
      dateFermeture: new Date(Date.now() - 86400000),
    },
  })

  // Pointage fiche clôturée
  await prisma.pointageFiche.create({
    data: {
      compagnonId: c1.id, ficheId: f1.id,
      debutAt: new Date(Date.now() - 86400000 * 2 + 3600000 * 8),
      finAt:   new Date(Date.now() - 86400000 * 2 + 3600000 * 9.75),
      dureeMinutes: 105, statut: 'TERMINE',
    },
  })

  // Fiche en cours aujourd'hui
  const f2 = await prisma.ficheTravaux.create({
    data: {
      garageId: garage.id, vehiculeId: v2.id,
      numero: 'FT-2026-002',
      statut: 'EN_COURS',
      travaux: 'Révision complète 60 000 km\nDistribution\nBougies\nFreins avant',
      dateOuverture: new Date(),
    },
  })

  // Compagnon 1 pointé sur cette fiche
  await prisma.pointageFiche.create({
    data: { compagnonId: c1.id, ficheId: f2.id, debutAt: new Date(Date.now() - 3600000 * 1.5), statut: 'EN_COURS' },
  })

  // Fiche en attente
  await prisma.ficheTravaux.create({
    data: {
      garageId: garage.id, vehiculeId: v3.id,
      numero: 'FT-2026-003',
      statut: 'EN_ATTENTE',
      travaux: 'Courroie de distribution\nPompe à eau\nKit complet',
      dateOuverture: new Date(),
    },
  })

  // Pointages journée aujourd'hui
  const today = new Date(); today.setHours(0,0,0,0)
  await prisma.pointageJour.create({
    data: {
      compagnonId: c1.id, date: today,
      statutActuel: 'EN_TRAVAIL',
      heureArrivee: new Date(Date.now() - 3600000 * 2),
    },
  })
  await prisma.pointageJour.create({
    data: {
      compagnonId: c2.id, date: today,
      statutActuel: 'EN_TRAVAIL',
      heureArrivee: new Date(Date.now() - 3600000 * 1.5),
    },
  })

  console.log('✅ Fiches de travaux + pointages créés')
  console.log('')
  console.log('🎉 Seed v2 terminé !')
  console.log('  Email    : patron@livo.fr')
  console.log('  Password : livo2024')
}

main().catch(console.error).finally(() => prisma.$disconnect())
