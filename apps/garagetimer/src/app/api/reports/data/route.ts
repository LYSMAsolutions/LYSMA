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
  const userId = searchParams.get("userId") || undefined;
  const dossier = searchParams.get("dossier") || undefined;

  if (!dateFrom || !dateTo) {
    return NextResponse.json({ error: "Dates requises (from & to)" }, { status: 400 });
  }

  const history = await prisma.history.findMany({
    where: {
      garageId: garage.garageId,
      ...(userId && { userId }),
      ...(dossier && { dossier: { contains: dossier, mode: "insensitive" } }),
      startTime: {
        gte: new Date(dateFrom + "T00:00:00"),
        lte: new Date(dateTo + "T23:59:59"),
      },
    },
    orderBy: [{ userId: "asc" }, { startTime: "asc" }],
  });

  const garageInfo = await prisma.garage.findUnique({
    where: { id: garage.garageId },
    select: { name: true, email: true, logoUrl: true },
  });

  const users = await prisma.user.findMany({
    where: { garageId: garage.garageId },
    select: { id: true, nom: true, prenom: true, matricule: true },
  });

  // Agrège par compagnon
  const byUser: Record<string, {
    userId: string;
    nomPrenom: string;
    matricule: string;
    entries: typeof history;
    totalRealMin: number;
    totalTCMin: number;
  }> = {};

  for (const entry of history) {
    if (!byUser[entry.userId]) {
      const user = users.find(u => u.id === entry.userId);
      byUser[entry.userId] = {
        userId: entry.userId,
        nomPrenom: entry.nomPrenom || `${user?.prenom || ""} ${user?.nom || ""}`.trim() || "Inconnu",
        matricule: entry.matricule || user?.matricule || "—",
        entries: [],
        totalRealMin: 0,
        totalTCMin: 0,
      };
    }
    byUser[entry.userId].entries.push(entry);
    byUser[entry.userId].totalRealMin += entry.durationMin;
    byUser[entry.userId].totalTCMin += entry.tempsConstructeurMin || 0;
  }

  const totalRealMin = history.reduce((a, h) => a + h.durationMin, 0);
  const totalTCMin = history.reduce((a, h) => a + (h.tempsConstructeurMin || 0), 0);

  const compagnons = Object.values(byUser).map(c => ({
    ...c,
    totalRealH: Math.round((c.totalRealMin / 60) * 100) / 100,
    totalTCH: Math.round((c.totalTCMin / 60) * 100) / 100,
    deltaH: c.totalTCMin > 0
      ? Math.round(((c.totalTCMin - c.totalRealMin) / 60) * 100) / 100
      : null,
  }));

  return NextResponse.json({
    garage: garageInfo,
    period: { from: dateFrom, to: dateTo },
    generatedAt: new Date().toISOString(),
    stats: {
      totalSessions: history.length,
      totalRealH: Math.round((totalRealMin / 60) * 100) / 100,
      totalTCH: Math.round((totalTCMin / 60) * 100) / 100,
      deltaH: totalTCMin > 0
        ? Math.round(((totalTCMin - totalRealMin) / 60) * 100) / 100
        : null,
      nbCompagnons: compagnons.length,
    },
    compagnons,
  });
}