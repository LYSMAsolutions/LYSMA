import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";

function formatDate(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(value);
}

const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };
const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };
const btnLink: React.CSSProperties = { display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, color: "#0a4d9b", border: "1px solid #bfdbfe", background: "rgba(255,255,255,0.8)", textDecoration: "none" };

const statusMap: Record<string, { label: string; bg: string; color: string; border: string }> = {
  en_cours:       { label: "En cours",       bg: "#eef2ff", color: "#4338ca", border: "#c7d2fe" },
  pris_en_charge: { label: "Pris en charge", bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  traite:         { label: "Traité",         bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  a_corriger:     { label: "À corriger",     bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  refuse:         { label: "Refusé",         bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  envoye:         { label: "Envoyé",         bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
};

export default async function AdminClientHistoriquePage({
  params,
}: { params: Promise<{ distributor: string; id: string }> }) {
  const { distributor, id } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const [client, bons] = await Promise.all([
    prisma.clients.findFirst({ where: { id, distributor_id: currentUser.distributorId } }),
    prisma.bons.findMany({ where: { client_id: id, distributor_id: currentUser.distributorId }, orderBy: { updated_at: "desc" }, take: 100 }),
  ]);
  if (!client) notFound();

  return (
    <AdminModulePage
      badge="Client · Historique"
      title={`Historique · ${client.name}`}
      description="Activité du client triée par dernière mise à jour."
      backHref={`${adminBase}/clients/${client.id}`}
      backLabel="Retour fiche client"
    >
      <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
            <thead><tr><th style={th}>Bon</th><th style={th}>Type</th><th style={th}>Statut</th><th style={th}>Dernière MAJ</th><th style={{ ...th, textAlign: "right" }}>Fiche</th></tr></thead>
            <tbody>
              {bons.map((b) => {
                const s = statusMap[b.status] ?? { label: b.status, bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" };
                return (
                  <tr key={b.id}>
                    <td style={{ ...td, fontWeight: 700 }}>{b.bon_number}</td>
                    <td style={tdM}>{b.bon_type || "—"}</td>
                    <td style={td}><span style={{ display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{s.label}</span></td>
                    <td style={tdM}>{formatDate(b.updated_at)}</td>
                    <td style={{ ...td, textAlign: "right" }}><Link href={`${adminBase}/bons/${b.id}`} style={btnLink}>Voir</Link></td>
                  </tr>
                );
              })}
              {!bons.length && <tr><td colSpan={5} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2.5rem" }}>Aucun historique disponible.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </AdminModulePage>
  );
}