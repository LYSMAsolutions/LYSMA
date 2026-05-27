import { z } from 'zod'

export const strongPasswordSchema = z.string()
  .min(12, 'Le mot de passe doit contenir au moins 12 caractères.')
  .regex(/[a-z]/, 'Le mot de passe doit contenir une minuscule.')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir une majuscule.')
  .regex(/[0-9]/, 'Le mot de passe doit contenir un chiffre.')
  .regex(/[^a-zA-Z0-9]/, 'Le mot de passe doit contenir un caractère spécial.')

export function validateStrongPassword(password: string) {
  const result = strongPasswordSchema.safeParse(password)
  return {
    valid: result.success,
    message: result.success ? null : result.error.issues[0]?.message ?? 'Mot de passe insuffisant.',
  }
}
