import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import SettingsWorkflowForm from "@/components/admin/settings/SettingsWorkflowForm";

export default async function AdminSettingsWorkflowPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const user = await requireAccess({
    allowedRoles: ["admin"],
    distributorSlug: distributor,
  });

  const adminBase = `/${user.distributorSlug}/admin`;

  return (
    <AdminModulePage
      badge="Paramètres · Workflow"
      title="Workflow"
      description="Paramètre les statuts et le comportement de traitement des bons."
      backHref={`${adminBase}/settings`}
      backLabel="Retour paramètres"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <SettingsWorkflowForm />
      </section>
    </AdminModulePage>
  );
}