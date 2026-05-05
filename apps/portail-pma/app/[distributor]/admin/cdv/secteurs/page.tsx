import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";

export default async function AdminCdvSecteursPage({
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
    include: {
      user_store_links: {
        include: {
          stores: true,
        },
      },
    },
    orderBy: [
      { first_name: "asc" },
      { last_name: "asc" },
    ],
  });

  return (
    <AdminModulePage
      badge="CDV · Secteurs"
      title="Secteurs CDV"
      description="Lecture des magasins liés aux chefs des ventes."
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
                <th>Magasins liés</th>
                <th>Volume magasins</th>
              </tr>
            </thead>
            <tbody>
              {cdvs.map((cdv) => (
                <tr key={cdv.id}>
                  <td>{`${cdv.first_name} ${cdv.last_name}`.trim()}</td>
                  <td>{cdv.code || "—"}</td>
                  <td>
                    {cdv.user_store_links.length
                      ? cdv.user_store_links
                          .map((link) => `${link.stores.code} · ${link.stores.name}`)
                          .join(" / ")
                      : "—"}
                  </td>
                  <td>{cdv.user_store_links.length}</td>
                </tr>
              ))}

              {!cdvs.length ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "var(--muted)" }}>
                    Aucun CDV trouvé.
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