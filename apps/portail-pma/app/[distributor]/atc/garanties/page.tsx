import { requireAccess } from "@/lib/require-access";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Shield, Plus, Clock, AlertTriangle, XCircle, FileText, ChevronRight } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  brouillon:              { label: "Brouillon",           cls: "badge-gray"   },
  en_cours:               { label: "En cours",            cls: "badge-blue"   },
  en_attente_fournisseur: { label: "Attente fournisseur", cls: "badge-yellow" },
  validee:                { label: "Validée",             cls: "badge-green"  },
  refusee:                { label: "Refusée",             cls: "badge-red"    },
};

const GOLD = "#ca8a04";

export default async function AtcGarantiesPage({ params }: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const user    = await requireAccess({ allowedRoles: ["atc"], distributorSlug: distributor });
  const atcBase = `/${user.distributorSlug}/atc`;

  const garanties = await prisma.garanties.findMany({
    where:   { distributor_id: user.distributorId, assigned_user_id: user.id },
    include: { clients: { select: { name: true, code: true } } },
    orderBy: { created_at: "desc" },
  });

  const kpis = {
    total:    garanties.length,
    en_cours: garanties.filter((g) => g.status === "en_cours").length,
    attente:  garanties.filter((g) => g.status === "en_attente_fournisseur").length,
    refusee:  garanties.filter((g) => g.status === "refusee").length,
    brouillon:garanties.filter((g) => g.status === "brouillon").length,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Hero or */}
      <div style={{ padding: "1.75rem", borderRadius: "var(--r-2xl)", background: "linear-gradient(135deg,rgba(202,138,4,0.06),rgba(217,119,6,0.03))", border: "1px solid rgba(253,230,138,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "var(--r-md)", background: "rgba(202,138,4,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Shield size={22} color={GOLD} strokeWidth={2} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "var(--font-xs)", fontWeight: 800, color: GOLD, textTransform: "uppercase", letterSpacing: "0.1em" }}>ATC · Garanties</p>
              <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "var(--c-text)", letterSpacing: "-0.02em" }}>Garanties pièces</h1>
            </div>
          </div>
          <Link href={`${atcBase}/garanties/new`} className="btn-primary"
            style={{ textDecoration: "none", background: `linear-gradient(135deg,${GOLD},#d97706)`, boxShadow: "0 4px 14px rgba(202,138,4,0.3)" }}>
            <Plus size={15} strokeWidth={2.5} /> Nouvelle demande
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="atc-grid-4" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))" }}>
        {[
          { label: "Total",              value: kpis.total,     color: "var(--c-text)",    bg: "var(--c-white)",          Icon: Shield        },
          { label: "En cours",           value: kpis.en_cours,  color: "var(--c-blue-primary)", bg: "var(--c-blue-light)", Icon: Clock         },
          { label: "Attente fournisseur",value: kpis.attente,   color: "#b45309",          bg: "var(--c-warning-bg)",     Icon: AlertTriangle  },
          { label: "Refusées",           value: kpis.refusee,   color: "var(--c-danger)",  bg: "var(--c-danger-bg)",      Icon: XCircle        },
          { label: "Brouillons",         value: kpis.brouillon, color: "var(--c-text-secondary)", bg: "var(--c-bg)",      Icon: FileText       },
        ].map(({ label, value, color, bg, Icon }) => (
          <div key={label} className="kpi-card" style={{ background: bg }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "var(--r-sm)", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={14} color={color} strokeWidth={2.5} />
            </div>
            <p style={{ margin: "0.375rem 0 0", fontSize: "1.75rem", fontWeight: 800, color, lineHeight: 1 }}>{value}</p>
            <p style={{ margin: "0.2rem 0 0", fontSize: "var(--font-xs)", color: "var(--c-text-secondary)", fontWeight: 600 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Liste */}
      <div className="card-section">
        {garanties.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.875rem" }}>
            <Shield size={40} color="var(--c-text-muted)" strokeWidth={1.5} />
            <p style={{ margin: 0, fontWeight: 700, color: "var(--c-text)", fontSize: "var(--font-lg)" }}>Aucune demande de garantie</p>
            <p style={{ margin: 0, fontSize: "var(--font-sm)", color: "var(--c-text-secondary)" }}>
              Créez votre première demande depuis le bouton ci-dessus.
            </p>
            <Link href={`${atcBase}/garanties/new`} className="btn-primary"
              style={{ textDecoration: "none", marginTop: "0.25rem", background: `linear-gradient(135deg,${GOLD},#d97706)` }}>
              <Plus size={14} strokeWidth={2.5} /> Nouvelle demande de garantie
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {garanties.map((g) => {
              const st = STATUS_LABELS[g.status] ?? STATUS_LABELS.brouillon;
              return (
                <Link key={g.id} href={`${atcBase}/garanties/${g.id}`} style={{ textDecoration: "none" }}>
                  <div className="atc-list-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.2rem" }}>
                        <p style={{ margin: 0, fontSize: "var(--font-md)", fontWeight: 700, color: "var(--c-text)" }}>
                          {g.numero_garantie ?? "Brouillon"} — {g.marque_piece ?? "—"} {g.reference_piece ?? ""}
                        </p>
                        <span className={`badge-lysma ${st.cls}`}>{st.label}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: "var(--font-xs)", color: "var(--c-text-secondary)" }}>
                        {g.clients?.code ? `${g.clients.code} · ` : ""}{g.clients?.name ?? "—"}
                        {g.defaut_constate ? ` · ${g.defaut_constate.slice(0, 60)}` : ""}
                      </p>
                    </div>
                    <p style={{ margin: 0, fontSize: "var(--font-xs)", color: "var(--c-text-muted)", flexShrink: 0 }}>
                      {new Date(g.created_at).toLocaleDateString("fr-FR")}
                    </p>
                    <ChevronRight size={16} color="var(--c-text-muted)" strokeWidth={2} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}