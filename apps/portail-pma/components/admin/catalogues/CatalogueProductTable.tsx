import { getCurrentSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import CatalogueProduitsClient from "./CatalogueProduitsClient";

export default async function CatalogueProductTable() {
  const session = await getCurrentSession();

  if (!session || session.user.roleCode !== "admin") {
    return null;
  }

  const [items, suppliers, catalogues] = await Promise.all([
    prisma.catalogue_items.findMany({
      where: { distributor_id: session.user.distributorId },
      include: {
        suppliers: { select: { id: true, code: true, name: true } },
        catalogues: { select: { id: true, code: true, name: true, catalogue_type: true, valid_to: true } },
      },
      orderBy: { designation: "asc" },
      take: 80,
    }),
    prisma.suppliers.findMany({
      where: { distributor_id: session.user.distributorId },
      select: { id: true, code: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.catalogues.findMany({
      where: { distributor_id: session.user.distributorId, is_active: true },
      select: { id: true, code: true, name: true, catalogue_type: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <CatalogueProduitsClient
      initialItems={items as any}
      suppliers={suppliers}
      catalogues={catalogues}
      distributorId={session.user.distributorId}
    />
  );
}
