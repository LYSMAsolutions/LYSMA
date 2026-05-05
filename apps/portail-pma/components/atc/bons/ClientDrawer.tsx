"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle, CheckCircle2 } from "lucide-react";

export type ClientData = {
  id:                  string;
  name:                string;
  code:                string | null;
  billing_name:        string | null;
  representative_name: string | null;
  phone:               string | null;
  email:               string | null;
  address_line_1:      string | null;
  postal_code:         string | null;
  city:                string | null;
  store_id:            string | null;
  storeName:           string | null;
  storeCode:           string | null;
  status:              string;
};

type Store = { id: string; name: string; code: string };

export type ClientDrawerProps = {
  open:    boolean;
  onClose: () => void;
  client:  ClientData | null;
  stores:  Store[];
  onSaved: (client: ClientData) => void;
};

const EMPTY: Omit<ClientData, "id" | "storeName" | "storeCode"> = {
  name: "", code: "", billing_name: "", representative_name: "",
  phone: "", email: "", address_line_1: "", postal_code: "", city: "",
  store_id: null, status: "prospect",
};

function Field({ label, value, onChange, placeholder, type = "text", required = false, mono = false, uppercase = false }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean; mono?: boolean; uppercase?: boolean;
}) {
  return (
    <div>
      <label className="label-field" style={{ color: required ? "var(--c-blue-primary)" : undefined }}>
        {label}{required && <span style={{ color: "var(--c-danger)" }}> *</span>}
      </label>
      <input
        className="input-lysma"
        style={{ fontFamily: mono ? "monospace" : "inherit", textTransform: uppercase ? "uppercase" : "none" }}
        type={type} value={value}
        onChange={(e) => onChange(uppercase ? e.target.value.toUpperCase() : e.target.value)}
        placeholder={placeholder} autoComplete="off" autoCorrect="off" spellCheck={false}
      />
    </div>
  );
}

export default function ClientDrawer({ open, onClose, client, stores, onSaved }: ClientDrawerProps) {
  const isNew = !client;
  const [form,    setForm]    = useState({ ...EMPTY, ...client });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [tab,     setTab]     = useState<"identite" | "contact" | "adresse">("identite");

  useEffect(() => {
    if (open) { setForm({ ...EMPTY, ...client }); setError(""); setTab("identite"); }
  }, [open, client]);

  function set(field: string, value: string | null) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  const missing = {
    identite: !form.name || !form.code,
    contact:  !form.phone && !form.email,
    adresse:  !form.address_line_1 || !form.postal_code || !form.city,
  };

  async function handleSave(finaliser = false) {
    if (!form.name.trim()) { setError("Le nom du client est obligatoire."); return; }
    setError(""); setLoading(true);
    try {
      const payload = { ...form, status: finaliser ? "client" : (form.status || "prospect") };
      let res: Response;
      if (isNew) {
        res = await fetch("/api/atc/clients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } else {
        res = await fetch(`/api/atc/clients/${client!.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      const data = await res.json();
      if (!res.ok || !data.success) { setError(data.message || "Erreur."); return; }
      const saved: ClientData = {
        ...data.client,
        storeName: data.client.stores?.name ?? null,
        storeCode: data.client.stores?.code ?? null,
        store_id:  data.client.store_id ?? null,
      };
      onSaved(saved);
      onClose();
    } catch { setError("Erreur réseau."); }
    finally { setLoading(false); }
  }

  const isProspect = form.status === "prospect";
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.35)", zIndex: 40, backdropFilter: "blur(2px)" }} />

      {/* Drawer */}
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(540px, 100vw)", zIndex: 50, background: "var(--c-bg)", boxShadow: "-8px 0 40px rgba(15,23,42,0.12)", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ padding: "1.5rem 1.75rem", background: "linear-gradient(135deg,rgba(10,77,155,0.06),rgba(30,115,216,0.03))", borderBottom: "1px solid var(--c-border)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
            <div>
              <p style={{ margin: "0 0 0.25rem", fontSize: "var(--font-xs)", fontWeight: 800, color: "var(--c-blue-primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {isNew ? "Nouveau prospect" : isProspect ? "Fiche prospect" : "Fiche client"}
              </p>
              <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "var(--c-text)" }}>
                {isNew ? "Créer un prospect" : form.name || "—"}
              </h2>
              {!isNew && (
                <span className={`badge-lysma ${isProspect ? "badge-yellow" : "badge-green"}`} style={{ marginTop: "0.375rem" }}>
                  {isProspect ? "Prospect" : "Client actif"}
                </span>
              )}
            </div>
            <button type="button" onClick={onClose} className="btn-ghost"
              style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--c-border)", padding: 0, flexShrink: 0 }}>
              <X size={16} strokeWidth={2} />
            </button>
          </div>

          {/* Onglets */}
          <div style={{ display: "flex", gap: "0.375rem", marginTop: "1rem", flexWrap: "wrap" }}>
            {(["identite", "contact", "adresse"] as const).map((t) => {
              const labels = { identite: "Identité", contact: "Contact", adresse: "Adresse" };
              const hasMissing = missing[t];
              return (
                <button key={t} type="button" onClick={() => setTab(t)}
                  style={{ padding: "0.35rem 0.875rem", borderRadius: "0.75rem", border: "1px solid", borderColor: tab === t ? "var(--c-blue-primary)" : hasMissing ? "#fde68a" : "var(--c-border)", background: tab === t ? "rgba(10,77,155,0.08)" : hasMissing ? "#fffbeb" : "rgba(255,255,255,0.8)", color: tab === t ? "var(--c-blue-primary)" : hasMissing ? "#b45309" : "var(--c-text)", fontWeight: tab === t ? 700 : 500, fontSize: "var(--font-sm)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  {hasMissing && tab !== t && <AlertTriangle size={11} strokeWidth={2.5} />}
                  {labels[t]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu */}
        <div style={{ flex: 1, padding: "1.5rem 1.75rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {tab === "identite" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p className="label-secondary" style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>Identité</p>
              <Field label="Nom du client" value={form.name} onChange={(v) => set("name", v)} placeholder="EX: GARAGE MARTIN" required uppercase />
              <div className="atc-grid-2">
                <Field label="Code client" value={form.code ?? ""} onChange={(v) => set("code", v)} placeholder="EX: CLI001" mono uppercase />
                <div>
                  <label className="label-field">Magasin associé</label>
                  <select className="select-lysma" value={form.store_id ?? ""} onChange={(e) => set("store_id", e.target.value || null)}>
                    <option value="">— Aucun —</option>
                    {stores.map((s) => <option key={s.id} value={s.id}>{s.code} · {s.name}</option>)}
                  </select>
                </div>
              </div>
              <Field label="Nom de facturation" value={form.billing_name ?? ""} onChange={(v) => set("billing_name", v)} placeholder="EX: GARAGE MARTIN SAS" uppercase />
              <Field label="Nom du gérant" value={form.representative_name ?? ""} onChange={(v) => set("representative_name", v)} placeholder="EX: JEAN MARTIN" uppercase />
            </div>
          )}

          {tab === "contact" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p className="label-secondary" style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>Contact</p>
              <Field label="Téléphone" value={form.phone ?? ""} onChange={(v) => set("phone", v)} placeholder="06 12 34 56 78" type="tel" />
              <Field label="Email" value={form.email ?? ""} onChange={(v) => set("email", v)} placeholder="contact@garage.fr" type="email" />
            </div>
          )}

          {tab === "adresse" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p className="label-secondary" style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>Adresse</p>
              <Field label="Adresse" value={form.address_line_1 ?? ""} onChange={(v) => set("address_line_1", v)} placeholder="EX: 12 RUE DE LA PAIX" uppercase />
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.875rem" }}>
                <Field label="Code postal" value={form.postal_code ?? ""} onChange={(v) => set("postal_code", v)} placeholder="75001" />
                <Field label="Ville" value={form.city ?? ""} onChange={(v) => set("city", v)} placeholder="EX: PARIS" uppercase />
              </div>
            </div>
          )}

          {/* Complétude */}
          <div className="card-section">
            <p className="label-secondary" style={{ marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Complétude de la fiche</p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {[
                { label: "Nom",       ok: !!form.name },
                { label: "Code",      ok: !!form.code },
                { label: "Gérant",    ok: !!form.representative_name },
                { label: "Téléphone", ok: !!form.phone },
                { label: "Email",     ok: !!form.email },
                { label: "Adresse",   ok: !!form.address_line_1 },
                { label: "Ville",     ok: !!form.city },
                { label: "Magasin",   ok: !!form.store_id },
              ].map(({ label, ok }) => (
                <span key={label} className={`badge-lysma ${ok ? "badge-green" : "badge-red"}`}>
                  {ok ? <CheckCircle2 size={10} strokeWidth={2.5} /> : "✗"} {label}
                </span>
              ))}
            </div>
          </div>

          {error && (
            <div className="alert-warning">
              <AlertTriangle size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: "1px" }} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "1.25rem 1.75rem", borderTop: "1px solid var(--c-border)", background: "rgba(255,255,255,0.9)", flexShrink: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {isProspect && !isNew && (
            <button type="button" disabled={loading} onClick={() => handleSave(true)}
              style={{ width: "100%", padding: "0.875rem", borderRadius: "var(--r-md)", background: loading ? "var(--c-text-muted)" : "linear-gradient(135deg,#059669,#10b981)", border: "none", color: "#fff", fontWeight: 700, fontSize: "var(--font-md)", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 8px 20px rgba(5,150,105,0.2)" }}>
              Finaliser — convertir en client actif
            </button>
          )}
          <div style={{ display: "flex", gap: "0.625rem" }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
              Annuler
            </button>
            <button type="button" disabled={loading || !form.name.trim()} onClick={() => handleSave(false)} className="btn-primary"
              style={{ flex: 2, opacity: loading || !form.name.trim() ? 0.5 : 1, cursor: loading || !form.name.trim() ? "not-allowed" : "pointer" }}>
              {loading ? "Enregistrement..." : isNew ? "Créer le prospect" : "Enregistrer les modifications"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}