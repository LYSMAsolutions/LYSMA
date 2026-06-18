# ADN LYSMA v0.1

Date: 2026-06-11

## Selection retenue

| Famille | Choix |
| --- | --- |
| Sidebar | LYSMA rail anime |
| Hero | Application metier |
| Cards | KPI net |
| Boutons | Pill premium |
| Formulaires | Mobile atelier |
| Footer | Premium LYSMA |
| Layout | Mobile first |
| Motion | Sidebar expand |

## Direction generale

LYSMA doit construire une interface premium, propre, utile, avec une forte lisibilite metier.

La signature centrale est la sidebar compacte/extensible: un rail visible, dense, qui s'ouvre avec fluidite pour reveler les libelles, les sous-elements et le contexte. Cette animation devient un marqueur LYSMA, mais elle doit rester sobre, rapide et utile.

L'identite ne doit pas copier Linear, Vercel, Arc, Raycast ou les autres inspirations. Elle doit en retenir les qualites utiles: clarte, densite maitrisee, lisibilite operationnelle, sentiment premium et facilite d'action.

## Principes visuels

1. Lisibilite metier avant decoration.
2. Interfaces compactes mais jamais confuses.
3. Surfaces sombres, nettes, avec contrastes controles.
4. Accents lumineux reserves aux actions, etats actifs et informations importantes.
5. Cartes KPI simples, lisibles, immediatement comparables.
6. Boutons arrondis premium, courts, clairement hierarchises.
7. Formulaires tactiles et efficaces, adaptes aux usages tablette/mobile.
8. Footer premium discret, utile, coherent avec la marque.

## Sidebar LYSMA rail anime

La sidebar est le composant signature.

Comportement attendu:

- etat ferme: rail compact, icones visibles, faible largeur;
- etat ouvert: expansion fluide au survol ou au focus;
- labels qui apparaissent avec une transition courte;
- item actif visible sans agressivite;
- navigation utilisable au clavier;
- adaptation mobile sans pieger l'utilisateur.

La sidebar doit donner une sensation d'outil premium, pas de menu marketing.

## Hero application metier

Le hero LYSMA doit eviter l'effet landing page trop publicitaire.

Il doit:

- annoncer clairement le role de l'ecran ou du produit;
- montrer une mise en scene d'interface ou de dashboard;
- afficher des indicateurs utiles quand cela a du sens;
- privilegier un ton professionnel, direct, operationnel;
- garder un CTA principal et un CTA secondaire maximum.

Le hero est un outil d'orientation, pas une affiche.

## Cards KPI net

Les cards prioritaires sont les cards de mesure.

Elles doivent:

- mettre le chiffre ou l'etat au premier plan;
- afficher un libelle court;
- permettre la comparaison rapide;
- eviter les decorations inutiles;
- garder une hierarchie stable sur desktop, tablette et mobile.

Les cards editorial/service restent possibles pour les sites vitrines, mais elles ne definissent pas l'ADN principal.

## Boutons pill premium

Les boutons LYSMA doivent rester arrondis, propres et compacts.

Regles:

- primaire: action principale claire;
- secondaire: alternative non destructive;
- ghost: action contextuelle;
- outline: action visible mais non prioritaire;
- danger: action destructive, jamais decorative.

Les boutons ne doivent pas prendre trop de place dans les interfaces metier.

## Formulaires mobile atelier

Les formulaires doivent etre utilisables rapidement sur tablette, smartphone et poste atelier.

Attendus:

- champs larges;
- labels courts;
- messages d'erreur actionnables;
- zones tactiles confortables;
- etats succes/erreur/desactive visibles;
- peu de friction cognitive.

Les formulaires LYSMA doivent sentir le terrain: clairs, directs, robustes.

## Layout mobile first

Le layout doit fonctionner d'abord sur mobile/tablette, puis s'etendre vers desktop.

Priorites:

- navigation toujours accessible;
- contenu principal lisible sans zoom;
- actions importantes proches du contexte;
- densite adaptee au support;
- pas de dependance a un grand ecran pour comprendre l'interface.

Pour LIVO, ce choix est coherent avec les usages atelier.

## Motion sidebar expand

L'animation retenue est l'expansion de la sidebar.

Regles:

- duree courte;
- easing doux;
- pas d'effet gadget;
- respect de `prefers-reduced-motion`;
- l'animation doit aider a comprendre l'interface.

Les autres animations doivent rester secondaires: soft lift sur cards, focus discret sur boutons, transitions d'etat.

## Role de LIVO

LIVO reste le laboratoire officiel d'integration progressive.

Ordre recommande:

1. Tester la sidebar rail anime dans une surface non critique.
2. Tester les cards KPI net sur une page de demo ou un dashboard read-only.
3. Tester les formulaires mobile atelier sur un formulaire non sensible.
4. Integrer les boutons pill premium dans les pages marketing/AEO.
5. Mesurer les retours avant generalisation.

Interdictions:

- ne pas modifier l'authentification;
- ne pas modifier les permissions;
- ne pas modifier les calculs;
- ne pas modifier les routes;
- ne pas changer le comportement metier pendant une migration UI.

## Brief source

```txt
BRIEF ADN LYSMA - selection design-system-preview

Sidebar: LYSMA rail anime
Hero: Application metier
Cards: KPI net
Boutons: Pill premium
Formulaires: Mobile atelier
Footer: Premium LYSMA
Layout: Mobile first
Motion: Sidebar expand

Direction souhaitee:
- Construire une interface LYSMA premium, propre, utile, avec forte lisibilite metier.
- Garder la sidebar compacte/extensible comme signature centrale.
- Utiliser les composants selectionnes comme base du futur Design System LYSMA.
- Ne pas copier les inspirations; garder une identite LYSMA coherente.
- LIVO reste le laboratoire d integration progressive.
```
