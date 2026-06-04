# LYSMA Hub - Espace client V1

Cette V1 ajoute une fondation d'espace client securise sans modifier le moteur de site vitrine existant.

## Routes publiques

- `/` : entree LYSMA Hub.
- `/login` : connexion placeholder V1.
- `/site/[slug]` : site vitrine public rendu depuis `SiteConfig`.

## Routes privees

- `/dashboard` : espace client protege.

Chaque route privee doit appeler `requireAuth()` cote serveur. Les controles ne doivent jamais dependre uniquement du front.

## Authentification

Les fonctions de base sont dans `lib/auth.ts` :

- `getCurrentUser()`
- `requireAuth()`
- `requireClientSiteAccess(siteSlug)`

La V1 utilise un cookie httpOnly de demonstration. Le point de remplacement futur est clair :

- Supabase Auth : remplacer la lecture du cookie par `supabase.auth.getUser()`.
- NextAuth : remplacer la lecture du cookie par `auth()` ou `getServerSession()`.

Aucun mot de passe n'est stocke dans LYSMA Hub.

## Roles

- `admin` : acces global plateforme.
- `client` : acces limite a son `siteSlug`.

Un client ne doit jamais lire, modifier ou recuperer les donnees d'un autre client.

## Multi-clients

Chaque utilisateur client possede un `siteSlug`. Les donnees dashboard sont filtrees cote serveur par ce `siteSlug`.

Pour toute future route dynamique sensible, appeler :

```ts
await requireClientSiteAccess(siteSlug);
```

## Tables prevues PostgreSQL / Supabase

```sql
create type user_role as enum ('admin', 'client');
create type client_site_status as enum ('active', 'draft', 'paused');
create type subscription_status as enum ('active', 'trialing', 'past_due', 'canceled', 'none');
create type support_request_status as enum ('open', 'in_progress', 'resolved');
create type client_content_type as enum ('document', 'photo', 'resource');

create table users (
  id uuid primary key,
  email text not null unique,
  role user_role not null default 'client',
  site_slug text,
  created_at timestamptz not null default now()
);

create table client_sites (
  id uuid primary key,
  site_slug text not null unique,
  site_name text not null,
  plan text not null,
  status client_site_status not null default 'draft'
);

create table subscriptions (
  id uuid primary key,
  site_slug text not null references client_sites(site_slug),
  stripe_customer_id text,
  stripe_subscription_id text,
  status subscription_status not null default 'none',
  next_billing_date timestamptz
);

create table site_updates (
  id uuid primary key,
  site_slug text not null references client_sites(site_slug),
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table client_content (
  id uuid primary key,
  site_slug text not null references client_sites(site_slug),
  type client_content_type not null,
  title text not null,
  file_url text,
  created_at timestamptz not null default now()
);

create table support_requests (
  id uuid primary key,
  site_slug text not null references client_sites(site_slug),
  title text not null,
  description text not null,
  status support_request_status not null default 'open',
  created_at timestamptz not null default now()
);
```

## Securite

- Authentification verifiee cote serveur.
- Role verifie cote serveur.
- Acces site verifie par `siteSlug`.
- Entrees nettoyees avec `sanitizeText()`.
- Slugs validables avec `isSafeSlug()`.
- Pas de `dangerouslySetInnerHTML`.
- Futures requetes SQL : utiliser uniquement des clients parametrables Supabase/Postgres, jamais de SQL concatene avec des entrees utilisateur.

## Stripe futur

La table `subscriptions` prepare :

- `stripe_customer_id`
- `stripe_subscription_id`
- `status`
- `next_billing_date`

Les paiements carte, abonnements mensuels et factures automatiques seront branches plus tard via Stripe Checkout, Billing Portal et webhooks verifies.
