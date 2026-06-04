import type { ReactNode } from "react";
import { AppShell } from "../../components/layout/app-shell";
import { UiButtonLink } from "../../components/ui/Button";
import { dashboardNavigation } from "../../lib/navigation";
import { getProtectedDashboardData } from "../../lib/protected-dashboard";
import { endDemoSession } from "../login/actions";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const data = await getProtectedDashboardData();

  return (
    <div className="lysma-dashboard-shell">
      <AppShell
        sidebarItems={dashboardNavigation}
        sidebarTitle="LYSMA Hub"
        sidebarSubtitle={data.site.siteName}
        withFooter={false}
      >
        <header className="dashboard-topbar">
          <div>
            <p className="lysma-eyebrow">Espace client sécurisé</p>
            <h1>{data.site.siteName}</h1>
            <p>
              {data.user.email} - rôle {data.user.role}
            </p>
          </div>
          <div className="dashboard-topbar-actions">
            <UiButtonLink href={`/site/${data.site.siteSlug}`} variant="primary">
              Voir le site public
            </UiButtonLink>
            <form action={endDemoSession}>
              <button type="submit" className="lysma-ui-button lysma-ui-button-secondary">
                Déconnexion
              </button>
            </form>
          </div>
        </header>
        {children}
      </AppShell>
    </div>
  );
}
