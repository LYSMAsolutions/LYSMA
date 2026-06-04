import { AppShell } from "../../components/layout/app-shell";
import { SiteHeader } from "../../components/layout/site-header";
import { PageLinksSection } from "../../components/sections/page-links-section";
import { UiButtonLink } from "../../components/ui/Button";
import { SectionTitle } from "../../components/ui/section-title";

export default function EspaceClientPage() {
  return (
    <AppShell>
      <SiteHeader
        eyebrow="En préparation"
        title="L’espace client est mis de côté pour le moment."
        description="LYSMA Hub se concentre actuellement sur la présentation de LYSMA Solutions, les sites créés à la demande et les outils web métier."
      />
      <section className="lysma-section">
        <SectionTitle
          eyebrow="Priorité actuelle"
          title="Publier une vitrine claire avant d’ouvrir la plateforme."
          description="Les fonctions de suivi client, de compte et de publication automatisée restent prévues côté architecture, mais elles ne sont pas mises en avant dans cette première publication."
        />
        <UiButtonLink href="/contact">Nous écrire</UiButtonLink>
      </section>
      <PageLinksSection
        links={[
          {
            title: "Voir les sites web",
            description: "Comprendre l’offre de création de vitrine à la demande.",
            href: "/sites-web",
            label: "Sites web",
          },
          {
            title: "Voir la méthode",
            description: "Découvrir comment nous cadrons un projet avant de le construire.",
            href: "/methode",
            label: "Méthode",
          },
        ]}
      />
    </AppShell>
  );
}
