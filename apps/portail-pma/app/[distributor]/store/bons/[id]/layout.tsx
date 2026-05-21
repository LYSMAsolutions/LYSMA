import { requireAccess } from "@/lib/require-access";
import { getScopedBonOrNotFound } from "@/lib/role-bon-access";
import { RoleBonLayoutFrame } from "@/components/role-dashboard/RoleBonLayoutFrame";

export default async function StoreBonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ distributor: string; id: string }>;
}) {
  const { distributor, id } = await params;
  const user = await requireAccess({ allowedRoles: ["store", "store_staff"], distributorSlug: distributor });
  const bon = await getScopedBonOrNotFound({ user, bonId: id, role: "store" });

  return (
    <RoleBonLayoutFrame distributor={user.distributorSlug} section="store" bonNumber={bon.bon_number} bonId={bon.id} label="Store - Bon">
      {children}
    </RoleBonLayoutFrame>
  );
}
