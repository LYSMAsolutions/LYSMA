# Roadmap contenus LIVO AEO

Date: 2026-06-11

## Priorite P0 - Pages piliers

| Page | Intention | Angle | Schema |
| --- | --- | --- | --- |
| `/suivi-atelier-automobile` | Definition et methode | Expliquer comment suivre heures, vehicules, OR et indicateurs | Article, FAQPage |
| `/logiciel-pointage-garage` | Choix outil | Pointage simple pour garages et carrosseries | SoftwareApplication, FAQPage |
| `/temps-vendu-vs-temps-reel` | Comparaison metier | Donnees necessaires, calcul, interpretation prudente | Article, FAQPage |
| `/suivi-heures-atelier` | Probleme central | Heures par compagnon, vehicule, intervention | Article, FAQPage |
| `/pilotage-atelier-garage` | Pilotage quotidien | Indicateurs et routines chef d'atelier | Article, FAQPage |

## Priorite P0 - Pages metier

| Page | Persona | Angle |
| --- | --- | --- |
| `/logiciel-chef-atelier-automobile` | Chef d'atelier | Suivre OR, vehicules, pointages et blocages |
| `/logiciel-carrosserie-suivi-heures` | Carrossier | Suivre vehicules multi-jours, phases et ecarts |
| `/logiciel-patron-garage-suivi-atelier` | Patron de garage | Voir l'activite sans remplacer le DMS |
| `/pointage-mecanicien-tablette` | Mecanicien | Pointer simplement sans complexite administrative |

## Priorite P1 - FAQ

Creer des FAQ visibles, courtes et non redondantes:

- LIVO remplace-t-il un DMS ?
- Comment fonctionne le pointage par OR ?
- Peut-on pointer sur tablette ?
- Peut-on pointer sur smartphone ?
- Qu'est-ce que le temps vendu ?
- Qu'est-ce que le temps reel ?
- Que se passe-t-il si le temps vendu n'est pas renseigne ?
- LIVO calcule-t-il automatiquement la rentabilite ?
- Qui decide des actions a partir des indicateurs ?
- Comment securiser les acces ?

## Priorite P1 - Guides

| Guide | Objectif | Notes |
| --- | --- | --- |
| Guide du pointage atelier en 30 minutes | Donner une methode simple | Tres concret, check-list |
| Guide des releves mensuels atelier | Expliquer consolidation des heures | Ne pas promettre conformite juridique exhaustive |
| Guide tablette atelier | Choisir terminal et emplacement | Inclure smartphone/ordinateur |
| Guide adoption equipe | Eviter perception de surveillance | Transparence et finalite operationnelle |
| Guide indicateurs atelier | Expliquer quoi mesurer | Distinguer mesure et decision |

## Priorite P1 - Comparatifs

| Comparatif | Angle editorial |
| --- | --- |
| Logiciel de pointage vs DMS | Complementarite, pas opposition artificielle |
| Badgeuse RH vs suivi atelier | Presence vs rattachement vehicule/OR |
| Tableur vs logiciel de pointage | Limites du manuel, risques d'erreurs |
| Papier vs tablette atelier | Fluidite et tracabilite, sans promettre productivite |
| ERP vs outil de suivi atelier | Perimetre et complexite |

## Priorite P2 - Cas d'usage

| Cas d'usage | Objectif |
| --- | --- |
| Garage 4 compagnons | Montrer pointage simple par journee |
| Carrosserie multi-vehicules | Montrer suivi d'interventions longues |
| OR externe avec QR code | Montrer rattachement au numero d'OR |
| Releve mensuel compagnon | Montrer consolidation heures/pauses/absences |
| Reseau de garages | Montrer harmonisation progressive |
| Chef des ventes + atelier | Montrer lecture partagee des vehicules |

## Modele de page pilier

1. H1 sous forme directe: "Suivi atelier automobile: comment suivre heures, vehicules et OR"
2. Reponse courte: 80 a 120 mots.
3. Definition simple.
4. Pourquoi le sujet est difficile en atelier.
5. Donnees a collecter.
6. Methode pas a pas.
7. Tableau "LIVO mesure / le responsable decide".
8. Limites et cas ou LIVO ne remplace pas le DMS.
9. FAQ.
10. Liens internes.

## Structure "LIVO mesure / le responsable decide"

| LIVO mesure ou structure | Le responsable decide |
| --- | --- |
| Heures pointees | Organisation de l'equipe |
| Temps rattache a un vehicule ou OR | Priorites atelier |
| Ecarts temps vendu vs temps reel | Analyse de cause et actions |
| Releves mensuels | Validation interne |
| Indicateurs par periode | Changement de process |

## Maillage interne recommande

- Toutes les pages metier renvoient vers les pages piliers.
- Toutes les pages comparatives renvoient vers "LIVO n'est pas un DMS".
- Chaque guide renvoie vers au moins une FAQ.
- La page d'accueil renvoie vers les 3 pages piliers P0 les plus importantes.
- Les pages AEO ne doivent pas toutes viser la conversion directe; certaines doivent etre purement explicatives.

## Backlog technique

- Corriger le mojibake des contenus LIVO avant publication massive.
- Ajouter une generation sitemap pour nouvelles pages publiques.
- Ajouter breadcrumbs sur pages profondes.
- Ajouter composants `HeroLysma`, `CardLysma` et `FormLysma` sur une page AEO pilote.
- Verifier chaque JSON-LD avec Rich Results Test avant mise en production.
- Suivre les impressions/questions dans Search Console.

## Mesure du succes

Indicateurs SEO/AEO:

- Pages indexees.
- Impressions sur requetes longues.
- Clics sur requetes "comment", "difference", "quel outil".
- Questions recurrentes dans Search Console.
- Citations ou reprises par assistants IA quand observables.

Indicateurs produit:

- Demandes de demo qualifiees.
- Questions entrantes plus precises.
- Moins de confusion "LIVO = DMS".
- Meilleure comprehension des limites du produit.
