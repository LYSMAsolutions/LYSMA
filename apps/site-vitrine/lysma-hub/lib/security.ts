export const sanitizeText = (value: unknown, maxLength: number) =>
  typeof value === "string"
    ? value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, maxLength)
    : "";

export const isSafeSlug = (value: string) => /^[a-z0-9-]{2,80}$/.test(value);
