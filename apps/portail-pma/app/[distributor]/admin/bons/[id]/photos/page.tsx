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

const photoTypeLabels: Record<string, string> = {
  general:      "Général",
  sav:          "SAV",
  intervention: "Intervention",
  garantie:     "Garantie",
  retour:       "Retour",
  vehicule:     "Véhicule",
  piece:        "Pièce",
  anomalie:     "Anomalie",
};

const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };
const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };

export default async function AdminBonPhotosPage({
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

  const photos = await prisma.bon_photos.findMany({
    where: { bon_id: bon.id },
    orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
  });

  return (
    <AdminModulePage
      badge="Bon · Photos"
      title={`Photos · ${bon.bon_number}`}
      description={`${photos.length} photo${photos.length > 1 ? "s" : ""} rattachée${photos.length > 1 ? "s" : ""} à ce bon.`}
      backHref={`${adminBase}/bons/${bon.id}`}
      backLabel="Retour bon"
    >
      <BonHeader distributor={currentUser.distributorSlug} bon={bon} />

      {photos.length === 0 ? (
        <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", padding: "3rem", textAlign: "center", color: "#94a3b8", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>Aucune photo attachée à ce bon.</p>
        </section>
      ) : (
        <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "640px" }}>
              <thead>
                <tr>
                  <th style={th}>Fichier</th>
                  <th style={th}>Type</th>
                  <th style={th}>Légende</th>
                  <th style={th}>Taille</th>
                  <th style={th}>Date</th>
                  <th style={{ ...th, textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {photos.map((photo) => {
                  const url = photo.public_url ?? photo.storage_path ?? null;
                  const isImage = photo.mime_type?.startsWith("image/");
                  return (
                    <tr key={photo.id}>
                      <td style={td}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <span style={{ fontSize: "1.1rem" }}>{isImage ? "🖼️" : "📎"}</span>
                          <span style={{ fontWeight: 600, fontSize: "0.82rem", fontFamily: "monospace" }}>{photo.original_name ?? photo.file_name}</span>
                        </div>
                      </td>
                      <td style={tdM}>
                        <span style={{ display: "inline-flex", padding: "0.25rem 0.65rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}>
                          {photoTypeLabels[photo.photo_type] ?? photo.photo_type}
                        </span>
                      </td>
                      <td style={tdM}>{photo.caption || "—"}</td>
                      <td style={tdM}>{formatSize(photo.file_size_bytes)}</td>
                      <td style={tdM}>{formatDate(photo.created_at)}</td>
                      <td style={{ ...td, textAlign: "right" }}>
                        {url ? (
                          <a href={url} target="_blank" rel="noopener noreferrer" style={{
                            display: "inline-flex", alignItems: "center", gap: "0.35rem",
                            padding: "0.35rem 0.85rem", borderRadius: "999px",
                            fontSize: "0.78rem", fontWeight: 600,
                            color: "#0a4d9b", border: "1px solid #bfdbfe",
                            background: "rgba(255,255,255,0.8)", textDecoration: "none",
                          }}>
                            {isImage ? "🔍 Voir" : "⬇ Télécharger"}
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