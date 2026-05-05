"use client";

import { useEffect, useState } from "react";

const inp: React.CSSProperties = { width: "100%", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #dce5f0", background: "rgba(255,255,255,0.92)", fontSize: "0.875rem", color: "#0f172a", outline: "none" };
const lbl: React.CSSProperties = { display: "block", marginBottom: "0.4rem", fontSize: "0.8rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" };
const hint: React.CSSProperties = { margin: "0.3rem 0 0", fontSize: "0.75rem", color: "#94a3b8" };

export default function SettingsBrandingForm() {
  const [displayName, setDisplayName] = useState("");
  const [logoUrl,     setLogoUrl]     = useState("");
  const [loading,     setLoading]     = useState(false);
  const [fetching,    setFetching]    = useState(true);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState("");

  useEffect(() => {
    fetch("/api/admin/settings/branding")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.settings) {
          setDisplayName(d.settings.company_display_name || "");
          setLogoUrl(d.settings.logo_url || "");
        }
      })
      .finally(() => setFetching(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/admin/settings/branding", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_display_name: displayName, logo_url: logoUrl }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur."); return; }
      setSuccess("Logo enregistré.");
    } catch { setError("Erreur réseau."); }
    finally { setLoading(false); }
  }

  if (fetching) return <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Chargement...</div>;

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      <div>
        <label style={lbl}>Nom affiché dans le portail</label>
        <input style={inp} value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Alliance Auto Industrie" />
        <p style={hint}>Affiché dans le header, les emails envoyés aux magasins et sur les PDFs générés.</p>
      </div>

      <div>
        <label style={lbl}>Logo</label>
        <input style={inp} value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://votre-site.fr/logo.png" />
        <p style={hint}>URL directe vers l'image de votre logo (.png, .svg, .jpg). Utilisé dans les emails et les PDFs. L'URL doit se terminer par l'extension du fichier image.</p>
      </div>

      {logoUrl && (
        <div style={{ padding: "1.25rem", borderRadius: "1.25rem", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <p style={{ margin: "0 0 0.75rem", fontSize: "0.78rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Aperçu logo</p>
          <img
            src={logoUrl} alt="Logo" style={{ maxHeight: "80px", maxWidth: "240px", objectFit: "contain" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      )}

      <div style={{ padding: "1rem 1.25rem", borderRadius: "0.875rem", background: "rgba(239,246,255,0.6)", border: "1px solid #bfdbfe" }}>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "#0a4d9b" }}>
          🎨 <strong>Couleurs et templates PDF</strong> — la personnalisation des couleurs et le choix du template PDF seront disponibles dans une prochaine version. Votre logo sera utilisé dès maintenant dans tous les emails et documents générés.
        </p>
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