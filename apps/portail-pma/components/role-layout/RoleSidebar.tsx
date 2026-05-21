"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Settings,
  Shield,
  Store,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";

type RoleCode = "cdv" | "rdm" | "store";

type RoleSidebarProps = {
  distributorSlug: string;
  role: RoleCode;
  variant?: "rail" | "panel" | "mobile";
  activeCodes?: string[];
};

const roleLabels: Record<RoleCode, string> = {
  cdv: "CDV",
  rdm: "RDM",
  store: "STORE",
};

export default function RoleSidebar({
  distributorSlug,
  role,
  variant = "rail",
  activeCodes = [],
}: RoleSidebarProps) {
  const pathname = usePathname();
  const base = `/${distributorSlug}/${role}`;

  const has = (code: string) => activeCodes.includes(code);

  const items = [
    { href: base, label: "Dashboard", icon: LayoutDashboard, exact: true },
    ...(role === "cdv"
      ? [
          { href: `${base}/bons`, label: "Bons ATC", icon: FileText },
          { href: `${base}/clients`, label: "Clients", icon: UserCheck },
          { href: `${base}/equipe`, label: "Equipe ATC", icon: Users },
          { href: `${base}/atc`, label: "Activite ATC", icon: BriefcaseBusiness },
          { href: `${base}/garanties`, label: "Garanties", icon: Shield },
          { href: `${base}/sav`, label: "Bons SAV", icon: Wrench },
          ...(has("releve_parc") ? [{ href: `${base}/releve-parc`, label: "Releves parc", icon: BarChart2 }] : []),
          { href: `${base}/compte`, label: "Compte", icon: Settings },
        ]
      : []),
    ...(role === "rdm"
      ? [
          { href: `${base}/bons`, label: "Bons magasin", icon: FileText },
          { href: `${base}/clients`, label: "Clients", icon: UserCheck },
          { href: `${base}/equipe`, label: "Magasiniers", icon: Users },
          { href: `${base}/bons`, label: "Traitement", icon: Store },
        ]
      : []),
    ...(role === "store"
      ? [
          { href: `${base}/bons`, label: "Bons", icon: ClipboardList },
          { href: `${base}/sav`, label: "SAV", icon: Wrench },
          { href: `${base}/equipe`, label: "Equipe", icon: Users },
          { href: `${base}/compte`, label: "Compte", icon: Settings },
        ]
      : []),
  ];

  const isActive = (item: { href: string; exact?: boolean }) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

  if (variant === "rail") {
    return (
      <aside style={{ width: "72px", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "5rem", gap: "0.35rem", background: "transparent", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link key={item.href} href={item.href} style={{ position: "relative", textDecoration: "none" }} className="role-rail-item-group">
              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", borderRadius: "14px", transition: "all 0.2s ease", background: active ? "linear-gradient(135deg,#0a4d9b,#1e73d8)" : "rgba(255,255,255,0.0)", boxShadow: active ? "0 8px 20px rgba(10,77,155,0.28),inset 0 1px 0 rgba(255,255,255,0.2)" : "none" }}>
                <Icon size={18} color={active ? "#ffffff" : "#64748b"} strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span style={{ position: "absolute", left: "calc(100% + 14px)", top: "50%", transform: "translateY(-50%)", background: "rgba(15,23,42,0.92)", backdropFilter: "blur(8px)", color: "#fff", fontSize: "0.75rem", fontWeight: 600, padding: "0.4rem 0.8rem", borderRadius: "8px", whiteSpace: "nowrap", pointerEvents: "none", opacity: 0, transition: "opacity 0.15s", zIndex: 999, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }} className="role-sidebar-tooltip">
                {item.label}
              </span>
            </Link>
          );
        })}
        <style>{`.role-rail-item-group:hover .role-sidebar-tooltip{opacity:1!important}.role-rail-item-group:hover>div{background:rgba(10,77,155,0.08)!important}.role-rail-item-group:hover>div svg{color:#0a4d9b!important}`}</style>
      </aside>
    );
  }

  const isMobile = variant === "mobile";

  return (
    <aside style={{ width: isMobile ? "280px" : "260px", height: "100vh", display: "flex", flexDirection: "column", background: isMobile ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.42)", borderRight: "1px solid rgba(255,255,255,0.35)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", boxShadow: isMobile ? "4px 0 40px rgba(10,77,155,0.1)" : "1px 0 0 rgba(217,227,240,0.3)" }}>
      <div style={{ padding: "1.75rem 1.25rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.4)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.9rem", borderRadius: "999px", background: "rgba(255,255,255,0.6)", border: "1px solid rgba(191,219,254,0.7)", backdropFilter: "blur(8px)" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 0 2px rgba(16,185,129,0.25)" }} />
          <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#0a4d9b" }}>{distributorSlug} - {roleLabels[role]}</span>
        </div>
      </div>

      <nav style={{ padding: "1rem 0.75rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.2rem", overflowY: "auto" }}>
        {items.map((item) => <NavItem key={item.href} item={item} active={isActive(item)} />)}
      </nav>

      <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.35)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 0.75rem", borderRadius: "12px", background: "rgba(255,255,255,0.4)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.5)" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg,#0a4d9b,#1e73d8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#fff" }}>PMA</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, color: "#0f172a" }}>Portail PMA</p>
            <p style={{ margin: 0, fontSize: "0.65rem", color: "#94a3b8" }}>LYSMA Solutions</p>
          </div>
        </div>
      </div>

      <style>{`.role-panel-item:hover{background:rgba(10,77,155,0.07)!important;color:#0a4d9b!important}`}</style>
    </aside>
  );
}

function NavItem({ item, active }: { item: { href: string; label: string; icon: React.ElementType }; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link href={item.href} className="role-panel-item" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: "14px", textDecoration: "none", fontSize: "0.88rem", fontWeight: active ? 700 : 500, color: active ? "#ffffff" : "#475569", background: active ? "linear-gradient(135deg,#0a4d9b,#1e73d8)" : "transparent", boxShadow: active ? "0 8px 24px rgba(10,77,155,0.22),inset 0 1px 0 rgba(255,255,255,0.15)" : "none", transition: "all 0.18s ease", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "10px", background: active ? "rgba(255,255,255,0.18)" : "rgba(10,77,155,0.06)", flexShrink: 0 }}>
        <Icon size={16} strokeWidth={active ? 2.5 : 1.8} />
      </div>
      <span>{item.label}</span>
      {active ? <div style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: "rgba(255,255,255,0.7)" }} /> : null}
    </Link>
  );
}
