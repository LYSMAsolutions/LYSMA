import { lysmaHome } from "../../data/lysma-home";
import { UiCard } from "../ui/Card";
import { SectionTitle } from "../ui/section-title";

export function FaqSection() {
  return (
    <section className="lysma-section">
      <SectionTitle eyebrow="FAQ" title="Questions fréquentes" />
      <div className="lysma-faq-grid">
        {lysmaHome.faq.map((item) => (
          <UiCard key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </UiCard>
        ))}
      </div>
    </section>
  );
}
