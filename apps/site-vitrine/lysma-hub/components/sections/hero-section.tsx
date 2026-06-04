import { lysmaHome } from "../../data/lysma-home";
import { UiButtonLink } from "../ui/Button";

export function HeroSection() {
  const { hero } = lysmaHome;

  return (
    <section className="lysma-hero">
      <div className="lysma-hero-copy">
        <p className="lysma-eyebrow">{hero.eyebrow}</p>
        <h1>{hero.title}</h1>
        <p>{hero.description}</p>
        <div className="lysma-hero-actions">
          <UiButtonLink href={hero.primaryCta.href}>{hero.primaryCta.label}</UiButtonLink>
          <UiButtonLink href={hero.secondaryCta.href} variant="secondary">
            {hero.secondaryCta.label}
          </UiButtonLink>
        </div>
      </div>
      <div className="lysma-hero-panel" aria-label="Indicateurs LYSMA">
        <div className="lysma-hero-panel-lead">
          <span>ADN LYSMA</span>
          <strong>Propre. Premium. Utile.</strong>
        </div>
        {hero.metrics.map((metric) => (
          <div key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
