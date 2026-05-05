"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, FileText, Plus, Trash2, AlertTriangle, Send, Save } from "lucide-react";
import PhotoUpload from "@/components/atc/bons/PhotoUpload";
import ClientSearchWithDrawer from "@/components/atc/bons/ClientSearchWithDrawer";
import ClientEquipmentPicker, { type EquipmentData } from "@/components/atc/bons/ClientEquipmentPicker";

type Client = { id: string; name: string; code: string | null; storeId: string | null; storeName: string | null; storeCode: string | null };
type Store  = { id: string; name: string; code: string };
type Photo  = { id: number; dataUrl: string; name: string };
type Line   = { id: number; reference: string; designation: string; quantity: number; unit_price: string };

type Props = { distributorSlug: string; clients: Client[]; savStores: Store[] };

let lineId = 1;

export default function CreateDevisMaterielForm({ distributorSlug, clients, savStores }: Props) {
  const router  = useRouter();
  const atcBase = `/${distributorSlug}/atc`;

  const [isCommande, setIsCommande] = useState(false);
  const [numDevis,   setNumDevis]   = useState("");
  const [clientId,   setClientId]   = useState("");
  const [storeId,    setStoreId]    = useState("");
  const [equipment,  setEquipment]  = useState<EquipmentData | null>(null);
  const [comment,    setComment]    = useState("");
  const [photos,     setPhotos]     = useState<Photo[]>([]);
  const [lines,      setLines]      = useState<Line[]>([{ id: lineId++, reference: "", designation: "", quantity: 1, unit_price: "" }]);
  const [loading,    setLoading]    = useState<"draft" | "send" | null>(null);
  const [error,      setError]      = useState("");

  function handleClientChange(id: string) { setClientId(id); const c = clients.find((c) => c.id === id); setStoreId(c?.storeId ?? ""); setEquipment(null); }
  function addLine()   { setLines((p) => [...p, { id: lineId++, reference: "", designation: "", quantity: 1, unit_price: "" }]); }
  function removeLine(id: number) { setLines((p) => p.filter((l) => l.id !== id)); }
  function updateLine(id: number, f: keyof Line, v: string | number) { setLines((p) => p.map((l) => l.id === id ? { ...l, [f]: v } : l)); }

  async function handleSubmit(action: "draft" | "send") {
    if (action === "send") {
      if (!clientId) { setError("Veuillez sélectionner un client."); return; }
      if (!storeId)  { setError("Veuillez sélectionner un magasin SAV."); return; }
      if (isCommande && !numDevis.trim()) { setError("Le numéro du devis d'origine est obligatoire pour une commande."); return; }
    }
    setError(""); setLoading(action);
    try {
      const equipComment = equipment
        ? [equipment.type_materiel, equipment.marque, equipment.modele, equipment.num_serie ? `S/N: ${equipment.num_serie}` : "", equipment.annee ? `(${equipment.annee})` : ""].filter(Boolean).join(" — ")
        : null;

      const res = await fetch("/api/atc/bons", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId, assigned_store_id: storeId,
          bon_type: isCommande ? "commande_materiel" : "devis_materiel",
          comment: comment || null, devis_ref: numDevis || null, action,
          photos: photos.map((p) => ({ dataUrl: p.dataUrl, name: p.name })),
          equipment: equipment ? { type_materiel: equipment.type_materiel, marque: equipment.marque, modele: equipment.modele, num_serie: equipment.num_serie, annee: equipment.annee } : null,
          lines: lines.filter((l) => l.designation || l.reference).map((l, i) => ({
            line_number: i + 1, type: "standard",
            reference: l.reference || null, designation: l.designation || null,
            quantity: Number(l.quantity) || 1, unit_price: l.unit_price ? Number(l.unit_price) : null,
            comment: equipComment,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur."); return; }
      router.push(`${atcBase}/bons/${data.bon_id}`);
    } catch { setError("Erreur réseau."); }
    finally { setLoading(null); }
  }

  const accentColor  = isCommande ? "var(--c-blue-primary)" : "#7c3aed";
  const accentBg     = isCommande ? "rgba(10,77,155,0.05)"  : "rgba(124,58,237,0.05)";
  const accentBorder = isCommande ? "rgba(191,219,254,0.5)" : "rgba(196,181,253,0.5)";
  const btnGradient  = isCommande ? "linear-gradient(135deg,#0a4d9b,#1e73d8)" : "linear-gradient(135deg,#7c3aed,#8b5cf6)";
  const btnShadow    = isCommande ? "0 4px 14px rgba(10,77,155,0.3)"          : "0 4px 14px rgba(124,58,237,0.3)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Toggle Devis | Commande */}
      <div style={{ display: "flex", gap: "0.5rem", padding: "0.25rem", borderRadius: "var(--r-xl)", background: "rgba(255,255,255,0.7)", border: "1px solid var(--c-border)", width: "fit-content" }}>
        {[{ v: false, label: "Devis matériel", Icon: FileText }, { v: true, label: "Commande matériel", Icon: Package }].map(({ v, label, Icon }) => (
          <button key={String(v)} type="button" onClick={() => setIsCommande(v)}
            style={{ padding: "0.6rem 1.25rem", borderRadius: "var(--r-lg)", border: "none", background: isCommande === v ? "linear-gradient(135deg,#0a4d9b,#1e73d8)" : "none", color: isCommande === v ? "#fff" : "var(--c-text-secondary)", fontWeight: isCommande === v ? 700 : 500, fontSize: "var(--font-md)", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Icon size={14} strokeWidth={2} /> {label}
          </button>
        ))}
      </div>

      {/* Hero */}
      <div style={{ padding: "1.75rem", borderRadius: "var(--r-2xl)", background: accentBg, border: `1px solid ${accentBorder}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "0.75rem" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "var(--r-md)", background: `${accentBg}`, border: `1px solid ${accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {isCommande ? <Package size={22} color={accentColor} strokeWidth={2} /> : <FileText size={22} color={accentColor} strokeWidth={2} />}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "var(--font-xs)", fontWeight: 800, color: accentColor, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              ATC · {isCommande ? "SAV — Commande matériel" : "SAV — Devis matériel"}
            </p>
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "var(--c-text)", letterSpacing: "-0.02em" }}>
              {isCommande ? "Commande de matériel" : "Demande de devis matériel"}
            </h1>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: "var(--font-md)", color: "var(--c-text-secondary)" }}>
          {isCommande
            ? "Commande d'un équipement suite à un devis validé. Le numéro du devis est obligatoire."
            : "Demande de devis pour l'achat d'un équipement. Le magasin SAV vous répondra avec un devis."}
        </p>
      </div>

      {/* Numéro devis d'origine (si commande) */}
      {isCommande && (
        <div style={{ padding: "1rem 1.25rem", borderRadius: "var(--r-lg)", background: "var(--c-warning-bg)", border: "1px solid #fde68a" }}>
          <label className="label-field" style={{ color: "#b45309" }}>N° du devis d'origine *</label>
          <input className="input-lysma" style={{ maxWidth: "300px", fontFamily: "monospace", textTransform: "uppercase", borderColor: !numDevis ? "#fde68a" : undefined }}
            value={numDevis} onChange={(e) => setNumDevis(e.target.value.toUpperCase())}
            placeholder="EX: BON-2025-00012" autoComplete="off" autoCorrect="off" spellCheck={false} />
          <p style={{ margin: "0.3rem 0 0", fontSize: "var(--font-xs)", color: "#b45309" }}>
            Renseignez le numéro du bon de devis matériel validé par votre client.
          </p>
        </div>
      )}

      {/* Client & Magasin SAV */}
      <div className="card-section">
        <p className="label-secondary" style={{ marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Client &amp; Magasin SAV</p>
        <div className="atc-grid-2">
          <div>
            <label className="label-field">Client</label>
            <ClientSearchWithDrawer clients={clients} value={clientId} onChange={handleClientChange} stores={savStores} />
          </div>
          <div>
            <label className="label-field">Magasin SAV</label>
            <select className="select-lysma" value={storeId} onChange={(e) => setStoreId(e.target.value)}>
              <option value="">— Sélectionner —</option>
              {savStores.map((s) => <option key={s.id} value={s.id}>{s.code} · {s.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Matériel concerné */}
      <div className="card-section">
        <p className="label-secondary" style={{ marginBottom: "0.375rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Matériel concerné <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--c-text-muted)", fontSize: "var(--font-xs)" }}>(optionnel)</span>
        </p>
        <ClientEquipmentPicker clientId={clientId || null} value={equipment} onChange={setEquipment} />
      </div>

      {/* Lignes */}
      <div className="card-section">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <p className="label-secondary" style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>Lignes {isCommande ? "de commande" : "du devis"}</p>
          <button type="button" onClick={addLine}
            style={{ padding: "0.4rem 0.875rem", borderRadius: "var(--r-md)", background: accentBg, border: `1px solid ${accentBorder}`, color: accentColor, fontWeight: 700, fontSize: "var(--font-sm)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <Plus size={13} strokeWidth={2.5} /> Ajouter une ligne
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {lines.map((line, idx) => (
            <div key={line.id} style={{ display: "grid", gridTemplateColumns: "60px 120px 1fr 100px 28px", gap: "0.5rem", alignItems: "end", padding: "0.75rem 1rem", borderRadius: "var(--r-md)", background: "var(--c-bg)", border: "1px solid var(--c-border)" }}>
              <div>
                <label className="label-field" style={{ fontSize: "var(--font-xs)", marginBottom: "0.25rem" }}>Qté</label>
                <input className="input-lysma" style={{ padding: "0.5rem 0.75rem", fontSize: "var(--font-sm)" }} type="number" inputMode="numeric" min={1} value={line.quantity} onChange={(e) => updateLine(line.id, "quantity", e.target.value)} autoComplete="off" />
              </div>
              <div>
                <label className="label-field" style={{ fontSize: "var(--font-xs)", marginBottom: "0.25rem" }}>Réf. <span style={{ fontWeight: 400, color: "var(--c-text-muted)" }}>(opt.)</span></label>
                <input className="input-lysma" style={{ padding: "0.5rem 0.75rem", fontSize: "var(--font-sm)", textTransform: "uppercase" }} value={line.reference} onChange={(e) => updateLine(line.id, "reference", e.target.value.toUpperCase())} placeholder="Référence" autoComplete="off" autoCorrect="off" spellCheck={false} />
              </div>
              <div>
                <label className="label-field" style={{ fontSize: "var(--font-xs)", marginBottom: "0.25rem" }}>Désignation</label>
                <input className="input-lysma" style={{ padding: "0.5rem 0.75rem", fontSize: "var(--font-sm)", textTransform: "uppercase" }} value={line.designation} onChange={(e) => updateLine(line.id, "designation", e.target.value.toUpperCase())} placeholder="Désignation" autoComplete="off" autoCorrect="off" spellCheck={false} />
              </div>
              <div>
                <label className="label-field" style={{ fontSize: "var(--font-xs)", marginBottom: "0.25rem" }}>Prix HT</label>
                <input className="input-lysma" style={{ padding: "0.5rem 0.75rem", fontSize: "var(--font-sm)" }} type="number" inputMode="decimal" step="0.01" min={0} value={line.unit_price} onChange={(e) => updateLine(line.id, "unit_price", e.target.value)} placeholder="0.00" autoComplete="off" />
              </div>
              {lines.length > 1
                ? <button type="button" onClick={() => removeLine(line.id)} className="btn-ghost"
                    style={{ width: "28px", height: "28px", borderRadius: "50%", border: "1px solid var(--c-danger)", color: "var(--c-danger)", padding: 0, flexShrink: 0 }}>
                    <Trash2 size={12} strokeWidth={2} />
                  </button>
                : <div />
              }
            </div>
          ))}
        </div>
      </div>

      {/* Photos */}
      <div className="card-section">
        <p className="label-secondary" style={{ marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Photos <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--c-text-muted)", fontSize: "var(--font-xs)" }}>(optionnel · max 2)</span>
        </p>
        <PhotoUpload photos={photos} onChange={setPhotos} maxPhotos={2} />
      </div>

      {/* Commentaire */}
      <div className="card-section">
        <p className="label-secondary" style={{ marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Commentaire</p>
        <textarea className="textarea-lysma" rows={3} style={{ textTransform: "uppercase" }}
          value={comment} onChange={(e) => setComment(e.target.value.toUpperCase())}
          placeholder="INFORMATIONS COMPLÉMENTAIRES..." autoCapitalize="characters" autoCorrect="off" spellCheck={false} />
      </div>

      {error && (
        <div className="alert-warning">
          <AlertTriangle size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: "1px" }} />
          <span>{error}</span>
        </div>
      )}

      <div className="atc-actions" style={{ justifyContent: "flex-end" }}>
        <button type="button" onClick={() => router.push(`${atcBase}/sav`)} className="btn-secondary">Annuler</button>
        <button type="button" disabled={!!loading} onClick={() => handleSubmit("draft")} className="btn-secondary" style={{ opacity: loading ? 0.5 : 1 }}>
          <Save size={15} strokeWidth={2} /> {loading === "draft" ? "Sauvegarde..." : "Brouillon"}
        </button>
        <button type="button" disabled={!!loading} onClick={() => handleSubmit("send")}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.375rem", borderRadius: "var(--r-md)", background: loading ? "var(--c-text-muted)" : btnGradient, border: "none", color: "#fff", fontWeight: 700, fontSize: "var(--font-md)", cursor: loading ? "not-allowed" : "pointer", boxShadow: btnShadow }}>
          <Send size={15} strokeWidth={2} /> {loading === "send" ? "Envoi..." : "Envoyer au magasin SAV"}
        </button>
      </div>
    </div>
  );
}