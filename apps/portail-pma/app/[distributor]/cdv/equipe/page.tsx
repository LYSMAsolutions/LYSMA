import Link from "next/link";
import { BriefcaseBusiness, Building2, Mail, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import { RoleHero, RoleKpiGrid } from "@/components/role-dashboard/RoleDashboardKit";

export default async function CdvEquipePage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["cdv"], distributorSlug: distributor });
  const cdvBase = `/${user.distributorSlug}/cdv`;

  const [atcs, stores] = await Promise.all([
    prisma.users.findMany({
      where: {
        distributor_id: user.distributorId,
        supervisor_id: user.id,
        roles: { code: "atc" },
      },
      include: {
        _count: { select: { clients: true, bons: true } },
      },
      orderBy: [{ last_name: "asc" }, { first_name: "asc" }],
    }),
    prisma.stores.findMany({
      where: {
        distributor_id: user.distributorId,
        user_store_links: { some: { user_id: user.id } },
      },
      select: { id: true, code: true, name: true, city: true, store_type: true },
      orderBy: [{ code: "asc" }],
    }),
  ]);

  const totalClients = atcs.reduce((sum, atc) => sum + atc._count.clients, 0);
  const totalBons = atcs.reduce((sum, atc) => sum + atc._count.bons, 0);

  return (
    <div className="space-y-8">
      <RoleHero
        eyebrow="CDV - Equipe"
        title="Equipe commerciale"
        description="Vue propre de tes ATC, de leurs clients, de leurs bons et des magasins rattaches a ton perimetre."
        secondary={{ href: cdvBase, label: "Retour CDV" }}
      />

      <RoleKpiGrid
        items={[
          { title: "ATC", value: atcs.length, subtitle: "rattaches", href: `${cdvBase}/atc`, icon: Users, tone: "info" },
          { title: "Clients", value: totalClients, subtitle: "dans le portefeuille", href: `${cdvBase}/clients`, icon: BriefcaseBusiness, tone: "success" },
          { title: "Bons", value: totalBons, subtitle: "crees par l'equipe", href: `${cdvBase}/bons`, icon: BriefcaseBusiness, tone: "default" },
          { title: "Magasins", value: stores.length, subtitle: "dans ton perimetre", href: `${cdvBase}/equipe`, icon: Building2, tone: "warning" },
        ]}
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <div className="card-lysma p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#0F172A]">ATC rattaches</h2>
              <p className="mt-1 text-sm text-[#6B7280]">Suivi rapide des portefeuilles et de l'activite.</p>
            </div>
            <Link href={`${cdvBase}/atc`} className="btn-secondary">Voir ATC</Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {atcs.map((member) => (
              <article key={member.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-[#0F172A]">
                      {`${member.first_name} ${member.last_name}`.trim() || "ATC sans nom"}
                    </h3>
                    <p className="mt-1 text-sm text-[#6B7280]">Code ATC {member.code || "-"}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${member.is_active ? "bg-[#ECFDF5] text-[#15803D]" : "bg-[#F1F5F9] text-[#64748B]"}`}>
                    {member.is_active ? "Actif" : "Inactif"}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#94A3B8]">Clients</p>
                    <p className="mt-2 text-2xl font-semibold text-[#0A4D9B]">{member._count.clients}</p>
                  </div>
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#94A3B8]">Bons</p>
                    <p className="mt-2 text-2xl font-semibold text-[#0A4D9B]">{member._count.bons}</p>
                  </div>
                </div>

                <a href={`mailto:${member.email}`} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#0A4D9B]">
                  <Mail className="h-4 w-4" /> {member.email}
                </a>
              </article>
            ))}

            {!atcs.length ? <p className="text-sm text-[#6B7280]">Aucun ATC rattache pour le moment.</p> : null}
          </div>
        </div>

        <div className="card-lysma p-8">
          <h2 className="text-xl font-semibold text-[#0F172A]">Magasins rattaches</h2>
          <div className="mt-6 space-y-4">
            {stores.map((store) => (
              <div key={store.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#0F172A]">{store.code} - {store.name}</p>
                    <p className="mt-1 text-sm text-[#6B7280]">{store.city || "Ville non renseignee"}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0A4D9B]">
                    {store.store_type === "sav" ? "SAV" : "Standard"}
                  </span>
                </div>
              </div>
            ))}

            {!stores.length ? <p className="text-sm text-[#6B7280]">Aucun magasin rattache.</p> : null}
          </div>
        </div>
      </section>
    </div>
  );
}
