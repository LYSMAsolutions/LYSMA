"use client";

import { useState } from "react";
import EntityModal from "@/components/admin/modals/EntityModal";

const inp: React.CSSProperties = { width: "100%", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #dce5f0", background: "rgba(255,255,255,0.92)", fontSize: "0.9rem", color: "#0f172a", outline: "none" };
const lbl: React.CSSProperties = { display: "block", marginBottom: "0.4rem", fontSize: "0.8rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" };
const row2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" };
const hint: React.CSSProperties = { margin: "0.3rem 0 0", fontSize: "0.75rem", color: "#94a3b8" };

export default function SupplierFormModal() {
  const [open,    setOpen]    = useState(false);
  const [code,    setCode]    = useState("");
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [phone,   setPhone]   = useState("");
  const [website, setWebsite] = useState("");
  const [notes,   setNotes]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  function reset() { setCode(""); setName(""); setEmail(""); setPhone(""); setWebsite(""); setNotes(""); setError(""); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/catalogues/fournisseurs", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name, email, phone, website, notes }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur."); return; }
      // Hard reload — bypass tous les caches Next.js
      window.location.reload();
    } catch { setError("Erreur réseau."); }
    finally { setLoading(false); }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} style={{ display: "inline-flex", padding: "0.65rem 1.25rem", borderRadius: "0.875rem", background: "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: "pointer", boxShadow: "0 6px 16px rgba(30,115,216,0.2)" }}>
        + Ajouter un fournisseur
      </button>

      <EntityModal open={open} onClose={() => { reset(); setOpen(false); }} title="Créer un fournisseur" description="Ajouter une source catalogue au distributeur.">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={row2}>
            <div>
              <label style={lbl}>Code fournisseur *</label>
              <input style={inp} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required placeholder="ex: BOSCH" />
              <p style={hint}>Identifiant unique. Utilisé dans les imports CSV.</p>
            </div>
            <div>
              <label style={lbl}>Nom *</label>
              <input style={inp} value={name} onChange={(e) => setName(e.target.value)} required placeholder="ex: Bosch France" />
            </div>
          </div>
          <div style={row2}>
            <div>
              <label style={lbl}>Email</label>
              <input style={inp} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@fournisseur.fr" />
            </div>
            <div>
              <label style={lbl}>Téléphone</label>
              <input style={inp} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div>
            <label style={lbl}>Site web</label>
            <input style={inp} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label style={lbl}>Notes internes</label>
            <textarea style={{ ...inp, minHeight: "72px", resize: "vertical" }} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Contact commercial, conditions tarifaires..." />
          </div>
          {error && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{error}</div>}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button type="button" onClick={() => { reset(); setOpen(false); }} style={{ padding: "0.65rem 1.25rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", color: "#475569" }}>Annuler</button>
            <button type="submit" disabled={loading} style={{ padding: "0.65rem 1.75rem", borderRadius: "0.875rem", background: loading ? "#94a3b8" : "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 6px 16px rgba(30,115,216,0.2)" }}>
              {loading ? "Création..." : "Créer le fournisseur"}
            </button>
          </div>
        </form>
      </EntityModal>
    </>
  );
}