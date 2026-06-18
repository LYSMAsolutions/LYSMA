# Fondation Design System LYSMA

Date: 2026-06-11

## Objectif

Construire une base commune pour les projets LYSMA sans casser l'existant. La fondation doit unifier les patterns, les layouts et les composants de base, mais elle ne doit pas imposer les memes couleurs a tous les produits.

## Perimetre analyse

- LIVO: `apps/livo-app`
- Super Admin: `apps/super-admin`
- LYSMA Hub: `apps/site-vitrine/lysma-hub`
- Carrosserie Mounier: `C:\Users\lenovo\carrosserie-mounier`

## Synthese

L'ADN LYSMA existe deja, mais il est disperse:

- Sidebar compacte extensible: presente dans LYSMA Hub, LIVO et Carrosserie Mounier.
- Surface premium sombre/translucide: forte dans LYSMA Hub et LIVO.
- CTA pill et actions rapides: forte dans Carrosserie Mounier et Hub.
- Cards metier: matures dans LIVO et Hub, tres expressives dans Mounier.
- Formulaires: robustes dans LIVO, plus simples dans Hub, fonctionnels dans Mounier.
- Super Admin: volontairement dense et utilitaire, utile pour les patterns d'administration mais pas comme reference visuelle principale.

## ADN retenu

La premiere direction officielle est documentee dans [ADN LYSMA v0.1](./adn-lysma.md).

Selection retenue:

- Sidebar: LYSMA rail anime
- Hero: Application metier
- Cards: KPI net
- Boutons: Pill premium
- Formulaires: Mobile atelier
- Footer: Premium LYSMA
- Layout: Mobile first
- Motion: Sidebar expand

## Choix de stabilite

Le design system est cree comme package autonome dans `packages/design-system`. Aucun composant existant n'est remplace, aucune route n'est modifiee et aucun comportement metier n'est touche.

## Architecture ajoutee

```txt
packages/design-system
  package.json
  tsconfig.json
  src/
    index.ts
    styles.css
    types.ts
    utils.ts
    components/
      ButtonLysma.tsx
      CardLysma.tsx
      FooterLysma.tsx
      FormLysma.tsx
      HeroLysma.tsx
      LayoutLysma.tsx
      SidebarLysma.tsx
```

## Composants de reference crees

- `SidebarLysma`: navigation compacte/extensible sans dependance Next.js.
- `HeroLysma`: hero produit ou marketing avec actions, metrics et media optionnel.
- `FooterLysma`: footer marque, navigation secondaire, liens legaux.
- `CardLysma`: carte surface/elevated/outlined/ghost.
- `LayoutLysma`: shell avec sidebar, header, contenu, footer.
- `FormLysma`: wrapper de formulaire, field, input et textarea.
- `ButtonLysma`: primitive necessaire pour Hero/Form/Card actions.

## Pourquoi pas `packages/ui` maintenant

Un package `ui` trop tot encouragerait le remplacement mecanique des composants existants. La meilleure trajectoire est:

1. `packages/design-system`: reference stable et experimentale.
2. LIVO: integration progressive page par page.
3. Extraction eventuelle de primitives plus basses dans `packages/ui` si deux apps les consomment reellement.
4. Ajout de `packages/layouts` et `packages/forms` seulement si les usages divergent trop dans le package principal.

## Risques

- Couplage premature aux routes Next.js: evite en ne dependent pas de `next/link`.
- Conflit d'icones entre lucide et Phosphor: evite en acceptant `ReactNode`.
- Regression visuelle: evitee car aucun import n'est ajoute dans les apps.
- Dissonance entre produits: controlee via tokens, tons et composants configurables.

## Rollback

Rollback complet:

```txt
supprimer packages/design-system
supprimer docs/design-system
```

Aucun comportement existant ne depend de ces fichiers tant qu'ils ne sont pas importes par une app.

## Regles d'adoption

- LIVO est le laboratoire officiel.
- Un remplacement doit avoir un gain clair: accessibilite, maintenance, coherence ou reduction de duplication.
- Ne jamais migrer une page metier sans verification visuelle et test du parcours.
- Ne jamais modifier l'authentification, les permissions, les donnees ou les calculs dans une migration UI.
