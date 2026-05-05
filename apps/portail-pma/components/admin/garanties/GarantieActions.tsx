"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Action = {
  key:          string;
  label:        string;
  color:        string;
  needsBl:      boolean;
  needsReason:  boolean;
  confirmLabel: string;
};

type Props = {
  garantieId: string;
  actions:    Action[];
};

export default function GarantieActions({ garantieId, actions }: Props) {
  const router      = useRouter();
  const [key,       setKey]       = useState<string | null>(null);
  const [reason,    setReason]    = useState("");
  const [bl,        setBl]        = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const selected = actions.find((a) => a.key === key);

  async function submit() {
    if (!key) return;
    setLoading(true); setError("");
    try {
      const r = await fetch(`/api/admin/garanties/${garantieId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: key, reason: reason || null, decision_bl: bl || null }),
      });
      const d = await r.json();
      if (!d.success) { setError(d.message ?? "Erreur"); return; }
      router.refresh();
      setKey(null); setReason(""); setBl("");
    } catch { setError("Erreur réseau."); }
    finally { setLoading(false); }
  }

  if (actions.length === 0) return null;

  return (
    <section className="card-lysma" style={{ padding: "1.5rem" }}>
      <h2 className="section-title" style={{ marginBottom: "1rem" }}>Actions disponibles</h2>

      {/* Boutons */}
      <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
        {actions.map((a) => (
          <button key={a.key} type="button"
            onClick={() => { setKey(key === a.key ? null : a.key); setReason(""); setBl(""); setError(""); }}
            style={{
              padding: "0.5rem 1.125rem",
              borderRadius: "0.75rem",
              border: `1.5px solid ${key === a.key ? a.color : "#e2e8f0"}`,
              background: key === a.key ? `${a.color}12` : "#fff",
              color: key === a.key ? a.color : "#334155",
              fontWeight: key === a.key ? 700 : 500,
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.15s",
            }}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Panel action sélectionnée */}
      {key && selected && (
        <div style={{ marginTop: "1.25rem", padding: "1.25rem", borderRadius: "0.875rem", background: `${selected.color}08`, border: `1px solid ${selected.color}30` }}>
          {selected.needsBl && (
            <div style={{ marginBottom: "0.875rem" }}>
              <label style={{ display: "block", marginBottom: "0.375rem", fontSize: "0.78rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                N° BL décision <span style={{ fontWeight: 400, color: "#94a3b8" }}>(optionnel)</span>
              </label>
              <input
                style={{ width: "100%", maxWidth: "280px", padding: "0.625rem 0.875rem", borderRadius: "0.75rem", border: "1px solid #dce5f0", fontSize: "0.875rem", fontFamily: "monospace", textTransform: "uppercase", outline: "none", boxSizing: "border-box" as const }}
                value={bl} onChange={(e) => setBl(e.target.value.toUpperCase())}
                placeholder="EX: BL-2026-00042" autoComplete="off"
              />
            </div>
          )}
          {selected.needsReason && (
            <div style={{ marginBottom: "0.875rem" }}>
              <label style={{ display: "block", marginBottom: "0.375rem", fontSize: "0.78rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Motif du refus <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <textarea
                rows={3}
                style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "0.75rem", border: "1px solid #dce5f0", fontSize: "0.875rem", textTransform: "uppercase", resize: "vertical" as const, outline: "none", boxSizing: "border-box" as const }}
                value={reason} onChange={(e) => setReason(e.target.value.toUpperCase())}
                placeholder="MOTIF DU REFUS..."
              />
            </div>
          )}
          {error && (
            <p style={{ margin: "0 0 0.875rem", color: "#dc2626", fontSize: "0.875rem", fontWeight: 600 }}>{error}</p>
          )}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="button"
              disabled={loading || (selected.needsReason && !reason.trim())}
              onClick={submit}
              style={{
                padding: "0.625rem 1.375rem",
                borderRadius: "0.75rem",
                background: loading || (selected.needsReason && !reason.trim()) ? "#94a3b8" : selected.color,
                border: "none", color: "#fff", fontWeight: 700, fontSize: "0.875rem",
                cursor: loading || (selected.needsReason && !reason.trim()) ? "not-allowed" : "pointer",
              }}>
              {loading ? "En cours..." : selected.confirmLabel}
            </button>
            <button type="button" onClick={() => setKey(null)}
              style={{ padding: "0.625rem 1rem", borderRadius: "0.75rem", background: "none", border: "1px solid #e2e8f0", color: "#6b7280", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>
              Annuler
            </button>
          </div>
        </div>
      )}
    </section>
  );
}