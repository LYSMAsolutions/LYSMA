# Roadmap

Audit realise le 2026-06-16 sur le code present dans `apps/livo-app`.

## Ce qui est termine

Les elements suivants sont presents dans le code et paraissent utilisables :

- inscription compte et garage ;
- verification email ;
- authentification par email/mot de passe ;
- double authentification TOTP obligatoire ;
- session securisee avec cookies httpOnly ;
- dashboard atelier ;
- creation de fiches de travaux ;
- detail et cloture de fiches ;
- generation PDF fiche ;
- stockage d'interventions metier structurees sur fiche ;
- recherche de 100 interventions metier via API ;
- mode atelier tablette ;
- selection compagnon par PIN ;
- pointage journee ;
- pointage fiche ;
- audit logs de pointage ;
- gestion compagnons ;
- gestion vehicules ;
- parametres garage, taux horaires, PIN et mot de passe atelier ;
- absences de base ;
- releves mensuels de pointage ;
- PDF mensuel de pointage ;
- OR externes manuels/API/QR ;
- recherche globale ;
- notifications recentes ;
- pages publiques SEO ;
- cookies et confidentialite ;
- APIs internes super-admin protegees par cle.

## Ce qui manque pour une V1 commercialisable

Priorite produit et production :

- ajouter des migrations Prisma versionnees ;
- mettre en place une suite de tests minimale ;
- securiser et documenter le workflow de deploiement ;
- clarifier le modele de roles `OWNER`, `MANAGER`, `COMPAGNON` ;
- corriger les incoherences visibles de prix ;
- finaliser l'abonnement commercial ou retirer les promesses non actives ;
- mettre en place paiement, factures et gestion abonnement si necessaire ;
- finaliser le flux mot de passe oublie ;
- finaliser le flux recovery codes 2FA ;
- auditer les APIs internes super-admin ;
- proteger ou retirer toute mise a jour interne qui stockerait un mot de passe atelier non hashe ;
- harmoniser validation UI/API du mot de passe atelier ;
- mettre en place sauvegarde/restauration base ;
- definir une strategie RLS si Supabase est utilise comme base exposee ;
- ajouter monitoring erreurs et logs production ;
- documenter les procedures de support ;
- ajouter des tests e2e sur inscription, login, fiche, pointage, PDF ;
- brancher la page rapports analytique si elle doit faire partie de la V1 ;
- definir le statut exact de la bibliotheque metier dans les KPIs.

## V2 possible

Pistes detectees ou naturellement compatibles avec le code existant :

- gestion multi-garage avancee ;
- roles manager et compagnon connectes ;
- facturation client ;
- devis ;
- planning atelier ;
- stocks et pieces ;
- fournisseurs ;
- connecteurs DMS ;
- webhooks OR externes par partenaire ;
- portail client ;
- signature electronique ;
- statistiques avancees par type d'intervention metier ;
- apprentissage des interventions frequentes par garage ;
- administration de la bibliotheque metier ;
- moteur de recommandations atelier ;
- export paie/RH ;
- application mobile compagnon ;
- mode hors ligne tablette ;
- audit trail et rapports conformite plus complets.

## Jalons proposes

### Jalon 1 - Stabilisation technique

Objectif : fiabiliser l'existant.

- migrations Prisma ;
- tests critiques ;
- build CI ;
- correction incoherences connues ;
- audit securite des APIs internes.

### Jalon 2 - V1 atelier vendable

Objectif : vendre a un garage pilote.

- parcours onboarding complet ;
- parametrage garage fiable ;
- fiches + pointage + PDF stabilises ;
- support et donnees support operationnels ;
- documentation deploiement et support ;
- sauvegardes base.

### Jalon 3 - Commercialisation

Objectif : gerer abonnement et exploitation.

- paiement/abonnement ;
- monitoring ;
- logs erreurs ;
- SLA support ;
- exports comptables ou metiers prioritaires ;
- conditions legales finalisees.

### Jalon 4 - Differenciation produit

Objectif : augmenter la valeur metier.

- bibliotheque metier pilotable ;
- analytics avancees ;
- connecteurs OR/DMS ;
- recommandations ;
- benchmark atelier.
