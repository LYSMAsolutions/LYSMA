

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

// Nettoyage toutes les 10 minutes
setInterval(() => {
  const now = Date.now();
  store.forEach((v, k) => { if (v.resetAt < now) store.delete(k); });
}, 10 * 60 * 1000);

export function rateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

/** Vérifie le rate limit login : 10 tentatives / 15 min par IP+email */
export function checkLoginRateLimit(ip: string, email: string) {
  const key = `login:${ip}:${email.toLowerCase()}`;
  return rateLimit(key, 10, 15 * 60 * 1000);
}

/** Vérifie le rate limit reset password : 3 demandes / 15 min par email */
export function checkResetRateLimit(email: string) {
  const key = `reset:${email.toLowerCase()}`;
  return rateLimit(key, 3, 15 * 60 * 1000);
}