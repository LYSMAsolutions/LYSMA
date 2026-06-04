import { UiButtonLink } from "../ui/Button";
import { SectionTitle } from "../ui/section-title";

const supportItems = [
  "Cadrage du besoin",
  "Structure claire",
  "Contenus utiles",
  "Mise en ligne",
  "Vrai domaine",
  "\u00c9volutions possibles",
];

export function ClientSpaceSection() {
  return (
    <section className="lysma-section lysma-client-space" id="accompagnement">
      <div>
        <SectionTitle
          eyebrow="Accompagnement"
          title={"Un projet cadr\u00e9 avant d\u2019\u00eatre construit."}
          description="Nous gardons une approche simple : comprendre le besoin, organiser les contenus, construire proprement et livrer une base utile."
        />
        <UiButtonLink href="/contact">{"Parler d\u2019un projet"}</UiButtonLink>
      </div>
      <div className="lysma-client-space-list">
        {supportItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}
