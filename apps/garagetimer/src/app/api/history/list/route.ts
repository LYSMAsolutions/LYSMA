import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const garage = session.user as any;
  const { searchParams } = new URL(req.url);

  const dateFrom = searchParams.get("from");
  const dateTo = searchParams.get("to");
  const userId = searchParams.get("userId");
  const dossier = searchParams.get("dossier");

  const history = await prisma.history.findMany({
    where: {
      garageId: garage.garageId,
      ...(userId && { userId }),
      ...(dossier && { dossier: { contains: dossier, mode: "insensitive" } }),
      ...(dateFrom || dateTo ? {
        startTime: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo + "T23:59:59") }),
        },
      } : {}),
    },
    orderBy: { startTime: "desc" },
    take: 200,
  });

  return NextResponse.json({ history });
}

// PUT — mettre à jour tempsConstructeurMin
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { historyId, tempsConstructeurMin } = await req.json();
  if (!historyId) return NextResponse.json({ error: "historyId requis" }, { status: 400 });

  const tcMin = tempsConstructeurMin ? Math.round(Number(tempsConstructeurMin)) : null;

  // Calcule l'indice
  const hist = await prisma.history.findUnique({ where: { id: historyId } });
 let indice: string | null = null;
if (hist && tcMin && tcMin > 0) {
  const delta = Math.round(((tcMin - hist.durationMin) / 60) * 100) / 100;
  indice = (delta >= 0 ? "+" : "") + delta.toFixed(2) + "h";
}

  await prisma.history.update({
    where: { id: historyId },
    data: { tempsConstructeurMin: tcMin, indice, updatedAt: new Date() },
  });

  return NextResponse.json({ success: true, indice });
}
