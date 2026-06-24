import fs from 'node:fs'

const sourcePath = 'docs/livo-bibliotheque-metier/interventions.source.json'
const outPath = 'docs/livo-bibliotheque-metier/interventions.json'
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'))

const renamed = {
  'ENT-001': 'Vidange moteur',
  'ENT-002': 'Filtre à huile',
  'ENT-003': 'Filtre à air moteur',
  'ENT-004': 'Filtre habitacle',
  'ENT-005': 'Filtre à carburant',
  'ENT-006': 'Révision moteur',
  'ENT-007': 'Bougies d\'allumage',
  'ENT-008': 'Bougies de préchauffage',
  'ENT-009': 'Courroie accessoires',
  'ENT-010': 'Liquide de refroidissement',
  // ENT-010 était "Liquide de frein" dans la source — renommé en refroidissement
  // ENT-011 supprimé : n'existe pas dans la source, "Liquide de frein" reste ENT-010
  'FRE-001': 'Plaquettes avant',
  'FRE-002': 'Plaquettes arrière',
  'FRE-003': 'Disques et plaquettes avant',
  'FRE-004': 'Disques et plaquettes arrière',
  'FRE-005': 'Tambours et garnitures arrière',
  'FRE-006': 'Flexible de frein',
  'FRE-007': 'Organe de frein',
  'FRE-008': 'Frein de parking',
  'PNE-001': 'Pneus avant',
  'PNE-002': 'Équilibrage roues',
  'PNE-003': 'Permutation pneus',
  'PNE-004': 'Réparation crevaison',
  'PNE-005': 'Pression pneus',
  'PNE-006': 'Valve de roue',
  'DIS-001': 'Distribution',
  'DIS-002': 'Distribution + pompe à eau',
  'DIS-003': 'Chaîne de distribution',
  'EMB-001': 'Embrayage',
  'EMB-002': 'Embrayage + volant moteur',
  'EMB-003': 'Câble d\'embrayage',
  'SUS-001': 'Amortisseurs avant',
  'SUS-002': 'Amortisseurs arrière',
  'SUS-003': 'Amortisseur + ressort avant',
  'SUS-004': 'Silent-blocs de suspension',
  'SUS-005': 'Rotule de suspension',
  'SUS-006': 'Biellette de barre stabilisatrice',
  'SUS-007': 'Roulement de roue avant',
  'SUS-008': 'Roulement de roue arrière',
  'DIR-001': 'Parallélisme',
  'DIR-002': 'Rotule de direction',
  'DIR-003': 'Soufflet de transmission',
  'DIR-004': 'Demi-arbre de transmission',
  'CLI-001': 'Recharge climatisation',
  'CLI-002': 'Étanchéité climatisation',
  'CLI-003': 'Compresseur climatisation',
  'CLI-004': 'Assainissement climatisation',
  'CLI-005': 'Filtre déshydrateur climatisation',
  'DIA-001': 'Diagnostic électronique',
  'DIA-002': 'Voyant moteur',
  'DIA-003': 'Diagnostic démarrage',
  'DIA-004': 'Diagnostic bruit',
  'DIA-005': 'Diagnostic perte de puissance',
  'ELE-001': 'Batterie',
  'ELE-002': 'Alternateur',
  'ELE-003': 'Démarreur',
  'ELE-004': 'Éclairage et ampoules',
  'ELE-005': 'Balais essuie-glaces',
  'ELE-006': 'Lève-vitre électrique',
  'ELE-007': 'Capteur électrique',
  'INJ-001': 'Nettoyage injecteurs',
  'INJ-002': 'Injecteurs',
  'INJ-003': 'Pompe à carburant',
  'INJ-004': 'Régénération FAP',
  'INJ-005': 'FAP',
  'INJ-006': 'Vanne EGR',
  'ECH-001': 'Silencieux arrière',
  'ECH-002': 'Catalyseur',
  'ECH-003': 'Sonde lambda',
  'ECH-004': 'Joint / collier d\'échappement',
  'CAR-001': 'Pare-chocs avant',
  'CAR-002': 'Pare-chocs arrière',
  'CAR-003': 'Débosselage sans peinture',
  'CAR-004': 'Aile de carrosserie',
  'VIT-001': 'Pare-brise',
  'VIT-002': 'Impact pare-brise',
  'VIT-003': 'Vitre latérale',
  'VO-001': 'Expertise véhicule occasion',
  'VO-002': 'Préparation esthétique VO',
  'VO-003': 'Révision pré-vente VO',
  'CT-001': 'Préparation contrôle technique',
  'CT-002': 'Contre-visite contrôle technique',
  'GAR-001': 'Garantie atelier ou fournisseur',
  'DIV-001': 'Thermostat',
  'DIV-002': 'Pompe à eau',
  'DIV-003': 'Joint de culasse',
  'DIV-004': 'Turbocompresseur',
  'DIV-005': 'Radiateur de refroidissement',
  'DIV-006': 'Boîte de vitesses manuelle',
  'DIV-007': 'Boîte automatique',
  'DIV-008': 'Maître cylindre de frein',
  'DIV-009': 'Pompe de direction assistée',
  'DIV-010': 'Crémaillère de direction',
  'DIV-011': 'Joint de vilebrequin',
  'DIV-012': 'Collecteur d\'admission',
  'DIV-013': 'Capteur ABS',
  'DIV-014': 'Ventilation habitacle',
  'DIV-015': 'Éclairage xénon / LED',
  'DIV-016': 'Intercooler',
  'DIV-017': 'Durites de refroidissement',
  'DIV-018': 'Capteur TPMS',
}

// Overrides complets (pièces + contrôles + opérations) pour certaines interventions clés
// IMPORTANT : les clés correspondent aux IDs APRÈS rename
// ENT-001 = Vidange moteur, ENT-006 = Révision moteur (décalé de +1 vs source)
const specific = {
  'ENT-001': {
    pieces_suggerees: ['Huile moteur', 'Filtre à huile', 'Filtre à air', 'Filtre habitacle', 'Filtre à carburant si applicable', 'Bougies d\'allumage si applicable'],
    controles_suggeres: ['Contrôle niveau huile', 'Contrôle niveaux', 'Contrôle visuel absence de fuite', 'Contrôle pression pneus'],
    operations_fin: ['Remise à zéro maintenance si nécessaire'],
  },
  // ENT-006 = Révision moteur (était ENT-005 dans la source avant rename)
  'ENT-006': {
    pieces_suggerees: ['Huile moteur', 'Filtre à huile', 'Filtre à air', 'Filtre habitacle', 'Filtre à carburant si applicable', 'Bougies d\'allumage si applicable'],
    controles_suggeres: ['Contrôle niveaux', 'Contrôle éclairage', 'Contrôle pression pneus', 'Contrôle essuie-glaces', 'Contrôle visuel freinage'],
    operations_fin: ['Remise à zéro maintenance', 'Essai routier si nécessaire'],
  },
  'FRE-001': {
    pieces_suggerees: ['Plaquettes de frein avant'],
    controles_suggeres: ['Contrôle visuel des disques avant', 'Contrôle niveau liquide de frein', 'Contrôle flexibles de frein', 'Contrôle témoin d\'usure si équipé'],
    operations_fin: ['Essai freinage'],
  },
  'FRE-002': {
    pieces_suggerees: ['Plaquettes de frein arrière'],
    controles_suggeres: ['Contrôle visuel des disques arrière', 'Contrôle niveau liquide de frein', 'Contrôle frein de parking', 'Contrôle témoin d\'usure si équipé'],
    operations_fin: ['Essai freinage'],
  },
  'FRE-003': {
    pieces_suggerees: ['Disques de frein avant', 'Plaquettes de frein avant'],
    controles_suggeres: ['Contrôle flexibles de frein avant', 'Contrôle roulements de roue avant', 'Contrôle niveau liquide de frein'],
    operations_fin: ['Essai freinage'],
  },
  'FRE-004': {
    pieces_suggerees: ['Disques de frein arrière', 'Plaquettes de frein arrière'],
    controles_suggeres: ['Contrôle flexibles de frein arrière', 'Contrôle frein de parking', 'Contrôle niveau liquide de frein'],
    operations_fin: ['Essai freinage'],
  },
  'PNE-001': {
    pieces_suggerees: ['2 pneus avant', '2 valves'],
    controles_suggeres: ['Contrôle état jantes', 'Contrôle pression pneus', 'Contrôle visuel train avant'],
    operations_fin: ['Équilibrage', 'Réinitialisation TPMS si nécessaire'],
  },
  'DIS-001': {
    pieces_suggerees: ['Kit distribution', 'Courroie accessoires si nécessaire', 'Liquide de refroidissement si nécessaire'],
    controles_suggeres: ['Contrôle absence fuite', 'Contrôle circuit de refroidissement', 'Contrôle courroie accessoires'],
    operations_fin: ['Essai routier', 'Contrôle niveau liquide de refroidissement après chauffe'],
  },
  'DIS-002': {
    pieces_suggerees: ['Kit distribution', 'Pompe à eau', 'Liquide de refroidissement', 'Courroie accessoires si nécessaire'],
    controles_suggeres: ['Contrôle absence fuite', 'Contrôle circuit de refroidissement'],
    operations_fin: ['Essai routier', 'Contrôle niveau liquide de refroidissement après chauffe'],
  },
  'DIS-003': {
    pieces_suggerees: ['Kit chaîne de distribution', 'Huile moteur si nécessaire', 'Joints associés si nécessaires'],
    controles_suggeres: ['Contrôle bruit distribution', 'Contrôle absence fuite', 'Diagnostic électronique si voyant'],
    operations_fin: ['Essai routier'],
  },
}

// Pièces par ID — alignées sur les IDs APRÈS rename
// ENT-002 = Filtre à huile, ENT-003 = Filtre à air moteur, etc.
// ENT-006 = Révision moteur (géré dans specific), ENT-007 = Bougies d'allumage, etc.
const pieces = {
  'ENT-002': ['Filtre à huile'],
  'ENT-003': ['Filtre à air moteur'],
  'ENT-004': ['Filtre habitacle'],
  'ENT-005': ['Filtre à carburant'],
  // ENT-006 (Révision moteur) → géré dans specific
  'ENT-007': ['Bougies d\'allumage'],
  'ENT-008': ['Bougies de préchauffage'],
  'ENT-009': ['Courroie accessoires', 'Galet tendeur si nécessaire'],
  'ENT-010': ['Liquide de refroidissement'],
  // ENT-010 était "Liquide de frein" dans la source → maintenant "Liquide de refroidissement"
  // Le liquide de frein est couvert par FRE-001/FRE-002/specific
  'FRE-005': ['Tambours arrière si nécessaires', 'Garnitures arrière', 'Cylindres de roue si nécessaires'],
  'FRE-006': ['Flexible de frein concerné', 'Liquide de frein si nécessaire'],
  'FRE-007': ['Organe de frein concerné', 'Liquide de frein si nécessaire'],
  'FRE-008': ['Câble de frein de parking si nécessaire', 'Kit frein arrière si nécessaire'],
  'PNE-002': ['Masses d\'équilibrage', 'Valve si nécessaire'],
  'PNE-003': [],
  'PNE-004': ['Kit réparation pneu si réparable', 'Valve si nécessaire'],
  'PNE-005': [],
  'PNE-006': ['Valve de roue'],
  'EMB-001': ['Kit embrayage'],
  'EMB-002': ['Kit embrayage', 'Volant moteur bi-masse'],
  'EMB-003': ['Câble d\'embrayage'],
  'SUS-001': ['Amortisseurs avant', 'Coupelles si nécessaires'],
  'SUS-002': ['Amortisseurs arrière'],
  'SUS-003': ['Amortisseur avant', 'Ressort avant', 'Coupelle si nécessaire'],
  'SUS-004': ['Silent-blocs de suspension'],
  'SUS-005': ['Rotule de suspension'],
  'SUS-006': ['Biellette de barre stabilisatrice'],
  'SUS-007': ['Roulement de roue avant'],
  'SUS-008': ['Roulement de roue arrière'],
  'DIR-001': [],
  'DIR-002': ['Rotule de direction'],
  'DIR-003': ['Soufflet de transmission', 'Colliers', 'Graisse si nécessaire'],
  'DIR-004': ['Demi-arbre de transmission'],
  'CLI-001': ['Fluide climatisation', 'Traceur si nécessaire'],
  'CLI-002': ['Traceur climatisation si nécessaire', 'Joint climatisation si nécessaire'],
  'CLI-003': ['Compresseur climatisation', 'Filtre déshydrateur si nécessaire', 'Fluide climatisation'],
  'CLI-004': ['Produit assainissant climatisation', 'Filtre habitacle si nécessaire'],
  'CLI-005': ['Filtre déshydrateur / bouteille déshydratante'],
  'DIA-001': [],
  'DIA-002': [],
  'DIA-003': [],
  'DIA-004': [],
  'DIA-005': [],
  'ELE-001': ['Batterie'],
  'ELE-002': ['Alternateur', 'Courroie accessoires si nécessaire'],
  'ELE-003': ['Démarreur'],
  'ELE-004': ['Ampoule ou optique concerné'],
  'ELE-005': ['Balais essuie-glaces'],
  'ELE-006': ['Mécanisme lève-vitre', 'Interrupteur si nécessaire'],
  'ELE-007': ['Capteur concerné'],
  'INJ-001': ['Produit nettoyage injection si nécessaire'],
  'INJ-002': ['Injecteur(s)', 'Joints injecteur si nécessaires'],
  'INJ-003': ['Pompe à carburant', 'Filtre à carburant si nécessaire'],
  'INJ-004': ['Additif FAP si nécessaire'],
  'INJ-005': ['FAP', 'Capteurs associés si nécessaires'],
  'INJ-006': ['Vanne EGR', 'Joint EGR si nécessaire'],
  'ECH-001': ['Silencieux arrière', 'Collier / silent-bloc si nécessaire'],
  'ECH-002': ['Catalyseur', 'Joint / collier si nécessaire'],
  'ECH-003': ['Sonde lambda'],
  'ECH-004': ['Joint d\'échappement', 'Collier d\'échappement'],
  'CAR-001': ['Pare-chocs avant', 'Agrafes / supports si nécessaires'],
  'CAR-002': ['Pare-chocs arrière', 'Agrafes / supports si nécessaires'],
  'CAR-003': [],
  'CAR-004': ['Aile de carrosserie', 'Agrafes / supports si nécessaires'],
  'VIT-001': ['Pare-brise', 'Colle vitrage', 'Capteur pluie/lumière si nécessaire'],
  'VIT-002': ['Résine réparation impact'],
  'VIT-003': ['Vitre latérale', 'Joint si nécessaire'],
  'VO-001': [],
  'VO-002': ['Produits nettoyage', 'Consommables esthétique'],
  'VO-003': ['Huile moteur', 'Filtres selon état', 'Balais essuie-glaces si nécessaires'],
  'CT-001': ['Ampoules si nécessaires', 'Balais essuie-glaces si nécessaires'],
  'CT-002': ['Pièces selon rapport de contrôle technique'],
  'GAR-001': ['Pièce concernée selon dossier'],
  'DIV-001': ['Thermostat', 'Joint thermostat', 'Liquide de refroidissement si nécessaire'],
  'DIV-002': ['Pompe à eau', 'Joint pompe à eau', 'Liquide de refroidissement'],
  'DIV-003': ['Joint de culasse', 'Kit joints haut moteur', 'Liquide de refroidissement', 'Huile moteur si nécessaire'],
  'DIV-004': ['Turbocompresseur', 'Huile moteur', 'Filtre à huile', 'Joints associés'],
  'DIV-005': ['Radiateur de refroidissement', 'Liquide de refroidissement'],
  'DIV-006': ['Boîte de vitesses manuelle', 'Huile boîte', 'Kit embrayage recommandé'],
  'DIV-007': ['Huile boîte automatique', 'Filtre boîte si accessible'],
  'DIV-008': ['Maître cylindre de frein', 'Liquide de frein'],
  'DIV-009': ['Pompe de direction assistée', 'Huile direction assistée'],
  'DIV-010': ['Crémaillère de direction', 'Huile direction assistée si nécessaire'],
  'DIV-011': ['Joint de vilebrequin'],
  'DIV-012': ['Collecteur d\'admission', 'Joint collecteur'],
  'DIV-013': ['Capteur ABS'],
  'DIV-014': ['Résistance de chauffage', 'Pulseur habitacle si nécessaire'],
  'DIV-015': ['Ampoule xénon / LED', 'Ballast si nécessaire'],
  'DIV-016': ['Intercooler', 'Durites d\'air si nécessaires'],
  'DIV-017': ['Durites de refroidissement', 'Liquide de refroidissement', 'Colliers'],
  'DIV-018': ['Capteur TPMS', 'Valve TPMS'],
}

const controlsByCategory = {
  Entretien: ['Contrôle niveaux', 'Contrôle visuel absence de fuite'],
  Freinage: ['Contrôle niveau liquide de frein', 'Contrôle visuel freinage'],
  Pneumatiques: ['Contrôle état pneus', 'Contrôle pression pneus', 'Contrôle état jantes'],
  Distribution: ['Contrôle absence fuite', 'Contrôle circuit de refroidissement'],
  Embrayage: ['Contrôle commande embrayage', 'Contrôle absence fuite'],
  Suspension: ['Contrôle visuel train roulant', 'Contrôle usure pneus'],
  Direction: ['Contrôle direction', 'Contrôle usure pneus'],
  Climatisation: ['Contrôle température sortie d\'air', 'Contrôle absence fuite visible'],
  Diagnostic: ['Lecture codes défaut', 'Contrôle symptômes client'],
  Électricité: ['Contrôle charge', 'Contrôle connectique visible'],
  Injection: ['Diagnostic électronique', 'Contrôle absence fuite carburant'],
  Échappement: ['Contrôle fixation échappement', 'Contrôle absence fuite échappement'],
  Carrosserie: ['Contrôle aspect carrosserie', 'Contrôle fixation éléments'],
  Vitrage: ['Contrôle étanchéité', 'Contrôle fonctionnement équipements associés'],
  'Préparation VO': ['Contrôle état général', 'Contrôle propreté', 'Contrôle équipements'],
  'Contrôle technique': ['Contrôle points rapportés', 'Contrôle sécurité'],
  Garantie: ['Contrôle conformité dossier', 'Contrôle date et kilométrage'],
  Divers: ['Contrôle absence fuite', 'Contrôle fonctionnement'],
}

const operationsByCategory = {
  Entretien: ['Remise à zéro maintenance si nécessaire'],
  Freinage: ['Essai freinage'],
  Pneumatiques: ['Contrôle pression finale'],
  Distribution: ['Essai routier'],
  Embrayage: ['Essai routier'],
  Suspension: ['Essai routier', 'Géométrie si nécessaire'],
  Direction: ['Essai routier', 'Géométrie si nécessaire'],
  Climatisation: ['Test fonctionnement climatisation'],
  Diagnostic: ['Compte rendu diagnostic'],
  Électricité: ['Test fonctionnement'],
  Injection: ['Diagnostic après intervention', 'Essai routier si nécessaire'],
  Échappement: ['Contrôle bruit échappement', 'Essai routier si nécessaire'],
  Carrosserie: ['Contrôle alignement et aspect'],
  Vitrage: ['Contrôle étanchéité', 'Test équipements associés si nécessaire'],
  'Préparation VO': ['Compte rendu préparation'],
  'Contrôle technique': ['Validation des points traités'],
  Garantie: ['Mise à jour dossier garantie'],
  Divers: ['Essai fonctionnement si nécessaire'],
}

function normalize(value) {
  return String(value).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function unique(items) {
  const seen = new Set()
  const result = []
  for (const raw of items.flat().filter(Boolean)) {
    const item = String(raw).replace(/\s+/g, ' ').trim()
    const key = normalize(item)
    if (!item || seen.has(key)) continue
    seen.add(key)
    result.push(item)
  }
  return result
}

function cleanVisible(value) {
  return String(value)
    .replace(/Dépose(?:\s+de|\s+du|\s+des|\s+d'|\s+d')?\s*/gi, '')
    .replace(/Repose(?:\s+de|\s+du|\s+des|\s+d'|\s+d')?\s*/gi, '')
    .replace(/Démontage(?:\s+de|\s+du|\s+des|\s+d'|\s+d')?\s*/gi, '')
    .replace(/Remontage(?:\s+de|\s+du|\s+des|\s+d'|\s+d')?\s*/gi, '')
    .replace(/déposée?s?/gi, 'concernée')
    .replace(/bouchon de vidange/gi, 'joint de vidange')
    .replace(/étriers?/gi, 'organe de frein')
    .replace(/serrage/gi, 'fixation')
    .replace(/calage moteur/gi, 'distribution')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanList(items) {
  return unique(items.map(cleanVisible))
}

function inferControls(item) {
  const title = renamed[item.id] ?? item.intervention
  const extra = []

  if (/pneu|roue|jante/i.test(title)) extra.push('Contrôle pression pneus', 'Contrôle état jantes')
  if (/disque|plaquette|frein|tambour|liquide de frein/i.test(title)) extra.push('Contrôle niveau liquide de frein', 'Contrôle visuel freinage')
  if (/batterie/i.test(title)) extra.push('Contrôle tension batterie', 'Contrôle charge alternateur')
  if (/alternateur|démarreur/i.test(title)) extra.push('Contrôle batterie', 'Contrôle connectique visible')
  if (/climatisation|déshydrateur/i.test(title)) extra.push('Contrôle température sortie d\'air')
  if (/pare-brise|vitre|impact/i.test(title)) extra.push('Contrôle étanchéité vitrage')
  if (/direction|parallélisme|rotule|transmission/i.test(title)) extra.push('Contrôle géométrie si nécessaire')

  return cleanList([...(item.controles_associes ?? []), ...(controlsByCategory[item.categorie] ?? []), ...extra]).slice(0, 6)
}

function inferOperations(item) {
  const title = renamed[item.id] ?? item.intervention
  const extra = []

  if (/pneu|roue|jante/i.test(title)) extra.push('Équilibrage si nécessaire', 'Réinitialisation TPMS si nécessaire')
  if (/diagnostic|voyant|bruit|démarrage|perte de puissance/i.test(title)) extra.push('Compte rendu au client')
  if (/vidange|révision|filtre|liquide/i.test(title)) extra.push('Remise à zéro maintenance si nécessaire')
  if (/frein|plaquette|disque|tambour/i.test(title)) extra.push('Essai freinage')
  if (/distribution|embrayage|suspension|direction|boîte|turbo|radiateur|pompe à eau/i.test(title)) extra.push('Essai routier')

  return cleanList([...(operationsByCategory[item.categorie] ?? []), ...extra]).slice(0, 4)
}

function synonyms(item, intervention) {
  const extra = [intervention, intervention.toLowerCase()]

  if (item.id === 'PNE-001') extra.push('pneus avant', '2 pneus avant', 'pneu avant', 'changement pneus avant')
  if (item.id === 'DIS-001') extra.push('distribution', 'kit distribution')
  if (item.id === 'FRE-001') extra.push('plaquettes avant', 'frein avant')
  if (item.id === 'ENT-001') extra.push('vidange', 'vidange moteur')

  return unique([...(item.synonymes ?? []), ...extra])
}

const interventions = source.interventions.map((item) => {
  const intervention = cleanVisible(renamed[item.id] ?? item.intervention)
  const override = specific[item.id] ?? {}

  return {
    id: item.id,
    categorie: item.categorie,
    intervention,
    synonymes: synonyms(item, intervention),
    pieces_suggerees: cleanList(override.pieces_suggerees ?? pieces[item.id] ?? []),
    controles_suggeres: cleanList(override.controles_suggeres ?? inferControls(item)),
    operations_fin: cleanList(override.operations_fin ?? inferOperations(item)),
    frequence: item.frequence,
  }
})

fs.writeFileSync(outPath, `${JSON.stringify({
  meta: {
    version: '2.0.0',
    created: '2026-06-16',
    description: 'Bibliothèque métier automobile LIVO V2 — interventions orientées fiche de travail atelier',
    source: 'Adaptation LIVO des pratiques métier standardisées — sans procédure mécanicien détaillée',
    total: interventions.length,
  },
  interventions,
}, null, 2)}\n`, 'utf8')

console.log(`Bibliothèque V2 générée : ${interventions.length} interventions`)
