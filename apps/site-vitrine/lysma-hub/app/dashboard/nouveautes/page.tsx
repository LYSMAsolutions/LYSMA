import { getProtectedDashboardData } from "../../../lib/protected-dashboard";

export default async function DashboardUpdatesPage() {
  const data = await getProtectedDashboardData();

  return (
    <section className="dashboard-grid">
      <article className="dashboard-card dashboard-card-wide">
        <span>Nouveautés LYSMA</span>
        <h2>Conseils, ressources et évolutions plateforme</h2>
        <p>
          Cette page centralise les annonces utiles au client : SEO, assistant, contenus et
          nouvelles options SaaS.
        </p>
      </article>
      <article className="dashboard-card dashboard-card-wide">
        <span>Fil d’information</span>
        <ul className="dashboard-list">
          {data.updates.map((update) => (
            <li key={update.id}>
              <strong>{update.title}</strong>
              <p>{update.content}</p>
              <small>{new Date(update.createdAt).toLocaleDateString("fr-FR")}</small>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
