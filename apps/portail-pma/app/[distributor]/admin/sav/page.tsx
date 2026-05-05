import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";

function formatDate(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(value);
}

const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };
const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };
const btnLink: React.CSSProperties = { display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, color: "#0a4d9b", border: "1px solid #bfdbfe", background: "rgba(255,255,255,0.8)", textDecoration: "none" };
const sectionWrap: React.CSSProperties = { borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" };
const sectionHead: React.CSSProperties = { padding: "1rem 1.25rem", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", display: "flex", justifyContent: "space-between", alignItems: "center" };

const STATUS_MAP: Record<string, { label: string; bg: string; color: string; border: string }> = {
  frigo:          { label: "Brouillon",      bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" },
  envoye:         { label: "Envoyé",         bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  pris_en_charge: { label: "Pris en charge", bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  en_cours:       { label: "En cours",       bg: "#eef2ff", color: "#4338ca", border: "#c7d2fe" },
  traite:         { label: "Traité",         bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  refuse:         { label: "Refusé",         bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  a_corriger:     { label: "À corriger",     bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" };
  return <span style={{ display: "inline-flex", padding: "0.25rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{s.label}</span>;
}

const OPEN_STATUSES = ["envoye", "pris_en_charge", "en_cours", "a_corriger"];
const SAV_BON_TYPES = ["sav", "devis_materiel", "commande_materiel"];
const INTERVENTION_TYPES = ["intervention"];

export default async function AdminSavPage({
  params,
}: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${user.distributorSlug}/admin`;

  // Vérifier que le bloc SAV est actif
  const savTool = await prisma.distributor_tools.findFirst({
    where: { distributor_id: user.distributorId, is_enabled: true, tools: { code: "sav" } },
  });
  if (!savTool) notFound();

  // Vérifier blocs optionnels
  const [interventionsTool, contratsTool] = await Promise.all([
    prisma.distributor_tools.findFirst({ where: { distributor_id: user.distributorId, is_enabled: true, tools: { code: "interventions" } } }),
    prisma.distributor_tools.findFirst({ where: { distributor_id: user.distributorId, is_enabled: true, tools: { code: "contrats_maintenance" } } }),
  ]);

  const hasInterventions = !!interventionsTool;
  const hasContrats      = !!contratsTool;

  // Charger les bons SAV
  const [bonsSav, bonsIntervention, relevesParc] = await Promise.all([
    prisma.bons.findMany({
      where: { distributor_id: user.distributorId, bon_type: { in: SAV_BON_TYPES } },
      include: { clients: { select: { name: true, code: true } }, stores: { select: { name: true } }, users: { select: { first_name: true, last_name: true } } },
      orderBy: { updated_at: "desc" },
      take: 50,
    }),
    hasInterventions ? prisma.bons.findMany({
      where: { distributor_id: user.distributorId, bon_type: { in: INTERVENTION_TYPES } },
      include: { clients: { select: { name: true } }, stores: { select: { name: true } }, users: { select: { first_name: true, last_name: true } } },
      orderBy: { updated_at: "desc" },
      take: 50,
    }) : Promise.resolve([]),
    hasContrats ? prisma.releve_parc_items.findMany({
      where: { bons: { distributor_id: user.distributorId } },
      include: { bons: { select: { id: true, bon_number: true, status: true, clients: { select: { name: true } } } } },
      orderBy: { created_at: "desc" },
      take: 20,
    }) : Promise.resolve([]),
  ]);

  const savEnCours      = bonsSav.filter((b) => OPEN_STATUSES.includes(b.status)).length;
  const devisEnAttente  = bonsSav.filter((b) => b.bon_type === "devis_materiel" && OPEN_STATUSES.includes(b.status)).length;
  const interEnCours    = bonsIntervention.filter((b) => OPEN_STATUSES.includes(b.status)).length;

  const kpis: { title: string; value: number; note: string; tone: "blue" | "yellow" | "neutral" | "green" | "red" }[] = [
    { title: "Bons SAV",       value: bonsSav.length,    note: `${savEnCours} en cours`,        tone: "blue"    },
    { title: "Devis matériel", value: devisEnAttente,     note: "en attente de transformation", tone: "yellow"  },
    ...(hasInterventions ? [{ title: "Interventions",    value: bonsIntervention.length, note: `${interEnCours} en cours`,     tone: "neutral" as const }] : []),
    ...(hasContrats      ? [{ title: "Relevés de parc",  value: relevesParc.length,      note: "équipements recensés",        tone: "green"   as const }] : []),
  ];

  return (
    <AdminModulePage
      badge="SAV · Admin"
      title="Module SAV"
      description="Supervision des bons SAV, devis matériel et interventions de votre réseau."
      backHref={adminBase}
      kpis={kpis}
    >

      {/* Bons SAV */}
      <div style={sectionWrap}>
        <div style={sectionHead}>
          <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Bons SAV & Matériel ({bonsSav.length})
          </p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["sav", "devis_materiel", "commande_materiel"].map((type) => {
              const count = bonsSav.filter((b) => b.bon_type === type).length;
              const labels: Record<string, string> = { sav: "SAV", devis_materiel: "Devis", commande_materiel: "Commandes" };
              return (
                <span key={type} style={{ display: "inline-flex", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}>
                  {labels[type]} : {count}
                </span>
              );
            })}
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
            <thead>
              <tr>
                <th style={th}>Numéro</th>
                <th style={th}>Type</th>
                <th style={th}>Client</th>
                <th style={th}>Magasin SAV</th>
                <th style={th}>ATC</th>
                <th style={th}>Statut</th>
                <th style={th}>Mis à jour</th>
                <th style={{ ...th, textAlign: "right" }}>Fiche</th>
              </tr>
            </thead>
            <tbody>
              {bonsSav.map((b) => {
                const typeLabels: Record<string, string> = { sav: "SAV matériel", devis_materiel: "Devis matériel", commande_materiel: "Commande matériel" };
                return (
                  <tr key={b.id}>
                    <td style={{ ...td, fontWeight: 700 }}>{b.bon_number}</td>
                    <td style={tdM}>{typeLabels[b.bon_type] || b.bon_type}</td>
                    <td style={td}>{b.clients?.name || "—"}</td>
                    <td style={tdM}>{b.stores?.name || "—"}</td>
                    <td style={tdM}>{b.users ? `${b.users.first_name} ${b.users.last_name}` : "—"}</td>
                    <td style={td}><StatusBadge status={b.status} /></td>
                    <td style={tdM}>{formatDate(b.updated_at)}</td>
                    <td style={{ ...td, textAlign: "right" }}>
                      <Link href={`${adminBase}/bons/${b.id}`} style={btnLink}>Voir</Link>
                    </td>
                  </tr>
                );
              })}
              {!bonsSav.length && (
                <tr><td colSpan={8} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2rem" }}>Aucun bon SAV.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interventions */}
      {hasInterventions && (
        <div style={sectionWrap}>
          <div style={sectionHead}>
            <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Interventions ({bonsIntervention.length})
            </p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
              <thead>
                <tr>
                  <th style={th}>Numéro</th>
                  <th style={th}>Client</th>
                  <th style={th}>Magasin</th>
                  <th style={th}>ATC</th>
                  <th style={th}>Statut</th>
                  <th style={th}>Date</th>
                  <th style={{ ...th, textAlign: "right" }}>Fiche</th>
                </tr>
              </thead>
              <tbody>
                {bonsIntervention.map((b) => (
                  <tr key={b.id}>
                    <td style={{ ...td, fontWeight: 700 }}>{b.bon_number}</td>
                    <td style={td}>{b.clients?.name || "—"}</td>
                    <td style={tdM}>{b.stores?.name || "—"}</td>
                    <td style={tdM}>{b.users ? `${b.users.first_name} ${b.users.last_name}` : "—"}</td>
                    <td style={td}><StatusBadge status={b.status} /></td>
                    <td style={tdM}>{formatDate(b.updated_at)}</td>
                    <td style={{ ...td, textAlign: "right" }}>
                      <Link href={`${adminBase}/bons/${b.id}`} style={btnLink}>Voir</Link>
                    </td>
                  </tr>
                ))}
                {!bonsIntervention.length && (
                  <tr><td colSpan={7} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2rem" }}>Aucune intervention.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Relevés de parc */}
      {hasContrats && (
        <div style={sectionWrap}>
          <div style={sectionHead}>
            <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Relevés de parc ({relevesParc.length} équipements)
            </p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
              <thead>
                <tr>
                  <th style={th}>Désignation</th>
                  <th style={th}>Marque</th>
                  <th style={th}>Modèle</th>
                  <th style={th}>N° Série</th>
                  <th style={th}>Année</th>
                  <th style={th}>Formule</th>
                  <th style={th}>Tarif HT</th>
                  <th style={th}>Client</th>
                  <th style={{ ...th, textAlign: "right" }}>Bon</th>
                </tr>
              </thead>
              <tbody>
                {relevesParc.map((r) => (
                  <tr key={r.id}>
                    <td style={{ ...td, fontWeight: 600 }}>{r.designation || "—"}</td>
                    <td style={tdM}>{r.marque || "—"}</td>
                    <td style={tdM}>{r.modele || "—"}</td>
                    <td style={{ ...tdM, fontFamily: "monospace" }}>{r.numero_serie || "—"}</td>
                    <td style={tdM}>{r.annee || "—"}</td>
                    <td style={tdM}>{r.formule || "—"}</td>
                    <td style={tdM}>{r.tarif_ht ? `${Number(r.tarif_ht).toFixed(2)} €` : "—"}</td>
                    <td style={tdM}>{r.bons?.clients?.name || "—"}</td>
                    <td style={{ ...td, textAlign: "right" }}>
                      {r.bons ? <Link href={`${adminBase}/bons/${r.bons.id}`} style={btnLink}>{r.bons.bon_number}</Link> : "—"}
                    </td>
                  </tr>
                ))}
                {!relevesParc.length && (
                  <tr><td colSpan={9} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2rem" }}>Aucun relevé de parc.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message si contrats actifs mais pas de relevés */}
      {hasContrats && relevesParc.length === 0 && (
        <div style={{ padding: "1.25rem", borderRadius: "1.25rem", background: "rgba(239,246,255,0.6)", border: "1px solid #bfdbfe" }}>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#0a4d9b" }}>
            💡 Les relevés de parc apparaîtront ici une fois que vos ATC ou CDV auront créé des bons de type "Relevé de parc".
          </p>
        </div>
      )}

    </AdminModulePage>
  );
}