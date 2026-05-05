# 🔧 GARAGETIMER — Guide d'installation complet

## ÉTAPE 1 — Copier le dossier dans ton monorepo

Copie le dossier `garagetimer/` dans `apps/` de ton projet LYSMA :

```
apps/
  calculateur-eliquide/
  portail-pma/
  super-admin/
  garagetimer/   ← ici
```

---

## ÉTAPE 2 — Créer la base de données sur Supabase (GRATUIT)

1. Va sur **https://supabase.com** et connecte-toi
2. Clique **"New Project"**
3. Nom : `garagetimer` / Choisir région : **eu-west-3 (Paris)**
4. Génère un mot de passe fort → **SAUVEGARDE-LE**
5. Attends 1-2 min que le projet se crée

### Récupérer les URLs de connexion :
- Va dans **Settings → Database → Connection string**
- Copie **"Transaction pooler"** → c'est ton `DATABASE_URL`
- Copie **"Session pooler"** ou **"Direct"** → c'est ton `DIRECT_URL`

---

## ÉTAPE 3 — Créer le fichier .env.local

Dans `apps/garagetimer/`, crée un fichier `.env.local` :

```env
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-eu-west-3.pooler.supabase.com:5432/postgres"
NEXTAUTH_SECRET="mon-secret-tres-fort-a-changer"
NEXTAUTH_URL="http://localhost:3002"
```

> Pour générer un NEXTAUTH_SECRET fort :
> ```bash
> openssl rand -base64 32
> ```

---

## ÉTAPE 4 — Installer les dépendances et pousser le schema

Dans le **dossier racine** de ton monorepo LYSMA :

```bash
pnpm install
```

Ensuite, depuis `apps/garagetimer/` :

```bash
cd apps/garagetimer
npx prisma generate
npx prisma db push
```

---

## ÉTAPE 5 — Créer les premiers utilisateurs (seed)

```bash
cd apps/garagetimer
npx ts-node prisma/seed.ts
```

Ça crée automatiquement :
- **Garage** : GAR01
- **Admin** : admin@demo.fr / admin123
- **Technicien** : code GAR01 + PIN 1234

---

## ÉTAPE 6 — Tester en local

Depuis la racine du monorepo :

```bash
pnpm dev
```

Ouvre : **http://localhost:3002**

- Atelier → Code garage : `GAR01` | PIN : `1234`
- Admin → Email : `admin@demo.fr` | Password : `admin123`

---

## ÉTAPE 7 — Déployer sur Vercel

### 7a. Push sur GitHub
```bash
git add .
git commit -m "feat: add garagetimer app"
git push origin main
```

### 7b. Configurer sur Vercel
1. Va sur **vercel.com** → ton projet LYSMA
2. **Settings → Environment Variables** → Ajoute :
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` = `https://garagetimer.lysmasolutions.fr`

### 7c. Root Directory (si besoin)
Si Vercel déploie tout le monorepo, tu peux configurer un projet séparé :
- **New Project** → importer le repo
- **Root Directory** = `apps/garagetimer`

---

## ÉTAPE 8 — Pointer le domaine OVH

1. Va sur **OVH → Zone DNS** de `lysmasolutions.fr`
2. Ajoute un enregistrement :
   - Type : `CNAME`
   - Sous-domaine : `garagetimer`
   - Valeur : `cname.vercel-dns.com`
3. Sur Vercel → **Settings → Domains** → Ajoute `garagetimer.lysmasolutions.fr`

Propagation : 5 à 30 minutes.

---

## ✅ RÉSULTAT FINAL

| URL | Accès |
|-----|-------|
| `garagetimer.lysmasolutions.fr` | Login |
| `garagetimer.lysmasolutions.fr/atelier` | Interface PIN technicien |
| `garagetimer.lysmasolutions.fr/admin` | Dashboard admin |

---

## 🔥 PROCHAINES ÉTAPES

- [ ] Ajouter/modifier les utilisateurs via interface admin
- [ ] Export CSV de l'historique
- [ ] KPIs productivité par technicien
- [ ] Mode multi-garages (déjà préparé dans le schema)
