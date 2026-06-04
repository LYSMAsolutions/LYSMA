import { AppShell } from "../../components/layout/app-shell";
import { SiteHeader } from "../../components/layout/site-header";
import { PageLinksSection } from "../../components/sections/page-links-section";
import { ShowcaseSection } from "../../components/sections/showcase-section";

export default function RealisationsPage() {
  return (
    <AppShell>
      <SiteHeader
        eyebrow="Réalisations"
        title="Des projets concrets, pas des exemples abstraits."
        description="Carrosserie Mounier et LIVO App montrent deux axes : site premium et outil métier."
      />
      <ShowcaseSection />
      <PageLinksSection
        links={[
          {
            title: "Créer un site web",
            description: "Voir ce qui est inclus dans une vitrine premium.",
            href: "/sites-web",
            label: "Sites web",
          },
          {
            title: "Créer un outil web",
            description: "Voir comment un outil peut simplifier une activité.",
            href: "/outils-web",
            label: "Outils web",
          },
        ]}
      />
    </AppShell>
  );
}
