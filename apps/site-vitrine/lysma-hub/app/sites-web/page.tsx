import { AppShell } from "../../components/layout/app-shell";
import { SiteHeader } from "../../components/layout/site-header";
import { PricingSection } from "../../components/sections/pricing-section";
import { PageLinksSection } from "../../components/sections/page-links-section";
import { lysmaHome } from "../../data/lysma-home";
import { Badge } from "../../components/ui/badge";
import { UiButtonLink } from "../../components/ui/Button";
import { UiCard } from "../../components/ui/Card";
import { SectionTitle } from "../../components/ui/section-title";

export default function SitesWebPage() {
  return (
    <AppShell>
      <SiteHeader
        eyebrow="Sites web"
        title="Des sites vitrines premium, avec un vrai domaine."
        description="Nous créons des sites clairs, crédibles et maintenables à la demande. Pas de boutique en ligne. Pas de réservation lourde."
      />
      <section className="lysma-section">
        <SectionTitle
          eyebrow="Périmètre"
          title="Ce que nous prenons en charge."
          description="L’objectif est simple : une présence solide, lisible et facile à faire évoluer."
        />
        <div className="lysma-card-grid">
          {lysmaHome.offers
            .filter((offer) => ["Vitrine", "Suivi", "SEO"].includes(offer.tag))
            .map((offer) => (
              <UiCard key={offer.title}>
                <Badge>{offer.tag}</Badge>
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
              </UiCard>
            ))}
        </div>
      </section>
      <section className="lysma-section lysma-section-strong">
        <SectionTitle
          eyebrow="Cadre"
          title="Pas de boutique. Pas de plateforme lourde."
          description="Nous restons concentrés sur la présentation, la crédibilité, le contact et une mise en ligne propre."
        />
        <UiButtonLink href="/methode">Voir notre méthode</UiButtonLink>
      </section>
      <PricingSection />
      <PageLinksSection
        links={[
          {
            title: "Comprendre la méthode",
            description: "Voir comment un besoin devient un site clair.",
            href: "/methode",
            label: "Voir la méthode",
          },
          {
            title: "Voir une réalisation",
            description: "Regarder Carrosserie Mounier pour voir le rendu attendu.",
            href: "/realisations",
            label: "Voir les réalisations",
          },
        ]}
      />
    </AppShell>
  );
}
