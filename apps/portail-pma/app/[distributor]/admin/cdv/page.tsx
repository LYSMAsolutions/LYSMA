import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";

export default async function AdminCdvPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;

  const currentUser = await requireAccess({
    allowedRoles: ["admin"],
    distributorSlug: distributor,
  });

  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const cdvs = await prisma.users.findMany({
    where: {
      distributor_id: currentUser.distributorId,
      roles: {
        code: "cdv",
      },
    },
    include: {
      _count: {
        select: {
          clients: true,
          bons: true,
          user_store_links: true,
        },
      },
    },
    orderBy: [
      { first_name: "asc" },
      { last_name: "asc" },
    ],
  });

  const totalCdv = cdvs.length;
  const activeCdv = cdvs.filter((item) => item.is_active).length;
  const inactiveCdv = cdvs.filter((item) => !item.is_active).length;
  const totalClients = cdvs.reduce((sum, item) => sum + item._count.clients, 0);
  const totalBons = cdvs.reduce((sum, item) => sum + item._count.bons, 0);

  return (
    <AdminModulePage
      badge="CDV · Admin"
      title="Pilotage des CDV"
      description="Vision des chefs des ventes, de leur périmètre, de leur activité et de leur portefeuille."
      backHref={currentUser.distributorSlug ? `/${currentUser.distributorSlug}/admin` : "/"}
      kpis={[
        {
          title: "CDV",
          value: totalCdv,
          href: `${adminBase}/cdv/equipe`,
          note: "effectif CDV",
          tone: "blue",
        },
        {
          title: "Actifs",
          value: activeCdv,
          href: `${adminBase}/cdv/equipe?status=active`,
          note: "CDV actifs",
          tone: "green",
        },
        {
          title: "Inactifs",
          value: inactiveCdv,
          href: `${adminBase}/cdv/equipe?status=inactive`,
          note: "CDV inactifs",
          tone: "red",
        },
        {
          title: "Clients",
          value: totalClients,
          href: `${adminBase}/cdv/portefeuille`,
          note: "clients visibles",
          tone: "neutral",
        },
        {
          title: "Bons",
          value: totalBons,
          href: `${adminBase}/cdv/activite`,
          note: "bons créés",
          tone: "yellow",
        },
      ]}
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <h2 className="section-title">Lecture métier</h2>
        <p className="section-copy" style={{ marginTop: ".75rem" }}>
          Ce module sert à lire les chefs des ventes sous l’angle pilotage :
          équipe, secteurs, portefeuille, activité et objectifs.
        </p>
      </section>
    </AdminModulePage>
  );
}