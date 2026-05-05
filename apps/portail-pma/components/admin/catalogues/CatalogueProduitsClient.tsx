"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import EntityModal from "@/components/admin/modals/EntityModal";

const FAMILIES = [
  { value: "fournisseur",          label: "Fournisseur",          color: "#0a4d9b", bg: "#eff6ff", border: "#bfdbfe" },
  { value: "promo",                label: "Promotion",            color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
  { value: "operation_commerciale",label: "Op. commerciale",      color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
  { value: "interne",              label: "Interne",              color: "#475569", bg: "#f1f5f9", border: "#e2e8f0" },
  { value: "outillage",            label: "Outillage",            color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  { value: "materiel",             label: "Matériel",             color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
];

function FamilyBadge({ family }: { family: string }) {
  const f = FAMILIES.find((x) => x.value === family) ?? { label: family, color: "#64748b", bg: "#f1f5f9", border: "#e2e8f0" };
  return <span style={{ display: "inline-flex", padding: "0.25rem 0.6rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: f.bg, color: f.color, border: `1px solid ${f.border}`, whiteSpace: "nowrap" }}>{f.label}</span>;
}

type Item = {
  id: string; designation: string; internal_code: string | null; supplier_reference: string | null;
  billing_code: string | null; brand: string | null; item_family: string; unit_price_ht: unknown;
  stock_quantity: unknown; image_url: string | null; is_active: boolean; is_featured: boolean;
  suppliers: { id: string; code: string; name: string } | null;
  catalogues: { id: string; code: string; name: string; catalogue_type: string; valid_to: string | null } | null;
};
type SupplierItem = { id: string; code: string; name: string };
type CatalogueItem = { id: string; code: string; name: string; catalogue_type: string };

const inp: React.CSSProperties = { width: "100%", padding: "0.7rem 1rem", borderRadius: "0.875rem", border: "1px solid #dce5f0", background: "rgba(255,255,255,0.92)", fontSize: "0.875rem", color: "#0f172a", outline: "none" };
const lbl: React.CSSProperties = { display: "block", marginBottom: "0.35rem", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" };
const row2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" };
const row3: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" };
const th: React.CSSProperties = { padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.8rem 1rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };
const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.8rem" };

function fmt(val: unknown) { if (val === null || val === undefined) return "—"; const n = Number(val); return isNaN(n) ? "—" : n.toFixed(2) + " €"; }
function fmtStock(val: unknown) { if (val === null || val === undefined) return "—"; const n = Number(val); return isNaN(n) ? "—" : n % 1 === 0 ? String(n) : n.toFixed(1); }

export default function CatalogueProduitsClient({ initialItems, suppliers: initialSuppliers, catalogues, distributorId, prefilterSupplierId }: {
  initialItems: Item[]; suppliers: SupplierItem[]; catalogues: CatalogueItem[]; distributorId: string; prefilterSupplierId?: string;
}) {
  // ── hooks INSIDE the component
  const router = useRouter();

  const [search,         setSearch]         = useState("");
  const [familyFilter,   setFamilyFilter]   = useState("");
  const [statusFilter,   setStatusFilter]   = useState("");
  const [items,          setItems]          = useState<Item[]>(initialItems);
  const [suppliers,      setSuppliers]      = useState<SupplierItem[]>(initialSuppliers);

  // ── Création produit
  const [createOpen, setCreateOpen] = useState(false);
  const [cDesg,      setCDesg]      = useState("");
  const [cFamily,    setCFamily]    = useState("fournisseur");
  const [cIntCode,   setCIntCode]   = useState("");
  const [cSupRef,    setCSupRef]    = useState("");
  const [cBilling,   setCBilling]   = useState("");
  const [cBrand,     setCBrand]     = useState("");
  const [cPriceHT,   setCPriceHT]   = useState("");
  const [cStock,     setCStock]     = useState("");
  const [cImageUrl,  setCImageUrl]  = useState("");
  const [cSupplier,  setCSupplier]  = useState("");
  const [cCatalogue, setCCatalogue] = useState("");
  const [cLoading,   setCLoading]   = useState(false);
  const [cError,     setCError]     = useState("");

  // ── Création fournisseur inline
  const [newSupOpen, setNewSupOpen] = useState(false);
  const [nsCode,     setNsCode]     = useState("");
  const [nsName,     setNsName]     = useState("");
  const [nsEmail,    setNsEmail]    = useState("");
  const [nsLoading,  setNsLoading]  = useState(false);
  const [nsError,    setNsError]    = useState("");

  // ── Édition
  const [editItem,  setEditItem]  = useState<Item | null>(null);
  const [eDesg,     setEDesg]     = useState("");
  const [eIntCode,  setEIntCode]  = useState("");
  const [eSupRef,   setESupRef]   = useState("");
  const [eBilling,  setEBilling]  = useState("");
  const [eBrand,    setEBrand]    = useState("");
  const [ePriceHT,  setEPriceHT]  = useState("");
  const [eStock,    setEStock]    = useState("");
  const [eImageUrl, setEImageUrl] = useState("");
  const [eActive,   setEActive]   = useState(true);
  const [eFeatured, setEFeatured] = useState(false);
  const [eLoading,  setELoading]  = useState(false);
  const [eError,    setEError]    = useState("");

  function openEdit(item: Item) {
    setEditItem(item); setEDesg(item.designation); setEIntCode(item.internal_code || "");
    setESupRef(item.supplier_reference || ""); setEBilling(item.billing_code || "");
    setEBrand(item.brand || "");
    setEPriceHT(item.unit_price_ht !== null ? String(Number(item.unit_price_ht)) : "");
    setEStock(item.stock_quantity !== null ? String(Number(item.stock_quantity)) : "");
    setEImageUrl(item.image_url || ""); setEActive(item.is_active); setEFeatured(item.is_featured); setEError("");
  }

  const filtered = useMemo(() => items.filter((item) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q
      || item.designation.toLowerCase().includes(q)
      || (item.internal_code || "").toLowerCase().includes(q)
      || (item.supplier_reference || "").toLowerCase().includes(q)
      || (item.billing_code || "").toLowerCase().includes(q)
      || (item.brand || "").toLowerCase().includes(q)
      || (item.suppliers?.name || "").toLowerCase().includes(q);
    const matchFamily = !familyFilter || item.item_family === familyFilter;
    const matchStatus = !statusFilter || (statusFilter === "active" ? item.is_active : !item.is_active);
    return matchSearch && matchFamily && matchStatus;
  }), [items, search, familyFilter, statusFilter]);

  async function handleCreateSupplier(e: React.FormEvent) {
    e.preventDefault(); setNsLoading(true); setNsError("");
    try {
      const res = await fetch("/api/admin/catalogues/fournisseurs", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: nsCode, name: nsName, email: nsEmail }),
      });
      const data = await res.json();
      if (!res.ok) { setNsError(data.message || "Erreur."); return; }
      const newSup = { id: data.supplierId, code: nsCode, name: nsName };
      setSuppliers((prev) => [...prev, newSup].sort((a, b) => a.name.localeCompare(b.name)));
      setCSupplier(data.supplierId);
      setNewSupOpen(false); setNsCode(""); setNsName(""); setNsEmail("");
    } catch { setNsError("Erreur réseau."); }
    finally { setNsLoading(false); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault(); setCLoading(true); setCError("");
    try {
      const res = await fetch("/api/admin/catalogues/produits", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designation: cDesg, item_family: cFamily,
          internal_code: cIntCode || null, supplier_reference: cSupRef || null,
          billing_code: cBilling || null, brand: cBrand || null,
          unit_price_ht: cPriceHT ? parseFloat(cPriceHT.replace(",", ".")) : null,
          stock_quantity: cStock ? parseFloat(cStock) : null,
          image_url: cImageUrl || null,
          supplier_id: prefilterSupplierId || cSupplier || null,
          catalogue_id: cCatalogue || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setCError(data.message || "Erreur."); return; }
      setCreateOpen(false);
      router.refresh();
    } catch { setCError("Erreur réseau."); }
    finally { setCLoading(false); }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault(); if (!editItem) return; setELoading(true); setEError("");
    try {
      const res = await fetch(`/api/admin/catalogues/produits/${editItem.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designation: eDesg, internal_code: eIntCode || null,
          supplier_reference: eSupRef || null, billing_code: eBilling || null,
          brand: eBrand || null,
          unit_price_ht: ePriceHT ? parseFloat(ePriceHT.replace(",", ".")) : null,
          stock_quantity: eStock ? parseFloat(eStock) : null,
          image_url: eImageUrl || null, is_active: eActive, is_featured: eFeatured,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setEError(data.message || "Erreur."); return; }
      setItems((prev) => prev.map((i) => i.id === editItem.id ? {
        ...i, designation: eDesg, internal_code: eIntCode || null,
        supplier_reference: eSupRef || null, billing_code: eBilling || null,
        brand: eBrand || null,
        unit_price_ht: ePriceHT ? parseFloat(ePriceHT) : null,
        stock_quantity: eStock ? parseFloat(eStock) : null,
        image_url: eImageUrl || null, is_active: eActive, is_featured: eFeatured,
      } : i));
      setEditItem(null);
    } catch { setEError("Erreur réseau."); }
    finally { setELoading(false); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Filtres */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
        <div>
          <label style={lbl}>Recherche</label>
          <input style={inp} placeholder="Désignation, référence, code, fournisseur..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div>
          <label style={lbl}>Famille</label>
          <select style={{ ...inp, cursor: "pointer" }} value={familyFilter} onChange={(e) => setFamilyFilter(e.target.value)}>
            <option value="">Toutes</option>
            {FAMILIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Statut</label>
          <select style={{ ...inp, cursor: "pointer" }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tous</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>
        <button type="button" onClick={() => setCreateOpen(true)} style={{ padding: "0.7rem 1.25rem", borderRadius: "0.875rem", background: "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: "pointer", boxShadow: "0 8px 20px rgba(30,115,216,0.25)", whiteSpace: "nowrap" }}>
          + Ajouter
        </button>
      </div>

      <p style={{ margin: 0, fontSize: "0.82rem", color: "#94a3b8" }}>
        {filtered.length} produit{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}
      </p>

      {/* Table */}
      <div style={{ borderRadius: "1rem", border: "1px solid rgba(217,227,240,0.8)", overflow: "hidden", background: "rgba(255,255,255,0.6)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
          <thead>
            <tr>
              <th style={th}>Désignation</th>
              <th style={th}>Famille</th>
              <th style={th}>Fournisseur</th>
              <th style={th}>Réf. interne</th>
              <th style={th}>Code fact.</th>
              <th style={{ ...th, textAlign: "right" }}>Prix HT</th>
              <th style={{ ...th, textAlign: "center" }}>Stock</th>
              <th style={th}>Statut</th>
              <th style={{ ...th, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td style={td}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {item.image_url
                      ? <img src={item.image_url} alt={item.designation} style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover", border: "1px solid #e2e8f0", flexShrink: 0 }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      : <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f1f5f9", border: "1px solid #e2e8f0", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>📦</div>
                    }
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: "0.875rem" }}>{item.designation}</p>
                      {item.brand && <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8" }}>{item.brand}</p>}
                    </div>
                  </div>
                </td>
                <td style={td}><FamilyBadge family={item.item_family} /></td>
                <td style={tdM}>{item.suppliers?.name || "—"}</td>
                <td style={{ ...tdM, fontFamily: "monospace" }}>{item.internal_code || "—"}</td>
                <td style={{ ...tdM, fontFamily: "monospace" }}>{item.billing_code || "—"}</td>
                <td style={{ ...td, textAlign: "right", fontWeight: 700, color: "#0a4d9b" }}>{fmt(item.unit_price_ht)}</td>
                <td style={{ ...td, textAlign: "center" }}>
                  {item.stock_quantity !== null
                    ? <span style={{ display: "inline-flex", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: Number(item.stock_quantity) > 0 ? "#f0fdf4" : "#fef2f2", color: Number(item.stock_quantity) > 0 ? "#15803d" : "#dc2626", border: Number(item.stock_quantity) > 0 ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>{fmtStock(item.stock_quantity)}</span>
                    : <span style={{ color: "#94a3b8" }}>—</span>}
                </td>
                <td style={td}>
                  <span style={{ display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: item.is_active ? "#f0fdf4" : "#fef2f2", color: item.is_active ? "#15803d" : "#dc2626", border: item.is_active ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
                    {item.is_active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td style={{ ...td, textAlign: "right" }}>
                  <button type="button" onClick={() => openEdit(item)} style={{ display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, color: "#475569", border: "1px solid #e2e8f0", background: "rgba(255,255,255,0.8)", cursor: "pointer" }}>
                    Modifier
                  </button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={9} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2.5rem" }}>Aucun produit trouvé.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal création produit */}
      <EntityModal open={createOpen} onClose={() => setCreateOpen(false)} title="Ajouter un produit" description="Nouvelle référence dans le catalogue.">
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div><label style={lbl}>Désignation *</label><input style={inp} value={cDesg} onChange={(e) => setCDesg(e.target.value)} required /></div>

          <div style={row2}>
            <div>
              <label style={lbl}>Famille *</label>
              <select style={{ ...inp, cursor: "pointer" }} value={cFamily} onChange={(e) => setCFamily(e.target.value)}>
                {FAMILIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Fournisseur</label>
              {prefilterSupplierId ? (
                <input
                  style={{ ...inp, background: "#f8fafc", color: "#6b7280" }}
                  value={suppliers.find((s) => s.id === prefilterSupplierId)?.name ?? ""}
                  readOnly
                />
              ) : (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <select style={{ ...inp, cursor: "pointer", flex: 1 }} value={cSupplier} onChange={(e) => setCSupplier(e.target.value)}>
                    <option value="">— Aucun —</option>
                    {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <button type="button" onClick={() => setNewSupOpen(true)} title="Créer un nouveau fournisseur" style={{ padding: "0 0.875rem", borderRadius: "0.875rem", border: "1px solid #bfdbfe", background: "#eff6ff", color: "#0a4d9b", fontWeight: 700, fontSize: "1rem", cursor: "pointer", flexShrink: 0 }}>+</button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label style={lbl}>Catalogue</label>
            <select style={{ ...inp, cursor: "pointer" }} value={cCatalogue} onChange={(e) => setCCatalogue(e.target.value)}>
              <option value="">— Aucun —</option>
              {catalogues.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div style={row3}>
            <div><label style={lbl}>Réf. interne</label><input style={inp} value={cIntCode} onChange={(e) => setCIntCode(e.target.value)} /></div>
            <div><label style={lbl}>Réf. fournisseur</label><input style={inp} value={cSupRef} onChange={(e) => setCSupRef(e.target.value)} /></div>
            <div><label style={lbl}>Code facturation</label><input style={inp} value={cBilling} onChange={(e) => setCBilling(e.target.value)} /></div>
          </div>

          <div style={row3}>
            <div><label style={lbl}>Marque</label><input style={inp} value={cBrand} onChange={(e) => setCBrand(e.target.value)} /></div>
            <div><label style={lbl}>Prix HT (€)</label><input style={inp} type="number" step="0.01" value={cPriceHT} onChange={(e) => setCPriceHT(e.target.value)} placeholder="0.00" /></div>
            <div><label style={lbl}>Stock</label><input style={inp} type="number" step="1" value={cStock} onChange={(e) => setCStock(e.target.value)} placeholder="optionnel" /></div>
          </div>

          <div>
            <label style={lbl}>URL image</label>
            <input style={inp} value={cImageUrl} onChange={(e) => setCImageUrl(e.target.value)} placeholder="https://site-fournisseur.fr/images/ref.jpg" />
            <p style={{ margin: "0.3rem 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>
              ⚠️ URL directe vers l'image (.jpg, .png, .webp). Clic droit sur l'image → "Copier l'adresse de l'image".
            </p>
          </div>

          {cError && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{cError}</div>}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button type="button" onClick={() => setCreateOpen(false)} style={{ padding: "0.65rem 1.25rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", color: "#475569" }}>Annuler</button>
            <button type="submit" disabled={cLoading} style={{ padding: "0.65rem 1.75rem", borderRadius: "0.875rem", background: cLoading ? "#94a3b8" : "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: cLoading ? "not-allowed" : "pointer" }}>
              {cLoading ? "Création..." : "Créer le produit"}
            </button>
          </div>
        </form>
      </EntityModal>

      {/* ── Modal création fournisseur inline */}
      <EntityModal open={newSupOpen} onClose={() => setNewSupOpen(false)} title="Créer un fournisseur" description="Le fournisseur sera ajouté et pré-sélectionné.">
        <form onSubmit={handleCreateSupplier} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={row2}>
            <div><label style={lbl}>Code *</label><input style={inp} value={nsCode} onChange={(e) => setNsCode(e.target.value.toUpperCase())} required placeholder="ex: FACOM" /></div>
            <div><label style={lbl}>Nom *</label><input style={inp} value={nsName} onChange={(e) => setNsName(e.target.value)} required placeholder="ex: Facom France" /></div>
          </div>
          <div><label style={lbl}>Email</label><input style={inp} type="email" value={nsEmail} onChange={(e) => setNsEmail(e.target.value)} /></div>
          {nsError && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{nsError}</div>}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button type="button" onClick={() => setNewSupOpen(false)} style={{ padding: "0.65rem 1.25rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", color: "#475569" }}>Annuler</button>
            <button type="submit" disabled={nsLoading} style={{ padding: "0.65rem 1.75rem", borderRadius: "0.875rem", background: nsLoading ? "#94a3b8" : "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: nsLoading ? "not-allowed" : "pointer" }}>
              {nsLoading ? "Création..." : "Créer et sélectionner"}
            </button>
          </div>
        </form>
      </EntityModal>

      {/* ── Modal édition */}
      <EntityModal open={!!editItem} onClose={() => setEditItem(null)} title="Modifier le produit" description={editItem?.designation}>
        {editItem && (
          <form onSubmit={handleEdit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div><label style={lbl}>Désignation *</label><input style={inp} value={eDesg} onChange={(e) => setEDesg(e.target.value)} required /></div>
            <div style={row3}>
              <div><label style={lbl}>Réf. interne</label><input style={inp} value={eIntCode} onChange={(e) => setEIntCode(e.target.value)} /></div>
              <div><label style={lbl}>Réf. fournisseur</label><input style={inp} value={eSupRef} onChange={(e) => setESupRef(e.target.value)} /></div>
              <div><label style={lbl}>Code facturation</label><input style={inp} value={eBilling} onChange={(e) => setEBilling(e.target.value)} /></div>
            </div>
            <div style={row3}>
              <div><label style={lbl}>Marque</label><input style={inp} value={eBrand} onChange={(e) => setEBrand(e.target.value)} /></div>
              <div><label style={lbl}>Prix HT (€)</label><input style={inp} type="number" step="0.01" value={ePriceHT} onChange={(e) => setEPriceHT(e.target.value)} /></div>
              <div><label style={lbl}>Stock</label><input style={inp} type="number" step="1" value={eStock} onChange={(e) => setEStock(e.target.value)} /></div>
            </div>
            <div>
              <label style={lbl}>URL image</label>
              <input style={inp} value={eImageUrl} onChange={(e) => setEImageUrl(e.target.value)} placeholder="https://..." />
              <p style={{ margin: "0.3rem 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>URL directe vers l'image (.jpg, .png, .webp...).</p>
            </div>
            {eImageUrl && <img src={eImageUrl} alt="aperçu" style={{ maxHeight: "120px", borderRadius: "0.875rem", objectFit: "contain", border: "1px solid #e2e8f0" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
            <div style={row2}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>
                <input type="checkbox" checked={eActive} onChange={(e) => setEActive(e.target.checked)} /> Produit actif
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>
                <input type="checkbox" checked={eFeatured} onChange={(e) => setEFeatured(e.target.checked)} /> Mis en avant
              </label>
            </div>
            {eError && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{eError}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button type="button" onClick={() => setEditItem(null)} style={{ padding: "0.65rem 1.25rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", color: "#475569" }}>Annuler</button>
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