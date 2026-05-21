import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import ClientFilters from "@/components/admin/clients/ClientFilters";
import ClientSearchPanel from "@/components/clients/ClientSearchPanel";
import { buildClientSearchWhere, normalizeClientSearch } from "@/lib/client-search";

export default async function AdminClientsPage({
  params,
  searchParams,
}: {
  params: Promise<{ distributor: string }>;
  searchParams?: Promise<{ q?: string }>;
}) {
  const { distributor } = await params;
  const query = normalizeClientSearch((await searchParams)?.q);

  const currentUser = await requireAccess({
    allowedRoles: ["admin"],
    distributorSlug: distributor,
  });

  const adminBase = `/${currentUser.distributorSlug}/admin`;
  const searchWhere = buildClientSearchWhere(query);

  const [clients, stores, atcs, bonCounts] = await Promise.all([
    prisma.clients.findMany({
      where: {
        AND: [
          { distributor_id: currentUser.distributorId },
          ...(searchWhere ? [searchWhere] : []),
        ],
      },
      orderBy: [{ created_at: "desc" }],
    }),
    prisma.stores.findMany({
      where: {
        distributor_id: currentUser.distributorId,
      },
      select: {
        id: true,
        code: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.users.findMany({
      where: {
        distributor_id: currentUser.distributorId,
        roles: {
          code: "atc",
        },
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
      orderBy: [{ first_name: "asc" }, { last_name: "asc" }],
    }),
    prisma.bons.groupBy({
      by: ["client_id"],
      _count: {
        client_id: true,
      },
      where: {
        distributor_id: currentUser.distributorId,
      },
    }),
  ]);

  const storeMap = new Map(stores.map((store) => [store.id, store]));
  const atcMap = new Map(atcs.map((atc) => [atc.id, atc]));
  const bonMap = new Map(
    bonCounts.map((item) => [item.client_id, item._count.client_id ?? 0]),
  );

  const rows = clients.map((client) => {
    const store = client.store_id ? storeMap.get(client.store_id) : null;
    const atc = client.assigned_user_id ? atcMap.get(client.assigned_user_id) : null;

    return {
      id: client.id,
      code: client.code || "",
      name: client.name,
      city: client.city,
      email: client.email,
      phone: client.phone,
      storeName: store ? `${store.code} · ${store.name}` : null,
      atcName: atc ? `${atc.first_name} ${atc.last_name}`.trim() : null,
      bonsCount: bonMap.get(client.id) || 0,
    };
  });

  return (
    <AdminModulePage
      badge="Clients · Admin"
      title="Gestion des clients"
      description="Référentiel client du distributeur, ajout manuel, rattachement magasin et assignation ATC."
      backHref={adminBase}
      kpis={[
        {
          title: "Clients",
          value: clients.length,
          href: `${adminBase}/clients`,
          note: "base client",
          tone: "blue",
        },
        {
          title: "Imports",
          value: "Module",
          href: `${adminBase}/clients/imports`,
          note: "imports clients",
          tone: "neutral",
        },
      ]}
    >
      <ClientSearchPanel action={`${adminBase}/clients`} query={query} resultCount={rows.length} />

      <section className="card-lysma" style={{ padding: "2rem" }}>
        <ClientFilters
          distributor={currentUser.distributorSlug}
          distributorId={currentUser.distributorId}
          stores={stores}
          atcs={atcs}
          initialClients={rows}
          showSearch={false}
        />
      </section>
    </AdminModulePage>
  );
}
