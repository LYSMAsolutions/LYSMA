import Link from "next/link";
import { requireAccess } from "@/lib/require-access";
import { getBonListForCdv } from "@/lib/admin/bons";
import BonStatusBadge from "@/components/admin/bons/BonStatusBadge";

export default async function CdvBonsPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;

  const currentUser = await requireAccess({
    allowedRoles: ["cdv"],
    distributorSlug: distributor,
  });

  const cdvBase = `/${currentUser.distributorSlug}/cdv`;

  const bons = await getBonListForCdv({
    distributorId: currentUser.distributorId,
  });

  return (
    <div className="space-y-8">
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p className="badge-lysma">CDV · Bons</p>
            <h1 className="section-title" style={{ marginTop: ".75rem" }}>
              Pilotage des bons
            </h1>
            <p className="section-copy" style={{ marginTop: ".5rem" }}>
              Vue lecture seule sur l’ensemble des bons du distributeur.
            </p>
          </div>

          <Link href={cdvBase} className="btn-secondary">
            Retour espace CDV
          </Link>
        </div>
      </section>

      <section className="card-lysma" style={{ padding: "2rem" }}>
        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Type</th>
                <th>Client</th>
                <th>ATC</th>
                <th>Magasin</th>
                <th>Priorité</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bons.map((row) => (
                <tr key={row.id}>
                  <td>{row.bon_number}</td>
                  <td>{row.bon_type}</td>
                  <td>{row.clientName}</td>
                  <td>{row.creatorName}</td>
                  <td>{row.storeName}</td>
                  <td>{row.priority || "—"}</td>
                  <td>
                    <BonStatusBadge status={row.status} />
                  </td>
                  <td>{row.createdAt}</td>
                  <td>
                    <Link href={`${cdvBase}/bons/${row.id}`} className="btn-secondary">
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}

              {!bons.length ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", color: "var(--muted)" }}>
                    Aucun bon trouvé.
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