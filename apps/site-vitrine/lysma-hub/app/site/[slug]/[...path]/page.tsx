import { notFound } from "next/navigation";
import { SiteRenderer } from "../../../../components/site-renderer/SiteRenderer";
import { getDemoSiteBySlug } from "../../../../data/demo-sites";
import { resolveSitePage } from "../../../../lib/site-routing";

export default async function ClientSiteSubPage({
  params,
}: {
  params: Promise<{ slug: string; path: string[] }>;
}) {
  const { slug, path } = await params;
  const pagePath = path.join("/");
  const site = getDemoSiteBySlug(slug);

  if (!site || !resolveSitePage(site, pagePath)) {
    notFound();
  }

  return <SiteRenderer site={site} pagePath={pagePath} />;
}
