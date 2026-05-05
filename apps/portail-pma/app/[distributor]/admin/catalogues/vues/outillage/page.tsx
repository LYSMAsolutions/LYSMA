import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import CatalogueProductTable from "@/components/admin/catalogues/CatalogueProductTable";

export default async function AdminCatalogueViewOutillagePage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const user = await requireAccess({
    allowedRoles: ["admin"],
    distributorSlug: distributor,
  });
  const adminBase = `/${user.distributorSlug}/admin`;

  return (
    <AdminModulePage
      badge="Catalogue · Vue"
      title="Vue outillage"
      description="Vue filtrée pour l’outillage et les équipements spécifiques."
      backHref={`${adminBase}/catalogues`}
      backLabel="Retour catalogue"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <CatalogueProductTable />
      </section>
    </AdminModulePage>
  );
}