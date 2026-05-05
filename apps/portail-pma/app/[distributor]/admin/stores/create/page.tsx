import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import StoreForm from "@/components/admin/stores/StoreForm";

export default async function AdminStoreCreatePage({
  params,
}: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const rdms = await prisma.users.findMany({
    where: { distributor_id: currentUser.distributorId, is_active: true, roles: { code: "rdm" } },
    select: { id: true, first_name: true, last_name: true, email: true },
    orderBy: { last_name: "asc" },
  });

  return (
    <AdminModulePage
      badge="Magasins · Création"
      title="Nouveau magasin"
      description="Créer un nouveau magasin pour ce distributeur."
      backHref={`${adminBase}/stores`}
      backLabel="Retour magasins"
    >
      <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", padding: "1.75rem", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
        <StoreForm rdms={rdms} distributor={currentUser.distributorSlug} redirectBase={`${adminBase}/stores`} />
      </section>
    </AdminModulePage>
  );
}