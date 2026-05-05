"use client";

export default function SettingsFormulairesForm() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ padding: "1rem 1.25rem", borderRadius: "0.875rem", background: "rgba(239,246,255,0.6)", border: "1px solid #bfdbfe" }}>
        <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#0a4d9b" }}>📝 Formulaires personnalisés — disponible prochainement</p>
        <p style={{ margin: "0.35rem 0 0", fontSize: "0.82rem", color: "#1d4ed8" }}>
          Cette section permettra de personnaliser les champs affichés dans les formulaires de création de bons — champs obligatoires, optionnels, listes déroulantes personnalisées, etc.
        </p>
      </div>
      <div style={{ padding: "1.25rem", borderRadius: "1.25rem", background: "rgba(248,251,255,0.6)", border: "1px solid rgba(217,227,240,0.8)" }}>
        <p style={{ margin: "0 0 0.5rem", fontSize: "0.82rem", fontWeight: 700, color: "#334155" }}>Ce qui sera configurable</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {["Champs obligatoires vs optionnels sur les bons","Listes de motifs personnalisés (retour, refus, anomalie)","Champs métier spécifiques à votre activité","Ordre d'affichage des sections dans les formulaires","Activation/désactivation de blocs entiers (photos, anomalies...)"].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "0.5rem" }}>
              <span style={{ color: "#94a3b8", flexShrink: 0 }}>→</span>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#6b7280" }}>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}