import { sanitizeText } from "./security";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (value: unknown) => sanitizeText(value, 160).toLowerCase();

export const isValidEmail = (email: string) => EMAIL_PATTERN.test(email) && email.length <= 160;

export const sanitizePassword = (value: unknown) => (typeof value === "string" ? value.slice(0, 200) : "");

export const validatePassword = (password: string) => {
  if (password.length < 10) {
    return "Le mot de passe doit contenir au moins 10 caracteres.";
  }

  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Le mot de passe doit contenir une minuscule, une majuscule et un chiffre.";
  }

  return null;
};
