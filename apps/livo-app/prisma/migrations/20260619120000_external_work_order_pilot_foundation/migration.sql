-- Migration additive préparée pour le pilote OR externe.
-- Ne supprime ni ne renomme aucun champ historique.

BEGIN;

CREATE TYPE "ExternalWorkOrderLineType" AS ENUM (
  'MAIN_OEUVRE',
  'PIECE',
  'FORFAIT',
  'SOUS_TRAITANCE',
  'AUTRE'
);

ALTER TABLE "fiches_travaux"
  ADD COLUMN "scanToken" TEXT;

CREATE UNIQUE INDEX "fiches_travaux_scanToken_key"
  ON "fiches_travaux"("scanToken");

ALTER TABLE "pointages_fiche"
  ADD COLUMN "context" JSONB;

CREATE TABLE "external_integration_partners" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "external_integration_partners_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "external_integration_partners_key_key"
  ON "external_integration_partners"("key");

CREATE TABLE "external_garage_integrations" (
  "id" TEXT NOT NULL,
  "externalGarageId" TEXT NOT NULL,
  "apiSecretEncrypted" TEXT NOT NULL,
  "qrSecretEncrypted" TEXT NOT NULL,
  "qrKeyId" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "lastImportedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "partnerId" TEXT NOT NULL,
  "garageId" TEXT NOT NULL,
  CONSTRAINT "external_garage_integrations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "external_garage_integrations_partnerId_externalGarageId_key"
  ON "external_garage_integrations"("partnerId", "externalGarageId");

CREATE UNIQUE INDEX "external_garage_integrations_partnerId_garageId_key"
  ON "external_garage_integrations"("partnerId", "garageId");

CREATE INDEX "external_garage_integrations_garageId_active_idx"
  ON "external_garage_integrations"("garageId", "active");

ALTER TABLE "external_garage_integrations"
  ADD CONSTRAINT "external_garage_integrations_partnerId_fkey"
  FOREIGN KEY ("partnerId") REFERENCES "external_integration_partners"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "external_garage_integrations"
  ADD CONSTRAINT "external_garage_integrations_garageId_fkey"
  FOREIGN KEY ("garageId") REFERENCES "garages"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "external_work_orders"
  ADD COLUMN "externalNumberNormalized" TEXT,
  ADD COLUMN "plannedHours" DECIMAL(6,2),
  ADD COLUMN "billedHours" DECIMAL(6,2),
  ADD COLUMN "billedAmountHT" DECIMAL(10,2),
  ADD COLUMN "laborAmountHT" DECIMAL(10,2),
  ADD COLUMN "billingHourlyRateHT" DECIMAL(10,2),
  ADD COLUMN "internalLaborCostRateHT" DECIMAL(10,2),
  ADD COLUMN "actualMinutes" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "externalId" TEXT,
  ADD COLUMN "externalRevision" INTEGER,
  ADD COLUMN "sourceUpdatedAt" TIMESTAMP(3),
  ADD COLUMN "lastImportedAt" TIMESTAMP(3),
  ADD COLUMN "closureComment" TEXT,
  ADD COLUMN "integrationId" TEXT;

-- Les anciens champs mélangeaient vendu et facturé. Ce backfill conserve
-- le comportement historique, sans prétendre reconstituer une distinction
-- qui n'existait pas dans les données source.
UPDATE "external_work_orders"
SET
  "billedHours" = "soldHours",
  "billedAmountHT" = "soldAmountHT",
  "billingHourlyRateHT" = "tauxHoraire"
WHERE
  "soldHours" IS NOT NULL
  OR "soldAmountHT" IS NOT NULL
  OR "tauxHoraire" IS NOT NULL;

UPDATE "external_work_orders" AS orders
SET "actualMinutes" = COALESCE(pointages.total_minutes, 0)
FROM (
  SELECT
    "externalWorkOrderId",
    SUM(COALESCE("dureeMinutes", 0))::INTEGER AS total_minutes
  FROM "external_work_order_pointages"
  WHERE "statut" = 'TERMINE'
  GROUP BY "externalWorkOrderId"
) AS pointages
WHERE orders."id" = pointages."externalWorkOrderId";

-- Une même saisie peut varier par la casse, les espaces ou les tirets.
-- La clé fonctionnelle ne conserve que les caractères alphanumériques.
UPDATE "external_work_orders"
SET "externalNumberNormalized" = COALESCE(
  NULLIF(regexp_replace(upper(trim("externalNumber")), '[^A-Z0-9]', '', 'g'), ''),
  upper(md5("id"))
);

-- Prépare une table de correspondance des éventuels doublons historiques.
-- Priorité à la révision la plus récente, puis au miroir API.
CREATE TEMP TABLE "_livo_external_order_duplicates" ON COMMIT DROP AS
WITH ranked AS (
  SELECT
    "id",
    FIRST_VALUE("id") OVER (
      PARTITION BY "garageId", "externalNumberNormalized"
      ORDER BY
        "externalRevision" DESC NULLS LAST,
        CASE "source"
          WHEN 'API_EXTERNE' THEN 0
          WHEN 'QR_CODE' THEN 1
          ELSE 2
        END,
        "updatedAt" DESC,
        "createdAt" ASC
    ) AS "keeperId",
    ROW_NUMBER() OVER (
      PARTITION BY "garageId", "externalNumberNormalized"
      ORDER BY
        "externalRevision" DESC NULLS LAST,
        CASE "source"
          WHEN 'API_EXTERNE' THEN 0
          WHEN 'QR_CODE' THEN 1
          ELSE 2
        END,
        "updatedAt" DESC,
        "createdAt" ASC
    ) AS "rowNumber"
  FROM "external_work_orders"
)
SELECT "id" AS "duplicateId", "keeperId"
FROM ranked
WHERE "rowNumber" > 1;

-- Complète le miroir conservé avec les éventuelles informations manquantes
-- présentes sur les doublons avant de les supprimer.
WITH merged AS (
  SELECT
    duplicates."keeperId",
    MAX(NULLIF(orders."clientName", '')) AS "clientName",
    MAX(NULLIF(orders."vehicleLabel", '')) AS "vehicleLabel",
    MAX(NULLIF(orders."immatriculation", '')) AS "immatriculation",
    MAX(NULLIF(orders."vin", '')) AS "vin",
    MAX(NULLIF(orders."operation", '')) AS "operation",
    MAX(orders."plannedHours") AS "plannedHours",
    MAX(orders."soldHours") AS "soldHours",
    MAX(orders."billedHours") AS "billedHours",
    MAX(orders."billedAmountHT") AS "billedAmountHT",
    MAX(orders."laborAmountHT") AS "laborAmountHT"
  FROM "_livo_external_order_duplicates" AS duplicates
  JOIN "external_work_orders" AS orders
    ON orders."id" = duplicates."duplicateId"
  GROUP BY duplicates."keeperId"
)
UPDATE "external_work_orders" AS keeper
SET
  "clientName" = COALESCE(keeper."clientName", merged."clientName"),
  "vehicleLabel" = COALESCE(keeper."vehicleLabel", merged."vehicleLabel"),
  "immatriculation" = COALESCE(keeper."immatriculation", merged."immatriculation"),
  "vin" = COALESCE(keeper."vin", merged."vin"),
  "operation" = COALESCE(keeper."operation", merged."operation"),
  "plannedHours" = COALESCE(keeper."plannedHours", merged."plannedHours"),
  "soldHours" = COALESCE(keeper."soldHours", merged."soldHours"),
  "billedHours" = COALESCE(keeper."billedHours", merged."billedHours"),
  "billedAmountHT" = COALESCE(keeper."billedAmountHT", merged."billedAmountHT"),
  "laborAmountHT" = COALESCE(keeper."laborAmountHT", merged."laborAmountHT")
FROM merged
WHERE keeper."id" = merged."keeperId";

UPDATE "external_work_order_pointages" AS pointages
SET "externalWorkOrderId" = duplicates."keeperId"
FROM "_livo_external_order_duplicates" AS duplicates
WHERE pointages."externalWorkOrderId" = duplicates."duplicateId";

UPDATE "external_work_order_sync_logs" AS logs
SET "externalWorkOrderId" = duplicates."keeperId"
FROM "_livo_external_order_duplicates" AS duplicates
WHERE logs."externalWorkOrderId" = duplicates."duplicateId";

DELETE FROM "external_work_orders" AS orders
USING "_livo_external_order_duplicates" AS duplicates
WHERE orders."id" = duplicates."duplicateId";

ALTER TABLE "external_work_orders"
  ALTER COLUMN "externalNumberNormalized" SET NOT NULL;

DROP INDEX IF EXISTS "external_work_orders_garageId_source_externalNumber_key";

CREATE UNIQUE INDEX "external_work_orders_garageId_externalNumberNormalized_key"
  ON "external_work_orders"("garageId", "externalNumberNormalized");

CREATE UNIQUE INDEX "external_work_orders_integrationId_externalId_key"
  ON "external_work_orders"("integrationId", "externalId");

CREATE INDEX "external_work_orders_integrationId_externalRevision_idx"
  ON "external_work_orders"("integrationId", "externalRevision");

ALTER TABLE "external_work_orders"
  ADD CONSTRAINT "external_work_orders_integrationId_fkey"
  FOREIGN KEY ("integrationId") REFERENCES "external_garage_integrations"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "external_work_order_pointages"
  ADD COLUMN "context" JSONB;

CREATE TABLE "external_work_order_lines" (
  "id" TEXT NOT NULL,
  "externalLineId" TEXT NOT NULL,
  "position" INTEGER NOT NULL DEFAULT 0,
  "type" "ExternalWorkOrderLineType" NOT NULL DEFAULT 'AUTRE',
  "code" TEXT,
  "label" TEXT NOT NULL,
  "description" TEXT,
  "quantity" DECIMAL(10,3),
  "unit" TEXT,
  "plannedHours" DECIMAL(6,2),
  "soldHours" DECIMAL(6,2),
  "billedHours" DECIMAL(6,2),
  "unitPriceHT" DECIMAL(10,2),
  "billedAmountHT" DECIMAL(10,2),
  "costAmountHT" DECIMAL(10,2),
  "billingHourlyRateHT" DECIMAL(10,2),
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "externalWorkOrderId" TEXT NOT NULL,
  CONSTRAINT "external_work_order_lines_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "external_work_order_lines_externalWorkOrderId_externalLineId_key"
  ON "external_work_order_lines"("externalWorkOrderId", "externalLineId");

CREATE INDEX "external_work_order_lines_externalWorkOrderId_position_idx"
  ON "external_work_order_lines"("externalWorkOrderId", "position");

ALTER TABLE "external_work_order_lines"
  ADD CONSTRAINT "external_work_order_lines_externalWorkOrderId_fkey"
  FOREIGN KEY ("externalWorkOrderId") REFERENCES "external_work_orders"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "external_work_order_sync_logs"
  ADD COLUMN "eventId" TEXT,
  ADD COLUMN "idempotencyKey" TEXT,
  ADD COLUMN "nonce" TEXT,
  ADD COLUMN "requestHash" TEXT,
  ADD COLUMN "signatureValid" BOOLEAN,
  ADD COLUMN "externalRevision" INTEGER,
  ADD COLUMN "durationMs" INTEGER,
  ADD COLUMN "legacyFormat" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "integrationId" TEXT;

CREATE UNIQUE INDEX "external_work_order_sync_logs_integrationId_idempotencyKey_key"
  ON "external_work_order_sync_logs"("integrationId", "idempotencyKey");

CREATE UNIQUE INDEX "external_work_order_sync_logs_integrationId_nonce_key"
  ON "external_work_order_sync_logs"("integrationId", "nonce");

ALTER TABLE "external_work_order_sync_logs"
  ADD CONSTRAINT "external_work_order_sync_logs_integrationId_fkey"
  FOREIGN KEY ("integrationId") REFERENCES "external_garage_integrations"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;
