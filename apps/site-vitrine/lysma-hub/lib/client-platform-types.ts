export type UserRole = "admin" | "client";
export type ClientSiteStatus = "active" | "draft" | "paused";
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "none";
export type SupportRequestStatus = "open" | "in_progress" | "resolved";
export type ClientContentType = "document" | "photo" | "resource";

export type HubUser = {
  id: string;
  email: string;
  role: UserRole;
  siteSlug: string | null;
  createdAt: string;
};

export type ClientSiteRecord = {
  id: string;
  siteSlug: string;
  siteName: string;
  plan: string;
  status: ClientSiteStatus;
};

export type SubscriptionRecord = {
  id: string;
  siteSlug: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  status: SubscriptionStatus;
  nextBillingDate: string | null;
};

export type SiteUpdateRecord = {
  id: string;
  siteSlug: string;
  title: string;
  content: string;
  createdAt: string;
};

export type ClientContentRecord = {
  id: string;
  siteSlug: string;
  type: ClientContentType;
  title: string;
  fileUrl: string | null;
  createdAt: string;
};

export type SupportRequestRecord = {
  id: string;
  siteSlug: string;
  title: string;
  description: string;
  status: SupportRequestStatus;
  createdAt: string;
};

export type ClientDashboardData = {
  user: HubUser;
  site: ClientSiteRecord;
  subscription: SubscriptionRecord;
  updates: SiteUpdateRecord[];
  contents: ClientContentRecord[];
  supportRequests: SupportRequestRecord[];
};
