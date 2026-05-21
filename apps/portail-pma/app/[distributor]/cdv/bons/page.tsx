import Link from "next/link";
import { requireAccess } from "@/lib/require-access";
import { getBonListForCdv } from "@/lib/admin/bons";
import BonStatusBadge from "@/components/admin/bons/BonStatusBadge";
import { RoleHero } from "@/components/role-dashboard/RoleDashboardKit";

export default async function CdvBonsPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["cdv"], distributorSlug: distributor });
  const cdvBase = `/${currentUser.distributorSlug}/cdv`;
  const bons = await getBonListForCdv({ distributorId: currentUser.distributorId, userId: currentUser.id });

  return (
    <div className="space-y-8">
      <RoleHero
        eyebrow="CDV - Bons"
        title="Pilotage des bons"
        description="Tous les bons crees par tes ATC, par toi, ou rattaches aux magasins de ton perimetre."
        primary={{ href: `${cdvBase}/bons/new`, label: "Nouveau bon" }}
        secondary={{ href: cdvBase, label: "Retour CDV" }}
      />

      <section className="card-lysma p-8">
        <div className="space-y-4">
          {bons.map((row) => (
            <Link key={row.id} href={`${cdvBase}/bons/${row.id}`} className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4 transition hover:border-[#C9D8EB] hover:bg-white md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-[#0F172A]">{row.bon_number}</p>
                <p className="mt-1 text-sm text-[#6B7280]">{row.clientName}</p>
              </div>
              <div className="grid gap-2 text-sm text-[#6B7280] md:min-w-[480px] md:grid-cols-4 md:text-right">
                <span>{row.bon_type}</span>
                <span>{row.creatorName}</span>
                <span>{row.storeName}</span>
                <span>{row.createdAt}</span>
              </div>
              <BonStatusBadge status={row.status} />
            </Link>
          ))}

          {!bons.length ? <p className="text-sm text-[#6B7280]">Aucun bon trouve.</p> : null}
        </div>
      </section>
    </div>
  );
}
