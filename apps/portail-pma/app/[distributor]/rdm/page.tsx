import Link from "next/link";
import { requireAccess } from "@/lib/require-access";
import {
  getBonKpisForRdm,
  getBonListForRdm,
  getStoreScopeForUser,
} from "@/lib/admin/bons";
import BonStatusBadge from "@/components/admin/bons/BonStatusBadge";

function StatCard({
  href,
  title,
  value,
  helper,
}: {
  href: string;
  title: string;
  value: number;
  helper: string;
}) {
  return (
    <Link
      href={href}
      className="kpi-card transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(15,23,42,0.10)]"
    >
      <p className="text-sm font-medium text-[#6B7280]">{title}</p>
      <p className="mt-4 text-4xl font-semibold tracking-tight text-[#0F172A]">
        {value}
      </p>
      <p className="mt-2 text-sm text-[#6B7280]">{helper}</p>
    </Link>
  );
}

export default async function RdmHomePage({
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

  const storeIds = stores.map((item) => item.id);

  const [kpis, bons] = await Promise.all([
    getBonKpisForRdm({
      distributorId: currentUser.distributorId,
      storeIds,
    }),
    getBonListForRdm({
      distributorId: currentUser.distributorId,
      storeIds,
    }),
  ]);

  const lastFive = bons.slice(0, 5);

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
            <p className="badge-lysma">RDM · Accueil</p>
            <h1 className="section-title" style={{ marginTop: ".75rem" }}>
              Bonjour {currentUser.firstName || "RDM"}
            </h1>
            <p className="section-copy" style={{ marginTop: ".5rem" }}>
              Vue de supervision des bons sur ton périmètre magasin.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: ".75rem",
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            <Link href={`${rdmBase}/bons`} className="btn-primary">
              Ouvrir les bons magasin
            </Link>
            <Link href={`/${currentUser.distributorSlug}`} className="btn-secondary">
              Retour distributeur
            </Link>
          </div>
        </div>
      </section>

      {!stores.length ? (
        <section className="card-lysma" style={{ padding: "2rem" }}>
          <div className="rounded-2xl border border-dashed border-[#D9E3F0] bg-[#F8FBFF] px-5 py-6 text-sm text-[#6B7280]">
            Aucun magasin n’est lié à cet utilisateur.  
            Ajoute une relation dans <code>user_store_links</code> pour activer le périmètre RDM.
          </div>
        </section>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-6">
            <StatCard
              href={`${rdmBase}/bons`}
              title="Total"
              value={kpis.total}
              helper="bons du périmètre"
            />
            <StatCard
              href={`${rdmBase}/bons`}
              title="Non pris en charge"
              value={kpis.nonPrisEnCharge}
              helper="à surveiller"
            />
            <StatCard
              href={`${rdmBase}/bons`}
              title="Pris en charge"
              value={kpis.prisEnCharge}
              helper="attribués"
            />
            <StatCard
              href={`${rdmBase}/bons`}
              title="En cours"
              value={kpis.enCours}
              helper="traitement actif"
            />
            <StatCard
              href={`${rdmBase}/bons`}
              title="En attente"
              value={kpis.enAttente}
              helper="bloqués"
            />
            <StatCard
              href={`${rdmBase}/bons`}
              title="Traités"
              value={kpis.traites}
              helper="finalisés"
            />
          </section>

          <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.15fr_.85fr]">
            <section className="card-lysma" style={{ padding: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <div>
                  <h2 className="section-title">Derniers bons du périmètre</h2>
                  <p className="section-copy" style={{ marginTop: ".5rem" }}>
                    Lecture rapide des dernières demandes assignées à tes magasins.
                  </p>
                </div>

                <Link href={`${rdmBase}/bons`} className="btn-secondary">
                  Voir tout
                </Link>
              </div>

              <div className="table-shell" style={{ marginTop: "1.25rem" }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Numéro</th>
                      <th>Client</th>
                      <th>ATC</th>
                      <th>Magasin</th>
                      <th>Statut</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {lastFive.map((row) => (
                      <tr key={row.id}>
                        <td>{row.bon_number}</td>
                        <td>{row.clientName}</td>
                        <td>{row.creatorName}</td>
                        <td>{row.storeName}</td>
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

                    {!lastFive.length ? (
                      <tr>
                        <td
                          colSpan={7}
                          style={{ textAlign: "center", color: "var(--muted)" }}
                        >
                          Aucun bon trouvé.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="card-lysma" style={{ padding: "2rem" }}>
              <h2 className="section-title">Accès rapides</h2>
              <p className="section-copy" style={{ marginTop: ".5rem" }}>
                Supervision du périmètre magasin sans casser l’exécution store.
              </p>

              <div className="mt-6 grid gap-4">
                <Link
                  href={`${rdmBase}/bons`}
                  className="rounded-[22px] border border-[#D9E3F0] bg-white px-5 py-4 text-sm font-medium text-[#0F172A] transition hover:bg-[#F8FBFF]"
                >
                  Consulter tous les bons du périmètre
                </Link>

                <Link
                  href={`/${currentUser.distributorSlug}/store`}
                  className="rounded-[22px] border border-[#D9E3F0] bg-white px-5 py-4 text-sm font-medium text-[#0F172A] transition hover:bg-[#F8FBFF]"
                >
                  Aller vers la vue magasin
                </Link>

                <Link
                  href={`/${currentUser.distributorSlug}`}
                  className="rounded-[22px] border border-[#D9E3F0] bg-white px-5 py-4 text-sm font-medium text-[#0F172A] transition hover:bg-[#F8FBFF]"
                >
                  Revenir à l’espace distributeur
                </Link>
              </div>
            </section>
          </section>
        </>
      )}
    </div>
  );
}