# Strategie AEO / SEO / IA LIVO

Date: 2026-06-11

## Objectif

Faire de LIVO une reference sur le suivi atelier automobile, le suivi des heures, le temps vendu vs temps reel, le suivi d'activite et le pilotage atelier, sans promettre de resultat que le logiciel ne garantit pas.

## Sources et principes SEO/IA

La strategie suit les recommandations officielles Google Search Central:

- L'optimisation pour les experiences IA de Google reste fondee sur les bonnes pratiques SEO, les contenus utiles et les pages indexables.
- Google insiste sur les contenus utiles, fiables, crees pour les personnes, avec expertise et valeur originale.
- Les donnees structurees aident les moteurs a comprendre les pages, sans garantir d'affichage enrichi.
- Les pages FAQ et SoftwareApplication doivent respecter les consignes de balisage et ne pas etre utilisees de facon abusive.

Sources:

- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- https://developers.google.com/search/docs/appearance/structured-data/faqpage
- https://developers.google.com/search/docs/appearance/structured-data/software-app

## Positionnement editorial

LIVO est:

- un outil de pointage atelier;
- un outil de suivi des heures reelles;
- un outil de rattachement du temps a un OR, une fiche ou un vehicule;
- un outil de releves mensuels et d'indicateurs;
- un support de comparaison temps vendu vs temps reel quand les donnees sont disponibles;
- utilisable sur tablette, smartphone et ordinateur.

LIVO n'est pas:

- un DMS;
- un ERP;
- un logiciel comptable;
- un logiciel de facturation;
- une garantie de chiffre d'affaires, rentabilite ou productivite.

## Regle de formulation

Toujours distinguer:

- Ce que LIVO mesure: heures pointees, vehicules, OR, ecarts, releves, indicateurs.
- Ce que LIVO rend visible: ecarts, retards, temps non affectes, volumes par compagnon ou intervention.
- Ce que l'utilisateur decide: organisation, facturation, recrutement, formation, affectation, process atelier.

Formulations autorisees:

- "LIVO aide a suivre les heures reelles."
- "LIVO rend les ecarts plus visibles."
- "LIVO permet de comparer temps vendu et temps reel lorsque les donnees sont renseignees."
- "LIVO fournit des indicateurs pour analyser l'activite atelier."

Formulations interdites:

- "LIVO augmente votre chiffre d'affaires."
- "LIVO augmente votre rentabilite."
- "LIVO rend vos mecaniciens plus productifs."
- "LIVO garantit moins de temps perdu."
- "LIVO remplace votre DMS."

## Architecture de contenu AEO

Chaque contenu doit etre facile a citer par une IA:

- Une reponse courte en haut de page.
- Un H1 clair et descriptif.
- Des H2 en questions reelles.
- Des paragraphes courts.
- Des definitions simples.
- Des tableaux "LIVO mesure / le responsable decide".
- Des exemples atelier concrets.
- Des limites explicites.
- Un bloc FAQ.
- JSON-LD adapte quand pertinent.

## Schema type d'une page AEO

1. Reponse directe en 3 a 5 phrases.
2. Definition du probleme atelier.
3. Donnees necessaires.
4. Methode de suivi.
5. Ce que LIVO peut mesurer.
6. Ce que LIVO ne decide pas.
7. Exemple concret.
8. FAQ courte.
9. Liens vers pages proches.

## Clusters prioritaires

| Cluster | Intention IA | Priorite | Angle LIVO |
| --- | --- | --- | --- |
| Suivi heures atelier | Comprendre comment pointer les heures reelles | P0 | Pointage compagnon, pauses, journee, intervention |
| Temps vendu vs temps reel | Comprendre les ecarts entre facture/devis et execution | P0 | Comparaison si donnees disponibles |
| Pilotage atelier | Savoir quoi regarder chaque jour/semaine/mois | P0 | Indicateurs et tableaux de suivi |
| OR et vehicules | Rattacher les heures a un support operationnel | P0 | OR externe, fiche, vehicule |
| Releves mensuels | Consolider temps, pauses, absences, validations | P1 | Exports/releves |
| Tablette atelier | Choisir le terminal adapte | P1 | Usage tablette/smartphone/ordinateur |
| DMS vs pointage | Eviter la confusion logicielle | P1 | Complement, pas remplacement |
| Reseaux de garages | Harmoniser le suivi multi-sites | P2 | Donnees comparables, sans imposer les decisions |

## Indicateurs de qualite AEO

- La page repond a une question metier precise.
- La reponse peut etre resumee sans perdre son sens.
- Les limites du logiciel sont explicites.
- Les exemples sont lies a un garage, une carrosserie, un OR ou un vehicule.
- Le contenu ne promet pas de gain automatique.
- Les entites sont coherentes: LIVO, LYSMA Solutions, garage, atelier, compagnon, OR, vehicule, temps vendu, temps reel.

## Opportunites techniques LIVO

Deja present dans `apps/livo-app/src/app/page.tsx`:

- Metadata Next.
- Canonical.
- SoftwareApplication JSON-LD.
- Organization JSON-LD.
- FAQPage JSON-LD.

A renforcer progressivement:

- Pages piliers dediees avec canonical propre.
- Breadcrumb JSON-LD sur pages profondes.
- FAQ JSON-LD uniquement pour FAQ visibles.
- Liens internes entre pages AEO.
- Sitemap mis a jour automatiquement pour nouvelles pages publiques.
- Correction future du mojibake pour fiabilite editoriale.
