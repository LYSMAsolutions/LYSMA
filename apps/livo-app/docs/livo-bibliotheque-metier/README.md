# Bibliothèque Métier Automobile LIVO

## Vue d'ensemble

Base de données de **100 interventions courantes** pour garages automobiles multimarques, structurée pour créer des fiches de travail atelier LIVO sans procédure mécanicien détaillée.

## Structure d'un enregistrement

| Champ | Description |
|-------|-------------|
| `id` | Identifiant unique (ex: `FRE-001`) |
| `categorie` | Famille d'intervention |
| `intervention` | Nom normalisé de l'opération |
| `synonymes` | Mots-clés pour la recherche utilisateur |
| `pieces_suggerees` | Pièces ou consommables à prévoir |
| `controles_suggeres` | Contrôles utiles associés à l’intervention |
| `operations_fin` | Opérations simples de fin de fiche |
| `frequence` | Indicateur de fréquence (KPI) |

## Catégories et répartition

| Catégorie | Nombre | Préfixe |
|-----------|--------|---------|
| Entretien | 10 | ENT |
| Freinage | 8 | FRE |
| Pneumatiques | 6 | PNE |
| Distribution | 3 | DIS |
| Embrayage | 3 | EMB |
| Suspension | 8 | SUS |
| Direction | 4 | DIR |
| Climatisation | 5 | CLI |
| Diagnostic | 5 | DIA |
| Électricité | 7 | ELE |
| Injection | 6 | INJ |
| Échappement | 4 | ECH |
| Carrosserie | 4 | CAR |
| Vitrage | 3 | VIT |
| Préparation VO | 3 | VO |
| Contrôle technique | 2 | CT |
| Garantie | 1 | GAR |
| Divers | 18 | DIV |

## Niveaux de fréquence

- **Très fréquent** — quotidien en atelier
- **Fréquent** — hebdomadaire
- **Occasionnel** — mensuel
- **Rare** — quelques fois par an

## Règles métier respectées

- Aucune procédure constructeur détaillée
- Aucun couple de serrage
- Générique — utilisable toutes marques
- Variantes AV/AR/G/D incluses lorsque pertinent
- Contenu orienté "fiche de travail atelier", pas tutoriel mécanicien

## Fichier

- `interventions.json` — données V2 utilisées par l'application
- `interventions.source.json` — sauvegarde de la source V1 avant transformation
