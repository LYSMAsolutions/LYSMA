import { lysmaHome } from "../../data/lysma-home";
import { Badge } from "../ui/badge";
import { UiCard } from "../ui/Card";
import { SectionTitle } from "../ui/section-title";

export function OffersSection() {
  return (
    <section className="lysma-section" id="sites-web">
      <SectionTitle
        eyebrow="Ce que fait LYSMA"
        title="Sites web premium, outils app web et suivi digital."
        description="Un périmètre clair : pas de boutique en ligne, pas de réservation lourde. Nous construisons ce qui aide vraiment une entreprise à être visible et mieux organisée."
      />
      <div className="lysma-card-grid">
        {lysmaHome.offers.map((offer) => (
          <UiCard key={offer.title}>
            <Badge>{offer.tag}</Badge>
            <h3>{offer.title}</h3>
            <p>{offer.description}</p>
          </UiCard>
        ))}
      </div>
    </section>
  );
}
