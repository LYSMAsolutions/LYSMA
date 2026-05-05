import Link from "next/link";
import { requireAccess } from "@/lib/require-access";
import {
  getBonListForRdm,
  getStoreScopeForUser,
} from "@/lib/admin/bons";
import BonStatusBadge from "@/components/admin/bons/BonStatusBadge";

export default async function RdmBonsPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;

  const currentUser = await requireAccess({
    allowedRoles: ["rdm"],
    distributorSlug: distributor,
  });

  const rdmBase = `/${currentUser.distributorSlug}/rdm`;

  const stores = await getStoreScopeForUser({
    distributorId: currentUser.distributorId,
    userId: currentUser.id,
  });

  const bons = await getBonListForRdm({
    distributorId: currentUser.distributorId,
    storeIds: stores.map((item) => item.id),
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
            <p className="badge-lysma">RDM · Bons</p>
            <h1 className="section-title" style={{ marginTop: ".75rem" }}>
              Bons du périmètre magasin
            </h1>
            <p className="section-copy" style={{ marginTop: ".5rem" }}>
              Vue de supervision des bons assignés à tes magasins.
            </p>
          </div>

          <Link href={rdmBase} className="btn-secondary">
            Retour espace RDM
          </Link>
        </div>
      </section>

      {!stores.length ? (
        <section className="card-lysma" style={{ padding: "2rem" }}>
          <div className="rounded-2xl border border-dashed border-[#D9E3F0] bg-[#F8FBFF] px-5 py-6 text-sm text-[#6B7280]">
            Aucun magasin n’est lié à cet utilisateur.  
            Ajoute une relation dans <code>user_store_links</code>.
          </div>
        </section>
      ) : (
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
                      <Link href={`${rdmBase}/bons/${row.id}`} className="btn-secondary">
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
      )}
    </div>
  );
}