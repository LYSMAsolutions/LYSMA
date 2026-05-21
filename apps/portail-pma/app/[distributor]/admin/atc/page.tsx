import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";

export default async function AdminAtcPage({
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

  const atcs = await prisma.users.findMany({
    where: {
      distributor_id: currentUser.distributorId,
      roles: {
        code: "atc",
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

  const totalAtc = atcs.length;
  const activeAtc = atcs.filter((item: any) => item.is_active).length;
  const inactiveAtc = atcs.filter((item: any) => !item.is_active).length;
  const totalClients = atcs.reduce((sum, item) => sum + item._count.clients, 0);
  const totalBons = atcs.reduce((sum, item) => sum + item._count.bons, 0);

  return (
    <AdminModulePage
      badge="ATC · Admin"
      title="Gestion des ATC"
      description="Pilotage de l’équipe ATC, de leur portefeuille clients, de leur activité bons et de leur couverture terrain."
      backHref={adminBase}
      kpis={[
        {
          title: "ATC",
          value: totalAtc,
          href: `${adminBase}/atc/equipe`,
          note: "effectif ATC",
          tone: "blue",
        },
        {
          title: "Actifs",
          value: activeAtc,
          href: `${adminBase}/atc/equipe?status=active`,
          note: "ATC actifs",
          tone: "green",
        },
        {
          title: "Inactifs",
          value: inactiveAtc,
          href: `${adminBase}/atc/equipe?status=inactive`,
          note: "ATC inactifs",
          tone: "red",
        },
        {
          title: "Clients",
          value: totalClients,
          href: `${adminBase}/atc/clients`,
          note: "clients assignés",
          tone: "neutral",
        },
        {
          title: "Bons",
          value: totalBons,
          href: `${adminBase}/atc/bons`,
          note: "bons créés",
          tone: "yellow",
        },
      ]}
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <h2 className="section-title">Lecture métier</h2>
        <p className="section-copy" style={{ marginTop: ".75rem" }}>
          Ce module sert à lire l’équipe ATC sous l’angle opérationnel :
          portefeuille clients, volume de bons créés, couverture magasins et détail par profil.
        </p>
      </section>
    </AdminModulePage>
  );
}