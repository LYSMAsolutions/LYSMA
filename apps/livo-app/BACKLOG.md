# Backlog

Audit realise le 2026-06-16 sur le code present dans `apps/livo-app`.

## Critique

| Tache | Module | Statut actuel | Pourquoi |
| --- | --- | --- | --- |
| Creer des migrations Prisma versionnees | Base de donnees | Non commence | Aucun dossier `prisma/migrations` detecte. |
| Ajouter tests e2e inscription/login/2FA | Auth | Non commence | Parcours critique sans tests detectes. |
| Ajouter tests e2e fiche/pointage/cloture/PDF | Atelier | Non commence | Coeur operationnel sans tests detectes. |
| Auditer et corriger le PATCH interne de `passwordAtelier` | API interne | A terminer | Risque de stockage non hashe via API super-admin. |
| Finaliser le reset mot de passe | Auth | A terminer | Enum et tokens existent, flux complet non detecte. |
| Finaliser recovery codes 2FA | Auth | A terminer | Codes generes mais flux d'usage non detecte. |
| Clarifier autorisations roles `OWNER`, `MANAGER`, `COMPAGNON` | Securite | A terminer | Roles presents, logique surtout proprietaire. |
| Documenter et tester `INTERNAL_API_KEY` en production | API interne | A terminer | Cle interne protege des actions sensibles. |
| Mettre en place monitoring erreurs production | Deploiement | Non commence | Aucun outil explicite detecte. |
| Mettre en place sauvegarde/restauration base | Deploiement | Non commence | Non detecte dans le repo. |
| Corriger coherence prix marketing/abonnement | Produit | A terminer | Prix differents detectes entre pages/config. |
| Harmoniser mot de passe atelier UI/API | Parametres | A terminer | UI et API n'ont pas la meme contrainte minimale. |

## Importante

| Tache | Module | Statut actuel | Pourquoi |
| --- | --- | --- | --- |
| Brancher la page rapports analytiques complete | Rapports | Partiellement implemente | Composants presents, route actuelle centree RH. |
| Ajouter tests unitaires calculs dashboard/rentabilite | Dashboard | Non commence | Calculs financiers sensibles. |
| Ajouter tests unitaires pointage et pauses | Pointage | Non commence | Logique metier complexe. |
| Ajouter tests validation bibliotheque metier en CI | Bibliotheque metier | Partiellement implemente | Script existe, branchement CI non detecte. |
| Creer administration de la bibliotheque metier | Bibliotheque metier | Non commence | Donnees JSON non pilotables dans l'app. |
| Ajouter table usage interventions metier | Bibliotheque metier | Non commence | Necessaire pour tendances et apprentissage. |
| Finaliser abonnement/paiement | Abonnement | Non commence | Trial et booleen seulement. |
| Finaliser portail abonnement/facturation | Abonnement | Non commence | Pas de portail detecte. |
| Formaliser integration OR externe par partenaire | OR externes | A terminer | API globale existante, connecteurs non detectes. |
| Ajouter logs visibles de synchronisation OR | OR externes | A terminer | Logs base presents, UI dediee non detectee. |
| Ajouter etat lu/non lu notifications | Notifications | Non commence | Notifications read-only sans persistance. |
| Ajouter creation vehicule autonome | Vehicules | A terminer | Creation principalement via nouvelle fiche. |
| Appliquer verification solde conges a l'API absences | RH | A terminer | Helper existe, non applique directement. |
| Ajouter export RH/paie | RH | Non commence | Non detecte hors PDF pointage mensuel. |
| Ajouter tests PDF | PDF | Non commence | Generation fiche et pointage critiques. |
| Verifier encodage accents dans seed et docs existants | Qualite | A terminer | Mojibake observe dans certains outputs. |

## Confort

| Tache | Module | Statut actuel | Pourquoi |
| --- | --- | --- | --- |
| Ajouter interface de desactivation 2FA | Parametres | A terminer | API existe, UI non clairement detectee. |
| Ajouter gestion appareils de confiance | Securite | Non commence | Cookie/table existent, UI de gestion non detectee. |
| Ajouter filtres avances vehicules | Vehicules | A terminer | Recherche simple presente. |
| Ajouter tags/categories fiches | Fiches | Non commence | Non detecte hors interventions metier. |
| Ajouter templates de notes/travaux | Fiches | Non commence | Non detecte. |
| Ajouter exports CSV dashboard | Rapports | Non commence | Non detecte. |
| Ajouter page changelog produit visible | Produit | Non commence | Non detecte. |
| Ajouter personnalisation logo PDF | PDF | A terminer | `logoUrl` existe, usage complet a verifier. |
| Ajouter mode sombre si souhaite | UI | Non commence | Non detecte. |
| Ajouter raccourcis clavier atelier admin | UX | Non commence | Non detecte. |
| Ajouter onboarding guide | Onboarding | Non commence | Non detecte. |
| Ajouter import vehicules/clients CSV | Donnees | Non commence | Non detecte. |

## Non commence explicitement detecte

- tests automatises ;
- migrations versionnees ;
- paiement ;
- portail facturation ;
- RLS SQL ;
- IA chatbox ;
- stockage/upload Supabase gere par l'app ;
- CI/CD documente dans l'app ;
- application mobile native ;
- mode hors ligne.
