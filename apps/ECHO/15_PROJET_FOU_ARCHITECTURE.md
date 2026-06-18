# ECHO V2.3 - Projet Fou

## Intention

Projet Fou transforme ECHO en copilote personnel intelligent integre progressivement a l'ecosysteme LYSMA et au Super-Admin.

L'objectif n'est pas d'ajouter des fonctionnalites partout.

L'objectif est de poser une architecture simple, modulaire et evolutive pour permettre :

* comprehension progressive de Mathieu ;
* memoire autonome controlee ;
* detection de schemas recurrents ;
* detection de contradictions ;
* conservation de l'historique utile ;
* maintien du cap ;
* reduction de la dispersion ;
* assistance strategique sur les projets ;
* veille technique future ;
* briefing quotidien.

---

## Etat actuel

### Ce qui existe deja

ECHO dispose deja de :

* une application locale Next.js dans `app/` ;
* une route API `/api/chat` ;
* une connexion Ollama locale ;
* un prompt systeme V2.3 ;
* PostgreSQL local ;
* Prisma ;
* quatre tables minimales :
  * `echo_chat_messages` ;
  * `echo_memory_entries` ;
  * `echo_hypotheses` ;
  * `echo_decisions` ;
* journalisation des messages utilisateur et assistant ;
* statuts memoire V2.3 :
  * `autonome` ;
  * `probabiliste` ;
  * `en_validation` ;
  * `valide` ;
  * `corrige` ;
  * `rejete` ;
  * `contredit` ;
  * `obsolete` ;
* documentation fondatrice Markdown ;
* regle d'identite evolutive ;
* directive memoire autonome.

Le Super-Admin existe aussi dans `C:\Users\lenovo\LYSMA\apps\super-admin`.

Il contient deja :

* dashboard ;
* journal ;
* chatbox ;
* clients ;
* finances ;
* LIVO ;
* PMA ;
* sites ;
* erreurs ;
* API internes ;
* Prisma/PostgreSQL.

### Ce qui est partiellement implemente

Memory Engine :

* stockage possible des messages ;
* helpers pour memoire autonome, probabiliste, protegee et validee ;
* pas encore d'extracteur automatique branche a chaque conversation.

Insight Engine :

* concept documente ;
* interface technique preparee ;
* pas encore d'analyse active.

Morning Brief Engine :

* interface technique preparee ;
* agregateur minimal possible ;
* pas encore branche aux projets, cap, veille et observations.

Tech Watch Engine :

* interface technique preparee ;
* principe source-first pose ;
* aucune veille automatique sans source reelle.

Identity Engine :

* regle d'identite documentee ;
* interface technique preparee ;
* pas encore de workflow de proposition de prenom.

Cap Engine :

* document `11_CAP_ACTUEL.md` existant ;
* interface technique preparee ;
* pas encore de comparaison automatique entre idees et cap.

### Ce qui manque

Il manque encore :

* une strategie de lecture des documents Markdown depuis l'app ;
* une couche d'orchestration qui choisit quels moteurs appeler ;
* une extraction memoire legere et desactivable ;
* une validation UI des memoires protegees ;
* une page Super-Admin dediee a ECHO ;
* un pont propre entre ECHO et le Super-Admin ;
* une source unique de verite pour les projets LYSMA/LIVO/PMA ;
* un systeme de briefing quotidien ;
* une veille technique basee sur de vraies sources ;
* une politique de performance locale adaptee au PC de Mathieu.

---

## Architecture cible simple

### Principe

ECHO doit etre compose de moteurs independants.

Chaque moteur a un role clair.

Aucun moteur ne doit devenir une boite noire qui decide a la place de Mathieu.

```text
Conversation
  -> Journal
  -> Memory Engine
  -> Insight Engine
  -> Cap Engine
  -> Reponse ECHO

Super-Admin
  -> Projets / finances / LIVO / PMA / sites / journal
  -> Context Adapter
  -> ECHO

Morning Brief
  -> Cap + Projets + Observations + Veille + Recommandations
```

### Moteurs

#### Memory Engine

Role :

* classer les informations ;
* stocker les memoires autonomes ;
* stocker les memoires probabilistes ;
* placer les memoires protegees en validation ;
* reviser les niveaux de confiance.

Limite :

* ne valide jamais une information protegee seul ;
* ne transforme jamais une hypothese en certitude.

#### Insight Engine

Role futur :

* contradictions ;
* opportunites negligees ;
* decisions repoussees ;
* schemas recurrents ;
* risques de dispersion ;
* evolutions positives.

Limite :

* toute analyse doit citer les faits observes, la confiance et les limites.

#### Morning Brief Engine

Role futur :

* produire un briefing quotidien ;
* agreger cap, projets, observations, veille et recommandations ;
* rester court et utile.

Limite :

* pas de briefing invente ;
* pas de recommandation sans contexte.

#### Tech Watch Engine

Role futur :

* IA ;
* Ollama ;
* Agents IA ;
* PostgreSQL ;
* Prisma ;
* Next.js ;
* React ;
* TypeScript ;
* GitHub ;
* SaaS ;
* opportunites locales.

Limite :

* aucune veille sans source reelle.

#### Identity Engine

Role futur :

* suivre l'identite evolutive d'ECHO ;
* permettre une proposition de prenom ;
* attendre validation explicite de Mathieu.

Limite :

* ne change jamais de prenom seul.

#### Cap Engine

Role futur :

* comparer les nouvelles idees au cap actuel ;
* signaler les risques de dispersion ;
* aider a prioriser.

Limite :

* ne change jamais le cap principal seul.

---

## Couche technique ajoutee

Une couche `engines` est preparee dans :

```text
app/src/lib/engines/
```

Fichiers :

* `types.ts` ;
* `memoryEngine.ts` ;
* `insightEngine.ts` ;
* `morningBriefEngine.ts` ;
* `techWatchEngine.ts` ;
* `identityEngine.ts` ;
* `capEngine.ts` ;
* `registry.ts` ;
* `index.ts`.

Cette couche ne lance pas encore d'automatisme lourd.

Elle definit les contrats et les garde-fous.

---

## Integration Super-Admin

Le Super-Admin doit devenir l'environnement principal d'ECHO.

Mais la bonne sequence est progressive.

### Phase 1

ECHO reste une app locale separee.

Le Super-Admin n'est pas modifie.

### Phase 2

Creer un pont API local :

```text
Super-Admin -> ECHO API locale
```

Le Super-Admin peut envoyer :

* projets ;
* evenements ;
* erreurs ;
* donnees LIVO ;
* donnees PMA ;
* donnees sites ;
* elements financiers ;
* journal.

ECHO peut retourner :

* synthese ;
* risques ;
* priorites ;
* memoires candidates ;
* briefing.

### Phase 3

Integrer ECHO comme page centrale dans le Super-Admin.

Route cible possible :

```text
/echo
```

ou

```text
/(admin)/copilote
```

### Phase 4

Fusionner ou partager certains services si le besoin devient clair.

Ne pas fusionner trop tot.

---

## Modifications minimales realisees

Les modifications minimales sont :

* creation de contrats TypeScript pour les moteurs ;
* creation d'un Memory Engine avec garde-fous ;
* creation de moteurs preparatoires no-op/source-first ;
* creation d'un registre des moteurs ;
* documentation de l'architecture Projet Fou.

Ce qui n'a pas ete fait :

* pas de nouvelle table ;
* pas de pgvector ;
* pas d'appel Ollama supplementaire automatique ;
* pas de veille automatique ;
* pas de modification du Super-Admin ;
* pas de nouvelle interface ;
* pas de systeme de taches planifiees.

---

## Roadmap V2.3 vers V3

### V2.3 Stabilisation

Objectif :

* stabiliser chat + Ollama + PostgreSQL ;
* garder la memoire fiable ;
* eviter les lenteurs.

Actions :

* tester un modele local plus rapide que `qwen3:4b` ;
* garder `Memory Engine` desactive automatiquement ;
* utiliser les helpers memoire manuellement ou via tests ;
* verifier les performances sur le PC de Mathieu.

### V2.4 Extraction memoire legere

Objectif :

* proposer des memoires candidates sans ralentir la conversation.

Actions :

* ajouter un extracteur desactivable ;
* extraire seulement les faits evidents ;
* stocker automatiquement uniquement `autonome` ou `probabiliste` ;
* placer le sensible en `en_validation` ;
* journaliser les decisions de stockage.

### V2.5 Super-Admin Context Adapter

Objectif :

* permettre a ECHO de comprendre l'ecosysteme LYSMA.

Actions :

* creer des adapters lecture seule :
  * projets ;
  * finances ;
  * erreurs ;
  * LIVO ;
  * PMA ;
  * sites ;
  * journal ;
* ne pas modifier les donnees Super-Admin depuis ECHO.

### V2.6 Morning Brief

Objectif :

* produire un briefing court et utile.

Actions :

* lire cap actuel ;
* lire projets actifs ;
* lire observations recentes ;
* lire veille validee ;
* produire 3 priorites maximum.

### V2.7 Insight Engine actif

Objectif :

* detecter les schemas utiles.

Actions :

* detecter contradictions simples ;
* detecter decisions repoussees ;
* detecter risques de dispersion ;
* demander validation uniquement pour les points importants.

### V3 Centre de pilotage

Objectif :

* ECHO devient le centre de pilotage personnel de Mathieu dans le Super-Admin.

Actions :

* page dediee dans le Super-Admin ;
* briefing quotidien ;
* memoire consultable ;
* validation des memoires protegees ;
* vue cap/projets/priorites ;
* veille sourcee ;
* historique utile.

---

## Regles de conception

* Simple avant puissant.
* Local avant cloud.
* Source reelle avant veille.
* Validation rare mais serieuse.
* Memoire utile avant accumulation.
* Moteurs separes avant orchestration complexe.
* Super-Admin comme environnement cible, pas dependance prematuree.
