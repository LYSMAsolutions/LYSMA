import { AppShell } from "../../components/layout/app-shell";
import { SiteHeader } from "../../components/layout/site-header";

export default function LegalNoticePage() {
  return (
    <AppShell>
      <SiteHeader
        eyebrow="Informations légales"
        title="Mentions légales"
        description="Les informations ci-dessous présentent l’éditeur du site LYSMA Solutions et le cadre général d’utilisation."
      />

      <section className="lysma-section lysma-legal-page">
        <article className="lysma-ui-card">
          <h2>Éditeur du site</h2>
          <p>
            Ce site est édité par LYSMA Solutions. Les informations administratives complètes
            pourront être précisées lors de la mise en production définitive.
          </p>
          <p>Email de contact : lysmasolutions@gmail.com</p>
        </article>

        <article className="lysma-ui-card">
          <h2>Responsabilité</h2>
          <p>
            LYSMA Solutions met tout en œuvre pour fournir des informations fiables et à jour.
            Toutefois, le contenu du site peut évoluer et ne constitue pas un engagement contractuel
            hors devis, contrat ou échange écrit validé.
          </p>
        </article>

        <article className="lysma-ui-card">
          <h2>Propriété intellectuelle</h2>
          <p>
            Les textes, visuels, interfaces, logos et éléments graphiques présentés sur ce site
            restent la propriété de LYSMA Solutions ou de leurs propriétaires respectifs. Toute
            reproduction non autorisée est interdite.
          </p>
        </article>

        <article className="lysma-ui-card">
          <h2>Hébergement</h2>
          <p>
            Le site est conçu pour être hébergé sur une infrastructure web moderne. Les informations
            exactes de l’hébergeur seront indiquées lors du déploiement public final.
          </p>
        </article>
      </section>
    </AppShell>
  );
}
