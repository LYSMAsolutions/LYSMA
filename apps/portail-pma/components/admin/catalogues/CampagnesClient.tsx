"use client";

import { useState } from "react";
import EntityModal from "@/components/admin/modals/EntityModal";

const CAMPAIGN_TYPES = [
  { value: "promo",                label: "Promotion",             color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
  { value: "operation_commerciale",label: "Opération commerciale", color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
  { value: "fournisseur",          label: "Fournisseur",           color: "#0a4d9b", bg: "#eff6ff", border: "#bfdbfe" },
  { value: "mise_en_avant",        label: "Mise en avant",         color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
];

function TypeBadge({ type }: { type: string }) {
  const t = CAMPAIGN_TYPES.find((x) => x.value === type) ?? { label: type, color: "#64748b", bg: "#f1f5f9", border: "#e2e8f0" };
  return (
    <span style={{ display: "inline-flex", padding: "0.25rem 0.6rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: t.bg, color: t.color, border: `1px solid ${t.border}`, whiteSpace: "nowrap" }}>
      {t.label}
    </span>
  );
}

function formatDate(val: string | null) {
  if (!val) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short" }).format(new Date(val));
}

type Campaign = {
  id: string;
  code: string;
  name: string;
  campaign_type: string;
  description: string | null;
  billing_code: string | null;
  valid_from: string | null;
  valid_to: string | null;
  is_active: boolean;
  catalogues: { id: string; code: string; name: string } | null;
  _count: { catalogue_item_campaigns: number };
};

type CatalogueItem = { id: string; code: string; name: string; catalogue_type: string };

const inp: React.CSSProperties = { width: "100%", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #dce5f0", background: "rgba(255,255,255,0.92)", fontSize: "0.9rem", color: "#0f172a", outline: "none" };
const lbl: React.CSSProperties = { display: "block", marginBottom: "0.4rem", fontSize: "0.8rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" };
const row2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" };
const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };
const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };

export default function CampagnesClient({
  initialCampaigns, catalogues,
}: {
  initialCampaigns: Campaign[];
  catalogues: CatalogueItem[];
}) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [open,      setOpen]      = useState(false);
  const [code,      setCode]      = useState("");
  const [name,      setName]      = useState("");
  const [type,      setType]      = useState("promo");
  const [desc,      setDesc]      = useState("");
  const [billing,   setBilling]   = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo,   setValidTo]   = useState("");
  const [catId,     setCatId]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const now = new Date();

  function isExpired(c: Campaign) {
    return !!(c.valid_to && new Date(c.valid_to) < now);
  }

  function reset() {
    setCode(""); setName(""); setType("promo"); setDesc(""); setBilling(""); setValidFrom(""); setValidTo(""); setCatId(""); setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/catalogues/campagnes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code, name, campaign_type: type,
          description:  desc     || null,
          billing_code: billing  || null,
          valid_from:   validFrom || null,
          valid_to:     validTo   || null,
          catalogue_id: catId    || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur."); return; }
      setOpen(false);
      reset();
      window.location.reload();
    } catch { setError("Erreur réseau."); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button type="button" onClick={() => setOpen(true)} style={{ padding: "0.65rem 1.25rem", borderRadius: "0.875rem", background: "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: "pointer", boxShadow: "0 6px 16px rgba(30,115,216,0.2)" }}>
          + Ajouter une campagne
        </button>
      </div>

      <div style={{ borderRadius: "1rem", border: "1px solid rgba(217,227,240,0.8)", overflow: "hidden", background: "rgba(255,255,255,0.6)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
          <thead>
            <tr>
              <th style={th}>Code</th>
              <th style={th}>Nom</th>
              <th style={th}>Type</th>
              <th style={th}>Catalogue lié</th>
              <th style={th}>Code fact.</th>
              <th style={th}>Validité</th>
              <th style={{ ...th, textAlign: "center" }}>Produits</th>
              <th style={th}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => {
              const expired = isExpired(c);
              return (
                <tr key={c.id}>
                  <td style={{ ...tdM, fontFamily: "monospace", fontWeight: 700 }}>{c.code}</td>
                  <td style={{ ...td, fontWeight: 700 }}>{c.name}</td>
                  <td style={td}><TypeBadge type={c.campaign_type} /></td>
                  <td style={tdM}>{c.catalogues ? `${c.catalogues.code} · ${c.catalogues.name}` : "—"}</td>
                  <td style={{ ...tdM, fontFamily: "monospace" }}>{c.billing_code || "—"}</td>
                  <td style={tdM}>
                    {c.valid_from || c.valid_to
                      ? `${formatDate(c.valid_from)} → ${formatDate(c.valid_to)}`
                      : "Sans limite"}
                  </td>
                  <td style={{ ...td, textAlign: "center", fontWeight: 700, color: "#0a4d9b" }}>{c._count.catalogue_item_campaigns}</td>
                  <td style={td}>
                    {expired
                      ? <span style={{ display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}>Expirée</span>
                      : <span style={{ display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}>Active</span>
                    }
                  </td>
                </tr>
              );
            })}
            {!campaigns.length && (
              <tr><td colSpan={8} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2.5rem" }}>Aucune campagne. Créez-en une pour démarrer.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <EntityModal open={open} onClose={() => { reset(); setOpen(false); }} title="Créer une campagne" description="Une campagne regroupe des produits avec des prix ou remises spécifiques sur une période.">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={row2}>
            <div><label style={lbl}>Code *</label><input style={inp} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required placeholder="ex: PROMO-ETE-2025" /></div>
            <div><label style={lbl}>Nom *</label><input style={inp} value={name} onChange={(e) => setName(e.target.value)} required placeholder="ex: Promo été 2025" /></div>
          </div>

          <div>
            <label style={lbl}>Type *</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {CAMPAIGN_TYPES.map((t) => (
                <label key={t.value} onClick={() => setType(t.value)} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: `1px solid ${type === t.value ? t.border : "#e2e8f0"}`, background: type === t.value ? t.bg : "#f8fafc", cursor: "pointer", transition: "all 0.15s" }}>
                  <input type="radio" name="campaign_type" value={t.value} checked={type === t.value} onChange={() => setType(t.value)} style={{ accentColor: t.color }} />
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: type === t.value ? t.color : "#334155" }}>{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={lbl}>Catalogue lié</label>
            <select style={{ ...inp, cursor: "pointer" }} value={catId} onChange={(e) => setCatId(e.target.value)}>
              <option value="">— Aucun catalogue —</option>
              {catalogues.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <p style={{ margin: "0.3rem 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>Optionnel — permet de filtrer les produits éligibles.</p>
          </div>

          <div style={row2}>
            <div><label style={lbl}>Date de début</label><input style={inp} type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} /></div>
            <div><label style={lbl}>Date de fin</label><input style={inp} type="date" value={validTo} onChange={(e) => setValidTo(e.target.value)} /></div>
          </div>
          <p style={{ margin: "-0.75rem 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>Une campagne sans date de fin reste visible indéfiniment. Passée la date de fin, elle disparaît automatiquement du portail ATC/CDV.</p>

          <div><label style={lbl}>Code de facturation</label><input style={inp} value={billing} onChange={(e) => setBilling(e.target.value)} placeholder="ex: CAMP-ETE-25" /></div>

          <div><label style={lbl}>Description interne</label><textarea style={{ ...inp, minHeight: "72px", resize: "vertical" }} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Notes visibles uniquement par l'admin..." /></div>

          {error && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{error}</div>}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button type="button" onClick={() => { reset(); setOpen(false); }} style={{ padding: "0.65rem 1.25rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", color: "#475569" }}>Annuler</button>
            <button type="submit" disabled={loading} style={{ padding: "0.65rem 1.75rem", borderRadius: "0.875rem", background: loading ? "#94a3b8" : "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Création..." : "Créer la campagne"}
            </button>
          </div>
        </form>
      </EntityModal>
    </div>
  );
}