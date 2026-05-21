"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PhotoUpload from "@/components/atc/bons/PhotoUpload";
import ClientSearchWithDrawer from "@/components/atc/bons/ClientSearchWithDrawer";
import ClientEquipmentPicker, { type EquipmentData } from "@/components/atc/bons/ClientEquipmentPicker";

type Client = { id: string; name: string; code: string | null; storeId: string | null; storeName: string | null; storeCode: string | null; status?: string };
type Store  = { id: string; name: string; code: string };
type Photo  = { id: number; dataUrl: string; name: string };
type SubLine = { id: number; reference: string; billing_code: string; designation: string; quantity: number; unit_price: string; bon_line_type: "commande"|"devis" };
type VehicleLine = { id: number; type: "vehicule"; immat: string; vin: string; marque: string; modele: string; annee: string; comment: string; subLines: SubLine[]; _detected?: "immat_siv"|"immat_fni"|"vin" };
type StandardLine = { id: number; type: "standard"; reference: string; billing_code: string; designation: string; quantity: number; unit_price: string; comment: string; bon_line_type: "commande"|"devis" };
type Line = StandardLine | VehicleLine;

type Props = {
  distributorSlug: string;
  basePath?: string;
  clients:         Client[];
  normalStores:    Store[];
  savStores:       Store[];
  activeCodes:     string[];
  initialBonType?: string;
};

const inp: CSSProperties  = { width: "100%", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #dce5f0", background: "rgba(255,255,255,0.92)", fontSize: "0.875rem", color: "#0f172a", outline: "none", boxSizing: "border-box" };
const inpSm: CSSProperties = { ...inp, padding: "0.6rem 0.875rem", fontSize: "0.82rem" };
const lbl: CSSProperties  = { display: "block", marginBottom: "0.4rem", fontSize: "0.78rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" };
const lblSm: CSSProperties = { ...lbl, fontSize: "0.68rem", marginBottom: "0.25rem" };
const card: CSSProperties = { padding: "1.5rem", borderRadius: "1.25rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", boxShadow: "0 4px 16px rgba(15,23,42,0.04)" };
const sTitle: CSSProperties = { margin: "0 0 1.25rem", fontSize: "0.78rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" };

let idCounter = 1;
const newId = () => idCounter++;
const emptySubLine = (): SubLine => ({ id: newId(), reference: "", billing_code: "", designation: "", quantity: 1, unit_price: "", bon_line_type: "commande" });

// ── Détection immat / VIN ────────────────────────────────────────────────────
function detectVehicle(text: string): { detected: "immat_siv"|"immat_fni"|"vin"|null; formatted: string } {
  const clean = text.replace(/[-\s]/g, "").toUpperCase();
  if (/^[A-Z]{2}[0-9]{3}[A-Z]{2}$/.test(clean))
    return { detected: "immat_siv", formatted: `${clean.slice(0,2)}-${clean.slice(2,5)}-${clean.slice(5,7)}` };
  const fni = clean.match(/^([0-9]{1,4})([A-Z]{2})([0-9]{2})$/);
  if (fni) return { detected: "immat_fni", formatted: `${fni[1]} ${fni[2]} ${fni[3]}` };
  if (/^[A-HJ-NPR-Z0-9]{17}$/.test(clean)) return { detected: "vin", formatted: clean };
  return { detected: null, formatted: text };
}

// ── Toggle Commande / Devis par ligne ────────────────────────────────────────
function LineTypeToggle({ value, onChange }: { value: "commande"|"devis"; onChange: (v: "commande"|"devis") => void }) {
  return (
    <div style={{ display: "flex", borderRadius: "0.625rem", overflow: "hidden", border: "1px solid #dce5f0", flexShrink: 0 }}>
      {(["commande","devis"] as const).map((t) => (
        <button key={t} type="button" onClick={() => onChange(t)}
          style={{ padding: "0.35rem 0.625rem", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", border: "none", cursor: "pointer", background: value === t ? (t === "commande" ? "#0a4d9b" : "#7c3aed") : "rgba(255,255,255,0.8)", color: value === t ? "#fff" : "#94a3b8", transition: "all 0.12s" }}>
          {t === "commande" ? "Cmd" : "Dev"}
        </button>
      ))}
    </div>
  );
}

// ── Sous-ligne véhicule ──────────────────────────────────────────────────────
function VehicleSubLine({ sub, idx, total, onChange, onRemove }: {
  sub: SubLine; idx: number; total: number;
  onChange: (f: keyof SubLine, v: string|number) => void;
  onRemove: () => void;
}) {
  return (
    <div style={{ padding: "0.75rem 1rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.7)", border: "1px solid rgba(217,227,240,0.6)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#b45309", textTransform: "uppercase" }}>Pièce {idx + 1}</span>
          <LineTypeToggle value={sub.bon_line_type} onChange={(v) => onChange("bon_line_type", v)} />
        </div>
        {total > 1 && <button type="button" onClick={onRemove} style={{ fontSize: "0.65rem", color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Supprimer</button>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "60px 130px 1fr 100px", gap: "0.5rem" }}>
        <div><label style={lblSm}>Qté</label><input style={inpSm} type="number" min={1} value={sub.quantity} onChange={(e) => onChange("quantity", e.target.value)} autoComplete="off" /></div>
        <div><label style={lblSm}>Réf. (opt.)</label><input style={{ ...inpSm, textTransform: "uppercase" }} value={sub.reference} onChange={(e) => onChange("reference", e.target.value.toUpperCase())} placeholder="L358A" autoComplete="off" autoCorrect="off" spellCheck={false} /></div>
        <div><label style={lblSm}>Désignation</label><input style={{ ...inpSm, textTransform: "uppercase" }} value={sub.designation} onChange={(e) => onChange("designation", e.target.value.toUpperCase())} placeholder="EX: FILTRE À HUILE" autoComplete="off" autoCorrect="off" spellCheck={false} /></div>
        <div><label style={lblSm}>Prix HT (€)</label><input style={inpSm} type="number" step="0.01" min={0} value={sub.unit_price} onChange={(e) => onChange("unit_price", e.target.value)} placeholder="0.00" autoComplete="off" /></div>
      </div>
    </div>
  );
}

// ── Ligne standard ───────────────────────────────────────────────────────────
function StandardLineRow({ line, idx, total, onChange, onRemove, onConvertToVehicle }: {
  line: StandardLine; idx: number; total: number;
  onChange: (f: keyof StandardLine, v: string|number) => void;
  onRemove: () => void;
  onConvertToVehicle: (detected: "immat_siv"|"immat_fni"|"vin", formatted: string) => void;
}) {
  const detection = detectVehicle(line.designation);
  return (
    <div style={{ padding: "1rem", borderRadius: "0.875rem", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
            Ligne {idx + 1}
          </span>

          <LineTypeToggle
            value={line.bon_line_type}
            onChange={(v) => onChange("bon_line_type", v)}
          />

          {line.billing_code && (
            <span
              style={{
                padding: "0.35rem 0.625rem",
                borderRadius: "999px",
                background: "rgba(10,77,155,0.08)",
                border: "1px solid rgba(191,219,254,0.8)",
                color: "#0a4d9b",
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Fact. {line.billing_code}
            </span>
          )}
        </div>

        {total > 1 && (
          <button
            type="button"
            onClick={onRemove}
            style={{
              fontSize: "0.72rem",
              color: "#dc2626",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Supprimer
          </button>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "80px 140px 1fr 110px", gap: "0.75rem" }}>
        <div><label style={lbl}>Qté</label><input style={inp} type="number" min={1} value={line.quantity} onChange={(e) => onChange("quantity", e.target.value)} autoComplete="off" /></div>
        <div><label style={lbl}>Réf. (opt.)</label><input style={{ ...inp, textTransform: "uppercase" }} value={line.reference} onChange={(e) => onChange("reference", e.target.value.toUpperCase())} placeholder="L358A" autoComplete="off" autoCorrect="off" spellCheck={false} /></div>
        <div><label style={lbl}>Désignation</label><input style={{ ...inp, textTransform: "uppercase" }} value={line.designation} onChange={(e) => onChange("designation", e.target.value.toUpperCase())} placeholder="EX: FILTRE À HUILE" autoComplete="off" autoCorrect="off" spellCheck={false} /></div>
        <div><label style={lbl}>Prix HT (€)</label><input style={inp} type="number" step="0.01" min={0} value={line.unit_price} onChange={(e) => onChange("unit_price", e.target.value)} placeholder="0.00" autoComplete="off" /></div>
      </div>
      <div style={{ marginTop: "0.75rem" }}>
        <label style={lbl}>Commentaire ligne</label>
        <textarea rows={2} style={{ ...inp, textTransform: "uppercase", resize: "vertical", lineHeight: 1.5 }} value={line.comment} onChange={(e) => onChange("comment", e.target.value.toUpperCase())} placeholder={"OPTIONNEL"} autoCapitalize="characters" autoCorrect="off" spellCheck={false} />
      </div>
      {detection.detected && (
        <div style={{ marginTop: "0.75rem", padding: "0.75rem 1rem", borderRadius: "0.875rem", background: "rgba(251,248,230,0.9)", border: "1px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>🚗</span>
            <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 700, color: "#92400e" }}>
              Immatriculation détectée — <strong style={{ fontFamily: "monospace" }}>{detection.formatted}</strong>
            </p>
          </div>
          <button type="button" onClick={() => onConvertToVehicle(detection.detected!, detection.formatted)}
            style={{ padding: "0.4rem 0.875rem", borderRadius: "0.75rem", background: "#0a4d9b", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}>
            Convertir en bloc véhicule
          </button>
        </div>
      )}
    </div>
  );
}

// ── Bloc véhicule ─────────────────────────────────────────────────────────────
function VehicleLineRow({ line, idx, total, onChange, onSubLineChange, onAddSubLine, onRemoveSubLine, onRemove }: {
  line: VehicleLine; idx: number; total: number;
  onChange: (f: keyof VehicleLine, v: string) => void;
  onSubLineChange: (subId: number, f: keyof SubLine, v: string|number) => void;
  onAddSubLine: () => void;
  onRemoveSubLine: (id: number) => void;
  onRemove: () => void;
}) {
  const isVin = line._detected === "vin";
  const hasError = !line.marque && !line.modele;
  const totalQty = line.subLines.reduce((s, l) => s + (Number(l.quantity) || 0), 0);
  return (
    <div style={{ borderRadius: "0.875rem", background: "rgba(255,251,235,0.5)", border: "2px solid #fde68a", overflow: "hidden" }}>
      <div style={{ padding: "0.75rem 1rem", background: "rgba(254,243,199,0.7)", borderBottom: "1px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>🚗</span>
          <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#92400e", textTransform: "uppercase" }}>Bloc véhicule — Ligne {idx + 1}</span>
          {line._detected && <span style={{ padding: "0.1rem 0.45rem", borderRadius: "999px", fontSize: "0.62rem", fontWeight: 700, background: "#fffbeb", color: "#92400e", border: "1px solid #fde68a" }}>{line._detected === "vin" ? "VIN" : line._detected === "immat_siv" ? "SIV" : "FNI"}</span>}
        </div>
        {total > 1 && <button type="button" onClick={onRemove} style={{ fontSize: "0.72rem", color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Supprimer</button>}
      </div>
      <div style={{ padding: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 80px", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <div>
            <label style={lbl}>{isVin ? "Numéro VIN" : "Immatriculation"}</label>
            {isVin
              ? <><input style={{ ...inp, fontFamily: "monospace", textTransform: "uppercase" }} value={line.vin} onChange={(e) => onChange("vin", e.target.value.toUpperCase().replace(/[IOQ]/g,""))} maxLength={17} autoComplete="off" autoCorrect="off" spellCheck={false} /><p style={{ margin: "0.25rem 0 0", fontSize: "0.7rem", color: "#94a3b8" }}>{line.vin.length}/17</p></>
              : <input style={{ ...inp, fontFamily: "monospace", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center" }} value={line.immat} onChange={(e) => onChange("immat", e.target.value.toUpperCase())} placeholder={line._detected === "immat_siv" ? "AA-123-BB" : "1234 AB 24"} autoComplete="off" autoCorrect="off" spellCheck={false} />}
          </div>
          <div><label style={{ ...lbl, color: hasError ? "#dc2626" : "#334155" }}>Marque</label><input style={{ ...inp, textTransform: "uppercase", borderColor: hasError ? "#fecaca" : "#dce5f0" }} value={line.marque} onChange={(e) => onChange("marque", e.target.value.toUpperCase())} placeholder="RENAULT" autoComplete="off" autoCorrect="off" spellCheck={false} /></div>
          <div><label style={{ ...lbl, color: hasError ? "#dc2626" : "#334155" }}>Modèle</label><input style={{ ...inp, textTransform: "uppercase", borderColor: hasError ? "#fecaca" : "#dce5f0" }} value={line.modele} onChange={(e) => onChange("modele", e.target.value.toUpperCase())} placeholder="CLIO IV" autoComplete="off" autoCorrect="off" spellCheck={false} /></div>
          <div><label style={lbl}>Année</label><input style={inp} type="number" value={line.annee} onChange={(e) => onChange("annee", e.target.value)} placeholder="2019" min={1900} max={new Date().getFullYear()+1} autoComplete="off" /></div>
        </div>
        {hasError && <p style={{ margin: "0 0 0.75rem", fontSize: "0.75rem", color: "#dc2626", fontWeight: 600 }}>⚠ Marque ou modèle obligatoire.</p>}
        <div style={{ borderTop: "1px solid rgba(253,230,138,0.6)", paddingTop: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 800, color: "#b45309", textTransform: "uppercase" }}>Pièces pour ce véhicule</p>
            <button type="button" onClick={onAddSubLine} style={{ padding: "0.3rem 0.75rem", borderRadius: "0.75rem", background: "rgba(251,248,230,0.9)", border: "1px solid #fde68a", color: "#92400e", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer" }}>+ Ajouter une pièce</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {line.subLines.map((sub, sIdx) => (
              <VehicleSubLine key={sub.id} sub={sub} idx={sIdx} total={line.subLines.length}
                onChange={(f, v) => onSubLineChange(sub.id, f, v)}
                onRemove={() => onRemoveSubLine(sub.id)} />
            ))}
          </div>
          {line.subLines.length > 0 && (
            <div style={{ marginTop: "0.625rem", display: "flex", justifyContent: "flex-end", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "#b45309", fontWeight: 600 }}>Total pièces :</span>
              <span style={{ fontSize: "1rem", fontWeight: 800, color: "#92400e" }}>{totalQty}</span>
            </div>
          )}
          <div style={{ marginTop: "0.875rem" }}>
            <label style={lbl}>Commentaire véhicule</label>
            <textarea rows={2} style={{ ...inp, textTransform: "uppercase", resize: "vertical", lineHeight: 1.5 }} value={line.comment} onChange={(e) => onChange("comment", e.target.value.toUpperCase())} placeholder={"EX: VIDANGE COMPLÈTE"} autoCapitalize="characters" autoCorrect="off" spellCheck={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function CreateBonForm({ distributorSlug, basePath, clients, normalStores, savStores, activeCodes, initialBonType }: Props) {
  const router  = useRouter();
  const atcBase = basePath ?? `/${distributorSlug}/atc`;

  const [clientId,    setClientId]    = useState("");
  const [storeId,     setStoreId]     = useState("");
  const [sendClient,  setSendClient]  = useState(false);
  const [comment,     setComment]     = useState("");
  const [photos,      setPhotos]      = useState<Photo[]>([]);
  const [equipment,   setEquipment]   = useState<EquipmentData | null>(null);
  
  function getInitialLines(): Line[] {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("catalogue_cart");

      if (saved) {
        sessionStorage.removeItem("catalogue_cart");

        const parsed = JSON.parse(saved) as {
          reference?: string;
          billing_code?: string;
          designation?: string;
          quantity?: number;
          unit_price?: string | number;
        }[];

        return parsed.map((l): StandardLine => ({
          id: newId(),
          type: "standard",
          reference: l.reference || "",
          billing_code: l.billing_code || "",
          designation: l.designation || "",
          quantity: l.quantity || 1,
          unit_price: String(l.unit_price ?? ""),
          comment: "",
          bon_line_type: "commande",
        }));
      }
    }

    return [
      {
        id: newId(),
        type: "standard",
        reference: "",
        billing_code: "",
        designation: "",
        quantity: 1,
        unit_price: "",
        comment: "",
        bon_line_type: "commande",
      },
    ];
  }

  const [lines,       setLines]       = useState<Line[]>(() => getInitialLines());
  const [loading,     setLoading]     = useState<"draft"|"send"|null>(null);
  const [error,       setError]       = useState("");

  const allStores = [...normalStores, ...savStores];

  function handleClientChange(id: string, c?: { storeId?: string | null }) {
    setClientId(id);
    setEquipment(null);
    setStoreId(c?.storeId ?? "");
  }

  function addStandardLine() {
    setLines((p) => [...p, { id: newId(), type: "standard", reference: "", billing_code: "", designation: "", quantity: 1, unit_price: "", comment: "", bon_line_type: "commande" }]);
  }

  function addVehicleLine() {
    setLines((p) => [...p, { id: newId(), type: "vehicule", immat: "", vin: "", marque: "", modele: "", annee: "", comment: "", subLines: [emptySubLine()] }]);
  }

  function convertToVehicle(id: number, detected: "immat_siv"|"immat_fni"|"vin", formatted: string) {
    setLines((p) => p.map((l) => l.id !== id ? l : { id: l.id, type: "vehicule" as const, immat: detected !== "vin" ? formatted : "", vin: detected === "vin" ? formatted : "", marque: "", modele: "", annee: "", comment: "", subLines: [emptySubLine()], _detected: detected }));
  }

  function removeLine(id: number) { setLines((p) => p.filter((l) => l.id !== id)); }
  function updateStdLine(id: number, f: keyof StandardLine, v: string|number) { setLines((p) => p.map((l) => l.id === id && l.type === "standard" ? { ...l, [f]: v } : l)); }
  function updateVhlLine(id: number, f: keyof VehicleLine, v: string) { setLines((p) => p.map((l) => l.id === id && l.type === "vehicule" ? { ...l, [f]: v } : l)); }
  function addSubLine(vId: number) { setLines((p) => p.map((l) => l.id === vId && l.type === "vehicule" ? { ...l, subLines: [...l.subLines, emptySubLine()] } : l)); }
  function removeSubLine(vId: number, sId: number) { setLines((p) => p.map((l) => l.id === vId && l.type === "vehicule" ? { ...l, subLines: l.subLines.filter((s) => s.id !== sId) } : l)); }
  function updateSubLine(vId: number, sId: number, f: keyof SubLine, v: string|number) { setLines((p) => p.map((l) => l.id === vId && l.type === "vehicule" ? { ...l, subLines: l.subLines.map((s) => s.id === sId ? { ...s, [f]: v } : s) } : l)); }

  const hasVehicleErrors = lines.some((l) => l.type === "vehicule" && !l.marque && !l.modele);
  const totalPieces = lines.reduce((s, l) => l.type === "standard" ? s + (Number(l.quantity)||0) : s + l.subLines.reduce((ss, sl) => ss + (Number(sl.quantity)||0), 0), 0);
  const totalVehicles = lines.filter((l) => l.type === "vehicule").length;

  async function handleSubmit(action: "draft" | "send") {
    if (action === "send" && hasVehicleErrors) {
      setError("Marque ou modèle obligatoire pour chaque bloc véhicule.");
      return;
    }

    setError("");
    setLoading(action);

    try {
      const serialized = lines
        .filter(
          (l) =>
            l.type === "vehicule" ||
            (l as StandardLine).designation ||
            (l as StandardLine).reference
        )
        .flatMap((l, i) =>
          l.type === "standard"
            ? [
                {
                  line_number: i + 1,
                  type: l.bon_line_type as string,
                  reference: l.reference || null,
                  billing_code: l.billing_code || null,
                  designation: l.designation || null,
                  quantity: Number(l.quantity) || 1,
                  unit_price: l.unit_price ? Number(l.unit_price) : null,
                  comment: l.comment || null,
                },
              ]
            : [
                // HEADER VEHICULE
                {
                  line_number: i + 1,
                  type: "vehicule_header",
                  reference: l.immat || l.vin || null,
                  billing_code: null,
                  designation:
                    [l.marque, l.modele, l.annee ? `(${l.annee})` : ""]
                      .filter(Boolean)
                      .join(" ") || "VÉHICULE",
                  quantity: 1,
                  unit_price: null,
                  comment: l.comment || null,
                  vehicle: {
                    immat: l.immat || null,
                    vin: l.vin || null,
                    marque: l.marque || null,
                    modele: l.modele || null,
                    annee: l.annee ? Number(l.annee) : null,
                  },
                },

                // SOUS-LIGNES PIECES
                ...l.subLines
                  .filter((s) => s.designation || s.reference)
                  .map((s, si) => ({
                    line_number: i + 1 + (si + 1) * 0.01,
                    type: s.bon_line_type as string,
                    reference: s.reference || null,
                    billing_code: s.billing_code || null,
                    designation: s.designation || null,
                    quantity: Number(s.quantity) || 1,
                    unit_price: s.unit_price
                      ? Number(s.unit_price)
                      : null,
                    comment: null,
                  })),
              ]
        );

      const res = await fetch("/api/atc/bons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          assigned_store_id: storeId,
          bon_type: "commande_devis",
          send_to_client: sendClient,
          comment,
          action,
          photos: photos.map((p) => ({
            dataUrl: p.dataUrl,
            name: p.name,
          })),
          equipment: equipment
            ? {
                type_materiel: equipment.type_materiel,
                marque: equipment.marque,
                modele: equipment.modele,
                num_serie: equipment.num_serie,
                annee: equipment.annee,
              }
            : null,
          lines: serialized,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur.");
        return;
      }

      router.push(`${atcBase}/bons/${data.bon_id}`);
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Client + Magasin */}
      <div style={card}>
        <p style={sTitle}>Client & Magasin</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={lbl}>Client</label>
            <ClientSearchWithDrawer clients={clients} stores={allStores} value={clientId} onChange={handleClientChange} />
          </div>
          <div>
            <label style={lbl}>Magasin</label>
            <select style={inp} value={storeId} onChange={(e) => setStoreId(e.target.value)}>
              <option value="">— Sélectionner —</option>
              {normalStores.map((s) => <option key={s.id} value={s.id}>{s.code} · {s.name}</option>)}
            </select>
            {clientId && !storeId && <p style={{ margin: "0.3rem 0 0", fontSize: "0.72rem", color: "#f59e0b" }}>⚠ Aucun magasin assigné à ce client.</p>}
          </div>
        </div>

        {/* Envoyer copie au client */}
        <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1rem", padding: "0.875rem 1rem", borderRadius: "0.875rem", border: `1px solid ${sendClient ? "#bfdbfe" : "#e2e8f0"}`, background: sendClient ? "rgba(239,246,255,0.5)" : "#f8fafc", cursor: "pointer" }}>
          <div style={{ width: "20px", height: "20px", borderRadius: "6px", border: `2px solid ${sendClient ? "#0a4d9b" : "#cbd5e1"}`, background: sendClient ? "#0a4d9b" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} onClick={() => setSendClient(!sendClient)}>
            {sendClient && <span style={{ color: "white", fontSize: "0.75rem", fontWeight: 800 }}>✓</span>}
          </div>
          <div onClick={() => setSendClient(!sendClient)}>
            <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#0f172a" }}>Envoyer une copie au client par email</p>
            <p style={{ margin: 0, fontSize: "0.72rem", color: "#6b7280" }}>Le bon sera toujours envoyé au magasin — cette option envoie en plus une copie au client</p>
          </div>
        </label>
      </div>

      {/* Lignes */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <p style={sTitle}>Lignes du bon</p>
            <p style={{ margin: "-0.75rem 0 0", fontSize: "0.72rem", color: "#6b7280" }}>Chaque ligne peut être une commande ou un devis — utilisez le toggle Cmd / Dev.</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="button" onClick={addStandardLine} style={{ padding: "0.4rem 0.875rem", borderRadius: "0.875rem", background: "rgba(10,77,155,0.08)", border: "1px solid rgba(191,219,254,0.8)", color: "#0a4d9b", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>+ Ligne pièce</button>
            <button type="button" onClick={addVehicleLine} style={{ padding: "0.4rem 0.875rem", borderRadius: "0.875rem", background: "rgba(251,248,230,0.9)", border: "1px solid #fde68a", color: "#92400e", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>🚗 Bloc véhicule</button>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {lines.map((line, idx) =>
            line.type === "standard"
              ? <StandardLineRow key={line.id} line={line} idx={idx} total={lines.length} onChange={(f,v) => updateStdLine(line.id, f, v)} onRemove={() => removeLine(line.id)} onConvertToVehicle={(d,f) => convertToVehicle(line.id, d, f)} />
              : <VehicleLineRow key={line.id} line={line} idx={idx} total={lines.length} onChange={(f,v) => updateVhlLine(line.id, f, v)} onSubLineChange={(sId,f,v) => updateSubLine(line.id, sId, f, v)} onAddSubLine={() => addSubLine(line.id)} onRemoveSubLine={(sId) => removeSubLine(line.id, sId)} onRemove={() => removeLine(line.id)} />
          )}
        </div>
        <div style={{ marginTop: "1rem", padding: "0.875rem 1.25rem", borderRadius: "0.875rem", background: "rgba(248,251,255,0.8)", border: "1px solid rgba(217,227,240,0.8)", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><span style={{ fontSize: "0.78rem", color: "#6b7280", fontWeight: 600 }}>Total pièces :</span><span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0a4d9b" }}>{totalPieces}</span></div>
          {totalVehicles > 0 && <><div style={{ width: "1px", height: "20px", background: "#e2e8f0" }} /><div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><span style={{ fontSize: "0.78rem", color: "#92400e", fontWeight: 600 }}>🚗 Véhicules :</span><span style={{ fontSize: "1rem", fontWeight: 800, color: "#92400e" }}>{totalVehicles}</span></div></>}
        </div>
      </div>

      {/* Photos */}
      <div style={card}>
        <p style={sTitle}>Photos <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#94a3b8", fontSize: "0.78rem" }}>(optionnel · max 2)</span></p>
        <PhotoUpload photos={photos} onChange={setPhotos} maxPhotos={2} />
      </div>

      {/* Commentaire */}
      <div style={card}>
        <p style={sTitle}>Commentaire général</p>
        <textarea rows={3} style={{ ...inp, textTransform: "uppercase", resize: "vertical", lineHeight: 1.6 }} value={comment} onChange={(e) => setComment(e.target.value.toUpperCase())} placeholder={"INFORMATIONS COMPLÉMENTAIRES POUR LE MAGASIN..."} autoCapitalize="characters" autoCorrect="off" spellCheck={false} />
      </div>

      {error && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{error}</div>}

      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
        <button type="button" onClick={() => router.push(`${atcBase}/bons`)} style={{ padding: "0.75rem 1.5rem", borderRadius: "0.875rem", background: "rgba(255,255,255,0.8)", border: "1px solid #dce5f0", color: "#334155", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>Annuler</button>
        <button type="button" disabled={!!loading || !clientId || !storeId} onClick={() => handleSubmit("draft")} style={{ padding: "0.75rem 1.5rem", borderRadius: "0.875rem", background: loading||!clientId||!storeId ? "#f1f5f9" : "rgba(255,255,255,0.9)", border: "1px solid #dce5f0", color: loading||!clientId||!storeId ? "#94a3b8" : "#334155", fontWeight: 600, fontSize: "0.875rem", cursor: loading||!clientId||!storeId ? "not-allowed" : "pointer" }}>{loading === "draft" ? "Sauvegarde..." : "💾 Sauvegarder en brouillon"}</button>
        <button type="button" disabled={!!loading || !clientId || !storeId} onClick={() => handleSubmit("send")} style={{ padding: "0.75rem 1.75rem", borderRadius: "0.875rem", background: loading||!clientId||!storeId ? "#94a3b8" : "linear-gradient(135deg,#0a4d9b,#1e73d8)", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.875rem", cursor: loading||!clientId||!storeId ? "not-allowed" : "pointer", boxShadow: "0 8px 20px rgba(30,115,216,0.25)" }}>{loading === "send" ? "Envoi..." : sendClient ? "📤 Envoyer magasin + client" : "📤 Envoyer au magasin"}</button>
      </div>
    </div>
  );
}
