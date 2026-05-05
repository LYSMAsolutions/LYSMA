import Link from "next/link";
import { requireAccess } from "@/lib/require-access";
import { getBonListForAtc } from "@/lib/admin/bons";
import BonStatusBadge from "@/components/admin/bons/BonStatusBadge";

export default async function AtcBonsPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;

  const currentUser = await requireAccess({
    allowedRoles: ["atc"],
    distributorSlug: distributor,
  });

  const atcBase = `/${currentUser.distributorSlug}/atc`;

  const bons = await getBonListForAtc({
    distributorId: currentUser.distributorId,
    userId: currentUser.id,
  });

  const total = bons.length;
  const open = bons.filter((item) =>
    [
      "envoye",
      "non_pris_en_charge",
      "pris_en_charge",
      "en_cours",
      "attente_client",
      "attente_fournisseur",
      "a_corriger",
    ].includes(item.status)
  ).length;
  const done = bons.filter((item) => item.status === "traite").length;
  const refused = bons.filter((item) => item.status === "refuse").length;

  return (
    <div className="space-y-8">
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p className="badge-lysma">ATC · Bons</p>
            <h1 className="section-title" style={{ marginTop: ".75rem" }}>
              Mes bons
            </h1>
            <p className="section-copy" style={{ marginTop: ".5rem" }}>
              Suivi des bons que tu as créés et de leur avancement magasin.
            </p>
          </div>

          <Link href={`/${currentUser.distributorSlug}/atc`} className="btn-secondary">
            Retour espace ATC
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="kpi-card kpi-blue">
          <p className="text-sm font-medium text-[#6B7280]">Total</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-[#0F172A]">{total}</p>
          <p className="mt-2 text-sm text-[#6B7280]">bons créés</p>
        </div>

        <div className="kpi-card kpi-yellow">
          <p className="text-sm font-medium text-[#6B7280]">En cours</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-[#0F172A]">{open}</p>
          <p className="mt-2 text-sm text-[#6B7280]">à suivre</p>
        </div>

        <div className="kpi-card kpi-green">
          <p className="text-sm font-medium text-[#6B7280]">Traités</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-[#0F172A]">{done}</p>
          <p className="mt-2 text-sm text-[#6B7280]">finalisés</p>
        </div>

        <div className="kpi-card kpi-red">
          <p className="text-sm font-medium text-[#6B7280]">Refusés</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-[#0F172A]">{refused}</p>
          <p className="mt-2 text-sm text-[#6B7280]">à relire</p>
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
                  <td>{row.storeName}</td>
                  <td>{row.priority || "—"}</td>
                  <td>
                    <BonStatusBadge status={row.status} />
                  </td>
                  <td>{row.createdAt}</td>
                  <td>
                    <Link href={`${atcBase}/bons/${row.id}`} className="btn-secondary">
                      Voir
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
      </section>
    </div>
  );
}