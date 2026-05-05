import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import BonHeader from "@/components/admin/bons/BonHeader";

function formatDate(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(value);
}

const severityMap: Record<string, { label: string; bg: string; color: string; border: string }> = {
  low:      { label: "Faible",    bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  medium:   { label: "Moyen",     bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  high:     { label: "Élevé",     bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  critical: { label: "Critique",  bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

const statusMap: Record<string, { label: string; bg: string; color: string; border: string }> = {
  open:        { label: "Ouverte",     bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  in_progress: { label: "En cours",   bg: "#eef2ff", color: "#4338ca", border: "#c7d2fe" },
  resolved:    { label: "Résolue",    bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  ignored:     { label: "Ignorée",    bg: "#f8fafc", color: "#94a3b8", border: "#e2e8f0" },
};

function Badge({ map, value }: { map: Record<string, { label: string; bg: string; color: string; border: string }>; value: string }) {
  const s = map[value] ?? { label: value, bg: "#f8fafc", color: "#94a3b8", border: "#e2e8f0" };
  return (
    <span style={{ display: "inline-flex", padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}

const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };
const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };

export default async function AdminBonAnomaliesPage({
  params,
}: { params: Promise<{ distributor: string; id: string }> }) {
  const { distributor, id } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const bon = await prisma.bons.findFirst({
    where: { id, distributor_id: currentUser.distributorId },
    include: { clients: true, stores: true, users: true, store_staff: true },
  });
  if (!bon) notFound();

  const anomalies = await prisma.bon_anomalies.findMany({
    where: { bon_id: bon.id },
    include: { anomaly_types: true, users: true, store_staff: true },
    orderBy: { created_at: "desc" },
  });

  const open = anomalies.filter((a) => a.status === "open").length;
  const inProgress = anomalies.filter((a) => a.status === "in_progress").length;

  return (
    <AdminModulePage
      badge="Bon · Anomalies"
      title={`Anomalies · ${bon.bon_number}`}
      description={`${anomalies.length} anomalie${anomalies.length > 1 ? "s" : ""}${open > 0 ? ` · ${open} ouverte${open > 1 ? "s" : ""}` : ""}${inProgress > 0 ? ` · ${inProgress} en cours` : ""}`}
      backHref={`${adminBase}/bons/${bon.id}`}
      backLabel="Retour bon"
    >
      <BonHeader distributor={currentUser.distributorSlug} bon={bon} />

      {anomalies.length === 0 ? (
        <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", padding: "3rem", textAlign: "center", color: "#94a3b8", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>✅ Aucune anomalie détectée sur ce bon.</p>
        </section>
      ) : (
        <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "680px" }}>
              <thead>
                <tr>
                  <th style={th}>Type</th>
                  <th style={th}>Sévérité</th>
                  <th style={th}>Statut</th>
                  <th style={th}>Description</th>
                  <th style={th}>Détecté par</th>
                  <th style={th}>Résolution</th>
                  <th style={th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {anomalies.map((item) => {
                  const actor = item.users
                    ? `${item.users.first_name} ${item.users.last_name}`.trim()
                    : item.store_staff
                      ? `${item.store_staff.first_name} ${item.store_staff.last_name}`.trim()
                      : "—";
                  return (
                    <tr key={item.id}>
                      <td style={{ ...td, fontWeight: 600 }}>{item.anomaly_types?.label ?? "—"}</td>
                      <td style={td}><Badge map={severityMap} value={item.severity} /></td>
                      <td style={td}><Badge map={statusMap} value={item.status} /></td>
                      <td style={{ ...tdM, maxWidth: "220px" }}>{item.description || "—"}</td>
                      <td style={tdM}>{actor}</td>
                      <td style={{ ...tdM, maxWidth: "200px" }}>{item.resolution_note || "—"}</td>
                      <td style={tdM}>{formatDate(item.detected_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </AdminModulePage>
  );
}