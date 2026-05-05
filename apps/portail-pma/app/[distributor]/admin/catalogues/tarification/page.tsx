import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";

export default async function AdminCatalogueTarificationPage({
  params,
}: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${user.distributorSlug}/admin`;

  const card: React.CSSProperties = { borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", padding: "1.75rem", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" };

  return (
    <AdminModulePage
      badge="Catalogue · Tarification"
      title="Grilles de tarification"
      description="Module de tarification avancée — remises par client, par magasin ou par volume."
      backHref={`${adminBase}/catalogues`}
      backLabel="Retour catalogue"
    >
      {/* Statut */}
      <div style={{ ...card, background: "rgba(255,251,235,0.7)", border: "1px solid #fde68a" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#fffbeb", border: "1px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", flexShrink: 0 }}>🚧</div>
          <div>
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#b45309" }}>Module prévu en v2</h2>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem", color: "#92400e", lineHeight: "1.6" }}>
              Le module de tarification avancée est planifié pour une prochaine version. Pour l'instant, le prix de chaque produit se gère directement sur la fiche produit (champ "Prix HT").
            </p>
          </div>
        </div>
      </div>

      {/* Ce que ça fera */}
      <div style={card}>
        <h3 style={{ margin: "0 0 1.25rem", fontSize: "0.82rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Ce que le module de tarification permettra
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
          {[
            { emoji: "🏪", title: "Remise par magasin",      desc: "Définir un pourcentage de remise global pour un magasin spécifique sur une famille de produits." },
            { emoji: "👤", title: "Remise par client",       desc: "Appliquer un tarif préférentiel à un client en particulier, indépendamment du catalogue général." },
            { emoji: "📦", title: "Remise sur volume",       desc: "Déclencher une remise automatique au-delà d'une quantité commandée dans un même bon." },
            { emoji: "📅", title: "Tarifs temporaires",      desc: "Programmer des grilles tarifaires avec dates de début et de fin, sans modifier le prix de base du produit." },
          ].map((item) => (
            <div key={item.title} style={{ padding: "1.25rem", borderRadius: "1rem", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{item.emoji}</div>
              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#0f172a" }}>{item.title}</p>
              <p style={{ margin: "0.35rem 0 0", fontSize: "0.8rem", color: "#6b7280", lineHeight: "1.5" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alternative actuelle */}
      <div style={{ ...card, background: "rgba(239,246,255,0.6)", border: "1px solid #bfdbfe" }}>
        <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#0a4d9b" }}>💡 En attendant — comment gérer les prix aujourd'hui</p>
        <div style={{ margin: "0.75rem 0 0", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[
            "Le prix HT de chaque produit se modifie directement sur la fiche produit (bouton Modifier).",
            "Pour une promotion sur une période, utilise le module Campagnes — il permet de définir un prix promo temporaire sur des produits sélectionnés.",
            "Pour un tarif spécial magasin, contacte le support LYSMA — une grille manuelle peut être configurée manuellement en BDD.",
          ].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ display: "inline-flex", width: "20px", height: "20px", borderRadius: "50%", background: "#bfdbfe", color: "#0a4d9b", fontSize: "0.72rem", fontWeight: 800, alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>{i + 1}</span>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#1d4ed8", lineHeight: "1.5" }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminModulePage>
  );
}