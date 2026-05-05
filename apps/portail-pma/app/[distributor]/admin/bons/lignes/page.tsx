import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";

export default async function AdminBonsLignesPage({
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

  const lines = await prisma.bon_lines.findMany({
    where: {
      bons: {
        distributor_id: currentUser.distributorId,
      },
    },
    include: {
      bons: true,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 300,
  });

  return (
    <AdminModulePage
      badge="Bons · Lignes"
      title="Analyse par ligne"
      description="Lecture des lignes issues des bons."
      backHref={`${adminBase}/bons`}
      backLabel="Retour module bons"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bon</th>
                <th>Ligne</th>
                <th>Référence</th>
                <th>Désignation</th>
                <th>Quantité</th>
                <th>Code tarification</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.id}>
                  <td>{line.bons.bon_number}</td>
                  <td>{line.line_number}</td>
                  <td>{line.reference || "—"}</td>
                  <td>{line.designation || "—"}</td>
                  <td>{line.quantity ? line.quantity.toString() : "—"}</td>
                  <td>{line.billing_code || "—"}</td>
                  <td>
                    <Link
                      href={`/${currentUser.distributorSlug}/admin/bons/${line.bon_id}/lignes`}
                      className="btn-secondary"
                    >
                      Voir le bon
                    </Link>
                  </td>
                </tr>
              ))}

              {!lines.length ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "var(--muted)" }}>
                    Aucune ligne trouvée.
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