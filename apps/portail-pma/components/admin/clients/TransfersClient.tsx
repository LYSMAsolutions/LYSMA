"use client";

import { useState } from "react";

const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };
const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };

type UserRef = { id: string; first_name: string; last_name: string; roles?: { code: string; label: string } };
type ClientRef = { id: string; name: string; code: string | null };

type Transfer = {
  id: string;
  status: string;
  note: string | null;
  created_at: string;
  reviewed_at: string | null;
  clients:      ClientRef;
  requested_by: UserRef;
  current_user: UserRef | null;
  target_user:  UserRef;
  reviewed_by:  UserRef | null;
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string; border: string }> = {
    pending:  { label: "En attente", bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
    approved: { label: "Approuvée",  bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
    rejected: { label: "Refusée",    bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  };
  const s = map[status] ?? { label: status, bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" };
  return <span style={{ display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>{s.label}</span>;
}

function userName(u: UserRef | null) {
  if (!u) return "—";
  return `${u.first_name} ${u.last_name}`.trim();
}

function formatDate(val: string | null) {
  if (!val) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(new Date(val));
}

export default function TransfersClient({
  initialRequests, currentUserId, currentUserRole,
}: {
  initialRequests: Transfer[];
  currentUserId: string;
  currentUserRole: string;
}) {
  const [requests,    setRequests]    = useState<Transfer[]>(initialRequests);
  const [statusFilter,setStatusFilter]= useState("pending");
  const [loading,     setLoading]     = useState<string | null>(null);
  const [error,       setError]       = useState("");

  const canReview = ["admin", "rdm", "cdv"].includes(currentUserRole);

  const filtered = requests.filter((r) =>
    statusFilter === "all" ? true : r.status === statusFilter
  );

  async function handleAction(id: string, action: "approve" | "reject") {
    setLoading(id); setError("");
    try {
      const res = await fetch(`/api/admin/clients/transfers/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur."); return; }
      setRequests((prev) => prev.map((r) => r.id === id
        ? { ...r, status: action === "approve" ? "approved" : "rejected" }
        : r
      ));
    } catch { setError("Erreur réseau."); }
    finally { setLoading(null); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Filtre statut */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {[
          { value: "pending",  label: "En attente" },
          { value: "approved", label: "Approuvées" },
          { value: "rejected", label: "Refusées"   },
          { value: "all",      label: "Toutes"      },
        ].map((f) => (
          <button key={f.value} type="button" onClick={() => setStatusFilter(f.value)} style={{ padding: "0.45rem 1rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", border: "1px solid", borderColor: statusFilter === f.value ? "#bfdbfe" : "#e2e8f0", background: statusFilter === f.value ? "#eff6ff" : "#f8fafc", color: statusFilter === f.value ? "#0a4d9b" : "#64748b" }}>
            {f.label} {f.value !== "all" && `(${requests.filter((r) => r.status === f.value).length})`}
          </button>
        ))}
      </div>

      {error && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{error}</div>}

      <div style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Client</th>
              <th style={th}>Demandé par</th>
              <th style={th}>ATC actuel</th>
              <th style={th}>ATC cible</th>
              <th style={th}>Note</th>
              <th style={th}>Date</th>
              <th style={th}>Statut</th>
              <th style={th}>Traité par</th>
              {canReview && <th style={{ ...th, textAlign: "right" }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td style={{ ...td, fontWeight: 700 }}>
                  {r.clients.name}
                  {r.clients.code && <span style={{ marginLeft: "0.4rem", fontSize: "0.72rem", color: "#94a3b8", fontFamily: "monospace" }}>{r.clients.code}</span>}
                </td>
                <td style={tdM}>{userName(r.requested_by)}</td>
                <td style={tdM}>{userName(r.current_user)}</td>
                <td style={{ ...td, fontWeight: 600, color: "#0a4d9b" }}>{userName(r.target_user)}</td>
                <td style={{ ...tdM, maxWidth: "200px", whiteSpace: "normal" }}>{r.note || "—"}</td>
                <td style={tdM}>{formatDate(r.created_at)}</td>
                <td style={td}><StatusBadge status={r.status} /></td>
                <td style={tdM}>
                  {r.reviewed_by ? `${userName(r.reviewed_by)} · ${formatDate(r.reviewed_at)}` : "—"}
                </td>
                {canReview && (
                  <td style={{ ...td, textAlign: "right" }}>
                    {r.status === "pending" ? (
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        <button type="button" disabled={loading === r.id} onClick={() => handleAction(r.id, "approve")} style={{ padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, cursor: loading === r.id ? "not-allowed" : "pointer", background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}>
                          ✓ Approuver
                        </button>
                        <button type="button" disabled={loading === r.id} onClick={() => handleAction(r.id, "reject")} style={{ padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, cursor: loading === r.id ? "not-allowed" : "pointer", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
                          ✕ Refuser
                        </button>
                      </div>
                    ) : <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>—</span>}
                  </td>
                )}
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={canReview ? 9 : 8} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2.5rem" }}>Aucune demande.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}