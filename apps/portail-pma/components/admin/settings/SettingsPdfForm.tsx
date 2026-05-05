"use client";

const TEMPLATES = [
  { code: "standard",  label: "Standard",  desc: "Mise en page propre et sobre — convient à tous les secteurs.", available: true  },
  { code: "premium",   label: "Premium",   desc: "Mise en page enrichie avec couleurs de marque et logo en filigrane.",  available: false },
  { code: "compact",   label: "Compact",   desc: "Format dense optimisé pour l'impression recto — moins de pages.", available: false },
  { code: "custom",    label: "Sur mesure", desc: "Template personnalisé créé par LYSMA pour votre identité visuelle.", available: false },
];

export default function SettingsPdfForm() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      <div style={{ padding: "1rem 1.25rem", borderRadius: "0.875rem", background: "rgba(239,246,255,0.6)", border: "1px solid #bfdbfe" }}>
        <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#0a4d9b" }}>🎨 Personnalisation PDF — disponible prochainement</p>
        <p style={{ margin: "0.35rem 0 0", fontSize: "0.82rem", color: "#1d4ed8" }}>
          Le choix du template PDF sera disponible dans une prochaine version. En attendant, tous les bons utilisent le template Standard qui intègre automatiquement votre logo et vos couleurs configurés dans Branding.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
        {TEMPLATES.map((t) => (
          <div key={t.code} style={{ padding: "1.25rem", borderRadius: "1.25rem", border: "1px solid", borderColor: t.code === "standard" ? "#bfdbfe" : "#e2e8f0", background: t.code === "standard" ? "rgba(239,246,255,0.6)" : "#f8fafc", opacity: t.available ? 1 : 0.6, position: "relative", overflow: "hidden" }}>
            {!t.available && (
              <span style={{ position: "absolute", top: "0.75rem", right: "0.75rem", padding: "0.2rem 0.55rem", borderRadius: "999px", fontSize: "0.65rem", fontWeight: 700, background: "#f1f5f9", color: "#94a3b8", border: "1px solid #e2e8f0" }}>Bientôt</span>
            )}
            {t.code === "standard" && (
              <span style={{ position: "absolute", top: "0.75rem", right: "0.75rem", padding: "0.2rem 0.55rem", borderRadius: "999px", fontSize: "0.65rem", fontWeight: 700, background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}>Actif</span>
            )}
            <p style={{ margin: "0 0 0.4rem", fontSize: "0.875rem", fontWeight: 700, color: "#0f172a" }}>{t.label}</p>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#6b7280" }}>{t.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: "1.25rem", borderRadius: "1.25rem", background: "rgba(248,251,255,0.6)", border: "1px solid rgba(217,227,240,0.8)" }}>
        <p style={{ margin: "0 0 0.5rem", fontSize: "0.82rem", fontWeight: 700, color: "#334155" }}>Ce que le PDF Standard inclut déjà</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
          {["Logo du distributeur (depuis Branding)", "Couleurs de marque", "Informations client et magasin", "Numéro et date du bon", "Lignes de produits avec prix", "Code de facturation", "Signature et statut", "Coordonnées support"].map((item) => (
            <div key={item} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ color: "#15803d", fontWeight: 700, flexShrink: 0 }}>✓</span>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#475569" }}>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}