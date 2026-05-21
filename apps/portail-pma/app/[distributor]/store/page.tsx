import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Settings2,
  ShieldCheck,
  Store,
  Users,
  Wrench,
} from "lucide-react";
import { requireAccess } from "@/lib/require-access";
import { getBonKpisForRdm, getBonListForStore, getStoreScopeForUser } from "@/lib/admin/bons";
import BonStatusBadge from "@/components/admin/bons/BonStatusBadge";
import {
  PriorityPanel,
  QuickActions,
  RecentCard,
  RoleHero,
  RoleKpiGrid,
} from "@/components/role-dashboard/RoleDashboardKit";

const SAV_TYPES = ["sav", "intervention", "devis_materiel", "contrat_maintenance"];

export default async function StoreHomePage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["store", "store_staff"], distributorSlug: distributor });
  const storeBase = `/${user.distributorSlug}/store`;

  const stores = await getStoreScopeForUser({
    distributorId: user.distributorId,
    userId: user.id,
  });
  const storeIds = stores.map((store) => store.id);
  const hasSavStore = stores.some((store) => store.store_type === "sav");

  const [kpis, bons] = await Promise.all([
    getBonKpisForRdm({ distributorId: user.distributorId, storeIds }),
    getBonListForStore({ distributorId: user.distributorId, storeIds }),
  ]);

  const savCount = bons.filter((bon) => SAV_TYPES.includes(bon.bon_type)).length;
  const lastFive = bons.slice(0, 5);

  return (
    <div className="space-y-8">
      <RoleHero
        eyebrow="Espace magasin"
        title="File atelier magasin"
        description="Execution des bons assignes au magasin: prise en charge, traitement, attentes, refus et historique visible."
        primary={{ href: `${storeBase}/bons`, label: "Ouvrir les bons" }}
        secondary={hasSavStore ? { href: `${storeBase}/sav`, label: "File SAV" } : { href: `${storeBase}/equipe`, label: "Equipe" }}
      />

      {!stores.length ? (
        <section className="card-lysma p-8">
          <div className="rounded-2xl border border-dashed border-[#D9E3F0] bg-[#F8FBFF] px-5 py-6 text-sm text-[#6B7280]">
            Aucun magasin n'est lie a ce compte. L'admin doit rattacher au moins un magasin pour activer cette file.
          </div>
        </section>
      ) : (
        <>
          <RoleKpiGrid
            items={[
              {
                title: "Bons assignes",
                value: kpis.total,
                subtitle: "a traiter",
                href: `${storeBase}/bons`,
                icon: ClipboardList,
                tone: "info",
              },
              {
                title: "A ouvrir",
                value: kpis.nonPrisEnCharge,
                subtitle: "nouveaux bons",
                href: `${storeBase}/bons`,
                icon: AlertTriangle,
                tone: "warning",
              },
              {
                title: "Pris",
                value: kpis.prisEnCharge,
                subtitle: "a demarrer",
                href: `${storeBase}/bons`,
                icon: ShieldCheck,
                tone: "default",
              },
              {
                title: "En cours",
                value: kpis.enCours,
                subtitle: "traitement actif",
                href: `${storeBase}/bons`,
                icon: Activity,
                tone: "default",
              },
              {
                title: hasSavStore ? "SAV" : "Traites",
                value: hasSavStore ? savCount : kpis.traites,
                subtitle: hasSavStore ? "flux dedie" : "finalises",
                href: hasSavStore ? `${storeBase}/sav` : `${storeBase}/bons`,
                icon: hasSavStore ? Wrench : CheckCircle2,
                tone: hasSavStore ? "success" : "success",
              },
            ]}
          />

          <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <RecentCard title="Derniers bons assignes" href={`${storeBase}/bons`} empty={!lastFive.length}>
              {lastFive.map((bon) => (
                <a
                  key={bon.id}
                  href={`${storeBase}/bons/${bon.id}`}
                  className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4 transition hover:border-[#C9D8EB] hover:bg-white md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-[#0F172A]">{bon.bon_number}</p>
                    <p className="mt-1 text-sm text-[#6B7280]">{bon.clientName}</p>
                  </div>
                  <div className="grid gap-2 text-sm text-[#6B7280] md:min-w-[260px] md:grid-cols-2 md:text-right">
                    <span>{bon.bon_type}</span>
                    <span>{bon.createdAt}</span>
                  </div>
                  <BonStatusBadge status={bon.status} />
                </a>
              ))}
            </RecentCard>

            <div className="space-y-8">
              <PriorityPanel
                title="Priorites atelier"
                subtitle="Les bons a ouvrir ou a relancer"
                icon={AlertTriangle}
                items={[
                  {
                    title: "A prendre",
                    value: kpis.nonPrisEnCharge,
                    hint: "Prendre en charge les nouveaux bons magasin.",
                    href: `${storeBase}/bons`,
                    icon: ClipboardList,
                  },
                  {
                    title: "En attente",
                    value: kpis.enAttente,
                    hint: "Surveiller les dossiers bloques.",
                    href: `${storeBase}/bons`,
                    icon: Activity,
                  },
                ]}
              />

              <QuickActions
                items={[
                  {
                    title: "Tous les bons",
                    description: "Traiter la file complete des bons assignes.",
                    href: `${storeBase}/bons`,
                    icon: ClipboardList,
                  },
                  {
                    title: "Equipe magasin",
                    description: "Voir les profils magasiniers du perimetre.",
                    href: `${storeBase}/equipe`,
                    icon: Users,
                  },
                  {
                    title: "Compte magasin",
                    description: "Consulter les magasins rattaches au compte.",
                    href: `${storeBase}/compte`,
                    icon: Settings2,
                  },
                ]}
              />
            </div>
          </section>

          <section className="card-lysma p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F1FB]">
                <Store className="h-5 w-5 text-[#0A4D9B]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#0F172A]">Magasins rattaches</h3>
                <p className="text-sm text-[#6B7280]">Perimetre utilise pour filtrer les bons.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {stores.map((store) => (
                <div key={store.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-5">
                  <p className="font-semibold text-[#0F172A]">{store.code} - {store.name}</p>
                  <p className="mt-2 text-sm text-[#6B7280]">{store.store_type === "sav" ? "Magasin SAV" : "Magasin standard"}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
