import type { SiteConfig, SiteNavigationItem, SitePage, SiteSection } from "./site-types";

export const getPagePath = (page: SitePage) => page.path ?? page.slug;

export const getHomePage = (site: SiteConfig) =>
  site.pages.find((page) => page.enabled !== false && (page.slug === "accueil" || page.slug === "home")) ??
  site.pages.find((page) => page.enabled !== false) ??
  site.pages[0];

export const resolveSitePage = (site: SiteConfig, pagePath?: string) => {
  const normalizedPath = pagePath?.replace(/^\/+|\/+$/g, "");

  if (!normalizedPath) {
    return getHomePage(site);
  }

  return (
    site.pages.find(
      (page) => page.enabled !== false && (getPagePath(page) === normalizedPath || page.slug === normalizedPath),
    ) ?? null
  );
};

export const getSectionAnchor = (section: SiteSection) => section.anchorId ?? section.id;

export const getSitePageHref = (site: SiteConfig, page: SitePage) => {
  const homePage = getHomePage(site);

  if (page.id === homePage.id) {
    return `/site/${site.slug}`;
  }

  return `/site/${site.slug}/${getPagePath(page)}`;
};

const flattenNavigationItems = (items: SiteNavigationItem[] = []): SiteNavigationItem[] =>
  items.flatMap((item) => [item, ...flattenNavigationItems(item.children)]);

export const getNavigationItems = (site: SiteConfig) => {
  if (site.navigation?.mode === "custom") {
    return [
      ...flattenNavigationItems(site.navigation.items),
      ...(site.navigation.groups ?? []).flatMap((group) => flattenNavigationItems(group.items)),
    ];
  }

  return site.pages
    .filter((page) => page.enabled !== false && page.showInNavigation !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map<SiteNavigationItem>((page) => ({
      id: page.id,
      label: page.navigationLabel ?? page.title,
      pageSlug: getPagePath(page),
    }));
};

export const resolveNavigationHref = (site: SiteConfig, item: SiteNavigationItem) => {
  if (item.href) {
    return item.href;
  }

  if (item.pageSlug) {
    const page = resolveSitePage(site, item.pageSlug);
    const pageHref = page ? getSitePageHref(site, page) : `/site/${site.slug}/${item.pageSlug}`;
    return item.anchorId ? `${pageHref}#${item.anchorId}` : pageHref;
  }

  if (item.anchorId) {
    return `#${item.anchorId}`;
  }

  return `/site/${site.slug}`;
};
