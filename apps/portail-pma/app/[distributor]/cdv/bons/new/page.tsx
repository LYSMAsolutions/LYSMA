import { requireAccess } from "@/lib/require-access";
import { prisma } from "@/lib/prisma";
import { buildCdvClientWhere, getCdvScope } from "@/lib/admin/access-scope";
import NewBonEntry from "@/components/atc/bons/NewBonEntry";

export default async function CdvNewBonPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["cdv"], distributorSlug: distributor });
  const scope = await getCdvScope({ distributorId: user.distributorId, userId: user.id });

  const [clients, stores, activeTools, settings] = await Promise.all([
    prisma.clients.findMany({
      where: {
        ...buildCdvClientWhere({
          distributorId: user.distributorId,
          actorUserIds: scope.actorUserIds,
          storeIds: scope.storeIds,
        }),
        is_active: true,
      },
      include: { stores: { select: { id: true, name: true, code: true, store_type: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.stores.findMany({
      where: { distributor_id: user.distributorId, is_active: true },
      orderBy: { name: "asc" },
    }),
    prisma.distributor_tools.findMany({
      where: { distributor_id: user.distributorId, is_enabled: true },
      include: { tools: { select: { code: true } } },
    }),
    prisma.distributor_settings.findFirst({
      where: { distributor_id: user.distributorId },
      select: { workflow_config: true },
    }),
  ]);

  const activeCodes = activeTools.map((tool) => tool.tools.code);
  const savStores = stores.filter((store) => store.store_type === "sav");
  const normalStores = stores.filter((store) => store.store_type !== "sav");
  const workflow = settings?.workflow_config as Record<string, unknown> | null;

  return (
    <NewBonEntry
      distributorSlug={user.distributorSlug}
      basePath={`/${user.distributorSlug}/cdv`}
      roleLabel="CDV"
      clients={clients.map((client) => ({
        id: client.id,
        name: client.name,
        code: client.code,
        storeId: client.stores?.id ?? null,
        storeName: client.stores?.name ?? null,
        storeCode: client.stores?.code ?? null,
        status: client.is_active ? "active" : "inactive",
      }))}
      normalStores={normalStores.map((store) => ({ id: store.id, name: store.name, code: store.code }))}
      savStores={savStores.map((store) => ({ id: store.id, name: store.name, code: store.code }))}
      allStores={stores.map((store) => ({ id: store.id, name: store.name, code: store.code }))}
      activeCodes={activeCodes}
      retourConfig={{
        requireBonRef: !!workflow?.retour_require_bon_ref,
        requireMotif: !!workflow?.retour_require_motif,
        requireDesignation: !!workflow?.retour_require_designation,
      }}
    />
  );
}
