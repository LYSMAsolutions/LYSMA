import { siteTemplateExample } from "../data/site-template.example";
import type { SiteConfig, SitePage, SiteSection, SiteTheme } from "./site-types";

export type SiteDraftInput = {
  mode: "singlePage" | "multiPage";
  name: string;
  baseline: string;
  businessType: string;
  slug: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  logoUrl?: string;
  pages: string[];
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const getTemplateSections = () => clone(siteTemplateExample.pages[0]?.sections ?? []);

const pageTitleFromKey = (key: string) => {
  const titles: Record<string, string> = {
    accueil: "Accueil",
    services: "Services",
    realisations: "Realisations",
    contact: "Contact",
  };

  return titles[key] ?? key;
};

const filterSections = (sections: SiteSection[], sectionIds: string[]) =>
  sections.filter((section) => sectionIds.includes(section.id));

const patchIdentity = (sections: SiteSection[], input: SiteDraftInput) =>
  sections.map((section) => {
    if (section.type === "hero") {
      return {
        ...section,
        data: {
          ...section.data,
          eyebrow: input.businessType,
          title: input.name,
          subtitle: input.baseline,
          highlights: [input.businessType, "Accompagnement", "Contact clair"],
        },
      };
    }

    if (section.type === "contact") {
      return {
        ...section,
        data: {
          ...section.data,
          email: "contact@example.com",
          title: `Contacter ${input.name}`,
          description: "Decrivez votre besoin pour etre recontacte avec les bonnes informations.",
        },
      };
    }

    return section;
  });

const createSinglePage = (input: SiteDraftInput): SitePage => ({
  id: "home",
  slug: "accueil",
  path: "accueil",
  title: input.name,
  description: input.baseline,
  seo: {
    title: `${input.name} - ${input.businessType}`,
    description: input.baseline,
  },
  order: 1,
  enabled: true,
  showInNavigation: true,
  navigationLabel: "Accueil",
  sections: patchIdentity(getTemplateSections(), input),
});

const createMultiPage = (input: SiteDraftInput): SitePage[] => {
  const sections = getTemplateSections();
  const selectedPages = input.pages.length ? input.pages : ["accueil", "services", "contact"];
  const pageDefinitions: Record<string, { order: number; sectionIds: string[] }> = {
    accueil: { order: 1, sectionIds: ["hero", "content", "stats"] },
    services: { order: 2, sectionIds: ["services"] },
    realisations: { order: 3, sectionIds: ["gallery", "reviews"] },
    contact: { order: 4, sectionIds: ["contact"] },
  };

  return selectedPages.map((pageKey) => {
    const definition = pageDefinitions[pageKey] ?? {
      order: selectedPages.indexOf(pageKey) + 1,
      sectionIds: ["content"],
    };
    const title = pageTitleFromKey(pageKey);
    const pageSections = patchIdentity(filterSections(sections, definition.sectionIds), input);

    return {
      id: pageKey,
      slug: pageKey,
      path: pageKey,
      title,
      description: `${title} - ${input.name}`,
      seo: {
        title: `${title} - ${input.name}`,
        description: input.baseline,
      },
      order: definition.order,
      enabled: true,
      showInNavigation: true,
      navigationLabel: title,
      sections: pageSections,
    };
  });
};

export const createSiteDraftConfig = (input: SiteDraftInput): SiteConfig => {
  const theme: SiteTheme = {
    ...siteTemplateExample.theme,
    primaryColor: input.primaryColor,
    secondaryColor: input.secondaryColor,
    backgroundColor: input.backgroundColor,
    textColor: input.textColor,
  };
  const pages = input.mode === "multiPage" ? createMultiPage(input) : [createSinglePage(input)];

  return {
    ...clone(siteTemplateExample),
    version: "2",
    slug: input.slug,
    name: input.name,
    baseline: input.baseline,
    businessType: input.businessType,
    branding: input.logoUrl
      ? {
          logoUrl: input.logoUrl,
          logoAlt: `${input.name} logo`,
        }
      : undefined,
    mode: input.mode,
    theme,
    navigation: {
      mode: "pages",
    },
    pages,
  };
};
