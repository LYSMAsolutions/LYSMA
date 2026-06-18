# ECHO V2.3 - Application locale

ECHO est l'application locale de l'IA personnelle privee de Mathieu.

Elle utilise :

- Next.js ;
- TypeScript ;
- Tailwind CSS ;
- une route API Next.js ;
- Ollama en local sur `http://127.0.0.1:11434` ;
- PostgreSQL local ;
- Prisma pour faire evoluer le schema de memoire.

Tout reste local. Pas de cloud, pas d'API OpenAI, pas d'authentification, pas de deploiement internet.

## Regle centrale PostgreSQL / Memoire

La base ne decide jamais.

Elle conserve l'etat exact des informations : brut, hypothese, valide, corrige, rejete.

Phrase cle :

```text
ECHO peut apprendre seule.
Mathieu valide ce qui est sensible, structurant ou incertain.
```

## Directive memoire autonome V2.3

ECHO n'est pas un formulaire de validation.

ECHO peut enregistrer seule certaines informations lorsque la memoire est utile et fiable.

Trois niveaux existent :

- `autonome` : information factuelle, repetee, faible sensibilite, confiance elevee ;
- `probabiliste` : interpretation plausible, confiance moyenne, impact limite ;
- `en_validation` : sujet sensible, decision structurante, changement de cap, valeur profonde, sante, finances, famille ou orientation de vie.

Les validations doivent rester rares et concerner les elements importants.

Une hypothese ne devient jamais une certitude automatiquement.

## Projet Fou / Engines

La V2.3 prepare une architecture modulaire par moteurs :

- `Memory Engine` ;
- `Insight Engine` ;
- `Morning Brief Engine` ;
- `Tech Watch Engine` ;
- `Identity Engine` ;
- `Cap Engine`.

Les contrats et services minimaux sont dans :

```text
src/lib/engines/
```

Ces moteurs ne lancent pas encore d'automatisation lourde. Ils preparent une evolution progressive vers le Super-Admin comme centre de pilotage.

Document d'architecture :

```text
../15_PROJET_FOU_ARCHITECTURE.md
```

## Tables V2.3

La base minimale contient 4 tables :

- `echo_chat_messages` : historique brut des messages utilisateur et assistant ;
- `echo_memory_entries` : memoire structuree avec statut `autonome`, `probabiliste`, `en_validation`, `valide`, `corrige`, `rejete`, `contredit` ou `obsolete` ;
- `echo_hypotheses` : hypotheses en attente, validees, rejetees ou corrigees ;
- `echo_decisions` : decisions acte clairement par Mathieu.

Toutes les tables contiennent :

- `id` ;
- `created_at` ;
- `updated_at` ;
- `metadata`.

Les tables suivantes contiennent aussi `source_message_id` pour relier l'information au message d'origine :

- `echo_memory_entries` ;
- `echo_hypotheses` ;
- `echo_decisions`.

`pgvector` n'est pas utilise dans cette version. La structure reste compatible avec un ajout futur.

## Prerequis

- Node.js installe ;
- Ollama installe et lance localement ;
- un modele Ollama disponible ;
- PostgreSQL installe ;
- une base locale `ECHO` creee ;
- `.env.local` configure dans ce dossier.

## Variables locales

Exemple de `.env.local` :

```env
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3:4b
OLLAMA_TIMEOUT_MS=180000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/ECHO
```

Ne partage jamais le contenu reel de `DATABASE_URL`.

## Installation

```bash
npm install
```

## Ollama

Verifier que le serveur local repond :

```bash
curl.exe http://127.0.0.1:11434/api/tags
```

Tester un modele :

```bash
ollama run qwen3:4b
```

## Prisma / PostgreSQL

Generer le client Prisma :

```bash
npm run db:generate
```

Synchroniser le schema Prisma avec PostgreSQL :

```bash
npm run db:push
```

Appliquer le SQL miroir idempotent, notamment les triggers `updated_at` :

```bash
npm run db:execute:schema
```

Ouvrir Prisma Studio :

```bash
npm run db:studio
```

Schema Prisma :

```text
prisma/schema.prisma
```

Schema SQL miroir :

```text
database/schema.sql
```

## Lancement local

```bash
npm run dev -- --port 3010
```

URL locale :

```text
http://localhost:3010
```

## Verification

```bash
npm run typecheck
npm run build
```

## Logique applicative V2.3

- chaque message utilisateur ou assistant est sauvegarde dans `echo_chat_messages` ;
- les informations factuelles, repetees, peu sensibles et fiables peuvent devenir une memoire `autonome` ;
- les interpretations plausibles a impact limite peuvent devenir une memoire `probabiliste` ;
- les informations sensibles ou structurantes vont en `en_validation` ;
- les hypotheses peuvent aussi aller dans `echo_hypotheses` lorsqu'elles demandent un suivi explicite ;
- la memoire confirmee par Mathieu devient `valide` ;
- les decisions vont dans `echo_decisions` seulement si Mathieu les acte clairement ;
- aucune hypothese ne devient une verite sans validation.
