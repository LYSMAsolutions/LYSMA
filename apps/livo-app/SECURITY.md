# Securite

Audit realise le 2026-06-16 sur le code present dans `apps/livo-app`.

## Synthese

Le projet possede une base securite applicative avancee : authentification NextAuth, hash des mots de passe, verification email, double authentification TOTP, appareils de confiance, rate limiting, verrouillage de compte, logs d'audit securite, cookies httpOnly et en-tetes de securite Next.js.

Les principaux risques detectes concernent l'absence de migrations/RLS versionnees, l'absence de tests automatises, des flux securite incomplets et certaines APIs internes tres puissantes protegees par cle.

## Authentification

Statut : Termine.

Elements presents :

- NextAuth v5 beta ;
- provider Credentials ;
- Prisma Adapter ;
- sessions JWT ;
- cookie de session `livo-app.session-token` ;
- mots de passe hashes avec bcrypt ;
- email obligatoire et verifie ;
- verrouillage apres echecs repetes ;
- rate limit par IP/email ;
- logs d'audit securite.

Fichiers principaux :

- `src/lib/auth.ts`
- `src/lib/secure-session.ts`
- `src/lib/security.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `middleware.ts`

## Double authentification

Statut : Partiellement implemente.

Elements presents :

- generation secret TOTP ;
- chiffrement secret TOTP via AES-256-GCM ;
- confirmation de la configuration ;
- verification lors de la connexion ;
- appareil de confiance ;
- recovery codes hashes.

Points incomplets :

- aucun flux utilisateur detecte pour consommer les recovery codes ;
- pas d'interface claire detectee pour gerer les appareils de confiance ;
- une route de desactivation existe, mais l'exposition UI doit etre verifiee.

## Autorisations

Statut : Partiellement implemente.

Elements presents :

- middleware protege les routes privees ;
- `requireSecureSession()` impose utilisateur actif, email verifie et 2FA selon les options ;
- la plupart des requetes Prisma filtrent par garage/proprietaire ;
- mode atelier limite par cookies `atelier-garage-id` et `atelier-compagnon-id` ;
- APIs internes protegees par `INTERNAL_API_KEY`.

Limites :

- les roles `OWNER`, `MANAGER`, `COMPAGNON`, `SUPER_ADMIN` existent dans Prisma mais ne semblent pas gerer une matrice d'autorisations complete ;
- les compagnons ne semblent pas avoir un espace connecte standard hors mode atelier ;
- les APIs internes ont un perimetre large et dependent fortement de la confidentialite d'une cle.

## RLS

Statut : Non commence.

Aucune politique Row Level Security SQL n'a ete detectee dans le repo.

Le cloisonnement multi-tenant est donc gere cote application par :

- filtrage `garageId` ;
- filtrage `ownerId` ;
- session admin ;
- cookies atelier ;
- cle interne pour super-admin.

Si Supabase est utilise comme base PostgreSQL, une strategie RLS devrait etre decidee avant exposition directe de la base a des clients ou services tiers.

## Validation des donnees

Statut : Termine pour les routes principales, a renforcer globalement.

Elements presents :

- Zod utilise dans plusieurs APIs ;
- validation email, mot de passe, PIN, montants, dates ;
- nettoyage des messages chatbox/support ;
- validation bibliotheque metier via script.

Points a renforcer :

- uniformiser toutes les APIs internes ;
- ajouter tests de schemas ;
- aligner validation UI et API pour le mot de passe atelier ;
- s'assurer que toutes les routes PATCH internes hashent les secrets.

## Cookies et sessions

Elements detectes :

- session app `livo-app.session-token` ;
- appareil de confiance `livo_trusted_device` ;
- atelier `atelier-garage-id` ;
- atelier compagnon `atelier-compagnon-id`.

Les cookies sensibles sont configures en httpOnly, sameSite strict ou lax selon usage, et secure en production lorsque detecte dans le code.

## En-tetes de securite

`next.config.ts` definit :

- Content Security Policy ;
- `X-Frame-Options: DENY` ;
- `X-Content-Type-Options: nosniff` ;
- `Referrer-Policy` ;
- `Permissions-Policy` ;
- HSTS ;
- DNS prefetch desactive.

Statut : Termine.

## Vulnerabilites potentielles detectees

| Risque | Niveau | Detail |
| --- | --- | --- |
| Absence de tests securite | Critique | Aucun test automatise detecte sur auth, 2FA, permissions. |
| Absence de migrations | Critique | Changements base non tracables et difficiles a auditer. |
| API interne tres large | Critique | `INTERNAL_API_KEY` donne acces a des operations sensibles. |
| Patch interne `passwordAtelier` | Critique | Un chemin de mise a jour semble pouvoir stocker une valeur non hashee. |
| Recovery codes non utilisables | Important | Codes generes mais flux non detecte. |
| Reset mot de passe incomplet | Important | Type token present, flux complet non detecte. |
| RLS absente | Important | Multi-tenant uniquement applicatif. |
| Roles partiels | Important | Enum roles present, droits fins non finalises. |
| Prix incoherents | Confort | Risque confiance produit plus que securite technique. |
| Seed demo incoherent | Confort | Le seed affiche un mot de passe sans hash utilisateur apparent. |

## Recommandations securite

1. Creer une suite de tests auth/2FA/permissions.
2. Versionner les migrations Prisma.
3. Auditer toutes les routes `/api/internal/*`.
4. Corriger toute mise a jour de secret qui ne hashe pas la valeur.
5. Finaliser mot de passe oublie.
6. Finaliser recovery codes.
7. Definir la matrice de roles.
8. Decider et documenter la strategie RLS Supabase.
9. Ajouter monitoring erreurs production.
10. Ajouter rotation et procedure de changement de `INTERNAL_API_KEY`.
