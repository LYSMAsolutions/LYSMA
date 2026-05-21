import Link from "next/link";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, Mail, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import { RoleHero } from "@/components/role-dashboard/RoleDashboardKit";

export default async function CdvAtcPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["cdv"], distributorSlug: distributor });
  const cdvBase = `/${user.distributorSlug}/cdv`;

  const atcs = await prisma.users.findMany({
    where: {
      distributor_id: user.distributorId,
      supervisor_id: user.id,
      roles: { code: "atc" },
    },
    include: {
      _count: { select: { clients: true, bons: true } },
    },
    orderBy: [{ last_name: "asc" }, { first_name: "asc" }],
  });

  return (
    <div className="space-y-8">
      <RoleHero
        eyebrow="CDV - ATC"
        title="Suivi des ATC"
        description="Controle clair des commerciaux rattaches : codes ATC, activite, clients et bons crees."
        secondary={{ href: cdvBase, label: "Retour CDV" }}
      />

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {atcs.map((atc) => (
          <article key={atc.id} className="card-lysma p-6 transition hover:-translate-y-[1px] hover:shadow-[0_18px_40px_rgba(10,77,155,0.10)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E8F1FB]">
                  <Users className="h-5 w-5 text-[#0A4D9B]" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#0F172A]">
                    {`${atc.first_name} ${atc.last_name}`.trim() || "ATC sans nom"}
                  </h2>
                  <p className="mt-1 text-sm text-[#6B7280]">Code ATC {atc.code || "-"}</p>
                </div>
              </div>

              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${atc.is_active ? "bg-[#ECFDF5] text-[#15803D]" : "bg-[#F1F5F9] text-[#64748B]"}`}>
                <BadgeCheck className="h-3 w-3" />
                {atc.is_active ? "Actif" : "Inactif"}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link href={`${cdvBase}/clients`} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-4 transition hover:bg-white">
                <BriefcaseBusiness className="h-4 w-4 text-[#0A4D9B]" />
                <p className="mt-3 text-2xl font-semibold text-[#0F172A]">{atc._count.clients}</p>
                <p className="mt-1 text-sm text-[#6B7280]">clients</p>
              </Link>

              <Link href={`${cdvBase}/bons`} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-4 transition hover:bg-white">
                <ArrowRight className="h-4 w-4 text-[#0A4D9B]" />
                <p className="mt-3 text-2xl font-semibold text-[#0F172A]">{atc._count.bons}</p>
                <p className="mt-1 text-sm text-[#6B7280]">bons</p>
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] pt-5">
              <a href={`mailto:${atc.email}`} className="inline-flex items-center gap-2 text-sm font-medium text-[#0A4D9B]">
                <Mail className="h-4 w-4" /> Contacter
              </a>
              <Link href={`${cdvBase}/bons?atc=${atc.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-[#0A4D9B]">
                Bons de l'ATC <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}

        {!atcs.length ? (
          <div className="card-lysma p-8">
            <p className="text-sm text-[#6B7280]">Aucun ATC rattache pour le moment.</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
