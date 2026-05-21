import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Car, ClipboardList, Users } from "lucide-react";
import { requireAccess } from "@/lib/require-access";
import { prisma } from "@/lib/prisma";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import ClientSearchPanel from "@/components/clients/ClientSearchPanel";
import { buildClientSearchIncludes, buildClientSearchWhere, normalizeClientSearch } from "@/lib/client-search";

export default async function AtcClientsPage({
  params,
  searchParams,
}: {
  params: Promise<{ distributor: string }>;
  searchParams?: Promise<{ q?: string }>;
}) {
  const { distributor } = await params;
  const query = normalizeClientSearch((await searchParams)?.q);
  const user = await requireAccess({ allowedRoles: ["atc"], distributorSlug: distributor });
  const atcBase = `/${user.distributorSlug}/atc`;
  const searchWhere = buildClientSearchWhere(query);
  const searchIncludes = buildClientSearchIncludes(query);

  const clients = await prisma.clients.findMany({
    where: {
      AND: [
        { distributor_id: user.distributorId, assigned_user_id: user.id },
        ...(searchWhere ? [searchWhere] : []),
      ],
    },
    include: {
      stores: { select: { name: true, code: true, city: true } },
      ...(query ? searchIncludes : {}),
      _count: { select: { bons: true, client_equipment: true } },
    },
    orderBy: { name: "asc" },
  });

  const total = clients.length;
  const actifs = clients.filter((client) => client.is_active).length;
  const totalBons = clients.reduce((sum, client) => sum + client._count.bons, 0);
  const totalEquipment = clients.reduce((sum, client) => sum + client._count.client_equipment, 0);

  return (
    <AdminModulePage
      badge="ATC - Clients"
      title="Mon portefeuille clients"
      description="Recherche dans tes clients, leurs bons, leurs references et leur parc materiel."
      backHref={atcBase}
      kpis={[
        { title: "Total", value: total, note: "clients assignes", tone: "blue" },
        { title: "Actifs", value: actifs, note: "clients actifs", tone: "green" },
        { title: "Bons", value: totalBons, note: "bons visibles", tone: "neutral" },
        { title: "Parc", value: totalEquipment, note: "materiels", tone: "yellow" },
      ]}
    >
      <div className="space-y-6">
        <ClientSearchPanel action={`${atcBase}/clients`} query={query} resultCount={clients.length} />

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {clients.map((client) => (
            <article key={client.id} className="card-lysma p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-[#0F172A]">{client.name}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${client.is_active ? "bg-[#ECFDF5] text-[#15803D]" : "bg-[#FEF2F2] text-[#DC2626]"}`}>
                      {client.is_active ? "Actif" : "Inactif"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#6B7280]">{[client.code, client.city].filter(Boolean).join(" - ") || "Client sans code"}</p>
                  <p className="mt-1 text-sm text-[#6B7280]">Magasin : {client.stores ? `${client.stores.code} - ${client.stores.name}` : "Non rattache"}</p>
                </div>
                <Link href={`${atcBase}/clients/${client.id}`} className="btn-primary shrink-0">Ouvrir fiche</Link>
              </div>

              {query ? <MatchChips client={client} basePath={atcBase} /> : null}

              <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                <InfoTile icon={ClipboardList} label="Bons" value={client._count.bons} />
                <InfoTile icon={Car} label="Parc" value={client._count.client_equipment} />
                <Link href={`${atcBase}/bons/new`} className="group rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] p-4 transition hover:bg-white">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0A4D9B]">Action</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#0A4D9B]">
                    Nouveau bon <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </p>
                </Link>
              </div>
            </article>
          ))}

          {!clients.length ? (
            <div className="card-lysma p-8">
              <Users className="h-9 w-9 text-[#94A3B8]" />
              <p className="mt-4 font-semibold text-[#0F172A]">Aucun client trouve</p>
              <p className="mt-2 text-sm text-[#6B7280]">Modifie ta recherche ou contacte l'administrateur pour l'assignation client.</p>
            </div>
          ) : null}
        </section>
      </div>
    </AdminModulePage>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: typeof BriefcaseBusiness; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-4">
      <Icon className="h-4 w-4 text-[#0A4D9B]" />
      <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[#94A3B8]">{label}</p>
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
