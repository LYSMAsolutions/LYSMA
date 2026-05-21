import { requireAccess } from "@/lib/require-access";
import { getScopedBonOrNotFound } from "@/lib/role-bon-access";
import { RoleBonLayoutFrame } from "@/components/role-dashboard/RoleBonLayoutFrame";

export default async function CdvBonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ distributor: string; id: string }>;
}) {
  const { distributor, id } = await params;
  const user = await requireAccess({ allowedRoles: ["cdv"], distributorSlug: distributor });
  const bon = await getScopedBonOrNotFound({ user, bonId: id, role: "cdv" });

  return (
    <RoleBonLayoutFrame distributor={user.distributorSlug} section="cdv" bonNumber={bon.bon_number} bonId={bon.id} label="CDV - Bon">
      {children}
    </RoleBonLayoutFrame>
  );
}
