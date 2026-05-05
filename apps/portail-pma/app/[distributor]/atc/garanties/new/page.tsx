import { requireAccess } from "@/lib/require-access";
import { prisma } from "@/lib/prisma";
import CreateGarantieForm from "@/components/atc/garanties/CreateGarantieForm";

export default async function AtcNewGarantiePage({ params }: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["atc"], distributorSlug: distributor });

  const [clients, stores] = await Promise.all([
    prisma.clients.findMany({
      where: { distributor_id: user.distributorId, assigned_user_id: user.id, is_active: true },
      include: { stores: { select: { id: true, name: true, code: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.stores.findMany({
      where: { distributor_id: user.distributorId, is_active: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <CreateGarantieForm
      distributorSlug={user.distributorSlug}
      atcName={user.firstName ?? user.email}
      clients={clients.map((c) => ({
        id: c.id, name: c.name, code: c.code,
        storeId: c.stores?.id ?? null, storeName: c.stores?.name ?? null, storeCode: c.stores?.code ?? null,
      }))}
      stores={stores.map((s) => ({ id: s.id, name: s.name, code: s.code }))}
    />
  );
}