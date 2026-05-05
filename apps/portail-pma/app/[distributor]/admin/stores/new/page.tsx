import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import CreateStoreForm from "@/components/admin/forms/StoreCreateForm";

export default async function AdminStoreNewPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;

  const currentUser = await requireAccess({
    allowedRoles: ["admin"],
    distributorSlug: distributor,
  });

  const adminBase = `/${currentUser.distributorSlug}/admin`;

  return (
    <AdminModulePage
      badge="Magasins · Création"
      title="Créer un magasin"
      description="Ajout d’un nouveau magasin au réseau du distributeur."
      backHref={`${adminBase}/stores`}
      backLabel="Retour magasins"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <CreateStoreForm distributorId={currentUser.distributorId} />
      </section>
    </AdminModulePage>
  );
}