import Link from "next/link";
import { notFound } from "next/navigation";
import { Car, ClipboardList, PackageSearch } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import { buildCdvClientWhere, getCdvScope } from "@/lib/admin/access-scope";
import { RoleHero, RoleKpiGrid } from "@/components/role-dashboard/RoleDashboardKit";
import { updateCdvClientAtc } from "../actions";

function formatDate(value: Date | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short" }).format(value);
}

export default async function CdvClientDetailPage({
  params,
}: {
  params: Promise<{ distributor: string; id: string }>;
}) {
  const { distributor, id } = await params;
  const user = await requireAccess({ allowedRoles: ["cdv"], distributorSlug: distributor });
  const cdvBase = `/${user.distributorSlug}/cdv`;
  const scope = await getCdvScope({ distributorId: user.distributorId, userId: user.id });

  const client = await prisma.clients.findFirst({
    where: {
      id,
      ...buildCdvClientWhere({
        distributorId: user.distributorId,
        actorUserIds: scope.actorUserIds,
        storeIds: scope.storeIds,
      }),
    },
    include: {
      users: { select: { first_name: true, last_name: true, email: true } },
      stores: { select: { code: true, name: true, city: true } },
    },
  });

  if (!client) notFound();

  const [bons, equipment, atcs] = await Promise.all([
    prisma.bons.findMany({
      where: { distributor_id: user.distributorId, client_id: client.id },
      orderBy: { updated_at: "desc" },
      take: 12,
    }),
    prisma.client_equipment.findMany({
      where: { distributor_id: user.distributorId, client_id: client.id, is_active: true },
      include: { bons: { select: { id: true, bon_number: true } } },
      orderBy: { updated_at: "desc" },
    }),
    prisma.users.findMany({
      where: {
        distributor_id: user.distributorId,
        supervisor_id: user.id,
        roles: { code: "atc" },
        is_active: true,
      },
      select: { id: true, first_name: true, last_name: true, code: true },
      orderBy: [{ last_name: "asc" }, { first_name: "asc" }],
    }),
  ]);

  return (
    <div className="space-y-8">
      <RoleHero
        eyebrow="CDV - Client"
        title={client.name}
        description={[client.code, client.address_line_1, client.postal_code, client.city].filter(Boolean).join(" - ") || "Fiche client du perimetre commercial."}
        secondary={{ href: `${cdvBase}/clients`, label: "Retour clients" }}
      />

      <RoleKpiGrid
        items={[
          { title: "Bons", value: bons.length, subtitle: "recents visibles", href: `${cdvBase}/bons`, icon: ClipboardList, tone: "info" },
          { title: "Materiels", value: equipment.length, subtitle: "releves de parc", href: `${cdvBase}/clients/${client.id}`, icon: PackageSearch, tone: "success" },
          { title: "Magasin", value: client.stores?.code || "-", subtitle: client.stores?.name || "non rattache", href: `${cdvBase}/equipe`, icon: Car, tone: "default" },
        ]}
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <div className="card-lysma p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#0F172A]">Informations client</h2>
              <p className="mt-1 text-sm text-[#6B7280]">Rattachement commercial et informations principales.</p>
            </div>
          </div>
          <div className="mt-6 space-y-4 text-sm">
            <p className="flex justify-between gap-4 border-b border-[#E2E8F0] pb-3"><span className="text-[#6B7280]">Code</span><span className="font-medium text-[#0F172A]">{client.code || "-"}</span></p>
            <p className="flex justify-between gap-4 border-b border-[#E2E8F0] pb-3"><span className="text-[#6B7280]">ATC</span><span className="font-medium text-[#0F172A]">{client.users ? `${client.users.first_name} ${client.users.last_name}` : "-"}</span></p>
            <p className="flex justify-between gap-4 border-b border-[#E2E8F0] pb-3"><span className="text-[#6B7280]">Magasin</span><span className="font-medium text-[#0F172A]">{client.stores ? `${client.stores.code} - ${client.stores.name}` : "-"}</span></p>
            <p className="flex justify-between gap-4 border-b border-[#E2E8F0] pb-3"><span className="text-[#6B7280]">Email</span><span className="font-medium text-[#0F172A]">{client.email || "-"}</span></p>
            <p className="flex justify-between gap-4"><span className="text-[#6B7280]">Telephone</span><span className="font-medium text-[#0F172A]">{client.phone || "-"}</span></p>
          </div>

          <form action={updateCdvClientAtc.bind(null, user.distributorSlug, client.id)} className="mt-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-5">
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#94A3B8]" htmlFor="atcId">
              Rattacher a un ATC
            </label>
            <div className="mt-3 flex flex-col gap-3 md:flex-row">
              <select
                id="atcId"
                name="atcId"
                defaultValue={client.assigned_user_id ?? ""}
                className="min-h-11 flex-1 rounded-xl border border-[#D9E3F0] bg-white px-4 text-sm font-medium text-[#0F172A] outline-none"
              >
                <option value="">Selectionner un ATC</option>
                {atcs.map((atc) => (
                  <option key={atc.id} value={atc.id}>
                    {atc.code ? `${atc.code} - ` : ""}{`${atc.first_name} ${atc.last_name}`.trim()}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-primary">
                Enregistrer
              </button>
            </div>
            <p className="mt-3 text-xs leading-5 text-[#6B7280]">
              Le client reste dans ton perimetre et sera visible par l'ATC choisi.
            </p>
          </form>
        </div>

        <div className="card-lysma p-8">
          <h2 className="text-xl font-semibold text-[#0F172A]">Releves de parc</h2>
          <div className="mt-6 space-y-4">
            {equipment.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[#0F172A]">{item.type_materiel}</p>
                    <p className="mt-1 text-sm text-[#6B7280]">{[item.marque, item.modele, item.annee].filter(Boolean).join(" - ") || "Materiel sans detail"}</p>
                    <p className="mt-1 text-sm text-[#6B7280]">N serie {item.num_serie || "-"}</p>
                  </div>
                  {item.bons ? (
                    <Link href={`${cdvBase}/bons/${item.bons.id}`} className="btn-secondary">
                      {item.bons.bon_number}
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}

            {!equipment.length ? <p className="text-sm text-[#6B7280]">Aucun releve de parc enregistre pour ce client.</p> : null}
          </div>
        </div>
      </section>

      <section className="card-lysma p-8">
        <h2 className="text-xl font-semibold text-[#0F172A]">Bons recents</h2>
        <div className="mt-6 space-y-3">
          {bons.map((bon) => (
            <Link key={bon.id} href={`${cdvBase}/bons/${bon.id}`} className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-4 transition hover:bg-white md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-[#0F172A]">{bon.bon_number}</p>
                <p className="mt-1 text-sm text-[#6B7280]">{bon.bon_type}</p>
              </div>
              <div className="text-sm text-[#6B7280]">{formatDate(bon.updated_at)}</div>
            </Link>
          ))}

          {!bons.length ? <p className="text-sm text-[#6B7280]">Aucun bon pour ce client.</p> : null}
        </div>
      </section>
    </div>
  );
}
