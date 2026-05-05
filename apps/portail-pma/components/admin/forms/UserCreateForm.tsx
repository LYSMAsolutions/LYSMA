"use client";

import { useMemo, useState } from "react";

type RoleItem = {
  id: string;
  code: string;
  label: string;
};

type Props = {
  roles: RoleItem[];
  forcedRoleCode?: "admin" | "cdv" | "rdm" | "atc";
  onSuccess?: () => void;
};

const label: React.CSSProperties = {
  display: "block",
  marginBottom: "0.4rem",
  fontSize: "0.8rem",
  fontWeight: 700,
  color: "#334155",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "0.875rem",
  border: "1px solid #dce5f0",
  background: "rgba(255,255,255,0.92)",
  fontSize: "0.9rem",
  color: "#0f172a",
  outline: "none",
  transition: "border-color 0.18s, box-shadow 0.18s",
};

const row2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1rem",
};

const field: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

export default function UserCreateForm({ roles, forcedRoleCode, onSuccess }: Props) {
  const forcedRole = roles.find((r) => r.code === forcedRoleCode) || null;

  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  const [email, setEmail]           = useState("");
  const [phone, setPhone]           = useState("");
  const [code, setCode]             = useState("");
  const [password, setPassword]     = useState("");
  const [roleId, setRoleId]         = useState(forcedRole?.id || "");
  const [loading, setLoading]       = useState(false);
  const [errorMsg, setErrorMsg]     = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const selectedRole = useMemo(() => {
    if (forcedRole) return forcedRole;
    return roles.find((r) => r.id === roleId) || null;
  }, [forcedRole, roleId, roles]);

  const isAtc = selectedRole?.code === "atc";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, lastName, email, phone, code, password,
          roleId: forcedRole?.id || roleId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Impossible de créer l'utilisateur.");
        return;
      }

      setSuccessMsg("Utilisateur créé avec succès.");
      setFirstName(""); setLastName(""); setEmail("");
      setPhone(""); setCode(""); setPassword("");
      if (!forcedRole) setRoleId("");

      setTimeout(() => onSuccess?.(), 300);
    } catch {
      setErrorMsg("Erreur réseau ou serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      <div style={row2}>
        <div style={field}>
          <label style={label}>Prénom</label>
          <input style={input} value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="off" />
        </div>
        <div style={field}>
          <label style={label}>Nom</label>
          <input style={input} value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="off" />
        </div>
      </div>

      <div style={row2}>
        <div style={field}>
          <label style={label}>Email</label>
          <input style={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
        </div>
        <div style={field}>
          <label style={label}>Téléphone</label>
          <input style={input} value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="off" />
        </div>
      </div>

      <div style={row2}>
        <div style={field}>
          <label style={label}>Mot de passe temporaire</label>
          <input style={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        </div>

        <div style={field}>
          <label style={label}>Rôle</label>
          {!forcedRole ? (
            <select
              style={{ ...input, cursor: "pointer" }}
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
            >
              <option value="">Sélectionner un rôle</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          ) : (
            <input style={{ ...input, background: "#f8fafc", color: "#6b7280" }} value={forcedRole.label} readOnly />
          )}
        </div>
      </div>

      <div style={field}>
        <label style={label}>{isAtc ? "Code ATC" : "Code interne"}</label>
        <input style={input} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} autoComplete="off" />
      </div>

      {errorMsg  && <div className="alert-error">{errorMsg}</div>}
      {successMsg && <div className="alert-success">{successMsg}</div>}

      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.75rem 1.75rem",
            borderRadius: "0.875rem",
            background: loading ? "#94a3b8" : "linear-gradient(135deg,#0a4d9b,#1e73d8)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.9rem",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 8px 20px rgba(30,115,216,0.25)",
            transition: "all 0.18s",
          }}
        >
          {loading ? "Création..." : "Créer l'utilisateur"}
        </button>
      </div>
    </form>
  );
}