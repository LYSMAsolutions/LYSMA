import Link from "next/link";
import { requireAccess } from "@/lib/require-access";
import { getBonListForRdm, getStoreScopeForUser } from "@/lib/admin/bons";
import BonStatusBadge from "@/components/admin/bons/BonStatusBadge";
import { RoleHero } from "@/components/role-dashboard/RoleDashboardKit";

export default async function RdmBonsPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["rdm"], distributorSlug: distributor });
  const rdmBase = `/${currentUser.distributorSlug}/rdm`;
  const stores = await getStoreScopeForUser({ distributorId: currentUser.distributorId, userId: currentUser.id });
  const bons = await getBonListForRdm({
    distributorId: currentUser.distributorId,
    storeIds: stores.map((item: any) => item.id),
  });

  return (
    <div className="space-y-8">
      <RoleHero
        eyebrow="RDM - Bons"
        title="Bons du perimetre magasin"
        description="Suivi et traitement des bons assignes aux magasins dont tu es responsable."
        secondary={{ href: rdmBase, label: "Retour RDM" }}
      />

      {!stores.length ? (
        <section className="card-lysma p-8">
          <div className="rounded-2xl border border-dashed border-[#D9E3F0] bg-[#F8FBFF] px-5 py-6 text-sm text-[#6B7280]">
            Aucun magasin n'est lie a cet utilisateur. Ajoute une relation dans user_store_links.
          </div>
        </section>
      ) : (
        <section className="card-lysma p-8">
          <div className="space-y-4">
            {bons.map((row) => (
              <Link key={row.id} href={`${rdmBase}/bons/${row.id}`} className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4 transition hover:border-[#C9D8EB] hover:bg-white md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-[#0F172A]">{row.bon_number}</p>
                  <p className="mt-1 text-sm text-[#6B7280]">{row.clientName}</p>
                </div>
                <div className="grid gap-2 text-sm text-[#6B7280] md:min-w-[430px] md:grid-cols-4 md:text-right">
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
      )}
    </div>
  );
}
