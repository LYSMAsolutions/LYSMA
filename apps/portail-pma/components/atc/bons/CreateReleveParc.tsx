"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart2, Plus, Trash2, AlertTriangle, Send, Save } from "lucide-react";
import ClientSearchWithDrawer from "@/components/atc/bons/ClientSearchWithDrawer";
import ClientEquipmentPicker, { type EquipmentData } from "@/components/atc/bons/ClientEquipmentPicker";

type Client = { id: string; name: string; code: string | null; storeId: string | null; storeName: string | null; storeCode: string | null; representativeName: string | null; phone: string | null; email: string | null; addressLine1: string | null; postalCode: string | null; city: string | null; billingName: string | null };
type Store  = { id: string; name: string; code: string };

type EquipLine = { id: number; type: string; marque: string; modele: string; numSerie: string; annee: string };

type Props = { distributorSlug: string; clients: Client[]; stores: Store[] };

const TYPES_MATERIEL = [
  "PONT 4 COLONNES", "PONT 2 COLONNES", "PONT CISEAUX",
  "STATION CLIM", "ÉQUILIBREUSE", "DÉMONTE PNEUS",
  "COMPRESSEUR À VIS", "COMPRESSEUR À PISTON",
];

const GREEN = "#059669";

let lineId = 1;

export default function CreateReleveParc({ distributorSlug, clients, stores }: Props) {
  const router  = useRouter();
  const atcBase = `/${distributorSlug}/atc`;

  const [clientId,   setClientId]   = useState("");
  const [storeId,    setStoreId]    = useState("");
  const [numCompte,  setNumCompte]  = useState("");
  const [nomFactu,   setNomFactu]   = useState("");
  const [nomGerant,  setNomGerant]  = useState("");
  const [telephone,  setTelephone]  = useState("");
  const [adresse,    setAdresse]    = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [ville,      setVille]      = useState("");
  const [email,      setEmail]      = useState("");
  const [comment,    setComment]    = useState("");
  const [lines,      setLines]      = useState<EquipLine[]>([{ id: lineId++, type: "", marque: "", modele: "", numSerie: "", annee: "" }]);
  const [loading,    setLoading]    = useState<"draft" | "send" | null>(null);
  const [error,      setError]      = useState("");

  function handleClientChange(id: string) {
    setClientId(id);
    const c = clients.find((c) => c.id === id);
    if (!c) return;
    setNumCompte(c.code ?? "");
    setNomFactu(c.billingName ?? c.name ?? "");
    setNomGerant(c.representativeName ?? "");
    setTelephone(c.phone ?? "");
    setAdresse(c.addressLine1 ?? "");
    setCodePostal(c.postalCode ?? "");
    setVille(c.city ?? "");
    setEmail(c.email ?? "");
    if (c.storeId) setStoreId(c.storeId);
  }

  function addLine()   { setLines((p) => [...p, { id: lineId++, type: "", marque: "", modele: "", numSerie: "", annee: "" }]); }
  function addLineFromEquipment(eq: EquipmentData) {
    setLines((p) => [...p, { id: lineId++, type: eq.type_materiel, marque: eq.marque, modele: eq.modele, numSerie: eq.num_serie, annee: eq.annee }]);
  }
  function removeLine(id: number) { setLines((p) => p.filter((l) => l.id !== id)); }
  function updateLine(id: number, field: keyof EquipLine, value: string) {
    setLines((p) => p.map((l) => l.id === id ? { ...l, [field]: value } : l));
  }

  const validLines = lines.filter((l) => l.type && l.marque);

  async function handleSubmit(action: "draft" | "send") {
    if (action === "send") {
      if (!clientId)          { setError("Veuillez sélectionner un client."); return; }
      if (!validLines.length) { setError("Renseignez au moins un équipement avec son type et sa marque."); return; }
    }
    setError(""); setLoading(action);
    try {
      const res = await fetch("/api/atc/bons", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId, assigned_store_id: storeId || null,
          bon_type: "releve_parc", comment: comment || null, action,
          client_info: { num_compte: numCompte, nom_facturation: nomFactu, nom_gerant: nomGerant, telephone, adresse, code_postal: codePostal, ville, email },
          lines: validLines.map((l, i) => ({
            line_number: i + 1, type: "releve_parc",
            reference: l.numSerie || null,
            designation: [l.type, l.marque, l.modele, l.annee ? `(${l.annee})` : ""].filter(Boolean).join(" — "),
            quantity: 1, unit_price: null, comment: null,
            meta: { type_materiel: l.type, marque: l.marque, modele: l.modele, num_serie: l.numSerie, annee: l.annee },
          })),
          save_to_registry: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur."); return; }
      router.push(`${atcBase}/sav/${data.bon_id}`);
    } catch { setError("Erreur réseau."); }
    finally { setLoading(null); }
  }

  const inpSm = { padding: "0.5rem 0.75rem", fontSize: "var(--font-sm)" } as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Hero vert */}
      <div style={{ padding: "1.75rem", borderRadius: "var(--r-2xl)", background: "linear-gradient(135deg,rgba(5,150,105,0.05),rgba(16,185,129,0.03))", border: "1px solid rgba(167,243,208,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "0.75rem" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "var(--r-md)", background: "rgba(5,150,105,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <BarChart2 size={22} color={GREEN} strokeWidth={2} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "var(--font-xs)", fontWeight: 800, color: GREEN, textTransform: "uppercase", letterSpacing: "0.1em" }}>ATC · Contrat de maintenance</p>
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "var(--c-text)", letterSpacing: "-0.02em" }}>Relevé de parc</h1>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: "var(--font-md)", color: "var(--c-text-secondary)" }}>Relevez les équipements du client pour établir un contrat de maintenance.</p>
      </div>

      {/* Sélection client */}
      <div className="card-section">
        <p className="label-secondary" style={{ marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Client</p>
        <ClientSearchWithDrawer clients={clients} value={clientId} onChange={handleClientChange} stores={stores} />
      </div>

      {/* Infos client */}
      <div className="card-section">
        <p className="label-secondary" style={{ marginBottom: "0.375rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Informations client</p>
        <p style={{ margin: "0 0 1rem", fontSize: "var(--font-sm)", color: "var(--c-text-secondary)" }}>Pré-remplies depuis la fiche client — modifiables si nécessaire.</p>
        <div className="atc-grid-2">
          <div>
            <label className="label-field">N° de compte</label>
            <input className="input-lysma" style={{ fontFamily: "monospace", textTransform: "uppercase" }} value={numCompte}
              onChange={(e) => setNumCompte(e.target.value.toUpperCase())} placeholder="EX: CLI001"
              autoComplete="off" autoCorrect="off" spellCheck={false} />
          </div>
          <div>
            <label className="label-field">Nom de facturation</label>
            <input className="input-lysma" style={{ textTransform: "uppercase" }} value={nomFactu}
              onChange={(e) => setNomFactu(e.target.value.toUpperCase())} placeholder="EX: GARAGE MARTIN SAS"
              autoComplete="off" autoCorrect="off" spellCheck={false} />
          </div>
          <div>
            <label className="label-field">Nom du gérant</label>
            <input className="input-lysma" style={{ textTransform: "uppercase" }} value={nomGerant}
              onChange={(e) => setNomGerant(e.target.value.toUpperCase())} placeholder="EX: JEAN MARTIN"
              autoComplete="off" autoCorrect="off" spellCheck={false} />
          </div>
          <div>
            <label className="label-field">Téléphone</label>
            <input className="input-lysma" type="tel" inputMode="tel" value={telephone}
              onChange={(e) => setTelephone(e.target.value)} placeholder="06 12 34 56 78" autoComplete="off" />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="label-field">Adresse</label>
            <input className="input-lysma" style={{ textTransform: "uppercase" }} value={adresse}
              onChange={(e) => setAdresse(e.target.value.toUpperCase())} placeholder="EX: 12 RUE DE LA PAIX"
              autoComplete="off" autoCorrect="off" spellCheck={false} />
          </div>
          <div>
            <label className="label-field">Code postal</label>
            <input className="input-lysma" inputMode="numeric" value={codePostal}
              onChange={(e) => setCodePostal(e.target.value)} placeholder="75001" autoComplete="off" />
          </div>
          <div>
            <label className="label-field">Ville</label>
            <input className="input-lysma" style={{ textTransform: "uppercase" }} value={ville}
              onChange={(e) => setVille(e.target.value.toUpperCase())} placeholder="EX: PARIS"
              autoComplete="off" autoCorrect="off" spellCheck={false} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="label-field">Email</label>
            <input className="input-lysma" type="email" inputMode="email" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="contact@garage.fr" autoComplete="off" />
          </div>
        </div>
      </div>

      {/* Picker depuis parc existant */}
      {clientId && (
        <div className="card-section">
          <p className="label-secondary" style={{ marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Ajouter depuis le parc enregistré <span style={{ fontWeight: 400, color: "var(--c-text-muted)", fontSize: "var(--font-xs)" }}>(optionnel)</span>
          </p>
          <ClientEquipmentPicker
            clientId={clientId}
            value={null}
            onChange={(eq) => { if (eq) { addLineFromEquipment(eq); } }}
          />
        </div>
      )}

      {/* Équipements */}
      <div className="card-section">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <p className="label-secondary" style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>Équipements relevés</p>
          <button type="button" onClick={addLine}
            style={{ padding: "0.4rem 0.875rem", borderRadius: "var(--r-md)", background: "rgba(5,150,105,0.08)", border: "1px solid rgba(167,243,208,0.8)", color: GREEN, fontWeight: 700, fontSize: "var(--font-sm)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <Plus size={13} strokeWidth={2.5} /> Ajouter un équipement
          </button>
        </div>

        {/* En-tête tableau */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 70px 32px", gap: "0.5rem", padding: "0.5rem 0.75rem", marginBottom: "0.5rem" }}>
          {["Type de matériel", "Marque", "Modèle", "N° de série", "Année", ""].map((h) => (
            <span key={h} className="label-secondary" style={{ fontSize: "var(--font-xs)" }}>{h}</span>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {lines.map((line) => (
            <div key={line.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 70px 32px", gap: "0.5rem", alignItems: "center", padding: "0.625rem 0.75rem", borderRadius: "var(--r-md)", background: line.type ? "rgba(240,253,244,0.5)" : "var(--c-bg)", border: `1px solid ${line.type ? "rgba(167,243,208,0.4)" : "var(--c-border)"}` }}>
              <select className="select-lysma" style={inpSm} value={line.type} onChange={(e) => updateLine(line.id, "type", e.target.value)}>
                <option value="">— Type —</option>
                {TYPES_MATERIEL.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input className="input-lysma" style={{ ...inpSm, textTransform: "uppercase" }} value={line.marque}
                onChange={(e) => updateLine(line.id, "marque", e.target.value.toUpperCase())} placeholder="MARQUE" autoComplete="off" autoCorrect="off" spellCheck={false} />
              <input className="input-lysma" style={{ ...inpSm, textTransform: "uppercase" }} value={line.modele}
                onChange={(e) => updateLine(line.id, "modele", e.target.value.toUpperCase())} placeholder="MODÈLE" autoComplete="off" autoCorrect="off" spellCheck={false} />
              <input className="input-lysma" style={{ ...inpSm, textTransform: "uppercase", fontFamily: "monospace", fontSize: "var(--font-xs)" }} value={line.numSerie}
                onChange={(e) => updateLine(line.id, "numSerie", e.target.value.toUpperCase())} placeholder="N° SÉRIE" autoComplete="off" autoCorrect="off" spellCheck={false} />
              <input className="input-lysma" style={{ ...inpSm, textAlign: "center" }} type="number" inputMode="numeric"
                value={line.annee} onChange={(e) => updateLine(line.id, "annee", e.target.value)}
                placeholder="2019" min={1980} max={new Date().getFullYear() + 1} autoComplete="off" />
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

        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "var(--font-sm)", color: GREEN, fontWeight: 600 }}>Équipements relevés :</span>
          <span style={{ fontSize: "1.25rem", fontWeight: 800, color: GREEN }}>{validLines.length}</span>
        </div>
      </div>

      {/* Commentaire */}
      <div className="card-section">
        <p className="label-secondary" style={{ marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Observations</p>
        <textarea className="textarea-lysma" rows={3} style={{ textTransform: "uppercase" }}
          value={comment} onChange={(e) => setComment(e.target.value.toUpperCase())}
          placeholder="OBSERVATIONS GÉNÉRALES SUR LE PARC..."
          autoCapitalize="characters" autoCorrect="off" spellCheck={false} />
      </div>

      {error && (
        <div className="alert-warning">
          <AlertTriangle size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: "1px" }} />
          <span>{error}</span>
        </div>
      )}

      <div className="atc-actions" style={{ justifyContent: "flex-end" }}>
        <button type="button" onClick={() => router.push(`${atcBase}/bons`)} className="btn-secondary">Annuler</button>
        <button type="button" disabled={!!loading} onClick={() => handleSubmit("draft")} className="btn-secondary" style={{ opacity: loading ? 0.5 : 1 }}>
          <Save size={15} strokeWidth={2} /> {loading === "draft" ? "Sauvegarde..." : "Brouillon"}
        </button>
        <button type="button" disabled={!!loading} onClick={() => handleSubmit("send")}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.375rem", borderRadius: "var(--r-md)", background: loading ? "var(--c-text-muted)" : "linear-gradient(135deg,#059669,#10b981)", border: "none", color: "#fff", fontWeight: 700, fontSize: "var(--font-md)", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 14px rgba(5,150,105,0.3)" }}>
          <Send size={15} strokeWidth={2} /> {loading === "send" ? "Envoi..." : "Envoyer le relevé"}
        </button>
      </div>
    </div>
  );
}