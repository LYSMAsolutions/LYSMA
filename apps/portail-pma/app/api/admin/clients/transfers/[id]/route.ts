import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || !["admin", "rdm", "cdv"].includes(session.user.roleCode))
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { id } = await context.params;
    const body   = await req.json();
    const action = String(body.action || "").trim(); // "approve" | "reject"

    if (!["approve", "reject"].includes(action))
      return NextResponse.json({ success: false, message: "Action invalide." }, { status: 400 });

    const transfer = await prisma.client_transfer_requests.findFirst({
      where: { id, distributor_id: session.user.distributorId, status: "pending" },
    });
    if (!transfer)
      return NextResponse.json({ success: false, message: "Demande introuvable ou déjà traitée." }, { status: 404 });

    if (action === "approve") {
      await prisma.$transaction(async (tx) => {
        // Transférer le client vers le nouvel ATC
        await tx.clients.update({
          where: { id: transfer.client_id },
          data:  { assigned_user_id: transfer.target_user_id },
        });
        // Mettre à jour la demande
        await tx.client_transfer_requests.update({
          where: { id },
          data: {
            status:              "approved",
            reviewed_by_user_id: session.user.id,
            reviewed_at:         new Date(),
          },
        });
      });
    } else {
      await prisma.client_transfer_requests.update({
        where: { id },
        data: {
          status:              "rejected",
          reviewed_by_user_id: session.user.id,
          reviewed_at:         new Date(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}