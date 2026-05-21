import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";

export default async function AdminCdvActivitePage({
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

  const cdvs = await prisma.users.findMany({
    where: {
      distributor_id: currentUser.distributorId,
      roles: {
        code: "cdv",
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

  const rows = cdvs.map((cdv) => ({
    id: cdv.id,
    name: `${cdv.first_name} ${cdv.last_name}`.trim(),
    code: cdv.code || "—",
    bons: bonMap.get(cdv.id) || 0,
  }));

  return (
    <AdminModulePage
      badge="CDV · Activité"
      title="Activité CDV"
      description="Lecture de l’activité CDV à partir des bons créés."
      backHref={`${adminBase}/cdv`}
      backLabel="Retour module CDV"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>CDV</th>
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
                    Aucune activité CDV trouvée.
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