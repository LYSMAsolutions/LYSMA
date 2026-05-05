import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAccess } from "@/lib/require-access";
import {
  formatDateTime,
  getAvailableBonActions,
  getBonById,
} from "@/lib/admin/bons";
import { updateStoreBonStatusAction } from "@/app/[distributor]/store/bons/actions";
import { BonActionPanel } from "@/app/[distributor]/admin/bons/[id]/bon-action-panel";
import BonHeader from "@/components/admin/bons/BonHeader";
import { prisma } from "@/lib/prisma";

export default async function StoreBonDetailPage({
  params,
}: {
  params: Promise<{ distributor: string; id: string }>;
}) {
  const { distributor, id } = await params;

  const currentUser = await requireAccess({
    allowedRoles: ["store", "store_staff"],
    distributorSlug: distributor,
  });

  const storeBase = `/${currentUser.distributorSlug}/store`;

  const bon = await getBonById({
    distributorId: currentUser.distributorId,
    bonId: id,
  });

  if (!bon) {
    notFound();
  }

    const storeLinks = await prisma.user_store_links.findMany({
    where: {
        user_id: currentUser.id,
    },
    select: {
        store_id: true,
    },
    });

  const allowedStoreIds = new Set(storeLinks.map((item) => item.store_id));

  if (!bon.assigned_store_id || !allowedStoreIds.has(bon.assigned_store_id)) {
    notFound();
  }

  const actions = getAvailableBonActions(bon.status);
  const actionHandler = updateStoreBonStatusAction.bind(
    null,
    currentUser.distributorSlug
  );

  return (
    <div className="space-y-8">
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p className="badge-lysma">Store · Détail bon</p>
            <h1 className="section-title" style={{ marginTop: ".75rem" }}>
              Bon {bon.bon_number}
            </h1>
            <p className="section-copy" style={{ marginTop: ".5rem" }}>
              Lecture détaillée et actions de traitement magasin.
            </p>
          </div>

          <Link href={`${storeBase}/bons`} className="btn-secondary">
            Retour file magasin
          </Link>
        </div>
      </section>

      <BonHeader distributor={currentUser.distributorSlug} bon={bon} />

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-8">
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
                      <td>{line.quantity !== null && line.quantity !== undefined ? String(line.quantity) : "—"}</td>
                      <td>{line.unit_price !== null && line.unit_price !== undefined ? String(line.unit_price) : "—"}</td>
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
                  {bon.bon_status_history.map((item) => {
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

        <div className="space-y-8">
          <section className="card-lysma" style={{ padding: "2rem" }}>
            <h2 className="section-title">Actions</h2>
            <p className="section-copy" style={{ marginTop: ".75rem", marginBottom: "1rem" }}>
              Fais avancer le bon selon son état actuel.
            </p>

            <BonActionPanel
              distributor={currentUser.distributorSlug}
              bonId={bon.id}
              actions={actions}
              actionHandler={actionHandler}
            />
          </section>
        </div>
      </section>
    </div>
  );
}
