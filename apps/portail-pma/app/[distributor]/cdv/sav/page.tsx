import { Wrench } from "lucide-react";
import { requireAccess } from "@/lib/require-access";
import { getBonListForCdv } from "@/lib/admin/bons";
import BonStatusBadge from "@/components/admin/bons/BonStatusBadge";
import { RoleHero, RoleKpiGrid } from "@/components/role-dashboard/RoleDashboardKit";

const SAV_TYPES = ["sav", "intervention", "devis_materiel", "contrat_maintenance"];

export default async function CdvSavPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["cdv"], distributorSlug: distributor });
  const cdvBase = `/${user.distributorSlug}/cdv`;
  const bons = (await getBonListForCdv({ distributorId: user.distributorId, userId: user.id }))
    .filter((bon) => SAV_TYPES.includes(bon.bon_type));

  const kpis = {
    total: bons.length,
    aPrendre: bons.filter((bon) => ["envoye", "non_pris_en_charge"].includes(bon.status)).length,
    actifs: bons.filter((bon) => ["pris_en_charge", "en_cours", "attente_client", "attente_fournisseur", "a_corriger"].includes(bon.status)).length,
    traites: bons.filter((bon) => bon.status === "traite").length,
    refuses: bons.filter((bon) => bon.status === "refuse").length,
  };

  return (
    <div className="space-y-8">
      <RoleHero
        eyebrow="CDV - SAV"
        title="Bons SAV de mes ATC"
        description="Vue dediee aux flux SAV, interventions, devis materiel et contrats de maintenance lies a ton perimetre."
        secondary={{ href: cdvBase, label: "Retour CDV" }}
      />

      <RoleKpiGrid
        items={[
          { title: "Total SAV", value: kpis.total, subtitle: "bons visibles", href: `${cdvBase}/sav`, icon: Wrench, tone: "info" },
          { title: "A prendre", value: kpis.aPrendre, subtitle: "nouveaux", href: `${cdvBase}/sav`, icon: Wrench, tone: "warning" },
          { title: "Actifs", value: kpis.actifs, subtitle: "en traitement", href: `${cdvBase}/sav`, icon: Wrench, tone: "default" },
          { title: "Traites", value: kpis.traites, subtitle: "finalises", href: `${cdvBase}/sav`, icon: Wrench, tone: "success" },
          { title: "Refuses", value: kpis.refuses, subtitle: "a relire", href: `${cdvBase}/sav`, icon: Wrench, tone: "danger" },
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
              <div className="grid gap-2 text-sm text-[#6B7280] md:min-w-[340px] md:grid-cols-3 md:text-right">
                <span>{bon.bon_type}</span>
                <span>{bon.creatorName}</span>
                <span>{bon.createdAt}</span>
              </div>
              <BonStatusBadge status={bon.status} />
            </a>
          ))}

          {!bons.length ? <p className="text-sm text-[#6B7280]">Aucun bon SAV trouve.</p> : null}
        </div>
      </section>
    </div>
  );
}
