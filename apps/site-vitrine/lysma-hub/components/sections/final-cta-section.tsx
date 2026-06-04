import { lysmaHome } from "../../data/lysma-home";
import { UiButtonLink } from "../ui/Button";

export function FinalCtaSection() {
  const { finalCta } = lysmaHome;

  return (
    <section className="lysma-final-cta" id="contact">
      <p className="lysma-eyebrow">Contact</p>
      <h2>{finalCta.title}</h2>
      <p>{finalCta.description}</p>
      <div>
        <UiButtonLink href={finalCta.primaryCta.href}>{finalCta.primaryCta.label}</UiButtonLink>
        <UiButtonLink href={finalCta.secondaryCta.href} variant="secondary">
          {finalCta.secondaryCta.label}
        </UiButtonLink>
      </div>
    </section>
  );
}
