import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import BonHeader from "@/components/admin/bons/BonHeader";

export default async function AdminBonDetailRootPage({
  params,
}: {
  params: Promise<{ distributor: string; id: string }>;
}) {
  const { distributor, id } = await params;

  const currentUser = await requireAccess({
    allowedRoles: ["admin"],
    distributorSlug: distributor,
  });

  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const bon = await prisma.bons.findFirst({
    where: {
      id,
      distributor_id: currentUser.distributorId,
    },
    include: {
      clients: true,
      stores: true,
      users: true,
      store_staff: true,
    },
  });

  if (!bon) {
    notFound();
  }

  return (
    <AdminModulePage
      badge="Bon · Vue rapide"
      title={`Bon ${bon.bon_number}`}
      description="Vue rapide du bon et accès aux sous-sections."
      backHref={`${adminBase}/bons`}
      backLabel="Retour bons"
    >
      <BonHeader distributor={currentUser.distributorSlug} bon={bon} />
    </AdminModulePage>
  );
}