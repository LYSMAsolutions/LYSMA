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
  const { sessionId, userId, stopPar } = await req.json();

  // Trouve la session ouverte par sessionId ou userId
  const openSession = await prisma.session.findFirst({
    where: {
      garageId: garage.garageId,
      status: "OPEN",
      ...(sessionId ? { id: sessionId } : {}),
      ...(userId && !sessionId ? { userId } : {}),
    },
    include: { user: true },
  });

  if (!openSession) {
    return NextResponse.json({ error: "Aucune session ouverte trouvée" }, { status: 404 });
  }

  const endTime = new Date();
  const durationMin = Math.round(
    (endTime.getTime() - openSession.startTime.getTime()) / 60000
  );

  const closed = await prisma.session.update({
    where: { id: openSession.id },
    data: { endTime, durationMin, status: "CLOSED" },
  });

  // Archive dans historique
  await prisma.history.create({
    data: {
      garageId: openSession.garageId,
      userId: openSession.userId,
      matricule: openSession.user.matricule || null,
      nomPrenom: `${openSession.user.prenom || ""} ${openSession.user.nom || ""}`.trim(),
      dossier: openSession.dossier,
      comment: openSession.comment,
      startTime: openSession.startTime,
      endTime,
      durationMin,
      stopPar: stopPar || (garage.role === "ADMIN" ? "ADMIN" : "ATELIER"),
    },
  });

  return NextResponse.json({ success: true, session: closed });
}
