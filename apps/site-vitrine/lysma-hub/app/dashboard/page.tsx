import Link from "next/link";
import { getProtectedDashboardData } from "../../lib/protected-dashboard";

const statusLabel = {
  active: "Actif",
  draft: "Brouillon",
  paused: "En pause",
};

export default async function DashboardPage() {
  const data = await getProtectedDashboardData();

  return (
    <section className="dashboard-grid">
      <article className="dashboard-card">
        <span>Mon site</span>
        <h2>{data.site.siteName}</h2>
        <p>Plan : {data.site.plan}</p>
        <p>Statut : {statusLabel[data.site.status]}</p>
        <Link className="dashboard-action" href="/dashboard/site">
          Gérer mon site
        </Link>
      </article>

      <article className="dashboard-card">
        <span>Nouveautés LYSMA</span>
        <h2>{data.updates.length} ressources</h2>
        <p>Conseils SEO, nouveautés plateforme et évolutions de l’assistant.</p>
        <Link className="dashboard-action" href="/dashboard/nouveautes">
          Voir les nouveautés
        </Link>
      </article>

      <article className="dashboard-card">
        <span>Mes contenus</span>
        <h2>{data.contents.length} élément</h2>
        <p>Documents, photos et contenus préparés pour les futures évolutions.</p>
        <Link className="dashboard-action" href="/dashboard/contenus">
          Ouvrir les contenus
        </Link>
      </article>

      <article className="dashboard-card">
        <span>Support</span>
        <h2>{data.supportRequests.length} demande</h2>
        <p>Suivre les demandes de modification et les prochains échanges avec LYSMA.</p>
        <Link className="dashboard-action" href="/dashboard/support">
          Voir le support
        </Link>
      </article>
    </section>
  );
}
