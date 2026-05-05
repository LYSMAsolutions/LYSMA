export type BonLineInput = {
  lineNumber: number;
  quantity: number | null;
  itemType: string | null;
  reference: string | null;
  designation: string | null;
  unitPrice: number | null;
  billingCode: string | null;
  comment: string | null;
};

export type CreateBonInput = {
  clientId: string;
  assignedStoreId: string | null;
  bonType: string;
  title: string | null;
  comment: string | null;
  priority: string | null;
  dueAt: string | null;
  lines: BonLineInput[];
};

export type BonStatusActionInput = {
  bonId: string;
  action: string;
  reason: string | null;
};

function cleanString(value: unknown, maxLength = 255) {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().replace(/\s+/g, " ");
  if (!cleaned) return null;
  return cleaned.slice(0, maxLength);
}

function cleanNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function validateBonLineInput(input: unknown, index = 0): BonLineInput {
  if (!input || typeof input !== "object") {
    throw new Error(`Ligne ${index + 1} invalide.`);
  }

  const row = input as Record<string, unknown>;
  const lineNumber = cleanNumber(row.lineNumber ?? row.line_number);

  if (!lineNumber || lineNumber < 1) {
    throw new Error(`Numéro de ligne invalide pour la ligne ${index + 1}.`);
  }

  const quantity = cleanNumber(row.quantity);
  const unitPrice = cleanNumber(row.unitPrice ?? row.unit_price);

  return {
    lineNumber,
    quantity,
    itemType: cleanString(row.itemType ?? row.item_type, 50),
    reference: cleanString(row.reference, 100),
    designation: cleanString(row.designation, 255),
    unitPrice,
    billingCode: cleanString(row.billingCode ?? row.billing_code, 50),
    comment: cleanString(row.comment, 1000),
  };
}

export function validateCreateBonInput(input: unknown): CreateBonInput {
  if (!input || typeof input !== "object") {
    throw new Error("Données du bon invalides.");
  }

  const data = input as Record<string, unknown>;

  const clientId = cleanString(data.clientId ?? data.client_id, 120);
  const assignedStoreId = cleanString(
    data.assignedStoreId ?? data.assigned_store_id,
    120
  );
  const bonType = cleanString(data.bonType ?? data.bon_type, 50);
  const title = cleanString(data.title, 150);
  const comment = cleanString(data.comment, 5000);
  const priority = cleanString(data.priority, 20);
  const dueAt = cleanString(data.dueAt ?? data.due_at, 50);

  if (!clientId) {
    throw new Error("Client requis.");
  }

  if (!bonType) {
    throw new Error("Type de bon requis.");
  }

  const rawLines = Array.isArray(data.lines) ? data.lines : [];

  if (!rawLines.length) {
    throw new Error("Au moins une ligne est requise.");
  }

  const lines = rawLines.map((line, index) => validateBonLineInput(line, index));

  return {
    clientId,
    assignedStoreId,
    bonType,
    title,
    comment,
    priority,
    dueAt,
    lines,
  };
}

export function validateBonStatusActionInput(input: unknown): BonStatusActionInput {
  if (!input || typeof input !== "object") {
    throw new Error("Action invalide.");
  }

  const data = input as Record<string, unknown>;

  const bonId = cleanString(data.bonId ?? data.bon_id, 120);
  const action = cleanString(data.action, 50);
  const reason = cleanString(data.reason, 3000);

  if (!bonId) {
    throw new Error("Bon introuvable.");
  }

  if (!action) {
    throw new Error("Action requise.");
  }

  return {
    bonId,
    action,
    reason,
  };
}