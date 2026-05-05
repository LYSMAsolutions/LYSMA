import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

// GET /api/atc/clients/[clientId]/equipment — liste le matériel enregistré
export async function GET(req: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "atc")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { clientId } = await params;

    // Vérifier que le client appartient bien à cet ATC
    const client = await prisma.clients.findFirst({
      where: { id: clientId, distributor_id: session.user.distributorId, assigned_user_id: session.user.id },
    });
    if (!client)
      return NextResponse.json({ success: false, message: "Client introuvable." }, { status: 404 });

    const equipment = await prisma.client_equipment.findMany({
      where: { client_id: clientId, distributor_id: session.user.distributorId, is_active: true },
      orderBy: [{ type_materiel: "asc" }, { created_at: "desc" }],
    });

    return NextResponse.json({ success: true, equipment });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

// POST /api/atc/clients/[clientId]/equipment — enregistre un nouvel équipement manuellement
export async function POST(req: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "atc")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { clientId } = await params;
    const body = await req.json();

    const client = await prisma.clients.findFirst({
      where: { id: clientId, distributor_id: session.user.distributorId, assigned_user_id: session.user.id },
    });
    if (!client)
      return NextResponse.json({ success: false, message: "Client introuvable." }, { status: 404 });

    if (!body.type_materiel?.trim())
      return NextResponse.json({ success: false, message: "Type de matériel obligatoire." }, { status: 400 });

    const eq = await prisma.client_equipment.create({
      data: {
        distributor_id: session.user.distributorId,
        client_id:      clientId,
        type_materiel:  String(body.type_materiel).toUpperCase().trim(),
        marque:         body.marque   ? String(body.marque).toUpperCase().trim()    : null,
        modele:         body.modele   ? String(body.modele).toUpperCase().trim()    : null,
        num_serie:      body.num_serie? String(body.num_serie).toUpperCase().trim() : null,
        annee:          body.annee    ? Number(body.annee)                          : null,
        source:         "manuel",
        bon_id:         body.bon_id   || null,
        is_active:      true,
      },
    });

    return NextResponse.json({ success: true, equipment: eq });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}