import { requireAccess } from "@/lib/require-access";
import { prisma } from "@/lib/prisma";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import Link from "next/link";

export default async function AdminSettingsPage({
  params,
}: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${user.distributorSlug}/admin`;

  const [distrib, settings, toolsActive] = await Promise.all([
    prisma.distributors.findFirst({ where: { id: user.distributorId }, select: { legal_name: true, email: true } }),
    prisma.distributor_settings.findFirst({ where: { distributor_id: user.distributorId } }),
    prisma.distributor_tools.count({ where: { distributor_id: user.distributorId, is_enabled: true } }),
  ]);

  const generalOk  = !!(distrib?.legal_name && distrib?.email);
  const brandingOk = !!(settings?.logo_url);

  const MODULES = [
    { href: `${adminBase}/settings/general`,       icon: "🏢", title: "Informations générales", desc: "Raison sociale, SIRET, TVA, coordonnées, contact support", badge: generalOk ? "Configuré" : "À compléter", tone: generalOk ? "green" : "yellow" },
    { href: `${adminBase}/settings/modules`,        icon: "⚙️", title: "Modules métier",         desc: "Activez les briques correspondant à votre activité",       badge: `${toolsActive} actif${toolsActive > 1 ? "s" : ""}`, tone: toolsActive > 0 ? "green" : "yellow" },
    { href: `${adminBase}/settings/branding`,       icon: "🖼️", title: "Logo",                   desc: "Logo affiché dans les emails et les PDFs",                badge: brandingOk ? "Logo défini" : "À configurer", tone: brandingOk ? "green" : "neutral" },
    { href: `${adminBase}/settings/workflow`,       icon: "🔄", title: "Types de bons",          desc: "Choisissez les types de bons disponibles dans le portail", badge: "Configurer", tone: "neutral" },
    { href: `${adminBase}/settings/notifications`,  icon: "🔔", title: "Notifications",          desc: "Emails automatiques envoyés aux magasins et utilisateurs",  badge: "Configurer", tone: "neutral" },
    { href: `${adminBase}/settings/pdf`,            icon: "📄", title: "Templates PDF",          desc: "Choix du modèle pour vos bons et documents générés",       badge: "Bientôt",    tone: "neutral" },
    { href: `${adminBase}/settings/documents`,      icon: "📋", title: "Documents",              desc: "Modèles de contrats et documents métier",                  badge: "Bientôt",    tone: "neutral" },
    { href: `${adminBase}/settings/formulaires`,    icon: "📝", title: "Formulaires",            desc: "Personnalisez les champs des bons",                        badge: "Bientôt",    tone: "neutral" },
  ];

  const TONE: Record<string, { bg: string; color: string; border: string }> = {
    green:  { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
    yellow: { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
    neutral:{ bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" },
  };

  return (
    <AdminModulePage
      badge="Paramètres · Admin"
      title="Paramètres distributeur"
      description="Configurez votre portail selon votre activité — modules, logo, types de bons, notifications."
      backHref={adminBase}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
        {MODULES.map((m) => {
          const tone = TONE[m.tone] || TONE.neutral;
          return (
            <Link key={m.href} href={m.href} style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1.5rem", borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", boxShadow: "0 4px 16px rgba(15,23,42,0.04)", transition: "all 0.15s" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "1.5rem" }}>{m.icon}</span>
                <span style={{ display: "inline-flex", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: tone.bg, color: tone.color, border: `1px solid ${tone.border}` }}>{m.badge}</span>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "#0f172a" }}>{m.title}</p>
                <p style={{ margin: "0.3rem 0 0", fontSize: "0.78rem", color: "#6b7280" }}>{m.desc}</p>
              </div>
              <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 600, color: "#0a4d9b" }}>Configurer →</p>
            </Link>
          );
        })}
      </div>
    </AdminModulePage>
  );
}