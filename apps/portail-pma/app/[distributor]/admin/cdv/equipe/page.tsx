import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import UserRoleBadge from "@/components/admin/users/UserRoleBadge";
import CreateCdvPopup from "@/components/admin/popups/CreateCdvPopup";

export default async function AdminCdvEquipePage({
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

  const [cdvs, roles] = await Promise.all([
    prisma.users.findMany({
      where: {
        distributor_id: currentUser.distributorId,
        roles: {
          code: "cdv",
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
      badge="CDV · Équipe"
      title="Équipe CDV"
      description="Liste détaillée des chefs des ventes du distributeur."
      backHref={`${adminBase}/cdv`}
      backLabel="Retour module CDV"
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
            <h2 className="section-title">CDV</h2>
            <p className="section-copy" style={{ marginTop: ".5rem" }}>
              Liste des chefs des ventes avec leurs volumes principaux.
            </p>
          </div>

          <CreateCdvPopup open={false} onClose={() => {}} roles={roles} />
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
              {cdvs.map((item) => (
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
                      href={`/${currentUser.distributorSlug}/admin/cdv/${item.id}`}
                      className="btn-secondary"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}

              {!cdvs.length ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", color: "var(--muted)" }}>
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