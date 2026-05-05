import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import StoreAccountForm from "./store-account-form";

export default async function AdminStoreAccountPage({
  params,
}: {
  params: Promise<{ distributor: string; storeId: string }>;
}) {
  const { distributor, storeId } = await params;

  const currentUser = await requireAccess({
    allowedRoles: ["admin"],
    distributorSlug: distributor,
  });

  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const store = await prisma.stores.findFirst({
    where: {
      id: storeId,
      distributor_id: currentUser.distributorId,
    },
    include: {
      store_accounts: true,
    },
  });

  if (!store) {
    notFound();
  }

  return (
    <AdminModulePage
      badge="Magasin · Compte"
      title={`Compte magasin · ${store.name}`}
      description="Gestion du compte principal de connexion du magasin."
      backHref={`${adminBase}/stores/${store.id}`}
      backLabel="Retour fiche magasin"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <StoreAccountForm
          storeId={store.id}
          account={store.store_accounts}
        />
      </section>
    </AdminModulePage>
  );
}