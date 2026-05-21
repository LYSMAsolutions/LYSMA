import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import AdminUsersFilters from "@/components/admin/users/AdminUsersFilters";
import { BriefcaseBusiness, ShieldCheck, Store, Users, Wrench } from "lucide-react";

export default async function AdminUsersPage({ params }: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const [users, roles, totalMagasiniers, cdvs, stores] = await Promise.all([
    prisma.users.findMany({
      where: { distributor_id: currentUser.distributorId },
      include: { roles: true, _count: { select: { clients: true, bons: true } } },
      orderBy: { created_at: "desc" },
    }),
    prisma.roles.findMany({
      where: { code: { notIn: ["store_staff", "store"] } },
      orderBy: { label: "asc" },
    }),
    prisma.store_staff.count({
      where: { stores: { distributor_id: currentUser.distributorId } },
    }),
    prisma.users.findMany({
      where: {
        distributor_id: currentUser.distributorId,
        is_active: true,
        roles: { code: "cdv" },
      },
      select: { id: true, first_name: true, last_name: true, email: true },
      orderBy: [{ last_name: "asc" }, { first_name: "asc" }],
    }),
    prisma.stores.findMany({
      where: { distributor_id: currentUser.distributorId, is_active: true },
      select: { id: true, code: true, name: true },
      orderBy: [{ code: "asc" }],
    }),
  ]);

  const total      = users.filter((u) => u.roles?.code !== "store_staff").length;
  const totalAdmin = users.filter((u) => u.roles?.code === "admin").length;
  const totalCdv   = users.filter((u) => u.roles?.code === "cdv").length;
  const totalRdm   = users.filter((u) => u.roles?.code === "rdm").length;
  const totalAtc   = users.filter((u) => u.roles?.code === "atc").length;

  const roleCards = [
    {
      code: "admin",
      title: "Admin",
      value: totalAdmin,
      text: "Parametrage, droits, catalogues et pilotage global du distributeur.",
      href: `${adminBase}/users?role=admin`,
      icon: ShieldCheck,
      tone: "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]",
    },
    {
      code: "cdv",
      title: "Chefs des ventes",
      value: totalCdv,
      text: "Supervision des ATC, portefeuilles clients, magasins rattaches et bons.",
      href: `${adminBase}/users?role=cdv`,
      icon: BriefcaseBusiness,
      tone: "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]",
    },
    {
      code: "atc",
      title: "ATC",
      value: totalAtc,
      text: "Terrain commercial garage/carrosserie, creation des bons et suivi client.",
      href: `${adminBase}/users?role=atc`,
      icon: Users,
      tone: "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]",
    },
    {
      code: "rdm",
      title: "RDM",
      value: totalRdm,
      text: "Responsables magasin, traitement des bons et gestion des magasiniers.",
      href: `${adminBase}/users?role=rdm`,
      icon: Store,
      tone: "bg-[#EFF6FF] text-[#0A4D9B] border-[#BFDBFE]",
    },
    {
      code: "magasiniers",
      title: "Magasiniers",
      value: totalMagasiniers,
      text: "Acces atelier par PIN, prise en charge et avancement des bons.",
      href: `${adminBase}/users/magasiniers`,
      icon: Wrench,
      tone: "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]",
    },
  ];

  return (
    <AdminModulePage
      badge="Utilisateurs · Admin"
      title="Gestion des utilisateurs"
      description="Comptes utilisateurs du distributeur : admin, CDV, RDM et ATC."
      backHref={adminBase}
      kpis={[
        { title: "Admins",       value: totalAdmin,       href: `${adminBase}/users?role=admin`,       note: "administrateurs",      tone: "red"     },
        { title: "CDV",          value: totalCdv,         href: `${adminBase}/users?role=cdv`,         note: "chefs des ventes",     tone: "yellow"  },
        { title: "ATC",          value: totalAtc,         href: `${adminBase}/users?role=atc`,         note: "technico-commerciaux", tone: "green"   },
        { title: "RDM",          value: totalRdm,         href: `${adminBase}/users?role=rdm`,         note: "responsables magasin", tone: "neutral" },
        { title: "Magasiniers",  value: totalMagasiniers, href: `${adminBase}/users/magasiniers`,      note: "accès par PIN",        tone: "blue"    },
        { title: "Total",        value: total,            href: `${adminBase}/users`,                  note: "comptes",              tone: "neutral" },
      ]}
    >
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {roleCards.map((item: any) => {
          const Icon = item.icon;
          return (
            <a
              key={item.code}
              href={item.href}
              className="group rounded-[1.5rem] border border-[#D9E3F0] bg-white/80 p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-[#BFD0E5] hover:shadow-[0_18px_40px_rgba(10,77,155,0.10)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${item.tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-3xl font-semibold tracking-tight text-[#0F172A]">{item.value}</span>
              </div>
              <h2 className="mt-4 text-sm font-semibold text-[#0F172A]">{item.title}</h2>
              <p className="mt-2 text-xs leading-5 text-[#6B7280]">{item.text}</p>
            </a>
          );
        })}
      </section>

      <section className="rounded-[1.75rem] border border-[#D9E3F0] bg-white/80 p-5 shadow-[0_10px_32px_rgba(15,23,42,0.06)] md:p-6">
        <AdminUsersFilters
          distributor={currentUser.distributorSlug}
          roles={roles}
          cdvs={cdvs}
          stores={stores}
          initialUsers={users}
          currentUserId={currentUser.id}
        />
      </section>
    </AdminModulePage>
  );
}
