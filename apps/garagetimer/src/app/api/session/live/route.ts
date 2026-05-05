import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const garage = session.user as any;

  const liveSessions = await prisma.session.findMany({
    where: { garageId: garage.garageId, status: "OPEN" },
    include: {
      user: { select: { nom: true, prenom: true, matricule: true } },
    },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json({ sessions: liveSessions });
}
