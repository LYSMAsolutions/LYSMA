import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import CatalogueImportForm from "@/components/admin/catalogues/CatalogueImportForm";

export default async function AdminCatalogueImportsPage({
  params,
}: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${user.distributorSlug}/admin`;

  return (
    <AdminModulePage
      badge="Catalogue · Imports"
      title="Import catalogue"
      description="Importez votre catalogue produit via fichier CSV. L'import accepte les délimiteurs , et ; et gère les guillemets."
      backHref={`${adminBase}/catalogues`}
      backLabel="Retour catalogue"
    >
      <CatalogueImportForm distributor={user.distributorSlug} />
    </AdminModulePage>
  );
}