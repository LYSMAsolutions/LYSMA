import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import UserEditForm from "@/components/admin/forms/UserEditForm";

export default async function AdminUserEditPage({
  params,
}: { params: Promise<{ distributor: string; id: string }> }) {
  const { distributor, id } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const [user, roles, cdvs, atcs, stores, supervisedAtcs] = await Promise.all([
    prisma.users.findFirst({
      where: { id, distributor_id: currentUser.distributorId },
      include: { roles: true, user_store_links: true },
    }),
    prisma.roles.findMany({ orderBy: { label: "asc" } }),
    // CDVs actifs du distributeur
    prisma.users.findMany({
      where: {
        distributor_id: currentUser.distributorId,
        is_active: true,
        roles: { code: "cdv" },
      },
      select: { id: true, first_name: true, last_name: true, email: true },
      orderBy: { last_name: "asc" },
    }),
    // ATCs actifs (pour remplacement)
    prisma.users.findMany({
      where: {
        distributor_id: currentUser.distributorId,
        is_active: true,
        roles: { code: "atc" },
      },
      select: { id: true, first_name: true, last_name: true, email: true },
      orderBy: { last_name: "asc" },
    }),
    prisma.stores.findMany({
      where: { distributor_id: currentUser.distributorId, is_active: true },
      select: { id: true, code: true, name: true },
      orderBy: [{ code: "asc" }],
    }),
    prisma.users.findMany({
      where: {
        distributor_id: currentUser.distributorId,
        supervisor_id: id,
        roles: { code: "atc" },
      },
      select: { id: true },
    }),
  ]);

  if (!user) notFound();

  return (
    <AdminModulePage
      badge="Utilisateur · Édition"
      title={`Modifier · ${user.first_name} ${user.last_name}`.trim()}
      description="Profil, rôle et rattachement hiérarchique."
      backHref={`${adminBase}/users/${user.id}`}
      backLabel="Retour fiche utilisateur"
    >
      <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", padding: "1.75rem", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
        <UserEditForm
          user={{ ...user, supervised_atc_ids: supervisedAtcs.map((atc) => atc.id) }}
          roles={roles}
          cdvs={cdvs}
          atcs={atcs.filter((atc) => atc.id !== user.id)}
          stores={stores}
        />
      </section>
    </AdminModulePage>
  );
}
