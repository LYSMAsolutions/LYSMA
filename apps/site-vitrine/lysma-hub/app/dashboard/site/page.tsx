import { getProtectedDashboardData } from "../../../lib/protected-dashboard";

const statusLabel = {
  active: "Actif",
  draft: "Brouillon",
  paused: "En pause",
};

export default async function DashboardSitePage() {
  const data = await getProtectedDashboardData();

  return (
    <section className="dashboard-grid">
      <article className="dashboard-card dashboard-card-wide">
        <span>Mon site</span>
        <h2>{data.site.siteName}</h2>
        <p>Cette page centralise les informations du site public associé au client connecté.</p>
        <div className="dashboard-metric">
          <div>
            <strong>{data.site.siteSlug}</strong>
            <span>Slug client</span>
          </div>
          <div>
            <strong>{statusLabel[data.site.status]}</strong>
            <span>Statut</span>
          </div>
          <div>
            <strong>{data.site.plan}</strong>
            <span>Plan</span>
          </div>
        </div>
      </article>
      <article className="dashboard-card">
        <span>Site public</span>
        <h2>URL client</h2>
        <p>Le site public reste rendu par le moteur SiteConfig existant.</p>
        <a className="dashboard-action" href={`/site/${data.site.siteSlug}`} target="_blank" rel="noreferrer">
          Ouvrir le site
        </a>
      </article>
      <article className="dashboard-card">
        <span>Onboarding</span>
        <h2>Créer mon site</h2>
        <p>Générer un brouillon SiteConfig V2, choisir la structure, les couleurs et les pages de base.</p>
        <a className="dashboard-action" href="/dashboard/site/create">
          Lancer l'onboarding
        </a>
      </article>
      <article className="dashboard-card">
        <span>Brouillons</span>
        <h2>Modifier mes brouillons</h2>
        <p>Retrouver les SiteConfig V2 générés, modifier les pages, les textes, les couleurs et les blocs.</p>
        <a className="dashboard-action" href="/dashboard/site/drafts">
          Voir mes brouillons
        </a>
      </article>
      <article className="dashboard-card">
        <span>Isolation client</span>
        <h2>Accès contrôlé</h2>
        <p>
          Les données de cette page sont chargées côté serveur depuis l’utilisateur connecté et son
          `siteSlug`.
        </p>
      </article>
    </section>
  );
}
