import { lysmaHome } from "../../data/lysma-home";
import { UiCard } from "../ui/Card";
import { SectionTitle } from "../ui/section-title";

export function UpdatesSection() {
  return (
    <section className="lysma-section" id="nouveautes">
      <SectionTitle
        eyebrow="Nouveautés LYSMA"
        title="Ce que nous faisons évoluer."
        description="Chaque évolution doit aider à mieux présenter, organiser ou simplifier le quotidien d’un professionnel."
      />
      <div className="lysma-card-grid lysma-updates-grid">
        {lysmaHome.updates.map((update) => (
          <UiCard key={update.title}>
            <h3>{update.title}</h3>
            <p>{update.description}</p>
          </UiCard>
        ))}
      </div>
    </section>
  );
}
