import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import Link from "next/link";

function formatDate(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string; border: string }> = {
    frigo:               { label: "Brouillon",          bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" },
    envoye:              { label: "Envoyé",              bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
    non_pris_en_charge:  { label: "Non pris en charge",  bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
    pris_en_charge:      { label: "Pris en charge",      bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    en_cours:            { label: "En cours",            bg: "#eef2ff", color: "#4338ca", border: "#c7d2fe" },
    attente_fournisseur: { label: "Attente fourn.",      bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
    attente_client:      { label: "Attente client",      bg: "#fefce8", color: "#a16207", border: "#fef08a" },
    traite:              { label: "Traité",              bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
    refuse:              { label: "Refusé",              bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
    a_corriger:          { label: "À corriger",          bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  };
  const s = map[status] ?? { label: status, bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "0.3rem 0.75rem",
      borderRadius: "999px",
      fontSize: "0.75rem", fontWeight: 700,
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      whiteSpace: "nowrap",
    }}>
      {s.label}
    </span>
  );
}

function TypeLabel({ type }: { type: string }) {
  const map: Record<string, string> = {
    commande_devis:       "Commande / Devis",
    retour:               "Retour",
    sav:                  "SAV",
    intervention:         "Intervention",
    devis_materiel:       "Devis matériel",
    transformation_devis: "Transformation devis",
    garantie:             "Garantie",
    contrat_maintenance:  "Contrat maintenance",
  };
  return <>{map[type] ?? type}</>;
}

const SectionHeader = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem" }}>
    <div>
      <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em" }}>{title}</h2>
      {subtitle && <p style={{ margin: "0.25rem 0 0", fontSize: "0.83rem", color: "#94a3b8" }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

const ViewAllLink = ({ href }: { href: string }) => (
  <Link href={href} style={{
    display: "inline-flex", alignItems: "center", gap: "0.25rem",
    padding: "0.45rem 1rem",
    borderRadius: "999px",
    fontSize: "0.8rem", fontWeight: 600,
    color: "#0a4d9b",
    border: "1px solid #bfdbfe",
    background: "#eff6ff",
    textDecoration: "none",
    whiteSpace: "nowrap",
    transition: "all 0.18s ease",
  }}>
    Voir tous →
  </Link>
);

const OpenBtn = ({ href }: { href: string }) => (
  <Link href={href} style={{
    display: "inline-flex", alignItems: "center",
    padding: "0.35rem 0.85rem",
    borderRadius: "999px",
    fontSize: "0.78rem", fontWeight: 600,
    color: "#0a4d9b",
    border: "1px solid #bfdbfe",
    background: "rgba(255,255,255,0.8)",
    textDecoration: "none",
    transition: "all 0.18s ease",
  }}>
    Ouvrir →
  </Link>
);

// Styles communs pour les cellules
const th: React.CSSProperties = {
  padding: "0.75rem 1.25rem",
  textAlign: "left",
  fontSize: "0.72rem",
  fontWeight: 800,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  background: "rgba(248,251,255,0.95)",
  borderBottom: "1px solid rgba(217,227,240,0.8)",
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: "0.9rem 1.25rem",
  fontSize: "0.9rem",
  color: "#0f172a",
  borderBottom: "1px solid rgba(226,232,240,0.6)",
  verticalAlign: "middle",
};

const tdMuted: React.CSSProperties = {
  ...td,
  color: "#6b7280",
  fontSize: "0.83rem",
};

export default async function AdminBonsPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;

  const currentUser = await requireAccess({
    allowedRoles: ["admin"],
    distributorSlug: distributor,
  });

  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const bons = await prisma.bons.findMany({
    where: { distributor_id: currentUser.distributorId },
    include: {
      clients: { select: { name: true } },
      stores:  { select: { name: true, code: true } },
      users:   { select: { first_name: true, last_name: true } },
    },
    orderBy: { created_at: "desc" },
  });

  const total   = bons.length;
  const enCours = bons.filter((b) => ["envoye","non_pris_en_charge","pris_en_charge","en_cours","attente_fournisseur","attente_client"].includes(b.status)).length;
  const traites = bons.filter((b) => b.status === "traite").length;
  const refuses = bons.filter((b) => b.status === "refuse").length;
  const aCorr   = bons.filter((b) => b.status === "a_corriger").length;
  const urgents = bons.filter((b) => b.status === "non_pris_en_charge").length;

  const derniers  = bons.slice(0, 8);
  const aTraiter  = bons.filter((b) => ["non_pris_en_charge","a_corriger","envoye"].includes(b.status)).slice(0, 8);

  const parStatut = [
    { label: "Brouillon",          count: bons.filter((b) => b.status === "frigo").length,               color: "#94a3b8" },
    { label: "Envoyé",             count: bons.filter((b) => b.status === "envoye").length,              color: "#f59e0b" },
    { label: "Non pris en charge", count: bons.filter((b) => b.status === "non_pris_en_charge").length,  color: "#ef4444" },
    { label: "Pris en charge",     count: bons.filter((b) => b.status === "pris_en_charge").length,      color: "#3b82f6" },
    { label: "En cours",           count: bons.filter((b) => b.status === "en_cours").length,            color: "#6366f1" },
    { label: "Attente fourn.",     count: bons.filter((b) => b.status === "attente_fournisseur").length, color: "#f97316" },
    { label: "Attente client",     count: bons.filter((b) => b.status === "attente_client").length,      color: "#eab308" },
    { label: "Traité",             count: bons.filter((b) => b.status === "traite").length,              color: "#10b981" },
    { label: "Refusé",             count: bons.filter((b) => b.status === "refuse").length,              color: "#dc2626" },
    { label: "À corriger",         count: bons.filter((b) => b.status === "a_corriger").length,          color: "#f59e0b" },
  ].filter((s) => s.count > 0);

  const typeCounts: Record<string, number> = {};
  bons.forEach((b) => { typeCounts[b.bon_type] = (typeCounts[b.bon_type] || 0) + 1; });
  const parType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);

  const storeCounts: Record<string, { name: string; total: number; traites: number; enCours: number }> = {};
  bons.forEach((b) => {
    const key  = b.assigned_store_id ?? "none";
    const name = b.stores ? `${b.stores.code} · ${b.stores.name}` : "Non assigné";
    if (!storeCounts[key]) storeCounts[key] = { name, total: 0, traites: 0, enCours: 0 };
    storeCounts[key].total++;
    if (b.status === "traite") storeCounts[key].traites++;
    if (["en_cours","pris_en_charge","envoye"].includes(b.status)) storeCounts[key].enCours++;
  });
  const parMagasin = Object.values(storeCounts).sort((a, b) => b.total - a.total);

  const cardStyle: React.CSSProperties = {
    borderRadius: "1.5rem",
    background: "rgba(255,255,255,0.75)",
    border: "1px solid rgba(217,227,240,0.9)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
    padding: "1.75rem",
    overflow: "hidden",
  };

  const tableWrap: React.CSSProperties = {
    borderRadius: "1rem",
    border: "1px solid rgba(217,227,240,0.8)",
    overflow: "hidden",
    background: "rgba(255,255,255,0.6)",
  };

  return (
    <AdminModulePage
      badge="Bons · Admin"
      title="Gestion des bons"
      description="Cockpit principal des bons du distributeur."
      backHref={`${adminBase}`}
      kpis={[
        { title: "Total",      value: total,   href: `${adminBase}/bons/gestion`,                          note: "bons enregistrés",       tone: "blue"    },
        { title: "En cours",   value: enCours, href: `${adminBase}/bons/gestion?scope=open`,               note: "bons actifs",            tone: "yellow"  },
        { title: "À traiter",  value: urgents, href: `${adminBase}/bons/gestion?status=non_pris_en_charge`,note: "non pris en charge",     tone: "red"     },
        { title: "Traités",    value: traites, href: `${adminBase}/bons/gestion?status=traite`,            note: "bons finalisés",         tone: "green"   },
        { title: "À corriger", value: aCorr,   href: `${adminBase}/bons/gestion?status=a_corriger`,        note: "corrections en attente", tone: "yellow"  },
      ]}
    >

      {/* ── ACTION REQUISE ── */}
      {aTraiter.length > 0 && (
        <div style={{ ...cardStyle, borderColor: "#fecaca", background: "rgba(254,242,242,0.6)" }}>
          <SectionHeader
            title="⚠️  Action requise"
            subtitle="Ces bons attendent une intervention immédiate."
            action={<ViewAllLink href={`${adminBase}/bons/gestion?scope=open`} />}
          />
          <div style={tableWrap}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Bon</th>
                  <th style={th}>Client</th>
                  <th style={th}>Magasin</th>
                  <th style={th}>Statut</th>
                  <th style={th}>Créé le</th>
                  <th style={{ ...th, textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {aTraiter.map((bon) => (
                  <tr key={bon.id} style={{ transition: "background 0.15s" }}>
                    <td style={{ ...td, fontWeight: 700 }}>{bon.bon_number}</td>
                    <td style={td}>{bon.clients?.name ?? "—"}</td>
                    <td style={tdMuted}>{bon.stores ? `${bon.stores.code} · ${bon.stores.name}` : "—"}</td>
                    <td style={td}><StatusBadge status={bon.status} /></td>
                    <td style={tdMuted}>{formatDate(bon.created_at)}</td>
                    <td style={{ ...td, textAlign: "right" }}><OpenBtn href={`${adminBase}/bons/${bon.id}`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── DERNIERS BONS ── */}
      <div style={cardStyle}>
        <SectionHeader
          title="Derniers bons créés"
          subtitle="Les 8 bons les plus récents."
          action={<ViewAllLink href={`${adminBase}/bons/gestion`} />}
        />
        <div style={tableWrap}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Bon</th>
                <th style={th}>Type</th>
                <th style={th}>Client</th>
                <th style={th}>Magasin</th>
                <th style={th}>Créé par</th>
                <th style={th}>Statut</th>
                <th style={th}>Date</th>
                <th style={{ ...th, textAlign: "right" }}></th>
              </tr>
            </thead>
            <tbody>
              {derniers.map((bon) => (
                <tr key={bon.id}>
                  <td style={{ ...td, fontWeight: 700 }}>{bon.bon_number}</td>
                  <td style={tdMuted}><TypeLabel type={bon.bon_type} /></td>
                  <td style={td}>{bon.clients?.name ?? "—"}</td>
                  <td style={tdMuted}>{bon.stores ? `${bon.stores.code} · ${bon.stores.name}` : "—"}</td>
                  <td style={tdMuted}>{bon.users ? `${bon.users.first_name} ${bon.users.last_name}`.trim() : "—"}</td>
                  <td style={td}><StatusBadge status={bon.status} /></td>
                  <td style={tdMuted}>{formatDate(bon.created_at)}</td>
                  <td style={{ ...td, textAlign: "right" }}><OpenBtn href={`${adminBase}/bons/${bon.id}`} /></td>
                </tr>
              ))}
              {!derniers.length && (
                <tr><td colSpan={8} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2.5rem" }}>Aucun bon enregistré.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── STATS 2 COLONNES ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>

        {/* Par statut */}
        <div style={cardStyle}>
          <SectionHeader title="Répartition par statut" />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {parStatut.map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: "0.875rem", color: "#334155", fontWeight: 500 }}>{s.label}</span>
                <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0f172a", minWidth: "1.5rem", textAlign: "right" }}>{s.count}</span>
                <div style={{ width: "72px", height: "5px", borderRadius: "999px", background: "#e2e8f0", overflow: "hidden", flexShrink: 0 }}>
                  <div style={{ height: "100%", width: `${total > 0 ? Math.round((s.count / total) * 100) : 0}%`, background: s.color, borderRadius: "999px" }} />
                </div>
              </div>
            ))}
            {!parStatut.length && <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>Aucune donnée.</p>}
          </div>
        </div>

        {/* Par type */}
        <div style={cardStyle}>
          <SectionHeader title="Répartition par type" />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {parType.map(([type, count]) => (
              <div key={type} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: "0.875rem", color: "#334155", fontWeight: 500 }}><TypeLabel type={type} /></span>
                <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0f172a", minWidth: "1.5rem", textAlign: "right" }}>{count}</span>
                <div style={{ width: "72px", height: "5px", borderRadius: "999px", background: "#e2e8f0", overflow: "hidden", flexShrink: 0 }}>
                  <div style={{ height: "100%", width: `${total > 0 ? Math.round((count / total) * 100) : 0}%`, background: "#3b82f6", borderRadius: "999px" }} />
                </div>
              </div>
            ))}
            {!parType.length && <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>Aucune donnée.</p>}
          </div>
        </div>
      </div>

      {/* ── PAR MAGASIN ── */}
      <div style={cardStyle}>
        <SectionHeader
          title="Activité par magasin"
          subtitle="Volume et taux de traitement par point de vente."
        />
        <div style={tableWrap}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Magasin</th>
                <th style={{ ...th, textAlign: "center" }}>Total</th>
                <th style={{ ...th, textAlign: "center" }}>En cours</th>
                <th style={{ ...th, textAlign: "center" }}>Traités</th>
                <th style={th}>Taux de traitement</th>
              </tr>
            </thead>
            <tbody>
              {parMagasin.map((store) => {
                const taux = store.total > 0 ? Math.round((store.traites / store.total) * 100) : 0;
                return (
                  <tr key={store.name}>
                    <td style={{ ...td, fontWeight: 700 }}>{store.name}</td>
                    <td style={{ ...td, textAlign: "center" }}>{store.total}</td>
                    <td style={{ ...td, textAlign: "center" }}>
                      <span style={{ fontWeight: 600, color: store.enCours > 0 ? "#b45309" : "#94a3b8" }}>{store.enCours}</span>
                    </td>
                    <td style={{ ...td, textAlign: "center" }}>
                      <span style={{ fontWeight: 600, color: store.traites > 0 ? "#15803d" : "#94a3b8" }}>{store.traites}</span>
                    </td>
                    <td style={td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ flex: 1, height: "6px", borderRadius: "999px", background: "#e2e8f0", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${taux}%`, background: taux >= 80 ? "#10b981" : taux >= 50 ? "#f59e0b" : "#ef4444", borderRadius: "999px", transition: "width 0.3s" }} />
                        </div>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155", minWidth: "2.5rem" }}>{taux}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!parMagasin.length && (
                <tr><td colSpan={5} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2.5rem" }}>Aucune donnée.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </AdminModulePage>
  );
}