import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAccess } from "@/lib/require-access";
import { getBonById, formatDateTime } from "@/lib/admin/bons";
import BonHeader from "@/components/admin/bons/BonHeader";

export default async function AtcBonDetailPage({
  params,
}: {
  params: Promise<{ distributor: string; id: string }>;
}) {
  const { distributor, id } = await params;

  const currentUser = await requireAccess({
    allowedRoles: ["atc"],
    distributorSlug: distributor,
  });

  const atcBase = `/${currentUser.distributorSlug}/atc`;

  const bon = await getBonById({
    distributorId: currentUser.distributorId,
    bonId: id,
  });

  if (!bon || bon.created_by_user_id !== currentUser.id) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p className="badge-lysma">ATC · Détail bon</p>
            <h1 className="section-title" style={{ marginTop: ".75rem" }}>
              Bon {bon.bon_number}
            </h1>
            <p className="section-copy" style={{ marginTop: ".5rem" }}>
              Suivi détaillé de ton bon.
            </p>
          </div>

          <Link href={`${atcBase}/bons`} className="btn-secondary">
            Retour bons
          </Link>
        </div>
      </section>

      <BonHeader distributor={currentUser.distributorSlug} bon={bon} />

      <section className="card-lysma" style={{ padding: "2rem" }}>
        <h2 className="section-title">Commentaires</h2>
        <p className="section-copy" style={{ marginTop: ".75rem" }}>
          {bon.comment || "—"}
        </p>
      </section>

      <section className="card-lysma" style={{ padding: "2rem" }}>
        <h2 className="section-title">Lignes</h2>

        <div className="table-shell" style={{ marginTop: "1rem" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Ligne</th>
                <th>Référence</th>
                <th>Désignation</th>
                <th>Qté</th>
                <th>Prix unitaire</th>
                <th>Code tarification</th>
                <th>Commentaire</th>
              </tr>
            </thead>

            <tbody>
              {bon.bon_lines.map((line) => (
                <tr key={line.id}>
                  <td>{line.line_number}</td>
                  <td>{line.reference || "—"}</td>
                  <td>{line.designation || "—"}</td>
                  <td>{line.quantity ? line.quantity.toString() : "—"}</td>
                  <td>{line.unit_price ? line.unit_price.toString() : "—"}</td>
                  <td>{line.billing_code || "—"}</td>
                  <td>{line.comment || "—"}</td>
                </tr>
              ))}

              {!bon.bon_lines.length ? (
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

      <section className="card-lysma" style={{ padding: "2rem" }}>
        <h2 className="section-title">Historique</h2>

        <div className="table-shell" style={{ marginTop: "1rem" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Ancien statut</th>
                <th>Nouveau statut</th>
                <th>Auteur</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {bon.bon_status_history.map((item: any) => {
                const actor = item.users
                  ? `${item.users.first_name} ${item.users.last_name}`.trim()
                  : item.store_staff
                    ? `${item.store_staff.first_name} ${item.store_staff.last_name}`.trim()
                    : "—";

                return (
                  <tr key={item.id}>
                    <td>{item.action_key || "—"}</td>
                    <td>{item.old_status || "—"}</td>
                    <td>{item.new_status || "—"}</td>
                    <td>{actor}</td>
                    <td>{formatDateTime(item.created_at)}</td>
                  </tr>
                );
              })}

              {!bon.bon_status_history.length ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "var(--muted)" }}>
                    Aucun historique trouvé.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}