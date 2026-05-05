import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import CatalogueProductTable from "@/components/admin/catalogues/CatalogueProductTable";

export default async function AdminCatalogueViewMaterielPage({
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
      title="Vue matériel"
      description="Vue filtrée pour le matériel atelier et le matériel SAV."
      backHref={`${adminBase}/catalogues`}
      backLabel="Retour catalogue"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <CatalogueProductTable />
      </section>
    </AdminModulePage>
  );
}