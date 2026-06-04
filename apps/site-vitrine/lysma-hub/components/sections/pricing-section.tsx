import { lysmaHome } from "../../data/lysma-home";
import { Badge } from "../ui/badge";
import { UiCard } from "../ui/Card";
import { SectionTitle } from "../ui/section-title";

export function PricingSection() {
  const { pricing } = lysmaHome;

  return (
    <section className="lysma-section" id="tarifs">
      <SectionTitle eyebrow="Tarifs" title={pricing.title} description={pricing.description} />
      <UiCard className="lysma-pricing-card">
        {pricing.items.map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </UiCard>
    </section>
  );
}
