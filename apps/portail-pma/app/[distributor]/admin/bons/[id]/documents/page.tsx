import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import BonHeader from "@/components/admin/bons/BonHeader";

function formatDate(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(value);
}

function formatSize(bytes: bigint | null) {
  if (!bytes) return "—";
  const n = Number(bytes);
  if (n < 1024) return `${n} o`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} Ko`;
  return `${(n / (1024 * 1024)).toFixed(1)} Mo`;
}

const docTypeLabels: Record<string, string> = {
  bon_pdf:             "Bon PDF",
  bon_signed_pdf:      "Bon signé",
  client_attachment:   "Pièce jointe client",
  sav_attachment:      "Pièce jointe SAV",
  intervention_report: "Rapport d'intervention",
  export_csv:          "Export CSV",
  catalogue_pdf:       "Catalogue PDF",
  other:               "Autre",
};

const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };
const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };

export default async function AdminBonDocumentsPage({
  params,
}: {
  params: Promise<{ distributor: string; id: string }>;
}) {
  const { distributor, id } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const bon = await prisma.bons.findFirst({
    where: { id, distributor_id: currentUser.distributorId },
    include: { clients: true, stores: true, users: true, store_staff: true },
  });

  if (!bon) notFound();

  const documents = await prisma.documents.findMany({
    where: { bon_id: bon.id },
    include: {
      document_versions_document_versions_document_idTodocuments: {
        orderBy: { version_number: "desc" },
        take: 1,
      },
    },
    orderBy: { created_at: "desc" },
  });

  return (
    <AdminModulePage
      badge="Bon · Documents"
      title={`Documents · ${bon.bon_number}`}
      description={`${documents.length} document${documents.length > 1 ? "s" : ""} rattaché${documents.length > 1 ? "s" : ""} à ce bon.`}
      backHref={`${adminBase}/bons/${bon.id}`}
      backLabel="Retour bon"
    >
      <BonHeader distributor={currentUser.distributorSlug} bon={bon} />

      {documents.length === 0 ? (
        <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", padding: "3rem", textAlign: "center", color: "#94a3b8", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>Aucun document généré pour ce bon.</p>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.82rem" }}>Les PDFs seront disponibles ici une fois générés.</p>
        </section>
      ) : (
        <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "640px" }}>
              <thead>
                <tr>
                  <th style={th}>Type</th>
                  <th style={th}>Titre</th>
                  <th style={th}>Statut</th>
                  <th style={th}>Version</th>
                  <th style={th}>Taille</th>
                  <th style={th}>Généré le</th>
                  <th style={{ ...th, textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => {
                  const lastVersion = doc.document_versions_document_versions_document_idTodocuments[0] ?? null;
                  const url = lastVersion?.public_url ?? lastVersion?.storage_path ?? null;
                  const isPdf = lastVersion?.mime_type?.includes("pdf");

                  return (
                    <tr key={doc.id}>
                      <td style={td}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                          <span>{isPdf ? "📄" : "📎"}</span>
                          <span style={{ fontWeight: 600 }}>{docTypeLabels[doc.document_type] ?? doc.document_type}</span>
                        </span>
                      </td>
                      <td style={td}>{doc.title || "—"}</td>
                      <td style={td}>
                        <span style={{
                          display: "inline-flex", padding: "0.3rem 0.75rem", borderRadius: "999px",
                          fontSize: "0.75rem", fontWeight: 700,
                          background: ["generated","signed"].includes(doc.document_status) ? "#f0fdf4" : "#f8fafc",
                          color:      ["generated","signed"].includes(doc.document_status) ? "#15803d" : "#64748b",
                          border:     ["generated","signed"].includes(doc.document_status) ? "1px solid #bbf7d0" : "1px solid #e2e8f0",
                        }}>
                          {{ generated: "Généré", signed: "Signé", draft: "Brouillon", archived: "Archivé", cancelled: "Annulé" }[doc.document_status] ?? doc.document_status}
                        </span>
                      </td>
                      <td style={tdM}>{lastVersion ? `v${lastVersion.version_number}` : "—"}</td>
                      <td style={tdM}>{formatSize(lastVersion?.file_size_bytes ?? null)}</td>
                      <td style={tdM}>{formatDate(lastVersion?.generated_at ?? null)}</td>
                      <td style={{ ...td, textAlign: "right" }}>
                        {url ? (
                          <a href={url} target="_blank" rel="noopener noreferrer" style={{
                            display: "inline-flex", alignItems: "center", gap: "0.35rem",
                            padding: "0.35rem 0.85rem", borderRadius: "999px",
                            fontSize: "0.78rem", fontWeight: 600,
                            color: "#0a4d9b", border: "1px solid #bfdbfe",
                            background: "rgba(255,255,255,0.8)", textDecoration: "none",
                          }}>
                            {isPdf ? "📄 Voir PDF" : "⬇ Télécharger"}
                          </a>
                        ) : (
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Non disponible</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </AdminModulePage>
  );
}