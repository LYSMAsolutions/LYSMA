import { AppShell } from "../../components/layout/app-shell";
import { SiteHeader } from "../../components/layout/site-header";
import { PageLinksSection } from "../../components/sections/page-links-section";
import { ProcessSection } from "../../components/sections/process-section";

export default function MethodePage() {
  return (
    <AppShell>
      <SiteHeader
        eyebrow="Méthode"
        title="Une méthode claire, selon le projet."
        description="Un site et un outil métier ne se construisent pas pareil. Nous gardons une base simple, utile et suivie."
      />
      <ProcessSection />
      <PageLinksSection
        links={[
          {
            title: "Projet site web",
            description: "Voir comment cette méthode s’applique à une vitrine.",
            href: "/sites-web",
            label: "Sites web",
          },
          {
            title: "Projet outil web",
            description: "Voir comment cette méthode s’applique à un outil métier.",
            href: "/outils-web",
            label: "Outils web",
          },
        ]}
      />
    </AppShell>
  );
}
