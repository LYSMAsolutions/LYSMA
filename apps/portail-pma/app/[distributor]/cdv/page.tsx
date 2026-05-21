import {
  AlertTriangle,
  Activity,
  CheckCircle2,
  ClipboardList,
  Store,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { requireAccess } from "@/lib/require-access";
import { getBonKpisForCdv, getBonListForCdv } from "@/lib/admin/bons";
import BonStatusBadge from "@/components/admin/bons/BonStatusBadge";
import {
  PriorityPanel,
  QuickActions,
  RecentCard,
  RoleHero,
  RoleKpiGrid,
} from "@/components/role-dashboard/RoleDashboardKit";

export default async function CdvHomePage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;

  const currentUser = await requireAccess({
    allowedRoles: ["cdv"],
    distributorSlug: distributor,
  });

  const cdvBase = `/${currentUser.distributorSlug}/cdv`;

  const [kpis, bons] = await Promise.all([
    getBonKpisForCdv({
      distributorId: currentUser.distributorId,
      userId: currentUser.id,
    }),
    getBonListForCdv({
      distributorId: currentUser.distributorId,
      userId: currentUser.id,
    }),
  ]);

  const lastFive = bons.slice(0, 5);

  return (
    <div className="space-y-8">
      <RoleHero
        eyebrow="Espace chef des ventes"
        title={`Bonjour ${currentUser.firstName || "CDV"}`}
        description="Pilotage commercial propre: les bons de tes ATC, les clients de ton perimetre et les magasins qui te sont rattaches."
        primary={{ href: `${cdvBase}/bons`, label: "Piloter les bons" }}
        secondary={{ href: `${cdvBase}/equipe`, label: "Voir mon equipe" }}
      />

      <RoleKpiGrid
        items={[
          {
            title: "Bons suivis",
            value: kpis.total,
            subtitle: "dans ton perimetre",
            href: `${cdvBase}/bons`,
            icon: ClipboardList,
            tone: "info",
          },
          {
            title: "A surveiller",
            value: kpis.nonPrisEnCharge,
            subtitle: "envoyes ou non pris",
            href: `${cdvBase}/bons`,
            icon: AlertTriangle,
            tone: "warning",
          },
          {
            title: "En cours",
            value: kpis.enCours,
            subtitle: "activite terrain",
            href: `${cdvBase}/bons`,
            icon: Activity,
            tone: "default",
          },
          {
            title: "Traites",
            value: kpis.traites,
            subtitle: "finalises",
            href: `${cdvBase}/bons`,
            icon: CheckCircle2,
            tone: "success",
          },
          {
            title: "Refuses",
            value: kpis.refuses,
            subtitle: "a relire",
            href: `${cdvBase}/bons`,
            icon: XCircle,
            tone: "danger",
          },
        ]}
      />

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <RecentCard title="Derniers bons du perimetre" href={`${cdvBase}/bons`} empty={!lastFive.length}>
          {lastFive.map((row) => (
            <a
              key={row.id}
              href={`${cdvBase}/bons/${row.id}`}
              className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4 transition hover:border-[#C9D8EB] hover:bg-white md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold text-[#0F172A]">{row.bon_number}</p>
                <p className="mt-1 text-sm text-[#6B7280]">{row.clientName}</p>
              </div>
              <div className="grid gap-2 text-sm text-[#6B7280] md:min-w-[320px] md:grid-cols-3 md:text-right">
                <span>{row.creatorName}</span>
                <span>{row.storeName}</span>
                <span>{row.createdAt}</span>
              </div>
              <BonStatusBadge status={row.status} />
            </a>
          ))}
        </RecentCard>

        <div className="space-y-8">
          <PriorityPanel
            title="Priorites commerciales"
            subtitle="Ce qui merite ton attention en premier"
            icon={AlertTriangle}
            items={[
              {
                title: "Bons a reprendre",
                value: kpis.nonPrisEnCharge,
                hint: "Suivre les demandes envoyees avant prise en charge magasin.",
                href: `${cdvBase}/bons`,
                icon: ClipboardList,
              },
              {
                title: "Bons actifs",
                value: kpis.enCours,
                hint: "Verifier que les dossiers ne restent pas bloques.",
                href: `${cdvBase}/bons`,
                icon: Activity,
              },
            ]}
          />

          <QuickActions
            items={[
              {
                title: "Equipe ATC",
                description: "Voir les ATC rattaches, leurs clients et leurs bons.",
                href: `${cdvBase}/equipe`,
                icon: Users,
              },
              {
                title: "Portefeuille clients",
                description: "Consulter les clients de tes ATC et magasins rattaches.",
                href: `${cdvBase}/clients`,
                icon: UserCheck,
              },
              {
                title: "Magasins rattaches",
                description: "Garder une lecture claire du perimetre magasin.",
                href: `${cdvBase}/equipe`,
                icon: Store,
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
