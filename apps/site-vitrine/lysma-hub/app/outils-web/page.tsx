import { AppShell } from "../../components/layout/app-shell";
import { SiteHeader } from "../../components/layout/site-header";
import { lysmaHome } from "../../data/lysma-home";
import { Badge } from "../../components/ui/badge";
import { UiButtonLink } from "../../components/ui/Button";
import { UiCard } from "../../components/ui/Card";
import { SectionTitle } from "../../components/ui/section-title";
import { PageLinksSection } from "../../components/sections/page-links-section";

export default function OutilsWebPage() {
  const workflow = lysmaHome.workflows.find((item) => item.eyebrow === "Outil web métier");

  return (
    <AppShell>
      <SiteHeader
        eyebrow="Outils web"
        title="Des outils web pour le vrai travail."
        description="Nous partons d’un problème concret : suivre, organiser, centraliser ou fiabiliser une habitude métier."
      />
      <section className="lysma-section">
        <SectionTitle
          eyebrow="Usage"
          title="Un outil doit être utilisé."
          description="Nous visons une première version simple, testable et améliorable."
        />
        <div className="lysma-card-grid">
          {["Suivi d’activité", "Demandes centralisées", "Données organisées", "Espace métier"].map((item) => (
            <UiCard key={item}>
              <Badge>App web</Badge>
              <h3>{item}</h3>
              <p>Un outil peut répondre à ce besoin si l’usage est fréquent.</p>
            </UiCard>
          ))}
        </div>
      </section>
      {workflow ? (
        <section className="lysma-section">
          <SectionTitle eyebrow={workflow.eyebrow} title={workflow.title} />
          <UiCard className="lysma-workflow-card">
            <ol>
              {workflow.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </UiCard>
        </section>
      ) : null}
      <section className="lysma-section lysma-section-strong">
        <SectionTitle
          eyebrow="Exemple"
          title="LIVO App fait partie de cette logique."
          description="Une application métier pensée pour un usage terrain."
        />
        <UiButtonLink href="/realisations">Voir les réalisations</UiButtonLink>
      </section>
      <PageLinksSection
        links={[
          {
            title: "Voir la méthode",
            description: "Comprendre comment un problème devient un outil.",
            href: "/methode",
            label: "Méthode",
          },
          {
            title: "Voir LIVO App",
            description: "Découvrir un exemple d’outil métier.",
            href: "/realisations",
            label: "Réalisations",
          },
        ]}
      />
    </AppShell>
  );
}
