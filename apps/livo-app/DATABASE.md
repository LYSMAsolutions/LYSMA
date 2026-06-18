# Base de donnees

Audit realise le 2026-06-16 a partir de `prisma/schema.prisma`.

## Etat general

- ORM : Prisma.
- Base cible : PostgreSQL.
- Datasource : `DATABASE_URL`.
- URL directe : `DIRECT_URL`.
- Migrations detectees : aucune migration versionnee dans `prisma/migrations`.
- Seed detecte : `prisma/seed.ts`.
- RLS detectee dans le repo : aucune politique RLS SQL detectee.

## Enums

| Enum | Valeurs |
| --- | --- |
| `Role` | `SUPER_ADMIN`, `OWNER`, `MANAGER`, `COMPAGNON` |
| `SecurityTokenType` | `EMAIL_VERIFICATION`, `PASSWORD_RESET`, `TWO_FACTOR_LOGIN` |
| `SecurityAuditEvent` | Evenements inscription, verification email, login, reset, 2FA, session. |
| `TauxType` | `T1`, `T2`, `T3`, `T4`, `CARROSSERIE`, `PEINTURE`, `AUTRE` |
| `StatutFiche` | `EN_ATTENTE`, `EN_COURS`, `EN_PAUSE`, `TERMINEE`, `CLOTUREE`, `ANNULEE` |
| `StatutPointageFiche` | `EN_COURS`, `EN_PAUSE`, `TERMINE` |
| `StatutPointageJour` | `ABSENT`, `ARRIVE`, `EN_TRAVAIL`, `PAUSE_CAFE`, `PAUSE_DEJEUNER`, `PARTI` |
| `TypeAbsence` | `CONGE_PAYE`, `RTT`, `ARRET_MALADIE`, `FORMATION`, `CONGE_SANS_SOLDE`, `AUTRE` |
| `StatutGarage` | `OUVERT`, `FERME`, `PAUSE` |
| `PointageAuditAction` | `CREATION`, `CORRECTION`, `VALIDATION`, `CONTESTATION` |
| `ReleveMensuelStatus` | `BROUILLON`, `A_VERIFIER`, `VALIDE`, `CONTESTE` |
| `ExternalWorkOrderSource` | `MANUEL`, `QR_CODE`, `API_EXTERNE` |
| `ExternalWorkOrderStatus` | `OUVERT`, `EN_COURS`, `EN_PAUSE`, `TERMINE`, `CLOTURE`, `ANNULE` |
| `ExternalPointageStatus` | `EN_COURS`, `EN_PAUSE`, `TERMINE` |

## Tables detectees

### `users`

Modele Prisma : `User`.

Colonnes principales :

- `id`
- `email`
- `emailVerified`
- `emailVerifiedAt`
- `nom`
- `prenom`
- `telephone`
- `role`
- `passwordHash`
- `passwordChangedAt`
- `twoFactorEnabled`
- `twoFactorSecretEncrypted`
- `twoFactorConfirmedAt`
- `recoveryCodesHash`
- `failedLoginCount`
- `lockedUntil`
- `sessionVersion`
- `avatarUrl`
- `actif`
- `createdAt`
- `updatedAt`

Relations :

- `accounts`
- `sessions`
- `garages`
- `compagnons`
- `securityTokens`
- `securityAuditLogs`
- `trustedDevices`
- `pointageAuditLogs`
- `monthlyReviewsValidated`

Contraintes :

- `email` unique.

### `accounts`

Modele Prisma : `Account`.

Colonnes principales :

- `id`
- `userId`
- `type`
- `provider`
- `providerAccountId`
- tokens OAuth standards.

Relations :

- appartient a `User`.

Contraintes :

- unique `provider`, `providerAccountId`.

### `sessions`

Modele Prisma : `Session`.

Colonnes principales :

- `id`
- `sessionToken`
- `userId`
- `expires`

Relations :

- appartient a `User`.

Contraintes :

- `sessionToken` unique.

### `verification_tokens`

Modele Prisma : `VerificationToken`.

Colonnes :

- `identifier`
- `token`
- `expires`

Contraintes :

- `token` unique.
- unique `identifier`, `token`.

### `security_tokens`

Modele Prisma : `SecurityToken`.

Colonnes :

- `id`
- `type`
- `tokenHash`
- `expiresAt`
- `usedAt`
- `createdAt`
- `userId`

Contraintes :

- `tokenHash` unique.
- index `userId`, `type`, `expiresAt`.

### `security_audit_logs`

Modele Prisma : `SecurityAuditLog`.

Colonnes :

- `id`
- `event`
- `ip`
- `userAgent`
- `metadata`
- `createdAt`
- `userId`

Contraintes :

- index `userId`, `createdAt`.
- index `event`, `createdAt`.

### `rate_limit_buckets`

Modele Prisma : `RateLimitBucket`.

Colonnes :

- `id`
- `key`
- `count`
- `resetAt`
- `blockedUntil`
- `updatedAt`

Contraintes :

- `key` unique.
- index `resetAt`.

### `trusted_devices`

Modele Prisma : `TrustedDevice`.

Colonnes :

- `id`
- `tokenHash`
- `label`
- `ip`
- `userAgent`
- `expiresAt`
- `lastUsedAt`
- `revokedAt`
- `createdAt`
- `userId`

Contraintes :

- `tokenHash` unique.
- index `userId`, `expiresAt`.
- index `revokedAt`.

### `garages`

Modele Prisma : `Garage`.

Colonnes principales :

- `id`
- `nom`
- `adresse`
- `ville`
- `codePostal`
- `telephone`
- `email`
- `siret`
- `logoUrl`
- `statutJour`
- `actif`
- `trialEndsAt`
- `abonnementActif`
- `passwordAtelier`
- `createdAt`
- `updatedAt`
- `ownerId`

Relations :

- appartient a `User` proprietaire.
- possede `TauxGarage`, `Compagnon`, `Vehicule`, `FicheTravaux`, `JourOuvert`, `PointageAuditLog`, `PointageMonthlyReview`, `ExternalWorkOrder`, `ExternalWorkOrderSyncLog`.

### `taux_garage`

Modele Prisma : `TauxGarage`.

Colonnes :

- `id`
- `type`
- `libelle`
- `montant`
- `actif`
- `pin`
- `garageId`

Contraintes :

- unique `garageId`, `type`.

### `jours_ouverts`

Modele Prisma : `JourOuvert`.

Colonnes :

- `id`
- `jourSemaine`
- `heureOuverture`
- `heureFermeture`
- `actif`
- `garageId`

Contraintes :

- unique `garageId`, `jourSemaine`.

### `compagnons`

Modele Prisma : `Compagnon`.

Colonnes :

- `id`
- `nom`
- `prenom`
- `matricule`
- `poste`
- `heuresContrat`
- `dateEntree`
- `dateSortie`
- `pin`
- `actif`
- `createdAt`
- `updatedAt`
- `userId`
- `garageId`

Relations :

- appartient a `Garage`.
- peut etre lie a `User`.
- possede pointages jour, pointages fiche, absences, audits, releves mensuels, OR externes assignes.

### `pointages_jour`

Modele Prisma : `PointageJour`.

Colonnes :

- `id`
- `date`
- `statutActuel`
- `heureArrivee`
- `heureDepart`
- `pauseCafeDebut`
- `pauseCafeFin`
- `pauseDejDebut`
- `pauseDejFin`
- `dureeMinutes`
- `notes`
- `createdAt`
- `updatedAt`
- `compagnonId`

Contraintes :

- unique `compagnonId`, `date`.

### `vehicules`

Modele Prisma : `Vehicule`.

Colonnes :

- `id`
- `immatriculation`
- `marque`
- `modele`
- `vin`
- `annee`
- `clientNom`
- `clientPrenom`
- `clientTel`
- `clientEmail`
- `notes`
- `createdAt`
- `updatedAt`
- `garageId`

Relations :

- appartient a `Garage`.
- possede des `FicheTravaux`.

### `fiches_travaux`

Modele Prisma : `FicheTravaux`.

Colonnes :

- `id`
- `numero`
- `statut`
- `travaux`
- `interventionsMetier`
- `notes`
- `tempsFacture`
- `tauxApplique`
- `montantHT`
- `tempsReel`
- `dateOuverture`
- `dateFermeture`
- `createdAt`
- `updatedAt`
- `garageId`
- `vehiculeId`

Relations :

- appartient a `Garage`.
- appartient a `Vehicule`.
- possede des `PointageFiche`.

Contraintes :

- unique `garageId`, `numero`.

Remarque : `interventionsMetier Json?` est optionnel. Les anciennes fiches sans ce champ peuvent rester valides cote Prisma.

### `pointages_fiche`

Modele Prisma : `PointageFiche`.

Colonnes :

- `id`
- `debutAt`
- `finAt`
- `dureeMinutes`
- `statut`
- `createdAt`
- `updatedAt`
- `compagnonId`
- `ficheId`

Relations :

- appartient a `Compagnon`.
- appartient a `FicheTravaux`.

### `pointage_audit_logs`

Modele Prisma : `PointageAuditLog`.

Colonnes :

- `id`
- `action`
- `targetType`
- `targetId`
- `field`
- `oldValue`
- `newValue`
- `motif`
- `ip`
- `userAgent`
- `createdAt`
- `garageId`
- `compagnonId`
- `pointageJourId`
- `pointageFicheId`
- `userId`

Contraintes :

- index `garageId`, `createdAt`.
- index `compagnonId`, `createdAt`.
- index `targetType`, `targetId`.

### `pointage_monthly_reviews`

Modele Prisma : `PointageMonthlyReview`.

Colonnes :

- `id`
- `mois`
- `annee`
- `status`
- `notes`
- `validatedAt`
- `contestedAt`
- `createdAt`
- `updatedAt`
- `garageId`
- `compagnonId`
- `validatedById`

Contraintes :

- unique `compagnonId`, `mois`, `annee`.
- index `garageId`, `annee`, `mois`.
- index `status`.

### `external_work_orders`

Modele Prisma : `ExternalWorkOrder`.

Colonnes :

- `id`
- `source`
- `externalNumber`
- `sourceSoftware`
- `clientName`
- `vehicleLabel`
- `immatriculation`
- `vin`
- `operation`
- `soldHours`
- `soldAmountHT`
- `tauxApplique`
- `tauxLibelle`
- `tauxHoraire`
- `status`
- `openedAt`
- `closedAt`
- `importMetadata`
- `createdAt`
- `updatedAt`
- `garageId`
- `assignedCompagnonId`

Contraintes :

- unique `garageId`, `source`, `externalNumber`.
- index `garageId`, `status`.
- index `externalNumber`.

### `external_work_order_pointages`

Modele Prisma : `ExternalWorkOrderPointage`.

Colonnes :

- `id`
- `debutAt`
- `finAt`
- `dureeMinutes`
- `statut`
- `createdAt`
- `updatedAt`
- `externalWorkOrderId`
- `compagnonId`

Contraintes :

- index `externalWorkOrderId`, `statut`.
- index `compagnonId`, `statut`.

### `external_work_order_sync_logs`

Modele Prisma : `ExternalWorkOrderSyncLog`.

Colonnes :

- `id`
- `action`
- `status`
- `message`
- `payload`
- `createdAt`
- `garageId`
- `externalWorkOrderId`

Contraintes :

- index `garageId`, `createdAt`.
- index `externalWorkOrderId`, `createdAt`.

### `absences`

Modele Prisma : `Absence`.

Colonnes :

- `id`
- `type`
- `dateDebut`
- `dateFin`
- `nbJours`
- `justificatif`
- `approuve`
- `notes`
- `deletedAt`
- `deletedBy`
- `restoredAt`
- `restoredBy`
- `createdAt`
- `updatedAt`
- `compagnonId`

Relations :

- appartient a `Compagnon`.

## Relations principales

```text
User 1--n Garage
User 1--n Session
User 1--n SecurityToken
Garage 1--n Compagnon
Garage 1--n Vehicule
Garage 1--n FicheTravaux
Garage 1--n TauxGarage
Vehicule 1--n FicheTravaux
Compagnon 1--n PointageJour
Compagnon 1--n PointageFiche
FicheTravaux 1--n PointageFiche
Compagnon 1--n Absence
Compagnon 1--n PointageMonthlyReview
Garage 1--n ExternalWorkOrder
ExternalWorkOrder 1--n ExternalWorkOrderPointage
```

## Contraintes et risques detectes

- Le schema contient une colonne optionnelle `interventionsMetier Json?`, ce qui limite le risque sur les anciennes fiches.
- L'absence de migrations versionnees rend les changements de base moins tracables.
- Aucune politique RLS n'est presente dans le repo.
- Le seed cree des donnees demo et affiche un mot de passe, mais les utilisateurs seedes ne semblent pas recevoir de `passwordHash`; le seed peut donc ne pas permettre une connexion directe.
- Les montants et heures utilisent des `Decimal`, ce qui est adapte aux calculs atelier.
- La majorite des relations de securite applicative reposent sur le filtrage Prisma par garage/proprietaire, pas sur des contraintes SQL avancees.
