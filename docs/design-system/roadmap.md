# Roadmap Design System LYSMA

## Phase 0 - Fondation additive

Statut: fait dans cette passe.

- Creer `packages/design-system`.
- Ajouter composants de reference sans integration automatique.
- Documenter inventaire, doublons, risques et rollback.
- Garder les applications existantes intactes.

## Phase 1 - Laboratoire LIVO

Objectif: valider le design system sur des surfaces peu risquees.

Ordre recommande:

1. Page `/design` si elle reste interne.
2. Sidebar rail anime sur une surface non critique.
3. Cards KPI net sur dashboard read-only ou demo.
4. Formulaire mobile atelier hors auth et hors donnees sensibles.
5. Boutons pill premium sur pages marketing/AEO publiques.
6. Une page app read-only, apres verification des permissions.

Regles:

- Une migration = une page ou un composant a la fois.
- Avant/apres visuel obligatoire.
- Pas de changement des routes.
- Pas de changement des endpoints.
- Pas de changement des calculs.

## Phase 2 - Primitives stabilisees

Objectif: transformer les usages valides en primitives stables.

- Ajouter `BadgeLysma`.
- Ajouter `SectionTitleLysma`.
- Ajouter `TableLysma` seulement si Super Admin et LIVO convergent.
- Ajouter `EmptyStateLysma`.
- Ajouter `TabsLysma` pour rapports, dashboards et pages AEO.

## Phase 3 - Adoption Hub

Objectif: rapprocher le Hub du package sans perdre son rendu premium.

- Tester `HeroLysma` sur une page secondaire.
- Tester `FooterLysma` derriere feature branch.
- Garder `AppSidebar` Hub comme reference tant que `SidebarLysma` n'est pas visuellement equivalent.

## Phase 4 - Adoption Super Admin

Objectif: garder la densite admin.

- Ne pas imposer les cards marketing.
- Extraire plutot les patterns de shell, boutons, formulaires, et tables.
- Maintenir la logique console/status bar.

## Phase 5 - Sites vitrines

Objectif: reutiliser les patterns sans perdre l'identite client.

- Reprendre quick actions, hero, footer et cards.
- Garder les couleurs et assets propres a chaque client.
- Eviter les animations tilt sauf si elles sont testees mobile/reduced-motion.

## Architecture cible possible

Etat actuel recommande:

```txt
packages/design-system
```

Etat futur seulement si besoin reel:

```txt
packages/ui          # primitives bas niveau: Button, Card, Input, Badge
packages/layouts     # AppShell, Sidebar, Footer, Header
packages/forms       # Field, validation UI, messages
packages/design-system # tokens, guidelines, compositions LYSMA
```

Critere de scission: un package ne doit etre cree que si au moins deux projets consomment le meme type de composant et que la maintenance devient plus simple.

## Definition of Done pour une migration

- Aucun changement de route.
- Aucun changement d'API.
- Aucun changement de schema ou calcul.
- Build/type-check OK.
- Capture visuelle desktop et mobile.
- Verification manuelle du parcours.
- Rollback documente.

## Rollback par niveau

- Composant importe dans une page: retirer l'import et remettre l'ancien composant.
- Styles globaux: retirer `@lysma/design-system/styles.css`.
- Package complet: supprimer `packages/design-system` si aucune app ne l'importe.
