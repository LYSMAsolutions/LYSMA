# LYSMA Hub - Document maitre produit

Ce document sert de reference produit pour les futures evolutions de LYSMA Hub.
Il ne decrit pas une refonte immediate : il fixe la vision, les priorites et les limites a respecter.

Perimetre concerne :

`apps/site-vitrine/lysma-hub`

## Vision LYSMA

LYSMA n'a pas vocation a devenir une agence web generaliste.

LYSMA developpe principalement :

- des applications web metier ;
- des outils SaaS ;
- des solutions numeriques professionnelles ;
- des sites vitrines premium.

Le coeur de LYSMA reste les outils metier et les applications web.

Les sites vitrines sont un produit important, mais complementaire.

## Principe fondateur

LYSMA ne developpe pas des outils uniquement parce qu'une idee semble interessante.

Un nouvel outil metier doit venir d'une comprehension suffisante du metier concerne, acquise par :

- experience professionnelle ;
- observation terrain ;
- immersion ;
- echanges avec les professionnels concernes.

LYSMA privilegie la resolution de problemes reels plutot que l'accumulation de fonctionnalites generiques.

## Positionnement

LYSMA n'est pas :

- une agence web generaliste ;
- un clone de Wix ;
- un clone de Shopify ;
- un outil de reservation ;
- un CRM ;
- un logiciel de facturation ;
- un ERP ;
- une plateforme e-commerce.

LYSMA est :

- une plateforme destinee aux professionnels de terrain ;
- un createur d'applications web metier ;
- un createur d'outils SaaS ;
- un createur de sites vitrines premium ;
- un partenaire numerique specialise.

## Etat actuel du projet

Deja en place dans LYSMA Hub :

- moteur `SiteConfig` ;
- moteur de rendu `/site/[slug]` ;
- site demo Carrosserie Mounier ;
- assistant simple par mots-cles ;
- API contact ;
- API assistant ;
- login V1 ;
- dashboard V1 ;
- roles `admin` et `client` ;
- `AppShell` ;
- sidebar LYSMA ;
- pages marketing multipages ;
- contenu centralise ;
- design premium LYSMA ;
- dashboard multi-pages ;
- protection dashboard V1.

Le projet n'est plus une vitrine monopage.

## Priorite 0 - Preserver les acquis

Avant toute modification :

- analyser l'existant ;
- identifier les composants deja en place ;
- reutiliser les fondations existantes ;
- eviter les doublons ;
- eviter les reecritures inutiles ;
- eviter les regressions.

Principes :

- evolution avant reecriture ;
- reutilisation avant remplacement ;
- ne pas refaire ce qui fonctionne deja.

## Priorite 1 - Authentification reelle

Le login actuel est une demonstration.

Mettre en place progressivement :

- inscription reelle ;
- verification email obligatoire via Resend ;
- mot de passe securise ;
- recuperation de mot de passe ;
- gestion de sessions ;
- controle d'acces reel ;
- parametres de securite.

Routes et parcours a prevoir :

- `/register` ;
- verification email ;
- reset password ;
- parametres securite.

Aucune connexion ne doit etre possible sans authentification valide.

## Priorite 2 - Securite plateforme

Mettre en place des fondations de securite robustes.

Principes :

- le front n'est jamais considere comme fiable ;
- toute validation importante se fait cote serveur ;
- toute donnee doit etre isolee par utilisateur et par site ;
- la securite doit etre forte par defaut.

A prevoir :

- protection API ;
- controle serveur ;
- separation stricte des utilisateurs ;
- sessions actives ;
- deconnexion des appareils ;
- logs securite ;
- protection brute-force ;
- rate limiting ;
- validation systematique ;
- authentification forte ;
- controle des permissions.

## Priorite 3 - Evolution du moteur SiteConfig

Le moteur actuel fonctionne et ne doit pas etre casse.

Objectif :

Faire evoluer le moteur vers une base generique de creation de sites vitrines premium.

Il ne doit plus etre centre sur Carrosserie Mounier ni sur un metier particulier.

Le moteur doit permettre :

- monopage ;
- multipage ;
- pages illimitees ;
- sous-pages ;
- navigation personnalisable ;
- groupes de navigation ;
- sections configurables ;
- blocs configurables ;
- personnalisation visuelle ;
- SEO de base ;
- previsualisation.

Le client doit pouvoir definir librement la structure de son site.

## Carrosserie Mounier

Carrosserie Mounier devient :

- la reference visuelle ;
- la reference UX ;
- la reference responsive ;
- la reference qualite ;
- la reference composants.

Mais Carrosserie Mounier ne doit pas devenir :

- une structure imposee ;
- un modele metier par defaut ;
- un placeholder generique.

Les futurs sites doivent pouvoir adopter leur propre structure.

## Site builder premium

Le moteur doit etre concu comme un Google Sites premium adapte a l'univers LYSMA.

Objectif :

Permettre a un professionnel de construire son propre site sans dependre d'une structure predeterminee.

Architecture cible :

- pages ;
- sous-pages ;
- sections ;
- blocs ;
- navigation ;
- previsualisation ;
- themes ;
- composants reutilisables.

L'architecture doit pouvoir supporter plus tard :

- drag and drop ;
- grille ;
- reperes verticaux ;
- reperes horizontaux ;
- alignement assiste ;
- snap-to-grid ;
- responsive preview.

Aucune fonctionnalite future ne doit necessiter une refonte complete du modele de donnees.

## Fonctionnalites reservees a LYSMA

Certaines fonctionnalites restent reservees aux creations realisees directement par LYSMA :

- effet avant/apres ;
- animations avancees ;
- composants metier specifiques ;
- developpements sur mesure ;
- accompagnement premium ;
- personnalisations avancees.

Ces fonctionnalites ne doivent pas etre integrees par defaut dans l'editeur autonome.

## Parcours client cible

1. Compte
2. Validation email
3. Creation du site
4. Previsualisation
5. Validation
6. Abonnement
7. Publication
8. Dashboard

Le paiement peut rester non branche pour le moment, mais son architecture doit etre prevue.

## Philosophie securite

Tout ce qui est visible doit etre simple.

Tout ce qui est invisible doit etre securise.

Toute fonctionnalite doit etre concue comme si elle etait exposee publiquement sur Internet.

La securite ne doit jamais reposer uniquement sur l'interface.

A prevoir a terme :

- appareils connectes ;
- sessions actives ;
- historique des connexions ;
- deconnexion a distance ;
- authentification a deux facteurs optionnelle ;
- gestion des appareils de confiance ;
- alertes de connexion inhabituelle.

Objectif :

Offrir un niveau de securite premium sans complexifier inutilement l'experience utilisateur.

## Regle de conduite pour les prochaines evolutions

Chaque evolution de LYSMA Hub doit respecter ces questions :

- Est-ce que cela resout un probleme reel ?
- Est-ce que cela preserve le moteur existant ?
- Est-ce que cela renforce la plateforme sans la rendre lourde ?
- Est-ce que la securite est verifiee cote serveur ?
- Est-ce que le client reste isole des autres clients ?
- Est-ce que le moteur SiteConfig reste generique ?
- Est-ce que Carrosserie Mounier reste une reference, pas une contrainte ?

Si la reponse est non, la fonctionnalite doit etre simplifiee, reportee ou redefinie.
