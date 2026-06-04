import { lysmaHome } from "../../data/lysma-home";
import { UiCard } from "../ui/Card";
import { SectionTitle } from "../ui/section-title";

export function ProcessSection() {
  return (
    <section className="lysma-section" id="methode">
      <SectionTitle
        eyebrow="Méthode"
        title="Deux approches, selon le besoin."
        description="Un site et un outil métier ne répondent pas au même usage. Nous gardons une base claire et utile."
      />
      <div className="lysma-workflow-grid">
        {lysmaHome.workflows.map((workflow) => (
          <UiCard key={workflow.title} className="lysma-workflow-card">
            <span className="lysma-step-number">{workflow.eyebrow}</span>
            <h3>{workflow.title}</h3>
            <ol>
              {workflow.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </UiCard>
        ))}
      </div>
    </section>
  );
}
