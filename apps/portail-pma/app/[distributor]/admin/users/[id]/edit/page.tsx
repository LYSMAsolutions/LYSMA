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

  const [user, roles, cdvs, atcs] = await Promise.all([
    prisma.users.findFirst({
      where: { id, distributor_id: currentUser.distributorId },
      include: { roles: true },
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
        NOT: { id },
      },
      select: { id: true, first_name: true, last_name: true, email: true },
      orderBy: { last_name: "asc" },
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
        <UserEditForm user={user} roles={roles} cdvs={cdvs} atcs={atcs} />
      </section>
    </AdminModulePage>
  );
}