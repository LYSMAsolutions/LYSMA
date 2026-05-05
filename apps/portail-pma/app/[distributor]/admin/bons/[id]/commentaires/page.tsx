import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import BonHeader from "@/components/admin/bons/BonHeader";

function formatDate(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(value);
}

const commentTypeLabels: Record<string, { label: string; bg: string; color: string; border: string }> = {
  internal:           { label: "Interne",            bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" },
  note:               { label: "Note",               bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  correction_request: { label: "Correction requise", bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  status_note:        { label: "Note statut",        bg: "#eef2ff", color: "#4338ca", border: "#c7d2fe" },
  system:             { label: "Système",            bg: "#f8fafc", color: "#94a3b8", border: "#e2e8f0" },
};

const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "top" };
const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };

export default async function AdminBonCommentairesPage({
  params,
}: { params: Promise<{ distributor: string; id: string }> }) {
  const { distributor, id } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const bon = await prisma.bons.findFirst({
    where: { id, distributor_id: currentUser.distributorId },
    include: { clients: true, stores: true, users: true, store_staff: true },
  });
  if (!bon) notFound();

  const comments = await prisma.bon_comments.findMany({
    where: { bon_id: bon.id, is_deleted: false },
    include: { users: true, store_staff: true },
    orderBy: { created_at: "desc" },
  });

  return (
    <AdminModulePage
      badge="Bon · Commentaires"
      title={`Commentaires · ${bon.bon_number}`}
      description={`${comments.length} commentaire${comments.length > 1 ? "s" : ""} sur ce bon.`}
      backHref={`${adminBase}/bons/${bon.id}`}
      backLabel="Retour bon"
    >
      <BonHeader distributor={currentUser.distributorSlug} bon={bon} />

      {comments.length === 0 ? (
        <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
          <p style={{ margin: 0 }}>Aucun commentaire sur ce bon.</p>
        </section>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {comments.map((comment) => {
            const author = comment.users
              ? `${comment.users.first_name} ${comment.users.last_name}`.trim()
              : comment.store_staff
                ? `${comment.store_staff.first_name} ${comment.store_staff.last_name}`.trim()
                : "—";
            const typeStyle = commentTypeLabels[comment.comment_type] ?? commentTypeLabels.internal;
            const isSystem = comment.comment_type === "system";

            return (
              <div key={comment.id} style={{
                borderRadius: "1.25rem",
                background: isSystem ? "rgba(248,250,252,0.7)" : "rgba(255,255,255,0.8)",
                border: `1px solid ${isSystem ? "rgba(226,232,240,0.6)" : "rgba(217,227,240,0.9)"}`,
                padding: "1.25rem 1.5rem",
                boxShadow: "0 4px 12px rgba(15,23,42,0.04)",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {/* Avatar */}
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "10px",
                      background: isSystem ? "#f1f5f9" : "linear-gradient(135deg,#eff6ff,#dbeafe)",
                      border: "1px solid #bfdbfe",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.75rem", fontWeight: 800, color: "#0a4d9b", flexShrink: 0,
                    }}>
                      {isSystem ? "⚙" : author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#0f172a" }}>{author}</p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8" }}>{formatDate(comment.created_at)}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ display: "inline-flex", padding: "0.25rem 0.65rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700, background: typeStyle.bg, color: typeStyle.color, border: `1px solid ${typeStyle.border}` }}>
                      {typeStyle.label}
                    </span>
                    {comment.is_edited && (
                      <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontStyle: "italic" }}>modifié</span>
                    )}
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: "0.9rem", color: isSystem ? "#64748b" : "#0f172a", lineHeight: 1.65, paddingLeft: "2.75rem" }}>
                  {comment.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </AdminModulePage>
  );
}