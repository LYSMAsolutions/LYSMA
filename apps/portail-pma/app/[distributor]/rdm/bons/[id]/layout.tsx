import { requireAccess } from "@/lib/require-access";
import { getScopedBonOrNotFound } from "@/lib/role-bon-access";
import { RoleBonLayoutFrame } from "@/components/role-dashboard/RoleBonLayoutFrame";

export default async function RdmBonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ distributor: string; id: string }>;
}) {
  const { distributor, id } = await params;
  const user = await requireAccess({ allowedRoles: ["rdm"], distributorSlug: distributor });
  const bon = await getScopedBonOrNotFound({ user, bonId: id, role: "rdm" });

  return (
    <RoleBonLayoutFrame distributor={user.distributorSlug} section="rdm" bonNumber={bon.bon_number} bonId={bon.id} label="RDM - Bon">
      {children}
    </RoleBonLayoutFrame>
  );
}
