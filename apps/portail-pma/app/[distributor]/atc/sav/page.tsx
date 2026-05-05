import { requireAccess } from "@/lib/require-access";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Wrench, Plus, TrendingUp, Clock, CheckCircle2, XCircle, ChevronRight } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  brouillon: { label: "Brouillon", cls: "badge-gray"   },
  envoye:    { label: "Envoyé",    cls: "badge-blue"   },
  en_cours:  { label: "En cours",  cls: "badge-blue"   },
  traite:    { label: "Traité",    cls: "badge-green"  },
  annule:    { label: "Annulé",    cls: "badge-red"    },
};

const BON_TYPE_LABELS: Record<string, string> = {
  intervention:        "Intervention",
  devis_materiel:      "Devis / Commande matériel",
  sav:                 "Pièces SAV",
  contrat_maintenance: "Relevé de parc",
};

export default async function AtcSAVPage({ params }: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const user    = await requireAccess({ allowedRoles: ["atc"], distributorSlug: distributor });
  const atcBase = `/${user.distributorSlug}/atc`;

  const SAV_TYPES = ["intervention", "devis_materiel", "sav", "contrat_maintenance"];

  const bons = await prisma.bons.findMany({
    where:   { distributor_id: user.distributorId, created_by_user_id: user.id, bon_type: { in: SAV_TYPES } },
    include: { clients: { select: { name: true, code: true } }, stores: { select: { name: true, code: true } } },
    orderBy: { created_at: "desc" },
  });

  const kpis = {
    total:    bons.length,
    envoyes:  bons.filter((b) => b.status !== "brouillon").length,
    en_cours: bons.filter((b) => b.status === "en_cours").length,
    traites:  bons.filter((b) => b.status === "traite").length,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Hero violet */}
      <div style={{ padding: "1.75rem", borderRadius: "var(--r-2xl)", background: "linear-gradient(135deg,rgba(124,58,237,0.06),rgba(139,92,246,0.03))", border: "1px solid rgba(196,181,253,0.5)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "var(--r-md)", background: "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Wrench size={22} color="#7c3aed" strokeWidth={2} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "var(--font-xs)", fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.1em" }}>ATC · SAV</p>
              <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "var(--c-text)", letterSpacing: "-0.02em" }}>Espace SAV</h1>
            </div>
          </div>
          <Link href={`${atcBase}/sav/new`} className="btn-primary"
            style={{ textDecoration: "none", background: "linear-gradient(135deg,#7c3aed,#8b5cf6)", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}>
            <Plus size={15} strokeWidth={2.5} /> Nouvelle demande SAV
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="atc-grid-4">
        {[
          { label: "Total",     value: kpis.total,    color: "var(--c-text)",    bg: "var(--c-white)",   Icon: Wrench       },
          { label: "Envoyés",   value: kpis.envoyes,  color: "#7c3aed",          bg: "rgba(124,58,237,0.05)", Icon: TrendingUp },
          { label: "En cours",  value: kpis.en_cours, color: "var(--c-blue-primary)", bg: "var(--c-blue-light)", Icon: Clock  },
          { label: "Traités",   value: kpis.traites,  color: "var(--c-success)", bg: "var(--c-success-bg)", Icon: CheckCircle2 },
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
        {bons.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.875rem" }}>
            <Wrench size={40} color="var(--c-text-muted)" strokeWidth={1.5} />
            <p style={{ margin: 0, fontWeight: 700, color: "var(--c-text)", fontSize: "var(--font-lg)" }}>Aucune demande SAV</p>
            <p style={{ margin: 0, fontSize: "var(--font-sm)", color: "var(--c-text-secondary)" }}>
              Créez votre première demande depuis le bouton ci-dessus.
            </p>
            <Link href={`${atcBase}/sav/new`} className="btn-primary"
              style={{ textDecoration: "none", marginTop: "0.25rem", background: "linear-gradient(135deg,#7c3aed,#8b5cf6)" }}>
              <Plus size={14} strokeWidth={2.5} /> Nouvelle demande SAV
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {bons.map((bon) => {
              const st = STATUS_LABELS[bon.status ?? "brouillon"] ?? STATUS_LABELS.brouillon;
              return (
                <Link key={bon.id} href={`${atcBase}/bons/${bon.id}`} style={{ textDecoration: "none" }}>
                  <div className="atc-list-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.2rem" }}>
                        <p style={{ margin: 0, fontSize: "var(--font-md)", fontWeight: 700, color: "var(--c-text)" }}>
                          {bon.bon_number ?? "—"} · {BON_TYPE_LABELS[bon.bon_type ?? ""] ?? bon.bon_type}
                        </p>
                        <span className={`badge-lysma ${st.cls}`}>{st.label}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: "var(--font-xs)", color: "var(--c-text-secondary)" }}>
                        {bon.clients?.code ? `${bon.clients.code} · ` : ""}{bon.clients?.name ?? "—"}
                        {bon.stores ? ` · ${bon.stores.code}` : ""}
                      </p>
                    </div>
                    <p style={{ margin: 0, fontSize: "var(--font-xs)", color: "var(--c-text-muted)", flexShrink: 0 }}>
                      {new Date(bon.created_at).toLocaleDateString("fr-FR")}
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