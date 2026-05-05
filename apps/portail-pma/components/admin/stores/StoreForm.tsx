"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RdmItem = { id: string; first_name: string; last_name: string; email: string };

const inp: React.CSSProperties = { width: "100%", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #dce5f0", background: "rgba(255,255,255,0.92)", fontSize: "0.9rem", color: "#0f172a", outline: "none" };
const lbl: React.CSSProperties = { display: "block", marginBottom: "0.4rem", fontSize: "0.8rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" };
const row2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" };
const fld: React.CSSProperties  = { display: "flex", flexDirection: "column" };
const hint: React.CSSProperties = { margin: "0.3rem 0 0", fontSize: "0.75rem", color: "#94a3b8" };

const STORE_TYPES = [
  { value: "standard", label: "Standard",       desc: "Magasin réseau standard"             },
  { value: "sav",      label: "SAV / Matériel",  desc: "Accès catalogue matériel uniquement" },
];

export default function StoreForm({
  store, rdms, distributor, redirectBase,
}: {
  store?: {
    id?: string; code?: string; name?: string; email?: string | null; phone?: string | null;
    address_line_1?: string | null; address_line_2?: string | null; postal_code?: string | null;
    city?: string | null; is_active?: boolean; rdmId?: string | null; store_type?: string;
    internal_code?: string | null;
  };
  rdms: RdmItem[];
  distributor: string;
  redirectBase: string;
}) {
  const router = useRouter();
  const isEdit = !!store?.id;

  const [code,         setCode]         = useState(store?.code         || "");
  const [internalCode, setInternalCode] = useState(store?.internal_code || "");
  const [name,         setName]         = useState(store?.name         || "");
  const [email,        setEmail]        = useState(store?.email        || "");
  const [phone,        setPhone]        = useState(store?.phone        || "");
  const [addr1,        setAddr1]        = useState(store?.address_line_1 || "");
  const [addr2,        setAddr2]        = useState(store?.address_line_2 || "");
  const [postal,       setPostal]       = useState(store?.postal_code  || "");
  const [city,         setCity]         = useState(store?.city         || "");
  const [isActive,     setIsActive]     = useState(store?.is_active ?? true);
  const [rdmId,        setRdmId]        = useState(store?.rdmId        || "");
  const [storeType,    setStoreType]    = useState(store?.store_type   || "standard");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");

    const url    = isEdit ? `/api/admin/stores/${store!.id}` : `/api/admin/stores`;
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code, name, email, phone, addr1, addr2, postal, city,
          isActive, rdmId: rdmId || null, storeType,
          internalCode: internalCode || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur."); return; }
      router.push(isEdit ? `${redirectBase}/${store!.id}` : redirectBase);
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
        <div style={fld}><label style={lbl}>Code magasin *</label><input style={inp} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required /></div>
        <div style={fld}><label style={lbl}>Nom *</label><input style={inp} value={name} onChange={(e) => setName(e.target.value)} required /></div>
      </div>

      <div style={fld}>
        <label style={lbl}>Code interne</label>
        <input style={inp} value={internalCode} onChange={(e) => setInternalCode(e.target.value)} />
        <p style={hint}>Utilisé dans les imports clients (colonne <code>assigned_store_code</code>). Unique par magasin.</p>
      </div>

      <div style={row2}>
        <div style={fld}><label style={lbl}>Email magasin</label><input style={inp} type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div style={fld}><label style={lbl}>Téléphone</label><input style={inp} value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
      </div>

      <div style={fld}><label style={lbl}>Adresse ligne 1</label><input style={inp} value={addr1} onChange={(e) => setAddr1(e.target.value)} /></div>
      <div style={fld}><label style={lbl}>Adresse ligne 2</label><input style={inp} value={addr2} onChange={(e) => setAddr2(e.target.value)} /></div>

      <div style={row2}>
        <div style={fld}><label style={lbl}>Code postal</label><input style={inp} value={postal} onChange={(e) => setPostal(e.target.value)} /></div>
        <div style={fld}><label style={lbl}>Ville</label><input style={inp} value={city} onChange={(e) => setCity(e.target.value)} /></div>
      </div>

      <div style={fld}>
        <label style={lbl}>RDM responsable</label>
        <select style={{ ...inp, cursor: "pointer" }} value={rdmId} onChange={(e) => setRdmId(e.target.value)}>
          <option value="">— Aucun RDM assigné —</option>
          {rdms.map((r) => <option key={r.id} value={r.id}>{`${r.first_name} ${r.last_name}`.trim()} · {r.email}</option>)}
        </select>
      </div>

      <div style={fld}>
        <label style={lbl}>Type de magasin</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.25rem" }}>
          {STORE_TYPES.map((t) => (
            <label key={t.value} onClick={() => setStoreType(t.value)} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", borderRadius: "0.875rem", border: "1px solid", borderColor: storeType === t.value ? "#bfdbfe" : "#e2e8f0", background: storeType === t.value ? "rgba(239,246,255,0.6)" : "#f8fafc", cursor: "pointer", transition: "all 0.18s" }}>
              <input type="radio" name="store_type_ui" value={t.value} checked={storeType === t.value} onChange={() => setStoreType(t.value)} style={{ accentColor: "#0a4d9b" }} />
              <div>
                <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#0f172a" }}>{t.label}</p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>{t.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {isEdit && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", borderRadius: "0.875rem", background: "rgba(248,251,255,0.9)", border: "1px solid rgba(217,227,240,0.8)" }}>
          <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
          <label htmlFor="isActive" style={{ fontSize: "0.875rem", fontWeight: 600, color: "#334155", cursor: "pointer" }}>Magasin actif</label>
        </div>
      )}

      {error && <div style={{ padding: "0.875rem 1rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{error}</div>}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "0.5rem" }}>
        <button type="button" onClick={() => router.back()} style={{ padding: "0.75rem 1.25rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", color: "#475569" }}>
          Annuler
        </button>
        <button type="submit" disabled={loading} style={{ padding: "0.75rem 1.75rem", borderRadius: "0.875rem", background: loading ? "#94a3b8" : "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 8px 20px rgba(30,115,216,0.25)" }}>
          {loading ? "Enregistrement..." : isEdit ? "Enregistrer" : "Créer le magasin"}
        </button>
      </div>
    </form>
  );
}