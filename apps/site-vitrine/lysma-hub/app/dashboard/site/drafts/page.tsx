import Link from "next/link";
import { getProtectedDashboardData } from "../../../../lib/protected-dashboard";
import { getSiteDraftsForUser } from "../../../../lib/site-draft-store";

export default async function SiteDraftsPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const dashboard = await getProtectedDashboardData();
  const drafts = await getSiteDraftsForUser(dashboard.user.id);

  return (
    <section className="dashboard-grid">
      <article className="dashboard-card dashboard-card-wide">
        <span>Brouillons</span>
        <h2>Mes brouillons de sites</h2>
        <p>Chaque brouillon est isolé par utilisateur connecté et reste modifiable avant validation.</p>
        {params.error ? <p className="lysma-auth-error">{params.error}</p> : null}
        <Link className="lysma-ui-button lysma-ui-button-primary" href="/dashboard/site/create">
          Créer un nouveau brouillon
        </Link>
      </article>

      {drafts.length ? (
        drafts.map((draft) => (
          <article className="dashboard-card" key={draft.id}>
            <span>{draft.config.mode === "multiPage" ? "Multipage" : "Monopage"}</span>
            <h2>{draft.config.name}</h2>
            <p>{draft.config.baseline}</p>
            <ul className="dashboard-list">
              <li>
                <strong>{draft.config.slug}</strong>
                <small>Slug draft</small>
              </li>
              <li>
                <strong>{draft.config.pages.length} page(s)</strong>
                <small>Dernière sauvegarde : {new Date(draft.updatedAt).toLocaleString("fr-FR")}</small>
              </li>
            </ul>
            <div className="dashboard-card-actions">
              <Link className="lysma-ui-button lysma-ui-button-primary" href={`/dashboard/site/drafts/${draft.id}/edit`}>
                Modifier
              </Link>
              <Link
                className="lysma-ui-button lysma-ui-button-secondary"
                href={`/dashboard/site/create/preview?draftId=${draft.id}`}
              >
                Prévisualiser
              </Link>
            </div>
          </article>
        ))
      ) : (
        <article className="dashboard-card dashboard-card-wide">
          <span>Aucun brouillon</span>
          <h2>Commencer par l’onboarding</h2>
          <p>Générez un premier SiteConfig V2 pour pouvoir ensuite le modifier.</p>
        </article>
      )}
    </section>
  );
}
