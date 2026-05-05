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
const sectionStyle: React.CSSProperties = { borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" };
const sectionTitle: React.CSSProperties = { margin: 0, fontSize: "0.82rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", padding: "1rem 1.25rem", borderBottom: "1px solid rgba(217,227,240,0.8)", background: "rgba(248,251,255,0.95)" };
const row: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.7rem 0", borderBottom: "1px solid rgba(226,232,240,0.5)" };
const rowLabel: React.CSSProperties = { fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" };
const rowValue: React.CSSProperties = { fontSize: "0.875rem", color: "#0f172a", fontWeight: 500 };
const btnLink: React.CSSProperties = { display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, color: "#0a4d9b", border: "1px solid #bfdbfe", background: "rgba(255,255,255,0.8)", textDecoration: "none" };

const statusMap: Record<string, { label: string; bg: string; color: string; border: string }> = {
  en_cours:   { label: "En cours",   bg: "#eef2ff", color: "#4338ca", border: "#c7d2fe" },
  traite:     { label: "Traité",     bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  pris_en_charge: { label: "Pris en charge", bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  a_corriger: { label: "À corriger", bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  refuse:     { label: "Refusé",     bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

export default async function AdminMagasinierDetailPage({
  params,
}: { params: Promise<{ distributor: string; id: string }> }) {
  const { distributor, id } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const staff = await prisma.store_staff.findFirst({
    where: {
      id,
      stores: { distributor_id: currentUser.distributorId },
    },
    include: {
      stores: { select: { id: true, code: true, name: true, city: true } },
      _count: { select: { bons: true, bon_comments: true, bon_status_history: true } },
    },
  });

  if (!staff) notFound();

  const isBlocked = staff.locked_until && staff.locked_until > new Date();

  // Bons pris en charge par ce magasinier
  const bons = await prisma.bons.findMany({
    where: { taken_by_staff_id: id },
    include: { clients: { select: { name: true, code: true } } },
    orderBy: { updated_at: "desc" },
    take: 30,
  });

  // Dernières actions dans l'historique
  const history = await prisma.bon_status_history.findMany({
    where: { changed_by_staff_id: id },
    include: { bons: { select: { bon_number: true, id: true } } },
    orderBy: { created_at: "desc" },
    take: 20,
  });

  const actionLabels: Record<string, string> = {
    "prendre-en-charge":   "Prise en charge",
    "demarrer":            "Démarrage",
    "attente-client":      "Attente client",
    "attente-fournisseur": "Attente fournisseur",
    "corriger":            "Correction",
    "reprendre":           "Reprise",
    "traiter":             "Traitement",
    "refuser":             "Refus",
  };

  return (
    <AdminModulePage
      badge="Magasinier · Fiche"
      title={`${staff.first_name} ${staff.last_name}`.trim()}
      description={`${staff.stores.code} · ${staff.stores.name}`}
      backHref={`${adminBase}/users/magasiniers`}
      backLabel="Retour magasiniers"
    >
      {/* Carte profil */}
      <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", padding: "1.75rem", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 800, color: "#0a4d9b", flexShrink: 0 }}>
              {staff.initials}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>{`${staff.first_name} ${staff.last_name}`.trim()}</h2>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.875rem", color: "#6b7280" }}>{staff.stores.code} · {staff.stores.name}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
            <span style={{ display: "inline-flex", padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: "#eef2ff", color: "#4338ca", border: "1px solid #c7d2fe" }}>
              Magasinier
            </span>
            <span style={{ display: "inline-flex", padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: staff.is_active ? "#f0fdf4" : "#fef2f2", color: staff.is_active ? "#15803d" : "#dc2626", border: staff.is_active ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
              {staff.is_active ? "Actif" : "Inactif"}
            </span>
            {isBlocked && (
              <span style={{ display: "inline-flex", padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
                PIN bloqué
              </span>
            )}
          </div>
        </div>

        <div>
          <div style={row}><span style={rowLabel}>Initiales</span><span style={{ ...rowValue, fontFamily: "monospace", fontWeight: 700 }}>{staff.initials}</span></div>
          <div style={row}><span style={rowLabel}>Magasin</span><Link href={`${adminBase}/stores/${staff.stores.id}`} style={{ ...rowValue, color: "#0a4d9b", textDecoration: "none" }}>{staff.stores.code} · {staff.stores.name} {staff.stores.city ? `· ${staff.stores.city}` : ""}</Link></div>
          <div style={row}><span style={rowLabel}>Bons traités</span><span style={{ ...rowValue, fontWeight: 700, color: "#0a4d9b" }}>{staff._count.bons}</span></div>
          <div style={row}><span style={rowLabel}>Actions historique</span><span style={{ ...rowValue, fontWeight: 700, color: "#0a4d9b" }}>{staff._count.bon_status_history}</span></div>
          <div style={row}><span style={rowLabel}>Commentaires</span><span style={{ ...rowValue, fontWeight: 700, color: "#0a4d9b" }}>{staff._count.bon_comments}</span></div>
          <div style={row}><span style={rowLabel}>PIN mis à jour le</span><span style={rowValue}>{formatDate(staff.pin_updated_at)}</span></div>
          <div style={row}><span style={rowLabel}>Changement PIN requis</span>
            <span style={{ display: "inline-flex", padding: "0.25rem 0.65rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: staff.must_change_pin ? "#fffbeb" : "#f0fdf4", color: staff.must_change_pin ? "#b45309" : "#15803d", border: staff.must_change_pin ? "1px solid #fde68a" : "1px solid #bbf7d0" }}>
              {staff.must_change_pin ? "Oui" : "Non"}
            </span>
          </div>
          {isBlocked && (
            <div style={{ ...row, borderBottom: "none" }}><span style={rowLabel}>Bloqué jusqu'au</span><span style={{ ...rowValue, color: "#dc2626", fontWeight: 700 }}>{formatDate(staff.locked_until)}</span></div>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(226,232,240,0.5)" }}>
          <Link href={`${adminBase}/users/magasiniers/${staff.id}/edit`} style={{ display: "inline-flex", padding: "0.65rem 1.25rem", borderRadius: "0.875rem", background: "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none", boxShadow: "0 6px 16px rgba(30,115,216,0.2)" }}>
            Modifier
          </Link>
          <Link href={`${adminBase}/users/magasiniers`} style={{ display: "inline-flex", padding: "0.65rem 1.25rem", borderRadius: "0.875rem", background: "rgba(255,255,255,0.8)", color: "#475569", border: "1px solid #e2e8f0", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}>
            Retour liste
          </Link>
        </div>
      </section>

      {/* Bons pris en charge */}
      <div style={sectionStyle}>
        <p style={sectionTitle}>Bons pris en charge ({bons.length})</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
            <thead><tr><th style={th}>Numéro</th><th style={th}>Client</th><th style={th}>Statut</th><th style={th}>Mis à jour</th><th style={{ ...th, textAlign: "right" }}>Fiche</th></tr></thead>
            <tbody>
              {bons.length > 0
                ? bons.map((b) => {
                    const s = statusMap[b.status] ?? { label: b.status, bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" };
                    return (
                      <tr key={b.id}>
                        <td style={{ ...td, fontWeight: 700 }}>{b.bon_number}</td>
                        <td style={tdM}>{b.clients?.name ?? "—"}</td>
                        <td style={td}><span style={{ display: "inline-flex", padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{s.label}</span></td>
                        <td style={tdM}>{formatDate(b.updated_at)}</td>
                        <td style={{ ...td, textAlign: "right" }}><Link href={`${adminBase}/bons/${b.id}`} style={btnLink}>Voir</Link></td>
                      </tr>
                    );
                  })
                : <tr><td colSpan={5} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2rem" }}>Aucun bon pris en charge.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Historique des actions */}
      <div style={sectionStyle}>
        <p style={sectionTitle}>Dernières actions ({history.length})</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "520px" }}>
            <thead><tr><th style={th}>Bon</th><th style={th}>Action</th><th style={th}>Date</th></tr></thead>
            <tbody>
              {history.length > 0
                ? history.map((h) => (
                    <tr key={h.id}>
                      <td style={td}>
                        <Link href={`${adminBase}/bons/${h.bon_id}`} style={{ ...btnLink, fontSize: "0.82rem" }}>{h.bons.bon_number}</Link>
                      </td>
                      <td style={{ ...td, fontWeight: 600 }}>{actionLabels[h.action_key ?? ""] ?? h.action_key ?? "—"}</td>
                      <td style={tdM}>{formatDate(h.created_at)}</td>
                    </tr>
                  ))
                : <tr><td colSpan={3} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2rem" }}>Aucune action enregistrée.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </AdminModulePage>
  );
}