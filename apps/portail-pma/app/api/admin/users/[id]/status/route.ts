import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { id } = await context.params;

    if (id === session.user.id)
      return NextResponse.json({ success: false, message: "Impossible de modifier votre propre statut." }, { status: 400 });

    const body = await req.json();
    const isActive = Boolean(body.isActive);

    await prisma.users.update({ where: { id }, data: { is_active: isActive } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}