import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import { notFound } from "next/navigation";
import {
  Users,
  Store,
  ArrowRight,
  Layers3,
  FileText,
  Building2,
  BookOpen,
  AlertTriangle,
  Clock3,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Bell,
  Activity,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const distributorLabel = distributor.toUpperCase();
  const user = await requireAccess({
    allowedRoles: ["admin"],
    distributorSlug: distributor,
  });


  const distributorId = user.distributorId;
  const adminBase = `/${user.distributorSlug}/admin`;

  const [
    usersCount,
    activeUsersCount,
    storesCount,
    activeStoresCount,
    storeStaffCount,
    clientsCount,
    activeClientsCount,
    bonsCount,
    bonsPendingCount,
    bonsInProgressCount,
    bonsDoneCount,
    cataloguesCount,
    activeCataloguesCount,
    cdvCount,
    atcCount,
    rdmCount,
    latestUsers,
    latestBons,
    usersByRole,
  ] = await Promise.all([
    prisma.users.count({
      where: { distributor_id: distributorId },
    }),

    prisma.users.count({
      where: { distributor_id: distributorId, is_active: true },
    }),

    prisma.stores.count({
      where: { distributor_id: distributorId },
    }),

    prisma.stores.count({
      where: { distributor_id: distributorId, is_active: true },
    }),

    prisma.store_staff.count({
      where: {
        stores: { distributor_id: distributorId },
        is_active: true,
      },
    }),

    prisma.clients.count({
      where: { distributor_id: distributorId },
    }),

    prisma.clients.count({
      where: { distributor_id: distributorId, is_active: true },
    }),

    prisma.bons.count({
      where: { distributor_id: distributorId },
    }),

    prisma.bons.count({
      where: {
        distributor_id: distributorId,
        status: {
          in: ["envoye", "non_pris_en_charge", "pris_en_charge"],
        },
      },
    }),

    prisma.bons.count({
      where: {
        distributor_id: distributorId,
        status: {
          in: ["en_cours", "attente_fournisseur", "attente_client", "a_corriger"],
        },
      },
    }),

    prisma.bons.count({
      where: {
        distributor_id: distributorId,
        status: {
          in: ["traite", "termine", "clos"],
        },
      },
    }),

    prisma.catalogues.count({
      where: { distributor_id: distributorId },
    }),

    prisma.catalogues.count({
      where: {
        distributor_id: distributorId,
        is_active: true,
      },
    }),

    prisma.users.count({
      where: {
        distributor_id: distributorId,
        roles: {
          code: "cdv",
        },
      },
    }),

    prisma.users.count({
      where: {
        distributor_id: distributorId,
        roles: {
          code: "atc",
        },
      },
    }),

    prisma.users.count({
      where: {
        distributor_id: distributorId,
        roles: { code: "rdm" },
      },
    }),

    prisma.users.findMany({
      where: { distributor_id: distributorId },
      include: {
        roles: {
          select: {
            code: true,
            label: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
      take: 5,
    }),

    prisma.bons.findMany({
      where: { distributor_id: distributorId },
      include: {
        clients: {
          select: {
            name: true,
            code: true,
          },
        },
        users: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
      take: 5,
    }),

    prisma.users.groupBy({
      by: ["role_id"],
      where: {
        distributor_id: distributorId,
      },
      _count: {
        role_id: true,
      },
    }),
  ]);

  const rolesMap = await prisma.roles.findMany({
    select: {
      id: true,
      code: true,
      label: true,
    },
    orderBy: {
      label: "asc",
    },
  });

  const roleLabelById = new Map(
    rolesMap.map((role) => [role.id, { code: role.code, label: role.label }])
  );

  const roleStats = usersByRole
    .map((item: any) => {
      const role = roleLabelById.get(item.role_id);
      return {
        code: role?.code ?? "unknown",
        label: role?.label ?? "Rôle inconnu",
        count: item._count.role_id ?? 0,
      };
    })
    .sort((a, b) => b.count - a.count);

  const activityHealth = {
    bonsPending: bonsPendingCount,
    bonsInProgress: bonsInProgressCount,
    bonsDone: bonsDoneCount,
    usersActiveRate:
      usersCount > 0 ? Math.round((activeUsersCount / usersCount) * 100) : 0,
    storesActiveRate:
      storesCount > 0 ? Math.round((activeStoresCount / storesCount) * 100) : 0,
    clientsActiveRate:
      clientsCount > 0 ? Math.round((activeClientsCount / clientsCount) * 100) : 0,
  };

  const kpis = [
    {
      title: "Bons à traiter",
      value: bonsPendingCount,
      subtitle: `${bonsInProgressCount} en cours`,
      icon: AlertTriangle,
      tone: "warning",
      href: `${adminBase}/bons`,
    },
    {
      title: "Magasins",
      value: storesCount,
      subtitle: `${rdmCount} RDM · ${storeStaffCount} magasiniers`,
      icon: Store,
      tone: "info",
      href: `${adminBase}/stores`,
    },
    {
      title: "Commerciaux",
      value: cdvCount + atcCount,
      subtitle: `${cdvCount} CDV · ${atcCount} ATC`,
      icon: Users,
      tone: "success",
      href: `${adminBase}/users`,
    },
    {
      title: "Clients",
      value: clientsCount,
      subtitle: `${activeClientsCount} actifs`,
      icon: Building2,
      tone: "default",
      href: `${adminBase}/clients`,
    },
    {
      title: "Catalogues",
      value: activeCataloguesCount,
      subtitle: "Disponibles",
      icon: BookOpen,
      tone: "default",
      href: `${adminBase}/catalogues`,
    },
  ] as const;

  const quickActions = [
    {
      title: "Gérer les utilisateurs",
      description: "Créer, activer, désactiver et organiser les profils par rôle.",
      href: `${adminBase}/users`,
      icon: Users,
    },
    {
      title: "Gérer les magasins",
      description: "Configurer les magasins, comptes et structure de fonctionnement.",
      href: `${adminBase}/stores`,
      icon: Store,
    },
    {
      title: "Accéder aux catalogues",
      description:
        "Piloter les catalogues fournisseur, promo, opération commerciale, interne, outillage et matériels.",
      href: `${adminBase}/catalogues`,
      icon: BookOpen,
    },
    {
      title: "Configurer les alertes",
      description: "Définir les règles d’alerte et les comportements de notification.",
      href: `${adminBase}/alerts`,
      icon: Bell,
    },
  ];

  const priorityCards = [
    {
      title: "Bons à traiter",
      value: bonsPendingCount,
      hint: "Demandes envoyées ou prises en charge à surveiller",
      icon: AlertTriangle,
      href: `${adminBase}/bons`,
    },
    {
      title: "Bons en cours",
      value: bonsInProgressCount,
      hint: "Dossiers encore ouverts dans le flux opérationnel",
      icon: Activity,
      href: `${adminBase}/bons`,
    },
    {
      title: "Comptes actifs",
      value: activeUsersCount,
      hint: "Profils actuellement opérationnels",
      icon: ShieldCheck,
      href: `${adminBase}/users`,
    },
  ];

  const toneClasses = {
    warning: {
      wrap: "bg-[linear-gradient(135deg,#FFF7ED,#FFFFFF)] border-[#FED7AA]",
      icon: "bg-[#FFF1E6] text-[#C2410C]",
      badge: "text-[#C2410C]",
    },
    info: {
      wrap: "bg-[linear-gradient(135deg,#EFF6FF,#FFFFFF)] border-[#BFDBFE]",
      icon: "bg-[#E8F1FB] text-[#0A4D9B]",
      badge: "text-[#0A4D9B]",
    },
    success: {
      wrap: "bg-[linear-gradient(135deg,#ECFDF5,#FFFFFF)] border-[#BBF7D0]",
      icon: "bg-[#EAFBF2] text-[#15803D]",
      badge: "text-[#15803D]",
    },
    default: {
      wrap: "bg-[linear-gradient(135deg,#F8FAFC,#FFFFFF)] border-[#E2E8F0]",
      icon: "bg-[#EEF3F9] text-[#334155]",
      badge: "text-[#334155]",
    },
  } as const;

  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-[2rem] p-8 md:p-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-[-40px] h-56 w-56 rounded-full bg-[#1E73D8]/10 blur-3xl" />
          <div className="absolute bottom-[-70px] right-[-30px] h-64 w-64 rounded-full bg-[#0A4D9B]/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0A4D9B] md:text-4xl">
            <span className="block text-sm font-semibold tracking-[0.18em] text-[#6B7280] uppercase">
              Espace admin
            </span>

            <span className="mt-2 block">{distributorLabel}</span>
          </h1>

          <p className="mt-4 text-[15px] leading-8 text-[#6B7280] md:text-base">
            Bienvenue {user.firstName}. 
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
        {kpis.map((item: any) => {
          const Icon = item.icon;
          const tone = toneClasses[item.tone];

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`group rounded-[2rem] border p-6 transition hover:-translate-y-[1px] hover:shadow-[0_18px_40px_rgba(10,77,155,0.10)] ${tone.wrap}`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[#6B7280]">
                  {item.title}
                </p>

                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone.icon}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <p className="mt-4 text-4xl font-semibold tracking-tight text-[#0F172A]">
                {item.value}
              </p>

              <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                {item.subtitle}
              </p>
            </Link>   
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="card-lysma p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F1FB]">
              <Layers3 className="h-5 w-5 text-[#0A4D9B]" />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#0F172A]">
                Santé du portail
              </h3>
              <p className="text-sm text-[#6B7280]">
                Lecture instantanée de l’activité du distributeur
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#6B7280]">Utilisateurs actifs</p>
                <Users className="h-4 w-4 text-[#0A4D9B]" />
              </div>
              <p className="mt-3 text-3xl font-semibold text-[#0F172A]">
                {activityHealth.usersActiveRate}%
              </p>
              <p className="mt-2 text-sm text-[#6B7280]">
                {activeUsersCount} actifs sur {usersCount}
              </p>
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#6B7280]">Magasins actifs</p>
                <Store className="h-4 w-4 text-[#0A4D9B]" />
              </div>
              <p className="mt-3 text-3xl font-semibold text-[#0F172A]">
                {activityHealth.storesActiveRate}%
              </p>
              <p className="mt-2 text-sm text-[#6B7280]">
                {activeStoresCount} actifs sur {storesCount}
              </p>
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#6B7280]">Clients actifs</p>
                <Building2 className="h-4 w-4 text-[#0A4D9B]" />
              </div>
              <p className="mt-3 text-3xl font-semibold text-[#0F172A]">
                {activityHealth.clientsActiveRate}%
              </p>
              <p className="mt-2 text-sm text-[#6B7280]">
                {activeClientsCount} actifs sur {clientsCount}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-[#E2E8F0] bg-[#F8FBFF] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold text-[#0F172A]">
                  Répartition des profils
                </h4>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Vision rapide des rôles présents sur le distributeur
                </p>
              </div>

              <Link
                href={`${adminBase}/users`}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#0A4D9B] transition hover:opacity-80"
              >
                Voir les utilisateurs
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {roleStats.length === 0 ? (
                <p className="text-sm text-[#6B7280]">
                  Aucune donnée de rôle disponible.
                </p>
              ) : (
                roleStats.map((role) => {
                  const percentage =
                    usersCount > 0 ? Math.round((role.count / usersCount) * 100) : 0;

                  return (
                    <div key={role.code}>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <p className="text-sm font-medium text-[#0F172A]">
                          {role.label}
                        </p>
                        <p className="text-sm text-[#6B7280]">
                          {role.count} · {percentage}%
                        </p>
                      </div>

                      <div className="h-2 rounded-full bg-[#E7EEF7]">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-[#0A4D9B] to-[#1E73D8]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card-lysma p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF1E6]">
                <AlertTriangle className="h-5 w-5 text-[#C2410C]" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#0F172A]">
                  Priorités du moment
                </h3>
                <p className="text-sm text-[#6B7280]">
                  Ce qui mérite ton attention en premier
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {priorityCards.map((item: any) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group flex items-start gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-5 transition hover:border-[#C9D8EB] hover:bg-white"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_8px_20px_rgba(10,77,155,0.06)]">
                      <Icon className="h-5 w-5 text-[#0A4D9B]" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium text-[#0F172A]">{item.title}</p>
                        <span className="text-2xl font-semibold text-[#0A4D9B]">
                          {item.value}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                        {item.hint}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="card-lysma p-8">
            <h3 className="text-xl font-semibold text-[#0F172A]">
              Accès rapides
            </h3>

            <div className="mt-6 space-y-4">
              {quickActions.map((item: any) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group flex items-start justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4 transition hover:border-[#C9D8EB] hover:bg-white"
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#E8F1FB]">
                        <Icon className="h-4 w-4 text-[#0A4D9B]" />
                      </div>

                      <div>
                        <p className="font-medium text-[#0F172A]">{item.title}</p>
                        <p className="mt-1 text-sm leading-6 text-[#6B7280]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#0A4D9B] transition group-hover:translate-x-0.5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="card-lysma p-8">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold text-[#0F172A]">
              Derniers utilisateurs créés
            </h3>

            <Link
              href={`${adminBase}/users`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#0A4D9B] transition hover:opacity-80"
            >
              Voir tout
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {latestUsers.length === 0 ? (
              <p className="text-sm text-[#6B7280]">Aucun utilisateur trouvé.</p>
            ) : (
              latestUsers.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4"
                >
                  <div>
                    <p className="font-medium text-[#0F172A]">
                      {item.first_name} {item.last_name}
                    </p>
                    <p className="text-sm text-[#6B7280]">{item.email}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-[#0A4D9B]">
                      {item.roles.label}
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      {new Date(item.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card-lysma p-8">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold text-[#0F172A]">
              Derniers bons créés
            </h3>

            <Link
              href={`${adminBase}/bons`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#0A4D9B] transition hover:opacity-80"
            >
              Voir tout
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {latestBons.length === 0 ? (
              <p className="text-sm text-[#6B7280]">Aucun bon trouvé.</p>
            ) : (
              latestBons.map((item: any) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-[#0F172A]">
                        {item.bon_number}
                      </p>
                      <p className="text-sm text-[#6B7280]">
                        {item.clients.name}
                        {item.clients.code ? ` · ${item.clients.code}` : ""}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium text-[#0A4D9B]">
                        {item.status}
                      </p>
                      <p className="text-xs text-[#94A3B8]">
                        {new Date(item.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-[#6B7280]">
                    Créé par {item.users.first_name} {item.users.last_name}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}