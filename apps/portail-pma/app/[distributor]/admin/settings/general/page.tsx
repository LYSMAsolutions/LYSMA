import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import SettingsGeneralForm from "@/components/admin/settings/SettingsGeneralForm";

export default async function AdminSettingsGeneralPage({
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
      badge="Paramètres · Général"
      title="Configuration générale"
      description="Informations générales du distributeur et paramètres d’identité de base."
      backHref={`${adminBase}/settings`}
      backLabel="Retour paramètres"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <SettingsGeneralForm />
      </section>
    </AdminModulePage>
  );
}