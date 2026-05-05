"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, MapPin, Home, Send, Save, AlertTriangle } from "lucide-react";
import PhotoUpload from "@/components/atc/bons/PhotoUpload";
import ClientSearchWithDrawer from "@/components/atc/bons/ClientSearchWithDrawer";
import ClientEquipmentPicker, { type EquipmentData } from "@/components/atc/bons/ClientEquipmentPicker";

type Client = { id: string; name: string; code: string | null; storeId: string | null; storeName: string | null; storeCode: string | null };
type Store  = { id: string; name: string; code: string };
type Photo  = { id: number; dataUrl: string; name: string };

type Props = { distributorSlug: string; clients: Client[]; savStores: Store[]; allStores?: Store[] };

const MATERIELS = [
  "PONT 4 COLONNES", "PONT 2 COLONNES", "PONT CISEAUX",
  "DÉMONTE PNEUS", "ÉQUILIBREUSE", "GÉOMÉTRIE",
  "COMPRESSEUR", "STATION CLIM", "NETTOYEUR HAUTE PRESSION", "AUTRE",
];

const ETATS = [
  { value: "a_controler",   label: "À contrôler",   color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
  { value: "dysfonctionne", label: "Dysfonctionne", color: "#c2410c", bg: "#fff7ed", border: "#fed7aa" },
  { value: "a_larret",      label: "À l'arrêt",     color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
];

const VIOLET = "#7c3aed";

export default function CreateInterventionForm({ distributorSlug, clients, savStores }: Props) {
  const router  = useRouter();
  const atcBase = `/${distributorSlug}/atc`;

  const [clientId,      setClientId]      = useState("");
  const [storeId,       setStoreId]       = useState("");
  const [typeInterv,    setTypeInterv]    = useState<"site_client" | "atelier" | "">("");
  const [avecDevis,     setAvecDevis]     = useState(false);
  const [materiel,      setMateriel]      = useState("");
  const [materielAutre, setMaterielAutre] = useState("");
  const [marque,        setMarque]        = useState("");
  const [modele,        setModele]        = useState("");
  const [numSerie,      setNumSerie]      = useState("");
  const [annee,         setAnnee]         = useState("");
  const [etat,          setEtat]          = useState("");
  const [equipment,     setEquipment]     = useState<EquipmentData | null>(null);
  const [description,   setDescription]  = useState("");
  const [comment,       setComment]       = useState("");
  const [photos,        setPhotos]        = useState<Photo[]>([]);
  const [loading,       setLoading]       = useState<"draft" | "send" | null>(null);
  const [error,         setError]         = useState("");

  function handleClientChange(id: string) {
    setClientId(id);
    const c = clients.find((c) => c.id === id);
    setStoreId(c?.storeId ?? "");
    setEquipment(null);
  }

  async function handleSubmit(action: "draft" | "send") {
    if (action === "send") {
      if (!clientId)           { setError("Veuillez sélectionner un client."); return; }
      if (!storeId)            { setError("Veuillez sélectionner un magasin SAV."); return; }
      if (!typeInterv)         { setError("Précisez si c'est une intervention sur site ou en atelier."); return; }
      if (!materiel)           { setError("Veuillez sélectionner le matériel concerné."); return; }
      if (!etat)               { setError("Veuillez indiquer l'état du matériel."); return; }
      if (!description.trim()) { setError("La description des travaux est obligatoire."); return; }
    }
    setError(""); setLoading(action);
    try {
      const designation = [
        typeInterv === "site_client" ? "INTERVENTION SUR SITE CLIENT" : "RÉPARATION EN ATELIER",
        avecDevis ? "— AVEC DEVIS" : "",
        materiel === "AUTRE" ? `MATÉRIEL: ${materielAutre}` : `MATÉRIEL: ${materiel}`,
      ].filter(Boolean).join(" ");

      const commentFull = [
        marque       ? `MARQUE: ${marque}`                                       : "",
        modele       ? `MODÈLE: ${modele}`                                       : "",
        numSerie     ? `N° SÉRIE: ${numSerie}`                                   : "",
        annee        ? `ANNÉE: ${annee}`                                         : "",
        etat         ? `ÉTAT: ${ETATS.find((e) => e.value === etat)?.label.toUpperCase()}` : "",
        description  ? `TRAVAUX: ${description}`                                 : "",
        comment      ? `COMMENTAIRE: ${comment}`                                 : "",
      ].filter(Boolean).join("\n");

      const res = await fetch("/api/atc/bons", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId, assigned_store_id: storeId,
          bon_type: avecDevis ? "devis_intervention" : "intervention",
          comment: commentFull, action,
          photos: photos.map((p) => ({ dataUrl: p.dataUrl, name: p.name })),
          lines: [{ line_number: 1, type: "standard", reference: numSerie || null, designation, quantity: 1, unit_price: null, comment: description || null }],
          meta: { type_intervention: typeInterv, avec_devis: avecDevis, materiel: materiel === "AUTRE" ? materielAutre : materiel, marque, modele, num_serie: numSerie, annee, etat },
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur."); return; }
      router.push(`${atcBase}/bons/${data.bon_id}`);
    } catch { setError("Erreur réseau."); }
    finally { setLoading(null); }
  }

  const selectedEtat = ETATS.find((e) => e.value === etat);

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
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "var(--c-text)", letterSpacing: "-0.02em" }}>Demande d'intervention</h1>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: "var(--font-md)", color: "var(--c-text-secondary)" }}>Le magasin SAV sera notifié à l'envoi.</p>
      </div>

      {/* Type d'intervention */}
      <div className="card-section">
        <p className="label-secondary" style={{ marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Type d'intervention</p>
        <div className="atc-grid-2" style={{ marginBottom: "1rem" }}>
          {([["site_client", MapPin, "Sur site client", "Déplacement chez le client"], ["atelier", Home, "Réparation en atelier", "Le matériel est ramené chez le distributeur"]] as const).map(([v, Icon, label, desc]) => (
            <button key={v} type="button" onClick={() => setTypeInterv(v)}
              style={{ padding: "1rem", borderRadius: "var(--r-md)", border: "1px solid", borderColor: typeInterv === v ? VIOLET : "var(--c-border)", background: typeInterv === v ? `${VIOLET}08` : "rgba(255,255,255,0.8)", cursor: "pointer", textAlign: "left", transition: "all 0.15s", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "var(--r-sm)", background: typeInterv === v ? `${VIOLET}15` : "var(--c-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                <Icon size={18} color={typeInterv === v ? VIOLET : "var(--c-text-secondary)"} strokeWidth={2} />
              </div>
              <div>
                <p style={{ margin: "0 0 0.2rem", fontWeight: 700, fontSize: "var(--font-md)", color: typeInterv === v ? VIOLET : "var(--c-text)" }}>{label}</p>
                <p style={{ margin: 0, fontSize: "var(--font-xs)", color: "var(--c-text-secondary)" }}>{desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Avec devis */}
        <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", borderRadius: "var(--r-md)", border: `1px solid ${avecDevis ? "var(--c-border)" : "var(--c-border)"}`, background: avecDevis ? "var(--c-blue-light)" : "var(--c-bg)", cursor: "pointer" }}>
          <div style={{ width: "20px", height: "20px", borderRadius: "6px", border: `2px solid ${avecDevis ? "var(--c-blue-primary)" : "var(--c-border)"}`, background: avecDevis ? "var(--c-blue-primary)" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}
            onClick={() => setAvecDevis(!avecDevis)}>
            {avecDevis && <span style={{ color: "white", fontSize: "0.7rem", fontWeight: 800 }}>✓</span>}
          </div>
          <div onClick={() => setAvecDevis(!avecDevis)}>
            <p style={{ margin: 0, fontSize: "var(--font-md)", fontWeight: 700, color: "var(--c-text)" }}>Intervention avec devis préalable</p>
            <p style={{ margin: 0, fontSize: "var(--font-xs)", color: "var(--c-text-secondary)" }}>Le magasin SAV devra établir un devis avant d'intervenir</p>
          </div>
        </label>
      </div>

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

      {/* Matériel */}
      <div className="card-section">
        <p className="label-secondary" style={{ marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Matériel concerné</p>

        {/* Picker matériel enregistré */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label className="label-field">Sélectionner depuis le parc client <span style={{ fontWeight: 400, color: "var(--c-text-muted)", fontSize: "var(--font-xs)" }}>(optionnel)</span></label>
          <ClientEquipmentPicker
            clientId={clientId || null}
            value={equipment}
            onChange={(eq) => {
              setEquipment(eq);
              if (eq) {
                setMateriel(eq.type_materiel || "");
                setMarque(eq.marque || "");
                setModele(eq.modele || "");
                setNumSerie(eq.num_serie || "");
                setAnnee(eq.annee || "");
              }
            }}
          />
        </div>

        <p className="label-secondary" style={{ marginBottom: "0.75rem" }}>Ou saisir manuellement</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.5rem", marginBottom: materiel === "AUTRE" ? "1rem" : 0 }}>
          {MATERIELS.map((m) => (
            <button key={m} type="button" onClick={() => setMateriel(m)}
              style={{ padding: "0.625rem 0.875rem", borderRadius: "var(--r-sm)", border: "1px solid", borderColor: materiel === m ? VIOLET : "var(--c-border)", background: materiel === m ? `${VIOLET}08` : "rgba(255,255,255,0.8)", color: materiel === m ? VIOLET : "var(--c-text)", fontWeight: materiel === m ? 700 : 500, fontSize: "var(--font-sm)", cursor: "pointer", textAlign: "left", transition: "all 0.12s" }}>
              {m}
            </button>
          ))}
        </div>
        {materiel === "AUTRE" && (
          <div style={{ marginTop: "0.875rem" }}>
            <label className="label-field">Précisez le matériel</label>
            <input className="input-lysma" style={{ textTransform: "uppercase" }} value={materielAutre}
              onChange={(e) => setMaterielAutre(e.target.value.toUpperCase())}
              placeholder="EX: BANC DE FREINAGE" autoComplete="off" autoCorrect="off" spellCheck={false} />
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 80px", gap: "0.75rem", marginTop: "1.25rem" }}>
          <div>
            <label className="label-field">Marque</label>
            <input className="input-lysma" style={{ textTransform: "uppercase" }} value={marque}
              onChange={(e) => setMarque(e.target.value.toUpperCase())} placeholder="EX: RAVAGLIOLI"
              autoComplete="off" autoCorrect="off" spellCheck={false} />
          </div>
          <div>
            <label className="label-field">Modèle</label>
            <input className="input-lysma" style={{ textTransform: "uppercase" }} value={modele}
              onChange={(e) => setModele(e.target.value.toUpperCase())} placeholder="EX: KP3040"
              autoComplete="off" autoCorrect="off" spellCheck={false} />
          </div>
          <div>
            <label className="label-field">N° de série</label>
            <input className="input-lysma" style={{ textTransform: "uppercase", fontFamily: "monospace" }} value={numSerie}
              onChange={(e) => setNumSerie(e.target.value.toUpperCase())} placeholder="EX: RAV2019001"
              autoComplete="off" autoCorrect="off" spellCheck={false} />
          </div>
          <div>
            <label className="label-field">Année</label>
            <input className="input-lysma" type="number" inputMode="numeric" value={annee}
              onChange={(e) => setAnnee(e.target.value)} placeholder="2019"
              min={1980} max={new Date().getFullYear() + 1} autoComplete="off" />
          </div>
        </div>
      </div>

      {/* État du matériel */}
      <div className="card-section">
        <p className="label-secondary" style={{ marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>État du matériel</p>
        <div className="atc-grid-3">
          {ETATS.map((e) => (
            <button key={e.value} type="button" onClick={() => setEtat(e.value)}
              style={{ padding: "1rem", borderRadius: "var(--r-md)", border: "1px solid", borderColor: etat === e.value ? e.border : "var(--c-border)", background: etat === e.value ? e.bg : "rgba(255,255,255,0.8)", cursor: "pointer", textAlign: "center", transition: "all 0.12s" }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "var(--font-md)", color: etat === e.value ? e.color : "var(--c-text)" }}>{e.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Description travaux */}
      <div className="card-section">
        <p className="label-secondary" style={{ marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Description des travaux à réaliser *</p>
        <textarea className="textarea-lysma" rows={4} style={{ textTransform: "uppercase" }}
          value={description} onChange={(e) => setDescription(e.target.value.toUpperCase())}
          placeholder={"EX: PONT BLOQUÉ EN POSITION HAUTE\nNE REDESCEND PLUS\nBRUIT ANORMAL AU NIVEAU DU VÉRIN GAUCHE"}
          autoCapitalize="characters" autoCorrect="off" spellCheck={false} />
      </div>

      {/* Photos */}
      <div className="card-section">
        <p className="label-secondary" style={{ marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Photos <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--c-text-muted)", fontSize: "var(--font-xs)" }}>(optionnel · max 4)</span>
        </p>
        <p style={{ margin: "0 0 1rem", fontSize: "var(--font-sm)", color: "var(--c-text-secondary)" }}>Photos du matériel, de la panne, du numéro de série si illisible...</p>
        <PhotoUpload photos={photos} onChange={setPhotos} maxPhotos={4} />
      </div>

      {/* Commentaire */}
      <div className="card-section">
        <p className="label-secondary" style={{ marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Commentaire complémentaire</p>
        <textarea className="textarea-lysma" rows={3} style={{ textTransform: "uppercase" }}
          value={comment} onChange={(e) => setComment(e.target.value.toUpperCase())}
          placeholder="INFORMATIONS COMPLÉMENTAIRES..."
          autoCapitalize="characters" autoCorrect="off" spellCheck={false} />
      </div>

      {error && (
        <div className="alert-warning">
          <AlertTriangle size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: "1px" }} />
          <span>{error}</span>
        </div>
      )}

      {/* Résumé */}
      {(typeInterv || materiel || etat) && (
        <div style={{ padding: "1rem 1.25rem", borderRadius: "var(--r-md)", background: `${VIOLET}06`, border: "1px solid rgba(196,181,253,0.5)", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {typeInterv && <span className="badge-lysma" style={{ background: `${VIOLET}10`, color: VIOLET }}>{typeInterv === "site_client" ? "Sur site client" : "En atelier"}</span>}
          {avecDevis  && <span className="badge-lysma badge-blue">Avec devis</span>}
          {materiel   && <span className="badge-lysma badge-gray">{materiel === "AUTRE" ? materielAutre || "Autre" : materiel}</span>}
          {selectedEtat && <span className="badge-lysma" style={{ background: selectedEtat.bg, color: selectedEtat.color }}>{selectedEtat.label}</span>}
        </div>
      )}

      {/* Actions */}
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