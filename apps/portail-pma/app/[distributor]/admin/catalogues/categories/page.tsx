import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";

const FAMILIES = [
  { family: "fournisseur",           label: "Fournisseur",           emoji: "🏭", color: "#0a4d9b", bg: "#eff6ff", border: "#bfdbfe",
    desc: "Produits issus des catalogues fournisseurs. Pièces auto, accessoires, consommables.",
    acces: "Tous les magasins" },
  { family: "promo",                 label: "Promotion",             emoji: "🏷️", color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0",
    desc: "Produits en promotion avec prix réduit sur une période définie.",
    acces: "Tous les magasins" },
  { family: "operation_commerciale", label: "Op. commerciale",       emoji: "⚡", color: "#b45309", bg: "#fffbeb", border: "#fde68a",
    desc: "Offres groupées, animations commerciales, opérations fidélité.",
    acces: "Tous les magasins" },
  { family: "interne",               label: "Interne",               emoji: "🔒", color: "#475569", bg: "#f1f5f9", border: "#e2e8f0",
    desc: "Produits ou services gérés en interne par le distributeur.",
    acces: "Tous les magasins" },
  { family: "outillage",             label: "Outillage",             emoji: "🔧", color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe",
    desc: "Outillage à main, électroportatif, équipement atelier courant.",
    acces: "Tous les magasins" },
  { family: "materiel",              label: "Matériel",              emoji: "🏗️", color: "#dc2626", bg: "#fef2f2", border: "#fecaca",
    desc: "Gros matériel de garage, équipements lourds SAV, pièces de rechange matériel.",
    acces: "Magasins SAV uniquement" },
];

export default async function AdminCatalogueCategoriesPage({
  params, searchParams,
}: {
  params: Promise<{ distributor: string }>;
  searchParams: Promise<{ famille?: string }>;
}) {
  const { distributor } = await params;
  const { famille } = await searchParams;
  const user = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${user.distributorSlug}/admin`;

  const familyCounts = await Promise.all(
    FAMILIES.map(async (f) => ({
      ...f,
      count: await prisma.catalogue_items.count({
        where: { distributor_id: user.distributorId, item_family: f.family },
      }),
      active: await prisma.catalogue_items.count({
        where: { distributor_id: user.distributorId, item_family: f.family, is_active: true },
      }),
    }))
  );

  // Si famille sélectionnée — afficher ses produits
  let filteredItems = null;
  const selectedFamily = FAMILIES.find((f) => f.family === famille);
  if (famille && selectedFamily) {
    filteredItems = await prisma.catalogue_items.findMany({
      where: { distributor_id: user.distributorId, item_family: famille },
      include: { suppliers: { select: { name: true } } },
      orderBy: { designation: "asc" },
      take: 100,
    });
  }

  const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
  const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };
  const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };
  const btnLink: React.CSSProperties = { display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, color: "#0a4d9b", border: "1px solid #bfdbfe", background: "rgba(255,255,255,0.8)", textDecoration: "none" };

  return (
    <AdminModulePage
      badge="Catalogue · Catégories"
      title={selectedFamily ? `${selectedFamily.emoji} ${selectedFamily.label}` : "Catégories"}
      description={selectedFamily ? selectedFamily.desc : "Les 6 familles du catalogue — chaque produit appartient à une famille qui détermine où il apparaît dans le portail."}
      backHref={selectedFamily ? `${adminBase}/catalogues/categories` : `${adminBase}/catalogues`}
      backLabel={selectedFamily ? "Retour catégories" : "Retour catalogue"}
    >
      {!selectedFamily ? (
        /* Vue grille des familles */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {familyCounts.map((f) => (
            <Link key={f.family} href={`${adminBase}/catalogues/categories?famille=${f.family}`} style={{ display: "flex", flexDirection: "column", padding: "1.5rem", borderRadius: "1.5rem", background: f.bg, border: `1px solid ${f.border}`, textDecoration: "none", boxShadow: "0 4px 12px rgba(15,23,42,0.04)", transition: "box-shadow 0.18s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.5rem" }}>{f.emoji}</span>
                <span style={{ display: "inline-flex", padding: "0.2rem 0.65rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700, background: "rgba(255,255,255,0.7)", color: f.family === "materiel" ? "#dc2626" : "#15803d", border: `1px solid ${f.border}` }}>
                  {f.family === "materiel" ? "SAV uniquement" : "Tous magasins"}
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: f.color }}>{f.label}</h3>
              <p style={{ margin: "0.35rem 0 0.75rem", fontSize: "0.78rem", color: "#6b7280", lineHeight: "1.5", flex: 1 }}>{f.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: `1px solid ${f.border}` }}>
                <span style={{ fontSize: "1.5rem", fontWeight: 800, color: f.color }}>{f.count}</span>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{f.active} actif{f.active > 1 ? "s" : ""}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Vue produits de la famille sélectionnée */
        <>
          {selectedFamily.family === "materiel" && (
            <div style={{ padding: "0.875rem 1.25rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", marginBottom: "0.5rem" }}>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#dc2626", fontWeight: 600 }}>⚠️ Famille Matériel — visible uniquement par les magasins de type SAV.</p>
            </div>
          )}

          <div style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
            <div style={{ padding: "1rem 1.25rem", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {filteredItems?.length ?? 0} produit{(filteredItems?.length ?? 0) > 1 ? "s" : ""}
              </p>
              <Link href={`${adminBase}/catalogues/produits`} style={{ fontSize: "0.75rem", fontWeight: 600, color: "#0a4d9b", textDecoration: "none" }}>
                Gérer dans Produits →
              </Link>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Désignation</th>
                  <th style={th}>Fournisseur</th>
                  <th style={th}>Réf. interne</th>
                  <th style={th}>Code fact.</th>
                  <th style={{ ...th, textAlign: "right" }}>Prix HT</th>
                  <th style={th}>Statut</th>
                  <th style={{ ...th, textAlign: "right" }}>Fiche</th>
                </tr>
              </thead>
              <tbody>
                {(filteredItems ?? []).map((item: any) => (
                  <tr key={item.id}>
                    <td style={{ ...td, fontWeight: 700 }}>{item.designation}</td>
                    <td style={tdM}>{item.suppliers?.name ?? "—"}</td>
                    <td style={{ ...tdM, fontFamily: "monospace" }}>{item.internal_code ?? "—"}</td>
                    <td style={{ ...tdM, fontFamily: "monospace" }}>{item.billing_code ?? "—"}</td>
                    <td style={{ ...td, textAlign: "right", fontWeight: 700, color: "#0a4d9b" }}>
                      {item.unit_price_ht !== null ? `${Number(item.unit_price_ht).toFixed(2)} €` : "—"}
                    </td>
                    <td style={td}>
                      <span style={{ display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: item.is_active ? "#f0fdf4" : "#fef2f2", color: item.is_active ? "#15803d" : "#dc2626", border: item.is_active ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
                        {item.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td style={{ ...td, textAlign: "right" }}>
                      <Link href={`${adminBase}/catalogues/produits`} style={btnLink}>Voir</Link>
                    </td>
                  </tr>
                ))}
                {!filteredItems?.length && (
                  <tr><td colSpan={7} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2.5rem" }}>Aucun produit dans cette famille.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminModulePage>
  );
}