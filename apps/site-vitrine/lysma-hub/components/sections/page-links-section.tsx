import { UiButtonLink } from "../ui/Button";
import { UiCard } from "../ui/Card";
import { SectionTitle } from "../ui/section-title";

type PageLink = {
  title: string;
  description: string;
  href: string;
  label: string;
};

export function PageLinksSection({
  eyebrow = "Continuer",
  title = "La suite logique",
  links,
}: {
  eyebrow?: string;
  title?: string;
  links: PageLink[];
}) {
  return (
    <section className="lysma-section">
      <SectionTitle eyebrow={eyebrow} title={title} />
      <div className="lysma-page-links-grid">
        {links.map((link) => (
          <UiCard key={link.href} className="lysma-page-link-card">
            <h3>{link.title}</h3>
            <p>{link.description}</p>
            <UiButtonLink href={link.href} variant="ghost">
              {link.label}
            </UiButtonLink>
          </UiCard>
        ))}
      </div>
    </section>
  );
}
