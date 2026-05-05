"use client";

import { useEffect, useState } from "react";

const inp: React.CSSProperties = { width: "100%", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #dce5f0", background: "rgba(255,255,255,0.92)", fontSize: "0.875rem", color: "#0f172a", outline: "none" };
const lbl: React.CSSProperties = { display: "block", marginBottom: "0.4rem", fontSize: "0.8rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" };
const hint: React.CSSProperties = { margin: "0.3rem 0 0", fontSize: "0.75rem", color: "#94a3b8" };

export default function SettingsJuridiqueForm() {
  const [cgvUrl,      setCgvUrl]      = useState("");
  const [cgvText,     setCgvText]     = useState("");
  const [rgpdUrl,     setRgpdUrl]     = useState("");
  const [rgpdContact, setRgpdContact] = useState("");
  const [mentionsUrl, setMentionsUrl] = useState("");
  const [loading,     setLoading]     = useState(false);
  const [fetching,    setFetching]    = useState(true);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState("");

  useEffect(() => {
    fetch("/api/admin/settings/general")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.settings?.juridique_config) {
          const j = d.settings.juridique_config;
          setCgvUrl(j.cgv_url || "");
          setCgvText(j.cgv_text || "");
          setRgpdUrl(j.rgpd_url || "");
          setRgpdContact(j.rgpd_contact || "");
          setMentionsUrl(j.mentions_url || "");
        }
      })
      .finally(() => setFetching(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/admin/settings/general", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ juridique_config: { cgv_url: cgvUrl, cgv_text: cgvText, rgpd_url: rgpdUrl, rgpd_contact: rgpdContact, mentions_url: mentionsUrl } }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur."); return; }
      setSuccess("Informations juridiques enregistrées.");
    } catch { setError("Erreur réseau."); }
    finally { setLoading(false); }
  }

  if (fetching) return <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Chargement...</div>;

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      <div style={{ padding: "1rem 1.25rem", borderRadius: "0.875rem", background: "rgba(239,246,255,0.6)", border: "1px solid #bfdbfe" }}>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "#0a4d9b" }}>
          💡 Ces informations sont affichées dans le footer du portail, dans les emails automatiques et sur les PDFs générés. Elles permettent à vos utilisateurs d'accéder aux documents légaux de votre entreprise.
        </p>
      </div>

      {/* CGV */}
      <div style={{ padding: "1.25rem", borderRadius: "1.25rem", background: "rgba(248,251,255,0.6)", border: "1px solid rgba(217,227,240,0.8)", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Conditions Générales de Vente (CGV)</p>
        <div>
          <label style={lbl}>URL des CGV</label>
          <input style={inp} type="url" value={cgvUrl} onChange={(e) => setCgvUrl(e.target.value)} placeholder="https://votre-site.fr/cgv.pdf" />
          <p style={hint}>Lien vers le document PDF ou page web de vos CGV.</p>
        </div>
        <div>
          <label style={lbl}>Texte d'accroche CGV</label>
          <textarea style={{ ...inp, minHeight: "80px", resize: "vertical" }} value={cgvText} onChange={(e) => setCgvText(e.target.value)} placeholder="En passant commande, vous acceptez nos conditions générales de vente..." />
          <p style={hint}>Affiché sur les bons et devis générés.</p>
        </div>
      </div>

      {/* RGPD */}
      <div style={{ padding: "1.25rem", borderRadius: "1.25rem", background: "rgba(248,251,255,0.6)", border: "1px solid rgba(217,227,240,0.8)", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>RGPD & Protection des données</p>
        <div>
          <label style={lbl}>URL de la politique de confidentialité</label>
          <input style={inp} type="url" value={rgpdUrl} onChange={(e) => setRgpdUrl(e.target.value)} placeholder="https://votre-site.fr/politique-confidentialite" />
        </div>
        <div>
          <label style={lbl}>Email DPO / Contact RGPD</label>
          <input style={inp} type="email" value={rgpdContact} onChange={(e) => setRgpdContact(e.target.value)} placeholder="dpo@votresociete.fr" />
          <p style={hint}>Délégué à la Protection des Données — obligatoire si vous traitez des données personnelles.</p>
        </div>
      </div>

      {/* Mentions légales */}
      <div style={{ padding: "1.25rem", borderRadius: "1.25rem", background: "rgba(248,251,255,0.6)", border: "1px solid rgba(217,227,240,0.8)" }}>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.78rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Mentions légales</p>
        <label style={lbl}>URL des mentions légales</label>
        <input style={inp} type="url" value={mentionsUrl} onChange={(e) => setMentionsUrl(e.target.value)} placeholder="https://votre-site.fr/mentions-legales" />
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