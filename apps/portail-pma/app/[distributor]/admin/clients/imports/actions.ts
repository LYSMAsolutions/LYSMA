"use server";

import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import { revalidatePath } from "next/cache";

type ImportSummary = {
  totalRows: number;
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
  batchId?: string | null;
  mode?: "test" | "production";
};

export type ImportResult = {
  success: boolean;
  error: string | null;
  summary?: ImportSummary;
};

type DeleteResult = {
  success: boolean;
  error: string | null;
  deleted: number;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_ROWS = 10000;

const REQUIRED_HEADERS = [
  "code client",
  "nom client",
  "email",
  "representant",
  "adresse",
  "cp",
  "ville",
  "telephone fixe",
  "telephone mobile",
  "atc code",
  "code magasin",
] as const;

type ParsedRow = {
  code: string;
  name: string;
  billing_name: string;
  representative_name: string;
  email: string;
  phone: string;
  address_line_1: string;
  address_line_2: string;
  postal_code: string;
  city: string;
  store_code: string;
  atc_code: string;
};

function cleanRaw(value: string) {
  return value
    .replace(/^\uFEFF/, "")
    .replace(/\u0000/g, "")
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

function sanitizeText(value: string, maxLength: number) {
  return cleanRaw(value)
    .replace(/[<>`]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

function sanitizeCode(value: string, maxLength: number) {
  return cleanRaw(value)
    .toUpperCase()
    .replace(/[^A-Z0-9 _./-]/g, "")
    .slice(0, maxLength);
}

function sanitizeEmail(value: string) {
  const cleaned = cleanRaw(value).toLowerCase().slice(0, 160);
  if (!cleaned) return "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned) ? cleaned : "";
}

function sanitizePhone(value: string) {
  return cleanRaw(value)
    .replace(/[^\d+\s()./-]/g, "")
    .slice(0, 40);
}

function splitCsvLine(line: string, delimiter: string) {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (insideQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === delimiter && !insideQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result.map((item: any) => cleanRaw(item.replace(/^"|"$/g, "")));
}

function detectDelimiter(headerLine: string) {
  const semicolons = (headerLine.match(/;/g) || []).length;
  const commas = (headerLine.match(/,/g) || []).length;
  return semicolons > commas ? ";" : ",";
}

function getCell(cells: string[], index: number) {
  if (index < 0) return "";
  return String(cells[index] ?? "");
}

export async function importClientsCsvAction(
  distributor: string,
  _prevState: ImportResult,
  formData: FormData
): Promise<ImportResult> {
  const user = await requireAccess({
    allowedRoles: ["admin"],
    distributorSlug: distributor,
  });

  const modeRaw = String(formData.get("mode") ?? "test").trim().toLowerCase();
  const mode: "test" | "production" =
    modeRaw === "production" ? "production" : "test";

  const file = formData.get("file");

  if (!(file instanceof File))
    return { success: false, error: "Aucun fichier reçu." };

  if (!file.name.toLowerCase().endsWith(".csv"))
    return { success: false, error: "Le fichier doit être au format CSV." };

  if (file.size <= 0)
    return { success: false, error: "Le fichier est vide." };

  if (file.size > MAX_FILE_SIZE)
    return { success: false, error: "Le fichier dépasse la taille maximale autorisée de 5 Mo." };

  const rawText = await file.text();
  const text = rawText.replace(/^\uFEFF/, "").trim();

  if (!text) return { success: false, error: "Le fichier est vide." };

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  if (lines.length < 2)
    return { success: false, error: "Le fichier doit contenir un en-tête et au moins une ligne." };

  if (lines.length - 1 > MAX_ROWS)
    return { success: false, error: `Le fichier dépasse la limite autorisée de ${MAX_ROWS} lignes.` };

  const delimiter = detectDelimiter(lines[0]);
  const headers = splitCsvLine(lines[0], delimiter);
  const normalizedHeaders = headers.map((h) => h.trim().toLowerCase());

  const missingHeaders = REQUIRED_HEADERS.filter(
    (required) => !normalizedHeaders.includes(required)
  );

  if (missingHeaders.length > 0)
    return { success: false, error: "Colonnes manquantes : " + missingHeaders.join(", ") };

  const indexMap = Object.fromEntries(
    normalizedHeaders.map((header, i) => [header, i])
  ) as Record<string, number>;

  // "adresse 2" est optionnelle — si absente, index sera undefined → -1
  const adresse2Index = indexMap["adresse 2"] ?? -1;

  const [stores, atcs] = await Promise.all([
    prisma.stores.findMany({
      where: { distributor_id: user.distributorId },
      select: { id: true, code: true },
    }),
    prisma.users.findMany({
      where: { distributor_id: user.distributorId, roles: { is: { code: "atc" } } },
      select: { id: true, code: true },
    }),
  ]);

  const storeMap = new Map(stores.map((s) => [sanitizeCode(s.code, 50), s.id]));
  const atcMap   = new Map(atcs.filter((a) => !!a.code).map((a) => [sanitizeCode(String(a.code), 50), a.id]));

  const batch = await prisma.client_import_batches.create({
    data: {
      distributor_id:      user.distributorId,
      imported_by_user_id: user.id,
      mode,
      original_filename:   sanitizeText(file.name, 255) || null,
      total_rows:          lines.length - 1,
    },
    select: { id: true },
  });

  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (let index = 1; index < lines.length; index += 1) {
    const lineNumber = index + 1;
    const cells = splitCsvLine(lines[index], delimiter);

    const row: ParsedRow = {
      code:                 sanitizeCode(getCell(cells, indexMap["code client"]), 50),
      name:                 sanitizeText(getCell(cells, indexMap["nom client"]), 150),
      billing_name:         sanitizeText(getCell(cells, indexMap["nom client"]), 160),
      representative_name:  sanitizeText(getCell(cells, indexMap["representant"]), 160),
      email:                sanitizeEmail(getCell(cells, indexMap["email"])),
      phone:                sanitizePhone(
        getCell(cells, indexMap["telephone fixe"]) ||
        getCell(cells, indexMap["telephone mobile"])
      ),
      address_line_1:       sanitizeText(getCell(cells, indexMap["adresse"]), 200),
      address_line_2:       sanitizeText(getCell(cells, adresse2Index), 200),
      postal_code:          sanitizeText(getCell(cells, indexMap["cp"]), 20),
      city:                 sanitizeText(getCell(cells, indexMap["ville"]), 100),
      store_code:           sanitizeCode(getCell(cells, indexMap["code magasin"]), 50),
      atc_code:             sanitizeCode(getCell(cells, indexMap["atc code"]), 50),
    };

    if (!row.name) {
      skipped += 1;
      errors.push(`Ligne ${lineNumber} : nom client manquant.`);
      continue;
    }

    let storeId: string | null = null;
    let assignedUserId: string | null = null;

    if (row.store_code) {
      storeId = storeMap.get(row.store_code) ?? null;
      if (!storeId) {
        skipped += 1;
        errors.push(`Ligne ${lineNumber} : code magasin '${row.store_code}' introuvable.`);
        continue;
      }
    }

    if (row.atc_code) {
      assignedUserId = atcMap.get(row.atc_code) ?? null;
      if (!assignedUserId) {
        skipped += 1;
        errors.push(`Ligne ${lineNumber} : code ATC '${row.atc_code}' introuvable.`);
        continue;
      }
    }

    const existingClient = row.code
      ? await prisma.clients.findFirst({
          where: { distributor_id: user.distributorId, code: row.code },
          select: { id: true },
        })
      : null;

    if (existingClient) {
      if (mode === "test") {
        skipped += 1;
        errors.push(`Ligne ${lineNumber} : client '${row.code}' existant, mise à jour ignorée en mode test.`);
        continue;
      }

      await prisma.clients.update({
        where: { id: existingClient.id },
        data: {
          name:                 row.name,
          billing_name:         row.billing_name         || null,
          representative_name:  row.representative_name  || null,
          email:                row.email                || null,
          phone:                row.phone                || null,
          address_line_1:       row.address_line_1       || null,
          address_line_2:       row.address_line_2       || null,
          postal_code:          row.postal_code          || null,
          city:                 row.city                 || null,
          store_id:             storeId                  || null,
          assigned_user_id:     assignedUserId           || null,
        },
      });

      updated += 1;
      continue;
    }

    await prisma.clients.create({
      data: {
        distributor_id:         user.distributorId,
        code:                   row.code                 || null,
        name:                   row.name,
        billing_name:           row.billing_name         || null,
        representative_name:    row.representative_name  || null,
        email:                  row.email                || null,
        phone:                  row.phone                || null,
        address_line_1:         row.address_line_1       || null,
        address_line_2:         row.address_line_2       || null,
        postal_code:            row.postal_code          || null,
        city:                   row.city                 || null,
        store_id:               storeId                  || null,
        assigned_user_id:       assignedUserId           || null,
        is_active:              true,
        created_import_batch_id: batch.id,
      },
    });

    created += 1;
  }

  await prisma.client_import_batches.update({
    where: { id: batch.id },
    data: {
      created_count: created,
      updated_count: updated,
      skipped_count: skipped,
      error_count:   errors.length,
    },
  });

  revalidatePath(`/${distributor}/admin/clients`);
  revalidatePath(`/${distributor}/admin/clients/imports`);

  return {
    success: true,
    error: null,
    summary: { totalRows: lines.length - 1, created, updated, skipped, errors, batchId: batch.id, mode },
  };
}

export async function deleteLastTestImportAction(
  distributor: string
): Promise<DeleteResult> {
  const user = await requireAccess({
    allowedRoles: ["admin"],
    distributorSlug: distributor,
  });

  const lastBatch = await prisma.client_import_batches.findFirst({
    where: {
      distributor_id:      user.distributorId,
      imported_by_user_id: user.id,
      mode:                "test",
    },
    orderBy: { created_at: "desc" },
    select:  { id: true },
  });

  if (!lastBatch)
    return { success: false, error: "Aucun lot de test récent à supprimer.", deleted: 0 };

  const clientsToDelete = await prisma.clients.findMany({
    where: { distributor_id: user.distributorId, created_import_batch_id: lastBatch.id },
    select: { id: true },
  });

  const deleted = clientsToDelete.length;

  if (deleted > 0) {
    await prisma.clients.deleteMany({
      where: { distributor_id: user.distributorId, created_import_batch_id: lastBatch.id },
    });
  }

  await prisma.client_import_batches.delete({ where: { id: lastBatch.id } });

  revalidatePath(`/${distributor}/admin/clients`);
  revalidatePath(`/${distributor}/admin/clients/imports`);

  return { success: true, error: null, deleted };
}