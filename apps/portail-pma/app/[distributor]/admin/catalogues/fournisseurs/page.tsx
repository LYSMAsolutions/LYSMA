import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import FournisseursClient from "@/components/admin/catalogues/FournisseursClient";

export default async function AdminCatalogueSuppliersPage({
  params,
}: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${user.distributorSlug}/admin`;

  const suppliers = await prisma.suppliers.findMany({
    where: { distributor_id: user.distributorId },
    include: { _count: { select: { catalogue_items: true, catalogues: true } } },
    orderBy: { name: "asc" },
  });

  const actifs   = suppliers.filter((s) => s.is_active).length;
  const inactifs = suppliers.filter((s) => !s.is_active).length;

  return (
    <AdminModulePage
      badge="Catalogue · Fournisseurs"
      title="Fournisseurs"
      description="Sources catalogue du distributeur. Cliquez sur Modifier pour éditer un fournisseur."
      backHref={`${adminBase}/catalogues`}
      backLabel="Retour catalogue"
      kpis={[
        { title: "Total",    value: suppliers.length, note: "fournisseurs", tone: "blue"    },
        { title: "Actifs",   value: actifs,           note: "en activité",  tone: "green"   },
        { title: "Inactifs", value: inactifs,         note: "désactivés",   tone: "neutral" },
      ]}
    >
      <FournisseursClient
        initialSuppliers={JSON.parse(JSON.stringify(suppliers))}
        adminBase={adminBase}
      />
    </AdminModulePage>
  );
}