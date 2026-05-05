import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";

export default async function AdminAtcClientsPage({
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
    include: {
      _count: {
        select: {
          clients: true,
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
      badge="ATC · Clients"
      title="Clients par ATC"
      description="Lecture des portefeuilles clients attribués aux ATC."
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
                <th>Clients assignés</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {atcs.map((atc) => (
                <tr key={atc.id}>
                  <td>{`${atc.first_name} ${atc.last_name}`.trim()}</td>
                  <td>{atc.code || "—"}</td>
                  <td>{atc._count.clients}</td>
                  <td>
                    <Link
                      href={`/${currentUser.distributorSlug}/admin/atc/${atc.id}`}
                      className="btn-secondary"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}

              {!atcs.length ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "var(--muted)" }}>
                    Aucun ATC trouvé.
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