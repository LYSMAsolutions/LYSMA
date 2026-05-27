# Contexte Codex - Monorepo LYSMA

Ce document sert de passation pour reprendre le projet LYSMA dans un nouvel environnement, notamment sous Linux, sans avoir l'historique complet de conversation.

Instruction de reprise conseillee :

```text
Lis docs/CODEX_CONTEXT.md avant de toucher au projet.
Respecte les decisions existantes et ne casse pas le CSS des apps.
```

## Vue D'ensemble

Le repo `LYSMA` est un monorepo `pnpm` / Turborepo.

Applications principales :

- `apps/livo-app` : SaaS atelier automobile, garages et carrosseries.
- `apps/super-admin` : cockpit interne LYSMA pour piloter les clients, outils, finance, sites vitrines, messagerie et acces.
- `apps/portail-pma` : portail distributeur / PMA, encore en developpement.
- `apps/site-vitrine/*` : sites vitrines statiques, dont `lysma-hub` et `carrosserie-mounier`.
- `packages/db` : package Prisma partage pour `portail-pma`.

Commandes utiles depuis la racine :

```bash
pnpm install
pnpm --dir apps/livo-app run build
pnpm --dir apps/super-admin run build
pnpm --dir apps/site-vitrine/lysma-hub run build
pnpm --dir apps/site-vitrine/carrosserie-mounier run build
```

Sous Git Bash / Linux, eviter les chemins Windows avec backslash. Utiliser :

```bash
pnpm --dir apps/super-admin run db:push
```

et non :

```bash
pnpm --dir apps\super-admin run db:push
```

## Regles De Travail Importantes

- Ne pas casser le CSS existant : l'utilisateur y est tres sensible.
- Avant de modifier une page, relire les composants et styles deja utilises.
- Preferer les patterns existants aux refontes inventees.
- Ne pas remettre de fausses donnees dans les modules reels, sauf dans une page explicitement demo.
- Ne pas utiliser de donnees fictives dans le module Finance super-admin.
- Eviter les changements larges non demandes.
- Apres un `next build`, Next peut modifier `next-env.d.ts`. Le restaurer si ce n'est qu'un changement automatique.
- Prisma peut generer des fichiers suivis dans certains projets. Verifier `git status` apres `prisma generate` / build.
- Les fichiers visibles en francais doivent etre impeccables : accents, orthographe, grammaire, ponctuation.
- Sur Windows, des caracteres mal encodes sont deja apparus sous forme `mÃ©canique`, `â€™`, `â‚¬`. Toujours verifier avec :

```bash
rg -n "Ã|Â|â€™|â€œ|â€|�|â‚¬" apps/livo-app/src apps/super-admin/src apps/site-vitrine
```

## LIVO App

Chemin :

```text
apps/livo-app
```

Port local historique :

```text
3003
```

Role produit :

LIVO est un logiciel metier pour ateliers mecaniques et carrosseries. Il gere :

- pointage des compagnons ;
- arrivee atelier, pauses, depart fin de journee ;
- pointage sur fiches de travaux ;
- fiches de travail / OR ;
- vehicules et clients ;
- rentabilite atelier ;
- absences, conges et formations ;
- rapports ;
- export PDF de fiches avec QR code atelier ;
- espace atelier compagnon.

### HomePage LIVO

La homepage a ete refaite pour le SEO.

Fichiers importants :

- `apps/livo-app/src/app/page.tsx`
- `apps/livo-app/src/app/page.module.css`
- `apps/livo-app/src/app/layout.tsx`
- `apps/livo-app/src/app/sitemap.ts`
- `apps/livo-app/src/app/robots.ts`

Objectif SEO principal :

```text
Logiciel de pointage atelier mecanique et carrosserie
```

Meta title :

```text
Logiciel de pointage atelier mécanique | Livo
```

Meta description :

```text
Livo est un logiciel de gestion atelier pour garages et carrosseries : pointage des compagnons, suivi véhicules, fiches de travail et rentabilité atelier.
```

Le domaine de production est :

```text
https://livo-app.com
```

Verifier que `metadataBase`, `robots.ts`, `sitemap.ts` pointent bien vers `.com`.

### Cookies / Inscription

L'ouverture de compte doit etre bloquee si les cookies necessaires ne sont pas acceptes.

Fichiers :

- `apps/livo-app/src/app/cookies/page.tsx`
- `apps/livo-app/src/components/layout/CookieBanner/CookieBanner.tsx`
- `apps/livo-app/src/app/(auth)/inscription/page.tsx`
- `apps/livo-app/src/app/api/inscription/route.ts`

Cookies utilises :

- `livo-cookie-consent` dans `localStorage`
- `livo_cookie_consent` en cookie navigateur

### Demo Publique LIVO

Route :

```text
/demo
```

Fichiers :

- `apps/livo-app/src/app/demo/page.tsx`
- `apps/livo-app/src/app/demo/LivoDemoClient.tsx`
- `apps/livo-app/src/app/demo/page.module.css`
- `apps/livo-app/src/middleware.ts`

Decision importante :

La demo doit ressembler au vrai LIVO, pas a un dashboard invente.

La version actuelle reprend les vrais styles :

- `apps/livo-app/src/app/(atelier)/atelier-login/page.module.css`
- `apps/livo-app/src/components/atelier/AtelierDashboard/AtelierDashboard.module.css`

Parcours demo attendu :

1. Connexion atelier.
2. Selection compagnon.
3. Code PIN.
4. Arrivee atelier.
5. Pause cafe / pause dejeuner.
6. Pointage sur fiche.
7. Depointage.
8. Confirmation fin de journee.

Le PIN demo est :

```text
1234
```

Important :

- La demo ne doit appeler aucune API reelle.
- La demo ne doit rien enregistrer en base.
- Les donnees sont fictives et uniquement locales au composant.
- Elle doit garder le rendu exact de l'espace atelier autant que possible.

### Espace Atelier Reels

Fichiers importants :

- `apps/livo-app/src/app/(atelier)/atelier-login/page.tsx`
- `apps/livo-app/src/app/(atelier)/atelier-login/page.module.css`
- `apps/livo-app/src/app/(atelier)/atelier-dashboard/page.tsx`
- `apps/livo-app/src/components/atelier/AtelierDashboard/AtelierDashboardClient.tsx`
- `apps/livo-app/src/components/atelier/AtelierDashboard/AtelierDashboard.module.css`
- `apps/livo-app/src/components/atelier/FicheScanner/FicheScanner.tsx`

Le scanner QR a ete adapte pour le QR code sur PDF.

Le PDF fiche a ete modifie pour remplacer le code-barres par un QR code atelier.

Fichier PDF :

```text
apps/livo-app/src/lib/pdf/FichePDF.tsx
```

### Pointage Fin De Journee

Une protection existe sur "Depointer fin de journee" :

- confirmation obligatoire cote interface ;
- backend refuse le retour a "Arrive atelier" si la journee a deja ete cloturee.

Fichier backend :

```text
apps/livo-app/src/app/api/pointage-jour/action/route.ts
```

Message attendu :

```text
Votre journée a déjà été clôturée. Vous ne pouvez plus repointer en arrivée atelier aujourd’hui.
```

### Super-Admin Depuis LIVO

LIVO a une petite messagerie discrète vers le super-admin.

Fichiers :

- `apps/livo-app/src/components/layout/Header/Header.tsx`
- `apps/livo-app/src/app/api/support-message/route.ts`

Variables :

```env
SUPER_ADMIN_MESSAGES_URL=
SUPER_ADMIN_INBOUND_SECRET=
```

## Super Admin

Chemin :

```text
apps/super-admin
```

Role produit :

Cockpit interne LYSMA. Il doit permettre de controler les clients, outils, LIVO, PMA, sites vitrines, messagerie, root, finance et exports.

Port local historique :

```text
3010
```

Build :

```bash
pnpm --dir apps/super-admin run build
```

### Points De Vigilance Vercel

Probleme deja rencontre :

- fonction serverless trop lourde parce que des APIs root lisaient trop largement le monorepo / `.pnpm-store`.

Attention aux routes root / filesystem :

- `apps/super-admin/src/app/api/root/tree`
- `apps/super-admin/src/app/api/root/file`

Ne jamais embarquer tout le repo dans une route serverless.

### Finance / Expert-Comptable

Module cree dans `apps/super-admin`.

Objectif :

- revenus entrants ;
- abonnements clients ;
- charges LYSMA ;
- URSSAF estimee ;
- rentabilite ;
- exports pre-comptables PDF / Excel ;
- compatibilite future Sage / facture electronique / plateforme agreee.

Regle cruciale :

Ne pas afficher de donnees fictives dans Finance.

Si aucune charge n'existe :

```text
Aucune charge enregistrée
```

Si aucun revenu n'existe :

```text
Aucun revenu enregistré
```

Les essais gratuits ne doivent pas compter dans :

- CA mensuel ;
- CA annuel ;
- MRR reel ;
- rentabilite ;
- URSSAF ;
- exports comptables.

La devise est uniquement l'euro, format francais :

```text
349,00 €
19,00 € / mois
```

Email LYSMA a utiliser :

```text
lysmasolutions@gmail.com
```

Fichiers importants :

- `apps/super-admin/src/lib/finance-export.ts`
- pages sous `apps/super-admin/src/app/(admin)/finance`
- schema Prisma `apps/super-admin/prisma/schema.prisma`

### Sites Vitrines Dans Super Admin

Super-admin permet de gerer / preview / publier des sites vitrines.

Fichiers importants :

- `apps/super-admin/src/lib/site-vitrine.ts`
- `apps/super-admin/src/lib/publishing.ts`
- `apps/super-admin/src/app/(admin)/sites`
- `apps/super-admin/src/app/api/sites/[id]/content`
- `apps/super-admin/src/app/api/sites/[id]/upload`
- `apps/super-admin/src/app/preview/sites/[id]/[[...filePath]]`

Objectif long terme :

- modifier textes, couleurs, images, logo ;
- preview ;
- enregistrer ;
- pousser vers GitHub ;
- redeployer via Vercel.

Attention :

La mise a jour GitHub/Vercel doit etre geree prudemment. Ne pas pretendre que tout est automatique si les variables GitHub/Vercel ne sont pas configurees.

## Portail PMA

Chemin :

```text
apps/portail-pma
```

Etat :

Encore en developpement.

Objectif produit :

Portail distributeur avec espaces :

- admin ;
- ATC ;
- CDV ;
- RDM ;
- store ;
- magasinier / store staff ;
- store SAV.

Demandes fortes de l'utilisateur :

- chaque role doit avoir une interface propre, au niveau visuel de l'espace admin ;
- les sidebars doivent permettre une navigation propre ;
- le CDV peut voir les bons de ses ATC, clients, garanties/SAV, releves de parc ;
- le CDV peut creer des bons comme un ATC, avec creation attribuee au CDV ;
- le RDM peut gerer magasin / magasinier / clients / bons ;
- le magasinier passe par l'espace magasin puis selectionne son profil et son mot de passe ;
- le store SAV traite les bons SAV et contrats de maintenance.

Attention Prisma :

Toujours respecter le schema Prisma. Des erreurs ont deja ete causees par des champs inexistants :

- `store_id` au lieu d'une relation `stores` ;
- `magasin_id` inexistant.

Toujours relire `packages/db/prisma/schema.prisma` avant de modifier des queries PMA.

## Sites Vitrines

Chemin :

```text
apps/site-vitrine
```

Sites importants :

- `lysma-hub` : site vitrine LYSMA Solutions.
- `carrosserie-mounier` : site vitrine client / vitrine commerciale.
- `calculateur-eliquide` : present mais ne pas mettre en avant pour l'instant, trop complexe et pas assez mobile-friendly.

### lysma-hub

Site LYSMA Solutions.

Fichier principal :

```text
apps/site-vitrine/lysma-hub/index.html
```

Il a ete refait en version premium SaaS sobre :

- fond bleu profond ;
- cards premium ;
- section solutions ;
- apercus de sites / outils ;
- pas de fausses informations ;
- pas de faux temoignages ;
- pas de logos clients inventes.

Decision recente :

La section "realisations" doit afficher une card par site / outil.

Exemples :

- card `CARROSSERIE MOUNIER` avec preview ;
- card `LIVO` avec preview.

Pour LIVO, eviter un iframe live si `livo-app.com` bloque l'integration. Utiliser plutot un mockup statique propre.

Build site vitrine statique :

```bash
pnpm --dir apps/site-vitrine/lysma-hub run build
```

Important Vercel :

Ces sites generent dans `dist/`.

Ajouter / conserver :

```json
{
  "outputDirectory": "dist"
}
```

dans `vercel.json` du site concerne, sinon Vercel cherche `public`.

### carrosserie-mounier

Site statique normalise pour deploy Vercel.

Fichiers importants :

- `apps/site-vitrine/carrosserie-mounier/index.html`
- `apps/site-vitrine/carrosserie-mounier/css/style.css`
- `apps/site-vitrine/carrosserie-mounier/css/responsive.css`
- `apps/site-vitrine/carrosserie-mounier/package.json`
- `apps/site-vitrine/carrosserie-mounier/scripts/build-static-site.mjs`
- `apps/site-vitrine/carrosserie-mounier/vercel.json`

Vercel doit pointer vers `dist`.

## Vercel / DNS

Problemes deja rencontres :

### LIVO Prisma Engine

Erreur :

```text
ENOENT libquery_engine-rhel-openssl-3.0.x.so.node
```

Fix precedent :

- build `livo-app` doit lancer `prisma generate && next build`.
- verifier le schema Prisma et les binary targets si le probleme revient.

### Super Admin Function Size

Erreur :

```text
The Vercel Function "outils" is 589.75mb
```

Cause :

Routes root / outils embarquaient trop de fichiers.

Action :

Limiter les chemins lus par les routes filesystem et exclure `node_modules`, `.pnpm-store`, `.git`, `.next`, archives.

### Sites Statiques Output Directory

Erreur :

```text
No Output Directory named "public" found after the Build completed.
```

Fix :

```json
{
  "outputDirectory": "dist"
}
```

### DNS / HTTPS

Domaine LIVO :

```text
livo-app.com
```

OVH avait :

- `www` CNAME vers Vercel ;
- `@` A vers `216.198.79.1` ;
- TXT verification Vercel.

Si navigateur indique "Non securise", verifier :

- que le domaine est bien ajoute dans Vercel ;
- que le certificat Vercel est emis ;
- que `http://` redirige vers `https://` ;
- que les DNS ne pointent pas vers un ancien hebergement.

## Encodage

Probleme corrige dans `livo-app` :

- homepage ;
- layout metadata ;
- cookies ;
- politique confidentialite ;
- inscription ;
- messages scanner ;
- notifications ;
- erreurs API visibles.

Commande de verification :

```bash
rg -n "Ã|Â|â€™|â€œ|â€|�|â‚¬" apps/livo-app/src
```

S'il y a des resultats, corriger avant deploy.

## Git / Build Hygiene

Avant de finir une tache :

```bash
git status --short
```

Si un build a modifie `next-env.d.ts` automatiquement et que ce n'etait pas voulu :

```bash
git restore -- apps/livo-app/next-env.d.ts
```

ou equivalent pour l'app concernee.

Ne pas restaurer des fichiers modifies par l'utilisateur sans demande explicite.

## Ce Qui Reste Potentiellement A Faire

LIVO :

- verifier manuellement `/demo` sur mobile reel ;
- verifier que la demo publique est assez claire commercialement mais reste identique a l'atelier ;
- eventuellement ajouter un bouton depuis la homepage vers `/demo` si absent ;
- verifier l'ensemble des textes publics avant campagne Facebook / vente.

Super-admin :

- finaliser le pilotage total clients / outils / sites ;
- securiser les operations GitHub/Vercel ;
- ameliorer dashboard et page clients ;
- brancher proprement les integrations si variables configurees.

Portail PMA :

- continuer la finition des roles ;
- harmoniser le visuel de tous les espaces ;
- tester toutes les queries Prisma contre le schema ;
- raccorder au super-admin progressivement.

Sites vitrines :

- garder `lysma-hub` sans fausses preuves ;
- ne pas mettre en avant `calculateur-eliquide` tant que l'UX mobile n'est pas refaite ;
- maintenir `vercel.json` avec `outputDirectory: dist`.
