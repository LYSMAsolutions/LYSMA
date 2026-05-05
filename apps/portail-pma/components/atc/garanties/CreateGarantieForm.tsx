"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ClientSearchWithDrawer from "@/components/atc/bons/ClientSearchWithDrawer";

type Client = { id: string; name: string; code: string | null; storeId: string | null; storeName: string | null; storeCode: string | null; status?: string };
type Store  = { id: string; name: string; code: string };

type Props = {
  distributorSlug: string;
  clients:         Client[];
  stores:          Store[];
  atcName:         string;
};

type DocKey = "doc_carte_grise" | "doc_facture_1" | "doc_facture_2" | "doc_bl_1" | "doc_bl_2";

const DOCS: { docKey: DocKey; label: string; desc: string; required: boolean; icon: string }[] = [
  { docKey: "doc_carte_grise", label: "Carte grise",                        desc: "Photocopie de la carte grise du véhicule",        required: true,  icon: "🪪" },
  { docKey: "doc_facture_1",   label: "Facture 1er montage",                desc: "Facture de la première pose de la pièce",         required: true,  icon: "🧾" },
  { docKey: "doc_facture_2",   label: "Facture 2ème montage / cession",     desc: "Facture du 2ème montage ou cession de garantie",  required: true,  icon: "🧾" },
  { docKey: "doc_bl_1",        label: "BL magasin n°1",                     desc: "Bon de livraison magasin de la pièce",            required: true,  icon: "📄" },
  { docKey: "doc_bl_2",        label: "BL magasin n°2",                     desc: "Deuxième BL si applicable",                      required: false, icon: "📄" },
];

const inp: CSSProperties  = { width: "100%", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #dce5f0", background: "rgba(255,255,255,0.92)", fontSize: "0.875rem", color: "#0f172a", outline: "none", boxSizing: "border-box" };
const lbl: CSSProperties  = { display: "block", marginBottom: "0.4rem", fontSize: "0.78rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" };
const card: CSSProperties = { padding: "1.5rem", borderRadius: "1.25rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", boxShadow: "0 4px 16px rgba(15,23,42,0.04)" };
const sTitle: CSSProperties = { margin: "0 0 1.25rem", fontSize: "0.78rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" };
const req = (r: boolean): CSSProperties => ({ color: r ? "#dc2626" : "#94a3b8", marginLeft: "0.2rem" });

// Compression image/PDF photo
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (file.type === "application/pdf") { resolve(e.target?.result as string); return; }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio = Math.min(1, 1400 / img.width);
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function DocUpload({ docKey, label, desc, required, icon, value, onChange }: {
  docKey: DocKey; label: string; desc: string; required: boolean; icon: string;
  value: string; onChange: (v: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const isImg = value.startsWith("data:image");
  const isPdf = value.startsWith("data:application/pdf");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try { onChange(await compressImage(file)); }
    finally { setLoading(false); if (e.target) e.target.value = ""; }
  }

  if (value) return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", borderRadius: "0.875rem", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
      <div style={{ width: "48px", height: "48px", borderRadius: "0.625rem", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>
        {isImg ? <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "0.625rem" }} /> : "📄"}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, color: "#15803d" }}>✓ {label}</p>
        <p style={{ margin: 0, fontSize: "0.72rem", color: "#6b7280" }}>{isImg ? "Photo ajoutée" : isPdf ? "PDF ajouté" : "Document ajouté"}</p>
      </div>
      <button type="button" onClick={() => onChange("")} style={{ padding: "0.25rem 0.5rem", borderRadius: "0.5rem", background: "none", border: "1px solid #bbf7d0", color: "#dc2626", fontSize: "0.72rem", cursor: "pointer", fontWeight: 600 }}>Changer</button>
    </div>
  );

  return (
    <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", borderRadius: "0.875rem", background: "#f8fafc", border: `1px dashed ${required ? "#fde68a" : "#e2e8f0"}`, cursor: loading ? "wait" : "pointer" }}>
      <div style={{ width: "40px", height: "40px", borderRadius: "0.625rem", background: required ? "#fffbeb" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", flexShrink: 0 }}>
        {loading ? "⏳" : icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, color: "#334155" }}>{label}{required && <span style={{ color: "#dc2626" }}> *</span>}</p>
        <p style={{ margin: 0, fontSize: "0.72rem", color: "#6b7280" }}>{desc}</p>
      </div>
      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#0a4d9b" }}>📎 Ajouter</span>
      <input type="file" accept="image/*,application/pdf" capture="environment" style={{ display: "none" }} onChange={handleFile} disabled={loading} />
    </label>
  );
}

export default function CreateGarantieForm({ distributorSlug, clients, stores, atcName }: Props) {
  const router  = useRouter();
  const base    = `/${distributorSlug}/atc/garanties`;

  // Infos générales
  const [clientId,      setClientId]      = useState("");
  const [magasinId,     setMagasinId]     = useState("");

  // Pièce
  const [marque,        setMarque]        = useState("");
  const [fournisseur,   setFournisseur]   = useState("");
  const [reference,     setReference]     = useState("");
  const [quantite,      setQuantite]      = useState("1");
  const [nBL,           setNBL]           = useState("");
  const [dateBL,        setDateBL]        = useState("");
  const [defaut,        setDefaut]        = useState("");

  // Montages
  const [dateMontage1,  setDateMontage1]  = useState("");
  const [kmMontage1,    setKmMontage1]    = useState("");
  const [dateMontage2,  setDateMontage2]  = useState("");
  const [kmMontage2,    setKmMontage2]    = useState("");

  // Véhicule
  const [marqueVhl,     setMarqueVhl]     = useState("");
  const [typeVhl,       setTypeVhl]       = useState("");
  const [cylindree,     setCylindree]     = useState("");
  const [anneeVhl,      setAnneeVhl]      = useState("");
  const [immat,         setImmat]         = useState("");

  // Documents
  const [docs, setDocs] = useState<Record<DocKey, string>>({ doc_carte_grise: "", doc_facture_1: "", doc_facture_2: "", doc_bl_1: "", doc_bl_2: "" });

  const [commentaire,   setCommentaire]   = useState("");
  const [loading,       setLoading]       = useState<"draft"|"send"|null>(null);
  const [error,         setError]         = useState("");
  const [activeTab,     setActiveTab]     = useState<"piece"|"montage"|"vehicule"|"documents">("piece");

  const kmParcourus = kmMontage1 && kmMontage2 ? Math.max(0, Number(kmMontage2) - Number(kmMontage1)) : null;

  // Complétude par onglet
  const completude = {
    piece:     !!(marque && reference && defaut && nBL),
    montage:   !!(dateMontage1 && kmMontage1 && dateMontage2 && kmMontage2),
    vehicule:  !!(marqueVhl && anneeVhl),
    documents: !!(docs.doc_carte_grise && docs.doc_facture_1 && docs.doc_facture_2 && docs.doc_bl_1),
  };
  const allComplete = Object.values(completude).every(Boolean) && !!clientId && !!magasinId;

  const allStores = stores;

  async function handleSubmit(action: "draft"|"send") {
    setError(""); setLoading(action);
    try {
      const res = await fetch("/api/atc/garanties", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          client_id:       clientId      || null,
          magasin_id:      magasinId     || null,
          marque_piece:    marque        || null,
          fournisseur:     fournisseur   || null,
          reference_piece: reference     || null,
          quantite:        Number(quantite) || 1,
          n_bon_livraison: nBL           || null,
          date_bon_livraison: dateBL     || null,
          defaut_constate: defaut        || null,
          date_montage_1:  dateMontage1  || null,
          km_montage_1:    kmMontage1    ? Number(kmMontage1)  : null,
          date_montage_2:  dateMontage2  || null,
          km_montage_2:    kmMontage2    ? Number(kmMontage2)  : null,
          marque_vehicule: marqueVhl     || null,
          type_vehicule:   typeVhl       || null,
          cylindree:       cylindree     || null,
          annee_vehicule:  anneeVhl      || null,
          immat_vehicule:  immat         || null,
          commentaire:     commentaire   || null,
          ...docs,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setError(data.message || "Erreur."); return; }
      router.push(base);
    } catch { setError("Erreur réseau."); }
    finally { setLoading(null); }
  }

  const TABS = [
    { key: "piece",      label: "Pièce",      ok: completude.piece     },
    { key: "montage",    label: "Montages",   ok: completude.montage   },
    { key: "vehicule",   label: "Véhicule",   ok: completude.vehicule  },
    { key: "documents",  label: "Documents",  ok: completude.documents },
  ] as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Header */}
      <div style={{ padding: "1.75rem", borderRadius: "1.5rem", background: "linear-gradient(135deg,rgba(234,179,8,0.06),rgba(202,138,4,0.03))", border: "1px solid rgba(253,224,71,0.4)" }}>
        <p style={{ margin: "0 0 0.25rem", fontSize: "0.72rem", fontWeight: 800, color: "#ca8a04", textTransform: "uppercase", letterSpacing: "0.1em" }}>ATC · Garantie pièce</p>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>Nouvelle demande de garantie</h1>
        <p style={{ margin: "0.4rem 0 0", fontSize: "0.875rem", color: "#6b7280" }}>Remplissez les 4 sections, joignez les 4 documents obligatoires, puis envoyez au magasin.</p>

        {/* Barre de progression */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
          {TABS.map(({ key, label, ok }) => (
            <button key={key} type="button" onClick={() => setActiveTab(key)}
              style={{ padding: "0.35rem 0.875rem", borderRadius: "0.75rem", border: "1px solid", borderColor: activeTab === key ? "#ca8a04" : ok ? "#bbf7d0" : "#e2e8f0", background: activeTab === key ? "rgba(202,138,4,0.1)" : ok ? "#f0fdf4" : "#f8fafc", color: activeTab === key ? "#ca8a04" : ok ? "#15803d" : "#6b7280", fontWeight: activeTab === key ? 700 : 600, fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              {ok && activeTab !== key && <span style={{ fontSize: "0.65rem" }}>✓</span>}
              {!ok && activeTab !== key && <span style={{ fontSize: "0.65rem", color: "#f59e0b" }}>○</span>}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Client + Magasin (toujours visible) */}
      <div style={card}>
        <p style={sTitle}>Client & Magasin</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={lbl}>Client <span style={req(true)}>*</span></label>
            <ClientSearchWithDrawer clients={clients} stores={allStores} value={clientId}
              onChange={(id, c) => { setClientId(id); setMagasinId(c?.storeId ?? ""); }} />
          </div>
          <div>
            <label style={lbl}>Magasin <span style={req(true)}>*</span></label>
            <select style={inp} value={magasinId} onChange={(e) => setMagasinId(e.target.value)}>
              <option value="">— Sélectionner —</option>
              {stores.map((s) => <option key={s.id} value={s.id}>{s.code} · {s.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Onglet PIÈCE */}
      {activeTab === "piece" && (
        <div style={card}>
          <p style={sTitle}>Pièce en garantie</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={lbl}>Marque <span style={req(true)}>*</span></label>
              <input style={{ ...inp, textTransform: "uppercase" }} value={marque} onChange={(e) => setMarque(e.target.value.toUpperCase())} placeholder="EX: MONROE" autoComplete="off" autoCorrect="off" spellCheck={false} />
            </div>
            <div>
              <label style={lbl}>Fournisseur <span style={req(false)}>*</span></label>
              <input style={{ ...inp, textTransform: "uppercase" }} value={fournisseur} onChange={(e) => setFournisseur(e.target.value.toUpperCase())} placeholder="" autoComplete="off" autoCorrect="off" spellCheck={false} />
            </div>
            <div>
              <label style={lbl}>Référence pièce <span style={req(true)}>*</span></label>
              <input style={{ ...inp, textTransform: "uppercase", fontFamily: "monospace" }} value={reference} onChange={(e) => setReference(e.target.value.toUpperCase())} placeholder="EX: MK445" autoComplete="off" autoCorrect="off" spellCheck={false} />
            </div>
            <div>
              <label style={lbl}>Quantité <span style={req(true)}>*</span></label>
              <input style={inp} type="number" min={1} value={quantite} onChange={(e) => setQuantite(e.target.value)} autoComplete="off" />
            </div>
            <div>
              <label style={lbl}>N° BL client <span style={req(true)}>*</span></label>
              <input style={{ ...inp, fontFamily: "monospace" }} value={nBL} onChange={(e) => setNBL(e.target.value.toUpperCase())} placeholder="EX: 0900018" autoComplete="off" autoCorrect="off" spellCheck={false} />
            </div>
            <div>
              <label style={lbl}>Date BL</label>
              <input style={inp} type="date" value={dateBL} onChange={(e) => setDateBL(e.target.value)} />
            </div>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <label style={lbl}>Défaut constaté <span style={req(true)}>*</span></label>
            <textarea rows={3} style={{ ...inp, textTransform: "uppercase", resize: "vertical", lineHeight: 1.6 }} value={defaut} onChange={(e) => setDefaut(e.target.value.toUpperCase())} placeholder={"EX: BRUIT ANORMAL AU FREINAGE\nVIBRATION RESSENTIE À FAIBLE VITESSE"} autoCapitalize="characters" autoCorrect="off" spellCheck={false} />
          </div>
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
            <button type="button" onClick={() => setActiveTab("montage")}
              style={{ padding: "0.6rem 1.25rem", borderRadius: "0.875rem", background: "linear-gradient(135deg,#ca8a04,#d97706)", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}>
              Suivant : Montages →
            </button>
          </div>
        </div>
      )}

      {/* Onglet MONTAGES */}
      {activeTab === "montage" && (
        <div style={card}>
          <p style={sTitle}>Dates & kilométrage de montage</p>

          {/* 1er montage */}
          <div style={{ padding: "1rem", borderRadius: "0.875rem", background: "rgba(239,246,255,0.5)", border: "1px solid #bfdbfe", marginBottom: "1rem" }}>
            <p style={{ margin: "0 0 0.875rem", fontSize: "0.75rem", fontWeight: 800, color: "#0a4d9b", textTransform: "uppercase" }}>1er montage</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
              <div>
                <label style={lbl}>Date <span style={req(true)}>*</span></label>
                <input style={inp} type="date" value={dateMontage1} onChange={(e) => setDateMontage1(e.target.value)} />
              </div>
              <div>
                <label style={lbl}>Kilométrage au montage <span style={req(true)}>*</span></label>
                <div style={{ position: "relative" }}>
                  <input style={{ ...inp, paddingRight: "3rem" }} type="number" inputMode="numeric" min={0} value={kmMontage1} onChange={(e) => setKmMontage1(e.target.value)} placeholder="EX: 85000" autoComplete="off" />
                  <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>km</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2ème montage */}
          <div style={{ padding: "1rem", borderRadius: "0.875rem", background: "rgba(248,250,252,0.8)", border: "1px solid #e2e8f0", marginBottom: "1rem" }}>
            <p style={{ margin: "0 0 0.875rem", fontSize: "0.75rem", fontWeight: 800, color: "#334155", textTransform: "uppercase" }}>2ème montage (dépose)</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
              <div>
                <label style={lbl}>Date <span style={req(true)}>*</span></label>
                <input style={inp} type="date" value={dateMontage2} onChange={(e) => setDateMontage2(e.target.value)} />
              </div>
              <div>
                <label style={lbl}>Kilométrage à la dépose <span style={req(true)}>*</span></label>
                <div style={{ position: "relative" }}>
                  <input style={{ ...inp, paddingRight: "3rem" }} type="number" inputMode="numeric" min={0} value={kmMontage2} onChange={(e) => setKmMontage2(e.target.value)} placeholder="EX: 85065" autoComplete="off" />
                  <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Km parcourus — calculé automatiquement */}
          {kmParcourus !== null && (
            <div style={{ padding: "1rem 1.25rem", borderRadius: "0.875rem", background: kmParcourus < 5000 ? "rgba(239,246,255,0.7)" : "rgba(254,243,199,0.7)", border: `1px solid ${kmParcourus < 5000 ? "#bfdbfe" : "#fde68a"}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 700, color: "#334155" }}>Kilométrage parcouru (calculé automatiquement)</p>
                <p style={{ margin: 0, fontSize: "0.72rem", color: "#6b7280" }}>Km dépose − Km pose = distance parcourue avec la pièce</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: kmParcourus < 5000 ? "#0a4d9b" : "#b45309" }}>{kmParcourus.toLocaleString("fr-FR")}</p>
                <p style={{ margin: 0, fontSize: "0.72rem", color: "#6b7280" }}>km parcourus</p>
              </div>
            </div>
          )}

          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
            <button type="button" onClick={() => setActiveTab("piece")} style={{ padding: "0.6rem 1.25rem", borderRadius: "0.875rem", background: "none", border: "1px solid #e2e8f0", color: "#6b7280", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>← Pièce</button>
            <button type="button" onClick={() => setActiveTab("vehicule")} style={{ padding: "0.6rem 1.25rem", borderRadius: "0.875rem", background: "linear-gradient(135deg,#ca8a04,#d97706)", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}>Suivant : Véhicule →</button>
          </div>
        </div>
      )}

      {/* Onglet VÉHICULE */}
      {activeTab === "vehicule" && (
        <div style={card}>
          <p style={sTitle}>Informations véhicule</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={lbl}>Marque <span style={req(true)}>*</span></label>
              <input style={{ ...inp, textTransform: "uppercase" }} value={marqueVhl} onChange={(e) => setMarqueVhl(e.target.value.toUpperCase())} placeholder="Sur carte grise (D1)" autoComplete="off" autoCorrect="off" spellCheck={false} />
            </div>
            <div>
              <label style={lbl}>Type / Modèle <span style={req(false)}>*</span></label>
              <input style={{ ...inp, textTransform: "uppercase" }} value={typeVhl} onChange={(e) => setTypeVhl(e.target.value.toUpperCase())} placeholder="Sur carte grise (D3)" autoComplete="off" autoCorrect="off" spellCheck={false} />
            </div>
            <div>
              <label style={lbl}>Immatriculation</label>
              <input style={{ ...inp, textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.08em" }} value={immat} onChange={(e) => setImmat(e.target.value.toUpperCase())} placeholder="AB-123-CD" autoComplete="off" autoCorrect="off" spellCheck={false} />
            </div>
            <div>
              <label style={lbl}>Cylindrée</label>
              <input style={inp} value={cylindree} onChange={(e) => setCylindree(e.target.value)} placeholder="SUR CARTE GRISE (P1)" autoComplete="off" />
            </div>
            <div>
              <label style={lbl}>Année <span style={req(true)}>*</span></label>
              <input style={inp} value={anneeVhl} onChange={(e) => setAnneeVhl(e.target.value)} placeholder="SUR CARTE GRISE (B)" autoComplete="off" />
            </div>
          </div>

          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
            <button type="button" onClick={() => setActiveTab("montage")} style={{ padding: "0.6rem 1.25rem", borderRadius: "0.875rem", background: "none", border: "1px solid #e2e8f0", color: "#6b7280", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>← Montages</button>
            <button type="button" onClick={() => setActiveTab("documents")} style={{ padding: "0.6rem 1.25rem", borderRadius: "0.875rem", background: "linear-gradient(135deg,#ca8a04,#d97706)", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}>Suivant : Documents →</button>
          </div>
        </div>
      )}

      {/* Onglet DOCUMENTS */}
      {activeTab === "documents" && (
        <div style={card}>
          <p style={sTitle}>Pièces jointes</p>
          <p style={{ margin: "-0.75rem 0 1.25rem", fontSize: "0.82rem", color: "#6b7280" }}>
            4 documents obligatoires (<span style={{ color: "#dc2626", fontWeight: 700 }}>*</span>) — prenez-les en photo ou importez-les depuis votre appareil.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {DOCS.map((doc) => (
              <DocUpload key={doc.docKey} {...doc} value={docs[doc.docKey]} onChange={(v) => setDocs((p) => ({ ...p, [doc.docKey]: v }))} />
            ))}
          </div>

          {/* Récap complétude */}
          <div style={{ marginTop: "1.25rem", padding: "1rem", borderRadius: "0.875rem", background: allComplete ? "rgba(240,253,244,0.8)" : "rgba(254,243,199,0.6)", border: `1px solid ${allComplete ? "#bbf7d0" : "#fde68a"}` }}>
            <p style={{ margin: "0 0 0.625rem", fontSize: "0.75rem", fontWeight: 800, color: allComplete ? "#15803d" : "#b45309", textTransform: "uppercase" }}>
              {allComplete ? "✅ Dossier complet — prêt à envoyer" : "⚠ Dossier incomplet"}
            </p>
            <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
              {[
                { label: "Client",      ok: !!clientId },
                { label: "Magasin",     ok: !!magasinId },
                { label: "Pièce",       ok: completude.piece },
                { label: "Montages",    ok: completude.montage },
                { label: "Véhicule",    ok: completude.vehicule },
                { label: "Documents",   ok: completude.documents },
              ].map(({ label, ok }) => (
                <span key={label} style={{ padding: "0.15rem 0.5rem", borderRadius: "999px", fontSize: "0.65rem", fontWeight: 700, background: ok ? "#f0fdf4" : "#fef2f2", color: ok ? "#15803d" : "#dc2626", border: `1px solid ${ok ? "#bbf7d0" : "#fecaca"}` }}>
                  {ok ? "✓" : "✗"} {label}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label style={lbl}>Commentaire</label>
            <textarea rows={2} style={{ ...inp, textTransform: "uppercase", resize: "vertical", lineHeight: 1.5 }} value={commentaire} onChange={(e) => setCommentaire(e.target.value.toUpperCase())} placeholder={"INFORMATIONS COMPLÉMENTAIRES..."} autoCapitalize="characters" autoCorrect="off" spellCheck={false} />
          </div>

          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-start" }}>
            <button type="button" onClick={() => setActiveTab("vehicule")} style={{ padding: "0.6rem 1.25rem", borderRadius: "0.875rem", background: "none", border: "1px solid #e2e8f0", color: "#6b7280", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>← Véhicule</button>
          </div>
        </div>
      )}

      {error && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{error}</div>}

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
        <button type="button" onClick={() => router.push(base)} style={{ padding: "0.75rem 1.5rem", borderRadius: "0.875rem", background: "rgba(255,255,255,0.8)", border: "1px solid #dce5f0", color: "#334155", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>Annuler</button>
        <button type="button" disabled={!!loading} onClick={() => handleSubmit("draft")}
          style={{ padding: "0.75rem 1.5rem", borderRadius: "0.875rem", background: loading ? "#f1f5f9" : "rgba(255,255,255,0.9)", border: "1px solid #dce5f0", color: loading ? "#94a3b8" : "#334155", fontWeight: 600, fontSize: "0.875rem", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading === "draft" ? "Sauvegarde..." : "💾 Sauvegarder en brouillon"}
        </button>
        <button type="button" disabled={!!loading || !allComplete} onClick={() => handleSubmit("send")}
          style={{ padding: "0.75rem 1.75rem", borderRadius: "0.875rem", background: loading||!allComplete ? "#94a3b8" : "linear-gradient(135deg,#ca8a04,#d97706)", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.875rem", cursor: loading||!allComplete ? "not-allowed" : "pointer", boxShadow: allComplete ? "0 8px 20px rgba(202,138,4,0.25)" : "none" }}>
          {loading === "send" ? "Envoi..." : "📤 Envoyer au magasin"}
        </button>
      </div>
    </div>
  );
}