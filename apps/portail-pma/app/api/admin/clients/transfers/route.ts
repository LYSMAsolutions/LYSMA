import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

// GET — liste des demandes en attente
export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";

    const where: Record<string, unknown> = {
      distributor_id: session.user.distributorId,
    };
    if (status !== "all") where.status = status;

    // CDV et ATC ne voient que leurs propres demandes
    if (["cdv", "atc"].includes(session.user.roleCode)) {
      where.OR = [
        { requested_by_user_id: session.user.id },
        { target_user_id:       session.user.id },
        { current_user_id:      session.user.id },
      ];
    }

    const requests = await prisma.client_transfer_requests.findMany({
      where,
      include: {
        clients:       { select: { id: true, name: true, code: true } },
        requested_by:  { select: { id: true, first_name: true, last_name: true, roles: { select: { code: true } } } },
        current_user:  { select: { id: true, first_name: true, last_name: true } },
        target_user:   { select: { id: true, first_name: true, last_name: true } },
        reviewed_by:   { select: { id: true, first_name: true, last_name: true } },
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

// POST — créer une demande de transfert
export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const body       = await req.json();
    const clientId   = String(body.client_id    || "").trim();
    const targetId   = String(body.target_user_id || "").trim();
    const note       = body.note ? String(body.note).trim() : null;

    if (!clientId || !targetId)
      return NextResponse.json({ success: false, message: "Client et ATC cible obligatoires." }, { status: 400 });

    // Vérifier que le client appartient au distributeur
    const client = await prisma.clients.findFirst({
      where: { id: clientId, distributor_id: session.user.distributorId },
      select: { id: true, assigned_user_id: true },
    });
    if (!client)
      return NextResponse.json({ success: false, message: "Client introuvable." }, { status: 404 });

    // Vérifier qu'il n'y a pas déjà une demande pending sur ce client
    const existing = await prisma.client_transfer_requests.findFirst({
      where: { client_id: clientId, status: "pending" },
    });
    if (existing)
      return NextResponse.json({ success: false, message: "Une demande est déjà en cours pour ce client." }, { status: 409 });

    const transfer = await prisma.client_transfer_requests.create({
      data: {
        distributor_id:       session.user.distributorId,
        client_id:            clientId,
        requested_by_user_id: session.user.id,
        current_user_id:      client.assigned_user_id ?? null,
        target_user_id:       targetId,
        status:               "pending",
        note,
      },
    });

    return NextResponse.json({ success: true, transferId: transfer.id });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur.", error: error instanceof Error ? error.message : "unknown" }, { status: 500 });
  }
}