# Fonctionnalites

Audit realise le 2026-06-16 sur le code present dans `apps/livo-app`.

## Authentification et inscription

Statut : Termine.

Description :

- inscription compte + garage ;
- verification email ;
- connexion email/mot de passe ;
- session NextAuth JWT ;
- verrouillage apres echecs ;
- rate limiting.

Fonctionnement :

- `/inscription` poste vers `/api/inscription`.
- `/connexion` utilise `signIn("credentials")`.
- `auth.ts` verifie mot de passe, email verifie, actif, verrouillage et 2FA.

Fichiers concernes :

- `src/app/inscription/page.tsx`
- `src/app/connexion/page.tsx`
- `src/app/api/inscription/route.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/lib/auth.ts`
- `src/lib/email.ts`
- `src/lib/security.ts`
- `middleware.ts`

## Double authentification

Statut : Partiellement implemente.

Description :

- generation secret TOTP ;
- confirmation TOTP ;
- appareil de confiance ;
- desactivation API.

Fonctionnement :

- `/double-authentification` force la configuration apres verification email.
- Les secrets TOTP sont chiffres avant stockage.
- La connexion peut demander `twoFactorCode`.

Limites :

- Les recovery codes sont stockes, mais aucun flux utilisateur de connexion par recovery code n'a ete detecte.
- Une API de desactivation existe, mais l'interface de desactivation n'est pas clairement exposee dans les parametres.

Fichiers concernes :

- `src/app/double-authentification/page.tsx`
- `src/app/api/auth/2fa/setup/route.ts`
- `src/app/api/auth/2fa/confirm/route.ts`
- `src/app/api/auth/2fa/verify/route.ts`
- `src/app/api/auth/2fa/disable/route.ts`
- `src/lib/totp.ts`
- `src/lib/secure-session.ts`

## Tableau de bord

Statut : Termine.

Description :

- indicateurs CA ;
- rentabilite ;
- temps vendu/reel ;
- compagnons presents ;
- vehicules actifs ;
- fiches en cours ;
- alertes.

Fonctionnement :

- `/dashboard` charge les donnees via `getDashboardData`.
- Les calculs agregent fiches, pointages et compagnons du garage courant.

Fichiers concernes :

- `src/app/(app)/dashboard/page.tsx`
- `src/components/dashboard/*`
- `src/lib/dashboard.ts`

## Fiches de travaux

Statut : Termine.

Description :

- creation de fiche ;
- rattachement vehicule/client ;
- travaux libres ;
- interventions metier structurees ;
- detail fiche ;
- cloture ;
- PDF.

Fonctionnement :

- `NouvelleFiche` permet de chercher ou creer un vehicule.
- `/api/fiches` cree la fiche et stocke les interventions metier en JSON.
- `/fiches/[id]` affiche vehicule, travaux, interventions, notes, pointages et actions.
- Le PDF est genere avec `@react-pdf/renderer`.

Fichiers concernes :

- `src/components/atelier/NouvelleFiche/NouvelleFiche.tsx`
- `src/app/api/fiches/route.ts`
- `src/app/(app)/fiches/[id]/page.tsx`
- `src/app/api/fiches/[id]/cloturer/route.ts`
- `src/lib/pdf/FichePDF.tsx`

## Bibliotheque metier automobile

Statut : Partiellement implemente.

Description :

- base JSON de 100 interventions ;
- recherche par mots-cles, synonymes, categorie ;
- selection multiple dans une fiche ;
- restitution dans detail et PDF.

Fonctionnement :

- La source est `docs/livo-bibliotheque-metier/interventions.json`.
- `src/lib/bibliotheque-metier.ts` charge et recherche les interventions.
- `/api/bibliotheque-metier/interventions` expose la recherche.
- Les fiches stockent un instantane JSON dans `interventionsMetier`.

Limites :

- Pas de table dediee en base.
- Pas d'interface admin de gestion.
- Pas d'apprentissage depuis les usages reels.
- Pas de KPI metier dedie detecte sur ces donnees.

Fichiers concernes :

- `docs/livo-bibliotheque-metier/interventions.json`
- `scripts/validate-bibliotheque-metier.mjs`
- `scripts/build-bibliotheque-v2.mjs`
- `src/lib/bibliotheque-metier.ts`
- `src/app/api/bibliotheque-metier/interventions/route.ts`

## Atelier admin

Statut : Termine.

Description :

- vue atelier pour administrateur ;
- statut garage ;
- compagnons ;
- fiches actives ;
- nouvelle fiche ;
- pointage et cloture.

Fichiers concernes :

- `src/app/(app)/atelier/page.tsx`
- `src/components/atelier/AtelierClient.tsx`
- `src/components/atelier/CompagnonCard.tsx`
- `src/components/atelier/FicheCard.tsx`

## Mode atelier tablette

Statut : Termine.

Description :

- connexion atelier separee ;
- selection compagnon par PIN ;
- pointage journee ;
- pointage fiche ;
- scan fiche ;
- scan OR externe.

Fonctionnement :

- `/atelier-login` valide email proprietaire + mot de passe atelier.
- `/atelier-dashboard` utilise les cookies atelier.
- Les scanners utilisent `BarcodeDetector` ou ZXing.

Fichiers concernes :

- `src/app/atelier-login/page.tsx`
- `src/app/atelier-dashboard/page.tsx`
- `src/components/atelier/AtelierDashboardClient.tsx`
- `src/components/atelier/FicheScanner.tsx`
- `src/app/api/atelier-auth/route.ts`
- `src/app/api/atelier-auth/compagnons/route.ts`
- `src/app/api/atelier-auth/compagnon-pin/route.ts`

## Pointage journee et fiche

Statut : Termine.

Description :

- arrivee ;
- pauses cafe/dejeuner ;
- depart ;
- pointer/depointer sur fiche ;
- calcul temps reel ;
- audit logs.

Fonctionnement :

- Les routes verrouillent certaines lignes via transactions SQL.
- Les pauses terminent ou suspendent les pointages fiche actifs.
- Le depart calcule la duree journee.

Fichiers concernes :

- `src/app/api/pointage-jour/action/route.ts`
- `src/app/api/pointage-fiche/action/route.ts`
- `src/lib/pointage-access.ts`
- `src/lib/pointage-audit.ts`

## Compagnons

Statut : Termine.

Description :

- liste compagnons ;
- creation ;
- profil ;
- indicateurs mensuels ;
- pointages recents ;
- absences ;
- PIN.

Fichiers concernes :

- `src/app/(app)/compagnons/page.tsx`
- `src/app/(app)/compagnons/[id]/page.tsx`
- `src/app/api/compagnons/route.ts`
- `src/components/compagnons/AjouterCompagnon.tsx`
- `src/components/compagnons/PointageExport.tsx`

## Vehicules

Statut : Termine.

Description :

- liste vehicules ;
- recherche ;
- detail vehicule ;
- historique fiches ;
- modification immatriculation/client.

Limite :

- La creation autonome d'un vehicule hors creation fiche n'a pas ete detectee.

Fichiers concernes :

- `src/app/(app)/vehicules/page.tsx`
- `src/app/(app)/vehicules/[id]/page.tsx`
- `src/app/api/vehicules/[id]/route.ts`
- `src/components/vehicules/VehiculeEditModal.tsx`

## Absences et RH

Statut : Partiellement implemente.

Description :

- creation absence ;
- approbation/refus ;
- suppression logique ;
- restauration via API interne ;
- calculs de compteurs ;
- releve mensuel compagnon.

Limites :

- La validation de solde de conges existe dans `lib/rh.ts`, mais n'est pas appliquee directement dans l'API absences.
- La page `/rapports` est actuellement centree RH/absences, pas sur des rapports atelier complets.

Fichiers concernes :

- `src/app/(app)/rapports/page.tsx`
- `src/app/api/absences/route.ts`
- `src/app/api/pointage-releves/[compagnonId]/route.ts`
- `src/app/api/pdf/pointage/[compagnonId]/route.ts`
- `src/components/rh/*`
- `src/lib/rh.ts`

## Rapports analytiques

Statut : Partiellement implemente.

Description :

- des composants de rapports existent ;
- des KPIs atelier sont presents dans le dashboard ;
- la route rapports n'affiche pas un module analytique complet.

Fichiers concernes :

- `src/components/rapports/RapportsClient.tsx`
- `src/components/rapports/RapportsTabs.tsx`
- `src/app/(app)/rapports/page.tsx`

## Ordres de reparation externes

Statut : Partiellement implemente.

Description :

- creation manuelle ;
- API interne d'import/upsert ;
- QR payload ;
- pointage externe ;
- cloture/annulation ;
- logs de synchronisation.

Limites :

- Pas de connecteur fournisseur specifique detecte.
- Pas de portail de configuration partenaire detecte.
- Protection par cle interne globale, pas par OAuth partenaire.

Fichiers concernes :

- `src/app/(app)/or-externes/page.tsx`
- `src/app/api/or-externes/route.ts`
- `src/app/api/or-externes/[id]/route.ts`
- `src/app/api/or-externes/[id]/pointage/route.ts`
- `src/app/api/or-externes/mirror/route.ts`
- `src/app/api/integrations/work-orders/route.ts`
- `src/components/or-externes/*`
- `src/lib/external-work-orders.ts`

## Parametres garage

Statut : Termine.

Description :

- informations garage ;
- taux horaires ;
- mot de passe atelier ;
- PIN compagnons ;
- configuration 2FA.

Limite :

- L'interface indique un mot de passe atelier minimum court, tandis que l'API exige 8 caracteres minimum.

Fichiers concernes :

- `src/app/(app)/parametres/page.tsx`
- `src/components/parametres/ParametresClient.tsx`
- `src/app/api/parametres/route.ts`

## Recherche globale et notifications

Statut : Termine.

Description :

- recherche pages, vehicules, fiches, compagnons ;
- notifications recentes.

Limite :

- Pas de statut lu/non lu persistant detecte.

Fichiers concernes :

- `src/app/api/search/route.ts`
- `src/app/api/notifications/route.ts`
- `src/components/layout/Header.tsx`

## Support et chatbox

Statut : Partiellement implemente.

Description :

- formulaire message support ;
- relais vers super-admin ;
- widget chatbox FAQ ;
- logs et updates chatbox.

Limite :

- Le chatbox est principalement base sur des regles locales. Aucune integration IA n'a ete detectee.

Fichiers concernes :

- `src/components/chatbox/LivoChatbox.tsx`
- `src/app/api/support-message/route.ts`
- `src/app/api/chatbox/log/route.ts`
- `src/app/api/chatbox/updates/route.ts`
- `src/lib/super-admin.ts`

## APIs internes super-admin

Statut : Partiellement implemente.

Description :

- listing garages ;
- detail garage ;
- modification garage/owner/compagnons/vehicules/fiches/taux ;
- corbeille absences ;
- restauration absence.

Limites :

- Les routes dependent d'une cle `INTERNAL_API_KEY`.
- Une mise a jour interne de `passwordAtelier` peut passer par le bloc garage sans hashage apparent, contrairement a l'API parametres.

Fichiers concernes :

- `src/app/api/internal/garages/route.ts`
- `src/app/api/internal/garages/[id]/route.ts`
- `src/app/api/internal/trash/route.ts`
- `src/app/api/internal/trash/[type]/[id]/restore/route.ts`

## Pages publiques et SEO

Statut : Termine.

Description :

- landing page ;
- demos ;
- pages SEO metier ;
- confidentialite ;
- cookies ;
- sitemap ;
- robots.

Fichiers concernes :

- `src/app/page.tsx`
- `src/app/demo/page.tsx`
- `src/app/demo-admin/page.tsx`
- `src/app/demo-atelier/page.tsx`
- `src/app/conformite-temps-travail/page.tsx`
- `src/app/logiciel-pointage-garage-dordogne/page.tsx`
- `src/app/api-qr-ordre-reparation-garage/page.tsx`
- `src/app/cookies/page.tsx`
- `src/app/politique-confidentialite/page.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`

## Abonnement et periode d'essai

Statut : Partiellement implemente.

Description :

- periode d'essai garage ;
- booleen abonnement actif ;
- page abonnement expire.

Limites :

- Aucun paiement Stripe ou equivalent detecte.
- Pas de portail facturation detecte.
- Les prix affiches semblent incoherents entre certaines pages.

Fichiers concernes :

- `src/app/abonnement-expire/page.tsx`
- `src/lib/plans.ts`
- `src/components/layout/AppShell.tsx`

## Tests automatises

Statut : Non commence.

Description :

- Aucun fichier de test automatise n'a ete detecte pendant l'audit.
