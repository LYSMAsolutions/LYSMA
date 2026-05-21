import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Store,
  UserCheck,
  Users,
} from "lucide-react";
import { requireAccess } from "@/lib/require-access";
import {
  getBonKpisForRdm,
  getBonListForRdm,
  getStoreScopeForUser,
} from "@/lib/admin/bons";
import BonStatusBadge from "@/components/admin/bons/BonStatusBadge";
import {
  PriorityPanel,
  QuickActions,
  RecentCard,
  RoleHero,
  RoleKpiGrid,
} from "@/components/role-dashboard/RoleDashboardKit";

export default async function RdmHomePage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;

  const currentUser = await requireAccess({
    allowedRoles: ["rdm"],
    distributorSlug: distributor,
  });

  const rdmBase = `/${currentUser.distributorSlug}/rdm`;

  const stores = await getStoreScopeForUser({
    distributorId: currentUser.distributorId,
    userId: currentUser.id,
  });

  const storeIds = stores.map((item) => item.id);

  const [kpis, bons] = await Promise.all([
    getBonKpisForRdm({
      distributorId: currentUser.distributorId,
      storeIds,
    }),
    getBonListForRdm({
      distributorId: currentUser.distributorId,
      storeIds,
    }),
  ]);

  const lastFive = bons.slice(0, 5);

  return (
    <div className="space-y-8">
      <RoleHero
        eyebrow="Espace responsable magasin"
        title={`Bonjour ${currentUser.firstName || "RDM"}`}
        description="Supervision atelier et magasin: bons a traiter, clients rattaches aux magasins et equipe magasinier."
        primary={{ href: `${rdmBase}/bons`, label: "Traiter les bons" }}
        secondary={{ href: `${rdmBase}/equipe`, label: "Equipe magasin" }}
      />

      {!stores.length ? (
        <section className="card-lysma p-8">
          <div className="rounded-2xl border border-dashed border-[#D9E3F0] bg-[#F8FBFF] px-5 py-6 text-sm text-[#6B7280]">
            Aucun magasin n'est lie a ce RDM. L'admin doit rattacher au moins un magasin pour activer son perimetre.
          </div>
        </section>
      ) : (
        <>
          <RoleKpiGrid
            items={[
              {
                title: "Bons magasin",
                value: kpis.total,
                subtitle: "dans ton perimetre",
                href: `${rdmBase}/bons`,
                icon: ClipboardList,
                tone: "info",
              },
              {
                title: "A prendre",
                value: kpis.nonPrisEnCharge,
                subtitle: "nouveaux dossiers",
                href: `${rdmBase}/bons`,
                icon: AlertTriangle,
                tone: "warning",
              },
              {
                title: "Pris",
                value: kpis.prisEnCharge,
                subtitle: "en responsabilite",
                href: `${rdmBase}/bons`,
                icon: Store,
                tone: "default",
              },
              {
                title: "En cours",
                value: kpis.enCours,
                subtitle: "traitement actif",
                href: `${rdmBase}/bons`,
                icon: Activity,
                tone: "default",
              },
              {
                title: "Traites",
                value: kpis.traites,
                subtitle: "finalises",
                href: `${rdmBase}/bons`,
                icon: CheckCircle2,
                tone: "success",
              },
            ]}
          />

          <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <RecentCard title="Derniers bons magasin" href={`${rdmBase}/bons`} empty={!lastFive.length}>
              {lastFive.map((row) => (
                <a
                  key={row.id}
                  href={`${rdmBase}/bons/${row.id}`}
                  className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4 transition hover:border-[#C9D8EB] hover:bg-white md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-[#0F172A]">{row.bon_number}</p>
                    <p className="mt-1 text-sm text-[#6B7280]">{row.clientName}</p>
                  </div>
                  <div className="grid gap-2 text-sm text-[#6B7280] md:min-w-[300px] md:grid-cols-2 md:text-right">
                    <span>{row.storeName}</span>
                    <span>{row.createdAt}</span>
                  </div>
                  <BonStatusBadge status={row.status} />
                </a>
              ))}
            </RecentCard>

            <div className="space-y-8">
              <PriorityPanel
                title="Priorites magasin"
                subtitle="File a piloter avant saturation"
                icon={AlertTriangle}
                items={[
                  {
                    title: "Non pris en charge",
                    value: kpis.nonPrisEnCharge,
                    hint: "A ouvrir pour eviter les retards de traitement.",
                    href: `${rdmBase}/bons`,
                    icon: ClipboardList,
                  },
                  {
                    title: "En attente",
                    value: kpis.enAttente,
                    hint: "Attente client, fournisseur ou correction.",
                    href: `${rdmBase}/bons`,
                    icon: Activity,
                  },
                ]}
              />

              <QuickActions
                items={[
                  {
                    title: "Clients magasin",
                    description: "Consulter les clients lies aux magasins de ton perimetre.",
                    href: `${rdmBase}/clients`,
                    icon: UserCheck,
                  },
                  {
                    title: "Equipe magasinier",
                    description: "Voir les magasiniers rattaches aux magasins.",
                    href: `${rdmBase}/equipe`,
                    icon: Users,
                  },
                  {
                    title: "Traitement magasin",
                    description: "Ouvrir la file des bons de ton perimetre.",
                    href: `${rdmBase}/bons`,
                    icon: Store,
                  },
                ]}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
