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
const sectionWrap: React.CSSProperties = { borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" };
const sectionHead: React.CSSProperties = { margin: 0, fontSize: "0.82rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", padding: "1rem 1.25rem", borderBottom: "1px solid rgba(217,227,240,0.8)", background: "rgba(248,251,255,0.95)", display: "flex", justifyContent: "space-between", alignItems: "center" };
const rowStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.7rem 0", borderBottom: "1px solid rgba(226,232,240,0.5)" };
const rowLbl: React.CSSProperties = { fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" };
const rowVal: React.CSSProperties = { fontSize: "0.875rem", color: "#0f172a", fontWeight: 500 };
const btnLink: React.CSSProperties = { display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, color: "#0a4d9b", border: "1px solid #bfdbfe", background: "rgba(255,255,255,0.8)", textDecoration: "none" };

const statusMap: Record<string, { label: string; bg: string; color: string; border: string }> = {
  en_cours:       { label: "En cours",       bg: "#eef2ff", color: "#4338ca", border: "#c7d2fe" },
  pris_en_charge: { label: "Pris en charge", bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  traite:         { label: "Traité",         bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  a_corriger:     { label: "À corriger",     bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  refuse:         { label: "Refusé",         bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  envoye:         { label: "Envoyé",         bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
};

export default async function AdminClientDetailPage({
  params,
}: { params: Promise<{ distributor: string; id: string }> }) {
  const { distributor, id } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const client = await prisma.clients.findFirst({
    where: { id, distributor_id: currentUser.distributorId },
  });
  if (!client) notFound();

  const [store, atc, recentBons] = await Promise.all([
    client.store_id
      ? prisma.stores.findUnique({ where: { id: client.store_id }, select: { id: true, code: true, name: true } })
      : null,
    client.assigned_user_id
      ? prisma.users.findUnique({ where: { id: client.assigned_user_id }, select: { id: true, first_name: true, last_name: true, email: true } })
      : null,
    prisma.bons.findMany({
      where: { client_id: id },
      orderBy: { updated_at: "desc" },
      take: 10,
    }),
  ]);

  return (
    <AdminModulePage
      badge="Client · Fiche"
      title={client.name}
      description={[client.address_line_1, client.postal_code, client.city].filter(Boolean).join(" · ") || "Fiche complète du client"}
      backHref={`${adminBase}/clients`}
      backLabel="Retour clients"
    >
      {/* Infos */}
      <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", padding: "1.75rem", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>🏢</div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>{client.name}</h2>
              {client.code && <p style={{ margin: "0.2rem 0 0", fontSize: "0.875rem", color: "#6b7280", fontFamily: "monospace" }}>{client.code}</p>}
            </div>
          </div>
          <span style={{ display: "inline-flex", padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: client.is_active ? "#f0fdf4" : "#fef2f2", color: client.is_active ? "#15803d" : "#dc2626", border: client.is_active ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
            {client.is_active ? "Actif" : "Inactif"}
          </span>
        </div>

        <div>
          <div style={rowStyle}><span style={rowLbl}>Adresse</span><span style={rowVal}>{[client.address_line_1, client.address_line_2].filter(Boolean).join(", ") || "—"}</span></div>
          <div style={rowStyle}><span style={rowLbl}>CP · Ville</span><span style={rowVal}>{[client.postal_code, client.city].filter(Boolean).join(" ") || "—"}</span></div>
          <div style={rowStyle}><span style={rowLbl}>Email</span><span style={rowVal}>{client.email || "—"}</span></div>
          <div style={rowStyle}><span style={rowLbl}>Téléphone</span><span style={rowVal}>{client.phone || "—"}</span></div>
          <div style={rowStyle}><span style={rowLbl}>Magasin</span>
            {store
              ? <Link href={`${adminBase}/stores/${store.id}`} style={{ color: "#0a4d9b", textDecoration: "none", fontWeight: 600 }}>{store.code} · {store.name}</Link>
              : <span style={{ color: "#94a3b8" }}>Non rattaché</span>}
          </div>
          <div style={{ ...rowStyle, borderBottom: "none" }}><span style={rowLbl}>ATC assigné</span>
            {atc
              ? <Link href={`${adminBase}/users/${atc.id}`} style={{ color: "#0a4d9b", textDecoration: "none", fontWeight: 600 }}>{`${atc.first_name} ${atc.last_name}`.trim()}</Link>
              : <span style={{ color: "#94a3b8" }}>Non assigné</span>}
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(226,232,240,0.5)", flexWrap: "wrap" }}>
          <Link href={`${adminBase}/clients/${client.id}/edit`} style={{ display: "inline-flex", padding: "0.65rem 1.25rem", borderRadius: "0.875rem", background: "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none", boxShadow: "0 6px 16px rgba(30,115,216,0.2)" }}>
            Modifier
          </Link>
          <Link href={`${adminBase}/clients/${client.id}/bons`} style={{ display: "inline-flex", padding: "0.65rem 1.25rem", borderRadius: "0.875rem", background: "rgba(238,242,255,0.9)", color: "#4338ca", border: "1px solid #c7d2fe", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}>
            Tous les bons
          </Link>
        </div>
      </section>

      {/* Bons récents */}
      <div style={sectionWrap}>
        <p style={{ ...sectionHead, display: "block" }}>Bons récents ({recentBons.length})</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
            <thead><tr><th style={th}>Numéro</th><th style={th}>Type</th><th style={th}>Statut</th><th style={th}>Mis à jour</th><th style={{ ...th, textAlign: "right" }}>Fiche</th></tr></thead>
            <tbody>
              {recentBons.length > 0
                ? recentBons.map((b) => {
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
                  })
                : <tr><td colSpan={5} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2rem" }}>Aucun bon pour ce client.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </AdminModulePage>
  );
}