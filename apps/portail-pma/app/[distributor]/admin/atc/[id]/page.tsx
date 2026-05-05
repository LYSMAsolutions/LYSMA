import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import UserRoleBadge from "@/components/admin/users/UserRoleBadge";

function formatDate(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
}

export default async function AdminAtcDetailPage({
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

  const atc = await prisma.users.findFirst({
    where: {
      id,
      distributor_id: currentUser.distributorId,
      roles: {
        code: "atc",
      },
    },
    include: {
      roles: true,
      user_store_links: {
        include: {
          stores: true,
        },
      },
      _count: {
        select: {
          clients: true,
          bons: true,
        },
      },
    },
  });

  if (!atc) {
    notFound();
  }

  const [clients, bons] = await Promise.all([
    prisma.clients.findMany({
      where: {
        distributor_id: currentUser.distributorId,
        assigned_user_id: atc.id,
      },
      orderBy: {
        name: "asc",
      },
      take: 100,
    }),
    prisma.bons.findMany({
      where: {
        distributor_id: currentUser.distributorId,
        created_by_user_id: atc.id,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 100,
    }),
  ]);

  return (
    <AdminModulePage
      badge="ATC · Détail"
      title={`${atc.first_name} ${atc.last_name}`.trim()}
      description="Fiche détaillée de l’ATC, de son portefeuille client et de ses bons."
      backHref={`${adminBase}/atc`}
      backLabel="Retour module ATC"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <div
          style={{
            display: "grid",
            gap: ".5rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
            <div>
              <h2 className="section-title" style={{ fontSize: "1.25rem" }}>
                {`${atc.first_name} ${atc.last_name}`.trim()}
              </h2>
              <p className="section-copy" style={{ marginTop: ".35rem" }}>
                {atc.email}
              </p>
            </div>

            <UserRoleBadge
              roleCode={atc.roles?.code}
              roleLabel={atc.roles?.label}
            />
          </div>

          <div className="section-copy">Téléphone : {atc.phone || "—"}</div>
          <div className="section-copy">Code : {atc.code || "—"}</div>
          <div className="section-copy">
            Statut :{" "}
            <span className={atc.is_active ? "status-success" : "status-danger"}>
              {atc.is_active ? "Actif" : "Inactif"}
            </span>
          </div>
          <div className="section-copy">Clients : {atc._count.clients}</div>
          <div className="section-copy">Bons : {atc._count.bons}</div>
          <div className="section-copy">
            Magasins liés :{" "}
            {atc.user_store_links.length
              ? atc.user_store_links
                  .map((link) => `${link.stores.code} · ${link.stores.name}`)
                  .join(" / ")
              : "—"}
          </div>

          <div style={{ display: "flex", gap: ".75rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <Link
              href={`/${currentUser.distributorSlug}/admin/users/${atc.id}`}
              className="btn-secondary"
            >
              Voir le compte utilisateur
            </Link>
            <Link
              href={`/${currentUser.distributorSlug}/admin/users/${atc.id}/edit`}
              className="btn-secondary"
            >
              Modifier le compte
            </Link>
          </div>
        </div>
      </section>

      <section className="card-lysma" style={{ padding: "2rem" }}>
        <h2 className="section-title">Clients assignés</h2>

        <div className="table-shell" style={{ marginTop: "1rem" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Nom</th>
                <th>Ville</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.code || "—"}</td>
                  <td>{client.name}</td>
                  <td>{client.city || "—"}</td>
                  <td>
                    <Link
                      href={`/${currentUser.distributorSlug}/admin/clients/${client.id}`}
                      className="btn-secondary"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}

              {!clients.length ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "var(--muted)" }}>
                    Aucun client assigné.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card-lysma" style={{ padding: "2rem" }}>
        <h2 className="section-title">Derniers bons créés</h2>

        <div className="table-shell" style={{ marginTop: "1rem" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bons.map((bon) => (
                <tr key={bon.id}>
                  <td>{bon.bon_number}</td>
                  <td>{bon.bon_type}</td>
                  <td>{bon.status}</td>
                  <td>{formatDate(bon.created_at)}</td>
                </tr>
              ))}

              {!bons.length ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "var(--muted)" }}>
                    Aucun bon trouvé.
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