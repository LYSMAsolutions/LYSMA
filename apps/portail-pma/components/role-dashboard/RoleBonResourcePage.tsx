import { requireAccess } from "@/lib/require-access";
import { prisma } from "@/lib/prisma";
import { getScopedBonOrNotFound } from "@/lib/role-bon-access";
import { BonHistoryCard, BonLinesCard } from "@/components/role-dashboard/BonDetailCards";
import BonHeader from "@/components/admin/bons/BonHeader";

type Section = "cdv" | "rdm" | "store";
type Resource = "detail" | "historique" | "lignes" | "documents" | "photos" | "commentaires" | "anomalies";

const roleAccess = {
  cdv: ["cdv"],
  rdm: ["rdm"],
  store: ["store", "store_staff"],
} as const;

export async function RoleBonResourcePage({
  distributor,
  id,
  section,
  resource,
}: {
  distributor: string;
  id: string;
  section: Section;
  resource: Resource;
}) {
  const user = await requireAccess({ allowedRoles: [...roleAccess[section]], distributorSlug: distributor });
  const bon = await getScopedBonOrNotFound({ user, bonId: id, role: section });

  if (resource === "detail") {
    return (
      <div className="space-y-8">
        <BonHeader distributor={user.distributorSlug} bon={bon} showAdminNav={false} />
        <section className="card-lysma p-8">
          <h2 className="text-xl font-semibold text-[#0F172A]">Commentaire principal</h2>
          <p className="mt-4 text-sm leading-7 text-[#6B7280]">{bon.comment || "Aucun commentaire principal."}</p>
        </section>
      </div>
    );
  }

  if (resource === "lignes") return <BonLinesCard bon={bon} />;
  if (resource === "historique") return <BonHistoryCard bon={bon} />;

  if (resource === "documents") {
    const rows = await prisma.documents.findMany({
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
      <ResourceCard title="Documents" empty={!rows.length}>
        {rows.map((doc) => {
          const version = doc.document_versions_document_versions_document_idTodocuments[0];
          const url = version?.public_url ?? version?.storage_path;
          return (
            <div key={doc.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-[#0F172A]">{doc.title || doc.document_type}</p>
                  <p className="mt-1 text-sm text-[#6B7280]">{doc.document_status}</p>
                </div>
                {url ? <a href={url} target="_blank" rel="noreferrer" className="btn-secondary">Ouvrir</a> : <span className="text-sm text-[#94A3B8]">Non disponible</span>}
              </div>
            </div>
          );
        })}
      </ResourceCard>
    );
  }

  if (resource === "photos") {
    const rows = await prisma.bon_photos.findMany({
      where: { bon_id: bon.id },
      orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
    });

    return (
      <ResourceCard title="Photos" empty={!rows.length}>
        {rows.map((photo) => {
          const url = photo.public_url ?? photo.storage_path;
          return (
            <div key={photo.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-[#0F172A]">{photo.original_name || photo.file_name}</p>
                  <p className="mt-1 text-sm text-[#6B7280]">{photo.caption || photo.photo_type}</p>
                </div>
                {url ? <a href={url} target="_blank" rel="noreferrer" className="btn-secondary">Voir</a> : <span className="text-sm text-[#94A3B8]">Non disponible</span>}
              </div>
            </div>
          );
        })}
      </ResourceCard>
    );
  }

  if (resource === "commentaires") {
    const rows = await prisma.bon_comments.findMany({
      where: { bon_id: bon.id, is_deleted: false },
      include: { users: true, store_staff: true },
      orderBy: { created_at: "desc" },
    });

    return (
      <ResourceCard title="Commentaires" empty={!rows.length}>
        {rows.map((comment) => {
          const author = comment.users
            ? `${comment.users.first_name} ${comment.users.last_name}`.trim()
            : comment.store_staff
              ? `${comment.store_staff.first_name} ${comment.store_staff.last_name}`.trim()
              : "-";
          return (
            <div key={comment.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <p className="font-semibold text-[#0F172A]">{author}</p>
                <span className="text-sm text-[#6B7280]">{comment.comment_type}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#6B7280]">{comment.content}</p>
            </div>
          );
        })}
      </ResourceCard>
    );
  }

  const rows = await prisma.bon_anomalies.findMany({
    where: { bon_id: bon.id },
    include: { anomaly_types: true, users: true, store_staff: true },
    orderBy: { created_at: "desc" },
  });

  return (
    <ResourceCard title="Anomalies" empty={!rows.length}>
      {rows.map((item) => (
        <div key={item.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="font-semibold text-[#0F172A]">{item.anomaly_types?.label || "Anomalie"}</p>
            <span className="text-sm text-[#6B7280]">{item.status}</span>
          </div>
          <p className="mt-3 text-sm leading-7 text-[#6B7280]">{item.description || "Sans description."}</p>
        </div>
      ))}
    </ResourceCard>
  );
}

function ResourceCard({
  title,
  empty,
  children,
}: {
  title: string;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="card-lysma p-8">
      <h2 className="text-xl font-semibold text-[#0F172A]">{title}</h2>
      <div className="mt-6 space-y-4">
        {empty ? <p className="text-sm text-[#6B7280]">Aucun element trouve.</p> : children}
      </div>
    </section>
  );
}
