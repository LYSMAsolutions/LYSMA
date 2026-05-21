import Link from "next/link";
import { Shield } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import { buildCdvGarantieWhere, getCdvScope } from "@/lib/admin/access-scope";
import { RoleHero, RoleKpiGrid } from "@/components/role-dashboard/RoleDashboardKit";

const statusLabels: Record<string, string> = {
  brouillon: "Brouillon",
  en_cours: "En cours",
  en_attente_fournisseur: "Attente fournisseur",
  validee: "Validee",
  refusee: "Refusee",
};

export default async function CdvGarantiesPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["cdv"], distributorSlug: distributor });
  const cdvBase = `/${user.distributorSlug}/cdv`;
  const scope = await getCdvScope({ distributorId: user.distributorId, userId: user.id });

  const garanties = await prisma.garanties.findMany({
    where: buildCdvGarantieWhere({
      distributorId: user.distributorId,
      actorUserIds: scope.actorUserIds,
      storeIds: scope.storeIds,
    }),
    include: {
      clients: { select: { code: true, name: true } },
      stores: { select: { code: true, name: true } },
      users: { select: { first_name: true, last_name: true } },
    },
    orderBy: { created_at: "desc" },
    take: 500,
  });

  const kpis = {
    total: garanties.length,
    enCours: garanties.filter((item) => item.status === "en_cours").length,
    attente: garanties.filter((item) => item.status === "en_attente_fournisseur").length,
    validees: garanties.filter((item) => item.status === "validee").length,
    refusees: garanties.filter((item) => item.status === "refusee").length,
  };

  return (
    <div className="space-y-8">
      <RoleHero
        eyebrow="CDV - Garanties"
        title="Garanties de mes ATC"
        description="Toutes les demandes de garantie creees par tes ATC ou rattachees a tes magasins."
        secondary={{ href: cdvBase, label: "Retour CDV" }}
      />

      <RoleKpiGrid
        items={[
          { title: "Total", value: kpis.total, subtitle: "garanties visibles", href: `${cdvBase}/garanties`, icon: Shield, tone: "info" },
          { title: "En cours", value: kpis.enCours, subtitle: "a suivre", href: `${cdvBase}/garanties`, icon: Shield, tone: "default" },
          { title: "Attente", value: kpis.attente, subtitle: "fournisseur", href: `${cdvBase}/garanties`, icon: Shield, tone: "warning" },
          { title: "Validees", value: kpis.validees, subtitle: "acceptees", href: `${cdvBase}/garanties`, icon: Shield, tone: "success" },
          { title: "Refusees", value: kpis.refusees, subtitle: "a relire", href: `${cdvBase}/garanties`, icon: Shield, tone: "danger" },
        ]}
      />

      <section className="card-lysma p-8">
        <div className="space-y-4">
          {garanties.map((item: any) => (
            <div key={item.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-[#0F172A]">
                    {item.numero_garantie || "Brouillon"} - {item.marque_piece || "-"} {item.reference_piece || ""}
                  </p>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    {item.clients?.code ? `${item.clients.code} - ` : ""}{item.clients?.name || "-"}
                  </p>
                </div>
                <div className="grid gap-2 text-sm text-[#6B7280] md:min-w-[360px] md:grid-cols-3 md:text-right">
                  <span>{item.users ? `${item.users.first_name} ${item.users.last_name}` : "-"}</span>
                  <span>{item.stores ? `${item.stores.code} - ${item.stores.name}` : "-"}</span>
                  <span>{statusLabels[item.status] ?? item.status}</span>
                </div>
              </div>
            </div>
          ))}

          {!garanties.length ? (
            <p className="text-sm text-[#6B7280]">Aucune garantie trouvee dans ton perimetre.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
