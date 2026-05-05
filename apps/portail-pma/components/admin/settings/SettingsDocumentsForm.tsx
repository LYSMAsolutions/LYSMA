"use client";

export default function SettingsDocumentsForm() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ padding: "1rem 1.25rem", borderRadius: "0.875rem", background: "rgba(239,246,255,0.6)", border: "1px solid #bfdbfe" }}>
        <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#0a4d9b" }}>📄 Gestion des documents — disponible prochainement</p>
        <p style={{ margin: "0.35rem 0 0", fontSize: "0.82rem", color: "#1d4ed8" }}>
          Cette section permettra de configurer les modèles de documents générés par le portail — bons, devis, contrats, courriers. Elle sera disponible avec la génération PDF avancée dans une prochaine version.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
        {["Bon de commande", "Bon de retour", "Devis", "Bon SAV", "Bon d'intervention", "Contrat de maintenance"].map((doc) => (
          <div key={doc} style={{ padding: "1.25rem", borderRadius: "1.25rem", border: "1px solid #e2e8f0", background: "#f8fafc", opacity: 0.7, position: "relative" }}>
            <span style={{ position: "absolute", top: "0.75rem", right: "0.75rem", padding: "0.2rem 0.55rem", borderRadius: "999px", fontSize: "0.65rem", fontWeight: 700, background: "#f1f5f9", color: "#94a3b8", border: "1px solid #e2e8f0" }}>Bientôt</span>
            <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#0f172a" }}>{doc}</p>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "#6b7280" }}>Configurer l'intitulé, le numérotation et le contenu</p>
          </div>
        ))}
      </div>
    </div>
  );
}