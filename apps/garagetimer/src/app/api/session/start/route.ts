import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const garage = session.user as any;
  const { userId, pinCode, dossier, comment } = await req.json();

  if (!userId || !pinCode) {
    return NextResponse.json({ error: "Compagnon et PIN requis" }, { status: 400 });
  }

  // Vérifie que le compagnon appartient au garage et est actif
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      garageId: garage.garageId,
      isActive: true,
      role: "ATELIER",
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Compagnon introuvable ou inactif" }, { status: 404 });
  }

  // Vérifie le PIN
  if (user.pinCode !== pinCode) {
    return NextResponse.json({ error: "PIN incorrect" }, { status: 401 });
  }

  // Vérifie pas de session déjà ouverte pour ce compagnon
  const existing = await prisma.session.findFirst({
    where: { userId: user.id, status: "OPEN" },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Ce compagnon a déjà une session en cours", session: existing },
      { status: 400 }
    );
  }

  const newSession = await prisma.session.create({
    data: {
      userId: user.id,
      garageId: garage.garageId,
      dossier: dossier || null,
      comment: comment || null,
      startTime: new Date(),
      status: "OPEN",
    },
    include: { user: true },
  });

  return NextResponse.json({ success: true, session: newSession });
}
