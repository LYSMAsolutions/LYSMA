import type { HeroSectionData } from "../../lib/site-types";
import { ButtonLink } from "../ui/Button";

export function HeroSection({ data, anchorId }: { data: HeroSectionData; anchorId?: string }) {
  return (
    <section className="hub-hero" id={anchorId}>
      <div className="hub-shell hub-hero-grid">
        <div className="hub-hero-copy">
          <p className="hub-kicker">{data.eyebrow}</p>
          <h1>{data.title}</h1>
          <p className="hub-hero-text">{data.subtitle}</p>
          <div className="hub-actions">
            <ButtonLink href={data.primaryCtaHref ?? "#contact"}>{data.primaryCta}</ButtonLink>
            <ButtonLink href={data.secondaryCtaHref ?? "#prestations"} variant="secondary">
              {data.secondaryCta}
            </ButtonLink>
          </div>
        </div>
        <div className="hub-hero-panel" aria-label="Synthese des services">
          {data.highlights.map((highlight) => (
            <span key={highlight}>{highlight}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
