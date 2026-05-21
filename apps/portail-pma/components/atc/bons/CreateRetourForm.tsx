"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Plus, Trash2, AlertTriangle, Send, Save } from "lucide-react";
import PhotoUpload from "@/components/atc/bons/PhotoUpload";
import ClientSearchWithDrawer from "@/components/atc/bons/ClientSearchWithDrawer";

type Client  = { id: string; name: string; code: string | null; storeId: string | null; storeName: string | null; storeCode: string | null };
type Store   = { id: string; name: string; code: string };
type Photo   = { id: number; dataUrl: string; name: string };
type RetLine = { id: number; reference: string; quantity: number; motif: string };

type Props = {
  distributorSlug:    string;
  basePath?:          string;
  clients:            Client[];
  stores:             Store[];
  requireBonRef:      boolean;
  requireMotif:       boolean;
  requireDesignation: boolean;
};

let lineId = 1;

const MOTIFS = [
  "ERREUR DE COMMANDE", "PIÈCE DÉFECTUEUSE", "DOUBLON",
  "PIÈCE NON CONFORME", "SURPLUS DE STOCK", "AUTRE",
];

export default function CreateRetourForm({ distributorSlug, basePath, clients, stores, requireBonRef, requireMotif, requireDesignation }: Props) {
  const router  = useRouter();
  const atcBase = basePath ?? `/${distributorSlug}/atc`;

  const [clientId, setClientId] = useState("");
  const [storeId,  setStoreId]  = useState("");
  const [bonRef,   setBonRef]   = useState("");
  const [comment,  setComment]  = useState("");
  const [photos,   setPhotos]   = useState<Photo[]>([]);
  const [lines,    setLines]    = useState<RetLine[]>([{ id: lineId++, reference: "", quantity: 1, motif: "" }]);
  const [loading,  setLoading]  = useState<"draft" | "send" | null>(null);
  const [error,    setError]    = useState("");

  const totalPieces = lines.reduce((s, l) => s + (Number(l.quantity) || 0), 0);

  function handleClientChange(id: string) {
    setClientId(id);
    const c = clients.find((c) => c.id === id);
    setStoreId(c?.storeId ?? "");
  }

  function addLine()    { setLines((p) => [...p, { id: lineId++, reference: "", quantity: 1, motif: "" }]); }
  function removeLine(id: number) { setLines((p) => p.filter((l) => l.id !== id)); }
  function updateLine(id: number, field: keyof RetLine, value: string | number) {
    setLines((p) => p.map((l) => l.id === id ? { ...l, [field]: value } : l));
  }

  function validate() {
    if (!clientId) return "Veuillez sélectionner un client.";
    if (!storeId)  return "Veuillez sélectionner un magasin.";
    if (requireBonRef && !bonRef.trim()) return "Le numéro du bon d'origine est obligatoire.";
    const validLines = lines.filter((l) => l.reference.trim());
    if (!validLines.length) return "Veuillez renseigner au moins une référence à retourner.";
    if (requireMotif && validLines.some((l) => !l.motif)) return "Le motif est obligatoire pour chaque ligne.";
    return null;
  }

  async function handleSubmit(action: "draft" | "send") {
    const err = action === "send" ? validate() : null;
    if (err) { setError(err); return; }
    setError(""); setLoading(action);
    try {
      const res = await fetch("/api/atc/bons", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId, assigned_store_id: storeId,
          bon_type: "retour", comment: comment || null, bon_ref: bonRef || null, action,
          photos: photos.map((p) => ({ dataUrl: p.dataUrl, name: p.name })),
          lines: lines.filter((l) => l.reference.trim()).map((l, i) => ({
            line_number: i + 1, type: "retour", reference: l.reference.trim(),
            designation: null, quantity: Number(l.quantity) || 1, unit_price: null, comment: l.motif || null,
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

      {/* Hero rouge */}
      <div style={{ padding: "1.75rem", borderRadius: "var(--r-2xl)", background: "linear-gradient(135deg,rgba(239,68,68,0.05),rgba(248,113,113,0.03))", border: "1px solid rgba(254,202,202,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "0.75rem" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "var(--r-md)", background: "rgba(220,38,38,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <RotateCcw size={22} color="#dc2626" strokeWidth={2} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "var(--font-xs)", fontWeight: 800, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.1em" }}>ATC · Retour pièces</p>
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "var(--c-text)", letterSpacing: "-0.02em" }}>Créer un retour</h1>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: "var(--font-md)", color: "var(--c-text-secondary)" }}>Renseignez les pièces à retourner avec leur référence et quantité.</p>
      </div>

      {/* Client & Magasin */}
      <div className="card-section">
        <p className="label-secondary" style={{ marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Client &amp; Magasin</p>
        <div className="atc-grid-2">
          <div>
            <label className="label-field">Client</label>
            <ClientSearchWithDrawer clients={clients} value={clientId} onChange={handleClientChange} stores={stores} />
          </div>
          <div>
            <label className="label-field">Magasin</label>
            <select className="select-lysma" value={storeId} onChange={(e) => setStoreId(e.target.value)}>
              <option value="">— Sélectionner un magasin —</option>
              {stores.map((s) => <option key={s.id} value={s.id}>{s.code} · {s.name}</option>)}
            </select>
            {clientId && !storeId && (
              <p style={{ margin: "0.3rem 0 0", fontSize: "var(--font-xs)", color: "var(--c-warning)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <AlertTriangle size={11} strokeWidth={2.5} /> Ce client n'a pas de magasin assigné.
              </p>
            )}
          </div>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label className="label-field" style={{ color: requireBonRef ? "var(--c-danger)" : undefined }}>
            N° bon d'origine{requireBonRef ? " *" : " "}
            {!requireBonRef && <span style={{ fontWeight: 400, color: "var(--c-text-muted)", fontSize: "var(--font-xs)", textTransform: "none", letterSpacing: 0 }}>(optionnel)</span>}
          </label>
          <input className="input-lysma" style={{ maxWidth: "280px", textTransform: "uppercase", fontFamily: "monospace" }}
            value={bonRef} onChange={(e) => setBonRef(e.target.value.toUpperCase())}
            placeholder="EX: BON-2025-00042" autoComplete="off" autoCorrect="off" spellCheck={false} />
        </div>
      </div>

      {/* Lignes retour */}
      <div className="card-section">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <p className="label-secondary" style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>Pièces à retourner</p>
          <button type="button" onClick={addLine}
            style={{ padding: "0.4rem 0.875rem", borderRadius: "var(--r-md)", background: "rgba(220,38,38,0.07)", border: "1px solid rgba(252,165,165,0.6)", color: "#dc2626", fontWeight: 700, fontSize: "var(--font-sm)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <Plus size={13} strokeWidth={2.5} /> Ajouter une pièce
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {lines.map((line, idx) => (
            <div key={line.id} style={{ padding: "1rem", borderRadius: "var(--r-md)", background: "#fef2f2", border: "1px solid rgba(252,165,165,0.4)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span className="label-secondary">Pièce {idx + 1}</span>
                {lines.length > 1 && (
                  <button type="button" onClick={() => removeLine(line.id)} className="btn-ghost"
                    style={{ color: "var(--c-danger)", fontSize: "var(--font-xs)", gap: "0.25rem" }}>
                    <Trash2 size={12} strokeWidth={2} /> Supprimer
                  </button>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label className="label-field">Qté</label>
                  <input className="input-lysma" type="number" inputMode="numeric" min={1} value={line.quantity}
                    onChange={(e) => updateLine(line.id, "quantity", e.target.value)} autoComplete="off" />
                </div>
                <div>
                  <label className="label-field">Référence *</label>
                  <input className="input-lysma" style={{ textTransform: "uppercase", fontFamily: "monospace" }}
                    value={line.reference}
                    onChange={(e) => updateLine(line.id, "reference", e.target.value.toUpperCase())}
                    placeholder="EX: L358A" autoComplete="off" autoCorrect="off" autoCapitalize="characters" spellCheck={false} />
                </div>
                <div>
                  <label className="label-field" style={{ color: requireMotif ? "var(--c-danger)" : undefined }}>
                    Motif{requireMotif ? " *" : " "}
                    {!requireMotif && <span style={{ fontWeight: 400, color: "var(--c-text-muted)", fontSize: "var(--font-xs)", textTransform: "none", letterSpacing: 0 }}>(optionnel)</span>}
                  </label>
                  <select className="select-lysma" value={line.motif} onChange={(e) => updateLine(line.id, "motif", e.target.value)}>
                    <option value="">— Sélectionner —</option>
                    {MOTIFS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compteur */}
        <div style={{ marginTop: "1rem", padding: "0.875rem 1.25rem", borderRadius: "var(--r-md)", background: "var(--c-bg)", border: "1px solid var(--c-border)", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "var(--font-sm)", color: "var(--c-text-secondary)", fontWeight: 600 }}>Références :</span>
            <span style={{ fontSize: "var(--font-lg)", fontWeight: 800, color: "var(--c-text)" }}>{lines.filter((l) => l.reference).length}</span>
          </div>
          <div style={{ width: "1px", height: "20px", background: "var(--c-border)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "var(--font-sm)", color: "var(--c-text-secondary)", fontWeight: 600 }}>Total pièces :</span>
            <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#dc2626" }}>{totalPieces}</span>
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className="card-section">
        <p className="label-secondary" style={{ marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Photos <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--c-text-muted)", fontSize: "var(--font-xs)" }}>(optionnel · max 2)</span>
        </p>
        <p style={{ margin: "0 0 1rem", fontSize: "var(--font-sm)", color: "var(--c-text-secondary)" }}>
          Ajoutez une photo de la pièce défectueuse ou du conditionnement si nécessaire.
        </p>
        <PhotoUpload photos={photos} onChange={setPhotos} maxPhotos={2} />
      </div>

      {/* Commentaire */}
      <div className="card-section">
        <p className="label-secondary" style={{ marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Commentaire général</p>
        <textarea className="textarea-lysma" rows={3} style={{ textTransform: "uppercase" }}
          value={comment} onChange={(e) => setComment(e.target.value.toUpperCase())}
          placeholder="INFORMATIONS COMPLÉMENTAIRES POUR LE MAGASIN..."
          autoCapitalize="characters" autoCorrect="off" spellCheck={false} />
      </div>

      {error && (
        <div className="alert-warning">
          <AlertTriangle size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: "1px" }} />
          <span>{error}</span>
        </div>
      )}

      {/* Actions */}
      <div className="atc-actions" style={{ justifyContent: "flex-end" }}>
        <button type="button" onClick={() => router.push(`${atcBase}/bons`)} className="btn-secondary">
          Annuler
        </button>
        <button type="button" disabled={!!loading} onClick={() => handleSubmit("draft")} className="btn-secondary"
          style={{ opacity: loading ? 0.5 : 1 }}>
          <Save size={15} strokeWidth={2} /> {loading === "draft" ? "Sauvegarde..." : "Brouillon"}
        </button>
        <button type="button" disabled={!!loading} onClick={() => handleSubmit("send")}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.375rem", borderRadius: "var(--r-md)", background: loading ? "var(--c-text-muted)" : "linear-gradient(135deg,#dc2626,#ef4444)", border: "none", color: "#fff", fontWeight: 700, fontSize: "var(--font-md)", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 14px rgba(220,38,38,0.3)" }}>
          <Send size={15} strokeWidth={2} /> {loading === "send" ? "Envoi..." : "Envoyer au magasin"}
        </button>
      </div>
    </div>
  );
}
