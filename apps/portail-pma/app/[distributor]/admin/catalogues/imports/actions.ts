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
  warnings: string[];
  unknownSupplierCodes: string[];
  mode: "test" | "production";
};

export type CatalogueImportResult = {
  success: boolean;
  error: string | null;
  summary?: ImportSummary;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_ROWS = 50000;
const REQUIRED_HEADERS = ["designation", "famille"] as const;
const VALID_FAMILIES = ["fournisseur","promo","operation_commerciale","interne","outillage","materiel"] as const;

type ParsedRow = {
  designation: string; famille: string; reference_interne: string;
  reference_fournisseur: string; code_facturation: string; marque: string;
  prix_ht: number | null; taux_tva: number | null; stock: number | null;
  code_fournisseur: string; code_catalogue: string; image_url: string; description: string;
};

function cleanRaw(value: string) {
  return value.replace(/^\uFEFF/,"").replace(/\u0000/g,"").replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,"").trim();
}
function sanitizeText(value: string, maxLength: number) {
  return cleanRaw(value).replace(/[<>`]/g,"").replace(/\s+/g," ").slice(0,maxLength);
}
function sanitizeCode(value: string, maxLength: number) {
  return cleanRaw(value).toUpperCase().replace(/[^A-Z0-9 _./-]/g,"").slice(0,maxLength);
}
function parseDecimal(value: string): number | null {
  const cleaned = cleanRaw(value).replace(",",".").replace(/[^\d.]/g,"");
  if (!cleaned) return null;
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}
function splitCsvLine(line: string, delimiter: string) {
  const result: string[] = [];
  let current = ""; let insideQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i]; const next = line[i+1];
    if (char === '"') { if (insideQuotes && next === '"') { current += '"'; i++; } else insideQuotes = !insideQuotes; continue; }
    if (char === delimiter && !insideQuotes) { result.push(current); current = ""; continue; }
    current += char;
  }
  result.push(current);
  return result.map((item) => cleanRaw(item.replace(/^"|"$/g,"")));
}
function detectDelimiter(headerLine: string) {
  return (headerLine.match(/;/g)||[]).length > (headerLine.match(/,/g)||[]).length ? ";" : ",";
}
function getCell(cells: string[], index: number) {
  if (index < 0) return "";
  return String(cells[index] ?? "");
}

export async function importCataloguesCsvAction(
  distributor: string,
  _prevState: CatalogueImportResult,
  formData: FormData
): Promise<CatalogueImportResult> {
  const user = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });

  const modeRaw = String(formData.get("mode") ?? "test").trim().toLowerCase();
  const mode: "test" | "production" = modeRaw === "production" ? "production" : "test";

  const file = formData.get("file");
  if (!(file instanceof File))   return { success: false, error: "Aucun fichier reçu." };
  if (!file.name.toLowerCase().endsWith(".csv")) return { success: false, error: "Le fichier doit être au format CSV." };
  if (file.size <= 0)            return { success: false, error: "Le fichier est vide." };
  if (file.size > MAX_FILE_SIZE) return { success: false, error: "Le fichier dépasse 10 Mo." };

  const rawText = await file.text();
  const text = rawText.replace(/^\uFEFF/,"").trim();
  if (!text) return { success: false, error: "Le fichier est vide." };

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return { success: false, error: "Le fichier doit contenir un en-tête et au moins une ligne." };
  if (lines.length - 1 > MAX_ROWS) return { success: false, error: `Le fichier dépasse la limite de ${MAX_ROWS} lignes.` };

  const delimiter = detectDelimiter(lines[0]);
  const headers = splitCsvLine(lines[0], delimiter);
  const normalizedHeaders = headers.map((h) => h.trim().toLowerCase());

  const missingHeaders = REQUIRED_HEADERS.filter((r) => !normalizedHeaders.includes(r));
  if (missingHeaders.length > 0)
    return { success: false, error: "Colonnes manquantes : " + missingHeaders.join(", ") };

  const indexMap = Object.fromEntries(normalizedHeaders.map((h, i) => [h, i])) as Record<string, number>;

  const [suppliers, catalogues] = await Promise.all([
    prisma.suppliers.findMany({ where: { distributor_id: user.distributorId }, select: { id: true, code: true, name: true } }),
    prisma.catalogues.findMany({ where: { distributor_id: user.distributorId }, select: { id: true, code: true } }),
  ]);

  const supplierMap  = new Map(suppliers.map((s) => [s.code.toUpperCase(), s.id]));
  const catalogueMap = new Map(catalogues.map((c) => [c.code.toUpperCase(), c.id]));

  let created = 0, updated = 0, skipped = 0;
  const errors: string[] = [];
  const warnings: string[] = [];
  const unknownSupplierCodes = new Set<string>();

  for (let index = 1; index < lines.length; index++) {
    const lineNumber = index + 1;
    const cells = splitCsvLine(lines[index], delimiter);

    const row: ParsedRow = {
      designation:           sanitizeText(getCell(cells, indexMap["designation"]),                    255),
      famille:               sanitizeText(getCell(cells, indexMap["famille"]),                         50).toLowerCase(),
      reference_interne:     sanitizeText(getCell(cells, indexMap["reference_interne"]    ?? -1),     100),
      reference_fournisseur: sanitizeText(getCell(cells, indexMap["reference_fournisseur"]?? -1),     100),
      code_facturation:      sanitizeText(getCell(cells, indexMap["code_facturation"]     ?? -1),      50),
      marque:                sanitizeText(getCell(cells, indexMap["marque"]               ?? -1),     100),
      prix_ht:               parseDecimal(getCell(cells, indexMap["prix_ht"]              ?? -1)),
      taux_tva:              parseDecimal(getCell(cells, indexMap["taux_tva"]             ?? -1)),
      stock:                 parseDecimal(getCell(cells, indexMap["stock"]                ?? -1)),
      code_fournisseur:      sanitizeCode(getCell(cells, indexMap["code_fournisseur"]     ?? -1),      50),
      code_catalogue:        sanitizeCode(getCell(cells, indexMap["code_catalogue"]       ?? -1),      50),
      image_url:             sanitizeText(getCell(cells, indexMap["image_url"]            ?? -1),     500),
      description:           sanitizeText(getCell(cells, indexMap["description"]          ?? -1),    2000),
    };

    if (!row.designation) {
      skipped++; errors.push(`Ligne ${lineNumber} : désignation manquante.`); continue;
    }
    if (!VALID_FAMILIES.includes(row.famille as typeof VALID_FAMILIES[number])) {
      skipped++; errors.push(`Ligne ${lineNumber} : famille '${row.famille}' invalide.`); continue;
    }

    // Fournisseur — warning si inconnu, mais on n'arrête pas la ligne
    let supplierId: string | null = null;
    if (row.code_fournisseur) {
      supplierId = supplierMap.get(row.code_fournisseur) ?? null;
      if (!supplierId) {
        const label = row.marque
            ? `${row.code_fournisseur} (${row.marque})`
            : row.code_fournisseur;
        unknownSupplierCodes.add(label);
        warnings.push(`Ligne ${lineNumber} : fournisseur '${label}' introuvable — produit importé sans fournisseur rattaché.`);
        }
    }

    // Catalogue — warning si inconnu
    let catalogueId: string | null = null;
    if (row.code_catalogue) {
      catalogueId = catalogueMap.get(row.code_catalogue) ?? null;
      if (!catalogueId) {
        warnings.push(`Ligne ${lineNumber} : code catalogue '${row.code_catalogue}' introuvable — produit importé sans catalogue rattaché.`);
      }
    }

    // Vérifier si la référence existe déjà
    const existing = row.reference_interne
      ? await prisma.catalogue_items.findFirst({
          where: { distributor_id: user.distributorId, internal_code: row.reference_interne },
          select: { id: true },
        })
      : null;

    if (existing) {
      if (mode === "test") {
        skipped++;
        warnings.push(`Ligne ${lineNumber} : référence '${row.reference_interne}' existante — sera mise à jour en mode production.`);
        continue;
      }
      await prisma.catalogue_items.update({
        where: { id: existing.id },
        data: {
          designation: row.designation, item_family: row.famille,
          internal_code: row.reference_interne || null,
          supplier_reference: row.reference_fournisseur || null,
          billing_code: row.code_facturation || null,
          brand: row.marque || null,
          unit_price_ht: row.prix_ht, vat_rate: row.taux_tva, stock_quantity: row.stock,
          image_url: row.image_url || null, description: row.description || null,
          supplier_id: supplierId, catalogue_id: catalogueId,
        },
      });
      updated++; continue;
    }

    await prisma.catalogue_items.create({
      data: {
        distributor_id: user.distributorId,
        designation: row.designation, item_family: row.famille,
        internal_code: row.reference_interne || null,
        supplier_reference: row.reference_fournisseur || null,
        billing_code: row.code_facturation || null,
        brand: row.marque || null,
        unit_price_ht: row.prix_ht, vat_rate: row.taux_tva, stock_quantity: row.stock,
        image_url: row.image_url || null, description: row.description || null,
        supplier_id: supplierId, catalogue_id: catalogueId,
        is_active: true, is_featured: false,
      },
    });
    created++;
  }

  revalidatePath(`/${distributor}/admin/catalogues`);
  revalidatePath(`/${distributor}/admin/catalogues/produits`);
  revalidatePath(`/${distributor}/admin/catalogues/imports`);

  return {
    success: true, error: null,
    summary: { totalRows: lines.length - 1, created, updated, skipped, errors, warnings, unknownSupplierCodes: [...unknownSupplierCodes], mode },
  };
}