import { requireAccess } from "@/lib/require-access";
import { prisma } from "@/lib/prisma";
import NewBonEntry from "@/components/atc/bons/NewBonEntry";

export default async function AtcNewBonPage({ params }: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["atc"], distributorSlug: distributor });

  const [clients, stores, activeTools, settings] = await Promise.all([
    prisma.clients.findMany({
      where: { distributor_id: user.distributorId, assigned_user_id: user.id, is_active: true },
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

  const activeCodes  = activeTools.map((t) => t.tools.code);
  const savStores    = stores.filter((s) => s.store_type === "sav");
  const normalStores = stores.filter((s) => s.store_type !== "sav");
  const wf           = settings?.workflow_config as Record<string, unknown> | null;

  return (
    <NewBonEntry
      distributorSlug={user.distributorSlug}
      clients={clients.map((c) => ({
        id: c.id, name: c.name, code: c.code,
        storeId: c.stores?.id ?? null, storeName: c.stores?.name ?? null, storeCode: c.stores?.code ?? null,
        representativeName: c.representative_name ?? null,
        phone:    c.phone        ?? null,
        email:    c.email        ?? null,
        addressLine1: c.address_line_1 ?? null,
        postalCode:   c.postal_code    ?? null,
        city:         c.city           ?? null,
        billingName:  c.billing_name   ?? null,
      }))}
      normalStores={normalStores.map((s) => ({ id: s.id, name: s.name, code: s.code }))}
      savStores={savStores.map((s) => ({ id: s.id, name: s.name, code: s.code }))}
      allStores={stores.map((s) => ({ id: s.id, name: s.name, code: s.code }))}
      activeCodes={activeCodes}
      retourConfig={{
        requireBonRef:      !!(wf?.retour_require_bon_ref),
        requireMotif:       !!(wf?.retour_require_motif),
        requireDesignation: !!(wf?.retour_require_designation),
      }}
    />
  );
}