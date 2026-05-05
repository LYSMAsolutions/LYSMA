import AdminShell from "@/components/admin/layout/AdminShell";
import { requireAccess } from "@/lib/require-access";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;

  const user = await requireAccess({
    allowedRoles: ["admin"],
    distributorSlug: distributor,
  });

  // Charger les blocs métier actifs pour ce distributeur
  const activeTools = await prisma.distributor_tools.findMany({
    where: { distributor_id: user.distributorId, is_enabled: true },
    include: { tools: { select: { code: true } } },
  });

  const activeCodes = activeTools.map((t) => t.tools.code);

  return (
    <AdminShell
      firstName={user.firstName}
      lastName={user.lastName}
      email={user.email}
      activeCodes={activeCodes}
    >
      {children}
    </AdminShell>
  );
}