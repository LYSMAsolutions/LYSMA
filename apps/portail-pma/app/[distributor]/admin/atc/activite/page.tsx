import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";

export default async function AdminAtcActivitePage({
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

  const atcs = await prisma.users.findMany({
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
      code: true,
    },
    orderBy: [
      { first_name: "asc" },
      { last_name: "asc" },
    ],
  });

  const bonCounts = await prisma.bons.groupBy({
    by: ["created_by_user_id"],
    _count: {
      created_by_user_id: true,
    },
    where: {
      distributor_id: currentUser.distributorId,
          },
  });

  const bonMap = new Map(
    bonCounts.map((item: any) => [item.created_by_user_id, item._count.created_by_user_id ?? 0])
  );

  const rows = atcs.map((atc) => ({
    id: atc.id,
    name: `${atc.first_name} ${atc.last_name}`.trim(),
    code: atc.code || "—",
    bons: bonMap.get(atc.id) || 0,
  }));

  return (
    <AdminModulePage
      badge="ATC · Activité"
      title="Activité ATC"
      description="Lecture de l’activité ATC à partir des bons créés."
      backHref={`${adminBase}/atc`}
      backLabel="Retour module ATC"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>ATC</th>
                <th>Code</th>
                <th>Bons créés</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.code}</td>
                  <td>{row.bons}</td>
                </tr>
              ))}

              {!rows.length ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", color: "var(--muted)" }}>
                    Aucune activité ATC trouvée.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </AdminModulePage>
  );
}