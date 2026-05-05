"use client";

import { useEffect, useState } from "react";

const SOCLE = [
  { icon: "🛒", label: "Bons classiques",        desc: "Commande, devis standard pièces" },
  { icon: "👥", label: "Clients",                 desc: "Portefeuille clients et ATC" },
  { icon: "🏪", label: "Magasins",                desc: "Réseau de magasins et magasiniers" },
  { icon: "📦", label: "Catalogue produits",      desc: "Référentiel produits de base" },
  { icon: "🔄", label: "Transferts portefeuille", desc: "Demandes de transfert entre ATC" },
  { icon: "🛡️", label: "Garanties & Retours",     desc: "Garanties et retours produits" },
];

const BLOCS_CONFIG: Record<string, {
  icon: string;
  label: string;
  desc: string;
  options: { code: string; label: string; desc: string }[];
}> = {
  sav: {
    icon: "🔧",
    label: "SAV",
    desc: "Bloc SAV activé — configurez les types de bons visibles par vos ATC et CDV.",
    options: [
      { code: "sav_bon_sav",        label: "Bon SAV matériel",   desc: "Prise en charge SAV sur équipements" },
      { code: "sav_devis_materiel",  label: "Devis matériel",     desc: "Devis pour équipements lourds" },
      { code: "sav_commande_materiel",label: "Commande matériel", desc: "Commande d'équipements via magasin SAV" },
    ],
  },
  interventions: {
    icon: "🚗",
    label: "Interventions",
    desc: "Bloc Interventions activé — configurez les options disponibles.",
    options: [
      { code: "interventions_bon",       label: "Bon d'intervention",        desc: "Intervention technique sur site client" },
      { code: "interventions_planif",    label: "Planification",             desc: "Date et heure prévisionnelle d'intervention" },
    ],
  },
  contrats_maintenance: {
    icon: "📋",
    label: "Contrats de maintenance",
    desc: "Bloc Contrats activé — vos modèles de contrats sont gérés par LYSMA et privés à votre portail.",
    options: [
      { code: "contrats_releve_parc",   label: "Relevé de parc associé",    desc: "Relevé des équipements inclus dans le contrat" },
      { code: "contrats_signature",     label: "Signature électronique",    desc: "Validation par signature (bientôt disponible)" },
    ],
  },
  releve_parc: {
    icon: "📊",
    label: "Relevé de parc",
    desc: "Bloc Relevé de parc activé — accessible à vos ATC et CDV.",
    options: [
      { code: "releve_parc_atc",        label: "Accès ATC",                 desc: "Les ATC peuvent créer des relevés" },
      { code: "releve_parc_cdv",        label: "Accès CDV",                 desc: "Les CDV peuvent créer et superviser les relevés" },
    ],
  },
};

type ToolState = { id: string; code: string; is_enabled: boolean };

export default function SettingsModulesForm() {
  const [tools,        setTools]        = useState<ToolState[]>([]);
  const [options,      setOptions]      = useState<Record<string, boolean>>({});
  const [fetching,     setFetching]     = useState(true);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState("");

  const activeBlocs = tools.filter((t) => t.is_enabled);
  const inactiveBlocs = tools.filter((t) => !t.is_enabled);

  useEffect(() => {
    fetch("/api/admin/settings/modules")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setTools(d.tools);
          setOptions(d.options ?? {});
        }
      })
      .finally(() => setFetching(false));
  }, []);

  function toggleOption(code: string) {
    setOptions((prev) => ({ ...prev, [code]: !prev[code] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/admin/settings/modules", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ options }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur."); return; }
      setSuccess("Préférences enregistrées.");
    } catch { setError("Erreur réseau."); }
    finally { setLoading(false); }
  }

  if (fetching) return <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Chargement...</div>;

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Socle */}
      <div style={{ borderRadius: "1.25rem", border: "1px solid #e2e8f0", background: "rgba(248,251,255,0.6)", overflow: "hidden" }}>
        <div style={{ padding: "0.875rem 1.25rem", background: "rgba(241,245,249,0.8)", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ display: "inline-flex", padding: "0.2rem 0.65rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}>Socle inclus</span>
          <p style={{ margin: 0, fontSize: "0.78rem", color: "#6b7280" }}>Toujours actifs — inclus dans votre offre.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {SOCLE.map((s) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.75rem 1.25rem", borderBottom: "1px solid rgba(226,232,240,0.4)" }}>
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>{s.icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, color: "#334155" }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: "0.72rem", color: "#94a3b8" }}>{s.desc}</p>
              </div>
              <span style={{ marginLeft: "auto", color: "#15803d", fontWeight: 700, fontSize: "0.8rem" }}>✓</span>
            </div>
          ))}
        </div>
      </div>

      {/* Blocs actifs avec options */}
      {activeBlocs.length > 0 && (
        <div>
          <p style={{ margin: "0 0 1rem", fontSize: "0.8rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Vos blocs métier actifs</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {activeBlocs.map((tool) => {
              const cfg = BLOCS_CONFIG[tool.code];
              if (!cfg) return null;
              return (
                <div key={tool.code} style={{ borderRadius: "1.25rem", border: "1px solid #bfdbfe", background: "rgba(239,246,255,0.4)", overflow: "hidden" }}>
                  <div style={{ padding: "1rem 1.5rem", borderBottom: cfg.options.length > 0 ? "1px solid rgba(191,219,254,0.5)" : "none", display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    <span style={{ fontSize: "1.25rem" }}>{cfg.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "#0f172a" }}>{cfg.label}</p>
                        <span style={{ display: "inline-flex", padding: "0.15rem 0.5rem", borderRadius: "999px", fontSize: "0.65rem", fontWeight: 700, background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}>Actif</span>
                      </div>
                      <p style={{ margin: "0.2rem 0 0", fontSize: "0.78rem", color: "#6b7280" }}>{cfg.desc}</p>
                    </div>
                  </div>
                  {cfg.options.length > 0 && (
                    <div style={{ padding: "0.75rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <p style={{ margin: "0 0 0.5rem", fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Options disponibles</p>
                      {cfg.options.map((opt) => {
                        const on = options[opt.code] ?? true;
                        const isComingSoon = opt.label.includes("bientôt");
                        return (
                          <label key={opt.code} style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid", borderColor: on && !isComingSoon ? "#bfdbfe" : "#e2e8f0", background: on && !isComingSoon ? "rgba(239,246,255,0.4)" : "#f8fafc", cursor: isComingSoon ? "default" : "pointer", opacity: isComingSoon ? 0.6 : 1 }}
                            onClick={() => !isComingSoon && toggleOption(opt.code)}>
                            <div style={{ width: "36px", height: "20px", borderRadius: "999px", background: on && !isComingSoon ? "#0a4d9b" : "#e2e8f0", position: "relative", flexShrink: 0, transition: "background 0.15s" }}>
                              <div style={{ position: "absolute", top: "2px", left: on && !isComingSoon ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", background: "#fff", transition: "left 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                            </div>
                            <div>
                              <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, color: "#0f172a" }}>{opt.label}</p>
                              <p style={{ margin: 0, fontSize: "0.72rem", color: "#6b7280" }}>{opt.desc}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Blocs non souscrits */}
      {inactiveBlocs.length > 0 && (
        <div>
          <p style={{ margin: "0 0 1rem", fontSize: "0.8rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Non inclus dans votre offre</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.75rem" }}>
            {inactiveBlocs.map((tool) => {
              const cfg = BLOCS_CONFIG[tool.code];
              if (!cfg) return null;
              return (
                <div key={tool.code} style={{ padding: "1rem 1.25rem", borderRadius: "1.25rem", border: "1px solid #e2e8f0", background: "#f8fafc", opacity: 0.7 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "1.1rem" }}>{cfg.icon}</span>
                    <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#334155" }}>{cfg.label}</p>
                  </div>
                  <p style={{ margin: "0 0 0.75rem", fontSize: "0.75rem", color: "#94a3b8" }}>{cfg.desc}</p>
                  <p style={{ margin: 0, fontSize: "0.72rem", color: "#0a4d9b", fontWeight: 600 }}>Contactez LYSMA Solutions pour activer ce bloc →</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Aucun bloc actif */}
      {activeBlocs.length === 0 && (
        <div style={{ padding: "1.5rem", borderRadius: "1.25rem", background: "#fffbeb", border: "1px solid #fde68a", textAlign: "center" }}>
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", fontWeight: 700, color: "#b45309" }}>Aucun bloc métier activé</p>
          <p style={{ margin: 0, fontSize: "0.82rem", color: "#92400e" }}>Contactez LYSMA Solutions pour activer les blocs correspondant à votre activité.</p>
        </div>
      )}

      {error   && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{error}</div>}
      {success && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", fontSize: "0.875rem" }}>{success}</div>}

      {activeBlocs.length > 0 && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" disabled={loading} style={{ padding: "0.75rem 2rem", borderRadius: "0.875rem", background: loading ? "#94a3b8" : "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 8px 20px rgba(30,115,216,0.25)" }}>
            {loading ? "Enregistrement..." : "Enregistrer mes préférences"}
          </button>
        </div>
      )}
    </form>
  );
}