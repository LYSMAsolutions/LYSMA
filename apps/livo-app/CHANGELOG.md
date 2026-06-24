# Changelog

Ce changelog est deduit du code present le 2026-06-16. Il ne remplace pas un historique Git tague.

## 2026-06-24 - Responsive mobile complet

### Interface responsive (mobile-first)

Ajout d'un systeme de navigation mobile complet sur livo-app :

- `MobileMenuContext.tsx` : contexte React partagé pour l'état ouvert/fermé de la sidebar.
- `MobileBar/MobileBar.tsx` : barre fixe mobile (56px) avec bouton hamburger et logo, visible uniquement < 768px.
- `Sidebar.tsx` : drawer mobile (slide-in depuis la gauche), backdrop semi-transparent, fermeture au clic sur un lien.
- `AppShell.module.css` : `margin-left: 0` sur mobile + `padding-top: 56px` pour le contenu.
- Pages `(app)/` : grids adaptatifs (2 colonnes → 1 colonne sur mobile), paddings réduits.

Breakpoints utilisés : 768px (mobile) et 480px (très petit).

## 2026-06-23 - Intégration QR : email éditeur auto-suffisant + sandbox

### Email éditeur avec documentation complète

L'email envoyé à l'éditeur lors de l'approbation d'une demande d'intégration contient désormais :

- credentials (endpoint, partner key, api secret, garage ID)
- explication du principe en 4 étapes
- exemple de requête complet avec les vraies valeurs pré-remplies
- exemple de réponse avec le `qr_payload`
- tableau des champs du body
- codes HTTP de retour
- section "Tester avant la mise en production" avec l'endpoint sandbox

### Endpoint sandbox

Nouveau : `POST /api/v1/or/sandbox`

- accepte les mêmes headers et body que l'endpoint de production
- valide l'authentification et le format pour de vrai
- ne crée rien en base de données
- retourne un `qr_payload` fictif avec `"sandbox": true`
- rate limit : 30 req/min

## 2026-06-16 - Audit projet

Ajoute :

- documentation projet complete demandee ;
- photographie fonctionnelle, technique, securite, base et deploiement.

Etat detecte :

- application Next.js 15 / React 19 / Prisma ;
- auth NextAuth Credentials ;
- 2FA TOTP ;
- fiches de travaux ;
- pointage atelier ;
- mode atelier tablette ;
- compagnons, vehicules, absences ;
- OR externes ;
- bibliotheque metier automobile ;
- APIs internes super-admin ;
- pages publiques SEO.

## Evolutions recentes detectees dans le code

### Bibliotheque metier automobile

- Ajout d'une base JSON de 100 interventions.
- Ajout d'un script de validation.
- Ajout d'un script de construction V2.
- Ajout d'une API `/api/bibliotheque-metier/interventions`.
- Integration dans la creation de fiche.
- Affichage dans le detail fiche.
- Affichage dans le PDF fiche.
- Ajout du champ Prisma `FicheTravaux.interventionsMetier Json?`.

### Fiches de travaux

- Creation fiche avec vehicule existant ou nouveau vehicule.
- Generation numero `FT-AAAA-###`.
- Gestion travaux libres.
- Cloture avec temps facture, taux applique et montant HT.
- PDF fiche avec QR code et signatures.

### Pointage atelier

- Pointage journee avec arrivee, pauses et depart.
- Pointage sur fiche.
- Calcul temps reel.
- Audit logs de pointage.
- Mode atelier par cookies.

### Securite

- Verification email obligatoire.
- Double authentification TOTP.
- Appareils de confiance.
- Rate limiting.
- Verrouillage de compte.
- Logs securite.
- En-tetes de securite Next.js.

### OR externes

- Mode manuel.
- API integration interne.
- QR mirror.
- Pointage externe.
- Cloture et annulation.
- Logs de synchronisation.

### RH et absences

- Creation absences.
- Approbation/refus.
- Suppression logique.
- Releves mensuels.
- PDF pointage mensuel.

## Fonctionnalites anciennes ou structurantes detectees

- Landing page publique.
- Pages demo.
- Pages SEO conformite et integrations.
- Cookies et confidentialite.
- Dashboard atelier.
- Parametres garage.
- Recherche globale.
- Notifications.
- Support message.
- Chatbox FAQ.

## Dette de changelog

- Aucun fichier changelog historique n'etait present avant cet audit.
- Les dates exactes d'ajout des fonctionnalites ne sont pas deduites de tags/releases dans ce document.
- Il est recommande d'utiliser ce fichier comme point de depart pour les prochaines releases.
