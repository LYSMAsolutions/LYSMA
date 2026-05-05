import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import SettingsBrandingForm from "@/components/admin/settings/SettingsBrandingForm";

export default async function AdminSettingsBrandingPage({
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
      badge="Paramètres · Branding"
      title="Branding"
      description="Logo, nom d’affichage, couleurs principales et identité visuelle du distributeur."
      backHref={`${adminBase}/settings`}
      backLabel="Retour paramètres"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <SettingsBrandingForm />
      </section>
    </AdminModulePage>
  );
}