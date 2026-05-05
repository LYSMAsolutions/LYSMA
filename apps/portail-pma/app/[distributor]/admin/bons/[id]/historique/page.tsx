import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import BonHeader from "@/components/admin/bons/BonHeader";

function formatDate(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(value);
}

const actionLabels: Record<string, string> = {
  "prendre-en-charge":   "Prise en charge",
  "demarrer":            "Démarrage",
  "attente-client":      "Mise en attente client",
  "attente-fournisseur": "Mise en attente fournisseur",
  "corriger":            "Demande de correction",
  "reprendre":           "Reprise",
  "traiter":             "Traitement",
  "refuser":             "Refus",
};

const statusMap: Record<string, { label: string; bg: string; color: string; border: string }> = {
  frigo:               { label: "Brouillon",          bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" },
  envoye:              { label: "Envoyé",              bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  non_pris_en_charge:  { label: "Non pris en charge",  bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  pris_en_charge:      { label: "Pris en charge",      bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  en_cours:            { label: "En cours",            bg: "#eef2ff", color: "#4338ca", border: "#c7d2fe" },
  attente_fournisseur: { label: "Attente fournisseur", bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  attente_client:      { label: "Attente client",      bg: "#fefce8", color: "#a16207", border: "#fef08a" },
  traite:              { label: "Traité",              bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  refuse:              { label: "Refusé",              bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  a_corriger:          { label: "À corriger",          bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
};

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span style={{ color: "#94a3b8" }}>—</span>;
  const s = statusMap[status] ?? { label: status, bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" };
  return (
    <span style={{ display: "inline-flex", padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}

const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };
const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };

export default async function AdminBonHistoryPage({
  params,
}: {
  params: Promise<{ distributor: string; id: string }>;
}) {
  const { distributor, id } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const bon = await prisma.bons.findFirst({
    where: { id, distributor_id: currentUser.distributorId },
    include: { clients: true, stores: true, users: true, store_staff: true },
  });

  if (!bon) notFound();

  const history = await prisma.bon_status_history.findMany({
    where: { bon_id: bon.id },
    include: { users: true, store_staff: true },
    orderBy: { created_at: "desc" },
  });

  return (
    <AdminModulePage
      badge="Bon · Historique"
      title={`Historique · ${bon.bon_number}`}
      description="Chronologie des changements de statut du bon."
      backHref={`${adminBase}/bons/${bon.id}`}
      backLabel="Retour bon"
    >
      <BonHeader distributor={currentUser.distributorSlug} bon={bon} />

      <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "640px" }}>
            <thead>
              <tr>
                <th style={th}>Action</th>
                <th style={th}>Ancien statut</th>
                <th style={th}>Nouveau statut</th>
                <th style={th}>Auteur</th>
                <th style={th}>Motif</th>
                <th style={th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => {
                const actor = item.users
                  ? `${item.users.first_name} ${item.users.last_name}`.trim()
                  : item.store_staff
                    ? `${item.store_staff.first_name} ${item.store_staff.last_name}`.trim()
                    : "—";
                return (
                  <tr key={item.id}>
                    <td style={{ ...td, fontWeight: 600 }}>
                      {item.action_key ? (actionLabels[item.action_key] ?? item.action_key) : "—"}
                    </td>
                    <td style={td}><StatusBadge status={item.old_status} /></td>
                    <td style={td}><StatusBadge status={item.new_status} /></td>
                    <td style={tdM}>{actor}</td>
                    <td style={{ ...tdM, maxWidth: "200px" }}>{item.reason || "—"}</td>
                    <td style={tdM}>{formatDate(item.created_at)}</td>
                  </tr>
                );
              })}
              {!history.length && (
                <tr><td colSpan={6} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2.5rem" }}>Aucun historique trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminModulePage>
  );
}