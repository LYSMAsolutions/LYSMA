import RoleShell from "@/components/role-layout/RoleShell";
import { requireAccess } from "@/lib/require-access";
import { prisma } from "@/lib/prisma";

export default async function CdvLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["cdv"], distributorSlug: distributor });

  const activeTools = await prisma.distributor_tools.findMany({
    where: { distributor_id: user.distributorId, is_enabled: true },
    include: { tools: { select: { code: true } } },
  });

  return (
    <RoleShell
      distributorSlug={user.distributorSlug}
      role="cdv"
      roleLabel="Espace chef des ventes"
      firstName={user.firstName}
      lastName={user.lastName}
      email={user.email}
      activeCodes={activeTools.map((tool) => tool.tools.code)}
    >
      {children}
    </RoleShell>
  );
}
