"use client";

import { useEffect, useState } from "react";

const inp: React.CSSProperties = { width: "100%", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #dce5f0", background: "rgba(255,255,255,0.92)", fontSize: "0.875rem", color: "#0f172a", outline: "none" };
const lbl: React.CSSProperties = { display: "block", marginBottom: "0.4rem", fontSize: "0.8rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" };
const hint: React.CSSProperties = { margin: "0.3rem 0 0", fontSize: "0.75rem", color: "#94a3b8" };
const row2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" };
const section: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "1.25rem", padding: "1.5rem", borderRadius: "1.25rem", background: "rgba(248,251,255,0.6)", border: "1px solid rgba(217,227,240,0.8)" };
const sTitle: React.CSSProperties = { margin: "0 0 0.25rem", fontSize: "0.78rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" };

export default function SettingsGeneralForm() {
  const [legalName,      setLegalName]      = useState("");
  const [siret,          setSiret]          = useState("");
  const [vatNumber,      setVatNumber]      = useState("");
  const [email,          setEmail]          = useState("");
  const [phone,          setPhone]          = useState("");
  const [supportEmail,   setSupportEmail]   = useState("");
  const [supportPhone,   setSupportPhone]   = useState("");
  const [supportAddress, setSupportAddress] = useState("");
  const [loading,        setLoading]        = useState(false);
  const [fetching,       setFetching]       = useState(true);
  const [error,          setError]          = useState("");
  const [success,        setSuccess]        = useState("");

  useEffect(() => {
    fetch("/api/admin/settings/general")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const d = data.distributor;
          const s = data.settings;
          setLegalName(d?.legal_name || d?.name || "");
          setSiret(d?.siret || "");
          setVatNumber(d?.vat_number || "");
          setEmail(d?.email || "");
          setPhone(d?.phone || "");
          setSupportEmail(s?.support_email || "");
          setSupportPhone(s?.support_phone || "");
          setSupportAddress(s?.support_address || "");
        }
      })
      .finally(() => setFetching(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/admin/settings/general", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ legal_name: legalName, siret, vat_number: vatNumber, email, phone, support_email: supportEmail, support_phone: supportPhone, support_address: supportAddress }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur."); return; }
      setSuccess("Informations enregistrées.");
    } catch { setError("Erreur réseau."); }
    finally { setLoading(false); }
  }

  if (fetching) return <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Chargement...</div>;

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      <div style={section}>
        <p style={sTitle}>Identité légale</p>
        <div style={row2}>
          <div>
            <label style={lbl}>Raison sociale</label>
            <input style={inp} value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="Alliance Auto Industrie SAS" />
          </div>
          <div>
            <label style={lbl}>SIRET</label>
            <input style={inp} value={siret} onChange={(e) => setSiret(e.target.value)} placeholder="528 473 010 00012" />
          </div>
        </div>
        <div>
          <label style={lbl}>Numéro TVA intracommunautaire</label>
          <input style={{ ...inp, maxWidth: "280px" }} value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} placeholder="FR12528473010" />
        </div>
      </div>

      <div style={section}>
        <p style={sTitle}>Coordonnées principales</p>
        <div style={row2}>
          <div>
            <label style={lbl}>Email</label>
            <input style={inp} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Téléphone</label>
            <input style={inp} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
      </div>

      <div style={section}>
        <p style={sTitle}>Contact support</p>
        <p style={{ margin: "0 0 0.5rem", fontSize: "0.78rem", color: "#6b7280" }}>Ces coordonnées sont affichées à vos utilisateurs dans le portail quand ils ont besoin d'aide.</p>
        <div style={row2}>
          <div>
            <label style={lbl}>Email support</label>
            <input style={inp} type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} placeholder="sav@votresociete.fr" />
          </div>
          <div>
            <label style={lbl}>Téléphone support</label>
            <input style={inp} value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} />
          </div>
        </div>
        <div>
          <label style={lbl}>Adresse</label>
          <textarea style={{ ...inp, minHeight: "80px", resize: "vertical" }} value={supportAddress} onChange={(e) => setSupportAddress(e.target.value)} />
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