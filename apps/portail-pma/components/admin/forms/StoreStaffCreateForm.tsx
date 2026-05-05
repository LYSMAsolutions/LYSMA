"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inp: React.CSSProperties = { width: "100%", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #dce5f0", background: "rgba(255,255,255,0.92)", fontSize: "0.9rem", color: "#0f172a", outline: "none" };
const lbl: React.CSSProperties = { display: "block", marginBottom: "0.4rem", fontSize: "0.8rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" };
const row2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" };
const fld: React.CSSProperties  = { display: "flex", flexDirection: "column" };
const hint: React.CSSProperties = { margin: "0.35rem 0 0", fontSize: "0.78rem", color: "#94a3b8" };

export default function StoreStaffCreateForm({ storeId }: { storeId: string }) {
  const router = useRouter();
  const [firstName,   setFirstName]   = useState("");
  const [lastName,    setLastName]    = useState("");
  const [initials,    setInitials]    = useState("");
  const [pin,         setPin]         = useState("");
  const [pinConfirm,  setPinConfirm]  = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  function autoInitials(fn: string, ln: string) {
    setInitials(`${fn.charAt(0)}${ln.charAt(0)}`.toUpperCase());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (pin.length < 4)            { setError("PIN minimum 4 chiffres."); return; }
    if (!/^\d+$/.test(pin))        { setError("PIN uniquement des chiffres."); return; }
    if (pin !== pinConfirm)        { setError("Les PINs ne correspondent pas."); return; }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/stores/${storeId}/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, initials, pin }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur."); return; }
      router.back();
      router.refresh();
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={row2}>
        <div style={fld}>
          <label style={lbl}>Prénom *</label>
          <input style={inp} value={firstName} onChange={(e) => { setFirstName(e.target.value); autoInitials(e.target.value, lastName); }} required />
        </div>
        <div style={fld}>
          <label style={lbl}>Nom *</label>
          <input style={inp} value={lastName} onChange={(e) => { setLastName(e.target.value); autoInitials(firstName, e.target.value); }} required />
        </div>
      </div>

      <div style={fld}>
        <label style={lbl}>Initiales *</label>
        <input style={{ ...inp, maxWidth: "100px", textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.12em" }}
          value={initials}
          onChange={(e) => setInitials(e.target.value.toUpperCase().slice(0, 5))}
          required placeholder="PF"
        />
        <p style={hint}>Auto-générées — modifiables. Uniques par magasin.</p>
      </div>

      <div style={row2}>
        <div style={fld}>
          <label style={lbl}>PIN * (4 chiffres min)</label>
          <input style={inp} type="password" inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))} required placeholder="••••" />
        </div>
        <div style={fld}>
          <label style={lbl}>Confirmer PIN *</label>
          <input style={{ ...inp, borderColor: pinConfirm && pin !== pinConfirm ? "#fecaca" : "#dce5f0" }}
            type="password" inputMode="numeric" value={pinConfirm}
            onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 8))}
            required placeholder="••••"
          />
          {pinConfirm && pin !== pinConfirm && <p style={{ ...hint, color: "#dc2626" }}>PINs différents</p>}
        </div>
      </div>

      <div style={{ padding: "0.875rem 1rem", borderRadius: "0.875rem", background: "#fffbeb", border: "1px solid #fde68a" }}>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "#92400e" }}>⚠️ Communiquer le PIN directement au magasinier. Changement requis à la première connexion.</p>
      </div>

      {error && <div style={{ padding: "0.875rem 1rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{error}</div>}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
        <button type="button" onClick={() => router.back()} style={{ padding: "0.75rem 1.25rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", color: "#475569" }}>Annuler</button>
        <button type="submit" disabled={loading || (!!pinConfirm && pin !== pinConfirm)} style={{ padding: "0.75rem 1.75rem", borderRadius: "0.875rem", background: loading ? "#94a3b8" : "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 8px 20px rgba(30,115,216,0.25)" }}>
          {loading ? "Création..." : "Créer le magasinier"}
        </button>
      </div>
    </form>
  );
}