import Link from "next/link";
import { notFound } from "next/navigation";
import { Car, ClipboardList, PackageSearch } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import { getStoreScopeForUser } from "@/lib/admin/bons";
import { RoleHero, RoleKpiGrid } from "@/components/role-dashboard/RoleDashboardKit";

function formatDate(value: Date | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short" }).format(value);
}

export default async function RdmClientDetailPage({
  params,
}: {
  params: Promise<{ distributor: string; id: string }>;
}) {
  const { distributor, id } = await params;
  const user = await requireAccess({ allowedRoles: ["rdm"], distributorSlug: distributor });
  const rdmBase = `/${user.distributorSlug}/rdm`;
  const stores = await getStoreScopeForUser({ distributorId: user.distributorId, userId: user.id });
  const storeIds = stores.map((store) => store.id);

  const client = await prisma.clients.findFirst({
    where: { id, distributor_id: user.distributorId, store_id: { in: storeIds } },
    include: {
      users: { select: { first_name: true, last_name: true, email: true } },
      stores: { select: { code: true, name: true, city: true } },
    },
  });

  if (!client) notFound();

  const [bons, equipment] = await Promise.all([
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
  ]);

  return (
    <div className="space-y-8">
      <RoleHero
        eyebrow="RDM - Client"
        title={client.name}
        description={[client.code, client.address_line_1, client.postal_code, client.city].filter(Boolean).join(" - ") || "Fiche client magasin."}
        secondary={{ href: `${rdmBase}/clients`, label: "Retour clients" }}
      />

      <RoleKpiGrid
        items={[
          { title: "Bons", value: bons.length, subtitle: "recents visibles", href: `${rdmBase}/bons`, icon: ClipboardList, tone: "info" },
          { title: "Materiels", value: equipment.length, subtitle: "releves de parc", href: `${rdmBase}/clients/${client.id}`, icon: PackageSearch, tone: "success" },
          { title: "Magasin", value: client.stores?.code || "-", subtitle: client.stores?.name || "non rattache", href: `${rdmBase}/clients`, icon: Car, tone: "default" },
        ]}
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <div className="card-lysma p-8">
          <h2 className="text-xl font-semibold text-[#0F172A]">Informations client</h2>
          <div className="mt-6 space-y-4 text-sm">
            <Info label="Code" value={client.code || "-"} />
            <Info label="ATC" value={client.users ? `${client.users.first_name} ${client.users.last_name}` : "-"} />
            <Info label="Magasin" value={client.stores ? `${client.stores.code} - ${client.stores.name}` : "-"} />
            <Info label="Email" value={client.email || "-"} />
            <Info label="Telephone" value={client.phone || "-"} />
          </div>
        </div>

        <div className="card-lysma p-8">
          <h2 className="text-xl font-semibold text-[#0F172A]">Releves de parc</h2>
          <div className="mt-6 space-y-4">
            {equipment.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-5">
                <p className="font-semibold text-[#0F172A]">{item.type_materiel}</p>
                <p className="mt-1 text-sm text-[#6B7280]">{[item.marque, item.modele, item.annee].filter(Boolean).join(" - ") || "Materiel sans detail"}</p>
                <p className="mt-1 text-sm text-[#6B7280]">N serie {item.num_serie || "-"}</p>
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
            <Link key={bon.id} href={`${rdmBase}/bons/${bon.id}`} className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-4 transition hover:bg-white md:flex-row md:items-center md:justify-between">
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex justify-between gap-4 border-b border-[#E2E8F0] pb-3">
      <span className="text-[#6B7280]">{label}</span>
      <span className="font-medium text-[#0F172A]">{value}</span>
    </p>
  );
}
