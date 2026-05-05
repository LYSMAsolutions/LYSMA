import Link from "next/link";
import { requireAccess } from "@/lib/require-access";
import {
  getBonKpisForCdv,
  getBonListForCdv,
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

export default async function CdvHomePage({
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

  const [kpis, bons] = await Promise.all([
    getBonKpisForCdv({
      distributorId: currentUser.distributorId,
    }),
    getBonListForCdv({
      distributorId: currentUser.distributorId,
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
            <p className="badge-lysma">CDV · Accueil</p>
            <h1 className="section-title" style={{ marginTop: ".75rem" }}>
              Bonjour {currentUser.firstName || "CDV"}
            </h1>
            <p className="section-copy" style={{ marginTop: ".5rem" }}>
              Vue de pilotage des bons et de l’activité distributeur.
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
            <Link href={`${cdvBase}/bons`} className="btn-primary">
              Ouvrir le pilotage bons
            </Link>
            <Link href={`/${currentUser.distributorSlug}`} className="btn-secondary">
              Retour distributeur
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          href={`${cdvBase}/bons`}
          title="Total"
          value={kpis.total}
          helper="bons du distributeur"
        />
        <StatCard
          href={`${cdvBase}/bons`}
          title="Non pris en charge"
          value={kpis.nonPrisEnCharge}
          helper="à surveiller"
        />
        <StatCard
          href={`${cdvBase}/bons`}
          title="En cours"
          value={kpis.enCours}
          helper="activité en traitement"
        />
        <StatCard
          href={`${cdvBase}/bons`}
          title="Traités"
          value={kpis.traites}
          helper="finalisés"
        />
        <StatCard
          href={`${cdvBase}/bons`}
          title="Refusés"
          value={kpis.refuses}
          helper="à relire"
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
              <h2 className="section-title">Derniers bons</h2>
              <p className="section-copy" style={{ marginTop: ".5rem" }}>
                Dernières demandes remontées sur le distributeur.
              </p>
            </div>

            <Link href={`${cdvBase}/bons`} className="btn-secondary">
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
                      <Link href={`${cdvBase}/bons/${row.id}`} className="btn-secondary">
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
            Lecture et pilotage sans modifier les flux métier.
          </p>

          <div className="mt-6 grid gap-4">
            <Link
              href={`${cdvBase}/bons`}
              className="rounded-[22px] border border-[#D9E3F0] bg-white px-5 py-4 text-sm font-medium text-[#0F172A] transition hover:bg-[#F8FBFF]"
            >
              Consulter tous les bons
            </Link>

            <Link
              href={`${cdvBase}/bons`}
              className="rounded-[22px] border border-[#D9E3F0] bg-white px-5 py-4 text-sm font-medium text-[#0F172A] transition hover:bg-[#F8FBFF]"
            >
              Suivre les statuts distributeur
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
    </div>
  );
}