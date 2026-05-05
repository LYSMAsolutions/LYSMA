import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import StoreEditForm from "@/components/admin/forms/store-edit-form";

export default async function AdminStoreEditPage({
  params,
}: { params: Promise<{ distributor: string; storeId: string }> }) {
  const { distributor, storeId } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const store = await prisma.stores.findFirst({
    where: { id: storeId, distributor_id: currentUser.distributorId },
  });

  if (!store) notFound();

  return (
    <AdminModulePage
      badge="Magasin · Édition"
      title={`Modifier · ${store.code} · ${store.name}`}
      description="Modification des informations du magasin."
      backHref={`${adminBase}/stores/${store.id}`}
      backLabel="Retour fiche magasin"
    >
      <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", padding: "1.75rem", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
        <StoreEditForm store={store} />
      </section>
    </AdminModulePage>
  );
}