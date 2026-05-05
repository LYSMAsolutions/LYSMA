import { requireAccess } from "@/lib/require-access";
import { getGarantieListForAdmin, getGarantieKpisForAdmin } from "@/lib/admin/garanties";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import GarantieFilters from "@/components/admin/garanties/GarantieFilters";

export default async function AdminGarantiesPage({
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

  const [garanties, kpis] = await Promise.all([
    getGarantieListForAdmin({ distributorId: currentUser.distributorId }),
    getGarantieKpisForAdmin(currentUser.distributorId),
  ]);

  // Sérialiser les dates pour le Client Component
  const rows = garanties.map((g) => ({
    ...g,
    created_at: g.created_at.toISOString(),
  }));

  return (
    <AdminModulePage
      badge="Garanties · Admin"
      title="Garanties pièces"
      description="Suivi et traitement des demandes de garantie soumises par les ATC."
      backHref={adminBase}
      kpis={[
        { title: "Total",       value: kpis.total,                  note: "toutes garanties",  tone: "neutral" },
        { title: "En cours",    value: kpis.en_cours,               note: "à traiter",         tone: "blue"    },
        { title: "Fournisseur", value: kpis.en_attente_fournisseur, note: "attente décision",  tone: "yellow"  },
        { title: "Validées",    value: kpis.validee,                note: "acceptées",         tone: "green"   },
        { title: "Refusées",    value: kpis.refusee,                note: "rejetées",          tone: "red"     },
      ]}
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <GarantieFilters
          distributor={currentUser.distributorSlug}
          initialGaranties={rows}
        />
      </section>
    </AdminModulePage>
  );
}