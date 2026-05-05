import Link from "next/link";
import { requireAccess } from "@/lib/require-access";
import { getBonListForStore, getStoreScopeForUser } from "@/lib/admin/bons";
import BonStatusBadge from "@/components/admin/bons/BonStatusBadge";

export default async function StoreBonsPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;

  const currentUser = await requireAccess({
    allowedRoles: ["store", "store_staff"],
    distributorSlug: distributor,
  });

  const storeBase = `/${currentUser.distributorSlug}/store`;

  const stores = await getStoreScopeForUser({
    distributorId: currentUser.distributorId,
    userId: currentUser.id,
  });

  const storeIds = stores.map((item) => item.id);

  const bons = await getBonListForStore({
    distributorId: currentUser.distributorId,
    storeIds,
  });

  const nonPrisEnCharge = bons.filter((item) =>
    ["envoye", "non_pris_en_charge"].includes(item.status)
  ).length;
  const prisEnCharge = bons.filter((item) => item.status === "pris_en_charge").length;
  const enCours = bons.filter((item) => item.status === "en_cours").length;
  const enAttente = bons.filter((item) =>
    ["attente_client", "attente_fournisseur", "a_corriger"].includes(item.status)
  ).length;
  const traites = bons.filter((item) => item.status === "traite").length;

  return (
    <div className="space-y-8">
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p className="badge-lysma">Store · Bons</p>
            <h1 className="section-title" style={{ marginTop: ".75rem" }}>
              File magasin
            </h1>
            <p className="section-copy" style={{ marginTop: ".5rem" }}>
              Bons assignés à ton ou tes magasins.
            </p>
          </div>

          <Link href={storeBase} className="btn-secondary">
            Retour espace magasin
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
        <div className="kpi-card kpi-yellow">
          <p className="text-sm font-medium text-[#6B7280]">Non pris en charge</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-[#0F172A]">{nonPrisEnCharge}</p>
          <p className="mt-2 text-sm text-[#6B7280]">à ouvrir</p>
        </div>

        <div className="kpi-card kpi-neutral">
          <p className="text-sm font-medium text-[#6B7280]">Pris en charge</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-[#0F172A]">{prisEnCharge}</p>
          <p className="mt-2 text-sm text-[#6B7280]">attribués</p>
        </div>

        <div className="kpi-card kpi-blue">
          <p className="text-sm font-medium text-[#6B7280]">En cours</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-[#0F172A]">{enCours}</p>
          <p className="mt-2 text-sm text-[#6B7280]">traitement actif</p>
        </div>

        <div className="kpi-card kpi-yellow">
          <p className="text-sm font-medium text-[#6B7280]">En attente</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-[#0F172A]">{enAttente}</p>
          <p className="mt-2 text-sm text-[#6B7280]">bloqués</p>
        </div>

        <div className="kpi-card kpi-green">
          <p className="text-sm font-medium text-[#6B7280]">Traités</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-[#0F172A]">{traites}</p>
          <p className="mt-2 text-sm text-[#6B7280]">finalisés</p>
        </div>
      </section>

      <section className="card-lysma" style={{ padding: "2rem" }}>
        {!stores.length ? (
          <div className="rounded-2xl border border-dashed border-[#D9E3F0] bg-[#F8FBFF] px-5 py-6 text-sm text-[#6B7280]">
            Aucun magasin n’est lié à cet utilisateur. Lie au moins un magasin dans `user_store_links`.
          </div>
        ) : (
          <div className="table-shell">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Numéro</th>
                  <th>Type</th>
                  <th>Client</th>
                  <th>Créé par</th>
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
                    <td>{row.priority || "—"}</td>
                    <td>
                      <BonStatusBadge status={row.status} />
                    </td>
                    <td>{row.createdAt}</td>
                    <td>
                      <Link href={`${storeBase}/bons/${row.id}`} className="btn-secondary">
                        Ouvrir
                      </Link>
                    </td>
                  </tr>
                ))}

                {!bons.length ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", color: "var(--muted)" }}>
                      Aucun bon trouvé.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}