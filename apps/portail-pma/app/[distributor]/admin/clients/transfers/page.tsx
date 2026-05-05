import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import TransfersClient from "@/components/admin/clients/TransfersClient";

export default async function AdminTransfersPage({
  params,
}: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const user = await requireAccess({
    allowedRoles: ["admin", "rdm", "cdv"],
    distributorSlug: distributor,
  });
  const adminBase = `/${user.distributorSlug}/admin`;

  const [requests, atcs] = await Promise.all([
    prisma.client_transfer_requests.findMany({
      where: { distributor_id: user.distributorId },
      include: {
        clients:      { select: { id: true, name: true, code: true } },
        requested_by: { select: { id: true, first_name: true, last_name: true, roles: { select: { code: true, label: true } } } },
        current_user: { select: { id: true, first_name: true, last_name: true } },
        target_user:  { select: { id: true, first_name: true, last_name: true } },
        reviewed_by:  { select: { id: true, first_name: true, last_name: true } },
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.users.findMany({
      where: {
        distributor_id: user.distributorId,
        is_active: true,
        roles: { code: { in: ["atc", "cdv"] } },
      },
      select: { id: true, first_name: true, last_name: true, roles: { select: { code: true } } },
      orderBy: { last_name: "asc" },
    }),
  ]);

  const pending  = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "approved").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;

  return (
    <AdminModulePage
      badge="Clients · Transferts"
      title="Demandes de transfert"
      description="Gestion des demandes de changement de portefeuille client entre ATC et CDV."
      backHref={`${adminBase}/clients`}
      backLabel="Retour clients"
      kpis={[
        { title: "En attente", value: pending,  note: "à traiter",  tone: "yellow" },
        { title: "Approuvées", value: approved, note: "transferts", tone: "green"  },
        { title: "Refusées",   value: rejected, note: "demandes",   tone: "neutral"},
      ]}
    >
      <TransfersClient
        initialRequests={JSON.parse(JSON.stringify(requests))}
        currentUserId={user.id}
        currentUserRole={user.roleCode}
      />
    </AdminModulePage>
  );
}