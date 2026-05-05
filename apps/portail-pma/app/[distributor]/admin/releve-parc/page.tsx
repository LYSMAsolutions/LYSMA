import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import ReleveFilters from "@/components/admin/releve-parc/ReleveFilters";

export default async function AdminReleveParc({
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

  const bons = await prisma.bons.findMany({
    where: {
      distributor_id: currentUser.distributorId,
      bon_type:       "contrat_maintenance",
    },
    include: {
      clients: { select: { name: true, code: true } },
      stores:  { select: { name: true, code: true } },
      users:   { select: { first_name: true, last_name: true } },
      releve_parc_items: true,
    },
    orderBy: { created_at: "desc" },
    take: 500,
  });

  // KPIs
  const total    = bons.length;
  const envoyes  = bons.filter((b) => b.status === "envoye").length;
  const traites  = bons.filter((b) => b.status === "traite").length;
  const enCours  = bons.filter((b) => ["pris_en_charge", "en_cours"].includes(b.status)).length;
  const totalMateriel = bons.reduce((s, b) => s + (b.releve_parc_items?.length ?? 0), 0);

  const rows = bons.map((b) => ({
    id:          b.id,
    bon_number:  b.bon_number,
    status:      b.status,
    created_at:  b.created_at.toISOString(),
    clientName:  b.clients?.code ? `${b.clients.code} · ${b.clients.name}` : (b.clients?.name ?? "—"),
    storeName:   b.stores  ? `${b.stores.code} · ${b.stores.name}` : "—",
    atcName:     b.users   ? `${b.users.first_name} ${b.users.last_name}`.trim() : "—",
    nbMateriel:  b.releve_parc_items?.length ?? 0,
  }));

  return (
    <AdminModulePage
      badge="Relevés de parc · Admin"
      title="Relevés de parc"
      description="Supervision des relevés d'équipements clients soumis par les ATC pour contrat de maintenance."
      backHref={adminBase}
      kpis={[
        { title: "Total",      value: total,         note: "relevés",             tone: "neutral" },
        { title: "Envoyés",    value: envoyes,       note: "en attente",          tone: "yellow"  },
        { title: "En cours",   value: enCours,       note: "traitement",          tone: "blue"    },
        { title: "Traités",    value: traites,       note: "finalisés",           tone: "green"   },
        { title: "Équipements",value: totalMateriel, note: "matériels recensés",  tone: "neutral" },
      ]}
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <ReleveFilters
          distributor={currentUser.distributorSlug}
          initialRows={rows}
        />
      </section>
    </AdminModulePage>
  );
}