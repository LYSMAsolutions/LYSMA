import { AppShell } from "../../components/layout/app-shell";
import { SiteHeader } from "../../components/layout/site-header";
import { PageLinksSection } from "../../components/sections/page-links-section";
import { UpdatesSection } from "../../components/sections/updates-section";

export default function NouveautesPage() {
  return (
    <AppShell>
      <SiteHeader
        eyebrow="Nouveautés LYSMA"
        title="Ce qui évolue, simplement."
        description="Nous partageons ici les évolutions utiles autour des sites, des outils web et de notre façon d’accompagner les projets."
      />
      <UpdatesSection />
      <PageLinksSection
        links={[
          {
            title: "Voir la méthode",
            description: "Comprendre comment nous cadrons un projet avant de le construire.",
            href: "/methode",
            label: "Méthode",
          },
          {
            title: "Contact",
            description: "Parler d’un site ou d’un outil à construire.",
            href: "/contact",
            label: "Contact",
          },
        ]}
      />
    </AppShell>
  );
}
