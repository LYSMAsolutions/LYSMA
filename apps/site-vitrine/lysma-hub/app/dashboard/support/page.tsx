import { getProtectedDashboardData } from "../../../lib/protected-dashboard";

const supportStatusLabel = {
  open: "Ouverte",
  in_progress: "En cours",
  resolved: "Résolue",
};

export default async function DashboardSupportPage() {
  const data = await getProtectedDashboardData();

  return (
    <section className="dashboard-grid">
      <article className="dashboard-card">
        <span>Support</span>
        <h2>Demandes de modification</h2>
        <p>
          Les demandes restent mockées en V1.1, mais la page est déjà structurée pour un futur
          suivi client.
        </p>
      </article>
      <article className="dashboard-card">
        <span>Nouvelle demande</span>
        <h2>Formulaire futur</h2>
        <p>
          La création de demande sera branchée plus tard avec validation serveur et stockage par
          `siteSlug`.
        </p>
      </article>
      <article className="dashboard-card dashboard-card-wide">
        <span>Suivi</span>
        <ul className="dashboard-list">
          {data.supportRequests.map((request) => (
            <li key={request.id}>
              <strong>{request.title}</strong>
              <p>{request.description}</p>
              <small>Statut : {supportStatusLabel[request.status]}</small>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
