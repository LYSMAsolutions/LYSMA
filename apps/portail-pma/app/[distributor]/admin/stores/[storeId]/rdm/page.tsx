import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import StoreRdmForm from "./store-rdm-form";

export default async function AdminStoreRdmPage({
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

  const [store, rdms, roles, currentLink] = await Promise.all([
    prisma.stores.findFirst({
      where: {
        id: storeId,
        distributor_id: currentUser.distributorId,
      },
    }),
    prisma.users.findMany({
      where: {
        distributor_id: currentUser.distributorId,
        roles: {
          code: "rdm",
        },
      },
      orderBy: [{ first_name: "asc" }, { last_name: "asc" }],
    }),
    prisma.roles.findMany({
      orderBy: {
        label: "asc",
      },
    }),
    prisma.user_store_links.findFirst({
      where: {
        store_id: storeId,
        users: {
          distributor_id: currentUser.distributorId,
          roles: {
            code: "rdm",
          },
        },
      },
      select: {
        user_id: true,
      },
    }),
  ]);

  if (!store) {
    notFound();
  }

  return (
    <AdminModulePage
      badge="Magasin · RDM"
      title={`RDM · ${store.name}`}
      description="Rattachement du responsable magasin."
      backHref={`${adminBase}/stores/${store.id}`}
      backLabel="Retour fiche magasin"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <StoreRdmForm
          storeId={store.id}
          currentRdmId={currentLink?.user_id ?? null}
          rdms={rdms}
          roles={roles}
        />
      </section>
    </AdminModulePage>
  );
}
