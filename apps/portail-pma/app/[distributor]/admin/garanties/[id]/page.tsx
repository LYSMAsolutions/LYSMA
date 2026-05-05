"use client";

import { use, useState, useEffect } from "react";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import GarantieActions from "@/components/admin/garanties/GarantieActions";

type Garantie = {
  id: string; numero_garantie: string | null; status: string | null; created_at: string;
  marque_piece: string | null; fournisseur: string | null; reference_piece: string | null; quantite: number | null;
  n_bon_livraison: string | null; date_bon_livraison: string | null; defaut_constate: string | null;
  date_montage_1: string | null; km_montage_1: number | null; date_montage_2: string | null; km_montage_2: number | null;
  marque_vehicule: string | null; type_vehicule: string | null; cylindree: string | null; annee_vehicule: string | null; immat_vehicule: string | null;
  retour_fournisseur: boolean | null; date_envoi_expert: string | null;
  date_decision: string | null; decision: string | null; decision_bl: string | null; decision_commentaire: string | null;
  doc_carte_grise: string | null; doc_facture_1: string | null; doc_facture_2: string | null; doc_bl_1: string | null; doc_bl_2: string | null;
  commentaire: string | null;
  clients: { name: string; code: string | null; phone: string | null; email: string | null } | null;
  stores:  { name: string; code: string } | null;
  users:   { first_name: string | null; last_name: string | null; email: string | null } | null;
};

const fd  = (d: string | null | undefined) => d ? new Intl.DateTimeFormat("fr-FR").format(new Date(d)) : "—";
const fdt = (d: string | null | undefined) => d ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(new Date(d)) : "—";

const STATUS_MAP: Record<string, { label: string; bg: string; color: string; border: string }> = {
  brouillon:              { label: "Brouillon",           bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" },
  en_cours:               { label: "En cours",            bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  en_attente_fournisseur: { label: "Attente fournisseur", bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  validee:                { label: "Validée",             bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  refusee:                { label: "Refusée",             bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

const ACTIONS_BY_STATUS: Record<string, { key: string; label: string; color: string; needsBl: boolean; needsReason: boolean; confirmLabel: string }[]> = {
  en_cours: [
    { key: "envoyer-expert",  label: "Envoyer fournisseur",    color: "#7c3aed", needsBl: false, needsReason: false, confirmLabel: "Envoyer pour expertise" },
    { key: "valider-echange", label: "Valider — Échange", color: "#059669", needsBl: true,  needsReason: false, confirmLabel: "Valider l'échange"       },
    { key: "valider-avoir",   label: "Valider — Avoir",   color: "#059669", needsBl: true,  needsReason: false, confirmLabel: "Valider l'avoir"         },
    { key: "refuser",         label: "Refuser",           color: "#dc2626", needsBl: false, needsReason: true,  confirmLabel: "Confirmer le refus"      },
  ],
  en_attente_fournisseur: [
    { key: "valider-echange", label: "Valider — Échange", color: "#059669", needsBl: true,  needsReason: false, confirmLabel: "Valider l'échange" },
    { key: "valider-avoir",   label: "Valider — Avoir",   color: "#059669", needsBl: true,  needsReason: false, confirmLabel: "Valider l'avoir"   },
    { key: "refuser",         label: "Refuser",           color: "#dc2626", needsBl: false, needsReason: true,  confirmLabel: "Confirmer le refus" },
  ],
};

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (!value && value !== 0) return null;
  return (
    <div>
      <p style={{ margin: "0 0 0.2rem", fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{label}</p>
      <p className="section-copy" style={{ margin: 0, fontWeight: 500 }}>{value}</p>
    </div>
  );
}

export default function AdminGarantieDetailPage({ params }: { params: Promise<{ distributor: string; id: string }> }) {
  const { distributor, id } = use(params);
  const [garantie, setGarantie] = useState<Garantie | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch(`/api/admin/garanties/${id}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setGarantie(d.garantie); })
      .finally(() => setLoading(false));
  }, [id]);

  const adminBase = `/${distributor}/admin`;

  if (loading) return (
    <AdminModulePage badge="Garantie · Admin" title="Chargement..." backHref={`${adminBase}/garanties`} backLabel="Retour garanties">
      <section className="card-lysma" style={{ padding: "2rem", textAlign: "center" as const }}>
        <p className="section-copy">Chargement du dossier...</p>
      </section>
    </AdminModulePage>
  );

  if (!garantie) return (
    <AdminModulePage badge="Garantie · Admin" title="Introuvable" backHref={`${adminBase}/garanties`} backLabel="Retour garanties">
      <section className="card-lysma" style={{ padding: "2rem", textAlign: "center" as const }}>
        <p className="section-copy" style={{ color: "#dc2626" }}>Garantie introuvable.</p>
      </section>
    </AdminModulePage>
  );

  const st      = STATUS_MAP[garantie.status ?? "brouillon"] ?? STATUS_MAP.brouillon;
  const km      = garantie.km_montage_1 && garantie.km_montage_2 ? Math.max(0, Number(garantie.km_montage_2) - Number(garantie.km_montage_1)) : null;
  const actions = ACTIONS_BY_STATUS[garantie.status ?? ""] ?? [];
  const DOCS    = [
    { label: "Carte grise",          value: garantie.doc_carte_grise },
    { label: "Facture 1er montage",  value: garantie.doc_facture_1   },
    { label: "Facture 2ème montage", value: garantie.doc_facture_2   },
    { label: "BL magasin n°1",       value: garantie.doc_bl_1        },
    { label: "BL magasin n°2",       value: garantie.doc_bl_2        },
  ];

  return (
    <AdminModulePage
      badge="Garantie · Admin"
      title={garantie.numero_garantie ?? "Brouillon"}
      description={`Créée le ${fdt(garantie.created_at)}${garantie.users ? ` · ATC : ${garantie.users.first_name} ${garantie.users.last_name}` : ""}`}
      backHref={`${adminBase}/garanties`}
      backLabel="Retour garanties"
      actions={
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", padding: "0.3rem 0.875rem", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 700, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
            {st.label}
          </span>
          <a href={`/${distributor}/atc/garanties/${id}/print`} className="btn-secondary" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            🖨 Imprimer
          </a>
        </div>
      }
    >
      {actions.length > 0 && <GarantieActions garantieId={id} actions={actions} />}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <section className="card-lysma" style={{ padding: "1.5rem" }}>
          <h2 className="section-title" style={{ marginBottom: "1rem" }}>Client</h2>
          {garantie.clients ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <p style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                {garantie.clients.code && <span style={{ fontFamily: "monospace", color: "#0a4d9b", marginRight: "0.4rem" }}>{garantie.clients.code}</span>}
                {garantie.clients.name}
              </p>
              <Field label="Téléphone" value={garantie.clients.phone} />
              <Field label="Email"     value={garantie.clients.email} />
            </div>
          ) : <p className="section-copy">—</p>}
        </section>

        <section className="card-lysma" style={{ padding: "1.5rem" }}>
          <h2 className="section-title" style={{ marginBottom: "1rem" }}>Magasin</h2>
          {garantie.stores ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <p style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                <span style={{ fontFamily: "monospace", color: "#0a4d9b", marginRight: "0.4rem" }}>{garantie.stores.code}</span>
                {garantie.stores.name}
              </p>
              {garantie.users && <p className="section-copy">ATC : {garantie.users.first_name} {garantie.users.last_name}</p>}
            </div>
          ) : <p className="section-copy">—</p>}
        </section>
      </div>

      <section className="card-lysma" style={{ padding: "1.5rem" }}>
        <h2 className="section-title" style={{ marginBottom: "1.25rem" }}>Pièce en garantie</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem 1.5rem" }}>
          <Field label="Marque"       value={garantie.marque_piece}    />
          <Field label="Fournisseur"  value={garantie.fournisseur}     />
          <Field label="Référence"    value={garantie.reference_piece} />
          <Field label="Quantité"     value={garantie.quantite}        />
          <Field label="N° BL client" value={garantie.n_bon_livraison} />
          <Field label="Date BL"      value={fd(garantie.date_bon_livraison)} />
        </div>
        {garantie.defaut_constate && (
          <div style={{ marginTop: "1rem", padding: "0.875rem 1rem", borderRadius: "0.875rem", background: "#fffbeb", border: "1px solid #fde68a" }}>
            <p style={{ margin: "0 0 0.375rem", fontSize: "0.72rem", fontWeight: 700, color: "#b45309", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Défaut constaté</p>
            <p className="section-copy" style={{ margin: 0, fontWeight: 600, whiteSpace: "pre-line" }}>{garantie.defaut_constate}</p>
          </div>
        )}
      </section>

      <section className="card-lysma" style={{ padding: "1.5rem" }}>
        <h2 className="section-title" style={{ marginBottom: "1.25rem" }}>Montages</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ padding: "1rem", borderRadius: "0.875rem", background: "#eff6ff", border: "1px solid #bfdbfe" }}>
            <p style={{ margin: "0 0 0.75rem", fontSize: "0.75rem", fontWeight: 700, color: "#0a4d9b", textTransform: "uppercase" as const }}>1er montage</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Field label="Date"        value={fd(garantie.date_montage_1)} />
              <Field label="Kilométrage" value={garantie.km_montage_1 ? `${Number(garantie.km_montage_1).toLocaleString("fr-FR")} km` : null} />
            </div>
          </div>
          <div style={{ padding: "1rem", borderRadius: "0.875rem", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <p style={{ margin: "0 0 0.75rem", fontSize: "0.75rem", fontWeight: 700, color: "#334155", textTransform: "uppercase" as const }}>2ème montage (dépose)</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Field label="Date"        value={fd(garantie.date_montage_2)} />
              <Field label="Kilométrage" value={garantie.km_montage_2 ? `${Number(garantie.km_montage_2).toLocaleString("fr-FR")} km` : null} />
            </div>
          </div>
        </div>
        {km !== null && (
          <div style={{ marginTop: "1rem", padding: "0.875rem 1.25rem", borderRadius: "0.875rem", background: km < 5000 ? "#eff6ff" : "#fffbeb", border: `1px solid ${km < 5000 ? "#bfdbfe" : "#fde68a"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p className="section-copy" style={{ margin: 0, fontWeight: 600 }}>Kilométrage parcouru</p>
            <p style={{ margin: 0, fontSize: "1.375rem", fontWeight: 800, color: km < 5000 ? "#0a4d9b" : "#b45309" }}>{km.toLocaleString("fr-FR")} km</p>
          </div>
        )}
      </section>

      <section className="card-lysma" style={{ padding: "1.5rem" }}>
        <h2 className="section-title" style={{ marginBottom: "1.25rem" }}>Véhicule</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem 1.5rem" }}>
          <Field label="Marque"          value={garantie.marque_vehicule} />
          <Field label="Type / Modèle"   value={garantie.type_vehicule}   />
          <Field label="Immatriculation" value={garantie.immat_vehicule}  />
          <Field label="Cylindrée"       value={garantie.cylindree}       />
          <Field label="Année"           value={garantie.annee_vehicule}  />
        </div>
      </section>

      <section className="card-lysma" style={{ padding: "1.5rem" }}>
        <h2 className="section-title" style={{ marginBottom: "1.25rem" }}>Documents joints</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {DOCS.map(({ label, value }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.75rem 1rem", borderRadius: "0.75rem", background: value ? "#f0fdf4" : "#f8fafc", border: `1px solid ${value ? "#bbf7d0" : "#e2e8f0"}` }}>
              {value ? (
                <>
                  {value.startsWith("data:image") ? (
                    <img src={value} alt={label} style={{ width: "44px", height: "44px", objectFit: "cover" as const, borderRadius: "0.5rem", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: "44px", height: "44px", borderRadius: "0.5rem", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.25rem" }}>📄</div>
                  )}
                  <p className="section-copy" style={{ margin: 0, color: "#15803d", fontWeight: 700 }}>✓ {label}</p>
                </>
              ) : (
                <>
                  <div style={{ width: "44px", height: "44px", borderRadius: "0.5rem", background: "#f1f5f9", border: "1px dashed #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>—</div>
                  <p className="section-copy" style={{ margin: 0, color: "#94a3b8" }}>{label} — non fourni</p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {(garantie.decision || garantie.decision_commentaire) && (
        <section className="card-lysma" style={{ padding: "1.5rem" }}>
          <h2 className="section-title" style={{ marginBottom: "1.25rem" }}>Décision fournisseur</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem 1.5rem" }}>
            <Field label="Décision"      value={garantie.decision?.toUpperCase()} />
            <Field label="Date décision" value={fd(garantie.date_decision)}       />
            <Field label="BL décision"   value={garantie.decision_bl}             />
          </div>
          {garantie.decision_commentaire && (
            <div style={{ marginTop: "1rem" }}>
              <p style={{ margin: "0 0 0.375rem", fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Commentaire</p>
              <p className="section-copy" style={{ margin: 0, whiteSpace: "pre-line" }}>{garantie.decision_commentaire}</p>
            </div>
          )}
        </section>
      )}

      {garantie.commentaire && (
        <section className="card-lysma" style={{ padding: "1.5rem" }}>
          <h2 className="section-title" style={{ marginBottom: "0.875rem" }}>Commentaire ATC</h2>
          <p className="section-copy" style={{ margin: 0, whiteSpace: "pre-line" }}>{garantie.commentaire}</p>
        </section>
      )}
    </AdminModulePage>
  );
}