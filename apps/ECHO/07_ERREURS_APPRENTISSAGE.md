# Erreurs et apprentissage

## Role du fichier

Ce fichier sert à noter les erreurs d'interprétation, les corrections, les limites rencontrées et les apprentissages d'ECHO.

Une erreur corrigée améliore la qualité de la mémoire.

Elle ne doit pas être masquée.

L'objectif n'est pas de rechercher la perfection mais d'améliorer progressivement la fiabilité du système.

---

## Principes

* reconnaître les erreurs explicitement ;
* conserver les corrections importantes ;
* éviter de répéter les mêmes erreurs ;
* améliorer les règles de fonctionnement ;
* distinguer une erreur ponctuelle d'un problème récurrent.

---

## Types d'erreurs a suivre

### Interpretation

* interprétation trop rapide ;
* interprétation trop générale ;
* interprétation basée sur trop peu d'éléments ;
* hypothèse présentée comme un fait.

### Classification

* confusion entre fait et hypothèse ;
* confusion entre préférence et décision ;
* confusion entre projet et idée ;
* mauvais niveau de sensibilité.

### Mémoire

* information oubliée ;
* information mémorisée à tort ;
* contradiction non signalée ;
* information obsolète non révisée.

### Dialogue

* question trop vague ;
* question inutile ;
* relance intrusive ;
* réponse trop longue ;
* réponse trop courte ;
* conseil trop direct sur un sujet sensible.

### Analyse

* faux positif : ECHO croit détecter quelque chose qui n'existe pas.
* faux négatif : ECHO ne détecte pas un élément pourtant important.

---

## Format recommande

Pour chaque entrée :

* identifiant ;
* date ;
* situation ;
* erreur observée ;
* correction de Mathieu ;
* règle à retenir ;
* impact sur la mémoire ;
* gravité : faible, moyenne, forte ;
* statut : corrigée, à surveiller, récurrente.

---

## Entrees

### ERR-0001

* date : 2026-06-17

### situation

Conception du système ECHO.

### erreur observee

Risque identifié : intégrer des déductions dans la mémoire validée sans validation explicite.

### correction de Mathieu

La mémoire validée doit contenir uniquement des informations confirmées.

### regle a retenir

Une hypothèse ne devient jamais une mémoire validée sans validation explicite.

### impact sur la memoire

Création d'une séparation stricte entre :

* mémoire validée ;
* hypothèses ;
* journal.

### gravite

forte

### statut

corrigee

---

### ERR-0002

* date : 2026-06-17

### situation

Construction du profil personnel.

### erreur observee

Certaines informations historiques peuvent être vraies mais ne pas avoir été récemment confirmées.

### correction de Mathieu

Les informations anciennes doivent pouvoir être marquées "à vérifier".

### regle a retenir

L'ancienneté d'une information influence son niveau de confiance.

### impact sur la memoire

Ajout de la catégorie "à vérifier".

### gravite

moyenne

### statut

corrigee

---

## Statistiques

### erreurs corrigees

0

### erreurs a surveiller

0

### erreurs recurrentes

0

### derniere revue

2026-06-17

---

## Regles derivees

Cette section contient les règles de fonctionnement apparues suite aux erreurs observées.

Aucune règle dérivée pour le moment.
