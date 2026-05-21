"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

type RoleItem = { id: string; code: string; label: string };
type CdvItem  = { id: string; first_name: string; last_name: string; email: string };
type AtcItem  = { id: string; first_name: string; last_name: string; email: string };
type StoreItem = { id: string; code: string; name: string };

type UserData = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  code?: string | null;
  role_id: string;
  supervisor_id?: string | null;
  roles?: { code: string; label: string } | null;
  user_store_links?: { store_id: string }[];
  supervised_atc_ids?: string[];
};

const inp: React.CSSProperties = { width: "100%", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #dce5f0", background: "rgba(255,255,255,0.92)", fontSize: "0.9rem", color: "#0f172a", outline: "none" };
const lbl: React.CSSProperties = { display: "block", marginBottom: "0.4rem", fontSize: "0.8rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" };
const row2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" };
const fld: React.CSSProperties  = { display: "flex", flexDirection: "column" };

export default function UserEditForm({
  user, roles, cdvs, atcs, stores,
}: {
  user: UserData;
  roles: RoleItem[];
  cdvs: CdvItem[];   // CDVs actifs du distributeur
  atcs: AtcItem[];   // ATCs actifs (pour remplacement si changement de rôle)
  stores?: StoreItem[];
}) {
  stores = stores || [];
  const router = useRouter();

  const [firstName,    setFirstName]    = useState(user.first_name);
  const [lastName,     setLastName]     = useState(user.last_name);
  const [email,        setEmail]        = useState(user.email);
  const [phone,        setPhone]        = useState(user.phone || "");
  const [code,         setCode]         = useState(user.code || "");
  const [roleId,       setRoleId]       = useState(user.role_id);
  const [supervisorId, setSupervisorId] = useState(user.supervisor_id || "");
  const [supervisedAtcIds, setSupervisedAtcIds] = useState<string[]>(user.supervised_atc_ids || []);
  const [storeIds,     setStoreIds]     = useState<string[]>((user.user_store_links || []).map((link) => link.store_id));
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState("");

  // Remplacement ATC
  const [showReplacement, setShowReplacement] = useState(false);
  const [replacementId,   setReplacementId]   = useState("");
  const [replacementInfo, setReplacementInfo] = useState<{ clientCount: number; bonCount: number } | null>(null);

  const selectedRole = useMemo(() => roles.find((r) => r.id === roleId), [roles, roleId]);
  const isCurrentlyAtc = user.roles?.code === "atc";
  const willBeAtc      = selectedRole?.code === "atc";
  const willBeCdv      = selectedRole?.code === "cdv";
  const needsStores    = selectedRole?.code === "cdv" || selectedRole?.code === "rdm";
  const willLeaveAtc   = isCurrentlyAtc && !willBeAtc;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, lastName, email, phone, code, roleId,
          supervisorId: willBeAtc ? (supervisorId || null) : null,
          supervisedAtcIds: willBeCdv ? supervisedAtcIds : [],
          storeIds: needsStores ? storeIds : [],
          replacementUserId: replacementId || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.requiresReplacement) {
          setReplacementInfo({ clientCount: data.clientCount, bonCount: data.bonCount });
          setShowReplacement(true);
          setLoading(false);
          return;
        }
        setError(data.message || "Erreur.");
        return;
      }

      setSuccess("Profil mis à jour.");
      setTimeout(() => router.refresh(), 500);
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      <div style={row2}>
        <div style={fld}><label style={lbl}>Prénom</label><input style={inp} value={firstName} onChange={(e) => setFirstName(e.target.value)} required /></div>
        <div style={fld}><label style={lbl}>Nom</label><input style={inp} value={lastName} onChange={(e) => setLastName(e.target.value)} required /></div>
      </div>

      <div style={row2}>
        <div style={fld}><label style={lbl}>Email</label><input style={inp} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div style={fld}><label style={lbl}>Téléphone</label><input style={inp} value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
      </div>

      <div style={row2}>
        <div style={fld}>
          <label style={lbl}>Code interne</label>
          <input style={inp} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
        </div>
        <div style={fld}>
          <label style={lbl}>Rôle</label>
          <select style={{ ...inp, cursor: "pointer" }} value={roleId} onChange={(e) => { setRoleId(e.target.value); setShowReplacement(false); setReplacementId(""); }}>
            {roles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </div>
      </div>

      {/* Superviseur CDV — affiché uniquement si le rôle est ATC */}
      {willBeAtc && (
        <div style={fld}>
          <label style={lbl}>CDV superviseur</label>
          <select style={{ ...inp, cursor: "pointer" }} value={supervisorId} onChange={(e) => setSupervisorId(e.target.value)}>
            <option value="">— Aucun CDV rattaché —</option>
            {cdvs.map((c) => (
              <option key={c.id} value={c.id}>
                {`${c.first_name} ${c.last_name}`.trim()} · {c.email}
              </option>
            ))}
          </select>
          <p style={{ margin: "0.35rem 0 0", fontSize: "0.78rem", color: "#94a3b8" }}>
            Rattacher cet ATC à un CDV pour le suivi d'équipe.
          </p>
        </div>
      )}

      {willBeCdv && (
        <div style={fld}>
          <label style={lbl}>ATC rattaches au CDV</label>
          <select
            multiple
            style={{ ...inp, minHeight: "9rem", cursor: "pointer" }}
            value={supervisedAtcIds}
            onChange={(e) => setSupervisedAtcIds(Array.from(e.currentTarget.selectedOptions).map((option) => option.value))}
          >
            {atcs.map((a) => (
              <option key={a.id} value={a.id}>
                {`${a.first_name} ${a.last_name}`.trim()} - {a.email}
              </option>
            ))}
          </select>
          <p style={{ margin: "0.35rem 0 0", fontSize: "0.78rem", color: "#94a3b8" }}>
            Ctrl + clic pour rattacher plusieurs ATC a ce CDV.
          </p>
        </div>
      )}

      {/* Avertissement changement de rôle depuis ATC */}
      {needsStores && (
        <div style={fld}>
          <label style={lbl}>Magasins rattaches</label>
          <select
            multiple
            style={{ ...inp, minHeight: "8rem", cursor: "pointer" }}
            value={storeIds}
            onChange={(e) => setStoreIds(Array.from(e.currentTarget.selectedOptions).map((option) => option.value))}
            required={selectedRole?.code === "rdm"}
          >
            {stores.map((store) => (
              <option key={store.id} value={store.id}>{store.code} - {store.name}</option>
            ))}
          </select>
          <p style={{ margin: "0.35rem 0 0", fontSize: "0.78rem", color: "#94a3b8" }}>
            Ctrl + clic pour selectionner plusieurs magasins. Obligatoire pour un RDM.
          </p>
        </div>
      )}

      {willLeaveAtc && (
        <div style={{ borderRadius: "0.875rem", background: "#fffbeb", border: "1px solid #fde68a", padding: "1rem 1.25rem" }}>
          <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#b45309" }}>⚠️ Changement de rôle depuis ATC</p>
          <p style={{ margin: "0.35rem 0 0", fontSize: "0.82rem", color: "#92400e" }}>
            Si cet ATC a des clients ou bons actifs, un remplaçant sera demandé.
          </p>
        </div>
      )}

      {/* Remplacement ATC */}
      {showReplacement && replacementInfo && (
        <div style={{ borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#dc2626" }}>Remplacement requis</p>
          <p style={{ margin: 0, fontSize: "0.82rem", color: "#7f1d1d" }}>
            Cet ATC a <strong>{replacementInfo.clientCount}</strong> client{replacementInfo.clientCount > 1 ? "s" : ""} et{" "}
            <strong>{replacementInfo.bonCount}</strong> bon{replacementInfo.bonCount > 1 ? "s" : ""} actif{replacementInfo.bonCount > 1 ? "s" : ""}.
            Choisissez un ATC pour reprendre le portefeuille.
          </p>
          <div style={fld}>
            <label style={lbl}>ATC remplaçant</label>
            <select style={{ ...inp, cursor: "pointer" }} value={replacementId} onChange={(e) => setReplacementId(e.target.value)}>
              <option value="">— Sélectionner un ATC —</option>
              {atcs.filter((a) => a.id !== user.id).map((a) => (
                <option key={a.id} value={a.id}>{`${a.first_name} ${a.last_name}`.trim()} · {a.email}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {error   && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
        <button
          type="submit"
          disabled={loading || (showReplacement && !replacementId)}
          style={{ padding: "0.75rem 1.75rem", borderRadius: "0.875rem", background: loading ? "#94a3b8" : "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 8px 20px rgba(30,115,216,0.25)" }}
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
