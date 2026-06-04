import { AppShell } from "../../components/layout/app-shell";
import { SiteHeader } from "../../components/layout/site-header";
import { UiButtonLink } from "../../components/ui/Button";

const presentationBlocks = [
  {
    title: "Comprendre avant de développer",
    text:
      "Chaque entreprise possède ses propres méthodes, ses contraintes et ses objectifs. Chez LYSMA Solutions, nous pensons qu’un bon outil ne doit pas imposer une façon de travailler. Il doit s’adapter aux besoins réels de ses utilisateurs et devenir un véritable support au quotidien.",
  },
  {
    title: "Des solutions conçues pour évoluer",
    text:
      "Applications métier, outils de gestion, plateformes collaboratives, sites internet ou solutions sur mesure : chaque projet est pensé pour être simple à utiliser, sécurisé et capable d’évoluer avec l’activité de l’entreprise.",
  },
  {
    title: "La technologie au service de l’humain",
    text:
      "Nous utilisons les technologies modernes et l’intelligence artificielle pour accélérer le développement et proposer des solutions performantes. Mais la technologie n’est jamais une finalité : elle doit simplifier le travail, faire gagner du temps et apporter une vraie valeur aux utilisateurs.",
  },
];

export default function PresentationPage() {
  return (
    <AppShell>
      <SiteHeader
        eyebrow="Présentation"
        title="Une vision simple : créer des outils réellement utiles."
        description="LYSMA Solutions conçoit des sites premium, des applications métier et des outils web pensés pour le quotidien des professionnels."
      />

      <section className="lysma-section lysma-presentation-hero">
        <div className="lysma-presentation-portrait">
          <img src="/caricature.png" alt="Portrait illustré LYSMA Solutions" />
        </div>
        <div className="lysma-presentation-intro">
          <p className="lysma-eyebrow">Notre point de départ</p>
          <h2>Des outils plus simples, mieux adaptés, plus utiles.</h2>
          <p>
            LYSMA Solutions est née d’un constat simple : trop d’entreprises utilisent encore des
            outils complexes, dispersés ou mal adaptés à leur quotidien.
          </p>
          <p>
            Notre mission est de concevoir des solutions numériques modernes qui simplifient le
            travail, améliorent l’organisation et permettent aux professionnels de se concentrer sur
            leur activité plutôt que sur l’administratif.
          </p>
          <div className="lysma-presentation-actions">
            <UiButtonLink href="/outils-web">Découvrir nos outils</UiButtonLink>
            <UiButtonLink href="/contact" variant="secondary">
              Nous écrire
            </UiButtonLink>
          </div>
        </div>
      </section>

      <section className="lysma-section lysma-presentation-grid">
        {presentationBlocks.map((block) => (
          <article className="lysma-ui-card" key={block.title}>
            <span className="lysma-presentation-dot" aria-hidden="true" />
            <h3>{block.title}</h3>
            <p>{block.text}</p>
          </article>
        ))}
      </section>

      <section className="lysma-section lysma-presentation-ambition">
        <p className="lysma-eyebrow">Notre ambition</p>
        <h2>Rendre le numérique professionnel plus accessible.</h2>
        <p>
          Nous voulons permettre aux professionnels, artisans, commerçants et entreprises de
          bénéficier d’outils numériques accessibles, performants et adaptés à leurs besoins, sans
          la complexité souvent associée aux logiciels traditionnels.
        </p>
        <strong>
          LYSMA Solutions conçoit des outils qui travaillent pour vous, afin que vous puissiez vous
          concentrer sur ce qui compte vraiment : votre métier.
        </strong>
      </section>
    </AppShell>
  );
}
