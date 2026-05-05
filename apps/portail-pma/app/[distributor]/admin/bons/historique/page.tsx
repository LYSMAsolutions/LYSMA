import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import BonListTable from "@/components/admin/bons/BonListTable";

function formatDate(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
}

export default async function AdminBonsHistoriquePage({
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

  const bons = await prisma.bons.findMany({
    where: {
      distributor_id: currentUser.distributorId,
    },
    include: {
      clients: true,
      stores: true,
      users: true,
    },
    orderBy: {
      updated_at: "desc",
    },
    take: 200,
  });

  const rows = bons.map((bon) => ({
    id: bon.id,
    bon_number: bon.bon_number,
    bon_type: bon.bon_type,
    status: bon.status,
    priority: bon.priority,
    clientName: bon.clients?.name || null,
    storeName: bon.stores ? `${bon.stores.code} · ${bon.stores.name}` : null,
    creatorName: bon.users
      ? `${bon.users.first_name} ${bon.users.last_name}`.trim()
      : null,
    createdAt: formatDate(bon.updated_at),
  }));

  return (
    <AdminModulePage
      badge="Bons · Historique"
      title="Historique global"
      description="Lecture chronologique de l’évolution des bons."
      backHref={`${adminBase}/bons`}
      backLabel="Retour module bons"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <BonListTable distributor={currentUser.distributorSlug} rows={rows} />
      </section>
    </AdminModulePage>
  );
}