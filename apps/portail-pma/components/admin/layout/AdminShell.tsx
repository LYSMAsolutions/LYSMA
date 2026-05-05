"use client";

import { useEffect, useRef, useState } from "react";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import LysmaHamburgerButton from "@/components/navigation/LysmaHamburgerButton";

type AdminShellProps = {
  children: React.ReactNode;
  firstName: string;
  lastName: string;
  email: string;
  activeCodes?: string[];
};

export default function AdminShell({
  children,
  firstName,
  lastName,
  email,
  activeCodes = [],
}: AdminShellProps) {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [desktopOpen,  setDesktopOpen]  = useState(false);
  const [desktopPinned,setDesktopPinned]= useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
      else { setDesktopOpen(false); setDesktopPinned(false); }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  const openDesktopWithDelay = () => {
    if (desktopPinned) return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setDesktopOpen(true), 180);
  };

  const cancelHoverOpen = () => {
    if (hoverTimerRef.current) { clearTimeout(hoverTimerRef.current); hoverTimerRef.current = null; }
  };

  const closeDesktop = () => { cancelHoverOpen(); if (!desktopPinned) setDesktopOpen(false); };

  return (
    <div style={{ minHeight: "100vh", color: "#0F172A", display: "flex" }}>

      {/* Sidebar desktop */}
      <div style={{ position: "relative", flexShrink: 0, display: "none" }} className="lg-sidebar">
        <div style={{ position: "sticky", top: 0, zIndex: 30, display: "flex", height: "100vh" }}
          onMouseEnter={openDesktopWithDelay} onMouseLeave={closeDesktop}>
          {!desktopOpen && <AdminSidebar variant="rail" activeCodes={activeCodes} />}
          <div style={{ overflow: "hidden", transition: "width 0.2s ease, opacity 0.2s ease", width: desktopOpen ? "260px" : "0px", opacity: desktopOpen ? 1 : 0 }}>
            {desktopOpen && <AdminSidebar variant="panel" activeCodes={activeCodes} />}
          </div>
        </div>
      </div>

      {/* Sidebar mobile */}
      {mobileOpen && (
        <>
          <button type="button" aria-label="Fermer" onClick={() => setMobileOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(15,23,42,0.35)", backdropFilter: "blur(2px)", border: "none", cursor: "pointer" }} />
          <div style={{ position: "fixed", inset: "0 auto 0 0", zIndex: 50 }}>
            <AdminSidebar variant="mobile" activeCodes={activeCodes} />
          </div>
        </>
      )}

      {/* Contenu principal */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, minHeight: "100vh" }}>
        <AdminHeader firstName={firstName} lastName={lastName} email={email}
          leftSlot={
            <div className="lg-hide">
              <LysmaHamburgerButton mode="mobile" isOpen={mobileOpen} onClick={() => setMobileOpen((prev) => !prev)} />
            </div>
          }
        />
        <main style={{ flex: 1, padding: "2.5rem" }}>{children}</main>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .lg-sidebar { display: block !important; }
          .lg-hide { display: none !important; }
        }
      `}</style>
    </div>
  );
}