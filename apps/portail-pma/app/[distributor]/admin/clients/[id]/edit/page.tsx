import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import ClientEditForm from "@/components/admin/forms/ClientEditForm";

export default async function AdminClientEditPage({
  params,
}: {
  params: Promise<{ distributor: string; id: string }>;
}) {
  const { distributor, id } = await params;

  const currentUser = await requireAccess({
    allowedRoles: ["admin"],
    distributorSlug: distributor,
  });

  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const [client, stores, atcs] = await Promise.all([
    prisma.clients.findFirst({
      where: {
        id,
        distributor_id: currentUser.distributorId,
      },
    }),
    prisma.stores.findMany({
      where: {
        distributor_id: currentUser.distributorId,
      },
      select: {
        id: true,
        code: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.users.findMany({
      where: {
        distributor_id: currentUser.distributorId,
        roles: {
          code: "atc",
        },
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
      orderBy: [
        { first_name: "asc" },
        { last_name: "asc" },
      ],
    }),
  ]);

  if (!client) {
    notFound();
  }

  return (
    <AdminModulePage
      badge="Client · Édition"
      title="Modifier un client"
      description="Mise à jour des informations client et des rattachements."
      backHref={`${adminBase}/clients/${client.id}`}
      backLabel="Retour fiche client"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <ClientEditForm client={client} stores={stores} atcs={atcs} />
      </section>
    </AdminModulePage>
  );
}