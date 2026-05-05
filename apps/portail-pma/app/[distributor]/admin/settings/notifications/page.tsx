import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import SettingsNotificationsForm from "@/components/admin/settings/SettingsNotificationsForm";

export default async function AdminSettingsNotificationsPage({
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
      badge="Paramètres · Notifications"
      title="Notifications"
      description="Emails automatiques, déclencheurs, destinataires et logique d’envoi."
      backHref={`${adminBase}/settings`}
      backLabel="Retour paramètres"
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <SettingsNotificationsForm />
      </section>
    </AdminModulePage>
  );
}