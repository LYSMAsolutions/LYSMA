import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import AdminUsersFilters from "@/components/admin/users/AdminUsersFilters";

export default async function AdminUsersPage({ params }: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const [users, roles, totalMagasiniers] = await Promise.all([
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
  ]);

  const total      = users.filter((u) => u.roles?.code !== "store_staff").length;
  const totalAdmin = users.filter((u) => u.roles?.code === "admin").length;
  const totalCdv   = users.filter((u) => u.roles?.code === "cdv").length;
  const totalRdm   = users.filter((u) => u.roles?.code === "rdm").length;
  const totalAtc   = users.filter((u) => u.roles?.code === "atc").length;

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
      <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", padding: "1.75rem", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
        <AdminUsersFilters
          distributor={currentUser.distributorSlug}
          roles={roles}
          initialUsers={users}
          currentUserId={currentUser.id}
        />
      </section>
    </AdminModulePage>
  );
}