import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import BonHeader from "@/components/admin/bons/BonHeader";

const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };
const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };

const itemTypeLabels: Record<string, string> = {
  reference: "Référence", designation: "Désignation libre", immat: "Immatriculation",
  vin: "VIN", outillage: "Outillage", materiel: "Matériel", autre: "Autre",
};

export default async function AdminBonLinesPage({
  params,
}: {
  params: Promise<{ distributor: string; id: string }>;
}) {
  const { distributor, id } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase   = `/${currentUser.distributorSlug}/admin`;

  const bon = await prisma.bons.findFirst({
    where:   { id, distributor_id: currentUser.distributorId },
    include: { clients: true, stores: true, users: true, store_staff: true },
  });

  if (!bon) notFound();

  const isReleve = bon.bon_type === "contrat_maintenance";

  const [lines, releveItems] = await Promise.all([
    prisma.bon_lines.findMany({ where: { bon_id: bon.id }, orderBy: { line_number: "asc" } }),
    isReleve
      ? prisma.releve_parc_items.findMany({ where: { bon_id: bon.id }, orderBy: { created_at: "asc" } })
      : Promise.resolve([]),
  ]);

  // Afficher les colonnes optionnelles seulement si au moins un item a une valeur
  const showTarif   = releveItems.some((i) => i.tarif_ht !== null);
  const showFormule = releveItems.some((i) => i.formule  !== null && i.formule !== "");

  const total = lines.reduce((sum, l) => sum + Number(l.quantity ?? 0) * Number(l.unit_price ?? 0), 0);

  return (
    <AdminModulePage
      badge="Bon · Lignes"
      title={`Lignes · ${bon.bon_number}`}
      description={`${lines.length} ligne${lines.length > 1 ? "s" : ""} · Total HT estimé : ${total.toFixed(2)} €`}
      backHref={`${adminBase}/bons/${bon.id}`}
      backLabel="Retour bon"
    >
      <BonHeader distributor={currentUser.distributorSlug} bon={bon} />

      {/* Tableau lignes */}
      <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "720px" }}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "center", width: "60px" }}>#</th>
                <th style={th}>Type</th>
                <th style={th}>Référence</th>
                <th style={th}>Désignation</th>
                <th style={{ ...th, textAlign: "right" }}>Qté</th>
                <th style={{ ...th, textAlign: "right" }}>Prix unit. HT</th>
                <th style={{ ...th, textAlign: "right" }}>Total HT</th>
                <th style={th}>Code tarif.</th>
                <th style={th}>Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => {
                const qty       = Number(line.quantity   ?? 0);
                const price     = Number(line.unit_price ?? 0);
                const lineTotal = qty * price;
                return (
                  <tr key={line.id}>
                    <td style={{ ...td, textAlign: "center", fontWeight: 700, color: "#94a3b8" }}>{line.line_number}</td>
                    <td style={tdM}>{itemTypeLabels[line.item_type] ?? line.item_type}</td>
                    <td style={{ ...td, fontWeight: 600, fontFamily: "monospace", fontSize: "0.82rem" }}>{line.reference || "—"}</td>
                    <td style={td}>{line.designation || "—"}</td>
                    <td style={{ ...td, textAlign: "right", fontWeight: 600 }}>{line.quantity ? qty.toString() : "—"}</td>
                    <td style={{ ...td, textAlign: "right" }}>{line.unit_price ? `${price.toFixed(2)} €` : "—"}</td>
                    <td style={{ ...td, textAlign: "right", fontWeight: 600, color: "#0a4d9b" }}>
                      {line.unit_price && line.quantity ? `${lineTotal.toFixed(2)} €` : "—"}
                    </td>
                    <td style={{ ...tdM, fontFamily: "monospace", fontSize: "0.8rem" }}>{line.billing_code || "—"}</td>
                    <td style={tdM}>{line.comment || "—"}</td>
                  </tr>
                );
              })}
              {!lines.length && (
                <tr><td colSpan={9} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2.5rem" }}>Aucune ligne trouvée.</td></tr>
              )}
            </tbody>
            {lines.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={6} style={{ padding: "0.9rem 1.25rem", textAlign: "right", fontSize: "0.82rem", fontWeight: 700, color: "#64748b", background: "rgba(248,251,255,0.95)", borderTop: "1px solid rgba(217,227,240,0.8)" }}>Total HT estimé</td>
                  <td style={{ padding: "0.9rem 1.25rem", textAlign: "right", fontSize: "0.95rem", fontWeight: 800, color: "#0a4d9b", background: "rgba(248,251,255,0.95)", borderTop: "1px solid rgba(217,227,240,0.8)" }}>{total.toFixed(2)} €</td>
                  <td colSpan={2} style={{ background: "rgba(248,251,255,0.95)", borderTop: "1px solid rgba(217,227,240,0.8)" }} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </section>

      {/* Section équipements — uniquement pour les relevés de parc */}
      {isReleve && (
        <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(167,243,208,0.6)", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
          {/* Header */}
          <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid rgba(167,243,208,0.5)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(240,253,244,0.6)" }}>
            <div>
              <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 800, color: "#059669", textTransform: "uppercase", letterSpacing: "0.08em" }}>Contrat maintenance</p>
              <h2 style={{ margin: "0.2rem 0 0", fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>Équipements recensés</h2>
            </div>
            <span style={{ padding: "0.3rem 0.875rem", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 700, background: "rgba(5,150,105,0.1)", color: "#059669", border: "1px solid rgba(5,150,105,0.25)" }}>
              {releveItems.length} équipement{releveItems.length !== 1 ? "s" : ""}
            </span>
          </div>

          {releveItems.length === 0 ? (
            <div style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8" }}>
              <p style={{ margin: 0, fontWeight: 600 }}>Aucun équipement enregistré sur ce relevé.</p>
              <p style={{ margin: "0.375rem 0 0", fontSize: "0.82rem" }}>Les équipements sont ajoutés lors de la création du relevé par l&apos;ATC.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead>
                  <tr>
                    <th style={{ ...th, textAlign: "center", width: "50px" }}>#</th>
                    <th style={th}>Désignation</th>
                    <th style={th}>Marque</th>
                    <th style={th}>Modèle</th>
                    <th style={th}>N° de série</th>
                    <th style={{ ...th, textAlign: "center" }}>Année</th>
                    {showTarif   && <th style={{ ...th, textAlign: "right" }}>Tarif HT</th>}
                    {showFormule && <th style={th}>Formule</th>}
                    <th style={th}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {releveItems.map((item, idx) => (
                    <tr key={item.id}>
                      <td style={{ ...td, textAlign: "center", fontWeight: 700, color: "#94a3b8" }}>{idx + 1}</td>
                      <td style={{ ...td, fontWeight: 600 }}>{item.designation  || "—"}</td>
                      <td style={tdM}>{item.marque       || "—"}</td>
                      <td style={tdM}>{item.modele       || "—"}</td>
                      <td style={{ ...tdM, fontFamily: "monospace" }}>{item.numero_serie || "—"}</td>
                      <td style={{ ...td, textAlign: "center" }}>{item.annee ?? "—"}</td>
                      {showTarif   && <td style={{ ...td, textAlign: "right" }}>{item.tarif_ht ? `${Number(item.tarif_ht).toFixed(2)} €` : "—"}</td>}
                      {showFormule && <td style={tdM}>{item.formule || "—"}</td>}
                      <td style={tdM}>{item.notes        || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </AdminModulePage>
  );
}