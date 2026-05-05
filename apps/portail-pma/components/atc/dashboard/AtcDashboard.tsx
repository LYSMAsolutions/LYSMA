"use client";

import { useRouter } from "next/navigation";
import {
  Users, PlusCircle, Package, FileText,
  RotateCcw, Wrench, Shield, BookOpen,
  BarChart2, User, Bell, Search, ChevronRight,
  TrendingUp, Clock,
} from "lucide-react";

type Props = {
  distributorSlug: string;
  firstName:       string;
  activeCodes:     string[];
  kpis: {
    bons_brouillon:  number;
    bons_envoyes:    number;
    retours:         number;
    sav_en_cours:    number;
    garanties_cours: number;
  };
};

type AppTile = {
  key:      string;
  label:    string;
  Icon:     React.ElementType;
  color:    string;
  bg:       string;
  href:     string;
  badge?:   number;
  bloc?:    string;
  featured?: boolean;
};

export default function AtcDashboard({ distributorSlug, firstName, activeCodes, kpis }: Props) {
  const router = useRouter();
  const safe   = activeCodes ?? [];
  const base   = `/${distributorSlug}/atc`;

  const ALL_TILES: AppTile[] = [
    { key: "creer",     label: "Créer un bon",  Icon: PlusCircle, color: "#fff", bg: "linear-gradient(135deg,#0A4D9B 0%,#1E73D8 100%)", href: `${base}/bons/new`, featured: true },
    { key: "clients",   label: "Mes clients",   Icon: Users,      color: "#0A4D9B", bg: "#EBF3FF", href: `${base}/clients` },
    { key: "bons",      label: "Mes bons",      Icon: Package,    color: "#059669", bg: "#ECFDF5", href: `${base}/bons`,           badge: kpis.bons_envoyes    },
    { key: "devis",     label: "Brouillons",    Icon: FileText,   color: "#D97706", bg: "#FFFBEB", href: `${base}/bons?status=brouillon`, badge: kpis.bons_brouillon },
    { key: "retours",   label: "Retours",       Icon: RotateCcw,  color: "#DC2626", bg: "#FEF2F2", href: `${base}/bons?type=retour`,      badge: kpis.retours > 0 ? kpis.retours : undefined },
    { key: "sav",       label: "SAV",           Icon: Wrench,     color: "#7C3AED", bg: "#F5F3FF", href: `${base}/sav`,            badge: kpis.sav_en_cours    },
    { key: "garanties", label: "Garanties",     Icon: Shield,     color: "#DB2777", bg: "#FDF2F8", href: `${base}/garanties`,     badge: kpis.garanties_cours },
    { key: "catalogue", label: "Catalogue",     Icon: BookOpen,   color: "#0369A1", bg: "#F0F9FF", href: `${base}/catalogues`    },
    { key: "parc",      label: "Relevé parc",   Icon: BarChart2,  color: "#059669", bg: "#ECFDF5", href: `${base}/sav/new`, bloc: "releve_parc" },
    { key: "compte",    label: "Mon compte",    Icon: User,       color: "#6B7280", bg: "#F9FAFB", href: `${base}/compte`        },
  ];

  const tiles = ALL_TILES.filter((t) => !t.bloc || safe.includes(t.bloc));

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  const totalPending = (kpis.bons_envoyes ?? 0) + (kpis.sav_en_cours ?? 0);
  const totalDraft   = kpis.bons_brouillon ?? 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F2F4F7",
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>

      {/* ── HERO — mobile only ────────────────────── */}
      <style>{`@media (min-width: 768px) { .atc-hero-mobile { display: none !important; } .atc-tile-grid { grid-template-columns: repeat(5, 1fr) !important; } .atc-tile-inner { padding: 0.875rem 0.25rem 0.75rem !important; } .atc-card-wrap { margin: 1.5rem 1.5rem 0 !important; } .atc-stats-wrap { margin: 1rem 1.5rem 0 !important; } .atc-search-wrap { padding: 1rem 1.5rem 1.5rem !important; } }`}</style>
      <div className="atc-hero-mobile" style={{
        background: "linear-gradient(135deg, #0A2E5C 0%, #0A4D9B 55%, #1E73D8 100%)",
        padding: "2.5rem 1.5rem 5rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Cercles décoratifs */}
        <div style={{ position: "absolute", top: "-60px", right: "-40px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", right: "30%", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "20px", left: "60%", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

        {/* Greeting */}
        <p style={{ margin: "0 0 0.25rem", fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {greeting}
        </p>
        <h1 style={{ margin: 0, fontSize: "clamp(1.75rem,6vw,2.25rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.15 }}>
          {firstName} 👋
        </h1>

        {/* KPI pills */}
        {(totalPending > 0 || totalDraft > 0) && (
          <div style={{ display: "flex", gap: "0.625rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
            {totalPending > 0 && (
              <button onClick={() => router.push(`${base}/bons`)}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 0.875rem", borderRadius: "999px", background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.18)", color: "#fff", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
                <Bell size={13} strokeWidth={2.5} />
                {totalPending} en attente
              </button>
            )}
            {totalDraft > 0 && (
              <button onClick={() => router.push(`${base}/bons?status=brouillon`)}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 0.875rem", borderRadius: "999px", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
                <Clock size={13} strokeWidth={2.5} />
                {totalDraft} brouillon{totalDraft > 1 ? "s" : ""}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── CARD PRINCIPALE flottante ─────────────────── */}
      <div className="atc-card-wrap" style={{
        margin: "-2.25rem 1rem 0",
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 8px 32px rgba(10,45,92,0.12), 0 2px 8px rgba(10,45,92,0.06)",
        overflow: "hidden",
        position: "relative",
        zIndex: 2,
      }}>

        {/* Bouton CTA principal */}
        {(() => {
          const featured = tiles.find((t) => t.featured);
          if (!featured) return null;
          const { Icon } = featured;
          return (
            <button type="button" onClick={() => router.push(featured.href)}
              style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%", padding: "1.25rem 1.5rem", background: "linear-gradient(135deg,#0A4D9B,#1E73D8)", border: "none", cursor: "pointer", textAlign: "left" }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.94"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={22} color="#fff" strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#fff" }}>Créer un bon</p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.65)" }}>Bon pièces, retour, SAV, garantie...</p>
              </div>
              <ChevronRight size={18} color="rgba(255,255,255,0.6)" strokeWidth={2.5} />
            </button>
          );
        })()}

        {/* Grille des tuiles secondaires */}
        <div className="atc-tile-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0",
        }}>
          {tiles.filter((t) => !t.featured).map((tile, i, arr) => {
            const { Icon } = tile;
            const showBadge = tile.badge !== undefined && tile.badge > 0;
            const isLastRow = i >= arr.length - (arr.length % 4 || 4);
            const isRightEdge = (i + 1) % 4 === 0;

            return (
              <button key={tile.key} type="button" onClick={() => router.push(tile.href)}
                className="atc-tile-inner"
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "1.125rem 0.5rem 1rem",
                  background: "none", border: "none", cursor: "pointer",
                  position: "relative",
                  borderRight: isRightEdge ? "none" : "1px solid #F1F5F9",
                  borderBottom: "1px solid #F1F5F9",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#FAFBFF"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}>

                {/* Icône */}
                <div style={{
                  width: "clamp(46px,12vw,52px)", height: "clamp(46px,12vw,52px)",
                  borderRadius: "clamp(12px,3.5vw,15px)",
                  background: tile.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "0.5rem",
                  position: "relative",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                }}>
                  <Icon size={22} color={tile.color} strokeWidth={2} />
                  {showBadge && (
                    <div style={{
                      position: "absolute", top: "-5px", right: "-5px",
                      minWidth: "18px", height: "18px", borderRadius: "9px",
                      background: "#EF4444", border: "2px solid #fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "0 4px",
                    }}>
                      <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                        {tile.badge! > 99 ? "99+" : tile.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Label */}
                <span style={{
                  fontSize: "clamp(0.62rem,2.8vw,0.72rem)",
                  fontWeight: 600, color: "#374151",
                  textAlign: "center", lineHeight: 1.25,
                  maxWidth: "72px",
                }}>
                  {tile.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── STATS RAPIDES ────────────────────────────── */}
      {(kpis.bons_envoyes > 0 || kpis.sav_en_cours > 0 || kpis.garanties_cours > 0) && (
        <div style={{ margin: "1.25rem 1rem 0", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.72rem", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            À traiter
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.625rem" }}>
            {[
              { label: "Bons envoyés",   value: kpis.bons_envoyes,    color: "#059669", bg: "#ECFDF5", Icon: TrendingUp, href: `${base}/bons` },
              { label: "SAV en cours",   value: kpis.sav_en_cours,    color: "#7C3AED", bg: "#F5F3FF", Icon: Wrench,     href: `${base}/sav` },
              { label: "Garanties",      value: kpis.garanties_cours, color: "#DB2777", bg: "#FDF2F8", Icon: Shield,     href: `${base}/garanties` },
            ].filter((s) => s.value > 0).map((stat) => (
              <button key={stat.label} onClick={() => router.push(stat.href)}
                style={{ padding: "0.875rem", borderRadius: "14px", background: "#fff", border: "1px solid #F1F5F9", boxShadow: "0 2px 6px rgba(0,0,0,0.04)", cursor: "pointer", textAlign: "left" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.5rem" }}>
                  <stat.Icon size={14} color={stat.color} strokeWidth={2.5} />
                </div>
                <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</p>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.65rem", fontWeight: 600, color: "#9CA3AF", lineHeight: 1.3 }}>{stat.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── RECHERCHE ────────────────────────────────── */}
      <div className="atc-search-wrap" style={{ padding: "1.25rem 1rem 2.5rem" }}>
        <button
          onClick={() => router.push(`${base}/bons`)}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%", padding: "0.875rem 1.125rem", borderRadius: "14px", background: "#fff", border: "1px solid #E5EBF5", boxShadow: "0 2px 6px rgba(0,0,0,0.04)", cursor: "text", textAlign: "left" }}>
          <Search size={16} color="#9CA3AF" strokeWidth={2} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: "0.875rem", color: "#9CA3AF" }}>Rechercher un bon, un client...</span>
        </button>
      </div>
    </div>
  );
}