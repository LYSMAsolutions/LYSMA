import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import StoreStaffEditForm from "@/components/admin/forms/StoreStaffEditForm";

export default async function AdminMagasinierEditPage({
  params,
}: { params: Promise<{ distributor: string; id: string }> }) {
  const { distributor, id } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const [staff, stores, roles] = await Promise.all([
    prisma.store_staff.findFirst({
      where: { id, stores: { distributor_id: currentUser.distributorId } },
      include: { stores: { select: { id: true, code: true, name: true } } },
    }),
    prisma.stores.findMany({
      where: { distributor_id: currentUser.distributorId, is_active: true },
      select: { id: true, code: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.roles.findMany({ orderBy: { label: "asc" } }),
  ]);

  if (!staff) notFound();

  return (
    <AdminModulePage
      badge="Magasinier · Édition"
      title={`Modifier · ${staff.first_name} ${staff.last_name}`}
      description={`Magasin actuel : ${staff.stores.code} · ${staff.stores.name}`}
      backHref={`${adminBase}/users/magasiniers/${staff.id}`}
      backLabel="Retour fiche magasinier"
    >
      <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", padding: "1.75rem", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
        <StoreStaffEditForm staff={staff} stores={stores} roles={roles} />
      </section>
    </AdminModulePage>
  );
}