# Architecture LIVO App

Audit realise le 2026-06-16 sur le code present dans `apps/livo-app`.

## Arborescence du projet

```text
apps/livo-app
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── scripts/
│   ├── build-bibliotheque-v2.mjs
│   └── validate-bibliotheque-metier.mjs
├── src/
│   ├── app/
│   │   ├── (app)/
│   │   ├── api/
│   │   ├── abonnement-expire/
│   │   ├── atelier-dashboard/
│   │   ├── atelier-login/
│   │   ├── connexion/
│   │   ├── demo/
│   │   ├── demo-admin/
│   │   ├── demo-atelier/
│   │   ├── double-authentification/
│   │   ├── inscription/
│   │   └── verification-email/
│   ├── components/
│   │   ├── atelier/
│   │   ├── auth/
│   │   ├── chatbox/
│   │   ├── compagnons/
│   │   ├── dashboard/
│   │   ├── or-externes/
│   │   ├── parametres/
│   │   ├── rh/
│   │   ├── ui/
│   │   └── vehicules/
│   ├── lib/
│   └── types/
├── next.config.ts
├── middleware.ts
├── package.json
└── tsconfig.json
```

## Description des dossiers

| Dossier | Role |
| --- | --- |
| `prisma/` | Schema de donnees Prisma et script de seed demo. |
| `scripts/` | Scripts de construction et validation de la bibliotheque metier. |
| `src/app/` | Routes Next.js App Router, pages publiques, pages privees et APIs. |
| `src/app/(app)/` | Espace applicatif connecte avec layout protege. |
| `src/app/api/` | Endpoints REST internes a l'application. |
| `src/components/` | Composants UI metier par domaine fonctionnel. |
| `src/lib/` | Acces donnees, securite, auth, PDF, calculs metier, helpers. |
| `src/types/` | Types partages. |
| `public/` | Assets publics statiques. |

## Flux applicatifs

### Flux inscription

1. L'utilisateur accede a `/inscription`.
2. Le formulaire cree un utilisateur et un garage via `/api/inscription`.
3. Un email de verification est envoye via Resend.
4. Le garage recoit une periode d'essai.
5. L'utilisateur doit verifier son email puis configurer la double authentification.

Statut : Termine.

### Flux connexion admin

1. L'utilisateur se connecte sur `/connexion`.
2. NextAuth Credentials valide email, mot de passe, email verifie, verrouillage et rate limit.
3. Si la 2FA est active et que l'appareil n'est pas reconnu, un code TOTP est demande.
4. La session JWT est creee.
5. Le layout applicatif verifie email, 2FA, garage principal et trial.

Statut : Termine.

### Flux atelier tablette

1. Le garage se connecte sur `/atelier-login` avec email proprietaire et mot de passe atelier.
2. L'API pose le cookie `atelier-garage-id`.
3. Un compagnon est selectionne et valide par PIN.
4. Le cookie `atelier-compagnon-id` permet d'utiliser `/atelier-dashboard`.
5. Le compagnon pointe sa journee et ses fiches.

Statut : Termine.

### Flux creation fiche de travaux

1. Le composant `NouvelleFiche` cherche ou cree un vehicule.
2. L'utilisateur saisit les travaux manuels et peut selectionner plusieurs interventions de la bibliotheque metier.
3. La route `/api/fiches` cree le vehicule si besoin, genere le numero `FT-AAAA-###` et cree la fiche.
4. Les interventions metier selectionnees sont stockees en JSON dans `FicheTravaux.interventionsMetier`.
5. La fiche est consultable sur `/fiches/[id]` et exportable en PDF.

Statut : Termine.

### Flux pointage

1. Le compagnon pointe son arrivee via `/api/pointage-jour/action`.
2. Il peut demarrer ou arreter un pointage fiche via `/api/pointage-fiche/action`.
3. Les pauses journee suspendent les pointages fiche actifs.
4. Le depart calcule les minutes travaillees et termine les pointages actifs.
5. Les actions creent des logs d'audit.

Statut : Termine.

### Flux ordre de reparation externe

1. Un OR externe est cree via API interne, formulaire manuel ou QR miroir.
2. Le compagnon peut pointer dessus depuis le mode atelier.
3. L'OR peut etre cloture ou annule si aucun pointage actif n'existe.
4. Des logs de synchronisation sont crees.

Statut : Partiellement implemente.

## Authentification

Technologie detectee : NextAuth v5 beta avec Prisma Adapter et provider Credentials.

Elements presents :

- session JWT ;
- cookie de session `livo-app.session-token` ;
- mot de passe hash bcrypt ;
- verification email obligatoire ;
- verrouillage apres echecs repetes ;
- rate limiting par IP/email ;
- double authentification TOTP ;
- cookie appareil de confiance `livo_trusted_device` ;
- logs d'audit securite ;
- middleware de protection des routes privees ;
- mode atelier separe par cookies.

Limites detectees :

- les roles Prisma existent, mais le filtrage applicatif est surtout centre sur le proprietaire du garage ;
- les recovery codes 2FA sont generes, mais aucun flux de connexion par recovery code n'a ete detecte ;
- les tokens de reset mot de passe existent dans le schema, mais aucun flux reset complet n'a ete detecte ;
- aucune politique RLS SQL n'est versionnee dans le projet.

## API

### APIs applicatives principales

| Route | Role | Statut |
| --- | --- | --- |
| `/api/inscription` | Creation compte + garage + verification email. | Termine |
| `/api/auth/[...nextauth]` | Authentification NextAuth. | Termine |
| `/api/auth/2fa/*` | Setup, confirmation, verification, desactivation 2FA. | Partiellement implemente |
| `/api/fiches` | Recherche vehicules et creation fiches. | Termine |
| `/api/fiches/[id]/cloturer` | Cloture fiche avec temps vendu et taux. | Termine |
| `/api/bibliotheque-metier/interventions` | Recherche interventions metier JSON. | Termine |
| `/api/pointage-jour/action` | Actions journee compagnon. | Termine |
| `/api/pointage-fiche/action` | Pointer/depointer sur fiche. | Termine |
| `/api/compagnons` | Liste et creation compagnons. | Termine |
| `/api/vehicules/[id]` | Modification vehicule/client. | Termine |
| `/api/absences` | Creation, validation, refus, suppression logique absences. | Termine |
| `/api/pointage-releves/[compagnonId]` | Releves mensuels et validation. | Termine |
| `/api/pdf/pointage/[compagnonId]` | PDF de pointage mensuel. | Termine |
| `/api/parametres` | Parametres garage, taux, mot de passe atelier, PIN. | Termine |
| `/api/atelier-auth` | Connexion atelier. | Termine |
| `/api/atelier-auth/compagnons` | Liste compagnons atelier. | Termine |
| `/api/atelier-auth/compagnon-pin` | Validation PIN compagnon atelier. | Termine |
| `/api/or-externes` | Liste et creation manuelle OR externes. | Termine |
| `/api/or-externes/[id]` | Cloture/annulation OR externe. | Termine |
| `/api/or-externes/[id]/pointage` | Pointage sur OR externe. | Termine |
| `/api/or-externes/mirror` | Creation/recherche OR via QR ou saisie. | Termine |
| `/api/integrations/work-orders` | Upsert OR externe via cle interne. | Partiellement implemente |
| `/api/internal/*` | APIs super-admin protegees par cle interne. | Partiellement implemente |
| `/api/search` | Recherche globale. | Termine |
| `/api/notifications` | Notifications recentes. | Termine |
| `/api/support-message` | Relais message support. | Termine |
| `/api/chatbox/*` | Logs et updates chatbox. | Partiellement implemente |

## Relations entre modules

- `User` possede un ou plusieurs `Garage`.
- `Garage` regroupe `Compagnon`, `Vehicule`, `FicheTravaux`, `TauxGarage`, `JourOuvert`, `ExternalWorkOrder`.
- `FicheTravaux` appartient a un `Garage` et un `Vehicule`, et recoit des `PointageFiche`.
- `Compagnon` possede des `PointageJour`, `PointageFiche`, `Absence`, `PointageMonthlyReview`.
- `ExternalWorkOrder` appartient a un `Garage`, peut etre assigne a un `Compagnon` et recoit des pointages externes.
- Les modules dashboard et rapports agregent principalement `FicheTravaux`, `PointageFiche`, `PointageJour`, `Compagnon`, `Absence`.
- Les APIs internes super-admin lisent et modifient plusieurs ressources garage via `INTERNAL_API_KEY`.

## Configuration Next.js

`next.config.ts` configure :

- `typedRoutes: true` ;
- domaines images Supabase via pattern `https://**.supabase.co` ;
- en-tetes de securite globaux :
  - Content Security Policy ;
  - `X-Frame-Options: DENY` ;
  - `X-Content-Type-Options: nosniff` ;
  - `Referrer-Policy` ;
  - `Permissions-Policy` ;
  - HSTS ;
  - DNS prefetch desactive.

## Middleware

`middleware.ts` gere :

- redirection production `livo-app.com` vers `www.livo-app.com` ;
- acces public aux pages marketing, auth et demo ;
- protection des routes privees par session NextAuth ;
- acces `/atelier-dashboard` par cookie atelier ;
- exclusion des assets Next.js et routes API.
