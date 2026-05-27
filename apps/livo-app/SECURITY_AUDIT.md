# Audit sécurité LIVO

## Corrections appliquées

- Vérification email obligatoire avant connexion à l’outil.
- Tokens de vérification hashés en base, expirants et consommables une seule fois.
- Renvoi d’email de vérification avec réponse non énumérable.
- Journalisation sécurité : inscription, envoi email, validation email, connexion, échecs, blocage email non vérifié, 2FA.
- Rate limiting serveur sur inscription, connexion et renvoi de validation.
- Verrouillage temporaire après trop d’échecs de connexion.
- Base 2FA TOTP standard compatible Google Authenticator, Microsoft Authenticator et Authy.
- Secrets 2FA chiffrés côté serveur avec `SECURITY_ENCRYPTION_KEY`.
- Cookies NextAuth durcis : `HttpOnly`, `Secure` en production, `SameSite=Strict`, durée limitée.
- Headers de sécurité renforcés : CSP, HSTS, anti-clickjacking, anti-sniffing, permissions policy.
- Règles de mot de passe renforcées à l’inscription.

## Variables d’environnement nécessaires

```env
AUTH_URL="https://livo-app.com"
AUTH_SECRET="..."
NEXTAUTH_URL="https://livo-app.com"
NEXTAUTH_SECRET="..."
SECURITY_ENCRYPTION_KEY="..."
RESEND_API_KEY="..."
RESEND_FROM_EMAIL="LYSMA Solutions <noreply@livo-app.com>"
NEXT_PUBLIC_APP_URL="https://livo-app.com"
```

## Commandes à lancer

```bash
pnpm --dir apps/livo-app run db:push
pnpm --dir apps/livo-app run build
```

## Points restants recommandés

- Ajouter une page “Sécurité du compte” dans les paramètres pour piloter la 2FA depuis l’interface.
- Ajouter un vrai flux de réinitialisation de mot de passe.
- Ajouter une révocation de toutes les sessions côté interface.
- Brancher les alertes sécurité vers SuperAdmin ou email.
- Mettre en place un monitoring applicatif production.
- Mettre en place des sauvegardes PostgreSQL vérifiées et testées.
- Remplacer progressivement les commentaires encodés de travers hérités d’anciens fichiers.
