import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import CampagnesClient from "@/components/admin/catalogues/CampagnesClient";

export default async function AdminCatalogueCampaignsPage({
  params,
}: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${user.distributorSlug}/admin`;
  const now = new Date();

  const [campaigns, catalogues] = await Promise.all([
    prisma.catalogue_campaigns.findMany({
      where: { distributor_id: user.distributorId },
      include: {
        catalogues: { select: { id: true, code: true, name: true } },
        _count: { select: { catalogue_item_campaigns: true } },
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.catalogues.findMany({
      where: { distributor_id: user.distributorId, is_active: true },
      select: { id: true, code: true, name: true, catalogue_type: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const actives  = campaigns.filter((c) => c.is_active && (!c.valid_to || c.valid_to >= now)).length;
  const expires  = campaigns.filter((c) => c.valid_to && c.valid_to < now).length;

  return (
    <AdminModulePage
      badge="Catalogue · Campagnes"
      title="Campagnes catalogue"
      description="Promotions, opérations commerciales, mises en avant et campagnes fournisseur avec dates de validité."
      backHref={`${adminBase}/catalogues`}
      backLabel="Retour catalogue"
      kpis={[
        { title: "Total",    value: campaigns.length, note: "campagnes créées",  tone: "blue"    },
        { title: "Actives",  value: actives,          note: "en cours",          tone: "green"   },
        { title: "Expirées", value: expires,          note: "date dépassée",     tone: "neutral" },
      ]}
    >
      <CampagnesClient
        initialCampaigns={JSON.parse(JSON.stringify(campaigns))}
        catalogues={JSON.parse(JSON.stringify(catalogues))}
      />
    </AdminModulePage>
  );
}