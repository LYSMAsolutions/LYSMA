import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import SettingsPdfForm from "@/components/admin/settings/SettingsPdfForm";

export default async function AdminSettingsPdfPage({
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
      badge="Paramètres · PDF"
      title="Paramètres PDF"
      description="Choix du template, entête, pied de page, logo, affichage et rendu des PDF."
      backHref={`${adminBase}/settings`}
      backLabel="Retour paramètres"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <SettingsPdfForm />
      </section>
    </AdminModulePage>
  );
}