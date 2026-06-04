import type {
  ClientContentRecord,
  ClientSiteRecord,
  HubUser,
  SiteUpdateRecord,
  SubscriptionRecord,
  SupportRequestRecord,
} from "../lib/client-platform-types";

export const demoHubUsers: HubUser[] = [
  {
    id: "usr_mounier_demo",
    email: "client@carrosserie-mounier.fr",
    role: "client",
    siteSlug: "carrosserie-mounier",
    createdAt: "2026-06-01T08:00:00.000Z",
  },
  {
    id: "usr_admin_demo",
    email: "admin@lysma.fr",
    role: "admin",
    siteSlug: null,
    createdAt: "2026-06-01T08:00:00.000Z",
  },
];

export const demoClientSites: ClientSiteRecord[] = [
  {
    id: "site_mounier",
    siteSlug: "carrosserie-mounier",
    siteName: "Carrosserie Mounier",
    plan: "Vitrine Premium",
    status: "active",
  },
];

export const demoSubscriptions: SubscriptionRecord[] = [
  {
    id: "sub_mounier_demo",
    siteSlug: "carrosserie-mounier",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    status: "none",
    nextBillingDate: null,
  },
];

export const demoSiteUpdates: SiteUpdateRecord[] = [
  {
    id: "upd_seo_v1",
    siteSlug: "carrosserie-mounier",
    title: "Conseil SEO",
    content: "Préparer les futures pages locales par prestations et zones d’intervention.",
    createdAt: "2026-06-02T09:00:00.000Z",
  },
  {
    id: "upd_ai_v1",
    siteSlug: "carrosserie-mounier",
    title: "Assistant client",
    content: "L’assistant V1 répond par mots-clés et pourra être enrichi par métier.",
    createdAt: "2026-06-02T10:00:00.000Z",
  },
];

export const demoClientContents: ClientContentRecord[] = [
  {
    id: "content_brand_notes",
    siteSlug: "carrosserie-mounier",
    type: "document",
    title: "Brief site vitrine",
    fileUrl: null,
    createdAt: "2026-06-02T11:00:00.000Z",
  },
];

export const demoSupportRequests: SupportRequestRecord[] = [
  {
    id: "req_home_copy",
    siteSlug: "carrosserie-mounier",
    title: "Ajuster un texte d'accueil",
    description: "Exemple de demande de modification suivie dans l'espace client.",
    status: "open",
    createdAt: "2026-06-02T12:00:00.000Z",
  },
];
