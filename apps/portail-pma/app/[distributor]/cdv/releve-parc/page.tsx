import { BarChart2 } from "lucide-react";
import { requireAccess } from "@/lib/require-access";
import { getBonListForCdv } from "@/lib/admin/bons";
import BonStatusBadge from "@/components/admin/bons/BonStatusBadge";
import { RoleHero, RoleKpiGrid } from "@/components/role-dashboard/RoleDashboardKit";

export default async function CdvReleveParcPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["cdv"], distributorSlug: distributor });
  const cdvBase = `/${user.distributorSlug}/cdv`;
  const bons = (await getBonListForCdv({ distributorId: user.distributorId, userId: user.id }))
    .filter((bon) => bon.bon_type === "releve_parc");

  return (
    <div className="space-y-8">
      <RoleHero
        eyebrow="CDV - Releves de parc"
        title="Releves de parc de mes ATC"
        description="Lecture des releves crees dans ton perimetre commercial."
        secondary={{ href: cdvBase, label: "Retour CDV" }}
      />

      <RoleKpiGrid
        items={[
          { title: "Releves", value: bons.length, subtitle: "bons visibles", href: `${cdvBase}/releve-parc`, icon: BarChart2, tone: "info" },
          { title: "A traiter", value: bons.filter((bon) => ["envoye", "non_pris_en_charge"].includes(bon.status)).length, subtitle: "nouveaux", href: `${cdvBase}/releve-parc`, icon: BarChart2, tone: "warning" },
          { title: "En cours", value: bons.filter((bon) => bon.status === "en_cours").length, subtitle: "actifs", href: `${cdvBase}/releve-parc`, icon: BarChart2, tone: "default" },
          { title: "Traites", value: bons.filter((bon) => bon.status === "traite").length, subtitle: "finalises", href: `${cdvBase}/releve-parc`, icon: BarChart2, tone: "success" },
          { title: "Refuses", value: bons.filter((bon) => bon.status === "refuse").length, subtitle: "a relire", href: `${cdvBase}/releve-parc`, icon: BarChart2, tone: "danger" },
        ]}
      />

      <section className="card-lysma p-8">
        <div className="space-y-4">
          {bons.map((bon) => (
            <a key={bon.id} href={`${cdvBase}/bons/${bon.id}`} className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4 transition hover:border-[#C9D8EB] hover:bg-white md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-[#0F172A]">{bon.bon_number}</p>
                <p className="mt-1 text-sm text-[#6B7280]">{bon.clientName}</p>
              </div>
              <div className="grid gap-2 text-sm text-[#6B7280] md:min-w-[300px] md:grid-cols-2 md:text-right">
                <span>{bon.creatorName}</span>
                <span>{bon.createdAt}</span>
              </div>
              <BonStatusBadge status={bon.status} />
            </a>
          ))}

          {!bons.length ? <p className="text-sm text-[#6B7280]">Aucun releve de parc trouve.</p> : null}
        </div>
      </section>
    </div>
  );
}
