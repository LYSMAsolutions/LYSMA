import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Car, ClipboardList, Store } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import { getStoreScopeForUser } from "@/lib/admin/bons";
import { RoleHero, RoleKpiGrid } from "@/components/role-dashboard/RoleDashboardKit";
import ClientSearchPanel from "@/components/clients/ClientSearchPanel";
import { buildClientSearchIncludes, buildClientSearchWhere, normalizeClientSearch } from "@/lib/client-search";

export default async function RdmClientsPage({
  params,
  searchParams,
}: {
  params: Promise<{ distributor: string }>;
  searchParams?: Promise<{ q?: string }>;
}) {
  const { distributor } = await params;
  const query = normalizeClientSearch((await searchParams)?.q);
  const user = await requireAccess({ allowedRoles: ["rdm"], distributorSlug: distributor });
  const rdmBase = `/${user.distributorSlug}/rdm`;
  const stores = await getStoreScopeForUser({ distributorId: user.distributorId, userId: user.id });
  const storeIds = stores.map((store) => store.id);
  const searchWhere = buildClientSearchWhere(query);
  const searchIncludes = buildClientSearchIncludes(query);

  const clients = storeIds.length
    ? await prisma.clients.findMany({
        where: {
          AND: [
            { distributor_id: user.distributorId, store_id: { in: storeIds } },
            ...(searchWhere ? [searchWhere] : []),
          ],
        },
        include: {
          users: { select: { first_name: true, last_name: true, code: true } },
          stores: { select: { code: true, name: true, city: true } },
          ...(query ? searchIncludes : {}),
          _count: { select: { bons: true, client_equipment: true } },
        },
        orderBy: [{ name: "asc" }],
        take: 300,
      })
    : [];

  const activeClients = clients.filter((client) => client.is_active).length;
  const totalBons = clients.reduce((sum, client) => sum + client._count.bons, 0);
  const totalEquipment = clients.reduce((sum, client) => sum + client._count.client_equipment, 0);

  return (
    <div className="space-y-8">
      <RoleHero
        eyebrow="RDM - Clients"
        title="Clients magasin"
        description="Recherche et consultation des clients rattaches aux magasins de ton perimetre."
        secondary={{ href: rdmBase, label: "Retour RDM" }}
      />

      <RoleKpiGrid
        items={[
          { title: "Clients", value: clients.length, subtitle: "dans ton perimetre", href: `${rdmBase}/clients`, icon: BriefcaseBusiness, tone: "info" },
          { title: "Actifs", value: activeClients, subtitle: "clients utilisables", href: `${rdmBase}/clients`, icon: Store, tone: "success" },
          { title: "Bons", value: totalBons, subtitle: "bons visibles", href: `${rdmBase}/bons`, icon: ClipboardList, tone: "default" },
          { title: "Parc", value: totalEquipment, subtitle: "materiels recenses", href: `${rdmBase}/clients`, icon: Car, tone: "warning" },
        ]}
      />

      <ClientSearchPanel action={`${rdmBase}/clients`} query={query} resultCount={clients.length} />

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {clients.map((client) => {
          const atcName = client.users ? `${client.users.first_name} ${client.users.last_name}`.trim() : "Aucun ATC";

          return (
            <article key={client.id} className="card-lysma p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#0F172A]">{client.name}</h2>
                  <p className="mt-2 text-sm text-[#6B7280]">{[client.code, client.city].filter(Boolean).join(" - ") || "Client sans code"}</p>
                  <p className="mt-1 text-sm text-[#6B7280]">ATC : {client.users?.code ? `${client.users.code} - ` : ""}{atcName}</p>
                  <p className="mt-1 text-sm text-[#6B7280]">Magasin : {client.stores ? `${client.stores.code} - ${client.stores.name}` : "Non rattache"}</p>
                </div>
                <Link href={`${rdmBase}/clients/${client.id}`} className="btn-primary shrink-0">Ouvrir fiche</Link>
              </div>

              {query ? <MatchChips client={client} basePath={rdmBase} /> : null}

              <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                <InfoTile label="Bons" value={client._count.bons} />
                <InfoTile label="Parc" value={client._count.client_equipment} />
                <Link href={`${rdmBase}/bons`} className="group rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] p-4 transition hover:bg-white">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0A4D9B]">Action</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#0A4D9B]">
                    Voir bons <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </p>
                </Link>
              </div>
            </article>
          );
        })}

        {!clients.length ? <div className="card-lysma p-8"><p className="text-sm text-[#6B7280]">Aucun client dans le perimetre.</p></div> : null}
      </section>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#94A3B8]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#0A4D9B]">{value}</p>
    </div>
  );
}

function MatchChips({ client, basePath }: { client: any; basePath: string }) {
  return (
    <div className="mt-5 rounded-2xl border border-[#E2E8F0] bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#94A3B8]">Correspondances</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {client.bons?.map((bon: any) => (
          <Link key={bon.id} href={`${basePath}/bons/${bon.id}`} className="rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#0A4D9B]">
            {bon.bon_number} · {bon.bon_type}
          </Link>
        ))}
        {client.bons?.flatMap((bon: any) => bon.bon_lines).map((line: any, index: number) => (
          <span key={`${client.id}-line-${index}`} className="rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-3 py-1 text-xs font-semibold text-[#C2410C]">
            {line.reference || line.billing_code || line.designation || "Ligne bon"}
          </span>
        ))}
        {client.client_equipment?.map((item: any, index: number) => (
          <span key={`${client.id}-equipment-${index}`} className="rounded-full border border-[#BBF7D0] bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#15803D]">
            {[item.type_materiel, item.marque, item.modele, item.num_serie].filter(Boolean).join(" - ")}
          </span>
        ))}
      </div>
    </div>
  );
}
