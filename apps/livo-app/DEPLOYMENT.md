# Deploiement

Audit realise le 2026-06-16 sur le code present dans `apps/livo-app`.

## Deploiement actuel

Elements detectes :

- application Next.js App Router ;
- configuration Next.js dans `next.config.ts` ;
- scripts `dev`, `build`, `start` dans `package.json` ;
- usage de PostgreSQL via Prisma ;
- usage probable de Vercel/Supabase d'apres variables, configuration images et domaine public ;
- aucun `vercel.json` local detecte dans `apps/livo-app`.

Le deploiement exact n'est pas entierement documente dans le repo audite.

## Commandes

Installation :

```powershell
pnpm install
```

Generation Prisma :

```powershell
pnpm exec prisma generate
```

Developpement local :

```powershell
pnpm run dev
```

Build production :

```powershell
pnpm run build
```

Lancement apres build :

```powershell
pnpm run start
```

Validation bibliotheque metier :

```powershell
pnpm run bibliotheque:validate
```

## Configuration Vercel

Statut : Partiellement implemente.

Detecte :

- Next.js compatible Vercel ;
- redirection production `livo-app.com` vers `www.livo-app.com` dans `middleware.ts` ;
- variables publiques `NEXT_PUBLIC_APP_URL` et `NEXT_PUBLIC_APP_NAME` ;
- configuration images remote Supabase.

Non detecte :

- fichier `vercel.json` local ;
- configuration jobs/cron ;
- documentation d'environnements preview/prod ;
- monitoring explicite.

## Configuration Supabase

Statut : Partiellement implemente.

Detecte :

- PostgreSQL via Prisma ;
- remote images autorisees sur `https://**.supabase.co` ;
- variables `DATABASE_URL` et `DIRECT_URL`.

Non detecte :

- politiques RLS SQL ;
- storage upload gere par code ;
- migrations SQL Supabase ;
- seed production separe.

## Variables d'environnement

| Variable | Obligatoire probable | Usage |
| --- | --- | --- |
| `DATABASE_URL` | Oui | Prisma runtime. |
| `DIRECT_URL` | Oui | Prisma direct URL. |
| `AUTH_URL` | Oui | URL NextAuth. |
| `AUTH_SECRET` | Oui | Secret session/auth. |
| `NEXTAUTH_URL` | Compatibilite | Ancien nom NextAuth. |
| `NEXTAUTH_SECRET` | Compatibilite | Ancien nom NextAuth. |
| `SECURITY_ENCRYPTION_KEY` | Recommande | Chiffrement TOTP. |
| `RESEND_API_KEY` | Oui pour emails | Emails verification/support. |
| `RESEND_FROM_EMAIL` | Oui pour emails | Expediteur. |
| `NEXT_PUBLIC_APP_URL` | Oui | Liens publics, PDF, email. |
| `NEXT_PUBLIC_APP_NAME` | Non critique | Nom affiche. |
| `SUPER_ADMIN_MESSAGES_URL` | Optionnel | Relais support. |
| `SUPER_ADMIN_CHATBOX_LOG_URL` | Optionnel | Relais logs chatbox. |
| `SUPER_ADMIN_CHATBOX_UPDATES_URL` | Optionnel | Updates chatbox. |
| `SUPER_ADMIN_INBOUND_SECRET` | Recommande | Secret super-admin. |
| `INTERNAL_API_KEY` | Oui si APIs internes actives | Protection integration/super-admin. |

## Base de donnees

Etat actuel :

- schema Prisma present ;
- seed demo present ;
- migrations absentes.

Commandes disponibles :

```powershell
pnpm exec prisma generate
pnpm exec prisma db push
pnpm exec prisma migrate dev
pnpm exec prisma studio
pnpm exec prisma db seed
```

Recommandation :

- utiliser des migrations Prisma versionnees pour production ;
- reserver `db push` aux environnements controles ou transitions explicitement validees ;
- sauvegarder la base avant tout changement schema.

## Dependances externes

| Service / dependance | Usage |
| --- | --- |
| PostgreSQL | Base de donnees applicative. |
| Supabase | Probable hebergement PostgreSQL/images, d'apres config. |
| Resend | Envoi email verification/support. |
| Super-admin LYSMA | Relais messages support, chatbox et APIs internes. |
| Navigateur camera | Scan QR/code-barres atelier. |
| Vercel | Deploiement probable Next.js. |

## Checklist production recommandee

1. Sauvegarder la base.
2. Versionner les migrations Prisma.
3. Verifier toutes les variables d'environnement production.
4. Executer `pnpm run type-check`.
5. Executer `pnpm run build`.
6. Executer `pnpm run bibliotheque:validate`.
7. Tester inscription, email verification, login, 2FA.
8. Tester creation fiche, pointage, cloture, PDF.
9. Tester mode atelier tablette sur mobile/tablette.
10. Tester OR externe API et QR.
11. Verifier CSP et scan camera sur domaine HTTPS.
12. Activer monitoring erreurs.
13. Documenter rollback.

## Commande demandee pour appliquer la colonne `interventionsMetier`

Le schema Prisma contient `interventionsMetier Json?` sur `FicheTravaux`.

Pour appliquer cette colonne en base avec la commande disponible dans le projet :

```powershell
pnpm exec prisma db push
```

Pour une production stricte, preferer une migration versionnee apres sauvegarde.
