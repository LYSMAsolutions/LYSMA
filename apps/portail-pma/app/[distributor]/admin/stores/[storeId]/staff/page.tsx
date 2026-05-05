import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import StoreStaffTable from "@/components/admin/forms/StoreStaffTable";

export default async function AdminStoreStaffPage({
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
      store_staff: {
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });

  if (!store) {
    notFound();
  }

  return (
    <AdminModulePage
      badge="Magasin · Équipe"
      title={`Équipe · ${store.name}`}
      description="Gestion des magasiniers rattachés au magasin."
      backHref={`${adminBase}/stores/${store.id}`}
      backLabel="Retour fiche magasin"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h2 className="section-title">Magasiniers</h2>
            <p className="section-copy" style={{ marginTop: ".5rem" }}>
              Liste des magasiniers du magasin.
            </p>
          </div>

          <Link
            href={`/${currentUser.distributorSlug}/admin/stores/${store.id}/staff/new`}
            className="btn-primary"
          >
            Ajouter un magasinier
          </Link>
        </div>

        <StoreStaffTable
          distributor={currentUser.distributorSlug}
          storeId={store.id}
          rows={store.store_staff}
        />
      </section>
    </AdminModulePage>
  );
}