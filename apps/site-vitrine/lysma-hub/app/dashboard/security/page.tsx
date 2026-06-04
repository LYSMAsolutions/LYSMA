import { getProtectedDashboardData } from "../../../lib/protected-dashboard";
import { getSecuritySummary } from "../../../lib/auth-store";

export default async function DashboardSecurityPage() {
  const data = await getProtectedDashboardData();
  const security = await getSecuritySummary(data.user.id);

  return (
    <section className="dashboard-grid">
      <article className="dashboard-card">
        <span>Sécurité</span>
        <h2>Sessions actives</h2>
        <p className="dashboard-muted">
          {security.activeSessions.length} session(s) active(s). La déconnexion et le reset mot de
          passe révoquent les sessions côté serveur.
        </p>
      </article>
      <article className="dashboard-card">
        <span>Compte</span>
        <h2>Accès protégé</h2>
        <p>
          Email vérifié obligatoire, mot de passe hashé, cookie httpOnly signé et vérification serveur
          à chaque page privée.
        </p>
      </article>
      <article className="dashboard-card dashboard-card-wide">
        <span>Historique</span>
        <h2>Derniers événements sécurité</h2>
        <ul className="dashboard-list">
          {security.events.length ? (
            security.events.map((event) => (
              <li key={event.id}>
                <strong>{event.type}</strong>
                <small>{new Date(event.createdAt).toLocaleString("fr-FR")}</small>
              </li>
            ))
          ) : (
            <li>
              <strong>Aucun événement récent</strong>
              <small>Les connexions, déconnexions et resets apparaîtront ici.</small>
            </li>
          )}
        </ul>
      </article>
    </section>
  );
}
