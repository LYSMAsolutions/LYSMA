"use server";

import { redirect } from "next/navigation";
import { createSiteDraftConfig } from "../../../../lib/site-draft-generator";
import { saveSiteDraft } from "../../../../lib/site-draft-store";
import { getProtectedDashboardData } from "../../../../lib/protected-dashboard";
import { isSafeSlug, sanitizeText } from "../../../../lib/security";

const COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
const ALLOWED_PAGES = ["accueil", "services", "realisations", "contact"];

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const readColor = (value: FormDataEntryValue | null, fallback: string) => {
  const color = sanitizeText(value, 12);
  return COLOR_PATTERN.test(color) ? color : fallback;
};

export async function createSiteDraftAction(formData: FormData) {
  const dashboard = await getProtectedDashboardData();
  const modeValue = sanitizeText(formData.get("mode"), 20);
  const mode = modeValue === "multiPage" ? "multiPage" : "singlePage";
  const name = sanitizeText(formData.get("name"), 120);
  const baseline = sanitizeText(formData.get("baseline"), 220);
  const businessType = sanitizeText(formData.get("businessType"), 120);
  const requestedSlug = slugify(sanitizeText(formData.get("slug"), 100) || name);
  const logoUrl = sanitizeText(formData.get("logoUrl"), 500);
  const pages = formData
    .getAll("pages")
    .map((page) => sanitizeText(page, 40))
    .filter((page) => ALLOWED_PAGES.includes(page));

  if (!name || !baseline || !businessType || !requestedSlug || !isSafeSlug(requestedSlug)) {
    redirect("/dashboard/site/create?error=Informations%20incompletes");
  }

  if (logoUrl && !/^https?:\/\//.test(logoUrl) && !logoUrl.startsWith("/")) {
    redirect("/dashboard/site/create?error=Logo%20invalide");
  }

  const config = createSiteDraftConfig({
    mode,
    name,
    baseline,
    businessType,
    slug: requestedSlug,
    logoUrl: logoUrl || undefined,
    primaryColor: readColor(formData.get("primaryColor"), "#06182d"),
    secondaryColor: readColor(formData.get("secondaryColor"), "#1e73d8"),
    backgroundColor: readColor(formData.get("backgroundColor"), "#f6f8fb"),
    textColor: readColor(formData.get("textColor"), "#111827"),
    pages: mode === "multiPage" ? pages : ["accueil"],
  });

  const draft = await saveSiteDraft({
    userId: dashboard.user.id,
    siteSlug: dashboard.user.siteSlug,
    config,
  });

  redirect(`/dashboard/site/create/preview?draftId=${draft.id}`);
}
