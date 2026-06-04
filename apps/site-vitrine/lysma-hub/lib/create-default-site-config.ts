import type { SiteConfig, SiteNavigation, SitePage, SiteSection, SiteTheme } from "./site-types";

type SiteConfigOverrides = Partial<Omit<SiteConfig, "theme" | "pages">> & {
  theme?: Partial<SiteTheme>;
  navigation?: SiteNavigation;
  pages?: SitePage[];
  sections?: SiteSection[];
};

const defaultTheme: SiteTheme = {
  primaryColor: "#06182d",
  secondaryColor: "#1e73d8",
  backgroundColor: "#f6f8fb",
  textColor: "#111827",
  shadowColor: "#0f172a",
  headingFont: "Inter, system-ui, sans-serif",
  bodyFont: "Inter, system-ui, sans-serif",
  radius: "medium",
  style: "premium",
};

const defaultSections: SiteSection[] = [
  {
    id: "hero",
    type: "hero",
    enabled: true,
    order: 1,
    anchorId: "hero",
    data: {
      eyebrow: "Site vitrine premium",
      title: "Nom de l'entreprise",
      subtitle:
        "Presentation courte de l'activite, du positionnement et de la promesse client.",
      primaryCta: "Demander un devis",
      secondaryCta: "Voir les services",
      primaryCtaHref: "#contact",
      secondaryCtaHref: "#services",
      highlights: ["Service 1", "Service 2", "Service 3"],
    },
  },
  {
    id: "services",
    type: "services",
    enabled: true,
    order: 2,
    anchorId: "services",
    data: {
      eyebrow: "Services",
      title: "Les prestations principales.",
      description:
        "Une section simple pour presenter les services les plus importants du client.",
      items: [
        {
          title: "Prestation principale",
          description: "Description courte, concrete et orientee client.",
          badge: "Priorite",
        },
        {
          title: "Prestation secondaire",
          description: "Description courte, concrete et orientee client.",
          badge: "Service",
        },
        {
          title: "Accompagnement",
          description: "Description courte, concrete et orientee client.",
          badge: "Conseil",
        },
      ],
    },
  },
  {
    id: "gallery",
    type: "gallery",
    enabled: true,
    order: 3,
    anchorId: "realisations",
    data: {
      eyebrow: "Realisations",
      title: "Quelques exemples de realisations.",
      description:
        "Cette section peut rester active avec des cartes texte, ou recevoir des images dans une evolution future.",
      items: [
        { title: "Realisation 1", description: "Resultat client ou cas d'usage." },
        { title: "Realisation 2", description: "Resultat client ou cas d'usage." },
        { title: "Realisation 3", description: "Resultat client ou cas d'usage." },
      ],
    },
  },
  {
    id: "before-after",
    type: "beforeAfter",
    enabled: false,
    order: 4,
    anchorId: "avant-apres",
    data: {
      eyebrow: "Avant / apres",
      title: "Une transformation claire et lisible.",
      description:
        "Section reservee aux creations LYSMA quand une preuve visuelle forte est pertinente.",
      beforeLabel: "Avant",
      afterLabel: "Apres",
    },
  },
  {
    id: "stats",
    type: "stats",
    enabled: true,
    order: 5,
    anchorId: "reperes",
    data: {
      items: [
        { value: "10+", label: "Annees d'experience" },
        { value: "100%", label: "Suivi client" },
        { value: "48h", label: "Delai de reponse moyen" },
      ],
    },
  },
  {
    id: "reviews",
    type: "reviews",
    enabled: true,
    order: 6,
    anchorId: "avis",
    data: {
      eyebrow: "Avis clients",
      title: "Des clients accompagnes avec serieux.",
      items: [
        {
          author: "Client",
          rating: 5,
          comment: "Service clair, professionnel et conforme aux attentes.",
          context: "Avis exemple",
        },
      ],
    },
  },
  {
    id: "contact",
    type: "contact",
    enabled: true,
    order: 7,
    anchorId: "contact",
    data: {
      eyebrow: "Contact",
      title: "Parlez-nous de votre besoin.",
      description:
        "Le formulaire qualifie la demande et laisse l'entreprise recontacter le client.",
      phone: "00 00 00 00 00",
      email: "contact@example.com",
      address: "Adresse de l'entreprise",
      hours: ["Lundi - Vendredi : 9h - 18h"],
    },
  },
];

const createDefaultPage = (sections: SiteSection[]): SitePage => ({
  id: "home",
  slug: "accueil",
  path: "accueil",
  title: "Site vitrine client",
  description: "Site vitrine premium configure avec LYSMA Hub.",
  seo: {
    title: "Site vitrine client",
    description: "Site vitrine premium configure avec LYSMA Hub.",
  },
  order: 1,
  enabled: true,
  showInNavigation: true,
  navigationLabel: "Accueil",
  sections,
});

export const createDefaultSiteConfig = (overrides: SiteConfigOverrides = {}): SiteConfig => {
  const { theme, pages, sections, navigation, ...siteOverrides } = overrides;
  const resolvedSections = sections ?? defaultSections;

  return {
    version: "2",
    slug: "nouveau-client",
    name: "Nouveau client",
    baseline: "Site vitrine premium",
    businessType: "Activite client",
    mode: pages && pages.length > 1 ? "multiPage" : "singlePage",
    ...siteOverrides,
    theme: {
      ...defaultTheme,
      ...theme,
    },
    navigation: navigation ?? {
      mode: "custom",
      items: [
        { id: "nav-home", label: "Accueil", pageSlug: "accueil", anchorId: "hero" },
        { id: "nav-services", label: "Services", pageSlug: "accueil", anchorId: "services" },
        { id: "nav-realisations", label: "Realisations", pageSlug: "accueil", anchorId: "realisations" },
        { id: "nav-contact", label: "Contact", pageSlug: "accueil", anchorId: "contact" },
      ],
    },
    pages: pages ?? [createDefaultPage(resolvedSections)],
  };
};
