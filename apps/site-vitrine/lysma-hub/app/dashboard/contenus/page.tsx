import { getProtectedDashboardData } from "../../../lib/protected-dashboard";

export default async function DashboardContentsPage() {
  const data = await getProtectedDashboardData();

  return (
    <section className="dashboard-grid">
      <article className="dashboard-card dashboard-card-wide">
        <span>Mes contenus</span>
        <h2>Documents, photos et ressources</h2>
        <p>
          Cette zone prépare le futur dépôt de documents, photos client et contenus utiles au site
          vitrine.
        </p>
      </article>
      <article className="dashboard-card dashboard-card-wide">
        <span>Contenus associés</span>
        <ul className="dashboard-list">
          {data.contents.map((content) => (
            <li key={content.id}>
              <strong>{content.title}</strong>
              <p>Type : {content.type}</p>
              <small>{content.fileUrl ? content.fileUrl : "Aucun fichier lié pour la V1"}</small>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
