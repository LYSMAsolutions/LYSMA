# LYSMA Hub Site Vitrine

Module V1 de moteur de site vitrine configurable pour LYSMA.

Cette version reste volontairement simple : donnees mockees, rendu premium configurable, formulaire de contact valide cote API et assistant par mots-cles. Elle prepare le multi-client sans integrer Supabase, OpenAI, authentification ni back-office complexe.

## Document maitre produit

La vision produit, les priorites d'evolution et les limites a respecter sont documentees dans :

- `docs/PRODUCT_MASTER.md`

## Authentification V1 reelle

Le login de demonstration a ete remplace par une authentification serveur testable localement :

- `/register` : creation de compte client avec mot de passe hashe.
- `/verify-email` : validation email obligatoire avant connexion.
- `/login` : connexion par email et mot de passe.
- `/reset-password` : demande et finalisation de reinitialisation de mot de passe.
- `/dashboard/security` : resume des sessions actives et evenements securite.

Les sessions sont stockees dans un cookie `httpOnly`, signe cote serveur. Les mots de passe sont hashes avec `scrypt`.

Pour la V1 locale, le stockage auth est persiste dans `.next/lysma-hub-auth-store.json`. Ce stockage est volontairement remplacable par PostgreSQL / Supabase plus tard sans changer les points d'entree `getCurrentUser()`, `requireAuth()` et `requireClientSiteAccess()`.

Variables prevues :

- `LYSMA_AUTH_SECRET` : secret de signature des sessions, obligatoire en production.
- `RESEND_API_KEY` : active l'envoi reel des emails.
- `RESEND_FROM_EMAIL` : expediteur Resend.
- `NEXT_PUBLIC_LYSMA_HUB_URL` : URL publique utilisee pour les liens email.

Compte local seed :

- email : `client@carrosserie-mounier.fr`
- mot de passe : `LysmaDemo2026!`

## SiteConfig V2

Le moteur de sites clients accepte maintenant un modele plus generique :

- `mode: "singlePage" | "multiPage"` ;
- `navigation` personnalisable avec items, groupes, pages et anchors ;
- `pages` avec `path`, `parentId`, `seo`, ordre et affichage navigation ;
- `sections` toujours configurees par type ;
- `contentBlocks` pour composer des contenus generiques sans creer un composant metier ;
- `blocks` de type `text`, `featureGrid` et `cta`.

Routes supportees :

- `/site/[slug]` pour la page principale ;
- `/site/[slug]/[...path]` pour les futures pages et sous-pages.

Carrosserie Mounier reste la reference qualite, mais sa structure n'est plus imposee aux futurs sites.

## Onboarding creation de site

Le parcours de creation draft est disponible cote dashboard :

- `/dashboard/site/create` ;
- `/dashboard/site/onboarding` redirige vers `/dashboard/site/create` ;
- `/dashboard/site/create/preview?draftId=...`.

Le formulaire permet de choisir :

- monopage ou multipage ;
- identite entreprise ;
- slug ;
- logo par URL ;
- couleurs principales ;
- pages de base.

Le draft genere un `SiteConfig` V2 depuis `site-template.example.ts`, puis le stocke localement dans `.next/lysma-hub-site-drafts.json`.

Le stockage est isole par utilisateur connecte et reste remplacable plus tard par PostgreSQL / Supabase. Le paiement, le drag and drop complet, l'upload avance et l'avant/apres autonome ne sont pas inclus a ce stade.

## Edition des drafts

Les brouillons generes peuvent etre retrouves et modifies dans :

- `/dashboard/site/drafts` ;
- `/dashboard/site/drafts/[draftId]/edit`.

L'edition permet de modifier :

- identite du site ;
- couleurs ;
- logo par URL ;
- mode monopage / multipage ;
- pages, ordre, suppression et ajout de pages ;
- textes de base des sections ;
- libelles et liens de boutons ;
- blocs `contentBlocks` existants ;
- ajout de blocs texte simples.

Chaque lecture et chaque sauvegarde verifie cote serveur que le draft appartient bien a l'utilisateur connecte.

## Role des fichiers existants

Avant la V1, ce dossier contenait une vitrine statique autonome :

- `index.html` : landing statique historique du hub.
- `css/`, `js/`, `pages/`, `public/` : styles, scripts, pages et assets associes au statique.
- `dist/` : sortie generee par le build statique.
- `scripts/` : scripts locaux pour builder, servir et verifier le site statique.
- `package.json` : commandes statiques existantes, non modifiees pour cette V1.

La V1 configurable a ete ajoutee en parallele dans `app/`, `components/`, `data/` et `lib/`.

## Structure V1

- `app/page.tsx` : entree "LYSMA Hub Site Vitrine".
- `app/site/[slug]/page.tsx` : rendu d'un site client par slug.
- `app/api/contact/route.ts` : validation et reception de demandes contact.
- `app/api/assistant/route.ts` : reponse assistant par mots-cles.
- `components/site-renderer/` : renderer et sections configurables.
- `components/ui/` : composants UI simples.
- `data/demo-sites.ts` : sites mockes V1.
- `data/assistant-knowledge.ts` : regles de reponses assistant.
- `lib/site-types.ts` : types TypeScript du moteur.
- `lib/theme-utils.ts` : helpers theme, gradients, cartes, bordures et ombres.
- `lib/keyword-matcher.ts` : normalisation, scoring et fallback assistant.
- `lib/mail.ts` : fonction prete pour une future integration Resend.

## Ajouter un site

Ajouter une entree dans `data/demo-sites.ts` avec :

- `slug`
- `name`
- `baseline`
- `businessType`
- `theme`
- `pages`

Le site sera accessible via `/site/[slug]`, par exemple `/site/carrosserie-mounier`.

## Ajouter une section

Ajouter une section dans `pages[0].sections` :

```ts
{
  id: "services",
  type: "services",
  enabled: true,
  order: 3,
  data: { ... }
}
```

`SiteRenderer` trie les sections par `order`, ignore les sections desactivees et rend le composant correspondant au `type`.

## Ajouter une regle assistant

Ajouter une regle dans `data/assistant-knowledge.ts` :

```ts
{
  id: "client-devis",
  siteSlug: "carrosserie-mounier",
  keywords: ["devis", "prix", "tarif"],
  answer: "Reponse affichee a l'utilisateur.",
  action: { label: "Demander un devis", type: "contact" }
}
```

Le matcher normalise le message, retire les accents, compare les mots-cles et renvoie la meilleure reponse.

## Securite V1

- Donnees utilisateur nettoyees cote API.
- Longueurs limitees.
- Validation stricte des champs obligatoires.
- Validation simple de l'email.
- Aucun `dangerouslySetInnerHTML`.
- Aucune execution de contenu dynamique.
- Aucun envoi email reel sans configuration future.

## Lancer et tester

Les commandes historiques restent :

- `pnpm --filter site-vitrine-lysma-hub run dev`
- `pnpm --filter site-vitrine-lysma-hub run check`
- `pnpm --filter site-vitrine-lysma-hub run build`

Pour executer les routes `app/` Next.js, le module devra etre branche plus tard sur une configuration Next locale ou sur l'application hote choisie. Cette V1 n'a pas modifie `package.json`, conformement a la contrainte de perimetre.

## Limites V1

- Donnees mockees uniquement.
- Un seul site de demonstration.
- Pas d'upload photo.
- Pas d'interface admin.
- Pas d'envoi email reel.
- Assistant deterministe par mots-cles.
- Pas de base de donnees.

## Roadmap

V2 :

- Supabase.
- Espace admin client.
- Upload logo/photos.
- Gestion des pages depuis une interface.
- Base metier.
- Suggestions de prestations.
- Notifications clients.

V3 :

- Apprentissage collectif entre clients du meme metier.
- Validation des suggestions.
- Statistiques assistant.
- Option OpenAI.
