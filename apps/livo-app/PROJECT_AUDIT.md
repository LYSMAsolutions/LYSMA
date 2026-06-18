# Audit projet LIVO App

Audit realise le 2026-06-16 sur le code present dans `apps/livo-app`.

## Pourcentage estime d'avancement

Avancement fonctionnel estime : 70%.

Cette estimation est basee uniquement sur les fonctionnalites detectees dans le code. Le coeur atelier est largement present, mais la readiness production reste plus faible a cause de l'absence de migrations, de tests automatises, de paiement commercial et de certains flux securite incomplets.

## Fonctionnalites terminees

- inscription compte et garage ;
- verification email ;
- connexion email/mot de passe ;
- double authentification TOTP de base ;
- session securisee ;
- middleware de protection ;
- dashboard atelier ;
- creation de fiches ;
- detail fiche ;
- cloture fiche ;
- PDF fiche ;
- pointage journee ;
- pointage fiche ;
- audit logs de pointage ;
- mode atelier tablette ;
- selection compagnon par PIN ;
- gestion compagnons ;
- gestion vehicules ;
- parametres garage ;
- taux horaires ;
- mot de passe atelier ;
- PIN compagnons ;
- recherche globale ;
- notifications recentes ;
- pages publiques ;
- sitemap et robots ;
- APIs internes principales.

## Fonctionnalites incompletes

- bibliotheque metier : source JSON et integration OK, mais pas de table, admin UI, analytics d'usage ni apprentissage ;
- RH/absences : base fonctionnelle, mais controles de solde et exports avances incomplets ;
- rapports : composants presents, page finale non pleinement branchee ;
- abonnement : trial et booleen, pas de paiement ;
- OR externes : flux fonctionnel, mais integration partenaire industrialisee non detectee ;
- chatbox : widget FAQ/logs, pas d'IA ni support temps reel ;
- roles : enum present, autorisations fines non finalisees ;
- recovery codes 2FA : generation detectee, usage non detecte ;
- reset mot de passe : types/tokens presents, flux complet non detecte ;
- deploiement : scripts presents, documentation/monitoring/migrations absents.

## Dette technique detectee

- absence de tests automatises ;
- absence de migrations Prisma versionnees ;
- absence de RLS SQL ;
- beaucoup de logique metier dans routes API et composants ;
- dependance a une cle interne globale pour des APIs sensibles ;
- incoherence UI/API sur longueur mot de passe atelier ;
- incoherence prix entre pages/configuration ;
- seed demo potentiellement incoherent avec le login ;
- roles Prisma sous-utilises ;
- rapports analytiques non alignes avec la navigation ;
- bibliotheque metier stockee en JSON hors base applicative ;
- encodage a verifier sur certains textes anciens.

## Risques avant mise en production

| Risque | Niveau | Impact |
| --- | --- | --- |
| Pas de migrations | Critique | Schema difficile a appliquer/rollbacker proprement. |
| Pas de tests | Critique | Regressions probables sur auth, pointage, fiches, PDF. |
| APIs internes larges | Critique | Compromission cle = actions sensibles. |
| Hashage `passwordAtelier` a auditer | Critique | Secret potentiellement stocke en clair via route interne. |
| Paiement absent | Important | Commercialisation SaaS incomplete. |
| RLS absente | Important | Cloisonnement dependant de l'application uniquement. |
| Roles incomplets | Important | Delegation manager/compagnon limitee. |
| Recovery/reset incomplets | Important | Support utilisateur fragile. |
| Monitoring absent | Important | Incidents production moins visibles. |
| Prix incoherents | Confort | Confusion commerciale. |

## Blocages eventuels

- Aucun blocage technique absolu detecte pour continuer le developpement.
- Pour une production commerciale, les blocages principaux sont les migrations, les tests, le paiement/abonnement et l'audit securite des APIs internes.
- Pour une exploitation Supabase stricte, la strategie RLS doit etre clarifiee.

## Recommandations

1. Stabiliser la base avec migrations Prisma.
2. Ajouter tests e2e critiques.
3. Auditer les APIs internes.
4. Corriger le risque de mot de passe atelier non hashe.
5. Finaliser reset mot de passe et recovery codes.
6. Decider la matrice de roles.
7. Clarifier abonnement et prix.
8. Brancher ou retirer les rapports analytiques incomplets.
9. Ajouter monitoring production.
10. Industrialiser la bibliotheque metier si elle devient un pilier produit.

## Les 10 prochaines actions prioritaires

1. Creer une migration Prisma propre pour l'etat actuel du schema.
2. Sauvegarder la base avant tout changement de schema.
3. Ajouter un test e2e login + 2FA.
4. Ajouter un test e2e creation fiche + plusieurs interventions metier + PDF.
5. Ajouter un test e2e pointage arrivee + fiche + depart.
6. Auditer et corriger `/api/internal/garages/[id]` pour les secrets.
7. Harmoniser la validation du mot de passe atelier entre UI et API.
8. Finaliser reset mot de passe.
9. Clarifier les prix et le parcours abonnement.
10. Mettre en place monitoring et procedure de rollback production.

## Conclusion

LIVO-app est deja un produit atelier avance sur le plan fonctionnel. Les modules metier essentiels existent et s'articulent autour d'un schema coherent. La prochaine phase doit surtout transformer ce socle en application exploitable en production : migrations, tests, securite interne, paiement, monitoring et clarification des roles.
