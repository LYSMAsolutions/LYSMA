import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import BonFilters from "@/components/admin/bons/BonFilters";

function formatDate(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
}

export default async function AdminBonsGestionPage({
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
    },
    include: {
      clients: true,
      stores: true,
      users: true,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 200,
  });

  const totalBons = bons.length;
  const aTraiter = bons.filter((bon) =>
    ["envoye", "non_pris_en_charge", "a_corriger"].includes(bon.status),
  ).length;
  const enCours = bons.filter((bon) =>
    ["pris_en_charge", "en_cours", "attente_fournisseur", "attente_client"].includes(
      bon.status,
    ),
  ).length;
  const traites = bons.filter((bon) => bon.status === "traite").length;

  const rows = bons.map((bon) => ({
    id: bon.id,
    bon_number: bon.bon_number,
    bon_type: bon.bon_type,
    status: bon.status,
    priority: bon.priority,
    clientName: bon.clients?.name || null,
    storeName: bon.stores ? `${bon.stores.code} · ${bon.stores.name}` : null,
    creatorName: bon.users
      ? `${bon.users.first_name} ${bon.users.last_name}`.trim()
      : null,
    createdAt: formatDate(bon.created_at),
  }));

  return (
    <AdminModulePage
      badge="Bons · Gestion"
      title="Gestion des bons"
      description="Lecture filtrable et exploitable des bons."
      backHref={`${adminBase}/bons`}
      backLabel="Retour module bons"
      kpis={[
        {
          title: "Tous les bons",
          value: totalBons,
          note: "bons enregistrés",
          href: `${adminBase}/bons/gestion`,
          tone: "blue",
        },
        {
          title: "À traiter",
          value: aTraiter,
          note: "à prendre en charge",
          href: `${adminBase}/bons/gestion?status=non_pris_en_charge`,
          tone: "yellow",
        },
        {
          title: "En cours",
          value: enCours,
          note: "bons en traitement",
          href: `${adminBase}/bons/gestion?status=pris_en_charge`,
          tone: "neutral",
        },
        {
          title: "Traités",
          value: traites,
          note: "bons finalisés",
          href: `${adminBase}/bons/historique`,
          tone: "green",
        },
      ]}
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <BonFilters
          distributor={currentUser.distributorSlug}
          initialRows={rows}
        />
      </section>
    </AdminModulePage>
  );
}