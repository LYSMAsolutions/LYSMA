import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import UserRoleBadge from "@/components/admin/users/UserRoleBadge";
import CreateAtcPopup from "@/components/admin/popups/CreateAtcPopup";

export default async function AdminAtcEquipePage({
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

  const [atcs, roles] = await Promise.all([
    prisma.users.findMany({
      where: {
        distributor_id: currentUser.distributorId,
        roles: {
          code: "atc",
        },
      },
      include: {
        roles: true,
        _count: {
          select: {
            clients: true,
            bons: true,
            user_store_links: true,
          },
        },
      },
      orderBy: [
        { first_name: "asc" },
        { last_name: "asc" },
      ],
    }),
    prisma.roles.findMany({
      orderBy: {
        label: "asc",
      },
    }),
  ]);

  return (
    <AdminModulePage
      badge="ATC · Équipe"
      title="Équipe ATC"
      description="Liste détaillée des ATC du distributeur."
      backHref={`${adminBase}/atc`}
      backLabel="Retour module ATC"
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
            <h2 className="section-title">ATC</h2>
            <p className="section-copy" style={{ marginTop: ".5rem" }}>
              Liste des attachés technico-commerciaux avec leurs volumes principaux.
            </p>
          </div>

          <CreateAtcPopup open={false} onClose={() => {}} roles={roles} />
        </div>

        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Code</th>
                <th>Rôle</th>
                <th>Clients</th>
                <th>Bons</th>
                <th>Magasins liés</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {atcs.map((item) => (
                <tr key={item.id}>
                  <td>{`${item.first_name} ${item.last_name}`.trim()}</td>
                  <td>{item.email}</td>
                  <td>{item.code || "—"}</td>
                  <td>
                    <UserRoleBadge
                      roleCode={item.roles?.code}
                      roleLabel={item.roles?.label}
                    />
                  </td>
                  <td>{item._count.clients}</td>
                  <td>{item._count.bons}</td>
                  <td>{item._count.user_store_links}</td>
                  <td>
                    <span className={item.is_active ? "status-success" : "status-danger"}>
                      {item.is_active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/${currentUser.distributorSlug}/admin/atc/${item.id}`}
                      className="btn-secondary"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}

              {!atcs.length ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", color: "var(--muted)" }}>
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