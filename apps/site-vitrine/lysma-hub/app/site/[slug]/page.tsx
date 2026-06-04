import { notFound } from "next/navigation";
import { SiteRenderer } from "../../../components/site-renderer/SiteRenderer";
import { getDemoSiteBySlug } from "../../../data/demo-sites";
import { resolveSitePage } from "../../../lib/site-routing";

export default async function ClientSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = getDemoSiteBySlug(slug);

  if (!site) {
    notFound();
  }

  if (!resolveSitePage(site)) {
    notFound();
  }

  return <SiteRenderer site={site} />;
}
