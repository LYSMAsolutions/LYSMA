import { requireAuth, requireClientSiteAccess } from "./auth";
import { getClientDashboardData } from "./client-dashboard";

export const getProtectedDashboardData = async () => {
  const user = await requireAuth(["admin", "client"]);
  const data = await getClientDashboardData(user.id);

  await requireClientSiteAccess(data.site.siteSlug);

  return data;
};
