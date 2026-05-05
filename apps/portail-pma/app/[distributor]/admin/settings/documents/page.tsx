import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import SettingsDocumentsForm from "@/components/admin/settings/SettingsDocumentsForm";

export default async function AdminSettingsDocumentsPage({
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
      badge="Paramètres · Documents"
      title="Documents"
      description="Réglages documentaires, intitulés, blocs de texte et usage des documents métier."
      backHref={`${adminBase}/settings`}
      backLabel="Retour paramètres"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <SettingsDocumentsForm />
      </section>
    </AdminModulePage>
  );
}