import { requireAccess } from "@/lib/require-access";
import { prisma } from "@/lib/prisma";
import CatalogueView from "@/components/atc/catalogue/CatalogueView";

export default async function AtcCataloguesPage({ params }: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["atc"], distributorSlug: distributor });

  // Récupérer les produits du catalogue du distributeur
  const catalogues = await prisma.catalogues.findMany({
    where: { distributor_id: user.distributorId, is_active: true },
    include: {
      catalogue_items: {
        where:   { is_active: true },
        orderBy: { designation: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  // Aplatir tous les produits
  const products = catalogues.flatMap((cat) =>
    cat.catalogue_items.map((p) => ({
      id:          p.id,
      reference:   (p as any).internal_code   ?? "",
      designation: (p as any).designation ?? (p as any).name ?? "",
      price_ht:    (p as any).price_ht    ? Number((p as any).price_ht)    : null,
      unit:        (p as any).unit        ?? null,
      stock:       (p as any).stock_qty   ? Number((p as any).stock_qty)   : null,
      dispo_label: (p as any).availability ?? null,
      brand:       (p as any).brand       ?? null,
      family:      (p as any).family      ?? cat.name,
      description: (p as any).description ?? null,
      billing_code: (p as any).billing_code ?? null,
    }))
  );

  const families = [...new Set(products.map((p) => p.family).filter(Boolean))] as string[];

  return (
    <CatalogueView
      distributorSlug={user.distributorSlug}
      products={products}
      families={families}
    />
  );
}