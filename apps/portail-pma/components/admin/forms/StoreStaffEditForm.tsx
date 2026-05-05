"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EntityModal from "@/components/admin/modals/EntityModal";

const inp: React.CSSProperties = { width: "100%", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #dce5f0", background: "rgba(255,255,255,0.92)", fontSize: "0.9rem", color: "#0f172a", outline: "none" };
const lbl: React.CSSProperties = { display: "block", marginBottom: "0.4rem", fontSize: "0.8rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" };
const row2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" };
const fld: React.CSSProperties  = { display: "flex", flexDirection: "column" };
const hint: React.CSSProperties = { margin: "0.35rem 0 0", fontSize: "0.78rem", color: "#94a3b8" };

type StaffData = {
  id: string;
  first_name: string;
  last_name: string;
  initials: string;
  is_active: boolean;
  must_change_pin: boolean;
  store_id?: string;
};

type StoreItem = { id: string; code: string; name: string };
type RoleItem  = { id: string; code: string; label: string };

export default function StoreStaffEditForm({
  staff, stores = [], roles = [],
}: {
  staff: StaffData;
  stores?: StoreItem[];
  roles?: RoleItem[];
}) {
  const router = useRouter();

  // ── Édition profil
  const [firstName,     setFirstName]     = useState(staff.first_name);
  const [lastName,      setLastName]      = useState(staff.last_name);
  const [initials,      setInitials]      = useState(staff.initials);
  const [pin,           setPin]           = useState("");
  const [pinConfirm,    setPinConfirm]    = useState("");
  const [isActive,      setIsActive]      = useState(staff.is_active);
  const [mustChangePin, setMustChangePin] = useState(staff.must_change_pin);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [success,       setSuccess]       = useState("");

  // ── Transfert magasin
  const [transferOpen, setTransferOpen] = useState(false);
  const [targetStore,  setTargetStore]  = useState("");
  const [tLoading,     setTLoading]     = useState(false);
  const [tError,       setTError]       = useState("");

  // ── Suppression
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [dLoading,   setDLoading]   = useState(false);
  const [dError,     setDError]     = useState("");

  // ── Promotion
  const [promoteOpen,     setPromoteOpen]     = useState(false);
  const [promoteEmail,    setPromoteEmail]    = useState("");
  const [promotePassword, setPromotePassword] = useState("");
  const [promoteRoleId,   setPromoteRoleId]   = useState("");
  const [pLoading,        setPLoading]        = useState(false);
  const [pError,          setPError]          = useState("");

  function autoInitials(fn: string, ln: string) {
    setInitials(`${fn.charAt(0)}${ln.charAt(0)}`.toUpperCase());
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
    if (pin && pin.length < 4) { setError("PIN minimum 4 chiffres."); return; }
    if (pin && !/^\d+$/.test(pin)) { setError("PIN uniquement des chiffres."); return; }
    if (pin && pin !== pinConfirm) { setError("Les PINs ne correspondent pas."); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/stores/staff/${staff.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, initials, pin: pin || undefined, isActive, mustChangePin }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur."); return; }
      setSuccess("Profil mis à jour.");
      setTimeout(() => router.refresh(), 800);
    } catch { setError("Erreur réseau."); }
    finally { setLoading(false); }
  }

  async function handleTransfer(e: React.FormEvent) {
    e.preventDefault();
    setTError("");
    if (!targetStore) { setTError("Choisir un magasin de destination."); return; }
    setTLoading(true);
    try {
      const res = await fetch(`/api/admin/stores/staff/${staff.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, initials, isActive, mustChangePin, storeId: targetStore }),
      });
      const data = await res.json();
      if (!res.ok) { setTError(data.message || "Erreur."); return; }
      setTransferOpen(false);
      router.refresh();
    } catch { setTError("Erreur réseau."); }
    finally { setTLoading(false); }
  }

  async function handleDelete() {
    setDError(""); setDLoading(true);
    try {
      const res = await fetch(`/api/admin/stores/staff/${staff.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) { setDError(data.message || "Erreur."); return; }
      router.back();
    } catch { setDError("Erreur réseau."); }
    finally { setDLoading(false); }
  }

  async function handlePromote(e: React.FormEvent) {
    e.preventDefault();
    setPError("");
    if (!promoteEmail || !promotePassword || !promoteRoleId) { setPError("Tous les champs sont obligatoires."); return; }
    setPLoading(true);
    try {
      const res = await fetch(`/api/admin/stores/staff/${staff.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: promoteEmail, password: promotePassword, roleId: promoteRoleId }),
      });
      const data = await res.json();
      if (!res.ok) { setPError(data.message || "Erreur."); return; }
      setPromoteOpen(false);
      router.back();
    } catch { setPError("Erreur réseau."); }
    finally { setPLoading(false); }
  }

  const otherStores = stores.filter((s) => s.id !== staff.store_id);

  return (
    <>
      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

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
            value={initials} onChange={(e) => setInitials(e.target.value.toUpperCase().slice(0, 5))} required />
          <p style={hint}>Uniques par magasin.</p>
        </div>

        <div style={{ padding: "1rem 1.25rem", borderRadius: "0.875rem", background: "rgba(248,251,255,0.9)", border: "1px solid rgba(217,227,240,0.8)" }}>
          <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", fontWeight: 700, color: "#334155" }}>Nouveau PIN (optionnel)</p>
          <div style={row2}>
            <div style={fld}>
              <label style={lbl}>PIN (4 chiffres min)</label>
              <input style={inp} type="password" inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))} placeholder="Laisser vide pour ne pas changer" />
            </div>
            <div style={fld}>
              <label style={lbl}>Confirmer PIN</label>
              <input style={{ ...inp, borderColor: pinConfirm && pin !== pinConfirm ? "#fecaca" : "#dce5f0" }}
                type="password" inputMode="numeric" value={pinConfirm}
                onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 8))} placeholder="••••" />
              {pinConfirm && pin !== pinConfirm && <p style={{ ...hint, color: "#dc2626" }}>PINs différents</p>}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Compte actif
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>
            <input type="checkbox" checked={mustChangePin} onChange={(e) => setMustChangePin(e.target.checked)} /> Changement PIN requis
          </label>
        </div>

        {error   && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{error}</div>}
        {success && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", fontSize: "0.875rem" }}>{success}</div>}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" disabled={loading || (!!pinConfirm && pin !== pinConfirm)} style={{ padding: "0.65rem 1.75rem", borderRadius: "0.875rem", background: loading ? "#94a3b8" : "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 8px 20px rgba(30,115,216,0.25)" }}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>

      {/* Actions avancées */}
      <div style={{ marginTop: "2rem", paddingTop: "1.75rem", borderTop: "1px solid rgba(226,232,240,0.5)", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Actions avancées</p>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {/* Transfert */}
          {otherStores.length > 0 && (
            <button type="button" onClick={() => setTransferOpen(true)} style={{ padding: "0.65rem 1.25rem", borderRadius: "0.875rem", background: "rgba(238,242,255,0.9)", color: "#4338ca", border: "1px solid #c7d2fe", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>
              🔄 Changer de magasin
            </button>
          )}

          {/* Promotion */}
          <button type="button" onClick={() => setPromoteOpen(true)} style={{ padding: "0.65rem 1.25rem", borderRadius: "0.875rem", background: "rgba(240,253,244,0.9)", color: "#15803d", border: "1px solid #bbf7d0", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>
            ⬆️ Promouvoir en utilisateur
          </button>

          {/* Suppression */}
          <button type="button" onClick={() => setDeleteOpen(true)} style={{ padding: "0.65rem 1.25rem", borderRadius: "0.875rem", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>
            🗑️ Supprimer le magasinier
          </button>
        </div>
      </div>

      {/* Modal transfert */}
      <EntityModal open={transferOpen} onClose={() => setTransferOpen(false)} title="Changer de magasin" description="Le magasinier sera transféré dans le magasin sélectionné.">
        <form onSubmit={handleTransfer} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={lbl}>Magasin de destination *</label>
            <select style={{ ...inp, cursor: "pointer" }} value={targetStore} onChange={(e) => setTargetStore(e.target.value)}>
              <option value="">— Sélectionner —</option>
              {otherStores.map((s) => <option key={s.id} value={s.id}>{s.code} · {s.name}</option>)}
            </select>
          </div>
          <div style={{ padding: "0.875rem 1rem", borderRadius: "0.875rem", background: "#fffbeb", border: "1px solid #fde68a" }}>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "#92400e" }}>⚠️ Les initiales doivent être uniques dans le magasin de destination. Si conflit, modifiez-les d'abord.</p>
          </div>
          {tError && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{tError}</div>}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button type="button" onClick={() => setTransferOpen(false)} style={{ padding: "0.65rem 1.25rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", color: "#475569" }}>Annuler</button>
            <button type="submit" disabled={tLoading} style={{ padding: "0.65rem 1.75rem", borderRadius: "0.875rem", background: tLoading ? "#94a3b8" : "linear-gradient(135deg,#4338ca,#6366f1)", color: "#fff", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: tLoading ? "not-allowed" : "pointer" }}>
              {tLoading ? "Transfert..." : "Confirmer le transfert"}
            </button>
          </div>
        </form>
      </EntityModal>

      {/* Modal promotion */}
      <EntityModal open={promoteOpen} onClose={() => setPromoteOpen(false)} title="Promouvoir en utilisateur" description={`${firstName} ${lastName} deviendra un utilisateur du portail. Son compte magasinier sera désactivé.`}>
        <form onSubmit={handlePromote} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ padding: "0.875rem 1rem", borderRadius: "0.875rem", background: "rgba(239,246,255,0.6)", border: "1px solid #bfdbfe" }}>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "#0a4d9b", fontWeight: 600 }}>Prénom / Nom conservés : {firstName} {lastName}</p>
          </div>
          <div>
            <label style={lbl}>Rôle *</label>
            <select style={{ ...inp, cursor: "pointer" }} value={promoteRoleId} onChange={(e) => setPromoteRoleId(e.target.value)} required>
              <option value="">— Choisir un rôle —</option>
              {roles.filter((r) => !["store_staff", "store"].includes(r.code)).map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={lbl}>Email *</label>
            <input style={inp} type="email" value={promoteEmail} onChange={(e) => setPromoteEmail(e.target.value)} required placeholder="prenom.nom@example.com" />
          </div>
          <div>
            <label style={lbl}>Mot de passe temporaire *</label>
            <input style={inp} type="password" value={promotePassword} onChange={(e) => setPromotePassword(e.target.value)} required />
            <p style={hint}>Changement requis à la première connexion.</p>
          </div>
          {pError && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{pError}</div>}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button type="button" onClick={() => setPromoteOpen(false)} style={{ padding: "0.65rem 1.25rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", color: "#475569" }}>Annuler</button>
            <button type="submit" disabled={pLoading} style={{ padding: "0.65rem 1.75rem", borderRadius: "0.875rem", background: pLoading ? "#94a3b8" : "linear-gradient(135deg,#15803d,#16a34a)", color: "#fff", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: pLoading ? "not-allowed" : "pointer" }}>
              {pLoading ? "Promotion..." : "Promouvoir"}
            </button>
          </div>
        </form>
      </EntityModal>

      {/* Modal suppression */}
      <EntityModal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Supprimer le magasinier" description={`Supprimer ${firstName} ${lastName} définitivement. Ses bons resteront rattachés au magasin.`}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ padding: "1rem 1.25rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca" }}>
            <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#dc2626" }}>⚠️ Action irréversible</p>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.82rem", color: "#7f1d1d" }}>
              Tous les bons pris en charge par ce magasinier auront leur champ "pris en charge par" remis à vide. Les bons restent visibles dans le magasin.
            </p>
          </div>
          {dError && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{dError}</div>}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button type="button" onClick={() => setDeleteOpen(false)} style={{ padding: "0.65rem 1.25rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", color: "#475569" }}>Annuler</button>
            <button type="button" onClick={handleDelete} disabled={dLoading} style={{ padding: "0.65rem 1.75rem", borderRadius: "0.875rem", background: "#dc2626", color: "#fff", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: dLoading ? "not-allowed" : "pointer" }}>
              {dLoading ? "Suppression..." : "Confirmer la suppression"}
            </button>
          </div>
        </div>
      </EntityModal>
    </>
  );
}
