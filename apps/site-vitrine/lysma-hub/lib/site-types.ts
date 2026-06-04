export type SiteRadius = "soft" | "medium" | "large";
export type SiteStyle = "premium" | "sobre" | "artisan" | "tech";
export type SiteMode = "singlePage" | "multiPage";
export type SiteSectionType =
  | "hero"
  | "services"
  | "gallery"
  | "beforeAfter"
  | "stats"
  | "reviews"
  | "contact"
  | "contentBlocks";

export type SiteTheme = {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  shadowColor: string;
  headingFont: string;
  bodyFont: string;
  radius: SiteRadius;
  style: SiteStyle;
};

export type SiteBranding = {
  logoUrl?: string;
  logoAlt?: string;
};

export type SiteSeo = {
  title: string;
  description: string;
  noIndex?: boolean;
};

export type SiteNavigationItem = {
  id: string;
  label: string;
  href?: string;
  pageSlug?: string;
  anchorId?: string;
  external?: boolean;
  children?: SiteNavigationItem[];
};

export type SiteNavigationGroup = {
  id: string;
  label: string;
  items: SiteNavigationItem[];
};

export type SiteNavigation = {
  mode: "pages" | "custom";
  items?: SiteNavigationItem[];
  groups?: SiteNavigationGroup[];
};

export type ServiceItem = {
  title: string;
  description: string;
  badge?: string;
};

export type GalleryItem = {
  title: string;
  description: string;
  imageUrl?: string;
};

export type ReviewItem = {
  author: string;
  rating: number;
  comment: string;
  context?: string;
};

export type AssistantAction = {
  label: string;
  type: "contact" | "photo" | "phone" | "none";
};

export type AssistantRule = {
  id: string;
  siteSlug: string;
  keywords: string[];
  answer: string;
  action?: AssistantAction;
};

export type SiteBlockBase = {
  id: string;
  order: number;
  enabled: boolean;
};

export type TextBlock = SiteBlockBase & {
  type: "text";
  data: {
    eyebrow?: string;
    title: string;
    body: string;
  };
};

export type FeatureGridBlock = SiteBlockBase & {
  type: "featureGrid";
  data: {
    title?: string;
    items: Array<{
      title: string;
      description: string;
      badge?: string;
    }>;
  };
};

export type CtaBlock = SiteBlockBase & {
  type: "cta";
  data: {
    title: string;
    description: string;
    label: string;
    href: string;
  };
};

export type SiteBlock = TextBlock | FeatureGridBlock | CtaBlock;

export type HeroSectionData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  primaryCtaHref?: string;
  secondaryCtaHref?: string;
  highlights: string[];
};

export type ServicesSectionData = {
  eyebrow: string;
  title: string;
  description: string;
  items: ServiceItem[];
};

export type GallerySectionData = {
  eyebrow: string;
  title: string;
  description: string;
  items: GalleryItem[];
};

export type BeforeAfterSectionData = {
  eyebrow: string;
  title: string;
  description: string;
  beforeLabel: string;
  afterLabel: string;
};

export type StatsSectionData = {
  items: Array<{ value: string; label: string }>;
};

export type ReviewsSectionData = {
  eyebrow: string;
  title: string;
  items: ReviewItem[];
};

export type ContactSectionData = {
  eyebrow: string;
  title: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  hours: string[];
};

export type ContentBlocksSectionData = {
  eyebrow?: string;
  title?: string;
  description?: string;
  blocks: SiteBlock[];
};

export type SiteSectionBase = {
  id: string;
  enabled: boolean;
  order: number;
  anchorId?: string;
  navigationLabel?: string;
};

export type SiteSection =
  | (SiteSectionBase & { type: "hero"; data: HeroSectionData })
  | (SiteSectionBase & { type: "services"; data: ServicesSectionData })
  | (SiteSectionBase & { type: "gallery"; data: GallerySectionData })
  | (SiteSectionBase & { type: "beforeAfter"; data: BeforeAfterSectionData })
  | (SiteSectionBase & { type: "stats"; data: StatsSectionData })
  | (SiteSectionBase & { type: "reviews"; data: ReviewsSectionData })
  | (SiteSectionBase & { type: "contact"; data: ContactSectionData })
  | (SiteSectionBase & { type: "contentBlocks"; data: ContentBlocksSectionData });

export type SitePage = {
  id: string;
  slug: string;
  path?: string;
  parentId?: string | null;
  title: string;
  description: string;
  seo?: SiteSeo;
  order?: number;
  enabled?: boolean;
  showInNavigation?: boolean;
  navigationLabel?: string;
  sections: SiteSection[];
};

export type SiteConfig = {
  version?: "1" | "2";
  slug: string;
  name: string;
  baseline: string;
  businessType: string;
  branding?: SiteBranding;
  mode?: SiteMode;
  theme: SiteTheme;
  navigation?: SiteNavigation;
  pages: SitePage[];
};
