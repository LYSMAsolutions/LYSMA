import { requiresYesNoAnswer } from "@/lib/response-safety";

export type DirectAnswer = {
  reply: string;
  reason: "known_user_identity" | "provisional_echo_name" | "code_access";
};

function normalizeQuestion(message: string) {
  return message
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function getDirectAnswer(message: string): DirectAnswer | null {
  const normalized = normalizeQuestion(message);
  const yesOrNoOnly = requiresYesNoAnswer(message);

  if (/\b(sais[- ]tu qui je suis|qui suis[- ]je)\b/.test(normalized)) {
    return {
      reply: yesOrNoOnly ? "Oui." : "Oui, tu es Mathieu.",
      reason: "known_user_identity"
    };
  }

  if (
    normalized.includes("echo") &&
    normalized.includes("nom") &&
    normalized.includes("provisoire")
  ) {
    return {
      reply: yesOrNoOnly ? "Oui." : "Oui, ECHO est un nom provisoire.",
      reason: "provisional_echo_name"
    };
  }

  const asksAboutCodeAccess =
    /\b(acces|acceder|voir|lire|consulter|ouvrir)\b/.test(normalized) &&
    /\b(code|code source|fichiers?|terminal)\b/.test(normalized);

  if (asksAboutCodeAccess) {
    return {
      reply: yesOrNoOnly
        ? "Non."
        : "Non, je n'ai pas acces au code source de LYSMA.",
      reason: "code_access"
    };
  }

  return null;
}
