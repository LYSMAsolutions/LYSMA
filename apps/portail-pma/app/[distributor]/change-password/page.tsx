"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

const inp: React.CSSProperties = { width: "100%", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #dce5f0", background: "rgba(255,255,255,0.92)", fontSize: "0.9rem", color: "#0f172a", outline: "none" };
const lbl: React.CSSProperties = { display: "block", marginBottom: "0.4rem", fontSize: "0.8rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" };

export default function ChangePasswordPage() {
  const router = useRouter();
  const params = useParams();
  const distributor = params.distributor as string;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]      = useState("");
  const [confirmPassword, setConfirmPassword]  = useState("");
  const [loading,         setLoading]          = useState(false);
  const [error,           setError]            = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) { setError("Les mots de passe ne correspondent pas."); return; }
    if (newPassword.length < 8) { setError("Le nouveau mot de passe doit faire au moins 8 caractères."); return; }
    if (newPassword === currentPassword) { setError("Le nouveau mot de passe doit être différent de l'actuel."); return; }

    setLoading(true);
    try {
      const res  = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur."); return; }
      router.push(data.redirect);
    } catch { setError("Erreur réseau."); }
    finally { setLoading(false); }
  }

  const passwordsMatch = !confirmPassword || newPassword === confirmPassword;

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#c8dcff 0%,#b8d4fa 20%,#ccdcfb 50%,#dce8fb 100%)" }}>
      <div style={{ width: "100%", maxWidth: "440px", margin: "0 1rem", padding: "2.5rem", borderRadius: "2rem", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.6)", boxShadow: "0 16px 48px rgba(10,77,155,0.12)" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg,#0a4d9b,#1e73d8)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontSize: "1.4rem", boxShadow: "0 8px 20px rgba(10,77,155,0.25)" }}>🔐</div>
          <h1 style={{ margin: 0, fontSize: "1.375rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>Changement de mot de passe</h1>
          <p style={{ margin: "0.625rem 0 0", fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.6 }}>
            Votre administrateur a requis un changement de mot de passe. Choisissez un mot de passe sécurisé pour continuer.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          <div>
            <label style={lbl}>Mot de passe actuel</label>
            <input style={inp} type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required autoFocus autoComplete="current-password" />
          </div>

          <div>
            <label style={lbl}>Nouveau mot de passe</label>
            <input style={inp} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required autoComplete="new-password" />
            <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.4rem" }}>
              {[
                { label: "8+ caractères", ok: newPassword.length >= 8 },
                { label: "Différent de l'actuel", ok: newPassword.length > 0 && newPassword !== currentPassword },
              ].map((check) => (
                <span key={check.label} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.2rem 0.5rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 600, background: check.ok ? "#f0fdf4" : "#f1f5f9", color: check.ok ? "#15803d" : "#94a3b8", border: `1px solid ${check.ok ? "#bbf7d0" : "#e2e8f0"}` }}>
                  {check.ok ? "✓" : "·"} {check.label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label style={lbl}>Confirmer le mot de passe</label>
            <input
              style={{ ...inp, borderColor: !passwordsMatch ? "#fecaca" : "#dce5f0" }}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            {!passwordsMatch && (
              <p style={{ margin: "0.3rem 0 0", fontSize: "0.75rem", color: "#dc2626" }}>Les mots de passe ne correspondent pas.</p>
            )}
          </div>

          {error && (
            <div style={{ padding: "0.875rem 1rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || !passwordsMatch || newPassword.length < 8}
            style={{ padding: "0.9rem", borderRadius: "0.875rem", background: loading || !passwordsMatch || newPassword.length < 8 ? "#94a3b8" : "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: loading || !passwordsMatch || newPassword.length < 8 ? "not-allowed" : "pointer", boxShadow: "0 8px 20px rgba(30,115,216,0.25)", transition: "all 0.15s" }}
          >
            {loading ? "Enregistrement..." : "Valider le nouveau mot de passe"}
          </button>
        </form>
      </div>
    </main>
  );
}