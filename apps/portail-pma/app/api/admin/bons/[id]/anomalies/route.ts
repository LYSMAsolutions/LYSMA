import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, requireAdminApi, toJsonSafe } from "@/lib/api-admin";

async function getManualAnomalyType(distributorId: string) {
  return prisma.anomaly_types.upsert({
    where: { distributor_id_code: { distributor_id: distributorId, code: "MANUAL" } },
    create: {
      distributor_id: distributorId,
      code: "MANUAL",
      label: "Anomalie manuelle",
      severity: "medium",
      is_active: true,
    },
    update: {},
  });
}

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

    const anomalies = await prisma.bon_anomalies.findMany({
      where: { bon_id: id },
      include: { anomaly_types: true, users: { select: { id: true, first_name: true, last_name: true } } },
      orderBy: { detected_at: "desc" },
    });

    return NextResponse.json({ success: true, anomalies: toJsonSafe(anomalies) });
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
    const description = String(body.description || "").trim();
    const severity = String(body.severity || "medium").trim();

    const bon = await prisma.bons.findFirst({ where: { id, distributor_id: user.distributorId }, select: { id: true } });
    if (!bon) return jsonError("Bon introuvable.", 404);

    const anomalyTypeId = String(body.anomaly_type_id || "").trim();
    const type = anomalyTypeId
      ? await prisma.anomaly_types.findFirst({ where: { id: anomalyTypeId, distributor_id: user.distributorId } })
      : await getManualAnomalyType(user.distributorId);
    if (!type) return jsonError("Type d'anomalie introuvable.", 404);

    const anomaly = await prisma.bon_anomalies.create({
      data: {
        bon_id: id,
        anomaly_type_id: type.id,
        detected_by_user_id: user.id,
        status: String(body.status || "open").trim(),
        severity,
        description: description || null,
      },
    });

    return NextResponse.json({ success: true, anomaly: toJsonSafe(anomaly) });
  } catch (error) {
    return jsonError("Erreur serveur.", 500, error);
  }
}
