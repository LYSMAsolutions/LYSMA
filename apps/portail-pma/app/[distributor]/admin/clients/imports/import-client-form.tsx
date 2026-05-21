"use client";

import { useActionState, useState } from "react";

type ImportSummary = {
  totalRows: number;
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
  batchId?: string | null;
  mode?: "test" | "production";
};

type ImportResult = {
  success: boolean;
  error: string | null;
  summary?: ImportSummary;
};

type DeleteResult = {
  success: boolean;
  error: string | null;
  deleted: number;
};

type Props = {
  action: (state: ImportResult, formData: FormData) => Promise<ImportResult>;
  deleteAction: () => Promise<DeleteResult>;
};

const initialImportState: ImportResult = { success: false, error: null };
const initialDeleteState: DeleteResult = { success: false, error: null, deleted: 0 };

const COLONNES = [
  { col: "code client",       req: false, desc: "Code unique du client" },
  { col: "nom client",        req: true,  desc: "Raison sociale ou nom" },
  { col: "email",             req: false, desc: "Email de contact" },
  { col: "representant",      req: false, desc: "Nom du représentant" },
  { col: "adresse",           req: false, desc: "Adresse ligne 1" },
  { col: "adresse 2",         req: false, desc: "Adresse ligne 2 (optionnel)" },
  { col: "cp",                req: false, desc: "Code postal" },
  { col: "ville",             req: false, desc: "Ville" },
  { col: "telephone fixe",    req: false, desc: "Téléphone principal" },
  { col: "telephone mobile",  req: false, desc: "Téléphone secondaire" },
  { col: "atc code",          req: false, desc: "Code de l'ATC assigné" },
  { col: "code magasin",      req: false, desc: "Code du magasin rattaché" },
];

export function ImportClientForm({ action, deleteAction }: Props) {
  const [state, formAction, pending] = useActionState(action, initialImportState);
  const [deleteState, deleteFormAction, deletePending] = useActionState(deleteAction, initialDeleteState);
  const [fileName, setFileName] = useState<string | null>(null);
  const [mode, setMode] = useState<"test" | "production">("test");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Explication colonnes */}
      <div style={{ borderRadius: "1.25rem", border: "1px solid rgba(217,227,240,0.8)", overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.25rem", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Colonnes attendues
          </p>
          <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>délimiteur , ou ;</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 0 }}>
          {COLONNES.map((c, i) => (
            <div key={c.col} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.7rem 1.25rem", borderBottom: i < COLONNES.length - 1 ? "1px solid rgba(226,232,240,0.5)" : "none", background: i % 2 === 0 ? "transparent" : "rgba(248,251,255,0.4)" }}>
              <span style={{ display: "inline-flex", padding: "0.15rem 0.5rem", borderRadius: "999px", fontSize: "0.68rem", fontWeight: 700, background: c.req ? "#eff6ff" : "#f8fafc", color: c.req ? "#1d4ed8" : "#94a3b8", border: c.req ? "1px solid #bfdbfe" : "1px solid #e2e8f0", whiteSpace: "nowrap" }}>
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

      {/* Formulaire */}
      <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <input type="hidden" name="mode" value={mode} />

        {/* Zone fichier */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Fichier CSV
          </label>
          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem", padding: "2rem", borderRadius: "1.25rem", border: "2px dashed", borderColor: fileName ? "#bfdbfe" : "#dce5f0", background: fileName ? "rgba(239,246,255,0.5)" : "rgba(248,251,255,0.8)", cursor: "pointer", transition: "all 0.18s" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: fileName ? "linear-gradient(135deg,#eff6ff,#dbeafe)" : "#f1f5f9", border: fileName ? "1px solid #bfdbfe" : "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>
              {fileName ? "📄" : "📂"}
            </div>
            {fileName
              ? <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#0a4d9b" }}>{fileName}</p>
              : <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Cliquez pour choisir un fichier CSV</p>
            }
            <input
              type="file"
              name="file"
              accept=".csv,text/csv"
              style={{ display: "none" }}
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
          </label>
        </div>

        {/* Sélecteur mode */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Mode d'exécution
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={() => setMode("test")}
              style={{ padding: "1rem 1.25rem", borderRadius: "1rem", border: mode === "test" ? "2px solid #bfdbfe" : "1px solid #e2e8f0", background: mode === "test" ? "linear-gradient(135deg,#eff6ff,#ffffff)" : "#f8fafc", cursor: "pointer", textAlign: "left", transition: "all 0.18s" }}
            >
              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: mode === "test" ? "#0a4d9b" : "#0f172a" }}>🔬 Mode test</p>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.78rem", color: "#6b7280" }}>Simule l'import, ne crée rien. Les clients existants sont signalés.</p>
            </button>
            <button
              type="button"
              onClick={() => setMode("production")}
              style={{ padding: "1rem 1.25rem", borderRadius: "1rem", border: mode === "production" ? "2px solid #bbf7d0" : "1px solid #e2e8f0", background: mode === "production" ? "linear-gradient(135deg,#f0fdf4,#ffffff)" : "#f8fafc", cursor: "pointer", textAlign: "left", transition: "all 0.18s" }}
            >
              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: mode === "production" ? "#15803d" : "#0f172a" }}>🚀 Mode production</p>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.78rem", color: "#6b7280" }}>Crée et met à jour réellement les clients.</p>
            </button>
          </div>
        </div>

        {/* Erreur */}
        {state.error && (
          <div style={{ padding: "1rem 1.25rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: "0.875rem" }}>
            {state.error}
          </div>
        )}

        {/* Résultats */}
        {state.summary && (
          <div style={{ borderRadius: "1.25rem", border: "1px solid rgba(217,227,240,0.8)", overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.25rem", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Résultat import</p>
              <span style={{ display: "inline-flex", padding: "0.2rem 0.65rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: state.summary.mode === "production" ? "#f0fdf4" : "#eff6ff", color: state.summary.mode === "production" ? "#15803d" : "#1d4ed8", border: state.summary.mode === "production" ? "1px solid #bbf7d0" : "1px solid #bfdbfe" }}>
                {state.summary.mode === "production" ? "Production" : "Test"}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
              {[
                { label: "Lignes",      value: state.summary.totalRows, color: "#334155", border: "#e2e8f0", bg: "#f8fafc" },
                { label: "Créés",       value: state.summary.created,   color: "#15803d", border: "#bbf7d0", bg: "#f0fdf4" },
                { label: "Mis à jour",  value: state.summary.updated,   color: "#0a4d9b", border: "#bfdbfe", bg: "#eff6ff" },
                { label: "Ignorés",     value: state.summary.skipped,   color: "#b45309", border: "#fde68a", bg: "#fffbeb" },
              ].map((item: any) => (
                <div key={item.label} style={{ padding: "1.25rem", borderRight: "1px solid rgba(226,232,240,0.5)", background: item.bg, borderTop: "none" }}>
                  <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.label}</p>
                  <p style={{ margin: "0.5rem 0 0", fontSize: "2rem", fontWeight: 800, color: item.color, lineHeight: 1 }}>{item.value}</p>
                </div>
              ))}
            </div>

            {state.summary.errors.length > 0 && (
              <div style={{ padding: "1.25rem", borderTop: "1px solid rgba(217,227,240,0.8)" }}>
                <p style={{ margin: "0 0 0.75rem", fontSize: "0.8rem", fontWeight: 700, color: "#b91c1c" }}>
                  {state.summary.errors.length} erreur{state.summary.errors.length > 1 ? "s" : ""} détectée{state.summary.errors.length > 1 ? "s" : ""}
                </p>
                <div style={{ maxHeight: "240px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {state.summary.errors.map((err, i) => (
                    <div key={i} style={{ padding: "0.5rem 0.875rem", borderRadius: "0.75rem", background: "#fef2f2", border: "1px solid #fecaca", fontSize: "0.8rem", color: "#7f1d1d" }}>
                      {err}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {state.summary.mode === "test" && state.summary.created > 0 && (
              <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid rgba(217,227,240,0.8)", background: "rgba(255,251,235,0.5)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <p style={{ margin: 0, fontSize: "0.82rem", color: "#92400e" }}>
                  ⚠️ Ces clients ont été créés en mode test — vous pouvez les supprimer.
                </p>
                <form action={deleteFormAction}>
                  <button type="submit" disabled={deletePending} style={{ padding: "0.5rem 1rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
                    {deletePending ? "Suppression..." : "Annuler le test"}
                  </button>
                </form>
              </div>
            )}

            {deleteState.deleted > 0 && (
              <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid rgba(217,227,240,0.8)", background: "#f0fdf4", fontSize: "0.82rem", color: "#15803d", fontWeight: 600 }}>
                ✅ {deleteState.deleted} client{deleteState.deleted > 1 ? "s" : ""} supprimé{deleteState.deleted > 1 ? "s" : ""}.
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={pending || !fileName}
            style={{ padding: "0.75rem 1.75rem", borderRadius: "0.875rem", background: pending || !fileName ? "#94a3b8" : "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: pending || !fileName ? "not-allowed" : "pointer", boxShadow: pending || !fileName ? "none" : "0 8px 20px rgba(30,115,216,0.25)" }}
          >
            {pending ? "Import en cours..." : "Importer le fichier"}
          </button>
        </div>
      </form>
    </div>
  );
}