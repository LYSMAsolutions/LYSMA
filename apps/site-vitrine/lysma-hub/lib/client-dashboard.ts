import {
  demoClientContents,
  demoClientSites,
  demoSiteUpdates,
  demoSubscriptions,
  demoSupportRequests,
} from "../data/client-platform-demo";
import type { ClientDashboardData } from "./client-platform-types";
import { getHubUserById } from "./auth-store";

export const getClientDashboardData = async (userId: string): Promise<ClientDashboardData> => {
  const user = await getHubUserById(userId);

  if (!user) {
    throw new Error("Authenticated user not found in dashboard data.");
  }

  const siteSlug = user.role === "admin" ? "carrosserie-mounier" : user.siteSlug;

  if (!siteSlug) {
    throw new Error("Client user has no siteSlug.");
  }

  const site = demoClientSites.find((candidate) => candidate.siteSlug === siteSlug);

  if (!site) {
    throw new Error("Client site not found.");
  }

  return {
    user,
    site,
    subscription:
      demoSubscriptions.find((candidate) => candidate.siteSlug === siteSlug) ?? {
        id: `sub_${siteSlug}_pending`,
        siteSlug,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        status: "none",
        nextBillingDate: null,
      },
    updates: demoSiteUpdates.filter((update) => update.siteSlug === siteSlug),
    contents: demoClientContents.filter((content) => content.siteSlug === siteSlug),
    supportRequests: demoSupportRequests.filter((request) => request.siteSlug === siteSlug),
  };
};
