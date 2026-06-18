# LYSMA Design System

Fondation additive pour partager les patterns UI entre LYSMA Hub, LIVO, Super Admin, Carrosserie Mounier et les futurs projets.

Ce package ne remplace aucun composant existant. Il expose des composants de reference, sans dependance a Next.js ni a une librairie d'icones. Les projets peuvent les tester progressivement, en priorite dans LIVO.

## Utilisation cible

```tsx
import { CardLysma, HeroLysma, SidebarLysma } from "@lysma/design-system";
import "@lysma/design-system/styles.css";
```

## Principes de stabilite

- Ne pas importer globalement ce package dans une application sans test visuel.
- Ne pas remplacer une sidebar ou un layout existant tant que le flux metier n'a pas ete verifie.
- Garder les routes et les comportements actuels inchanges.
- LIVO est le laboratoire officiel avant generalisation aux autres projets.
