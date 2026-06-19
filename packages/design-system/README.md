# LYSMA Design System

Fondation additive pour partager les patterns UI entre LYSMA Hub, LIVO, Super Admin, Carrosserie Mounier et les futurs projets.

Ce package ne remplace aucun composant existant. Il expose des composants de reference, sans dependance a Next.js ni a une librairie d'icones. Les projets peuvent les tester progressivement, en priorite dans LIVO.

## Sidebar LYSMA par defaut

`SidebarLysma` reprend le modele valide sur le site public LIVO et constitue la reference pour les nouveaux outils et sites LYSMA :

- rail desktop de 78 px, extensible au survol ou au focus ;
- navigation simple ou organisee en groupes et sous-liens ;
- etat actif, badges et actions inferieures configurables ;
- drawer mobile masque par defaut jusqu'a 1024 px ;
- fermeture par croix, clic hors menu ou touche Echap ;
- blocage du scroll et piege de focus pendant l'ouverture mobile.

Les routes, libelles, icones et actions restent propres a chaque produit. Le composant fournit le comportement et le langage visuel communs, sans inventer de navigation metier.

## Utilisation cible

```tsx
import { CardLysma, HeroLysma, SidebarLysma } from "@lysma/design-system";
import "@lysma/design-system/styles.css";
```

```tsx
<SidebarLysma
  brand={{ name: "LYSMA", subtitle: "Produit", logo: <Logo />, href: "/" }}
  activeHref="/dashboard"
  navigation={[
    { href: "/dashboard", label: "Accueil", icon: <HomeIcon /> },
    {
      id: "produit",
      label: "Produit",
      icon: <ProductIcon />,
      items: [
        { href: "/fonctionnalites", label: "Fonctionnalites" },
        { href: "/integrations", label: "Integrations" },
      ],
    },
  ]}
/>
```

## Principes de stabilite

- Ne pas importer globalement ce package dans une application sans test visuel.
- Ne pas remplacer une sidebar ou un layout existant tant que le flux metier n'a pas ete verifie.
- Garder les routes et les comportements actuels inchanges.
- La sidebar publique LIVO est la reference validee avant generalisation aux autres projets.
