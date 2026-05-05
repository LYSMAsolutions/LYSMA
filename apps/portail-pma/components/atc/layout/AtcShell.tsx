"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AtcHeader from "@/components/atc/layout/AtcHeader";
import AtcSidebar from "@/components/atc/layout/AtcSidebar";
import {
  LayoutDashboard, ClipboardList, Wrench,
  Shield, BookOpen, User
} from "lucide-react";

type Props = {
  children:        React.ReactNode;
  distributorSlug: string;
  activeCodes:     string[];
  user: {
    firstName: string | null;
    lastName:  string | null;
    email:     string;
    roleCode:  string;
  };
};

const BOTTOM_NAV = [
  { key: "dashboard", label: "Accueil",   Icon: LayoutDashboard, href: (s: string) => `/${s}/atc`           },
  { key: "bons",      label: "Bons",      Icon: ClipboardList,   href: (s: string) => `/${s}/atc/bons`      },
  { key: "sav",       label: "SAV",       Icon: Wrench,          href: (s: string) => `/${s}/atc/sav`       },
  { key: "garanties", label: "Garanties", Icon: Shield,          href: (s: string) => `/${s}/atc/garanties` },
  { key: "compte",    label: "Compte",    Icon: User,            href: (s: string) => `/${s}/atc/compte`    },
];

export default function AtcShell({ children, distributorSlug, activeCodes, user }: Props) {
  const pathname = usePathname();
  const isDashboard = pathname === `/${distributorSlug}/atc` || pathname === `/${distributorSlug}/atc/`;

  return (
    <>
      {/* Layout desktop */}
      <div className="atc-desktop-layout" style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#f0f4ff 0%,#f8fafc 50%,#fff7f0 100%)" }}>
        {/* Sidebar desktop */}
        <AtcSidebar distributorSlug={distributorSlug} activeCodes={activeCodes} variant="rail" />

        {/* Contenu */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AtcHeader
          firstName={user.firstName ?? ""}
          lastName={user.lastName ?? ""}
          email={user.email}
        />
          <main style={{ flex: 1, padding: "1.5rem 2rem", maxWidth: "1200px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
            {children}
          </main>
        </div>
      </div>

      {/* Layout mobile */}
      <div className="atc-mobile-layout" style={{ display: "none", flexDirection: "column", minHeight: "100vh", background: "#f0f0f0" }}>
        {/* Header mobile — masqué sur dashboard */}
        {!isDashboard && (
          <div style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(240,240,240,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link href={`/${distributorSlug}/atc`} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,0.8)", textDecoration: "none" }}>
              <LayoutDashboard size={18} color="#0a4d9b" strokeWidth={2} />
            </Link>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Espace ATC</p>
            </div>
          </div>
        )}

        {/* Contenu mobile */}
        <main style={{ flex: 1, paddingBottom: "5rem" }}>
          {children}
        </main>

        {/* Bottom nav */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(0,0,0,0.08)", padding: "0.5rem 0 max(0.5rem, env(safe-area-inset-bottom))" }}>
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
            {BOTTOM_NAV.map((item) => {
              const href   = item.href(distributorSlug);
              const active = pathname === href || (href !== `/${distributorSlug}/atc` && pathname.startsWith(href));
              const { Icon } = item;
              return (
                <Link key={item.key} href={href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem", padding: "0.25rem 0.875rem", borderRadius: "0.875rem", textDecoration: "none", transition: "all 0.15s" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: active ? "linear-gradient(135deg,#0a4d9b,#1e73d8)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                    <Icon size={18} color={active ? "#fff" : "#94a3b8"} strokeWidth={active ? 2.5 : 1.8} />
                  </div>
                  <span style={{ fontSize: "0.58rem", fontWeight: active ? 700 : 500, color: active ? "#0a4d9b" : "#94a3b8", lineHeight: 1 }}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* CSS responsive */}
      <style>{`
        @media (max-width: 768px) {
          .atc-desktop-layout { display: none !important; }
          .atc-mobile-layout  { display: flex !important; }
        }
        @media (min-width: 769px) {
          .atc-desktop-layout { display: flex !important; }
          .atc-mobile-layout  { display: none !important; }
        }
      `}</style>
    </>
  );
}