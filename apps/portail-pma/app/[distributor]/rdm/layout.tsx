import RoleShell from "@/components/role-layout/RoleShell";
import { requireAccess } from "@/lib/require-access";

export default async function RdmLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["rdm"], distributorSlug: distributor });

  return (
    <RoleShell
      distributorSlug={user.distributorSlug}
      role="rdm"
      roleLabel="Espace responsable magasin"
      firstName={user.firstName}
      lastName={user.lastName}
      email={user.email}
    >
      {children}
    </RoleShell>
  );
}
