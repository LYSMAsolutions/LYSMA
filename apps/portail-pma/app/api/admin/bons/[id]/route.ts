import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, requireAdminApi, toJsonSafe } from "@/lib/api-admin";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { user, response } = await requireAdminApi();
    if (response) return response;

    const { id } = await context.params;
    const bon = await prisma.bons.findFirst({
      where: { id, distributor_id: user.distributorId },
      include: {
        clients: true,
        stores: true,
        users: { select: { id: true, first_name: true, last_name: true, email: true } },
        store_staff: { select: { id: true, first_name: true, last_name: true, initials: true } },
        bon_lines: { orderBy: { line_number: "asc" } },
        bon_vehicles: { orderBy: { vehicle_order: "asc" } },
        bon_photos: { orderBy: [{ sort_order: "asc" }, { created_at: "desc" }] },
        documents: {
          where: { is_active: true },
          include: { document_versions_documents_current_version_idTodocument_versions: true },
          orderBy: { created_at: "desc" },
        },
        bon_comments: {
          where: { is_deleted: false },
          include: {
            users: { select: { id: true, first_name: true, last_name: true } },
            store_staff: { select: { id: true, first_name: true, last_name: true, initials: true } },
          },
          orderBy: { created_at: "desc" },
        },
        bon_anomalies: {
          include: { anomaly_types: true, users: { select: { id: true, first_name: true, last_name: true } } },
          orderBy: { detected_at: "desc" },
        },
        bon_status_history: {
          include: {
            users: { select: { id: true, first_name: true, last_name: true } },
            store_staff: { select: { id: true, first_name: true, last_name: true, initials: true } },
          },
          orderBy: { created_at: "desc" },
        },
      },
    });

    if (!bon) return jsonError("Bon introuvable.", 404);
    return NextResponse.json({ success: true, bon: toJsonSafe(bon) });
  } catch (error) {
    return jsonError("Erreur serveur.", 500, error);
  }
}
