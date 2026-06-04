import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteRenderer } from "../../../../../components/site-renderer/SiteRenderer";
import { getProtectedDashboardData } from "../../../../../lib/protected-dashboard";
import { getSiteDraftForUser } from "../../../../../lib/site-draft-store";

export default async function SiteDraftPreviewPage({
  searchParams,
}: {
  searchParams?: Promise<{ draftId?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const dashboard = await getProtectedDashboardData();

  if (!params.draftId) {
    notFound();
  }

  const draft = await getSiteDraftForUser(params.draftId, dashboard.user.id);

  if (!draft) {
    notFound();
  }

  return (
    <section className="dashboard-preview-shell">
      <div className="dashboard-preview-toolbar">
        <div>
          <span>Aperçu du brouillon</span>
          <strong>{draft.config.name}</strong>
          <small>
            {draft.config.mode === "multiPage" ? "Multipage" : "Monopage"} - {draft.config.slug}
          </small>
        </div>
        <Link className="lysma-ui-button lysma-ui-button-secondary" href={`/dashboard/site/drafts/${draft.id}/edit`}>
          Modifier le brouillon
        </Link>
      </div>
      <div className="dashboard-preview-frame">
        <SiteRenderer site={draft.config} />
      </div>
    </section>
  );
}
