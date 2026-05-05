import { requireAccess } from "@/lib/require-access";
import { prisma } from "@/lib/prisma";
import AtcShell from "@/components/atc/layout/AtcShell";
import "@/styles/atc-lysma.css";
import "@/styles/atc-responsive.css";

export default async function AtcLayout({ children, params }: { children: React.ReactNode; params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["atc"], distributorSlug: distributor });

  const activeTools = await prisma.distributor_tools.findMany({
    where: { distributor_id: user.distributorId, is_enabled: true },
    include: { tools: { select: { code: true } } },
  });

  const activeCodes = activeTools.map((t) => t.tools.code);

  return (
    <AtcShell
      distributorSlug={user.distributorSlug}
      activeCodes={activeCodes}
      user={{
        firstName: user.firstName ?? null,
        lastName:  user.lastName  ?? null,
        email:     user.email,
        roleCode:  user.roleCode,
      }}>
      {children}
    </AtcShell>
  );
}