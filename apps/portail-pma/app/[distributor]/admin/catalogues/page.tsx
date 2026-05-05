import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";

export default async function AdminCataloguesPage({
  params,
}: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${user.distributorSlug}/admin`;
  const now = new Date();

  const [fournisseurs, opcom, promos, outillage, materiel, interne] = await Promise.all([
    // Fournisseurs actifs
    prisma.suppliers.count({
      where: { distributor_id: user.distributorId, is_active: true },
    }),
    // Op-com = campagnes de type operation_commerciale actives
    prisma.catalogue_campaigns.count({
      where: {
        distributor_id: user.distributorId,
        campaign_type: "operation_commerciale",
        is_active: true,
        OR: [{ valid_to: null }, { valid_to: { gte: now } }],
      },
    }),
    // Promos = campagnes de type promo actives
    prisma.catalogue_campaigns.count({
      where: {
        distributor_id: user.distributorId,
        campaign_type: "promo",
        is_active: true,
        OR: [{ valid_to: null }, { valid_to: { gte: now } }],
      },
    }),
    // Outillage = produits famille outillage
    prisma.catalogue_items.count({
      where: { distributor_id: user.distributorId, item_family: "outillage" },
    }),
    // Matériel = produits famille materiel
    prisma.catalogue_items.count({
      where: { distributor_id: user.distributorId, item_family: "materiel" },
    }),
    // Interne = produits famille interne
    prisma.catalogue_items.count({
      where: { distributor_id: user.distributorId, item_family: "interne" },
    }),
  ]);

  return (
    <AdminModulePage
      badge="Catalogue · Admin"
      title="Pilotage catalogue"
      description="Moteur catalogue centralisé — gérez vos fournisseurs, produits, campagnes et opérations commerciales."
      backHref={`/${user.distributorSlug}/admin`}
      kpis={[
        { title: "Fournisseurs",     value: fournisseurs, note: "actifs",          tone: "blue",    href: `${adminBase}/catalogues/fournisseurs` },
        { title: "Op. commerciales", value: opcom,        note: "campagnes actives",tone: "yellow",  href: `${adminBase}/catalogues/campagnes`    },
        { title: "Promotions",       value: promos,       note: "campagnes actives",tone: "green",   href: `${adminBase}/catalogues/campagnes`    },
        { title: "Outillage",        value: outillage,    note: "références",       tone: "neutral", href: `${adminBase}/catalogues/produits?famille=outillage` },
        { title: "Matériel",         value: materiel,     note: "réf. SAV",         tone: "red",     href: `${adminBase}/catalogues/produits?famille=materiel`  },
        { title: "Interne",          value: interne,      note: "références",       tone: "neutral", href: `${adminBase}/catalogues/produits?famille=interne`   },
      ]}
    >
      {/* Accès secondaires */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem" }}>
        {[
          { label: "Produits",   href: `${adminBase}/catalogues/produits`,   emoji: "📦", desc: "Référentiel complet" },
          { label: "Catégories", href: `${adminBase}/catalogues/categories`, emoji: "🗂️", desc: "Familles de produits" },
          { label: "Imports",    href: `${adminBase}/catalogues/imports`,    emoji: "📥", desc: "Import CSV"          },
        ].map((item) => (
          <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem 1.25rem", borderRadius: "1rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", textDecoration: "none", boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}>
            <span style={{ fontSize: "1.1rem" }}>{item.emoji}</span>
            <div>
              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#0f172a" }}>{item.label}</p>
              <p style={{ margin: 0, fontSize: "0.72rem", color: "#6b7280" }}>{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </AdminModulePage>
  );
}