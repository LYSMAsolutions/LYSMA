# Inventaire composants LYSMA

Date: 2026-06-11

## Legende

- Maturite 1: brouillon ou tres specifique.
- Maturite 2: utilisable localement, peu generalisable.
- Maturite 3: stable dans son app.
- Maturite 4: bon candidat a mutualisation.
- Maturite 5: reference design system.

## LIVO

| Composant | Emplacement | Role | Reutilisabilite | Maturite | Dependances | Note |
| --- | --- | --- | --- | --- | --- | --- |
| Sidebar | `apps/livo-app/src/components/layout/Sidebar/Sidebar.tsx` | Navigation app atelier | Forte | 4 | Next Link, pathname, Phosphor, CSS modules | Meme pattern compact que Hub/Mounier. Libelles actuellement avec mojibake dans le fichier lu. |
| AppShell | `apps/livo-app/src/components/layout/AppShell/AppShell.tsx` | Shell protege, auth, garage, footer | Moyenne | 3 | `auth`, Prisma, redirects, Sidebar | Non mutualisable tel quel car tres lie aux regles metier. |
| Header | `apps/livo-app/src/components/layout/Header/Header.tsx` | En-tete pages app | Moyenne | 3 | CSS modules | Peut inspirer un header produit. |
| TrialBanner | `apps/livo-app/src/components/layout/TrialBanner` | Etat abonnement/essai | Faible | 3 | Metier LIVO | A garder local. |
| LivoChatbox | `apps/livo-app/src/components/layout/LivoChatbox` | Assistant/support | Moyenne | 3 | API chatbox, CSS modules | Pattern mutualisable plus tard, logique locale. |
| Button | `apps/livo-app/src/components/ui/Button` | Boutons avec variants, tailles, loading | Forte | 4 | CSS modules | Reference fonctionnelle pour `ButtonLysma`. |
| Card | `apps/livo-app/src/components/ui/Card` | Surface, header/body/footer | Forte | 4 | CSS modules | Reference structurelle. |
| Input | `apps/livo-app/src/components/ui/Input` | Input label/hint/error/icones | Forte | 4 | CSS modules | Bonne base formulaire. |
| Badge | `apps/livo-app/src/components/ui/Badge` | Etat/label | Forte | 3 | CSS modules | A unifier avec Hub. |
| Skeleton | `apps/livo-app/src/components/ui/Skeleton` | Chargement | Forte | 3 | CSS modules | Primitive utile plus tard. |
| PDFDownloadButton | `apps/livo-app/src/components/ui/PDFDownloadButton` | Export PDF | Faible | 3 | PDF LIVO | Reste local. |
| FicheCard | `apps/livo-app/src/components/atelier/FicheCard` | Carte fiche atelier | Moyenne | 3 | Metier atelier | Pattern card metier reutilisable, data locale. |
| CompagnonCard | `apps/livo-app/src/components/atelier/CompagnonCard` | Carte compagnon | Moyenne | 3 | Metier atelier | A harmoniser apres DS. |
| AtelierDashboard | `apps/livo-app/src/components/atelier/AtelierDashboard` | Dashboard atelier | Faible | 3 | Donnees/calculs | Ne pas toucher hors migration visuelle controlee. |
| RHClient / RapportsClient | `apps/livo-app/src/components/rh`, `components/rapports` | Rapports et RH | Faible | 3 | Calculs, exports | Zone sensible. |
| Pages marketing | `apps/livo-app/src/app/page.tsx` | Landing SEO/AEO | Forte | 3 | Next metadata, JSON-LD, Phosphor SSR | Laboratoire AEO prioritaire. |

## LYSMA Hub

| Composant | Emplacement | Role | Reutilisabilite | Maturite | Dependances | Note |
| --- | --- | --- | --- | --- | --- | --- |
| AppSidebar | `apps/site-vitrine/lysma-hub/components/layout/app-sidebar.tsx` | Sidebar premium compacte | Forte | 5 | Next Link/pathname, lucide | Reference visuelle principale avec Mounier. |
| AppShell | `apps/site-vitrine/lysma-hub/components/layout/app-shell.tsx` | Shell public/dashboard | Forte | 4 | Sidebar, footer, chatbox, cookies | Bonne structure mais trop globale pour package direct. |
| SiteHeader | `components/layout/site-header.tsx` | Header page simple | Forte | 4 | UiButtonLink | Pattern reutilisable. |
| SiteFooter | `components/layout/site-footer.tsx` | Footer marque | Forte | 4 | Navigation Hub | Reference footer marketing. |
| HeroSection | `components/sections/hero-section.tsx` | Hero premium avec panel metrics | Forte | 5 | Donnees `lysmaHome`, UI button | Reference `HeroLysma`. |
| SectionTitle | `components/ui/section-title.tsx` | Titre section | Forte | 4 | CSS global | A extraire plus tard. |
| UiCard/Card | `components/ui/Card.tsx` | Card globale | Forte | 4 | CSS global | Minimal et stable. |
| UiButton/Button | `components/ui/Button.tsx` | Bouton et bouton lien | Forte | 4 | Next Link pour UiButtonLink | Bonne separation button/link. |
| Input/Textarea | `components/ui/Input.tsx` | Formulaires simples | Moyenne | 3 | CSS global | Moins riche que LIVO. |
| Badge | `components/ui/badge.tsx` | Badge marketing | Forte | 3 | CSS global | A rapprocher de LIVO. |
| SiteRenderer sections | `components/site-renderer/*` | Sections sites generes | Moyenne | 3 | Types site | A mutualiser apres stabilisation du renderer. |
| FloatingAssistant / LysmaChatbox | `components/site-renderer/FloatingAssistant.tsx`, `layout/lysma-chatbox.tsx` | Assistant public | Moyenne | 3 | API assistant/chatbox | Pattern commun possible plus tard. |

## Super Admin

| Composant | Emplacement | Role | Reutilisabilite | Maturite | Dependances | Note |
| --- | --- | --- | --- | --- | --- | --- |
| Sidebar | `apps/super-admin/src/components/layout/Sidebar/Sidebar.tsx` | Navigation admin dense | Moyenne | 3 | Next, NextAuth, CSS modules | Reference densite admin, pas reference marketing. |
| Shell | `components/layout/Shell/Shell.tsx` | Layout admin fixe | Moyenne | 4 | Slots sidebar/header/status | Pattern shell robuste. |
| Header | `components/layout/Header/Header.tsx` | Barre chemin/actions/heure | Moyenne | 3 | Date locale | A garder admin. |
| StatusBar | `components/layout/StatusBar/StatusBar.tsx` | Barre etat bas de page | Faible | 3 | Donnees admin | Specifique Super Admin. |
| Pages admin | `apps/super-admin/src/app/(admin)/*` | Dashboards, tables, formulaires | Faible a moyenne | 2-3 | Prisma/API admin | Ne pas migrer en premier. |

## Carrosserie Mounier

| Composant | Emplacement | Role | Reutilisabilite | Maturite | Dependances | Note |
| --- | --- | --- | --- | --- | --- | --- |
| Site header/sidebar desktop | `C:\Users\lenovo\carrosserie-mounier\css\style.css` | Header qui devient sidebar fixe sur grands ecrans | Forte | 5 | CSS/JS navigation | Reference demandee pour sidebar LYSMA. |
| Main nav groups | `index.html`, `css/style.css`, `js/main.js` | Menus groupes + sous-menus | Forte | 4 | JS click/open | Pattern utile pour nav riche. |
| Hero premium/refined | `index.html`, `css/style.css` | Hero visuel atelier | Forte | 4 | Image atelier | Reference pour pages vitrines. |
| Quick actions | `index.html`, `css/style.css` | Telephone, itineraire, email, devis | Forte | 5 | Liens externes/mail/tel | Pattern action terrain tres reutilisable. |
| Prestation mini card | `css/style.css`, `js/main.js` | Card prestation avec tilt | Moyenne | 4 | JS pointer events, CSS variables | A reutiliser prudemment; animation optionnelle. |
| Side action | `css/style.css` | CTA compact icon + texte | Forte | 4 | CSS | Bonne reference CTA. |
| Contact form | `contact/index.html`, `css/style.css` | Formulaire contact | Moyenne | 3 | JS/local backend selon page | Pattern visuel, logique locale. |
| Accordion FAQ | `css/style.css`, `js/main.js` | FAQ ouvrable | Forte | 3 | JS DOM | A refaire en React si besoin. |
| Footer | `index.html`, `js/main.js`, `css/style.css` | Footer + signature LYSMA injectee | Moyenne | 3 | JS DOM | Bonne signature, pas a copier tel quel. |

## Doublons et variantes inutiles

| Zone | Doublon | Decision |
| --- | --- | --- |
| Button | LIVO Button, Hub Button/UiButton, Mounier `.btn`, Super Admin `.logoutBtn` | Creer `ButtonLysma` comme primitive, ne pas remplacer automatiquement. |
| Card | LIVO Card, Hub UiCard, Mounier prestation/service cards | Creer `CardLysma`; garder cards metier locales. |
| Sidebar | Hub, LIVO, Mounier, Super Admin | Creer `SidebarLysma` generique; tester d'abord sur une page LIVO non critique. |
| Form input | LIVO Input, Hub Input, Mounier `.input` | Creer `FormLysma`, `FieldLysma`, `InputLysma`, `TextareaLysma`. |
| Footer | LIVO AppShell footer, Hub SiteFooter, Mounier footer | Creer `FooterLysma` mais conserver les footers existants. |
| Hero | Hub HeroSection, LIVO landing hero, Mounier hero | Creer `HeroLysma` pour pages marketing/AEO LIVO. |
| Badges | Hub Badge, LIVO Badge, Mounier mini labels | Future primitive `BadgeLysma` a ajouter apres premiere adoption. |
| Chatbox | Hub, LIVO, Mounier | Mutualisation plus tard; trop lie aux APIs et consentement. |

## Composants mutualisables en priorite

1. `ButtonLysma`
2. `CardLysma`
3. `FormLysma` + fields
4. `HeroLysma`
5. `FooterLysma`
6. `SidebarLysma`
7. `BadgeLysma` et `SectionTitleLysma` dans une iteration suivante.

## Zones a ne pas mutualiser maintenant

- Calculs atelier LIVO.
- Authentification et permissions.
- Export PDF.
- Status bar Super Admin.
- Chatbox avec journalisation.
- Renderer de sites Hub tant que son contrat de donnees n'est pas stabilise.
