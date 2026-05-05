"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Plus, Trash2, AlertTriangle, Send, Save } from "lucide-react";
import PhotoUpload from "@/components/atc/bons/PhotoUpload";
import ClientSearchWithDrawer from "@/components/atc/bons/ClientSearchWithDrawer";
import ClientEquipmentPicker, { type EquipmentData } from "@/components/atc/bons/ClientEquipmentPicker";

type Client = { id: string; name: string; code: string | null; storeId: string | null; storeName: string | null; storeCode: string | null; status?: string };
type Store  = { id: string; name: string; code: string };
type Photo  = { id: number; dataUrl: string; name: string };
type Line   = { id: number; reference: string; designation: string; quantity: number; unit_price: string; bon_line_type: "commande" | "devis" };

type Props = { distributorSlug: string; clients: Client[]; savStores: Store[] };

const VIOLET = "#7c3aed";

let idCounter = 100;
const newId = () => idCounter++;

function LineTypeToggle({ value, onChange }: { value: "commande" | "devis"; onChange: (v: "commande" | "devis") => void }) {
  return (
    <div className="toggle-cmddev">
      {(["commande", "devis"] as const).map((t) => (
        <button key={t} type="button" onClick={() => onChange(t)}
          className={value === t ? (t === "commande" ? "active-cmd" : "active-dev") : ""}>
          {t === "commande" ? "Cmd" : "Dev"}
        </button>
      ))}
    </div>
  );
}

export default function CreatePiecesSAVForm({ distributorSlug, clients, savStores }: Props) {
  const router  = useRouter();
  const atcBase = `/${distributorSlug}/atc`;

  const [clientId,  setClientId]  = useState("");
  const [storeId,   setStoreId]   = useState("");
  const [equipment, setEquipment] = useState<EquipmentData | null>(null);
  const [comment,   setComment]   = useState("");
  const [photos,    setPhotos]    = useState<Photo[]>([]);
  const [lines,     setLines]     = useState<Line[]>([{ id: newId(), reference: "", designation: "", quantity: 1, unit_price: "", bon_line_type: "commande" }]);
  const [loading,   setLoading]   = useState<"draft" | "send" | null>(null);
  const [error,     setError]     = useState("");

  function handleClientChange(id: string) { setClientId(id); setEquipment(null); }

  function addLine()   { setLines((p) => [...p, { id: newId(), reference: "", designation: "", quantity: 1, unit_price: "", bon_line_type: "commande" }]); }
  function removeLine(id: number) { setLines((p) => p.filter((l) => l.id !== id)); }
  function updateLine(id: number, f: keyof Line, v: string | number) { setLines((p) => p.map((l) => l.id === id ? { ...l, [f]: v } : l)); }

  const totalPieces = lines.reduce((s, l) => s + (Number(l.quantity) || 0), 0);

  async function handleSubmit(action: "draft" | "send") {
    if (action === "send") {
      if (!clientId)  { setError("Veuillez sélectionner un client."); return; }
      if (!storeId)   { setError("Veuillez sélectionner un magasin SAV."); return; }
      if (!equipment) { setError("Précisez le matériel concerné — c'est obligatoire pour les pièces SAV."); return; }
      if (!lines.some((l) => l.designation || l.reference)) { setError("Ajoutez au moins une pièce."); return; }
    }
    setError(""); setLoading(action);
    try {
      const res = await fetch("/api/atc/bons", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId, assigned_store_id: storeId,
          bon_type: "sav", comment: comment || null, action,
          photos: photos.map((p) => ({ dataUrl: p.dataUrl, name: p.name })),
          equipment: equipment ? { type_materiel: equipment.type_materiel, marque: equipment.marque, modele: equipment.modele, num_serie: equipment.num_serie, annee: equipment.annee } : null,
          lines: lines.filter((l) => l.designation || l.reference).map((l, i) => ({
            line_number: i + 1, type: l.bon_line_type,
            reference: l.reference || null, designation: l.designation || null,
            quantity: Number(l.quantity) || 1, unit_price: l.unit_price ? Number(l.unit_price) : null, comment: null,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur."); return; }
      router.push(`${atcBase}/bons/${data.bon_id}`);
    } catch { setError("Erreur réseau."); }
    finally { setLoading(null); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Hero violet */}
      <div style={{ padding: "1.75rem", borderRadius: "var(--r-2xl)", background: "linear-gradient(135deg,rgba(124,58,237,0.05),rgba(139,92,246,0.03))", border: "1px solid rgba(196,181,253,0.5)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "0.75rem" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "var(--r-md)", background: `${VIOLET}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Wrench size={22} color={VIOLET} strokeWidth={2} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "var(--font-xs)", fontWeight: 800, color: VIOLET, textTransform: "uppercase", letterSpacing: "0.1em" }}>ATC · SAV</p>
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "var(--c-text)", letterSpacing: "-0.02em" }}>Pièces SAV</h1>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: "var(--font-md)", color: "var(--c-text-secondary)" }}>Commande ou devis de pièces pour réparation d'équipement. Le matériel concerné est obligatoire.</p>
      </div>

      {/* Client & Magasin SAV */}
      <div className="card-section">
        <p className="label-secondary" style={{ marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Client &amp; Magasin SAV</p>
        <div className="atc-grid-2">
          <div>
            <label className="label-field">Client</label>
            <ClientSearchWithDrawer clients={clients} stores={savStores} value={clientId} onChange={handleClientChange} />
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

      {/* Matériel — obligatoire */}
      <div className="card-section" style={{ borderColor: !equipment && error ? "var(--c-danger)" : "rgba(196,181,253,0.5)", background: "rgba(248,245,255,0.6)" }}>
        <p className="label-secondary" style={{ marginBottom: "0.375rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Matériel concerné <span style={{ color: "var(--c-danger)" }}>*</span>
        </p>
        <p style={{ margin: "0 0 1rem", fontSize: "var(--font-sm)", color: "var(--c-text-secondary)" }}>
          Le matériel est obligatoire pour identifier pour quel équipement les pièces sont commandées.
        </p>
        <ClientEquipmentPicker clientId={clientId || null} value={equipment} onChange={setEquipment} />
      </div>

      {/* Lignes */}
      <div className="card-section">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div>
            <p className="label-secondary" style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>Pièces à commander</p>
            <p style={{ margin: "0.25rem 0 0", fontSize: "var(--font-xs)", color: "var(--c-text-secondary)" }}>Toggle Cmd / Dev pour choisir commande ou devis par ligne.</p>
          </div>
          <button type="button" onClick={addLine}
            style={{ padding: "0.4rem 0.875rem", borderRadius: "var(--r-md)", background: `${VIOLET}0f`, border: `1px solid rgba(196,181,253,0.6)`, color: VIOLET, fontWeight: 700, fontSize: "var(--font-sm)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <Plus size={13} strokeWidth={2.5} /> Ajouter une pièce
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {lines.map((line, idx) => (
            <div key={line.id} style={{ padding: "0.875rem 1rem", borderRadius: "var(--r-md)", background: "var(--c-bg)", border: "1px solid var(--c-border)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.625rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="label-secondary">Pièce {idx + 1}</span>
                  <LineTypeToggle value={line.bon_line_type} onChange={(v) => updateLine(line.id, "bon_line_type", v)} />
                </div>
                {lines.length > 1 && (
                  <button type="button" onClick={() => removeLine(line.id)} className="btn-ghost"
                    style={{ color: "var(--c-danger)", fontSize: "var(--font-xs)", gap: "0.25rem" }}>
                    <Trash2 size={12} strokeWidth={2} /> Supprimer
                  </button>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "60px 130px 1fr 100px", gap: "0.5rem" }}>
                <div>
                  <label className="label-field" style={{ fontSize: "var(--font-xs)", marginBottom: "0.25rem" }}>Qté</label>
                  <input className="input-lysma" style={{ padding: "0.5rem 0.75rem", fontSize: "var(--font-sm)" }} type="number" min={1} value={line.quantity} onChange={(e) => updateLine(line.id, "quantity", e.target.value)} autoComplete="off" />
                </div>
                <div>
                  <label className="label-field" style={{ fontSize: "var(--font-xs)", marginBottom: "0.25rem" }}>Réf. (opt.)</label>
                  <input className="input-lysma" style={{ padding: "0.5rem 0.75rem", fontSize: "var(--font-sm)", textTransform: "uppercase", fontFamily: "monospace" }} value={line.reference} onChange={(e) => updateLine(line.id, "reference", e.target.value.toUpperCase())} placeholder="Référence" autoComplete="off" autoCorrect="off" spellCheck={false} />
                </div>
                <div>
                  <label className="label-field" style={{ fontSize: "var(--font-xs)", marginBottom: "0.25rem" }}>Désignation</label>
                  <input className="input-lysma" style={{ padding: "0.5rem 0.75rem", fontSize: "var(--font-sm)", textTransform: "uppercase" }} value={line.designation} onChange={(e) => updateLine(line.id, "designation", e.target.value.toUpperCase())} placeholder="EX: JOINT DE VÉRIN" autoComplete="off" autoCorrect="off" spellCheck={false} />
                </div>
                <div>
                  <label className="label-field" style={{ fontSize: "var(--font-xs)", marginBottom: "0.25rem" }}>Prix HT (€)</label>
                  <input className="input-lysma" style={{ padding: "0.5rem 0.75rem", fontSize: "var(--font-sm)" }} type="number" step="0.01" min={0} value={line.unit_price} onChange={(e) => updateLine(line.id, "unit_price", e.target.value)} placeholder="0.00" autoComplete="off" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "var(--font-sm)", color: VIOLET, fontWeight: 600 }}>Total pièces :</span>
          <span style={{ fontSize: "1.25rem", fontWeight: 800, color: VIOLET }}>{totalPieces}</span>
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
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.375rem", borderRadius: "var(--r-md)", background: loading ? "var(--c-text-muted)" : `linear-gradient(135deg,${VIOLET},#8b5cf6)`, border: "none", color: "#fff", fontWeight: 700, fontSize: "var(--font-md)", cursor: loading ? "not-allowed" : "pointer", boxShadow: `0 4px 14px ${VIOLET}40` }}>
          <Send size={15} strokeWidth={2} /> {loading === "send" ? "Envoi..." : "Envoyer au magasin SAV"}
        </button>
      </div>
    </div>
  );
}