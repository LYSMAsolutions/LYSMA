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
    const bon = await prisma.bons.findFirst({ where: { id, distributor_id: user.distributorId }, select: { id: true } });
    if (!bon) return jsonError("Bon introuvable.", 404);

    const photos = await prisma.bon_photos.findMany({
      where: { bon_id: id },
      include: {
        users: { select: { id: true, first_name: true, last_name: true } },
        store_staff: { select: { id: true, first_name: true, last_name: true, initials: true } },
        bon_vehicles: true,
      },
      orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
    });

    return NextResponse.json({ success: true, photos: toJsonSafe(photos) });
  } catch (error) {
    return jsonError("Erreur serveur.", 500, error);
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { user, response } = await requireAdminApi();
    if (response) return response;

    const { id } = await context.params;
    const body = await req.json();
    const fileName = String(body.file_name || body.fileName || body.original_name || "").trim();
    const storagePath = String(body.storage_path || body.storagePath || body.public_url || "").trim();
    if (!fileName || !storagePath) return jsonError("Nom de fichier et chemin obligatoires.", 400);

    const bon = await prisma.bons.findFirst({ where: { id, distributor_id: user.distributorId }, select: { id: true } });
    if (!bon) return jsonError("Bon introuvable.", 404);

    const photo = await prisma.bon_photos.create({
      data: {
        bon_id: id,
        bon_vehicle_id: String(body.bon_vehicle_id || "").trim() || null,
        file_name: fileName,
        original_name: String(body.original_name || body.originalName || "").trim() || fileName,
        mime_type: String(body.mime_type || body.mimeType || "image/jpeg").trim(),
        file_size_bytes: body.file_size_bytes ? BigInt(body.file_size_bytes) : null,
        storage_provider: String(body.storage_provider || "local").trim(),
        storage_path: storagePath,
        public_url: String(body.public_url || body.publicUrl || "").trim() || null,
        uploaded_by_user_id: user.id,
        photo_type: String(body.photo_type || "general").trim(),
        caption: String(body.caption || "").trim() || null,
        sort_order: Number(body.sort_order || 1),
      },
    });

    return NextResponse.json({ success: true, photo: toJsonSafe(photo) });
  } catch (error) {
    return jsonError("Erreur serveur.", 500, error);
  }
}
