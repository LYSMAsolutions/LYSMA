export type CreateUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  code?: string;
  password: string;
  roleId: string;
  supervisorId?: string | null;
  storeIds?: string[];
};

export function validateCreateUserPayload(body: unknown) {
  const payload = (body ?? {}) as Partial<CreateUserPayload>;

  const firstName = String(payload.firstName || "").trim();
  const lastName = String(payload.lastName || "").trim();
  const email = String(payload.email || "").trim().toLowerCase();
  const phone = String(payload.phone || "").trim();
  const code = String(payload.code || "").trim().toUpperCase();
  const password = String(payload.password || "");
  const roleId = String(payload.roleId || "").trim();
  const supervisorId = String(payload.supervisorId || "").trim() || null;
  const storeIds = Array.isArray(payload.storeIds)
    ? payload.storeIds.map((item) => String(item || "").trim()).filter(Boolean)
    : [];

  if (!firstName || !lastName || !email || !password || !roleId) {
    return {
      ok: false as const,
      message: "Champs obligatoires manquants.",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      ok: false as const,
      message: "Adresse email invalide.",
    };
  }

  if (password.length < 8) {
    return {
      ok: false as const,
      message: "Le mot de passe temporaire doit contenir au moins 8 caractères.",
    };
  }

  return {
    ok: true as const,
    data: {
      firstName,
      lastName,
      email,
      phone,
      code,
      password,
      roleId,
      supervisorId,
      storeIds: Array.from(new Set(storeIds)),
    },
  };
}
