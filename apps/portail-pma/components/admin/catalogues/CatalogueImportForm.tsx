"use client";

import { useActionState, useRef } from "react";
import Link from "next/link";
import type { CatalogueImportResult } from "@/app/[distributor]/admin/catalogues/imports/actions";
import { importCataloguesCsvAction } from "@/app/[distributor]/admin/catalogues/imports/actions";

const initialState: CatalogueImportResult = { success: false, error: null };

const COLONNES = [
  { col: "designation",            req: true,  desc: "Nom ou libellé du produit" },
  { col: "famille",                req: true,  desc: "fournisseur / promo / operation_commerciale / interne / outillage / materiel" },
  { col: "reference_interne",      req: false, desc: "Votre référence interne (clé de mise à jour — si déjà importée, la ligne sera mise à jour)" },
  { col: "reference_fournisseur",  req: false, desc: "Référence du fournisseur" },
  { col: "code_facturation",       req: false, desc: "Code utilisé sur les bons" },
  { col: "marque",                 req: false, desc: "Marque du produit" },
  { col: "prix_ht",                req: false, desc: "Prix hors taxe (ex: 49.90 ou 49,90)" },
  { col: "taux_tva",               req: false, desc: "Taux de TVA en % (ex: 20)" },
  { col: "stock",                  req: false, desc: "Quantité disponible (entier)" },
  { col: "code_fournisseur",       req: false, desc: "Code du fournisseur tel qu'il est défini dans le portail (Catalogue → Fournisseurs)" },
  { col: "code_catalogue",         req: false, desc: "Code du catalogue auquel rattacher le produit" },
  { col: "image_url",              req: false, desc: "URL directe vers l'image (.jpg, .png, .webp)" },
  { col: "description",            req: false, desc: "Description longue du produit" },
];

export default function CatalogueImportForm({ distributor }: { distributor: string }) {
  const action = importCataloguesCsvAction.bind(null, distributor);
  const [state, formAction, pending] = useActionState(action, initialState);
  const fileRef = useRef<HTMLInputElement>(null);
  const fileNameRef = useRef<HTMLSpanElement>(null);

  const summary = state.summary;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Info code fournisseur */}
      <div style={{ borderRadius: "1rem", background: "rgba(239,246,255,0.6)", border: "1px solid #bfdbfe", padding: "1.25rem" }}>
        <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", fontWeight: 700, color: "#0a4d9b" }}>💡 Comment utiliser le code fournisseur dans le CSV</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {[
            "La colonne code_fournisseur doit contenir le code exact du fournisseur tel qu'il est enregistré dans le portail (Catalogue → Fournisseurs).",
            "Si un code fournisseur n'est pas reconnu, le produit est quand même importé — mais sans fournisseur rattaché. Vous pourrez le lier manuellement depuis la fiche produit.",
            "Pour voir vos codes fournisseurs : allez dans Catalogue → Fournisseurs. La première colonne du tableau affiche le code de chaque fournisseur.",
            "Si le fournisseur n'existe pas encore, créez-le d'abord dans Catalogue → Fournisseurs, puis relancez l'import.",
          ].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: "0.5rem" }}>
              <span style={{ color: "#0a4d9b", fontWeight: 700, flexShrink: 0 }}>→</span>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#1d4ed8" }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Colonnes */}
      <div style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
        <div style={{ padding: "1rem 1.25rem", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Colonnes attendues</p>
          <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>délimiteur , ou ;</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {COLONNES.map((c, i) => (
            <div key={c.col} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.8rem 1.25rem", borderBottom: i < COLONNES.length - 1 ? "1px solid rgba(226,232,240,0.5)" : "none", background: i % 2 === 0 ? "transparent" : "rgba(248,251,255,0.4)" }}>
              <span style={{ display: "inline-flex", padding: "0.15rem 0.5rem", borderRadius: "999px", fontSize: "0.68rem", fontWeight: 700, background: c.req ? "#eff6ff" : "#f8fafc", color: c.req ? "#1d4ed8" : "#94a3b8", border: c.req ? "1px solid #bfdbfe" : "1px solid #e2e8f0", whiteSpace: "nowrap", flexShrink: 0, marginTop: "2px" }}>
                {c.req ? "requis" : "optionnel"}
              </span>
              <div>
                <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 700, color: "#0f172a", fontFamily: "monospace" }}>{c.col}</p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Familles */}
      <div style={{ borderRadius: "1rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", padding: "1.25rem" }}>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.875rem", fontWeight: 700, color: "#0f172a" }}>
          Valeurs acceptées pour <code style={{ fontFamily: "monospace", background: "#f1f5f9", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>famille</code>
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.5rem" }}>
          {[
            { value: "fournisseur",           label: "Catalogue fournisseur" },
            { value: "promo",                 label: "Promotion" },
            { value: "operation_commerciale", label: "Opération commerciale" },
            { value: "interne",               label: "Usage interne" },
            { value: "outillage",             label: "Outillage" },
            { value: "materiel",              label: "Matériel / SAV" },
          ].map((f) => (
            <div key={f.value} style={{ padding: "0.6rem 0.875rem", borderRadius: "0.875rem", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 700, color: "#0f172a", fontFamily: "monospace" }}>{f.value}</p>
              <p style={{ margin: "0.15rem 0 0", fontSize: "0.72rem", color: "#6b7280" }}>{f.label}</p>
            </div>
          ))}
        </div>
        <p style={{ margin: "0.75rem 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>⚠️ Valeurs sensibles à la casse — minuscules et underscores obligatoires.</p>
      </div>

      {/* Formulaire */}
      <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", padding: "1.75rem", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
        <div>
          <p style={{ margin: "0 0 0.75rem", fontSize: "0.8rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" }}>Mode d'import</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {[
              { value: "test",       label: "Test",       desc: "Simule l'import — aucune donnée créée. Idéal pour vérifier votre fichier avant le vrai import.", color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
              { value: "production", label: "Production",  desc: "Import réel — crée les nouveaux produits et met à jour les existants.", color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
            ].map((m) => (
              <label key={m.value} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.875rem 1rem", borderRadius: "0.875rem", border: `1px solid ${m.border}`, background: m.bg, cursor: "pointer" }}>
                <input type="radio" name="mode" value={m.value} defaultChecked={m.value === "test"} style={{ accentColor: m.color, marginTop: "3px" }} />
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: m.color }}>{m.label}</p>
                  <p style={{ margin: "0.2rem 0 0", fontSize: "0.75rem", color: "#6b7280" }}>{m.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.8rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" }}>Fichier CSV</p>
          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", borderRadius: "1.25rem", border: "2px dashed #dce5f0", background: "#f8fafc", cursor: "pointer", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem" }}>📥</span>
            <span ref={fileNameRef} style={{ fontSize: "0.875rem", fontWeight: 600, color: "#475569" }}>Cliquez pour sélectionner un fichier CSV</span>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Taille max : 10 Mo · Délimiteur , ou ;</span>
            <input ref={fileRef} type="file" name="file" accept=".csv" style={{ display: "none" }} onChange={(e) => {
              const f = e.target.files?.[0];
              if (f && fileNameRef.current) fileNameRef.current.textContent = f.name;
            }} />
          </label>
        </div>

        {state.error && (
          <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{state.error}</div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" disabled={pending} style={{ padding: "0.75rem 2rem", borderRadius: "0.875rem", background: pending ? "#94a3b8" : "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: pending ? "not-allowed" : "pointer", boxShadow: "0 8px 20px rgba(30,115,216,0.25)" }}>
            {pending ? "Import en cours..." : "Lancer l'import"}
          </button>
        </div>
      </form>

      {/* Résultats */}
      {state.success && summary && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            {[
              { label: "Total lignes", value: summary.totalRows, color: "#0a4d9b", bg: "#eff6ff", border: "#bfdbfe" },
              { label: "Créés",        value: summary.created,   color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
              { label: "Mis à jour",   value: summary.updated,   color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
              { label: "Ignorés",      value: summary.skipped,   color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
            ].map((s) => (
              <div key={s.label} style={{ padding: "1.25rem", borderRadius: "1rem", background: s.bg, border: `1px solid ${s.border}` }}>
                <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
                <p style={{ margin: "0.5rem 0 0", fontSize: "2rem", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.72rem", color: "#94a3b8" }}>
                  {summary.mode === "test" ? "simulé" : "réel"}
                </p>
              </div>
            ))}
          </div>

          {/* Fournisseurs inconnus */}
          {summary.unknownSupplierCodes.length > 0 && (
            <div style={{ borderRadius: "1rem", background: "#fffbeb", border: "1px solid #fde68a", padding: "1.25rem" }}>
              <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", fontWeight: 700, color: "#b45309" }}>
                ⚠️ Fournisseurs non reconnus ({summary.unknownSupplierCodes.length} code{summary.unknownSupplierCodes.length > 1 ? "s" : ""})
              </p>
              <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: "#92400e" }}>
                Les produits concernés ont été importés <strong>sans fournisseur rattaché</strong>. Pour lier ces produits à leurs fournisseurs, vous avez deux options :
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "1rem" }}>
                <p style={{ margin: 0, fontSize: "0.82rem", color: "#92400e" }}>→ <strong>Option 1 :</strong> Créer les fournisseurs manquants avec les codes ci-dessous, puis relancer l'import.</p>
                <p style={{ margin: 0, fontSize: "0.82rem", color: "#92400e" }}>→ <strong>Option 2 :</strong> Modifier chaque produit manuellement depuis Catalogue → Produits pour lui associer le bon fournisseur.</p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                {summary.unknownSupplierCodes.map((code) => (
                  <span key={code} style={{ display: "inline-flex", padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 700, background: "#fff", color: "#b45309", border: "1px solid #fde68a", fontFamily: "monospace" }}>{code}</span>
                ))}
              </div>
              <Link href={`/${distributor}/admin/catalogues/fournisseurs`} style={{ display: "inline-flex", padding: "0.55rem 1.25rem", borderRadius: "0.875rem", background: "linear-gradient(135deg,#b45309,#d97706)", color: "#fff", fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", boxShadow: "0 4px 12px rgba(180,83,9,0.2)" }}>
                Gérer les fournisseurs →
              </Link>
            </div>
          )}

          {/* Erreurs bloquantes */}
          {summary.errors.length > 0 && (
            <div style={{ borderRadius: "1rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", padding: "1.25rem" }}>
              <p style={{ margin: "0 0 0.5rem", fontSize: "0.82rem", fontWeight: 700, color: "#dc2626" }}>Erreurs bloquantes ({summary.errors.length})</p>
              <p style={{ margin: "0 0 0.75rem", fontSize: "0.78rem", color: "#6b7280" }}>Ces lignes n'ont pas été importées. Corrigez le fichier CSV et relancez l'import.</p>
              <div style={{ maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {summary.errors.map((err, i) => (
                  <div key={i} style={{ padding: "0.5rem 0.75rem", borderRadius: "0.5rem", background: "#fef2f2", border: "1px solid #fecaca", fontSize: "0.78rem", color: "#dc2626" }}>{err}</div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {summary.warnings.length > 0 && (
            <div style={{ borderRadius: "1rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", padding: "1.25rem" }}>
              <p style={{ margin: "0 0 0.5rem", fontSize: "0.82rem", fontWeight: 700, color: "#b45309" }}>Avertissements ({summary.warnings.length})</p>
              <p style={{ margin: "0 0 0.75rem", fontSize: "0.78rem", color: "#6b7280" }}>Ces lignes ont été traitées mais nécessitent votre attention.</p>
              <div style={{ maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {summary.warnings.map((w, i) => (
                  <div key={i} style={{ padding: "0.5rem 0.75rem", borderRadius: "0.5rem", background: "#fffbeb", border: "1px solid #fde68a", fontSize: "0.78rem", color: "#b45309" }}>{w}</div>
                ))}
              </div>
            </div>
          )}

          {/* Succès total */}
          {summary.errors.length === 0 && summary.unknownSupplierCodes.length === 0 && (
            <div style={{ padding: "0.875rem 1rem", borderRadius: "0.875rem", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#15803d" }}>✓ Import terminé sans erreur ni fournisseur manquant.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}