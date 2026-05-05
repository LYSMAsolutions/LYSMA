import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import SettingsJuridiqueForm from "@/components/admin/settings/SettingsJuridiqueForm";

export default async function AdminSettingsJuridiquePage({
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
      badge="Paramètres · Juridique"
      title="Juridique"
      description="Documents juridiques, mentions légales, CGU, CGV et politique de conformité."
      backHref={`${adminBase}/settings`}
      backLabel="Retour paramètres"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <SettingsJuridiqueForm />
      </section>
    </AdminModulePage>
  );
}