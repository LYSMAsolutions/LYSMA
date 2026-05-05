import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import AttributeFormModal from "@/components/admin/catalogues/AttributeFormModal";

export default async function AdminCatalogueAttributesPage({
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
      badge="Catalogue · Attributs"
      title="Attributs produit"
      description="Attributs dynamiques du moteur catalogue : marque, gamme, dimensions, compatibilités, etc."
      backHref={`${adminBase}/catalogues`}
      backLabel="Retour catalogue"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <AttributeFormModal />
      </section>
    </AdminModulePage>
  );
}