type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, boolean | null | undefined>
  | ClassValue[];

function flattenClassValue(value: ClassValue, acc: string[]) {
  if (!value) {
    return;
  }

  if (typeof value === "string" || typeof value === "number") {
    acc.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      flattenClassValue(item, acc);
    }
    return;
  }

  if (typeof value === "object") {
    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) {
        acc.push(key);
      }
    }
  }
}

export function cn(...inputs: ClassValue[]) {
  const classes: string[] = [];

  for (const input of inputs) {
    flattenClassValue(input, classes);
  }

  return [...new Set(classes.join(" ").trim().split(/\s+/).filter(Boolean))].join(" ");
}

export function formatDate(
  value?: string | Date | null,
  locale = "fr-FR",
) {
  if (!value) {
    return "—";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(
  value?: string | Date | null,
  locale = "fr-FR",
) {
  if (!value) {
    return "—";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatCurrency(
  value?: number | string | null,
  currency = "EUR",
  locale = "fr-FR",
) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const amount =
    typeof value === "number" ? value : Number.parseFloat(String(value));

  if (Number.isNaN(amount)) {
    return "—";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(
  value?: number | string | null,
  locale = "fr-FR",
) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const amount =
    typeof value === "number" ? value : Number.parseFloat(String(value));

  if (Number.isNaN(amount)) {
    return "—";
  }

  return new Intl.NumberFormat(locale).format(amount);
}

export function formatPercent(
  value?: number | string | null,
  locale = "fr-FR",
) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const amount =
    typeof value === "number" ? value : Number.parseFloat(String(value));

  if (Number.isNaN(amount)) {
    return "—";
  }

  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

export function formatPhone(value?: string | null) {
  if (!value) {
    return "—";
  }

  const digits = value.replace(/\D/g, "");

  if (digits.length === 10) {
    return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
  }

  if (digits.length === 11 && digits.startsWith("33")) {
    return `+33 ${digits.slice(2).replace(/(\d{2})(?=\d)/g, "$1 ").trim()}`;
  }

  return value;
}

export function formatName(firstName?: string | null, lastName?: string | null) {
  const parts = [firstName, lastName]
    .map((part) => part?.trim())
    .filter(Boolean);

  return parts.length ? parts.join(" ") : "—";
}

export function getInitials(firstName?: string | null, lastName?: string | null) {
  const first = firstName?.trim()?.[0] ?? "";
  const last = lastName?.trim()?.[0] ?? "";
  const initials = `${first}${last}`.toUpperCase();

  return initials || "—";
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(value?: string | null, max = 120) {
  if (!value) {
    return "";
  }

  if (value.length <= max) {
    return value;
  }

  return `${value.slice(0, max).trimEnd()}…`;
}

export function toBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return ["true", "1", "yes", "on"].includes(value.toLowerCase());
  }

  if (typeof value === "number") {
    return value === 1;
  }

  return false;
}

export function parsePage(value: unknown, defaultValue = 1) {
  const page = Number.parseInt(String(value ?? defaultValue), 10);

  if (Number.isNaN(page) || page < 1) {
    return defaultValue;
  }

  return page;
}

export function parsePageSize(
  value: unknown,
  defaultValue = 20,
  maxValue = 100,
) {
  const size = Number.parseInt(String(value ?? defaultValue), 10);

  if (Number.isNaN(size) || size < 1) {
    return defaultValue;
  }

  return Math.min(size, maxValue);
}

export function safeJsonParse<T>(
  value: string | null | undefined,
  fallback: T,
): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}