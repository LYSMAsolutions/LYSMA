import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";

function formatDate(value: Date | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short" }).format(value);
}

export default async function AtcClientDetailPage({
  params,
}: {
  params: Promise<{ distributor: string; id: string }>;
}) {
  const { distributor, id } = await params;
  const user = await requireAccess({ allowedRoles: ["atc"], distributorSlug: distributor });
  const atcBase = `/${user.distributorSlug}/atc`;

  const client = await prisma.clients.findFirst({
    where: { id, distributor_id: user.distributorId, assigned_user_id: user.id },
    include: { stores: { select: { code: true, name: true, city: true } } },
  });

  if (!client) notFound();

  const [bons, equipment] = await Promise.all([
    prisma.bons.findMany({
      where: { distributor_id: user.distributorId, client_id: client.id, created_by_user_id: user.id },
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
    <AdminModulePage
      badge="ATC - Client"
      title={client.name}
      description={[client.code, client.address_line_1, client.postal_code, client.city].filter(Boolean).join(" - ") || "Fiche client"}
      backHref={`${atcBase}/clients`}
      backLabel="Retour clients"
      kpis={[
        { title: "Bons", value: bons.length, note: "crees par toi", tone: "blue" },
        { title: "Parc", value: equipment.length, note: "materiels", tone: "green" },
      ]}
    >
      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[.8fr_1.2fr]">
          <div className="card-lysma p-8">
            <h2 className="text-xl font-semibold text-[#0F172A]">Informations client</h2>
            <div className="mt-6 space-y-4 text-sm">
              <Info label="Code" value={client.code || "-"} />
              <Info label="Magasin" value={client.stores ? `${client.stores.code} - ${client.stores.name}` : "-"} />
              <Info label="Email" value={client.email || "-"} />
              <Info label="Telephone" value={client.phone || "-"} />
              <Info label="Ville" value={[client.postal_code, client.city].filter(Boolean).join(" ") || "-"} />
            </div>
          </div>

          <div className="card-lysma p-8">
            <h2 className="text-xl font-semibold text-[#0F172A]">Parc materiel</h2>
            <div className="mt-6 space-y-4">
              {equipment.map((item) => (
                <div key={item.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-5">
                  <p className="font-semibold text-[#0F172A]">{item.type_materiel}</p>
                  <p className="mt-1 text-sm text-[#6B7280]">{[item.marque, item.modele, item.annee].filter(Boolean).join(" - ") || "Materiel sans detail"}</p>
                  <p className="mt-1 text-sm text-[#6B7280]">N serie {item.num_serie || "-"}</p>
                </div>
              ))}
              {!equipment.length ? <p className="text-sm text-[#6B7280]">Aucun materiel enregistre.</p> : null}
            </div>
          </div>
        </section>

        <section className="card-lysma p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold text-[#0F172A]">Bons recents</h2>
            <Link href={`${atcBase}/bons/new`} className="btn-primary">Nouveau bon</Link>
          </div>
          <div className="mt-6 space-y-3">
            {bons.map((bon) => (
              <Link key={bon.id} href={`${atcBase}/bons/${bon.id}`} className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-4 transition hover:bg-white md:flex-row md:items-center md:justify-between">
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
    </AdminModulePage>
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
