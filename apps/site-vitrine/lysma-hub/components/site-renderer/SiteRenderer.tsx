import type { CSSProperties } from "react";
import type { SiteConfig, SiteSection } from "../../lib/site-types";
import { getNavigationItems, getSectionAnchor, resolveNavigationHref, resolveSitePage } from "../../lib/site-routing";
import { getThemeTokens } from "../../lib/theme-utils";
import { BeforeAfterSection } from "./BeforeAfterSection";
import { ContactSection } from "./ContactSection";
import { ContentBlocksSection } from "./ContentBlocksSection";
import { FloatingAssistant } from "./FloatingAssistant";
import { GallerySection } from "./GallerySection";
import { HeroSection } from "./HeroSection";
import { ReviewsSection } from "./ReviewsSection";
import { ServicesSection } from "./ServicesSection";
import { StatsSection } from "./StatsSection";

const renderSection = (section: SiteSection, siteSlug: string) => {
  const anchorId = getSectionAnchor(section);

  switch (section.type) {
    case "hero":
      return <HeroSection key={section.id} data={section.data} anchorId={anchorId} />;
    case "services":
      return <ServicesSection key={section.id} data={section.data} anchorId={anchorId} />;
    case "gallery":
      return <GallerySection key={section.id} data={section.data} anchorId={anchorId} />;
    case "beforeAfter":
      return <BeforeAfterSection key={section.id} data={section.data} anchorId={anchorId} />;
    case "stats":
      return <StatsSection key={section.id} data={section.data} anchorId={anchorId} />;
    case "reviews":
      return <ReviewsSection key={section.id} data={section.data} anchorId={anchorId} />;
    case "contact":
      return <ContactSection key={section.id} data={section.data} siteSlug={siteSlug} anchorId={anchorId} />;
    case "contentBlocks":
      return <ContentBlocksSection key={section.id} data={section.data} anchorId={anchorId} />;
    default:
      return null;
  }
};

export function SiteRenderer({ site, pagePath }: { site: SiteConfig; pagePath?: string }) {
  const page = resolveSitePage(site, pagePath);
  const tokens = getThemeTokens(site.theme);
  const navigationItems = getNavigationItems(site);

  if (!page) {
    return null;
  }

  const sections = page.sections
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <main
      className="hub-site"
      style={
        {
          "--hub-primary": site.theme.primaryColor,
          "--hub-secondary": site.theme.secondaryColor,
          "--hub-bg": site.theme.backgroundColor,
          "--hub-text": site.theme.textColor,
          "--hub-muted": tokens.mutedText,
          "--hub-gradient": tokens.gradient,
          "--hub-hero-gradient": tokens.heroGradient,
          "--hub-card": tokens.cardColor,
          "--hub-border": tokens.borderColor,
          "--hub-shadow": tokens.softShadow,
          "--hub-hover": tokens.buttonHover,
          "--hub-radius": tokens.radius,
          "--hub-heading-font": site.theme.headingFont,
          "--hub-body-font": site.theme.bodyFont,
        } as CSSProperties
      }
    >
      <header className="hub-header">
        <div className="hub-shell hub-header-inner">
          <a href={`/site/${site.slug}`} className="hub-brand" aria-label={`Accueil ${site.name}`}>
            {site.branding?.logoUrl ? (
              <img src={site.branding.logoUrl} alt={site.branding.logoAlt ?? site.name} />
            ) : null}
            <span>
              <strong>{site.name}</strong>
              <small>{site.baseline}</small>
            </span>
          </a>
          <nav aria-label="Navigation du site vitrine">
            {navigationItems.map((item) => (
              <a
                key={item.id}
                href={resolveNavigationHref(site, item)}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <div id="top">{sections.map((section) => renderSection(section, site.slug))}</div>
      <FloatingAssistant siteSlug={site.slug} />
    </main>
  );
}
