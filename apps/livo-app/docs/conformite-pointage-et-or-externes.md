# Conformité pointage et OR externes

Ce document sert de cadrage interne pour renforcer LIVO comme outil sérieux de suivi du temps de travail, de preuve des heures travaillées et de pilotage de rentabilité atelier.

## Objectif conformité

LIVO doit permettre à un garage ou à une carrosserie de produire un suivi du temps de travail exploitable en cas de contrôle, de litige ou de demande prud’homale.

Le système doit rester :

- objectif : les horaires viennent d’actions de pointage datées ;
- fiable : les calculs sont cohérents et reproductibles ;
- accessible : les exports PDF sont lisibles et compréhensibles ;
- traçable : les actions sensibles sont rattachées à un utilisateur ou à un compagnon identifié ;
- défendable : les documents précisent la période, le salarié, l’entreprise, les pauses, les totaux, le statut de validation et la base légale.

## Points déjà couverts

- Pointage arrivée atelier.
- Pointage fin de journée avec confirmation obligatoire.
- Blocage du retour à l’état “Arrivé atelier” après clôture de journée.
- Pauses café et déjeuner.
- Calcul du temps travaillé en retirant les pauses.
- Pointage sur fiche de travail.
- Calcul du temps réel par fiche.
- Export PDF mensuel par compagnon.
- Accès sécurisé côté serveur aux exports.
- Journal d’audit des actions de pointage jour, pointage fiche et OR externe.
- Validation mensuelle du relevé avec statut : brouillon, à vérifier, validé, contesté.
- Reprise du statut de validation mensuelle dans le PDF de pointage.

## Points à renforcer plus tard

- Écran dédié à la consultation fine du journal d’audit.
- Correction manuelle d’horaires avec formulaire dédié et motif obligatoire.
- Signature numérique avancée ou validation horodatée renforcée.
- Politique de conservation paramétrable.
- Alertes repos quotidien, repos hebdomadaire et dépassements horaires.
- Mode hors ligne atelier avec synchronisation tracée.

## OR externe / fiche externe

LIVO ne doit pas obliger un garage à recréer ses ordres de réparation si le garage utilise déjà un logiciel métier.

LIVO doit pouvoir devenir la couche de pointage, de preuve, de temps réel et de rentabilité, même lorsque l’OR vient d’un autre outil.

### Ce qui est en place

- Modèle `ExternalWorkOrder` pour enregistrer un OR externe.
- Saisie d’un numéro d’OR externe depuis l’administration, sans obligation de recréer l’OR complet.
- Création automatique d’une fiche miroir depuis l’espace atelier à partir du seul numéro OR.
- Prévention des doublons par garage, source et numéro d’OR externe.
- Modèle `ExternalWorkOrderPointage` pour rattacher les temps réels aux OR externes.
- API interne de pointage sur OR externe.
- Calcul simple du temps vendu, du temps réel, de l’écart et du statut de rentabilité.
- Journalisation des créations et actions dans `ExternalWorkOrderSyncLog` et `PointageAuditLog`.
- Navigation administrateur “OR externes”.

## Positionnement produit définitif

LIVO ne doit pas devenir un second logiciel OR.

Le logiciel métier du garage reste la source principale de l’ordre de réparation. LIVO conserve une fiche miroir interne uniquement pour mesurer, tracer et analyser le temps réel.

La fiche miroir existe pour :

- rattacher les pointages ;
- conserver le temps réel ;
- conserver le temps vendu si disponible ;
- calculer les écarts ;
- calculer la rentabilité ;
- produire des statistiques ;
- produire une preuve de suivi.

Elle ne remplace jamais l’OR original.

### Objectif utilisateur

Le compagnon doit pouvoir, à terme :

- scanner un QR code présent sur un OR externe ;
- saisir manuellement un numéro d’OR externe ;
- retrouver ou créer automatiquement la fiche miroir dans LIVO sans recréer une fiche complète ;
- pointer son temps réel sur cet OR ;
- arrêter son pointage simplement.

### Objectif administrateur

L’administrateur doit pouvoir :

- voir les OR externes dans LIVO ;
- rattacher un OR externe à un véhicule, un client et éventuellement un compagnon ;
- saisir ou importer le temps vendu ;
- suivre le temps réel ;
- comparer temps vendu et temps réel ;
- clôturer l’OR dans LIVO ;
- conserver l’historique des interventions ;
- exporter les données de rentabilité.

### Données minimales prévues

- Identifiant interne LIVO.
- Source : manuel, QR code, API externe.
- Numéro OR externe.
- Logiciel source.
- Client.
- Véhicule.
- Immatriculation.
- VIN si disponible.
- Opération ou description.
- Temps vendu.
- Montant vendu si disponible.
- Statut.
- Date d’ouverture.
- Date de clôture.
- Métadonnées d’import.
- Historique de synchronisation.

## QR code et API future

La structure est prête pour une évolution QR code / API, mais aucune API publique dangereuse n’a été exposée.

### Format QR cible

Le QR code cible doit pouvoir contenir :

```json
{
  "type": "livo_external_or",
  "sourceSoftware": "logiciel-partenaire",
  "garageExternalId": "GARAGE-001",
  "externalNumber": "OR-2026-1487",
  "token": "jeton-signe-court"
}
```

En phase actuelle, l’espace atelier permet déjà de saisir le numéro OR. Le scan QR complet sera branché ensuite sur cette même route interne de fiche miroir.

Une future API LIVO devra permettre aux logiciels métier garage de synchroniser un OR avec LIVO.

Elle devra couvrir :

- création ou mise à jour d’un OR externe ;
- génération d’un QR code compatible LIVO ;
- transmission du numéro OR, client, véhicule, immatriculation, VIN, opération, temps vendu, montant vendu, date et statut ;
- prévention des doublons par clé unique : garage + source + numéro OR externe ;
- sécurisation par clé API ;
- journalisation des appels ;
- limitation de débit ;
- rejet des données incomplètes ou incohérentes.

### Fondations de sécurité attendues pour l’API partenaire

- Une clé API par partenaire.
- Une clé API ou un rattachement explicite par garage.
- Validation stricte du payload.
- Isolation stricte par garage.
- Journalisation de chaque appel.
- Limitation de débit.
- Aucune suppression destructive via API.
- Mise à jour idempotente pour éviter les doublons.

## Principe de simplicité atelier

Le compagnon ne doit pas subir la complexité de l’intégration.

Il doit seulement :

1. scanner l’OR ou saisir son numéro ;
2. vérifier que le bon véhicule apparaît ;
3. démarrer son pointage ;
4. arrêter son pointage.

Le reste doit être géré par l’administration LIVO et, plus tard, par l’API.
