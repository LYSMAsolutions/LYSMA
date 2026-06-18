# LIVO App

Audit projet realise le 2026-06-16 sur le code present dans `apps/livo-app`.

## Presentation du projet

LIVO est une application SaaS Next.js destinee aux garages automobiles, ateliers mecaniques et carrosseries. Le projet contient une application web avec espace administrateur, mode atelier tablette, gestion des fiches de travaux, pointage compagnons, vehicules, absences, ordres de reparation externes, parametrage garage et pages publiques.

Le code actuel correspond a une application fonctionnelle en construction avancee. Plusieurs modules coeur sont presents, mais la mise en production commerciale necessite encore des migrations maitrisees, des tests automatises, un durcissement securite et une clarification de certains flux incomplets.

## Vision produit

La vision detectee dans le code est de fournir un outil operationnel pour :

- suivre l'activite atelier en temps reel ;
- creer et cloturer des fiches de travaux ;
- pointer les compagnons sur journee et fiches ;
- comparer temps vendu et temps reel ;
- gerer les compagnons, vehicules, absences et parametres garage ;
- connecter des ordres de reparation externes via QR code ou API interne ;
- produire des PDF atelier et des indicateurs de rentabilite.

## Fonctionnalites principales

| Module | Statut | Etat reel detecte |
| --- | --- | --- |
| Authentification email/mot de passe | Termine | Login NextAuth Credentials, inscription, verification email, session JWT. |
| Double authentification TOTP | Termine | Setup obligatoire, confirmation, cookie appareil de confiance, verification a la connexion. |
| Tableau de bord | Termine | KPIs atelier, rentabilite, alertes, workflow fiches. |
| Fiches de travaux | Termine | Creation, detail, cloture, PDF, pointages associes. |
| Bibliotheque metier automobile | Partiellement implemente | JSON de 100 interventions, API de recherche, integration creation/detail/PDF. Pas de table dediee ni apprentissage usage. |
| Mode atelier tablette | Termine | Connexion atelier, selection compagnon par PIN, pointage jour/fiches, scanners. |
| Pointage compagnons | Termine | Pointage journee, pauses, pointage fiche, audit logs. |
| Compagnons | Termine | Liste, creation, profil, indicateurs, PIN. |
| Vehicules | Termine | Liste, recherche, detail, modification client/immatriculation. Creation via fiche. |
| Absences et RH | Partiellement implemente | Creation, validation, refus, suppression logique, releves mensuels. Page rapports dediee aux absences. |
| Rapports analytiques | Partiellement implemente | Composants presents, mais la route `/rapports` affiche surtout RH/absences. |
| Ordres de reparation externes | Partiellement implemente | API interne, miroir QR/manuel, pointage, cloture. Integration partenaire complete non detectee. |
| Parametres garage | Termine | Infos garage, taux horaires, mot de passe atelier, PIN compagnons, 2FA. |
| Abonnement / trial | Partiellement implemente | Trial et booleen abonnement. Pas de paiement ni portail client detecte. |
| Chatbox support | Partiellement implemente | Widget FAQ/regles, journalisation et relais super-admin. Pas d'IA conversationnelle detectee. |
| Pages publiques / SEO | Termine | Landing, demo, pages conformite, cookies, confidentialite, sitemap, robots. |
| Tests automatises | Non commence | Aucun fichier de test detecte. |
| Migrations Prisma | Non commence | Aucun dossier `prisma/migrations` detecte. |

## Technologies utilisees

- Next.js App Router 15.5.x
- React 19
- TypeScript strict
- Prisma ORM
- PostgreSQL
- NextAuth v5 beta avec Prisma Adapter
- bcryptjs
- Zod
- React PDF (`@react-pdf/renderer`)
- QRCode
- ZXing browser pour scan code-barres/QR
- Recharts
- Zustand
- Phosphor icons
- Framer Motion
- Resend pour les emails

## Structure du projet

```text
apps/livo-app
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── scripts/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── types/
├── .env.example
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Instructions d'installation

Depuis la racine du monorepo :

```powershell
pnpm install
```

Depuis l'application :

```powershell
cd C:\Users\lenovo\LYSMA\apps\livo-app
pnpm install
```

## Instructions de lancement local

Generer le client Prisma :

```powershell
pnpm exec prisma generate
```

Lancer l'application locale :

```powershell
pnpm run dev
```

Le script `dev` lance Next.js sur le port `3003`.

Construire l'application :

```powershell
pnpm run build
```

Verifier TypeScript :

```powershell
pnpm run type-check
```

Valider la bibliotheque metier :

```powershell
pnpm run bibliotheque:validate
```

## Variables d'environnement detectees

Les noms suivants sont detectes dans le code ou `.env.example`. Les valeurs ne sont pas documentees ici.

| Variable | Usage detecte |
| --- | --- |
| `DATABASE_URL` | Connexion Prisma PostgreSQL. |
| `DIRECT_URL` | Connexion directe Prisma. |
| `AUTH_URL` | URL publique NextAuth. |
| `AUTH_SECRET` | Secret NextAuth et chiffrement de secours. |
| `NEXTAUTH_URL` | Compatibilite NextAuth. |
| `NEXTAUTH_SECRET` | Compatibilite NextAuth et chiffrement de secours. |
| `SECURITY_ENCRYPTION_KEY` | Chiffrement des secrets TOTP. |
| `RESEND_API_KEY` | Envoi emails. |
| `RESEND_FROM_EMAIL` | Expediteur emails. |
| `NEXT_PUBLIC_APP_URL` | URL publique utilisee cote client/PDF/liens. |
| `NEXT_PUBLIC_APP_NAME` | Nom public de l'application. |
| `SUPER_ADMIN_MESSAGES_URL` | Relais messages support vers super-admin. |
| `SUPER_ADMIN_CHATBOX_LOG_URL` | Relais logs chatbox. |
| `SUPER_ADMIN_CHATBOX_UPDATES_URL` | Synchronisation updates chatbox. |
| `SUPER_ADMIN_INBOUND_SECRET` | Secret partage super-admin. |
| `INTERNAL_API_KEY` | Protection des APIs internes. |
| `NODE_ENV` | Branches securite production/developpement. |

## Commandes Prisma

```powershell
pnpm exec prisma generate
pnpm exec prisma db push
pnpm exec prisma migrate dev
pnpm exec prisma studio
pnpm exec prisma db seed
```

Etat detecte : le schema Prisma est present, mais aucun dossier de migrations n'est versionne dans `prisma/migrations`.

## Limites connues

- Aucun test automatise detecte.
- Aucun historique de migration Prisma detecte.
- Pas de politiques RLS SQL detectees.
- Le paiement/abonnement commercial n'est pas implemente.
- Des roles existent dans Prisma, mais l'application filtre surtout par proprietaire de garage.
- Les rapports analytiques existent partiellement dans les composants, mais ne sont pas pleinement exposes dans la navigation actuelle.
