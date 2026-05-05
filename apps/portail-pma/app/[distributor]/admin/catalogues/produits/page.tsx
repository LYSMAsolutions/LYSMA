import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import CatalogueProduitsClient from "@/components/admin/catalogues/CatalogueProduitsClient";

export default async function AdminCatalogueProductsPage({
  params, searchParams,
}: {
  params: Promise<{ distributor: string }>;
  searchParams: Promise<{ supplier_id?: string; supplier_name?: string; famille?: string }>;
}) {
  const { distributor } = await params;
  const { supplier_id, supplier_name, famille } = await searchParams;
  const user = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${user.distributorSlug}/admin`;
  const now = new Date();

  const where: Record<string, unknown> = { distributor_id: user.distributorId };
  if (supplier_id) where.supplier_id = supplier_id;
  if (famille)     where.item_family  = famille;

  const [items, suppliers, catalogues] = await Promise.all([
    prisma.catalogue_items.findMany({
      where,
      include: {
        suppliers:  { select: { id: true, code: true, name: true } },
        catalogues: { select: { id: true, code: true, name: true, catalogue_type: true, valid_to: true } },
      },
      orderBy: { designation: "asc" },
    }),
    prisma.suppliers.findMany({
      where: { distributor_id: user.distributorId, is_active: true },
      select: { id: true, code: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.catalogues.findMany({
      where: {
        distributor_id: user.distributorId,
        is_active: true,
        OR: [{ valid_to: null }, { valid_to: { gte: now } }],
      },
      select: { id: true, code: true, name: true, catalogue_type: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const total    = items.length;
  const actifs   = items.filter((i) => i.is_active).length;
  const featured = items.filter((i) => i.is_featured).length;

  const title = supplier_name
    ? `Produits · ${decodeURIComponent(supplier_name)}`
    : famille
    ? `Produits · ${famille.replace("_", " ")}`
    : "Produits";

  const description = supplier_name
    ? `Toutes les références rattachées au fournisseur ${decodeURIComponent(supplier_name)}.`
    : "Référentiel produit central — toutes familles confondues.";

  return (
    <AdminModulePage
      badge="Catalogue · Produits"
      title={title}
      description={description}
      backHref={supplier_id || famille ? `${adminBase}/catalogues/fournisseurs` : `${adminBase}/catalogues`}
      backLabel={supplier_id ? "Retour fournisseurs" : "Retour catalogue"}
      kpis={[
        { title: "Total",        value: total,    note: "références",   tone: "blue"   },
        { title: "Actifs",       value: actifs,   note: "disponibles",  tone: "green"  },
        { title: "Mis en avant", value: featured, note: "featured",     tone: "yellow" },
      ]}
    >
      <CatalogueProduitsClient
        initialItems={JSON.parse(JSON.stringify(items))}
        suppliers={suppliers}
        catalogues={JSON.parse(JSON.stringify(catalogues))}
        distributorId={user.distributorId}
        prefilterSupplierId={supplier_id}
      />
    </AdminModulePage>
  );
}