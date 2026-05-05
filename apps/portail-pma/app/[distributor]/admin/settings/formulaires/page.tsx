import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import SettingsFormulairesForm from "@/components/admin/settings/SettingsFormulairesForm";

export default async function AdminSettingsFormulairesPage({
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
      badge="Paramètres · Formulaires"
      title="Formulaires"
      description="Choix des formulaires actifs et des blocs affichés dans l’outil."
      backHref={`${adminBase}/settings`}
      backLabel="Retour paramètres"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <SettingsFormulairesForm />
      </section>
    </AdminModulePage>
  );
}