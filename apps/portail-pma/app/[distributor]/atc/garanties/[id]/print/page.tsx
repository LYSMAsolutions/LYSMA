"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type GarantieData = {
  numero_garantie:      string | null;
  created_at:           string;
  marque_piece:         string | null;
  fournisseur:          string | null;
  reference_piece:      string | null;
  quantite:             number | null;
  n_bon_livraison:      string | null;
  date_bon_livraison:   string | null;
  defaut_constate:      string | null;
  date_montage_1:       string | null;
  km_montage_1:         number | null;
  date_montage_2:       string | null;
  km_montage_2:         number | null;
  marque_vehicule:      string | null;
  type_vehicule:        string | null;
  cylindree:            string | null;
  annee_vehicule:       string | null;
  immat_vehicule:       string | null;
  retour_fournisseur:   boolean | null;
  date_envoi_expert:    string | null;
  date_decision:        string | null;
  decision:             string | null;
  decision_bl:          string | null;
  decision_commentaire: string | null;
  doc_carte_grise:      string | null;
  doc_facture_1:        string | null;
  doc_facture_2:        string | null;
  doc_bl_1:             string | null;
  doc_bl_2:             string | null;
  atcName:    string;
  clientName: string;
  clientCode: string;
  storeName:  string;
  storeCode:  string;
};

const fd = (d: string | null | undefined) =>
  d ? new Intl.DateTimeFormat("fr-FR").format(new Date(d)) : "";

const fdt = (d: string | Date | null | undefined) =>
  d ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(new Date(d)) : "";

function buildHTML(g: GarantieData): string {
  const km = g.km_montage_1 && g.km_montage_2 ? Math.max(0, Number(g.km_montage_2) - Number(g.km_montage_1)) : null;
  const isE = ["echange","echange_garantie","acceptee","validee"].includes(g.decision ?? "");
  const isA = g.decision === "avoir";
  const isR = ["refuse","refusee"].includes(g.decision ?? "");

  const docs = [
    { label: "Carte grise",          value: g.doc_carte_grise },
    { label: "Facture 1er montage",  value: g.doc_facture_1   },
    { label: "Facture 2ème montage", value: g.doc_facture_2   },
    { label: "BL Magasin n°1",       value: g.doc_bl_1        },
    { label: "BL Magasin n°2",       value: g.doc_bl_2        },
  ].filter(d => d.value);

  const cb = (checked: boolean) =>
    `<span style="display:inline-flex;align-items:center;justify-content:center;width:11px;height:11px;border:1px solid #000;font-size:9px;flex-shrink:0;${checked ? "background:#000;color:#fff;" : ""}">${checked ? "X" : "&nbsp;"}</span>`;

  const dot = (w = 50) => `<span style="border-bottom:1px dotted #666;min-width:${w}px;display:inline-block;">&nbsp;</span>`;

  const docPages = docs.map(({ label, value }) => `
    <div class="page">
      <div style="text-align:center;padding-bottom:10px;border-bottom:1px solid #e2e8f0;margin-bottom:14px;">
        <h2 style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#0f172a;margin:0;">${g.numero_garantie ?? "Garantie"} — ${label}</h2>
        <p style="font-size:9px;color:#94a3b8;margin:4px 0 0;">Client : ${g.clientName} · ${fd(g.created_at)}</p>
      </div>
      ${value && value.startsWith("data:image")
        ? `<div style="display:flex;justify-content:center;align-items:flex-start;"><img src="${value}" style="max-width:100%;max-height:240mm;object-fit:contain;border:1px solid #f1f5f9;border-radius:4px;" /></div>`
        : `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:200mm;background:#f8fafc;border:1px dashed #e2e8f0;border-radius:8px;gap:12px;color:#94a3b8;">
             <span style="font-size:32px;">📄</span>
             <p style="font-size:11px;font-weight:600;color:#6b7280;margin:0;">Document joint — ${label}</p>
           </div>`
      }
    </div>`).join("\n");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Garantie ${g.numero_garantie ?? ""}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #000; background: #fff; }
  .toolbar { background: #f1f5f9; padding: 10px 16px; display: flex; gap: 8px; align-items: center; border-bottom: 1px solid #e2e8f0; }
  .btn-p { padding: 8px 20px; border-radius: 8px; background: #0a4d9b; border: none; color: #fff; font-weight: 700; font-size: 12px; cursor: pointer; }
  .btn-b { padding: 8px 16px; border-radius: 8px; background: none; border: 1px solid #e2e8f0; color: #6b7280; font-weight: 600; font-size: 12px; cursor: pointer; }
  .page { width: 210mm; min-height: 297mm; margin: 12px auto; padding: 14mm 15mm; background: #fff; border: 1px solid #e2e8f0; display: flex; flex-direction: column; }
  @media print {
    .toolbar { display: none !important; }
    .page { width: 100%; margin: 0; padding: 14mm 15mm; border: none; page-break-after: always; min-height: 297mm; display: flex; flex-direction: column; }
    .page:last-child { page-break-after: avoid; }
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  }
  @page { size: A4; margin: 0; }

  .doc-title { text-align: center; font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 12px; }
  .meta-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 11.5px; }
  .lbl { font-size: 11px; font-weight: 700; white-space: nowrap; }
  .val { font-weight: 700; color: #0a4d9b; border-bottom: 1px solid #888; min-width: 60px; padding-bottom: 1px; display: inline-block; font-size: 12px; }
  .id-box { border: 1px solid #000; margin-bottom: 10px; }
  .id-row { display: flex; border-bottom: 1px solid #000; min-height: 26px; }
  .id-row:last-child { border-bottom: none; }
  .id-cell { padding: 5px 8px; display: flex; align-items: center; gap: 5px; flex-shrink: 0; }
  .id-cell.grow { flex: 1; }
  .id-cell + .id-cell { border-left: 1px solid #000; }
  .s-box { border: 2px solid #000; margin-bottom: 10px; }
  .s-title { background: #000; color: #fff; text-align: center; font-size: 13px; font-weight: 900; text-transform: uppercase; padding: 6px 8px; letter-spacing: 0.05em; }
  .s-row { display: flex; border-bottom: 1px solid #ccc; min-height: 28px; }
  .s-row:last-child { border-bottom: none; }
  .s-cell { padding: 5px 8px; display: flex; align-items: center; gap: 5px; flex: 1; }
  .s-cell + .s-cell { border-left: 1px solid #ccc; }
  .s-cell.auto { flex: none; }
  .defaut-val { font-weight: 700; color: #0a4d9b; white-space: pre-line; padding: 2px 0; line-height: 1.45; }
  .dec-box { border: 2px solid #000; margin-bottom: 10px; }
  .dec-title { background: #000; color: #fff; text-align: center; font-size: 14px; font-weight: 900; text-transform: uppercase; padding: 7px; letter-spacing: 0.08em; }
  .dec-row { display: flex; align-items: center; gap: 7px; padding: 7px 8px; border-bottom: 1px solid #ddd; flex-wrap: wrap; }
  .dec-row:last-child { border-bottom: none; }
  .sig-line { margin-top: auto; padding-top: 16px; display: flex; align-items: flex-end; gap: 8px; font-size: 11px; }
  .sig-box { flex: 1; border-bottom: 1px solid #000; height: 32px; }
  .footer-line { margin-top: 8px; padding-top: 6px; border-top: 1px solid #ccc; display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8; }
</style>
</head>
<body>

<div class="toolbar">
  <button class="btn-p" onclick="window.print()">🖨 Imprimer / Enregistrer en PDF</button>
  <button class="btn-b" onclick="window.close()">✕ Fermer</button>
  <span style="font-size:11px;color:#6b7280;margin-left:8px;">${1 + docs.length} page${1 + docs.length > 1 ? "s" : ""} au total${docs.length > 0 ? ` · ${docs.length} document${docs.length > 1 ? "s" : ""} joint${docs.length > 1 ? "s" : ""}` : ""}</span>
</div>

<!-- PAGE 1 : Formulaire garantie -->
<div class="page">
  <div class="doc-title">Demande de Garantie</div>
  <div class="meta-row">
    <span><span class="lbl">N° : </span><span class="val" style="font-family:monospace;">${g.numero_garantie ?? "—"}</span></span>
    <span><span class="lbl">Date : </span><span class="val">${fd(g.created_at)}</span></span>
  </div>

  <div class="id-box" style="display:grid;grid-template-columns:1fr 70px 1fr;">
    <!-- Colonne gauche : 3 lignes -->
    <div style="display:flex;flex-direction:column;border-right:1px solid #000;">
      <div class="id-cell" style="flex:1;border-bottom:1px solid #000;"><span class="lbl">Nom client :</span><span class="val" style="min-width:120px;">${g.clientName.toUpperCase()}</span></div>
      <div class="id-cell" style="flex:1;border-bottom:1px solid #000;"><span class="lbl">N° de compte :</span><span class="val" style="font-family:monospace;">${g.clientCode}</span></div>
      <div class="id-cell" style="flex:1;"><span class="lbl">Agence :</span><span class="val">${g.storeName.toUpperCase()} (${g.storeCode})</span></div>
    </div>
    <!-- Colonne centrale : label "Repris par" centré verticalement -->
    <div style="display:flex;align-items:center;justify-content:center;border-right:1px solid #000;padding:4px 6px;text-align:center;">
      <span class="lbl" style="font-size:10px;line-height:1.3;">Repris<br>par :</span>
    </div>
    <!-- Colonne droite : 3 lignes avec case à cocher -->
    <div style="display:flex;flex-direction:column;">
      <div class="id-cell" style="flex:1;border-bottom:1px solid #000;gap:6px;">${cb(false)}<span class="lbl">Magasin :</span><span class="val" style="min-width:100px;">${g.storeCode} - ${g.storeName}</span></div>
      <div class="id-cell" style="flex:1;border-bottom:1px solid #000;gap:6px;">${cb(true)}<span class="lbl">ATC :</span><span class="val">${g.atcName}</span></div>
      <div class="id-cell" style="flex:1;gap:6px;">${cb(false)}<span class="lbl">Livreur :</span><span style="border-bottom:1px solid #888;min-width:100px;display:inline-block;">&nbsp;</span></div>
    </div>
  </div>

  <div class="s-box">
    <div class="s-title">Information indispensable à la demande de la garantie</div>
    <div class="s-row">
      <div class="s-cell"><span class="lbl">MARQUE :</span><span class="val">${g.marque_piece ?? ""}</span></div>
      <div class="s-cell"><span class="lbl">Fournisseur :</span><span class="val">${g.fournisseur ?? ""}</span></div>
    </div>
    <div class="s-row">
      <div class="s-cell"><span class="lbl">Référence de la pièce en garantie :</span><span class="val" style="font-family:monospace;">${g.reference_piece ?? ""}</span></div>
      <div class="s-cell auto" style="min-width:80px;"><span class="lbl">Qté :</span><span class="val" style="min-width:24px;text-align:center;">${g.quantite ?? 1}</span></div>
    </div>
    <div class="s-row">
      <div class="s-cell"><span class="lbl">N° de bon de livraison client :</span><span class="val" style="font-family:monospace;">${g.n_bon_livraison ?? ""}</span></div>
      <div class="s-cell auto" style="min-width:110px;"><span class="lbl">Date :</span><span class="val">${fd(g.date_bon_livraison)}</span></div>
    </div>
    <div class="s-row">
      <div class="s-cell" style="flex-direction:column;align-items:flex-start;">
        <span class="lbl">Défaut constaté :</span>
        <div class="defaut-val">${g.defaut_constate ?? ""}</div>
      </div>
    </div>
    <div class="s-row">
      <div class="s-cell"><span class="lbl">Date du montage :</span><span class="val">${fd(g.date_montage_1)}</span></div>
      <div class="s-cell"><span class="lbl">Date du montage :</span><span class="val">${fd(g.date_montage_2)}</span></div>
    </div>
    <div class="s-row">
      <div class="s-cell"><span class="lbl">Km ou heure de fonctionnement :</span><span class="val">${km !== null ? `${km.toLocaleString("fr-FR")} KMS` : ""}</span></div>
    </div>
    <div class="s-row">
      <div class="s-cell"><span class="lbl">Marque et type de véhicule :</span><span class="val">${[g.marque_vehicule, g.type_vehicule].filter(Boolean).join(" ").toUpperCase()}</span></div>
    </div>
    <div class="s-row">
      <div class="s-cell"><span class="lbl">Cylindrée :</span><span class="val">${g.cylindree ?? ""}</span></div>
      <div class="s-cell"><span class="lbl">Immatriculation :</span><span class="val" style="font-family:monospace;">${g.immat_vehicule ?? ""}</span></div>
    </div>
    <div class="s-row">
      <div class="s-cell"><span class="lbl">Année</span><span class="val" style="margin-left:6px;">${g.annee_vehicule ?? ""}</span></div>
    </div>
  </div>

  <div class="dec-box">
    <div class="dec-title">Décision</div>
    <div class="dec-row">
      ${cb(!!g.retour_fournisseur)}
      <span class="lbl">Retour fournisseur pour expertise :</span>
      <span class="lbl" style="margin-left:10px;">Date d'envoi pour expertise :</span>
      <span class="val">${g.date_envoi_expert ? fd(g.date_envoi_expert) : "......./......."}</span>
    </div>
    <div class="dec-row">
      <span class="lbl">Date de décision :</span>
      <span class="val">${g.date_decision ? fd(g.date_decision) : "......./......."}</span>
      <span class="lbl" style="margin-left:10px;">Décision du fournisseur :</span>
      <span class="val" style="min-width:100px;">${g.decision ? g.decision.toUpperCase() : ""}</span>
    </div>
    <div class="dec-row">
      ${cb(isE)}
      <span class="lbl" style="min-width:140px;">Échangé sous garantie</span>
      <span class="lbl">Date :</span><span class="val">${isE && g.date_decision ? fd(g.date_decision) : "......./......."}</span>
      <span class="lbl" style="margin-left:8px;">BL n° :</span><span class="val" style="min-width:100px;">${isE ? (g.decision_bl ?? "") : ""}</span>
    </div>
    <div class="dec-row">
      ${cb(isA)}
      <span class="lbl" style="min-width:140px;">Avoir :</span>
      <span class="lbl">Date :</span><span class="val">${isA && g.date_decision ? fd(g.date_decision) : "......./......."}</span>
      <span class="lbl" style="margin-left:8px;">BL n° :</span><span class="val" style="min-width:100px;">${isA ? (g.decision_bl ?? "") : ""}</span>
    </div>
    <div class="dec-row">
      ${cb(isR)}
      <span class="lbl" style="min-width:140px;">Refus :</span>
      <span class="lbl">Date :</span><span class="val">${isR && g.date_decision ? fd(g.date_decision) : "......./......."}</span>
      <span class="lbl" style="margin-left:8px;">Commentaire :</span><span class="val" style="min-width:150px;">${isR ? (g.decision_commentaire ?? "") : ""}</span>
    </div>
  </div>

  <div class="sig-line">
    <span class="lbl">Validation du chef d'agence :</span>
    <div class="sig-box"></div>
  </div>

  <div class="footer-line">
    <span>LYSMA Solutions · Portail PMA</span>
    <span>Imprimé le ${fdt(new Date())}</span>
    <span>${g.numero_garantie ?? ""}</span>
  </div>
</div>

${docPages}

</body>
</html>`;
}

export default function GarantiePrintPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [error, setError]   = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const router = useRouter();

  // Extraire l'ID garantie depuis l'URL
  const getGarantieId = () => {
    const segments  = window.location.pathname.split("/");
    const printIdx  = segments.indexOf("print");
    return printIdx > 0 ? segments[printIdx - 1] : null;
  };

  async function loadAndOpen() {
    setStatus("loading");
    const garantieId = getGarantieId();
    if (!garantieId) { setError("ID introuvable"); setStatus("error"); return; }

    try {
      const r = await fetch(`/api/atc/garanties/${garantieId}/print-data`);
      const d = await r.json();
      if (!d.success) { setError(d.message ?? "Erreur"); setStatus("error"); return; }

      const html = buildHTML(d.data);
      const win  = window.open("", "_blank", "width=900,height=700");
      if (!win) { setError("Popup bloquée — autorisez les popups pour ce site puis réessayez."); setStatus("error"); return; }
      win.document.open();
      win.document.write(html);
      win.document.close();
      setStatus("ready");
    } catch {
      setError("Erreur réseau");
      setStatus("error");
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#F2F4F7", zIndex: 99999,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "2.5rem 3rem", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", maxWidth: "420px", textAlign: "center" }}>

        {status === "idle" && (
          <>
            <div style={{ fontSize: 40, marginBottom: "1rem" }}>🖨</div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Impression du dossier garantie</p>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.5rem" }}>Cliquez pour générer et ouvrir le document dans une nouvelle fenêtre.</p>
            <div style={{ display: "flex", gap: "0.625rem", justifyContent: "center" }}>
              <button onClick={() => router.back()}
                style={{ padding: "8px 16px", borderRadius: 8, background: "none", border: "1px solid #e2e8f0", color: "#6b7280", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                ← Retour
              </button>
              <button onClick={loadAndOpen}
                style={{ padding: "8px 24px", borderRadius: 8, background: "#0a4d9b", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Ouvrir le document
              </button>
            </div>
          </>
        )}

        {status === "loading" && (
          <>
            <div style={{ width: 40, height: 40, border: "4px solid #e2e8f0", borderTopColor: "#0a4d9b", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1.25rem" }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: "#334155" }}>Génération en cours...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </>
        )}

        {status === "ready" && (
          <>
            <div style={{ fontSize: 40, marginBottom: "1rem" }}>✅</div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Document ouvert dans une nouvelle fenêtre</p>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.5rem" }}>Utilisez le bouton "Imprimer / PDF" dans cette fenêtre.</p>
            <div style={{ display: "flex", gap: "0.625rem", justifyContent: "center" }}>
              <button onClick={() => router.back()}
                style={{ padding: "8px 20px", borderRadius: 8, background: "#0a4d9b", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                ← Retour
              </button>
              <button onClick={loadAndOpen}
                style={{ padding: "8px 16px", borderRadius: 8, background: "none", border: "1px solid #e2e8f0", color: "#6b7280", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                Rouvrir
              </button>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ fontSize: 32, marginBottom: "1rem" }}>⚠️</div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#dc2626", marginBottom: 6 }}>Erreur</p>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.5rem" }}>{error}</p>
            <div style={{ display: "flex", gap: "0.625rem", justifyContent: "center" }}>
              <button onClick={() => router.back()}
                style={{ padding: "8px 16px", borderRadius: 8, background: "none", border: "1px solid #e2e8f0", color: "#6b7280", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                ← Retour
              </button>
              <button onClick={loadAndOpen}
                style={{ padding: "8px 20px", borderRadius: 8, background: "#0a4d9b", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Réessayer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}