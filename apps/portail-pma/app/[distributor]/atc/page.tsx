import { requireAccess } from "@/lib/require-access";
import { prisma } from "@/lib/prisma";
import AtcDashboard from "@/components/atc/dashboard/AtcDashboard";

export default async function AtcHomePage({ params }: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["atc"], distributorSlug: distributor });

  const [activeTools, bonsStats, garantiesStats] = await Promise.all([
    prisma.distributor_tools.findMany({
      where: { distributor_id: user.distributorId, is_enabled: true },
      include: { tools: { select: { code: true } } },
    }),
    prisma.bons.groupBy({
      by: ["status", "bon_type"],
      where: { distributor_id: user.distributorId, created_by_user_id: user.id },
      _count: { id: true },
    }),
    prisma.garanties.groupBy({
      by: ["status"],
      where: { distributor_id: user.distributorId, assigned_user_id: user.id },
      _count: { id: true },
    }),
  ]);

  const activeCodes = activeTools.map((t) => t.tools.code);

  const SAV_TYPES = ["intervention", "devis_materiel", "sav", "contrat_maintenance"];

  const kpis = {
    bons_brouillon: bonsStats
      .filter((b) => b.status === "brouillon" && !SAV_TYPES.includes(b.bon_type ?? ""))
      .reduce((s, b) => s + b._count.id, 0),
    bons_envoyes: bonsStats
      .filter((b) => b.status === "envoye" && !SAV_TYPES.includes(b.bon_type ?? ""))
      .reduce((s, b) => s + b._count.id, 0),
    retours: bonsStats
      .filter((b) => b.bon_type === "retour")
      .reduce((s, b) => s + b._count.id, 0),
    sav_en_cours: bonsStats
      .filter((b) => SAV_TYPES.includes(b.bon_type ?? "") && b.status !== "traite")
      .reduce((s, b) => s + b._count.id, 0),
    garanties_cours: garantiesStats
      .filter((g) => g.status === "en_cours" || g.status === "en_attente_fournisseur")
      .reduce((s, g) => s + g._count.id, 0),
  };

  return (
    <AtcDashboard
      distributorSlug={user.distributorSlug}
      firstName={user.firstName ?? user.email.split("@")[0]}
      activeCodes={activeCodes}
      kpis={kpis}
    />
  );
}