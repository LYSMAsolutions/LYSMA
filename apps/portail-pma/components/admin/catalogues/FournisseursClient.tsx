"use client";

import Link from "next/link";
import { useState } from "react";
import EntityModal from "@/components/admin/modals/EntityModal";

const inp: React.CSSProperties = { width: "100%", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #dce5f0", background: "rgba(255,255,255,0.92)", fontSize: "0.875rem", color: "#0f172a", outline: "none" };
const lbl: React.CSSProperties = { display: "block", marginBottom: "0.4rem", fontSize: "0.8rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" };
const row2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" };
const hint: React.CSSProperties = { margin: "0.3rem 0 0", fontSize: "0.75rem", color: "#94a3b8" };
const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };
const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };

type Supplier = {
  id: string; code: string; name: string; email: string | null; phone: string | null;
  website: string | null; notes: string | null; is_active: boolean;
  _count: { catalogue_items: number; catalogues: number };
};

export default function FournisseursClient({
  initialSuppliers, adminBase,
}: {
  initialSuppliers: Supplier[];
  adminBase: string;
}) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);

  // ── Création
  const [createOpen, setCreateOpen] = useState(false);
  const [cCode,      setCCode]      = useState("");
  const [cName,      setCName]      = useState("");
  const [cEmail,     setCEmail]     = useState("");
  const [cPhone,     setCPhone]     = useState("");
  const [cWebsite,   setCWebsite]   = useState("");
  const [cNotes,     setCNotes]     = useState("");
  const [cLoading,   setCLoading]   = useState(false);
  const [cError,     setCError]     = useState("");

  // ── Édition
  const [editSup,  setEditSup]  = useState<Supplier | null>(null);
  const [eCode,    setECode]    = useState("");
  const [eName,    setEName]    = useState("");
  const [eEmail,   setEEmail]   = useState("");
  const [ePhone,   setEPhone]   = useState("");
  const [eWebsite, setEWebsite] = useState("");
  const [eNotes,   setENotes]   = useState("");
  const [eActive,  setEActive]  = useState(true);
  const [eLoading, setELoading] = useState(false);
  const [eError,   setEError]   = useState("");

  function openEdit(s: Supplier) {
    setEditSup(s);
    setECode(s.code); setEName(s.name); setEEmail(s.email || "");
    setEPhone(s.phone || ""); setEWebsite(s.website || "");
    setENotes(s.notes || ""); setEActive(s.is_active);
    setEError("");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault(); setCLoading(true); setCError("");
    try {
      const res = await fetch("/api/admin/catalogues/fournisseurs", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cCode, name: cName, email: cEmail, phone: cPhone, website: cWebsite, notes: cNotes }),
      });
      const data = await res.json();
      if (!res.ok) { setCError(data.message || "Erreur."); return; }
      window.location.reload();
    } catch { setCError("Erreur réseau."); }
    finally { setCLoading(false); }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editSup) return;
    setELoading(true); setEError("");
    try {
      const res = await fetch(`/api/admin/catalogues/fournisseurs/${editSup.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: eCode, name: eName,
          email: eEmail || null, phone: ePhone || null,
          website: eWebsite || null, notes: eNotes || null,
          is_active: eActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setEError(data.message || "Erreur."); return; }
      setSuppliers((prev) => prev.map((s) => s.id === editSup.id
        ? { ...s, code: eCode, name: eName, email: eEmail || null, phone: ePhone || null, website: eWebsite || null, notes: eNotes || null, is_active: eActive }
        : s
      ));
      setEditSup(null);
    } catch { setEError("Erreur réseau."); }
    finally { setELoading(false); }
  }

  const codeChanged = editSup && eCode !== editSup.code;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button type="button" onClick={() => setCreateOpen(true)} style={{ display: "inline-flex", padding: "0.65rem 1.25rem", borderRadius: "0.875rem", background: "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: "pointer", boxShadow: "0 6px 16px rgba(30,115,216,0.2)" }}>
          + Ajouter un fournisseur
        </button>
      </div>

      <div style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Code</th>
              <th style={th}>Nom</th>
              <th style={th}>Email</th>
              <th style={th}>Téléphone</th>
              <th style={th}>Site web</th>
              <th style={{ ...th, textAlign: "center" }}>Produits</th>
              <th style={th}>Statut</th>
              <th style={{ ...th, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id}>
                <td style={{ ...tdM, fontFamily: "monospace", fontWeight: 700 }}>{s.code}</td>
                <td style={{ ...td, fontWeight: 700 }}>{s.name}</td>
                <td style={tdM}>{s.email || "—"}</td>
                <td style={tdM}>{s.phone || "—"}</td>
                <td style={tdM}>
                  {s.website
                    ? <a href={s.website} target="_blank" rel="noopener noreferrer" style={{ color: "#0a4d9b", textDecoration: "none", fontSize: "0.82rem" }}>Voir ↗</a>
                    : "—"}
                </td>
                <td style={{ ...td, textAlign: "center" }}>
                  <Link href={`${adminBase}/catalogues/produits?supplier_id=${s.id}&supplier_name=${encodeURIComponent(s.name)}`} style={{ fontWeight: 700, color: "#0a4d9b", textDecoration: "none" }}>
                    {s._count.catalogue_items} →
                  </Link>
                </td>
                <td style={td}>
                  <span style={{ display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: s.is_active ? "#f0fdf4" : "#fef2f2", color: s.is_active ? "#15803d" : "#dc2626", border: s.is_active ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
                    {s.is_active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td style={{ ...td, textAlign: "right" }}>
                  <button type="button" onClick={() => openEdit(s)} style={{ display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, color: "#475569", border: "1px solid #e2e8f0", background: "rgba(255,255,255,0.8)", cursor: "pointer" }}>
                    Modifier
                  </button>
                </td>
              </tr>
            ))}
            {!suppliers.length && (
              <tr><td colSpan={8} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2.5rem" }}>Aucun fournisseur.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal création */}
      <EntityModal open={createOpen} onClose={() => setCreateOpen(false)} title="Créer un fournisseur" description="Ajouter une source catalogue au distributeur.">
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={row2}>
            <div>
              <label style={lbl}>Code *</label>
              <input style={inp} value={cCode} onChange={(e) => setCCode(e.target.value.toUpperCase())} required placeholder="ex: BOSCH" />
              <p style={hint}>Identifiant unique. Utilisé dans les imports CSV.</p>
            </div>
            <div>
              <label style={lbl}>Nom *</label>
              <input style={inp} value={cName} onChange={(e) => setCName(e.target.value)} required placeholder="ex: Bosch France" />
            </div>
          </div>
          <div style={row2}>
            <div><label style={lbl}>Email</label><input style={inp} type="email" value={cEmail} onChange={(e) => setCEmail(e.target.value)} /></div>
            <div><label style={lbl}>Téléphone</label><input style={inp} value={cPhone} onChange={(e) => setCPhone(e.target.value)} /></div>
          </div>
          <div><label style={lbl}>Site web</label><input style={inp} value={cWebsite} onChange={(e) => setCWebsite(e.target.value)} placeholder="https://..." /></div>
          <div><label style={lbl}>Notes internes</label><textarea style={{ ...inp, minHeight: "72px", resize: "vertical" }} value={cNotes} onChange={(e) => setCNotes(e.target.value)} /></div>
          {cError && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{cError}</div>}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button type="button" onClick={() => setCreateOpen(false)} style={{ padding: "0.65rem 1.25rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", color: "#475569" }}>Annuler</button>
            <button type="submit" disabled={cLoading} style={{ padding: "0.65rem 1.75rem", borderRadius: "0.875rem", background: cLoading ? "#94a3b8" : "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: cLoading ? "not-allowed" : "pointer" }}>
              {cLoading ? "Création..." : "Créer"}
            </button>
          </div>
        </form>
      </EntityModal>

      {/* Modal édition */}
      <EntityModal open={!!editSup} onClose={() => setEditSup(null)} title="Modifier le fournisseur" description={editSup?.name}>
        {editSup && (
          <form onSubmit={handleEdit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={row2}>
              <div>
                <label style={lbl}>Code fournisseur *</label>
                <input style={inp} value={eCode} onChange={(e) => setECode(e.target.value.toUpperCase())} required />
                <p style={hint}>Utilisé dans les imports CSV.</p>
              </div>
              <div>
                <label style={lbl}>Nom *</label>
                <input style={inp} value={eName} onChange={(e) => setEName(e.target.value)} required />
              </div>
            </div>

            {/* Avertissement si le code change */}
            {codeChanged && (
              <div style={{ padding: "0.875rem 1rem", borderRadius: "0.875rem", background: "#fffbeb", border: "1px solid #fde68a" }}>
                <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, color: "#b45309" }}>⚠️ Modification du code</p>
                <p style={{ margin: "0.3rem 0 0", fontSize: "0.78rem", color: "#92400e" }}>
                  L'ancien code <strong>{editSup.code}</strong> sera remplacé par <strong>{eCode}</strong> dans toutes les lignes d'import existantes.
                </p>
              </div>
            )}

            <div style={row2}>
              <div><label style={lbl}>Email</label><input style={inp} type="email" value={eEmail} onChange={(e) => setEEmail(e.target.value)} /></div>
              <div><label style={lbl}>Téléphone</label><input style={inp} value={ePhone} onChange={(e) => setEPhone(e.target.value)} /></div>
            </div>
            <div><label style={lbl}>Site web</label><input style={inp} value={eWebsite} onChange={(e) => setEWebsite(e.target.value)} placeholder="https://..." /></div>
            <div><label style={lbl}>Notes internes</label><textarea style={{ ...inp, minHeight: "72px", resize: "vertical" }} value={eNotes} onChange={(e) => setENotes(e.target.value)} /></div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>
              <input type="checkbox" checked={eActive} onChange={(e) => setEActive(e.target.checked)} /> Fournisseur actif
            </label>
            {eError && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{eError}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button type="button" onClick={() => setEditSup(null)} style={{ padding: "0.65rem 1.25rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", color: "#475569" }}>Annuler</button>
              <button type="submit" disabled={eLoading} style={{ padding: "0.65rem 1.75rem", borderRadius: "0.875rem", background: eLoading ? "#94a3b8" : "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: eLoading ? "not-allowed" : "pointer" }}>
                {eLoading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        )}
      </EntityModal>
    </div>
  );
}