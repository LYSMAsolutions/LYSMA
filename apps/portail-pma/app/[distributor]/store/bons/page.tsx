import Link from "next/link";
import { Activity, AlertTriangle, CheckCircle2, ClipboardList, ShieldCheck } from "lucide-react";
import { requireAccess } from "@/lib/require-access";
import { getBonListForStore, getStoreScopeForUser } from "@/lib/admin/bons";
import BonStatusBadge from "@/components/admin/bons/BonStatusBadge";
import { RoleHero, RoleKpiGrid } from "@/components/role-dashboard/RoleDashboardKit";

export default async function StoreBonsPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["store", "store_staff"], distributorSlug: distributor });
  const storeBase = `/${currentUser.distributorSlug}/store`;
  const stores = await getStoreScopeForUser({ distributorId: currentUser.distributorId, userId: currentUser.id });
  const storeIds = stores.map((item: any) => item.id);
  const bons = await getBonListForStore({ distributorId: currentUser.distributorId, storeIds });

  const nonPrisEnCharge = bons.filter((item) => ["envoye", "non_pris_en_charge"].includes(item.status)).length;
  const prisEnCharge = bons.filter((item) => item.status === "pris_en_charge").length;
  const enCours = bons.filter((item) => item.status === "en_cours").length;
  const enAttente = bons.filter((item) => ["attente_client", "attente_fournisseur", "a_corriger"].includes(item.status)).length;
  const traites = bons.filter((item) => item.status === "traite").length;

  return (
    <div className="space-y-8">
      <RoleHero
        eyebrow="Store - Bons"
        title="File magasin"
        description="Bons assignes a ton ou tes magasins, avec traitement direct depuis le detail."
        secondary={{ href: storeBase, label: "Retour magasin" }}
      />

      <RoleKpiGrid
        items={[
          { title: "A ouvrir", value: nonPrisEnCharge, subtitle: "nouveaux bons", href: `${storeBase}/bons`, icon: AlertTriangle, tone: "warning" },
          { title: "Pris", value: prisEnCharge, subtitle: "en responsabilite", href: `${storeBase}/bons`, icon: ShieldCheck, tone: "default" },
          { title: "En cours", value: enCours, subtitle: "traitement actif", href: `${storeBase}/bons`, icon: Activity, tone: "info" },
          { title: "En attente", value: enAttente, subtitle: "bloques", href: `${storeBase}/bons`, icon: ClipboardList, tone: "warning" },
          { title: "Traites", value: traites, subtitle: "finalises", href: `${storeBase}/bons`, icon: CheckCircle2, tone: "success" },
        ]}
      />

      <section className="card-lysma p-8">
        {!stores.length ? (
          <div className="rounded-2xl border border-dashed border-[#D9E3F0] bg-[#F8FBFF] px-5 py-6 text-sm text-[#6B7280]">
            Aucun magasin n'est lie a cet utilisateur.
          </div>
        ) : (
          <div className="space-y-4">
            {bons.map((row) => (
              <Link key={row.id} href={`${storeBase}/bons/${row.id}`} className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4 transition hover:border-[#C9D8EB] hover:bg-white md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-[#0F172A]">{row.bon_number}</p>
                  <p className="mt-1 text-sm text-[#6B7280]">{row.clientName}</p>
                </div>
                <div className="grid gap-2 text-sm text-[#6B7280] md:min-w-[320px] md:grid-cols-3 md:text-right">
                  <span>{row.bon_type}</span>
                  <span>{row.creatorName}</span>
                  <span>{row.createdAt}</span>
                </div>
                <BonStatusBadge status={row.status} />
              </Link>
            ))}

            {!bons.length ? <p className="text-sm text-[#6B7280]">Aucun bon trouve.</p> : null}
          </div>
        )}
      </section>
    </div>
  );
}
