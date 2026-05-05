import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import { ImportClientForm } from "./import-client-form";
import { importClientsCsvAction, deleteLastTestImportAction } from "./actions";

export default async function AdminClientsImportsPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const boundImport = importClientsCsvAction.bind(null, distributor);
  const boundDelete = deleteLastTestImportAction.bind(null, distributor);

  return (
    <AdminModulePage
      badge="Clients · Import"
      title="Import de clients"
      description="Importez votre base clients via fichier CSV"
      backHref={`${adminBase}/clients`}
      backLabel="Retour clients"
    >
      <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", padding: "2rem", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
        <ImportClientForm action={boundImport} deleteAction={boundDelete} />
      </section>
    </AdminModulePage>
  );
}