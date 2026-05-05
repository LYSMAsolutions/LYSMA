"use client";

import { useState, useEffect } from "react";
import { Wrench, Plus, ChevronRight } from "lucide-react";

export type EquipmentData = {
  id?:           string;
  type_materiel: string;
  marque:        string;
  modele:        string;
  num_serie:     string;
  annee:         string;
};

type Props = {
  clientId:   string | null;
  value:      EquipmentData | null;
  onChange:   (eq: EquipmentData | null) => void;
  onSaveNew?: (eq: EquipmentData) => void;
  label?:     string;
};

const TYPES_MATERIEL = [
  "PONT 4 COLONNES", "PONT 2 COLONNES", "PONT CISEAUX",
  "STATION CLIM", "ÉQUILIBREUSE", "DÉMONTE PNEUS",
  "COMPRESSEUR À VIS", "COMPRESSEUR À PISTON",
  "GÉOMÉTRIE", "NETTOYEUR HAUTE PRESSION", "AUTRE",
];

type KnownEquip = { id: string; type_materiel: string; marque: string | null; modele: string | null; num_serie: string | null; annee: number | null };

export default function ClientEquipmentPicker({ clientId, value, onChange, onSaveNew, label = "Matériel concerné" }: Props) {
  const [known,   setKnown]   = useState<KnownEquip[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode,    setMode]    = useState<"pick" | "new" | null>(null);
  const [newEq,   setNewEq]   = useState<EquipmentData>({ type_materiel: "", marque: "", modele: "", num_serie: "", annee: "" });
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    if (!clientId) { setKnown([]); setMode(null); onChange(null); return; }
    setLoading(true);
    fetch(`/api/atc/clients/${clientId}/equipment`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setKnown(d.equipment); })
      .finally(() => setLoading(false));
  }, [clientId]);

  async function saveNew() {
    if (!newEq.type_materiel || !clientId) return;
    setSaving(true);
    try {
      const res  = await fetch(`/api/atc/clients/${clientId}/equipment`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEq),
      });
      const data = await res.json();
      if (data.success) {
        // ✅ Recharger la liste complète depuis l'API plutôt que de juste push
        const fresh = await fetch(`/api/atc/clients/${clientId}/equipment`);
        const freshData = await fresh.json();
        if (freshData.success) setKnown(freshData.equipment);
        else setKnown((p) => [...p, data.equipment]);
      }
      onChange(newEq);
      onSaveNew?.(newEq);
      setMode(null);
    } catch {
      onChange(newEq);
      setMode(null);
    } finally {
      setSaving(false);
    }
  }

  if (!clientId) return (
    <div style={{ padding: "0.75rem 1rem", borderRadius: "var(--r-md)", background: "var(--c-bg)", border: "1px dashed var(--c-border)" }}>
      <p style={{ margin: 0, fontSize: "var(--font-sm)", color: "var(--c-text-muted)" }}>Sélectionnez d'abord un client pour voir son matériel enregistré.</p>
    </div>
  );

  if (loading) return <p style={{ margin: 0, fontSize: "var(--font-sm)", color: "var(--c-text-muted)" }}>Chargement du matériel...</p>;

  return (
    <div>
      {/* Matériel sélectionné */}
      {value && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", borderRadius: "var(--r-md)", border: "1px solid var(--c-border)", background: "var(--c-blue-light)", marginBottom: "0.5rem" }}>
          <Wrench size={18} color="var(--c-blue-primary)" strokeWidth={2} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: "var(--font-md)", fontWeight: 700, color: "var(--c-text)" }}>{value.type_materiel}</p>
            <p style={{ margin: "0.1rem 0 0", fontSize: "var(--font-xs)", color: "var(--c-text-secondary)" }}>
              {[value.marque, value.modele, value.num_serie ? `S/N: ${value.num_serie}` : "", value.annee ? `(${value.annee})` : ""].filter(Boolean).join(" · ")}
            </p>
          </div>
          <button type="button" onClick={() => { onChange(null); setMode(null); }} className="btn-ghost"
            style={{ fontSize: "var(--font-xs)", border: "1px solid var(--c-border)", borderRadius: "var(--r-sm)" }}>
            Changer
          </button>
        </div>
      )}

      {!value && mode === null && (
        <div>
          {known.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <p style={{ margin: "0 0 0.5rem", fontSize: "var(--font-xs)", color: "var(--c-text-secondary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Wrench size={12} strokeWidth={2} /> {known.length} équipement{known.length > 1 ? "s" : ""} enregistré{known.length > 1 ? "s" : ""} pour ce client
              </p>
              {known.map((eq) => (
                <button key={eq.id} type="button"
                  onClick={() => onChange({ id: eq.id, type_materiel: eq.type_materiel, marque: eq.marque ?? "", modele: eq.modele ?? "", num_serie: eq.num_serie ?? "", annee: eq.annee ? String(eq.annee) : "" })}
                  style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: "var(--r-md)", background: "var(--c-bg)", border: "1px solid var(--c-border)", cursor: "pointer", textAlign: "left", transition: "all 0.12s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--c-border-focus)"; e.currentTarget.style.background = "var(--c-blue-light)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--c-border)"; e.currentTarget.style.background = "var(--c-bg)"; }}>
                  <Wrench size={16} color="var(--c-blue-secondary)" strokeWidth={2} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "var(--font-sm)", fontWeight: 700, color: "var(--c-text)" }}>{eq.type_materiel}</p>
                    <p style={{ margin: 0, fontSize: "var(--font-xs)", color: "var(--c-text-secondary)" }}>
                      {[eq.marque, eq.modele, eq.num_serie ? `S/N: ${eq.num_serie}` : "", eq.annee ? `(${eq.annee})` : ""].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                  <ChevronRight size={14} color="var(--c-blue-primary)" strokeWidth={2.5} />
                </button>
              ))}
              <button type="button" onClick={() => setMode("new")}
                style={{ padding: "0.6rem 1rem", borderRadius: "var(--r-md)", background: "none", border: "1px dashed var(--c-border)", color: "var(--c-blue-primary)", fontWeight: 600, fontSize: "var(--font-sm)", cursor: "pointer", marginTop: "0.25rem" }}>
                + Matériel non listé — en enregistrer un nouveau
              </button>
            </div>
          ) : (
            <div style={{ padding: "1rem", borderRadius: "var(--r-md)", background: "var(--c-bg)", border: "1px dashed var(--c-border)", textAlign: "center" }}>
              <Wrench size={22} color="var(--c-text-muted)" strokeWidth={1.5} style={{ marginBottom: "0.5rem" }} />
              <p style={{ margin: "0 0 0.75rem", fontSize: "var(--font-sm)", color: "var(--c-text-muted)" }}>Aucun matériel enregistré pour ce client.</p>
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                <button type="button" onClick={() => setMode("new")} className="btn-secondary"
                  style={{ fontSize: "var(--font-sm)", padding: "0.45rem 0.875rem" }}>
                  <Plus size={13} strokeWidth={2.5} /> Enregistrer un équipement
                </button>
                <button type="button" onClick={() => onChange({ type_materiel: "", marque: "", modele: "", num_serie: "", annee: "" })} className="btn-ghost"
                  style={{ fontSize: "var(--font-sm)", border: "1px solid var(--c-border)", borderRadius: "var(--r-sm)" }}>
                  Saisir sans enregistrer
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Formulaire nouveau matériel */}
      {!value && mode === "new" && (
        <div className="card-section" style={{ background: "var(--c-blue-light)", borderColor: "var(--c-border)" }}>
          <p className="label-secondary" style={{ marginBottom: "0.875rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-blue-primary)" }}>Nouveau matériel</p>
          <div className="atc-grid-2" style={{ marginBottom: "0.625rem" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="label-field">Type *</label>
              <select className="select-lysma" value={newEq.type_materiel} onChange={(e) => setNewEq((p) => ({ ...p, type_materiel: e.target.value }))}>
                <option value="">— Sélectionner —</option>
                {TYPES_MATERIEL.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Marque</label>
              <input className="input-lysma" style={{ textTransform: "uppercase" }} value={newEq.marque}
                onChange={(e) => setNewEq((p) => ({ ...p, marque: e.target.value.toUpperCase() }))}
                placeholder="EX: RAVAGLIOLI" autoComplete="off" autoCorrect="off" spellCheck={false} />
            </div>
            <div>
              <label className="label-field">Modèle</label>
              <input className="input-lysma" style={{ textTransform: "uppercase" }} value={newEq.modele}
                onChange={(e) => setNewEq((p) => ({ ...p, modele: e.target.value.toUpperCase() }))}
                placeholder="EX: KP3040" autoComplete="off" autoCorrect="off" spellCheck={false} />
            </div>
            <div>
              <label className="label-field">N° de série</label>
              <input className="input-lysma" style={{ textTransform: "uppercase", fontFamily: "monospace" }} value={newEq.num_serie}
                onChange={(e) => setNewEq((p) => ({ ...p, num_serie: e.target.value.toUpperCase() }))}
                placeholder="EX: RAV2019001" autoComplete="off" autoCorrect="off" spellCheck={false} />
            </div>
            <div>
              <label className="label-field">Année</label>
              <input className="input-lysma" type="number" inputMode="numeric" value={newEq.annee}
                onChange={(e) => setNewEq((p) => ({ ...p, annee: e.target.value }))}
                placeholder="2019" min={1980} max={new Date().getFullYear() + 1} autoComplete="off" />
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button type="button" onClick={saveNew} disabled={!newEq.type_materiel || saving} className="btn-primary"
              style={{ opacity: !newEq.type_materiel || saving ? 0.5 : 1, cursor: !newEq.type_materiel || saving ? "not-allowed" : "pointer", fontSize: "var(--font-sm)", padding: "0.5rem 1rem" }}>
              {saving ? "Enregistrement..." : "Enregistrer et utiliser"}
            </button>
            <button type="button" onClick={() => { onChange(newEq); setMode(null); }} disabled={!newEq.type_materiel} className="btn-secondary"
              style={{ opacity: !newEq.type_materiel ? 0.5 : 1, fontSize: "var(--font-sm)", padding: "0.5rem 1rem" }}>
              Utiliser sans enregistrer
            </button>
            <button type="button" onClick={() => setMode(null)} className="btn-ghost"
              style={{ fontSize: "var(--font-sm)" }}>
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}