"use client";

import { useEffect, useState } from "react";

const BON_TYPES = [
  { code: "commande_devis",       label: "Commande / Devis",        desc: "Bons de commande et devis classiques" },
  { code: "retour",               label: "Retour produit",          desc: "Gestion des retours clients" },
  { code: "sav",                  label: "SAV",                     desc: "Service après-vente" },
  { code: "intervention",         label: "Intervention",            desc: "Interventions SAV" },
  { code: "devis_materiel",       label: "Devis matériel",          desc: "Devis pour matériel lourd (magasins SAV)" },
  { code: "garantie",             label: "Garantie",                desc: "Demandes de garanties produits" },
  { code: "contrat_maintenance",  label: "Contrat de maintenance",  desc: "Contrats de maintenance périodique" },
  { code: "transformation_devis", label: "Transformation devis",    desc: "Conversion d'un devis en commande" },
];

export default function SettingsWorkflowForm() {
  const [enabledTypes, setEnabledTypes] = useState<string[]>([]);
  const [alertDelay,   setAlertDelay]   = useState("48");
  const [loading,      setLoading]      = useState(false);
  const [fetching,     setFetching]     = useState(true);
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState("");

  useEffect(() => {
    fetch("/api/admin/settings/workflow")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.settings) {
          const types = d.settings.bon_types_enabled;
          if (Array.isArray(types)) setEnabledTypes(types);
          const wf = d.settings.workflow_config;
          if (wf?.alert_delay_hours) setAlertDelay(String(wf.alert_delay_hours));
        }
      })
      .finally(() => setFetching(false));
  }, []);

  function toggleType(code: string) {
    setEnabledTypes((prev) => prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/admin/settings/workflow", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bon_types_enabled: enabledTypes, workflow_config: { alert_delay_hours: parseInt(alertDelay) || 48 } }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur."); return; }
      setSuccess("Workflow enregistré.");
    } catch { setError("Erreur réseau."); }
    finally { setLoading(false); }
  }

  if (fetching) return <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Chargement...</div>;

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      <div>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.8rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" }}>Types de bons actifs</p>
        <p style={{ margin: "0 0 1rem", fontSize: "0.82rem", color: "#6b7280" }}>Seuls les types cochés seront disponibles pour vos ATC et CDV lors de la création d'un bon.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.75rem" }}>
          {BON_TYPES.map((t) => {
            const on = enabledTypes.includes(t.code);
            return (
              <label key={t.code} onClick={() => toggleType(t.code)} style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "1rem 1.25rem", borderRadius: "1rem", border: "1px solid", borderColor: on ? "#bfdbfe" : "#e2e8f0", background: on ? "rgba(239,246,255,0.6)" : "#f8fafc", cursor: "pointer", transition: "all 0.15s" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "6px", border: `2px solid ${on ? "#0a4d9b" : "#cbd5e1"}`, background: on ? "#0a4d9b" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                  {on && <span style={{ color: "#fff", fontSize: "12px", fontWeight: 800 }}>✓</span>}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#0f172a" }}>{t.label}</p>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>{t.desc}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "1.25rem", borderRadius: "1.25rem", background: "rgba(248,251,255,0.6)", border: "1px solid rgba(217,227,240,0.8)" }}>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.8rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" }}>Délai d'alerte</p>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <input type="number" min={1} max={720} value={alertDelay} onChange={(e) => setAlertDelay(e.target.value)} style={{ width: "100px", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #dce5f0", background: "rgba(255,255,255,0.92)", fontSize: "0.875rem", color: "#0f172a", outline: "none", textAlign: "center" }} />
          <div>
            <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>heures avant alerte</p>
            <p style={{ margin: "0.15rem 0 0", fontSize: "0.75rem", color: "#6b7280" }}>Un bon non traité après ce délai sera signalé comme urgent.</p>
          </div>
        </div>
      </div>

      {error   && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{error}</div>}
      {success && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", fontSize: "0.875rem" }}>{success}</div>}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button type="submit" disabled={loading} style={{ padding: "0.75rem 2rem", borderRadius: "0.875rem", background: loading ? "#94a3b8" : "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 8px 20px rgba(30,115,216,0.25)" }}>
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}